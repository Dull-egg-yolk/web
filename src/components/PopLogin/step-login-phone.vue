<template>
  <div class="step-login-phone">
    <template v-if="pswReset">
      <h3 class="login-m-title">{{$t('app.phone_login_forget_password_phone_number_title')}}</h3>
      <p class="login-m-intro">{{$t('app.phone_input_num_hint')}}</p>
    </template>
    <template v-else>
      <h3 class="login-m-title">{{$t('app.phone_title_text')}}</h3>
      <p class="login-m-intro">{{$t('app.phone_input_num_hint')}}</p>
    </template>

    <div class="m-input-box fx-be-vc">
      <div
        class="area-code flex-row-vc hover"
        :class="{ extend: showAreaBox }"
        @click.stop="showAreaBox = !showAreaBox"
      >
        <span class="flag"><img :src="icon" alt=""></span>
        <span class="code">+{{ areaCode }}</span>
        <span class="icon-arrow"></span>
      </div>
      <div class="input-cell fx-c">
        <input type="tel" :placeholder="$t('app.phone_input_num_hint')" ref="phoneBox" v-model="phoneNum" />
      </div>
      <span class="input-action hover" v-show="phoneNum" @click="phoneNum = ''">
        <span class="icon-cross"></span>
      </span>

      <!-- 国家选择 -->
      <transition name="slideDown">
        <div class="area-list-box flex-col" v-if="showAreaBox" @click.stop>
          <!-- 手机时显示的标题和回退 -->
          <div class="m-page-title">
            <span
              class="actions l icon-arrow"
              @click.stop="showAreaBox = !showAreaBox"
            >
            </span>
            <h2 class="title-txt">{{$t('app.phone_login_select_country_title')}}</h2>
          </div>
          <!-- 搜索框 -->
          <div class="search">
            <div class="m-input-box white fx-be-vc">
              <span class="ico icon-search"></span>
              <div class="input-cell fx-c">
                <input type="text" :placeholder="$t('base.search')" ref="searchBox" v-model="searchCon"/>
              </div>
            </div>
          </div>

          <!-- 国家列表 -->
          <div class="the-list">
            <!-- <h3 class="sort-title">Hot</h3> -->
            <ul v-if="false">
              <li class="fx-be-vc">
                <span class="flag">🇮🇳</span>
                <span class="txt">印度</span>
                <span class="code">+84</span>
              </li>
            </ul>
            <!-- <h3 class="sort-title">A</h3> -->
            <ul>
              <li class="fx-be-vc" v-for="item in searchCountryList" :key="item.short" @click="setAreaCodeCode(item)">
                <span class="flag fx-ic"><img :src="item.img" alt=""></span>
                <span class="txt">{{item.name}}</span>
                <span class="code">+{{item.phoneCode}}</span>
              </li>
            </ul>
          </div>
        </div>
      </transition>
    </div>

    <div class="login-m-info fx-be-vc" v-if="errTxt">
      <span class="send-state"> </span>
      <span class="txt-error">{{ errTxt }}</span>
    </div>
    <div class="login-m-action fx-c">
      <div
        class="m-btn major bk"
        :class="{ disabled: !phoneNum }"
        @click="phoneNext"
        v-preventReClick
      >
        {{$t('app.phone_login_next')}}
      </div>
    </div>
  </div>
</template>

<script>
import { parsePhoneNumberFromString } from 'libphonenumber-js';
import { mapState } from 'vuex';
import { apiCheckMobile, apiGetCountryId } from '@/api/user';
import { logReport } from '@/util/logReport';
import phoneList from '@/assets/data/phone';

