#!/usr/bin/env bash
# Upstream sync rehearsal.
#
# trunk is the only branch allowed to resolve upstream conflicts. This script
# rehearses the merge in a throwaway worktree, so the branch you are actually
# developing on is never touched, never blocked, and never left half-merged.
#
# Branch contract:
#   upstream-main : read-only mirror of upstream/main. Never carries commits.
#   trunk         : upstream + all local customisation. Only place conflicts get resolved.
#   dev           : development line. Never merges upstream/main directly.
#   stable        : release line. Only fast-forwards from trunk.
#
# Usage:
#   scripts/sync_upstream.sh            # rehearse + report, then clean up
#   scripts/sync_upstream.sh --apply    # advance trunk when the merge is conflict-free
#   scripts/sync_upstream.sh --keep     # keep the worktree so you can resolve conflicts
#   scripts/sync_upstream.sh --report   # also write merge_report/sync_YYYY-MM-DD.md
#
# Exit 0 = already up to date, or merged cleanly
# Exit 1 = conflicts (worktree kept for manual resolution)
# Exit 2 = precondition failed (dirty tree, missing remote, worktree in use)

set -uo pipefail

ROOT="$(cd "$(dirname "${BASH_SOURCE[0]}")/.." && pwd)"
cd "${ROOT}" || exit 2

APPLY=0
KEEP=0
REPORT=0
while [ $# -gt 0 ]; do
  case "$1" in
    --apply) APPLY=1 ;;
    --keep) KEEP=1 ;;
    --report) REPORT=1 ;;
    -h|--help) sed -n '2,24p' "${BASH_SOURCE[0]}"; exit 0 ;;
    *) echo "unknown option: $1" >&2; exit 2 ;;
  esac
  shift
done

CONFLICT=0
WT=""
LOG="$(mktemp "${TMPDIR:-/tmp}/qd_sync_merge.XXXXXX")"
REPORT_BODY="$(mktemp "${TMPDIR:-/tmp}/qd_sync_report.XXXXXX")"

cleanup() {
  cd "${ROOT}" 2>/dev/null || true
  if [ "${CONFLICT}" -eq 1 ] && [ "${KEEP}" -eq 1 ] && [ -n "${WT}" ]; then
    printf '\nworktree kept for manual resolution:\n  cd %s\n' "${WT}"
  elif [ -n "${WT}" ] && [ -d "${WT}" ]; then
    git -C "${ROOT}" worktree remove --force "${WT}" >/dev/null 2>&1 || rm -rf "${WT}"
  fi
  rm -f "${LOG}" "${REPORT_BODY}"
}
trap cleanup EXIT

if ! git remote get-url upstream >/dev/null 2>&1; then
  echo "no 'upstream' remote configured" >&2
  exit 2
fi

echo "== fetch upstream =="
git fetch upstream --prune --quiet || { echo "fetch failed" >&2; exit 2; }

# The mirror must stay byte-identical to upstream/main. A rejected non-fast-forward
# here means something committed on upstream-main, which breaks the contract.
if ! git fetch upstream main:upstream-main --quiet 2>/dev/null; then
  echo "upstream-main cannot fast-forward to upstream/main." >&2
  echo "It is a read-only mirror; move any local commits off it first:" >&2
  echo "  git log --oneline upstream/main..upstream-main" >&2
  exit 2
fi
git push origin upstream-main --quiet >/dev/null 2>&1 || true

AHEAD="$(git rev-list --count trunk..upstream/main)"
LOCAL_ONLY="$(git rev-list --count upstream/main..trunk)"

if [ "${AHEAD}" -eq 0 ]; then
  echo "trunk already contains upstream/main; nothing to sync."
  exit 0
fi

UPSTREAM_HEAD="$(git rev-parse --short upstream/main)"
TRUNK_HEAD="$(git rev-parse --short trunk)"

# The two repos have different verification entrypoints; use whichever exists.
if [ -x "${ROOT}/scripts/merge_gate.sh" ]; then
  GATE_HINT="scripts/merge_gate.sh"
else
  GATE_HINT='node --test "tests/unit/*.test.mjs"'
fi

echo "upstream commits to absorb : ${AHEAD}  (upstream/main @ ${UPSTREAM_HEAD})"
echo "local commits on trunk     : ${LOCAL_ONLY}  (trunk @ ${TRUNK_HEAD})"

