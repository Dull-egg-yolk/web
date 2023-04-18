<template>
  <div class="step-login-verify">
    <h3 class="login-m-title" v-if="pswReset">{{$t('app.phone_login_forget_password_verification_code_title')}}</h3>
    <h3 class="login-m-title" v-else>{{$t('app.phone_login_enter_verification_code')}}</h3>

    <p class="login-m-intro">
      {{$t('app.phone_login_phone_info', {num: phoneNum})}}
    </p>

    <div class="verify-input">
      <input type="tel" maxlength="6" ref="vcInput" v-model="verifyCode" />
      <div class="code-cell flex-row-vc">
        <span>{{ verifyCode[0] }}</span>
        <span>{{ verifyCode[1] }}</span>
        <span>{{ verifyCode[2] }}</span>
        <span>{{ verifyCode[3] }}</span>
        <span>{{ verifyCode[4] }}</span>
        <span>{{ verifyCode[5] }}</span>
      </div>
    </div>

    <div class="login-m-info fx-be-vc">
      <span class="send-state">
        <span class="txt-gray" v-if="downTime">
          {{$t('app.phone_login_resend_code', {num: downTime})}}
        </span>
        <span class="txt-link hover" @click="resendCode" v-else>{{$t('app.phone_login_resend')}}</span>
      </span>
      <span class="txt-error">{{ verifyError }}</span>
    </div>

    <!-- <div class="login-m-action fx-c">
      <div
        class="m-btn major bk"
        :class="{ disabled: verifyCode.length !== 6 }"
        @click="phoneNext"
      >
        下一步
      </div>
    </div> -->
  </div>
</template>

<script>
import { mapState } from 'vuex';
import { apiSendCode, apiCheckCode } from '@/api/user';
import { logReport } from '@/util/logReport';