export default {
  name: 'StepLoginPhone',
  data () {
    return {
      errTxt: '',
      showAreaBox: false,
      phoneNum: '',
      areaCode: '',
      icon: '',
      searchCon: '',
      countryCode: '',
      flagUrl: 'https://h5.livuchat.com/static/images/countryFlag/'
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
    }
  },
  computed: {
    ...mapState({
      userLocationInfo: (state) => state.app.userLocationInfo
    }),
    countryList () {
      const list = [];
      Object.entries(phoneList).forEach(([key, val]) => {
        const code = key.toLowerCase();
        const img = `${this.flagUrl}${code}.png`;
        const name = this.$t(`country.${key}`);
        const obj = {
          short: key,
          phoneCode: val,
          name,
          searchKey: name.toLowerCase() + val,
          img
        };
        list.push(obj);
      });
      return list;
    },
    searchCountryList () {
      if (this.searchCon) {
        const sea = this.searchCon.toLowerCase();
        return this.countryList.filter(item => item.searchKey.indexOf(sea) !== -1);
      }
      return this.countryList;
    }
  },
  watch: {
    showAreaBox (n, o) {
      if (n) {
        this.$nextTick(() => {
          this.$refs.searchBox.focus();
        });
      } else {
        this.$nextTick(() => {
          this.$refs.phoneBox.focus();
        });
      }
    },
    phoneNum (n, o) {
      n = n.replace(/[^\d]/g, '');
      if (n.length > 20) {
        this.phoneNum = n.slice(0, 20);
      } else {
        this.phoneNum = n;
      }
    }
  },
  methods: {

    /**
     * 验证手机号是否有效
     */
    checkPhone () {
      const phone = `${this.areaCode}${this.phoneNum}`;
      const phoneNumber = parsePhoneNumberFromString(
        phone,
        this.countryCode
      );
      if (phoneNumber && typeof phoneNumber.isValid === 'function') {
        console.log(phoneNumber.isValid(), '-----phoneNumber.isValid()--------');
        return phoneNumber.isValid();
      }
      return this.phoneNum.length > 0;
    },
    phoneNext () {
      if (!this.checkPhone()) {
        // 手机号错误
        this.$message({
          desc: {
            txt: this.$t('app.phone_num_hint')
          }
        });
        return;
      }
      const phone = `${this.areaCode}+${this.phoneNum.slice(-4)}`;
      logReport({
        eventId: this.pswReset ? '106-3-1-11' : '106-3-1-1',
        freeName2: window.$mObj.adData || {},
        free_name1: JSON.stringify({
          adUrl: window.location.search || '',
          phone,
        })
      });

      this.$emit('setPhoneNum', {
        areaCode: this.areaCode,
        phoneNum: this.phoneNum,
      });
      this.checkMobile();
    },
    setAreaCodeCode (item) {
      this.areaCode = item.phoneCode;
      this.icon = item.img;
      this.showAreaBox = false;
      this.countryCode = item.short;
    },
    getAreaCodeCode (countryId) {
      if (!countryId) return;
      const info = this.$countryCode[countryId];
      const code = info.short.toLowerCase();
      const img = `${this.flagUrl}${code}.png`;
      let name = this.$t(`country.${info.short}`);
      if (name.indexOf('country.') === 0) {
        name = info.en;
      }
      const obj = {
        short: info.short,
        phoneCode: info.phoneCode,
        name,
        searchKey: name.toLowerCase() + info.phoneCode,
        img
      };
      this.setAreaCodeCode(obj);
    },

    checkMobile () {
      const params = {
        countryCode: this.areaCode,
        mobileNo: '' + this.areaCode + this.phoneNum,
      };
      apiCheckMobile(params).then(res => {
        console.log(res, '------检查手机号-----');

        // 错误上报
        if (res.code !== 200 || !res.data || !res.data.passwordConfig) {
          logReport({
            eventId: '106-1-1-98',
            freeName2: {
              code: res.code,
              data: !!res.data,
              hasConfig: !!(res.data && res.data.passwordConfig)
            }
          });
        }

        if (res.code === 200) {
          this.loginProcess(res.data);
        }
        // 异常处理
      }).catch(e => {
        logReport({
          eventId: '106-1-1-98',
          freeName2: {
            error: 'network error'
          }
        });
      });
    },
    // 登录流程处理
    loginProcess (data) {
      const { existent, passwordConfig, sendSms, sendWhatsapp, userSetPassword } = data;
      const obj = { existent, sendSms, sendWhatsapp, userSetPassword };
      const phoneConfig = { ...obj, ...passwordConfig };
      this.$store.commit('setPasswordConfig', phoneConfig);
      this.$emit('setIsNewPhone', !existent);
      // 新注册用户
      if (existent) {
        // 忘记密码
        if (this.pswReset) {
          this.$emit('setStep', 4);
        } else if (userSetPassword) { // 密码登录
          this.$emit('setStep', 3);
        } else if (!userSetPassword) { // 密码登录
          this.$emit('setStep', 4);
        }
      } else {
        if (passwordConfig && passwordConfig.mobileRegisterEnable) {
          this.$emit('setStep', 4);
        } else {
          const phone = `${this.areaCode}+${this.phoneNum.slice(-4)}`;
          logReport({
            eventId: '106-1-1-33',
            freeName2: window.$mObj.adData || {},
            free_name1: JSON.stringify({
              adUrl: window.location.search || '',
              config: passwordConfig ? passwordConfig.mobileRegisterEnable : 'null',
              phone
            })
          });
          // 手机注册未开放
          this.$message({
            desc: {
              txt: this.$t('webChat.phoneDisabled')
            }
          });
          this.$emit('setStep', 1);
        }
      }
    }
  },
  async mounted () {
    logReport({
      eventId: '106-3-1-14',
      freeName2: window.$mObj.adData || {},
      free_name1: JSON.stringify({
        adUrl: window.location.search || ''
      })
    });

    const { phoneNum, areaCode } = this.userPhone;
    this.phoneNum = phoneNum;
    const number = localStorage.getItem('RC_USER_PHONE');
    if (number) {
      this.phoneNum = number;
    }
    this.areaCode = areaCode || this.userLocationInfo.countryCode;
    let countryId = this.userLocationInfo.id;
    if (!countryId) {
      const countryRes = await apiGetCountryId();
      if (countryRes.data) {
        this.$store.commit('setUserLocationInfo', countryRes.data);
        countryId = countryRes.data.id;
        this.getAreaCodeCode(countryId);
      }
    } else {
      this.getAreaCodeCode(countryId);
    }
    this.$nextTick(() => {
      this.$refs.phoneBox.focus();
    });
  },
};
</script>