if [ "${APPLY}" -eq 1 ] && [ -n "$(git status --porcelain)" ]; then
  echo "refusing --apply: working tree is dirty. Commit or stash first." >&2
  exit 2
fi

WT="$(mktemp -d "${TMPDIR:-/tmp}/qd_sync_XXXXXX")"
if ! git worktree add --detach "${WT}" trunk >/dev/null 2>&1; then
  echo "could not create a rehearsal worktree at ${WT}" >&2
  WT=""
  exit 2
fi

echo
echo "== rehearsing merge in a throwaway worktree =="
cd "${WT}" || exit 2

if git merge --no-ff --no-commit upstream/main >"${LOG}" 2>&1; then
  CONFLICT=0
else
  CONFLICT=1
fi

CONFLICT_FILES="$(git diff --name-only --diff-filter=U)"
CONFLICT_COUNT=0
if [ -n "${CONFLICT_FILES}" ]; then
  CONFLICT_COUNT="$(printf '%s\n' "${CONFLICT_FILES}" | wc -l | tr -d ' ')"
fi
STAT_LINE="$(git diff --cached --shortstat 2>/dev/null | sed 's/^ *//')"

{
  echo "# Upstream sync rehearsal ($(date +%Y-%m-%d))"
  echo
  echo "| item | value |"
  echo "|------|-------|"
  echo "| upstream commits to absorb | ${AHEAD} |"
  echo "| local commits on trunk | ${LOCAL_ONLY} |"
  echo "| upstream/main | \`${UPSTREAM_HEAD}\` |"
  echo "| trunk before | \`${TRUNK_HEAD}\` |"
  echo "| merge result | $([ "${CONFLICT}" -eq 0 ] && echo 'clean' || echo "conflicts in ${CONFLICT_COUNT} files") |"
  echo "| changed | ${STAT_LINE:-n/a} |"
  if [ "${CONFLICT}" -eq 1 ]; then
    echo
    echo "## Conflicting files"
    echo
    printf '%s\n' "${CONFLICT_FILES}" | sed 's/^/- `/; s/$/`/'
  fi
} >"${REPORT_BODY}"

if [ "${CONFLICT}" -eq 1 ]; then
  echo "CONFLICTS in ${CONFLICT_COUNT} file(s):"
  printf '%s\n' "${CONFLICT_FILES}" | sed 's/^/  - /'
  echo
  echo "Resolve them against LOCAL_DIVERGENCE.md, then:"
  echo "  git -C ${WT} merge --continue"
  echo "  git -C ${ROOT} branch -f trunk \$(git -C ${WT} rev-parse HEAD)"
  echo "  cd ${ROOT} && ${GATE_HINT}"
  STATUS=1
elif [ "${APPLY}" -eq 1 ]; then
  git commit --quiet -m "Merge upstream/main into trunk" \
    -m "Absorbed ${AHEAD} upstream commits (upstream/main @ ${UPSTREAM_HEAD})." \
    -m "Conflicts were resolved on trunk, not on the development branch."
  NEW="$(git rev-parse HEAD)"
  if git -C "${ROOT}" branch -f trunk "${NEW}"; then
    echo "trunk advanced: ${TRUNK_HEAD} -> $(git rev-parse --short HEAD)"
    echo
    echo "Next:"
    echo "  cd ${ROOT} && git switch trunk && ${GATE_HINT}"
    echo "  cd ${ROOT} && git switch dev && git merge trunk"
  else
    echo "merge committed in the worktree but trunk is checked out elsewhere." >&2
    echo "run: git -C ${ROOT} branch -f trunk ${NEW}" >&2
    STATUS=2
  fi
else
  echo "merge is clean (${STAT_LINE:-no file changes})."
  echo
  echo "To take it:"
  echo "  scripts/sync_upstream.sh --apply"
  STATUS=0
fi

if [ "${REPORT}" -eq 1 ]; then
  mkdir -p "${ROOT}/merge_report"
  DEST="${ROOT}/merge_report/sync_$(date +%Y-%m-%d).md"
  cp "${REPORT_BODY}" "${DEST}"
  echo
  echo "report: ${DEST}"
fi

exit "${STATUS:-0}"
