<template>
  <div class="step-login-way" :class="{ noRegister: step === 5 }">
    <div class="third-login">
      <!-- facebook -->
      <!-- <div class="btn btn-fb" @click="faceBookLoginHandler" :class="{ loading: !fbLoaded }">
        <span class="ico"></span>{{$t('app.sign_in_facebook')}}
      </div> -->

      <!-- google -->
      <button class="btn btn-google" id="google-login-box" :class="{ loading: !ggLoaded }" @click="googleLoginHandler" v-preventReClick>
        <span class="ico"></span>{{$t('app.sign_in_google')}}
      </button>

      <!-- appale -->
      <button id="sign-in-with-apple-button" class="btn btn-apple" v-preventReClick @click="appleLoginHandler"><span class="ico"></span>{{$t('app.sign_in_apple')}}</button>

      <!-- phone -->
      <button class="btn btn-phone btn-top" id="phone-login-box" @click="setStep(2)" v-preventReClick>
        <span class="ico"></span>{{$t('app.phone_title_text')}}
      </button>

      <!-- email -->
      <button class="btn btn-email" @click="setStep(5)" v-preventReClick>
        <span class="ico"></span>{{$t('app.sign_in_with_email')}}
      </button>

    </div>

  </div>
</template>

<script>
import { insertAppleSdk, insertFacebookSdk, insertGoogleSdk } from '@/util/loginSDK';
import { logReport } from '@/util/logReport';
import { mapState } from 'vuex';
export default {
  name: 'StepLoginWay',
  data () {
    return {
      fbLoaded: false,
    };
  },
  props: {
    step: {
      type: Number,
      default: 1,
    },
    ggLoaded: {
      type: Boolean,
      default: false
    }
  },
  watch: {
  },
  computed: {
    ...mapState({
      showLoginPop: (state) => state.app.showLoginPop,
    }),
  },
  methods: {
    setStep (step) {
      this.$emit('setStep', step);
      if (step === 2) {
        this.$emit('setLoginType', 'phone');
        logReport({
          eventId: '106-1-1-32',
          freeName2: window.$mObj.adData || {},
          free_name1: JSON.stringify({
            adUrl: window.location.search || ''
          })
        });
      }

      // 邮箱登录住
      if (step === 5) {
        this.$emit('setLoginType', 'email');
        logReport({
          eventId: '106-1-1-39',
          freeName2: window.$mObj.adData || {},
          free_name1: JSON.stringify({
            adUrl: window.location.search || ''
          })
        });
      }
    },
    loginHandler (params) {
      this.$emit('login', params);
    },
    googleLoginHandler () {
      if (!this.ggLoaded) return;
      this.$emit('googleLogin');
    },
    appleLoginHandler () {
      logReport({
        eventId: '106-1-1-83'
      });
      this.$emit('appleLogin');
      this.$emit('setLoginType', 'apple');
    },
    faceBookLoginHandler () {
      this.$emit('setLoginType', 'facebook');
      this.$parent.$parent.$parent.resetLoginData();
      logReport({ eventId: '106-1-1-37' });

      window.FB.login((response) => { }, { scope: 'public_profile,user_birthday,user_gender' });
      window.FB.getLoginStatus((response) => {
        console.log(response, 'facebook---');
        if (response.status === 'connected') {
          const accessToken = response.authResponse.accessToken;
          this.loginHandler({
            accessToken: accessToken,
            loginType: 2,
          });
        } else {
          logReport({
            eventId: '106-1-1-38',
            freeName2: {
              reason: response.status
            }
          });
        }
      });
    },
    appleHandler () {
      window.AppleID.auth.init({
        clientId: 'today.GoMeet',
        scope: 'name email',
        redirectURI: window.baseConfig.appleRedirectURI,
        state: '90003'
      });
    }
  },
  mounted () {
    // // 插入三方登录sdk
    // insertFacebookSdk().then(() => {
    //   this.fbLoaded = true;
    // });
  },
  beforeCreate () {
    insertAppleSdk().then((res) => {
      this.appleHandler();
    });
    // facebook sdk 初始化
    // if (!window.fbAsyncInit) {
    //   window.fbAsyncInit = () => {
    //     window.FB.init({
    //       appId: window.baseConfig.facebookClientId,
    //       cookie: true,
    //       xfbml: true,
    //       version: 'v4.0'
    //     });
    //     window.FB.AppEvents.logPageView();
    //   };
    // }
  }
};
</script>

