<template>
  <a-form layout="vertical" class="broker-form">
    <a-form-item :label="$t('brokerAccounts.accountName')">
      <a-input v-model="form.name" :max-length="100" :disabled="disabled" :placeholder="$t('brokerAccounts.accountNameHint')" />
    </a-form-item>
    <a-row :gutter="12">
      <a-col :xs="24" :md="12">
        <a-form-item :label="$t('brokerAccounts.tiger.tigerId')">
          <a-input v-model="form.tigerId" :disabled="disabled" :placeholder="$t('brokerAccounts.tiger.tigerIdPh')" autocomplete="off" />
        </a-form-item>
      </a-col>
      <a-col :xs="24" :md="12">
        <a-form-item :label="$t('brokerAccounts.tiger.accountId')">
          <a-input v-model="form.accountId" :disabled="disabled" :placeholder="$t('brokerAccounts.tiger.accountIdPh')" autocomplete="off" />
        </a-form-item>
      </a-col>
    </a-row>
    <a-row :gutter="12">
      <a-col :xs="24" :md="12">
        <a-form-item :label="$t('brokerAccounts.tiger.environment')">
          <a-radio-group v-model="form.environment" button-style="solid" :disabled="disabled" class="square-radio-group">
            <a-radio-button value="paper">{{ $t('brokerAccounts.tiger.paper') }}</a-radio-button>
            <a-radio-button value="live">{{ $t('brokerAccounts.tiger.live') }}</a-radio-button>
          </a-radio-group>
        </a-form-item>
      </a-col>
      <a-col :xs="24" :md="12">
        <a-form-item :label="$t('brokerAccounts.tiger.licenseOptional')">
          <a-input v-model="form.license" :disabled="disabled" :placeholder="$t('brokerAccounts.tiger.licensePh')" autocomplete="off" />
        </a-form-item>
      </a-col>
    </a-row>
    <a-form-item :label="$t('brokerAccounts.tiger.privateKey')">
      <a-textarea
        v-model="form.privateKey"
        :disabled="disabled"
        :placeholder="$t('brokerAccounts.tiger.privateKeyPh')"
        :auto-size="{ minRows: 5, maxRows: 10 }"
        autocomplete="new-password"
      />
      <div class="field-hint">{{ $t('brokerAccounts.tiger.privateKeyHint') }}</div>
    </a-form-item>
    <div class="form-actions">
      <a-button type="primary" :loading="loading" :disabled="!canSubmit || disabled" @click="submit">
        <a-icon type="link" /> {{ $t('brokerAccounts.connect') }}
      </a-button>
    </div>
  </a-form>
</template>

<script>
export default {
  name: 'TigerConnectForm',
  props: {
    broker: { type: Object, required: true },
    disabled: { type: Boolean, default: false },
    loading: { type: Boolean, default: false }
  },
  data () {
    return {
      form: {
        name: '',
        tigerId: '',
        accountId: '',
        privateKey: '',
        license: '',
        environment: 'paper'
      }
    }
  },
  computed: {
    canSubmit () {
      return !!(this.form.tigerId.trim() && this.form.accountId.trim() && this.form.privateKey.trim())
    }
  },
  methods: {
    submit () {
      if (!this.canSubmit) return
      this.$emit('submit', {
        name: this.form.name.trim(),
        tigerId: this.form.tigerId.trim(),
        accountId: this.form.accountId.trim(),
        privateKey: this.form.privateKey.trim(),
        license: this.form.license.trim(),
        environment: this.form.environment
      })
    }
  }
}
</script>

<style lang="less" scoped>
.broker-form { ::v-deep .ant-form-item-label > label { font-size: 12px; color: #595959; } }
.form-actions { display: flex; justify-content: flex-end; }
.field-hint { margin-top: 6px; color: #8c8c8c; font-size: 12px; line-height: 1.5; }
.square-radio-group ::v-deep .ant-radio-button-wrapper { border-radius: 0 !important; }
</style>
