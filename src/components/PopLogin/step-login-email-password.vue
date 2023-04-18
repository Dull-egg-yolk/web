<template>
  <div class="step-login-email-password">

    <h3 class="login-m-title">{{setPageTitle}}</h3>
    <p class="login-m-intro">{{$t('app.error_password')}}</p>

    <div class="m-input-box fx-be-vc">
      <div class="input-cell fx-c">
        <input
          :type="pwType ? 'password' : 'text'"
          :placeholder="setPageTitle"
          v-model.trim="passwordTxt"
          maxlength="16"
        />
      </div>
      <div class="input-action hover" @click="pwType = !pwType">
        <span class="icon-visible" v-if="!pwType"></span>
        <span class="icon-unvisible" v-else></span>
      </div>
    </div>
    <div class="login-m-info fx-be-vc" v-if="config.status === 4">
      <span class="send-state">
        <span class="txt-link hover" @click="forgetAct">{{$t('app.phone_login_forget_password')}}</span>
      </span>
    </div>

    <div class="login-m-action flex-col-vc">
      <button
        class="m-btn major bk"
        :class="{ disabled: !(passwordTxt.length>5) }"
        @click="nextAct"
        v-preventReClick
      >
        {{$t('base.confirm')}}
      </button>
    </div>
  </div>
</template>

<script>
import { mapState } from 'vuex';
import { apiEmialNewSetPassword, apiEmialLogin } from '@/api/user';

import { logReport } from '@/util/logReport';
import { encryptRsaEmail } from '@/api/crypto';

export default {
  name: 'StepLoginEmailPassword',
  data () {
    return {
      errTxt: '',
      passwordTxt: '',
      pwType: false
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
    setPageTitle () {
      if (this.config.status !== 4) {
        return this.$t('app.phone_login_set_password');
      } else {
        return this.$t('app.phone_login_input_password');
      }
    }
  },
  watch: {
    passwordTxt (n) {
      console.log(n);
      this.passwordTxt = n.replace(/([^~!@#$%^&*()_+{}:"><?a-z\d]+)/gi, '');
    }
  },
  methods: {
    nextAct () {
      if (!this.passwordTxt) return;
      if (this.passwordTxt.length < 6) {
        this.$toast({
          html: this.$t('app.error_password')
        });
        return;
      }

      const eventId = this.config.status === 4 ? '106-3-2-8' : '106-3-2-6';
      logReport({
        eventId: eventId,
        freeName2: window.$mObj.adData || {},
        free_name1: JSON.stringify({
          adUrl: window.location.search || ''
        })
      });

      const { register, status, email, userId } = this.config;
      const resTxt = encryptRsaEmail.encrypt(this.passwordTxt);
      if (register) {
        // 新用户直接吊起信息补全
        this.$emit('setConfig', { password: resTxt });
        this.$parent.$parent.$parent.toShowSupply();
      } else {
        // 登录
        if (status === 4) {
          this.emialLogin(resTxt);
          return;
        }
        // 更新密码
        apiEmialNewSetPassword({
          email,
          password: resTxt,
          userId,
        }).then(({ code, data }) => {
          console.log(code, data, 'email');
          if (code === 200) {
            this.emialLogin(resTxt);
          }
        });
      }
    },
    emialLogin (resTxt) {
      const { email } = this.config;
      apiEmialLogin({
        userAccount: email,
        password: resTxt,
        deviceType: '4',
        deviceName: 'web',
      }).then(({ code, data }) => {
        // 密码错误
        if (code === 10006) {
          this.$toast({
            html: this.$t('app.error_password_signin')
          });
          return;
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
              from: 'email'
            },
          });
          return;
        }
        // 登录

        if (code === 200) {
          localStorage.setItem('RC_USER_EMAIL', email);
          this.$emit('login', data);
        }
      });
    },

    forgetAct () {
      logReport({
        eventId: '106-3-2-9',
        freeName2: window.$mObj.adData || {},
        free_name1: JSON.stringify({
          adUrl: window.location.search || ''
        })
      });

      this.$emit('setConfig', {
        resetPW: true
      });
      this.$emit('setStep', 6);
    }
  },
  async mounted () {
    const eventId = this.config.status === 4 ? '106-3-2-7' : '106-3-2-5';
    logReport({
      eventId: eventId,
      freeName2: window.$mObj.adData || {},
      free_name1: JSON.stringify({
        adUrl: window.location.search || ''
      })
    });
  },
};
</script>

<style lang="less" scoped>
@import url('~@/style/var.less');
.step-login-email-password{
  .input-action{
    font-size:16px;
  }
}
</style>