export default {
  name: 'StepLoginVerify',
  data () {
    return {
      verifyError: '',
      verifyCode: '',
      downTime: 0,
      sleepTime: 60 * 1000,
      isSended: false,
      timeDownTimer: null,
      failText: {
        200: this.$t('app.phone_login_send_ok'),
        500: 'Internal Server Error',
        25501: this.$t('app.phone_login_error_exp'), // 过期
        25502: this.$t('app.phone_login_error'),
        25503: this.$t('app.phone_login_error_up_limit'),
        25504: this.$t('app.phone_login_error_send_busy'),
        25505: this.$t('app.phone_login_error_opt_busy'),
        25506: this.$t('app.phone_login_error_more')
      },
    };
  },
  props: {
    pswReset: {
      type: Boolean,
      default: false,
    },
    userPhone: {
      type: Object,
      default: () => ({}),
    },
  },
  computed: {
    ...mapState({
      passwordConfig: (state) => state.app.passwordConfig
    }),
    phoneNum () {
      const phone = '+' + this.userPhone.areaCode + ' ' + this.userPhone.phoneNum;
      return phone;
    }
  },
  watch: {
    verifyCode (n) {
      this.verifyCode = this.verifyCode.replace(/[^\d]/g, '');
      if (n.length === 6) {
        this.phoneNext();
      }
    }
  },
  methods: {
    phoneNext () {
      if (!this.verifyCode) return;
      // this.$emit('setStep', 3);
      const params = {
        countryCode: this.userPhone.areaCode,
        phoneNumber: this.userPhone.areaCode + this.userPhone.phoneNum,
        verificationCode: this.verifyCode,
      };
      apiCheckCode(params).then(res => {
        console.log(res, '-------校验验证码-----');

        logReport({
          eventId: this.pswReset ? '106-3-1-12' : '106-3-1-5',
          freeName2: Object.assign({
            resulte: res.code === 200 ? 'success' : 'fail'
          }, window.$mObj.adData || {}),
          free_name1: JSON.stringify({
            adUrl: window.location.search || ''
          })
        });

        if (res.code === 200) {
          this.resetCountdown();
          this.$parent.$parent.$parent.setPhoneLoginInfo(res.data);
          const { userLoginSetPassword, mobileRegisterSetPassword, existent } = this.passwordConfig;
          // const { existent, threePartyId, token, userId } = res.data;
          console.log(userLoginSetPassword, mobileRegisterSetPassword, '------userLoginSetPassword, mobileRegisterSetPassword----');
          // 注册用户设置密码
          if (!existent && mobileRegisterSetPassword) {
            console.log('-----注册用户设置密码-------');
            this.$emit('setStep', 3);
            return;
          }
          // 注册用户不需要设置密码，直接登录
          if (!existent && !mobileRegisterSetPassword) {
            // todo 注册登录接口在开发中
            console.log('----注册用户不需要设置密码，直接登录--');
            this.$emit('login', 'resetPswLogin');
            return;
          }
          // 已注册用户忘记密码
          if (existent && this.pswReset) {
            this.$emit('setStep', 3);
            return;
          }
          // 已注册用户设置密码
          if (existent && userLoginSetPassword) {
            this.$emit('setStep', 3);
          }
        } else {
          const txt = this.failText[res.code];
          if (txt) {
            this.$message({
              desc: { txt }
            }).then(() => {
              this.verifyCode = '';
              this.$refs.vcInput.focus();
            });
          }
        }
      });
    },
    resendCode () {
      logReport({
        eventId: '106-3-1-6',
        freeName2: window.$mObj.adData || {},
        free_name1: JSON.stringify({
          adUrl: window.location.search || ''
        })
      });
      this.sendCode();
    },
    sendCode () {
      // 保存当前发送时间 60s 倒计时
      const now = Date.now();
      const last = localStorage.getItem('sendTime') || 0;
      this.countdown();
      if (now - last > this.sleepTime) {
        console.log('--发送---');
        localStorage.setItem('sendTime', now);
      } else {
        this.$toast({
          html: this.$t('app.phone_login_phone_info', { num: this.phoneNum })
        });
        return;
      }
      if (this.isSended) {
        return;
      }
      this.isSended = true;

      const params = {
        language: this.$i18n.locale,
        countryCode: this.userPhone.areaCode,
        phoneNumber: this.userPhone.areaCode + this.userPhone.phoneNum,
        // sendType: 0
      };
      apiSendCode(params).then(res => {
        console.log(res, '-------发验证码');
        if (res.code === 200) {
          this.verifyCode = '';
          // 发送结果提示
          this.$toast({
            html: this.failText['200'],
          });
        } else {
          const txt = this.failText[res.code];
          if (txt) {
            this.$message({
              desc: { txt }
            });
          }
        }
        this.isSended = false;
      });
    },

    /**
     * 倒计时
     */
    countdown () {
      this.countDownRun();
      this.timeDownTimer = setInterval(() => {
        this.countDownRun();
      }, 1000);
    },

    countDownRun () {
      const now = Date.now();
      const last = localStorage.getItem('sendTime') || 0;
      if (now - last > this.sleepTime) {
        clearInterval(this.timeDownTimer);
        this.downTime = 0;
      } else {
        const time = this.sleepTime - (now - last);
        this.downTime = Math.ceil(time / 1000);
      }
    },

    resetCountdown () {
      this.downTime = 0;
      localStorage.setItem('sendTime', 0);
    }
  },
  mounted () {
    this.sendCode();

    const phone = `${this.userPhone.areaCode}+${this.userPhone.phoneNum.slice(-4)}`;
    logReport({
      eventId: this.pswReset ? '106-3-1-16' : '106-3-1-4',
      freeName2: window.$mObj.adData || {},
      free_name1: JSON.stringify({
        adUrl: window.location.search || '',
        phone
      })
    });

    this.$nextTick(() => {
      this.$refs.vcInput.focus();
    });
  },
  destroyed () {
    clearTimeout(this.timeDownTimer);
    this.timeDownTimer = null;
  },
};
</script>

<style lang="less" scoped>
@import url('~@/style/var.less');

.step-login-verify {
  .verify-input {
    position: relative;
    width: 100%;
    height: 56px;
    overflow: hidden;
    input {
      position: absolute;
      width: 100%;
      height: 100%;
      left: 0;
      top: 0;
      background: transparent;
      z-index: 100;
      transform: scale(2);
      opacity:0
    }
    .code-cell {
      box-sizing: border-box;
      text-align: center;
      justify-content: space-between;
      span {
        flex:1;
        // width: 46px;
        height: 56px;
        line-height: 56px;
        text-align: center;
        color: #fff;
        border:solid 1px rgba(255,255,255,.15);
        margin: 0 6px;
        border-radius: 7px;
        font-size: 28px;
        box-sizing: border-box;
        &:first-child{
          margin-left:0;
        }
        &:last-child{
          margin-right:0;
        }
      }
    }
  }
  .login-m-info{
    .txt-link{
      text-decoration: underline;
    }
  }
}
</style>
