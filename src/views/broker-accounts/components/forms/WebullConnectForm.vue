<template>
  <a-form layout="vertical" class="broker-form">
    <a-form-item :label="$t('brokerAccounts.accountName')">
      <a-input v-model="form.name" :max-length="100" :disabled="disabled" :placeholder="$t('brokerAccounts.accountNameHint')" />
    </a-form-item>
    <a-row :gutter="12">
      <a-col :xs="24" :md="12">
        <a-form-item :label="$t('brokerAccounts.webull.appKey')">
          <a-input v-model="form.appKey" :disabled="disabled" :placeholder="$t('brokerAccounts.webull.appKeyPh')" autocomplete="off" />
        </a-form-item>
      </a-col>
      <a-col :xs="24" :md="12">
        <a-form-item :label="$t('brokerAccounts.webull.appSecret')">
          <a-input-password v-model="form.appSecret" :disabled="disabled" :placeholder="$t('brokerAccounts.webull.appSecretPh')" autocomplete="new-password" />
        </a-form-item>
      </a-col>
    </a-row>
    <a-row :gutter="12">
      <a-col :xs="24" :md="12">
        <a-form-item :label="$t('brokerAccounts.webull.environment')">
          <a-radio-group v-model="form.environment" button-style="solid" :disabled="disabled" class="square-radio-group">
            <a-radio-button value="sandbox">{{ $t('brokerAccounts.webull.sandbox') }}</a-radio-button>
            <a-radio-button value="live">{{ $t('brokerAccounts.webull.live') }}</a-radio-button>
          </a-radio-group>
        </a-form-item>
      </a-col>
      <a-col :xs="24" :md="12">
        <a-form-item :label="$t('brokerAccounts.brokerAccountOptional')">
          <a-input v-model="form.accountId" :disabled="disabled" :placeholder="$t('brokerAccounts.brokerAccountOptionalPh')" />
        </a-form-item>
      </a-col>
    </a-row>
    <a-form-item :label="$t('brokerAccounts.webull.accessTokenOptional')">
      <a-input-password v-model="form.accessToken" :disabled="disabled" :placeholder="$t('brokerAccounts.webull.accessTokenPh')" autocomplete="new-password" />
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
  name: 'WebullConnectForm',
  props: {
    broker: { type: Object, required: true },
    disabled: { type: Boolean, default: false },
    loading: { type: Boolean, default: false }
  },
  data () {
    return { form: { name: '', appKey: '', appSecret: '', accessToken: '', environment: 'sandbox', accountId: '' } }
  },
  computed: {
    canSubmit () {
      return !!(this.form.appKey.trim() && this.form.appSecret.trim())
    }
  },
  methods: {
    submit () {
      if (!this.canSubmit) return
      this.$emit('submit', {
        name: this.form.name.trim(),
        appKey: this.form.appKey.trim(),
        appSecret: this.form.appSecret.trim(),
        accessToken: this.form.accessToken.trim(),
        environment: this.form.environment,
        accountId: this.form.accountId.trim()
      })
    }
  }
}
</script>

<style lang="less" scoped>
.broker-form { ::v-deep .ant-form-item-label > label { font-size: 12px; color: #595959; } }
.form-actions { display: flex; justify-content: flex-end; }
.square-radio-group ::v-deep .ant-radio-button-wrapper { border-radius: 0 !important; }
</style>
