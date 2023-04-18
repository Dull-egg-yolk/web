<template>
  <base-pop class="pop-login" isBlur :showPop="showLoginPop" v-if="showLoginPop" @cancelPop="cancelPop"
    :outClickCancel="false" :class="{'long': (step!==1 && !loading)}">
    <div class="pop-login-content flex-row-strech" @click="popClickHandler">
      <!-- 登录表单区域 -->
      <div class="login-main">
        <!-- active-number -->
        <div class="logo">
          <div class="img" v-if="step===1"></div>
        </div>
        <div class="active-number"  v-if="step===1">
          <count-to class="num" :startVal="starVal" :endVal="endVal" :duration="duration" @mountedCallback="countCb">
          </count-to>
          <!-- <p class="slogn" :class="{ hide: step !== 1 && !loading }">people are using the LivU</p> -->
          <p class="slogn">{{$t('webChat.peopleUsing')}}</p>
          <p class="free-coins-tips" v-if="showLoginBannerTips" v-html="loginCoinsTips"></p>
        </div>

        <!-- 回退按钮 -->
        <transition name="fade">
          <span class="step-back icon-arrow hover" v-show="step !== 1 && step !== 0" @click="stepBack"></span>
        </transition>
        <!-- 返回按钮 -->
        <transition name="fade">
          <span class="user-icon icon-cross" @click="closeBtn"></span>
        </transition>

        <!-- 登录的step 步骤 -->
        <transition-group class="login-step" name="stepAni" tag="div">
          <!-- 登录方式选择 facebook google 手机登录 -->
          <div class="ol-step step-1" v-if="step === 1" key="step1">
            <div class="livcam-popUp" v-if="registerBannerInfo.show">
              <div class="livcam-popbanner">
                <img :src="registerBannerInfo.img"/>
                <div class="title-box">
                  <div class="title">{{$t('webChat.signCoinsTips', {coin: registerBannerInfo.gold })}}</div>
                  <div class="title">{{$t('webChat.signCoinsTips1', {coin: registerBannerInfo.gold, num: registerBannerInfo.callCount })}}</div>
                </div>
              </div>
            </div>
            <step-login-way @setStep="setStep" @setLoginType="setLoginType" @login="loginHandler" @googleLogin="googleLoginHandler" @appleLogin="appleLoginHandler" :step="step" :ggLoaded="ggLoaded"></step-login-way>
          </div>
          <!-- 输入手机号 -->
          <div class="ol-step step-2" v-if="step === 2" key="step2">
            <step-login-phone :pswReset="pswReset" :userPhone="userPhone" @setIsNewPhone="setIsNewPhone" @setStep="setStep" @setPhoneNum="setPhoneNum"
              ref="loginPhone"></step-login-phone>
          </div>
          <!-- 输入密码 -->
          <div class="ol-step step-3" v-if="step === 3" key="step3">
            <step-login-password :isNewPhone="isNewPhone" :pswReset="pswReset" @setStep="setStep" @login="loginHandler" @setPswRest="
              () => {
                pswReset = true;
              }
            " :userPhone="userPhone"></step-login-password>
          </div>

          <!-- 输入验证码 -->
          <div class="ol-step step-4" v-if="step === 4" key="step4">
            <step-login-verify :pswReset="pswReset" :userPhone="userPhone"  @login="loginHandler" @setStep="setStep"></step-login-verify>
          </div>

          <!-- 邮箱登录 -->
          <div class="ol-step step-5" v-if="step === 5" key="step5">
            <step-login-email @setStep="setStep" :config="emailConfig" @setConfig="setEmailConfig"></step-login-email>
          </div>

          <!-- 邮箱验证 -->
          <div class="ol-step step-6" v-if="step === 6" key="step6">
            <step-login-email-verify @setStep="setStep" :config="emailConfig" @setConfig="setEmailConfig"></step-login-email-verify>
          </div>

          <!-- 邮箱密码 -->
          <div class="ol-step step-6" v-if="step === 7" key="step7">
            <step-login-email-password @setStep="setStep" :config="emailConfig" @login="loginSuccess" @setConfig="setEmailConfig"></step-login-email-password>
          </div>

        </transition-group>

        <!-- 登录loading状态 -->
        <div class="login-loading" v-if="loading">
          <div class="img"></div>
          <div class="txt">{{$t('webChat.connecting')}}</div>
        </div>

        <!-- 使用条款 -->
        <div class="use-terms" v-if="step === 1">
            <div>
              <privacy></privacy>
          </div>
        </div>

        <!-- 快速三方登录  -->
        <div class="quick-login-box" v-if="step!==1 && !loading">
          <div class="tips">
            <span>{{$t('app.account_other_login_options')}}</span>
          </div>
          <div class="items fx-c">
            <div class="obtn google hover" id="quick-google-btn" @click="quickGoogle"></div>
          </div>
        </div>
      </div>

      <!-- 信息展示 -->
      <!-- <div class="logo-info fx-c">
        <div class="video">
          <video :src="videoData" v-if="!isMobile" autoplay loop playsinline webkit-playsinline></video>
        </div>
        <div class="logo">
          <div class="img"></div>
        </div>
      </div> -->
    </div>

    <pop-supply-info :loginType="loginType" :show="showSupply" v-if="showSupply" @cancel="supplyInfoSub" :tnickname="nickname"
      :tgender="gender" :tbirthday="birthday" @cancelClick="cancelClick" ref="supplyPop"></pop-supply-info>
  </base-pop>