<style lang="less" scoped>
@import url("~@/style/var.less");
// 登录方式选择
.step-login-way {
  display: flex;
  flex-direction: column;
  text-align: center;
  position: relative;

  &.noRegister {
    margin-top: -40px;
    flex-direction: column-reverse;
  }
  button {
    width: 100%;
  }
  .btn-top {
    margin-top: 0 !important;
  }
  .btn {
    height: 48px;
    line-height: 48px;
    border-radius: 100px;
    box-sizing: border-box;
    margin-bottom: 10px;
    position: relative;
    transition: all 0.4s;
    cursor: pointer;
    font-size: 14px;
    &.loading {
      opacity: 0.4;
    }

    &:hover {
      opacity: 0.8;
      box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
    }
    .ico {
      position: absolute;
      left: 20px;
      top: 4px;
      width: 40px;
      height: 40px;
      background: url(~@/assets/img/icon-login-sf.png) 0 0 no-repeat;
      background-size: 40px auto;
    }
    &.btn-fb {
      background: @cblue-4;
      color: #fff;
    }
    &.btn-google {
      background: #fff;
      position: relative;
      margin-top: 20px;
      #google-login-box {
        opacity: 0;
        position: absolute;
      }
      .ico {
        background-position: 0 -40px;
      }
    }

    &.btn-phone,&.btn-email,&.btn-apple {
      background: #fff;
      position: relative;
      color:#0A070F
    }

    &.btn-phone .ico {
      background-position: 0 -80px;
    }

    &.btn-email .ico {
      background-position: 0 -120px;
    }
    &.btn-apple .ico {
      background-position: 0 -160px;
    }
  }
  .use-phone {
    margin: 20px 20px 0;
    border-top: solid 1px @cgray-10;
    position: relative;
    .switch {
      position: absolute;
      z-index: 10;
      width: 40px;
      height: 40px;
      top: -21px;
      left: 50%;
      border-radius: 50%;
      margin-left: -20px;
      cursor: pointer;
      background: #fff;
      transition: all 0.4s;
      text-align: center;
      line-height: 40px;
      color: #b2b2b2;
      transform: rotate(-90deg);
    }

    .txt {
      display: inline-block;
      margin-top: 12px;
      color: #b2b2b2;
      transform: scale(0.85);
      position: relative;
      z-index: 2;
      opacity: 1;
      transition: opacity 0.2s;
    }
    .phone {
      position: absolute;
      z-index: -1;
      text-align: center;
      width: 100%;
      top: 0;
      left: 0;
      opacity: 0;
      transition: all 0.4s;
      .icon-phone {
        display: inline-block;
        width: 50px;
        height: 50px;
        background: #f4f4f6;
        border-radius: 50%;
        font-size: 24px;
        line-height: 50px;
        text-align: center;
      }
    }

    &.extend {
      .switch {
        transform: rotate(90deg);
      }
      .txt {
        opacity: 0;
        z-index: 1;
      }
      .phone {
        opacity: 1;
        z-index: 2;
        transform: translateY(20px);
      }
    }
  }

  .no-register-tips {
    padding: 0 12px 18px;
    font-size: 12px;
    .line {
      border-top: solid 1px #d6d6d6;
      margin: 30px 20px;
      height: 1px;
      span {
        position: relative;
        top: -20px;
        background: #fff;
        display: inline-block;
        padding: 10px;
        font-size: 14px;
      }
    }
  }

  .email-login {
    position: absolute;
    top: -50px;
    width: 100%;
    padding: 50px 0;
    .m-input-box {
      margin-bottom: 10px;
    }
    .login-m-action {
      padding-top: 20px;
    }
  }
}

@media screen and(max-width: 680px) {
  .step-login-way{
    padding-top:80px;
    .btn.btn-fb,.btn.btn-google,.btn.btn-phone{
      margin:10px 0;
    }
  }

  [lang="ar"],
  [lang="he"],
  [lang="ur"] {
    .step-login-way{
      .btn {
        padding-left: 10px;
        .ico {
          left: 15px;
        }
      }
    }
  }
}
</style>
