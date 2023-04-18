<template>
  <div class="step-login-email-verify">

    <h3 class="login-m-title" v-if="config.resetPW">{{$t('app.phone_login_forget_password')}}</h3>
    <h3 class="login-m-title" v-else>{{$t('app.auth_email_activity_title')}}</h3>
    <p class="login-m-intro" v-html="$t('app.account_security_bind_email_hint', {str: emailTxt})"></p>

    <div class="login-m-info fx-be-vc" v-if="errTxt">
      <span class="send-state"> </span>
      <span class="txt-error">{{ errTxt }}</span>
    </div>
    <div class="login-m-action flex-col-vc">

      <div
        class="m-btn major bk"
        @click="backAct"
        v-if="config.resetPW"
      >
        {{$t('base.back')}}
      </div>

      <div
        class="m-btn major bk"
        @click="emailNext"
        v-else
      >
        {{$t('base.confirm')}}
      </div>

      <div
        class="m-btn major bk"
        :class="{ disabled: resetTime }"
        @click="resetCode"
      >
        {{$t('app.account_security_bind_resend_ok')}} &nbsp; <span v-show="resetTime"> ({{resetTime}}s)</span>
      </div>
    </div>
  </div>
</template>

<script>
import { mapState } from 'vuex';
import { apiEmialHadVerify, apiEmialSendVerify, apiEmialSendForget, apiEmailSendUserVerify } from '@/api/user';
import { logReport } from '@/util/logReport';

export default {
  name: 'StepLoginEmailVerify',
  data () {
    return {
      errTxt: '',
      emailAddr: '',
      resetTime: 60,
      resetT: null
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
    emailTxt () {
      return `<span class="txt-link">${this.emailAddr}</span>`;
    }
  },
  watch: {
  },
  methods: {
    resetCode () {
      logReport({
        eventId: '106-3-2-12',
        freeName2: window.$mObj.adData || {},
        free_name1: JSON.stringify({
          adUrl: window.location.search || ''
        })
      });

      if (this.resetTime) return;
      const { resetPW, email, status, userId } = this.config;
      const params = {
        email
      };
      let api = resetPW ? apiEmialSendForget : apiEmialSendVerify;

      if (status === 1) {
        api = apiEmailSendUserVerify;
        params.userId = userId;
      }
      api(params).then(({ code, data }) => {
        this.$toast({
          html: this.$t('app.account_security_sms_send_success')
        });
        this.resetTime = 60;
        this.cutDownTime();
      });
    },
    emailNext () {
      logReport({
        eventId: '106-3-2-4',
        freeName2: window.$mObj.adData || {},
        free_name1: JSON.stringify({
          adUrl: window.location.search || ''
        })
      });

      // 邮箱已验证
      apiEmialHadVerify({
        email: this.config.email,
        userId: this.config.userId || null
      }).then(({ code, data }) => {
        // 200已验证 60005 未验证
        if (code === 60005) {
          // 邮箱地址错误
          this.$message({
            desc: {
              txt: this.$t('app.account_security_email_not_check')
            }
          });
          return false;
        }

        if (code === 200) {
          this.$emit('setStep', 7);
        }
      });
    },
    cutDownTime () {
      clearInterval(this.resetT);
      this.resetT = setInterval(() => {
        if (!this.resetTime) {
          clearInterval(this.resetT);
          return;
        }
        this.resetTime -= 1;
      }, 1000);
    },
    backAct () {
      logReport({
        eventId: '106-3-2-11',
        freeName2: window.$mObj.adData || {},
        free_name1: JSON.stringify({
          adUrl: window.location.search || ''
        })
      });

      this.$emit('setConfig', {
        resetPW: false
      });
      this.$emit('setStep', 7);
    },
    forgetV () {
      const { resetPW, email } = this.config;
      console.log(resetPW, email, 'email');

      if (!resetPW) return;

      apiEmialSendForget({
        email
      }).then(res => {
        this.$toast({
          html: this.$t('app.account_security_sms_send_success')
        });
      });
    }
  },
  mounted () {
    const eventId = this.config.resetPW ? '106-3-2-10' : '106-3-2-3';
    logReport({
      eventId: eventId,
      freeName2: window.$mObj.adData || {},
      free_name1: JSON.stringify({
        adUrl: window.location.search || ''
      })
    });

    this.forgetV();
    this.cutDownTime();

    this.emailAddr = this.config.email;
  },
  destroyed () {
    clearInterval(this.resetT);
    this.resetT = null;
  }
};
</script>

<style lang="less" scoped>
@import url('~@/style/var.less');
.step-login-email-verify{
  .login-m-action{
    .m-btn{
      margin-top: 12px;
    }
  }
}
</style>
