<template>
  <div class="step-login-password">
    <template v-if="pswReset">
      <h3 class="login-m-title">{{$t('app.phone_login_forget_password_input_password_title')}}</h3>
      <p class="login-m-intro">{{$t('app.phone_login_new_password_length_message')}}</p>
    </template>
    <template v-else>
      <h3 class="login-m-title">{{setPageTitle}}</h3>
      <p class="login-m-intro">
        {{setPhoneTitle}}
        <br />+{{ userPhone.areaCode }}
        {{ userPhone.phoneNum }}
      </p>
    </template>

    <div class="m-input-box fx-be-vc">
      <div class="input-cell fx-c">
        <input
          :type="pwType ? 'password' : 'text'"
          :placeholder="setPageTitle"
          v-model.trim="password"
          maxlength="30"
        />
      </div>
      <div class="input-action hover" @click="pwType = !pwType">
        <span class="icon-visible" v-if="!pwType"></span>
        <span class="icon-unvisible" v-else></span>
      </div>
    </div>
    <div class="login-m-info fx-be-vc">
      <span class="send-state">
        <span class="txt-gray" v-if="pswReset || isNewPhone">{{$t('app.phone_login_password_length_message')}} </span>
        <span class="txt-link hover" v-else @click="resetPw">{{$t('app.phone_login_forget_password')}}</span>
      </span>
      <span class="txt-link hover" v-if="isShowSkip" @click="skipSetPassword">{{$t('app.phone_login_skip_password_setting')}}</span>
      <!-- <span class="error-tips txt-error">{{ errTxt }}</span> -->

    </div>
    <div class="login-m-action fx-c">
      <button
        class="m-btn major bk"
        :class="{ disabled: !(password.length>7) }"
        @click="phoneNext"
        v-preventReClick
      >
        {{ pswReset ? $t('app.phone_login_next') : $t('app.phone_login_login') }}
      </button>
    </div>
  </div>
</template>

<script>
import { mapState } from 'vuex';
import { logReport } from '@/util/logReport';

export default {
  name: 'StepLoginWord',
  data () {
    return {
      errTxt: '',
      showAreaBox: true,
      pwType: false,
      password: '',
    };
  },
  props: {
    pswReset: {
      type: Boolean,
      default: false
    },
    userPhone: {
      type: Object,
      default: () => ({})
    },
    isNewPhone: {
      type: Boolean,
      default: true
    }
  },

  watch: {
    password (n) {
      this.password = n.replace(/([^~!@#$%^&*()_+{}:"><?a-z\d]+)/gi, '');
    }
  },
  computed: {
    ...mapState({
      passwordConfig: (state) => state.app.passwordConfig
    }),
    isShowSkip () {
      const registerSkip = !this.passwordConfig.existent && this.passwordConfig.mobileRegisterSetPassword === 1;
      const loginSkip = this.passwordConfig.existent && !this.passwordConfig.userSetPassword && this.passwordConfig.userLoginSetPassword === 1;
      return registerSkip || loginSkip;
    },
    setPageTitle () {
      let title = this.$t('app.phone_login_input_password');
      if ((this.passwordConfig.existent && !this.passwordConfig.userSetPassword) || !this.passwordConfig.existent || this.pswReset) {
        title = this.$t('app.phone_login_set_password');
      }

      return title;
    },
    setPhoneTitle () {
      let title = this.$t('app.phone_login_phone_number_registered');
      if (this.passwordConfig.existent && this.passwordConfig.userSetPassword && !this.pswReset) {
        title = this.$t('app.phone_login_phone_number_registered_login');
      }

      return title;
    }
  },
  methods: {
    resetPw () {
      // 重置密码
      this.$emit('setPswRest');
      this.$emit('setStep', 2);
      logReport({
        eventId: '106-3-1-10',
        freeName2: window.$mObj.adData || {},
        free_name1: JSON.stringify({
          adUrl: window.location.search || ''
        })
      });
    },
    skipSetPassword () {
      const { existent, userLoginSetPassword, mobileRegisterSetPassword } = this.passwordConfig;
      this.password = '';
      if (mobileRegisterSetPassword === 1 && !existent) {
        this.$parent.$parent.$parent.toShowSupply();
      } else if (existent && userLoginSetPassword === 1) {
        this.$emit('login', 'resetPswLogin');
      }
    },
    phoneNext () {
      if (!this.password) return;
      const { existent, userSetPassword } = this.passwordConfig;

      let eventId = '';
      if (!existent) {
        eventId = '106-3-1-7';
      } else {
        eventId = this.pswReset ? '106-3-1-13' : '106-3-1-9';
      }
      logReport({
        eventId: eventId,
        freeName2: window.$mObj.adData || {},
        free_name1: JSON.stringify({
          adUrl: window.location.search || ''
        })
      });
      if (this.password.length < 8) {
        this.$toast({
          html: this.$t('app.phone_login_password_length_message')
        });
        return;
      }
      // todo 校验密码
      this.$parent.$parent.$parent.setTempPassword(this.password);
      // 注册用户显示补全信息
      if (existent) {
        if (!this.pswReset && userSetPassword) {
          this.$emit('login');
        } else if (this.pswReset || !userSetPassword) {
          this.$emit('login', 'resetPswLogin');
        }
      } else {
        this.$parent.$parent.$parent.toShowSupply();
      }
    },

    showReport () {
      let eventId = '106-3-1-18';
      if (!this.passwordConfig.existent) {
        eventId = '106-3-1-15';
      }
      if (this.pswReset) {
        eventId = '106-3-1-17';
      }

      const phone = `${this.userPhone.areaCode}+${this.userPhone.phoneNum.slice(-4)}`;
      logReport({
        eventId: eventId,
        freeName2: window.$mObj.adData || {},
        free_name1: JSON.stringify({
          adUrl: window.location.search || '',
          phone
        })
      });
    }
  },
  mounted () {
    this.showReport();
  }
};
</script>

<style lang="less" scoped>
@import url('~@/style/var.less');

.step-login-password {
  .m-input-box {
    .input-action {
      font-size: 16px;
    }
  }
}
</style>