<style lang="less" scoped>
@import url('~@/style/var.less');

// 手机号输入
.step-login-phone {
  .m-input-box {
    padding-left: 5px;
    position: relative;
    background: transparent;
    border: 1px solid #3E3D46;
    .area-code {
      width: 86px;
      position: relative;
      justify-content: center;

      .flag {
        width: 20px;
        height: 20px;
        font-size: 20px;
        line-height: 1;
        img {
          width: 20px;
          height: auto;
          background:rgba(255,255,255,.1)
        }
      }
      .code {
        padding: 0 5px;
      }
      .icon-arrow {
        width: 10px;
        height: 10px;
        font-size: 12px;
        transition: transform 0.4s;
        transform-origin: center center;
        transform: rotate(-90deg) scale(0.85);
      }

      &.extend {
        .icon-arrow {
          transform: rotate(90deg) scale(0.85);
        }
      }
    }

    .input-action {
      width: 18px;
      height: 18px;
      border-radius: 50%;
      color: #302E3D;
      background: #fff;
      padding-top: 3px;
      box-sizing: border-box;
      animation: showClear 0.2s both;

      .icon-cross {
        display: block;
        transform: scale(0.6);
        transform-origin: center;
        text-align: center;
      }
    }
  }

  .area-list-box {
    position: absolute;
    background: #17161f;
    border-radius: 20px;
    width: 350px;
    height: 280px;
    box-shadow: -3px 2px 14px 0px rgba(0, 0, 0, 0.1);
    top: 52px;
    left: 0;
    z-index: 10;
    padding-bottom: 20px;

    .m-page-title {
      display: none;
    }

    &::before {
      content: '';
      width: 12px;
      height: 12px;
      background: #17161f;
      border-radius: 2px;
      box-shadow: -3px -3px 4px 0px rgba(0, 0, 0, 0.02);
      top: -6px;
      left: 45px;
      position: absolute;
      transform: rotate(45deg);
    }
    .search {
      padding: 10px 10px 20px;

      .m-input-box {
        height: 38px;
      }
      .icon-search {
        width: 24px;
        padding: 0 5px 0 10px;
        height: 22px;
        font-size: 18px;
        line-height: 22px;
      }
    }
    .the-list {
      flex: 1;
      overflow: auto;
      overscroll-behavior: contain;
      .sort-title {
        background: #212029;
        color: @cgray-8;
        font-size: 12px;
        line-height: 24px;
        padding-left: 20px;
      }
      li {
        width: 100%;
        height: 40px;
        padding: 0 20px;
        box-sizing: border-box;
        line-height: 1;
        cursor: pointer;
        transition: background-color 0.2s;
        &:hover {
          background: #804eec;
        }
        .flag {
          width: 20px;
          height: 20px;
          font-size: 20px;
          line-height: 1;
          img {
            width: 20px;
            height: 13px;
            background:rgba(255,255,255,.2)
          }
        }
        .txt {
          flex: 1;
          padding-left: 5px;
        }
      }
    }
  }
}
</style>
