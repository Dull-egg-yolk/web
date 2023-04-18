<template>
  <div class="step-login-email">

    <h3 class="login-m-title">{{$t('app.sign_in_with_email')}}</h3>
    <p class="login-m-intro">{{$t('app.auth_email_address_hint')}}</p>

    <div class="m-input-box fx-be-vc">
      <div class="input-cell fx-c">
        <input type="text" :placeholder="$t('app.auth_email_address_hint')" v-model="emailAddr" />
      </div>
      <span class="input-action hover" v-show="emailAddr" @click="emailAddr = ''">
        <span class="icon-cross"></span>
      </span>
    </div>

    <div class="login-m-info fx-be-vc" v-if="errTxt">
      <span class="send-state"> </span>
      <span class="txt-error">{{ errTxt }}</span>
    </div>
    <div class="login-m-action fx-c">
      <div
        class="m-btn major bk"
        :class="{ disabled: !emailAddr }"
        @click="emailNext"
        v-preventReClick
      >
        {{$t('app.phone_login_next')}}
      </div>
    </div>
  </div>
</template>

<script>
import { mapState } from 'vuex';
import { apiEmialCheck, apiEmialSendVerify, apiEmailSendUserVerify } from '@/api/user';
import { logReport } from '@/util/logReport';

export default {
  name: 'StepLoginEmail',
  data () {
    return {
      errTxt: '',
      emailAddr: '',
    };
  },
  props: {
    config: {
      type: Object,
      default: () => ({}),
    }
  },
  computed: {
    ...mapState({
      userLocationInfo: (state) => state.app.userLocationInfo
    }),
  },
  watch: {
  },
  methods: {
    checkEmailV () {
      if (!this.emailAddr) return false;
      const pattern = /^[a-zA-Z0-9._-]+@[a-zA-Z0-9_-]+(\.[a-zA-Z0-9_-]+)+$/;
      if (!pattern.test(this.emailAddr)) {
        logReport({
          eventId: '106-1-1-40',
          freeName2: window.$mObj.adData || {},
          free_name1: JSON.stringify({
            adUrl: window.location.search || ''
          }),
          reason: 'email erro'
        });
        // 邮箱地址错误
        this.$toast({
          html: this.$t('app.auth_email_send_err_4')
        });
        return false;
      }

      return true;
    },
    emailNext () {
      if (!this.emailAddr) return false;
      logReport({
        eventId: '106-3-2-2',
        freeName2: window.$mObj.adData || {},
        free_name1: JSON.stringify({
          adUrl: window.location.search || ''
        })
      });

      this.$emit('setConfig', {}, true);
      this.$emit('setConfig', { email: this.emailAddr, resetPW: false });
      if (!this.checkEmailV()) return false;
      apiEmialCheck({
        email: this.emailAddr,
      }).then(({ code, data = {} }) => {
        // 异常
        if (code !== 200) {
          logReport({
            eventId: '106-1-1-40',
            freeName2: window.$mObj.adData || {},
            free_name1: JSON.stringify({
              adUrl: window.location.search || ''
            }),
            reason: code
          });

          this.$toast({
            html: this.$t('app.auth_email_send_err_4')
          });
          return;
        }

        console.log(data, 'email');
        const { status, userId } = data;
        // status 0 未注册邮箱  1 需要验证  4 已有账号登录 5 正式账号设置密码
        this.$emit('setConfig', { status });

        // 全新邮箱
        if (status === 0) {
          // this.$toast({
          //   html: this.$t('webChat.emailRegistrationDisabled')
          // });
          // return;
          this.$emit('setConfig', { register: true });
          this.sendEmailVerfiy();
        }

        // 账号登录
        if (status === 4) {
          this.$emit('setStep', 7);
        }

        // 设置密码
        if (status === 5) {
          this.$emit('setConfig', { userId });
          this.$emit('setStep', 7);
        }

        // 已有账号验证邮箱
        if (status === 1) {
          this.$emit('setConfig', { userId });
          this.sendUserEmailVerfiy(userId);
        }
      });
    },
    sendEmailVerfiy () {
      apiEmialSendVerify({ email: this.emailAddr }).then(({ code, data }) => {
        // code 200 成功  60001 邮箱不存在  60002 有效期内  60003 发送失败
        if (/200|60002/.test(code)) {
          this.$toast({
            html: this.$t('app.account_security_sms_send_success')
          });
          this.$emit('setStep', 6);
        }
      });
    },
    sendUserEmailVerfiy (userId) {
      apiEmailSendUserVerify({
        email: this.emailAddr,
        userId
      }).then((code, data) => {
        this.$toast({
          html: this.$t('app.account_security_sms_send_success')
        });
        this.$emit('setStep', 6);
      });
    }
  },
  async mounted () {
    logReport({
      eventId: '106-3-2-1',
      freeName2: window.$mObj.adData || {},
      free_name1: JSON.stringify({
        adUrl: window.location.search || ''
      })
    });
    this.emailAddr = this.config.email;
    const emailNumber = localStorage.getItem('RC_USER_EMAIL');
    if (emailNumber) {
      this.emailAddr = emailNumber;
    }
  },
};
</script>

<style lang="less" scoped>
@import url('~@/style/var.less');

</style>