</template>

<script>
import MD5 from 'crypto-js/md5';
import { mapState } from 'vuex';
import countTo from 'vue-count-to';
import BasePop from '../BasePop.vue';
import StepLoginWay from './step-login-way.vue';
import StepLoginPhone from './step-login-phone.vue';
import StepLoginPassword from './step-login-password.vue';
import StepLoginVerify from './step-login-verify.vue';
import { logReport } from '@/util/logReport';

import { userLogin, userInfoSupply, apiPhoneLogin, apiUpdateMobilePassword, apiMobilePasswordLogin, apiEmialRegister, apiEmialNewSetPassword } from '@/api/user';
import { formatTime, getParams } from '@/util/index';
import PopSupplyInfo from '@/components/PopFiles/PopSupplyInfo.vue';

import StepLoginEmail from './step-login-email.vue';
import StepLoginEmailVerify from './step-login-email-verify.vue';
import StepLoginEmailPassword from './step-login-email-password.vue';

export default {
  name: 'PopLogin',
  data () {
    return {
      step: 1,
      loading: false,
      userPhone: {
        areaCode: '',
        phoneNum: ''
      },
      phoneLoginInfo: {},
      pswReset: false,
      authToken: '',
      showSupply: false,
      nickname: '',
      gender: 0,
      birthday: '',
      // count to 组件相关
      starVal: 0,
      endVal: 0,
      duration: 500,
      countTimer: null,
      isMobile: window.innerWidth <= 680,
      loginType: 'google',

      failText: {
        200: this.$t('app.phone_login_send_ok'),
        500: 'Internal Server Error',
        25501: this.$t('app.phone_login_error_exp'), // 过期
        25502: this.$t('app.phone_login_error'),
        25503: this.$t('app.phone_login_error_up_limit'),
        25504: this.$t('app.phone_login_error_send_busy'),
        25505: this.$t('app.phone_login_error_opt_busy'),
        25506: this.$t('app.phone_login_error_more'),
        35501: this.$t('app.phone_login_error_password'),
        35502: this.$t('app.update_user_info_failed'),
        35503: this.$t('app.phone_login_user_reset_password_timeout'),
        35504: this.$t('app.update_user_info_failed'),
        35505: this.$t('app.phone_login_error_password_wrong_too_many'),
        35506: this.$t('app.phone_login_error_opt_busy'),
      },

      isNewPhone: true,
      emailConfig: {},
      ggLoaded: false,
      googleClient: null
    };
  },
  components: {
    BasePop,
    countTo,
    StepLoginWay,
    StepLoginPhone,
    StepLoginPassword,
    StepLoginVerify,
    PopSupplyInfo,
    StepLoginEmail,
    StepLoginEmailVerify,
    StepLoginEmailPassword
  },
  props: {},
  computed: {
    ...mapState({
      showLoginPop: (state) => state.app.showLoginPop,
      loginPopFrom: (state) => state.app.loginPopFrom,
      passwordConfig: (state) => state.app.passwordConfig,
      showLoginBannerTips: (state) => state.app.showLoginBannerTips,
      googleLoaded: (state) => state.app.googleLoaded,
      registerBannerInfo: (state) => state.app.registerBannerInfo,
    }),
    videoData () {
      return require('@/assets/img/tumile/login-video.mp4');
    },

    loginCoinsTips () {
      return this.$t('webChat.loginCoinsTips', { icon: '<i class="free-icon-coins"></i>' });
    }
  },
  watch: {
    showLoginPop (n, o) {
      if (!n) {
        localStorage.setItem('RC_COUNT_NUM', this.endVal);
        this.$store.commit('setLoginPopFrom', '');
        clearTimeout(this.countTimer);
        this.resetLoginData();
      } else {
        // 登录框曝光上报
        logReport({
          eventId: '106-1-1-15',
          free_name2: {
            media_source: localStorage.getItem('mediasource'),
            campaign_id: localStorage.getItem('campaignid'),
            adgroup_id: localStorage.getItem('adgroupid'),
            keyword: localStorage.getItem('keyword'),
            creative: localStorage.getItem('creative'),
            loc_physical_ms: localStorage.getItem('loc_physical_ms'),
            device: localStorage.getItem('device'),
            type: localStorage.getItem('type'),
            utmsource: localStorage.getItem('utmsource'),
            utmcampaign: localStorage.getItem('utmcampaign'),
            utmterm: localStorage.getItem('utmterm'),
            utmcontent: localStorage.getItem('utmcontent'),
            bannerid: localStorage.getItem('bannerid'),
            from: this.loginPopFrom
          },
          free_name1: JSON.stringify({
            adUrl: window.location.search || ''
          })
        });
      }
    },
    step (n, o) {
      clearTimeout(this.countTimer);
      if (o && n === 1) {
        this.countCb();
      }
    },
    googleLoaded (n) {
      if (n) {
        this.initGoogleFunc();
      }
    }
  },
  methods: {
    setIsNewPhone (v) {
      this.isNewPhone = v;
    },
    setLoginType (type) {
      this.loginType = type;
    },
    countCb () {
      clearTimeout(this.countTimer);
      // 计数器
      if (this.countTimer === null) {
        this.starVal = 0;
        this.endVal = +localStorage.getItem('RC_COUNT_NUM') || 122987212;
      } else {
        this.duration = 1000;
        this.starVal = this.endVal;
        this.endVal = this.starVal + Math.floor(Math.random() * 10 + 1);
      }

      this.countTimer = setTimeout(() => {
        this.countCb();
      }, this.duration);
    },
    stepBack () {
      if (this.pswReset) {
        if (this.step === 2) {
          this.pswReset = false;
          this.step = 3;
          return;
        }
        this.step = 2;
      } else {
        // 邮箱注册回退逻辑
        if (this.loginType === 'email') {
          if (this.step === 5) {
            this.step = 1;
            this.emailConfig = {};
            return;
          }

          if (this.emailConfig.resetPW) {
            if (this.step === 6) {
              this.step = 7;
              this.emailConfig.resetPW = false;
            }
          } else {
            if (this.step === 7) {
              this.step = 5;
              return;
            }
            this.step -= 1;
          }
          return;
        }

        if (this.step === 5) {
          this.step = 1;
          return;
        }
        if (this.step === 4) {
          this.step = 2;
          return;
        }
        if (this.step > 1) {
          this.step -= 1;
        }
      }
    },
    setStep (step) {
      this.step = step;
    },
    setPhoneNum (data = {}) {
      this.userPhone = data;
    },
    // 手机登录临时存的信息
    setPhoneLoginInfo (data = {}) {
      console.log('--手机登录临时存的信息----', data);
      this.phoneLoginInfo = { ...this.phoneLoginInfo, ...data };
    },
    setTempPassword (val) {
      console.log('------保存密码----', val);
      this.phoneLoginInfo.tempPassword = val;
    },
    // 注册用户显示补全信息
    toShowSupply () {
      logReport({
        eventId: '106-1-1-23',
        freeName2: {
          from: this.loginType
        }
      });
      this.showSupply = true;
    },
    cancelPop () {
      this.$store.commit('setShowLoginPop', false);
      this.$router.go(-1);
    },
    closeBtn () {
      if (localStorage.getItem('LANDINGSPAGE')) {
        this.$store.commit('setShowLoginPop', false);
        this.$router.push({ name: 'LivCam' });
      } else {
        this.cancelPop();
      }
    },
    popClickHandler () {
      if (this.$refs.loginPhone) {
        this.$refs.loginPhone.showAreaBox = false;
      }
    },
    cancelClick () {
      logReport({
        eventId: '106-1-1-53',
        freeName2: window.$mObj.adData || {},
        from: this.loginType
      });
      this.showSupply = false;
      this.loading = false;
      this.step = 1;
    },
    phoneLoginWithPassword () {
      const password = MD5(this.phoneLoginInfo.tempPassword).toString().toUpperCase();
      const params = {
        mobileNo: this.userPhone.areaCode + this.userPhone.phoneNum,
        countryCode: this.userPhone.areaCode,
        password
      };
      apiMobilePasswordLogin(params).then(res => {
        console.log(res, '------手机登录结果-----');
        // this.afterLogin(res);
        const { code, data } = res;
        if (code === 200) {
          this.phoneLoginSupplyInfo(data);
        } else {
          // 登陆失败
          logReport({
            eventId: '106-1-1-21',
            free_name2: {
              reason: res.code,
              from: this.loginType
            }
          });
          const txt = this.failText[res.code];
          if (txt) {
            this.$message({
              desc: { txt }
            });
          }
          this.loading = false;
        }
      }).catch(e => {
        this.loading = false;
        this.step = 1;
        this.$message({
          desc: {
            txt: this.$t('app.update_user_info_failed') // todo'登录失败 请重试'
          }
        });
        // 登陆失败
        logReport({
          eventId: '106-1-1-21',
          free_name2: {
            reason: 'network error 500',
            from: this.loginType
          }
        });
        console.log(e, '---------手机登录失败');
      });
    },
    loginHandler (params) {
      // 手机忘记密码登录,重置密码登录
      if (params === 'resetPswLogin') {
        const resetPswLogin = {
          threePartyId: this.phoneLoginInfo.threePartyId
        };
        this.phoneLoginSupplyInfo(resetPswLogin);
        return;
      }
      // todo 手机密码直接登录
      const { existent, userSetPassword } = this.passwordConfig;
      if (existent & userSetPassword) {
        this.phoneLoginWithPassword();
        return;
      }

      this.loading = true;
      this.step = 0;
      userLogin(params).then(res => {
        console.log(res, 'login----dasdfsad');

        const { code, data } = res;
        console.log(data, 'register........');

        if (data && data.register) {
          this.afterRegisterSuccess();
          window.gtag && window.gtag('event', 'gomeet_register', { send_to: ['AW-834247273/TQgKCNy00YIYEOm05o0D', 'livu'] });
          window.fbq('track', 'CompleteRegistration');
          // 高级匹配
          window.ttq.identify({
            email: localStorage.getItem('RC_USER_EMAIL') || '',
            phone: localStorage.getItem('RC_USER_PHONE') || ''
          });
          window.ttq.track('CompleteRegistration', { description: 'register' });
          logReport({
            eventId: '106-1-1-22',
            free_name2: {
              media_source: localStorage.getItem('mediasource'),
              campaign_id: localStorage.getItem('campaignid'),
              adgroup_id: localStorage.getItem('adgroupid'),
              keyword: localStorage.getItem('keyword'),
              creative: localStorage.getItem('creative'),
              loc_physical_ms: localStorage.getItem('loc_physical_ms'),
              device: localStorage.getItem('device'),
              type: localStorage.getItem('type'),
              utm_source: localStorage.getItem('utmsource'),
              utm_campaign: localStorage.getItem('utmcampaign'),
              utm_term: localStorage.getItem('utmterm'),
              utm_content: localStorage.getItem('utmcontent'),
              bannerid: localStorage.getItem('bannerid'),
              from: this.loginType
            },
            free_name1: JSON.stringify({
              adUrl: window.location.search || ''
            })
          });
        }
        // 信息补全
        if (code === 10042) {
          if (this.loginType === 'apple') {
            this.$store.commit('setShowLoginPop', true);
          }
          const { complementInfoKey, gender, nickname, birthday } = data;
          this.nickname = nickname;
          this.gender = gender;
          if (birthday) {
            this.birthday = new Date(birthday).getTime();
          }
          this.authToken = complementInfoKey;
          this.showSupply = true;

          // 补全信息曝光上报
          logReport({
            eventId: '106-1-1-23',
            freeName2: {
              from: this.loginType
            }
          });
          return false;
        }

        // 登录异常 合作女限制
        if (code === 10101) {
          this.$message({
            desc: {
              txt: res.message // '合作女不能登录'
            }
          });
          this.loading = false;
          this.step = 1;
          return;
        }
        // 设备封禁
        if (code === 10116) {
          const txt = this.$t('app.account_device_forbid_account_allow');//  '设备封禁'
          this.$message({
            desc: {
              txt: txt// '提交失败 请重试'
            }
          });
          logReport({
            eventId: '106-1-1-66',
            free_name2: {
              from: this.loginType
            },
          });
          this.loading = false;
          this.step = 1;
          return false;
        }

        if (!data.register && res.code !== 200) {
          // 登陆失败
          logReport({
            eventId: '106-1-1-21',
            free_name2: {
              reason: res.code,
              from: this.loginType
            }
          });
        }

        // 登录成功
        this.loginSuccess(data);
      }).catch(e => {
        this.loading = false;
        this.step = 1;
        this.$message({
          desc: {
            txt: this.$t('app.update_user_info_failed') // todo'登录失败 请重试'
          }
        });
        // 登陆失败
        logReport({
          eventId: '106-1-1-21',
          free_name2: {
            reason: 'network error 500',
            from: this.loginType
          }
        });
        console.log(e, 'login----error');
      });
    },
    phoneLoginSupplyInfo (params, isRegist) {
      // 信息补全提交
      const info = this.phoneLoginInfo;
      const data = {
        threePartyId: info.threePartyId || params.threePartyId,
        type: 6, // 手机号
        deviceType: '4',
        deviceName: 'web',
        languageId: 1,
        languageName: 'en',
      };
      if (params.nickname) {
        data.userName = params.nickname;
        data.gender = params.gender;
        data.birthday = formatTime(params.birthday, 'YYYY-MM-DD');
      }
      apiPhoneLogin(data).then(res => {
        console.log('---手机号登录----res-----', res);
        const { code, data } = res;
        // 年龄小于18
        if (code === 10025) {
          const txt = this.$t('app.update_user_info_failed');//  '登录失败, 请重试'
          this.$refs.supplyPop.setErrorTxt(txt);
          return false;
        }
        if (code === 20101) {
          // 补全信息失败上报
          logReport({
            eventId: '106-1-1-26',
            free_name2: {
              error: 'nickname err',
              from: this.loginType
            },
          });
          this.$refs.supplyPop.setErrorTxt(this.$t('webChat.nicknamesSensitive'));
          return false;
        }
        if (code === 10116) {
          const txt = this.$t('app.account_device_forbid_account_allow');//  '设备封禁'
          this.$message({
            desc: {
              txt: txt// '提交失败 请重试'
            }
          });
          logReport({
            eventId: '106-1-1-66',
            free_name2: {
              from: this.loginType
            },
          });
          return false;
        }

        if (isRegist) {
          logReport({
            eventId: '106-1-1-25',
            free_name2: {
              nickname: params.nickname,
              gender: params.gender,
              birthday: formatTime(params.birthday, 'YYYY-MM-DD'),
              from: this.loginType
            }
          });
        }

        this.showSupply = false;
        if (data.register) {
          this.afterRegisterSuccess();
          window.gtag && window.gtag('event', 'gomeet_register', { send_to: ['AW-834247273/TQgKCNy00YIYEOm05o0D', 'livu'] });
          window.fbq('track', 'CompleteRegistration');
          // 高级匹配
          window.ttq.identify({
            email: localStorage.getItem('RC_USER_EMAIL') || '',
            phone: localStorage.getItem('RC_USER_PHONE') || ''
          });
          window.ttq.track('CompleteRegistration', { description: 'register' });
          logReport({
            eventId: '106-1-1-22',
            free_name2: {
              media_source: localStorage.getItem('mediasource'),
              campaign_id: localStorage.getItem('campaignid'),
              adgroup_id: localStorage.getItem('adgroupid'),
              keyword: localStorage.getItem('keyword'),
              creative: localStorage.getItem('creative'),
              loc_physical_ms: localStorage.getItem('loc_physical_ms'),
              device: localStorage.getItem('device'),
              type: localStorage.getItem('type'),
              utm_source: localStorage.getItem('utmsource'),
              utm_campaign: localStorage.getItem('utmcampaign'),
              utm_term: localStorage.getItem('utmterm'),
              utm_content: localStorage.getItem('utmcontent'),
              bannerid: localStorage.getItem('bannerid'),
              from: this.loginType
            },
            free_name1: JSON.stringify({
              adUrl: window.location.search || ''
            })
          });
        }
        // 登录成功
        this.setMobilePassword(data);
        this.loginSuccess(data);
      }).catch(e => {
        this.$message({
          desc: {
            txt: this.$t('app.update_user_info_failed')// '提交失败 请重试'
          }
        });
        console.log(e, 'login----error');
        // 补全信息失败上报
        logReport({
          eventId: '106-1-1-26',
          free_name2: {
            reason: 'newwork err',
            from: this.loginType
          },
        });
      });
    },
    // 注册设置密码
    setMobilePassword (data) {
      try {
        // todo
        console.log(this.phoneLoginInfo, '-----this.phoneLoginInfo------');
        if (!this.phoneLoginInfo.tempPassword) {
          console.log('----密码为空---');
          return;
        };
        const password = MD5(this.phoneLoginInfo.tempPassword).toString().toUpperCase();
        const params = {
          deviceId: data.deviceId,
          loginToken: data.loginToken,
          userId: data.id,
          countryCode: this.userPhone.areaCode,
          mobileNo: this.userPhone.areaCode + this.userPhone.phoneNum,
          password,
        // platformType: 0,
        // version: 'string'
        };
        localStorage.setItem('RC_USER_PHONE', this.userPhone.phoneNum);
        apiUpdateMobilePassword(params).then(res => {
          console.log('---自动设置密码----', res);
        });
      } catch (error) {
        console.log(error, '------====error==========');
      }
    },
    supplyInfoSub (params) {
      console.log(params, 'ddd--d-d-d-d-');
      const { email, password } = this.emailConfig;
      // 邮箱注册
      if (email) {
        console.log(params);
        this.emailRegister(params);
        return;
      }
      // 手机注册补全信息

      const { existent, userSetPassword, mobileRegisterSetPassword } = this.passwordConfig;
      if (this.phoneLoginInfo.tempPassword || mobileRegisterSetPassword === 1) {
        this.phoneLoginSupplyInfo(params, true);
        return;
      }
      // 信息补全提交
      userInfoSupply({
        complementInfoKey: this.authToken,
        nickname: params.nickname,
        gender: params.gender,
        birthday: formatTime(params.birthday, 'YYYY-MM-DD'),
      }).then(res => {
        const { code, data } = res;
        // 年龄小于18
        if (code === 10025) {
          const txt = this.$t('app.update_user_info_failed');//  '登录失败, 请重试'
          this.$refs.supplyPop.setErrorTxt(txt);
          return false;
        }
        if (code === 20101) {
          // 补全信息失败上报
          logReport({
            eventId: '106-1-1-26',
            free_name2: {
              error: 'nickname err',
              from: this.loginType
            },
          });
          this.$refs.supplyPop.setErrorTxt(this.$t('webChat.nicknamesSensitive'));
          return false;
        }

        // 补全信息成功上报
        logReport({
          eventId: '106-1-1-25',
          free_name2: {
            nickname: params.nickname,
            gender: params.gender,
            birthday: formatTime(params.birthday, 'YYYY-MM-DD'),
            from: this.loginType
          }
        });
        this.showSupply = false;
        if (data.register) {
          this.afterRegisterSuccess();
          window.gtag && window.gtag('event', 'gomeet_register', { send_to: ['AW-834247273/TQgKCNy00YIYEOm05o0D', 'livu'] });
          window.fbq('track', 'CompleteRegistration');
          // 高级匹配
          window.ttq.identify({
            email: localStorage.getItem('RC_USER_EMAIL') || '',
            phone: localStorage.getItem('RC_USER_PHONE') || ''
          });
          window.ttq.track('CompleteRegistration', { description: 'register' });
          logReport({
            eventId: '106-1-1-22',
            free_name2: {
              media_source: localStorage.getItem('mediasource'),
              campaign_id: localStorage.getItem('campaignid'),
              adgroup_id: localStorage.getItem('adgroupid'),
              keyword: localStorage.getItem('keyword'),
              creative: localStorage.getItem('creative'),
              loc_physical_ms: localStorage.getItem('loc_physical_ms'),
              device: localStorage.getItem('device'),
              type: localStorage.getItem('type'),
              utm_source: localStorage.getItem('utmsource'),
              utm_campaign: localStorage.getItem('utmcampaign'),
              utm_term: localStorage.getItem('utmterm'),
              utm_content: localStorage.getItem('utmcontent'),
              bannerid: localStorage.getItem('bannerid'),
              from: this.loginType
            },
            free_name1: JSON.stringify({
              adUrl: window.location.search || ''
            })
          });
        }
        // 登录成功
        this.loginSuccess(data);
      }).catch(e => {
        this.$message({
          desc: {
            txt: this.$t('app.update_user_info_failed')// '提交失败 请重试'
          }
        });
        console.log(e.response, 'login----error');
        // 补全信息失败上报
        logReport({
          eventId: '106-1-1-26',
          free_name2: {
            reason: 'newwork err',
            from: this.loginType
          },
        });
      });
    },
    // 邮箱注册
    emailRegister (params) {
      const { nickname, birthday, gender } = params;
      apiEmialRegister({
        threePartyEmail: this.emailConfig.email,
        userName: nickname,
        gender: gender,
        birthday: formatTime(birthday, 'YYYY-MM-DD'),
        countryId: +localStorage.getItem('RC_USER_COUNTRY')
      }).then(({ code, data }) => {
        if (code !== 200) {
          // 登陆失败
          logReport({
            eventId: '106-1-1-21',
            free_name2: {
              reason: code,
              from: this.loginType
            }
          });
        };

        // 补全信息成功上报
        logReport({
          eventId: '106-1-1-25',
          free_name2: {
            nickname: nickname,
            gender: gender,
            birthday: formatTime(birthday, 'YYYY-MM-DD'),
            from: this.loginType
          }
        });

        // 登录成功
        data.register = true;
        this.loginSuccess(data);

        this.afterRegisterSuccess();
        window.gtag && window.gtag('event', 'gomeet_register', { send_to: ['AW-834247273/TQgKCNy00YIYEOm05o0D', 'livu'] });
        window.fbq('track', 'CompleteRegistration');
        // 高级匹配
        window.ttq.identify({
          email: localStorage.getItem('RC_USER_EMAIL') || '',
          phone: localStorage.getItem('RC_USER_PHONE') || ''
        });
        window.ttq.track('CompleteRegistration', { description: 'register' });
        logReport({
          eventId: '106-1-1-22',
          free_name2: {
            media_source: localStorage.getItem('mediasource'),
            campaign_id: localStorage.getItem('campaignid'),
            adgroup_id: localStorage.getItem('adgroupid'),
            keyword: localStorage.getItem('keyword'),
            creative: localStorage.getItem('creative'),
            loc_physical_ms: localStorage.getItem('loc_physical_ms'),
            device: localStorage.getItem('device'),
            type: localStorage.getItem('type'),
            utm_source: localStorage.getItem('utmsource'),
            utm_campaign: localStorage.getItem('utmcampaign'),
            utm_term: localStorage.getItem('utmterm'),
            utm_content: localStorage.getItem('utmcontent'),
            bannerid: localStorage.getItem('bannerid'),
            from: this.loginType
          },
          free_name1: JSON.stringify({
            adUrl: window.location.search || ''
          })
        });

        const params = {
          userId: data.id,
          password: this.emailConfig.password,
          email: this.emailConfig.email
        };
        console.log(data, params, 'email');

        apiEmialNewSetPassword(params).then(res => {
          console.log(res, 'email');
        });
      });
    },
    setEmailConfig (obj, clear) {
      if (clear) {
        this.emailConfig = {};
      }
      this.emailConfig = Object.assign({}, this.emailConfig, obj);
    },
    loginSuccess (data) {
      console.log(data, '--------111111111');
      localStorage.setItem('RC_USER_COUNTRY', data.countryId || localStorage.getItem('loc_physical_ms'));
      window.gtag && window.gtag('event', 'gomeet_signup', { send_to: ['AW-834247273/TQgKCNy00YIYEOm05o0D', 'livu'] });
      window.fbq('trackCustom', 'GomeetSignup');
      // 高级匹配
      window.ttq.identify({
        email: localStorage.getItem('RC_USER_EMAIL') || '',
        phone: localStorage.getItem('RC_USER_PHONE') || ''
      });
      // window.ttq.track('Subscribe');
      window.ttq.track('CompleteRegistration', { description: 'login' });
      // 登陆成功
      logReport({
        eventId: '106-1-1-20',
        free_name2: Object.assign({
          from: this.loginType
        }, window.$mObj.adData || {}),
        free_name1: JSON.stringify({
          adUrl: window.location.search || ''
        })
      });

      // 注册用户记录本地
      if (data.register) {
        localStorage.setItem('RC_LOGIN_REGISTER', 1);
      }

      this.setLoginTimes(data);
      this.getLocation();
      window.$api && (window.$api.defaults.headers.Authorization = data.loginToken);
      this.$store.commit('setUserInfo', data);
      import('@/util/db').then(v => v);
      this.$store.commit('setWebPush', true);
      this.$parent.getActivityEntry();
      this.$parent.getLocationEntry();
      this.$parent.getBackpackEntry();
      // this.cancelPop();
      if (this.loginType !== 'apple') {
        this.$router.push({ path: '/' + window.$mObj.adData.url });
      } else {
        this.$router.push({ path: '' + sessionStorage.getItem('url') });
      }
      this.$store.commit('setShowLoginPop', false);
    },
    // 设置当前用户登录次数
    setLoginTimes (user) {
      const key = 'RC_LOGIN_TIMES';
      const loginInfo = localStorage.getItem(key);
      const obj = loginInfo ? JSON.parse(loginInfo) : {};

      const userId = user.id;
      const times = obj[userId] || 0;
      obj[userId] = times + 1;
      localStorage.setItem(key, JSON.stringify(obj));
    },
    getLocation () {
      // navigator.geolocation.getCurrentPosition(function (res) {
      //   console.log(res, 'location');
      // }, function (err) {
      //   console.log(err, 'location');
      // });
    },
    resetLoginData () {
      console.log('------重置登录数据----');
      this.phoneLoginInfo = {};
      this.$store.commit('resetPasswordConfig');
      this.step = 1;
      this.pswReset = false;
    },
    afterRegisterSuccess () {
      console.log('----注册成功调用----');
      this.$store.dispatch('checkCoinForNew');
      sessionStorage.setItem('currIsRegister', true);
    },
    // 初始化google
    initGoogleFunc () {
      if (window.google && window.google.accounts) {
        this.ggLoaded = true;
        this.googleClient = window.google.accounts.oauth2.initTokenClient({
          client_id: window.baseConfig.googleClientId,
          scope: 'https://www.googleapis.com/auth/user.gender.read https://www.googleapis.com/auth/user.birthday.read https://www.googleapis.com/auth/userinfo.profile https://www.googleapis.com/auth/userinfo.email',
          // ux_mode: 'popup',
          callback: (data) => {
            console.log(data, 'google');
            this.googleCB(data);
          },
          error_callback: (e) => {
            logReport({
              eventId: '106-1-1-99',
              freeName2: {
                reason: e.type
              }
            });
          }
        });
      }
    },
    // 登录谷歌登录
    googleLoginHandler () {
      this.googleClient.requestAccessToken();
      this.setLoginType('google');
      this.resetLoginData();
      logReport({ eventId: '106-1-1-19' });
    },
    async appleLoginHandler () {
      try {
        const data = await window.AppleID.auth.signIn();
        return data;
      } catch (error) {
        // Handle error.
      }
      this.setLoginType('apple');
    },
    quickGoogle () {
      if (!this.ggLoaded) return;
      this.googleClient.requestAccessToken();
      logReport({
        eventId: '106-1-1-19',
        freeName2: {
          from: this.loginType + '-quick'
        }
      });
    },
    googleCB (data) {
      if (!data.access_token) {
        this.$message({
          desc: {
            txt: this.$t('webChat.ggLoginTip') // todo'登录失败 请重试'
          }
        });

        logReport({
          eventId: '106-1-1-99',
          freeName2: {
            reason: 'no token'
          }
        });

        return;
      }
      this.loginHandler({
        accessToken: data.access_token,
        loginType: window.baseConfig.googleLoginType,
      });
    },
  },
  mounted () {
    this.initGoogleFunc();
    const appleUrl = getParams('appleAuthCode');
    if (appleUrl === 'null') {
      logReport({
        eventId: '106-1-1-84',
        freeName2: {
          reason: 'null'
        }
      });
    }
    if (getParams('mediasource') || getParams('utm_source')) {
      sessionStorage.setItem('url', window.location.search);
    }
    if (JSON.stringify(appleUrl) !== '{}' && appleUrl !== 'null' && appleUrl !== '') {
      if (!this.isLogin) {
        this.loginType = 'apple';
        this.loginHandler({
          accessToken: getParams('appleAuthCode'),
          loginType: window.baseConfig.appleLoginType
        });
      }
      window.history.pushState('', '', `/${sessionStorage.getItem('url')}`);
      this.$router.push({ path: '' + sessionStorage.getItem('url') });
    }
  },
  beforeDestroy () {
  }
};
</script>

<style lang="less">
@import url("./index.less");
</style>
