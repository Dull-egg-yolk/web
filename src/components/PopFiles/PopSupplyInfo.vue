<template>
  <base-pop class="pop-public pop-input pop-supplyinfo" :showPop="show">
    <div class="top-tips">{{$t('webChat.registrationInfoTips')}}</div>
    <div class="m-form"  @click="cancelDatePicker">
      <!-- <div class="mf-cell">
        <div class="cell-title">姓名</div>
        <div class="m-input-box">
          <div class="input-cell">
            <input type="text" v-model="nickName" spellcheck="false" maxlength="30" />
          </div>
        </div>
      </div> -->
      <div class="head">
        <img class="head-img" src="./../../assets/img/head-img.png" alt>
      </div>
      <div class="nick-name">
        <span class="title">{{$t('app.hint_name')}}</span>
        <input class="name-inp" v-model="nickName" spellcheck="false" type="text" maxlength="30" :placeholder="$t('app.input_sign_name')">
        <span class="remnant">{{nickName.length}}/30</span>
      </div>
      <div class="nick-name">
        <div>
          <span class="title">{{$t('app.profile_birthday')}}</span>
          <p class="desc">{{$t('webChat.cantChanged')}}</p>
        </div>
        <div class="cell-right" @click.stop>
          <pop-date-picker ref="datePicker" :date.sync="birthDay" ></pop-date-picker>
        </div>
      </div>
      <div class="gender">
        <p class="title">{{$t('app.filter_dialog_gender')}}</p>
        <p class="desc">{{$t('webChat.cantChanged')}}</p>
        <div class="gender-box">
          <div class="gender-item" :class="{selected: gender === 2}" @click="changeGender(2)">
            <img class="gender-img" src="../../assets/img/female.png" alt>
            <span class="gender-desc">{{$t('base.female')}}</span>
          </div>
          <div class="gender-item" :class="{selected: gender === 1}" @click="changeGender(1)">
            <img class="gender-img" src="../../assets/img/male.png" alt="">
            <span class="gender-desc">{{$t('base.male')}}</span>
          </div>
        </div>
      </div>
      <!-- <div class="mf-cell">
        <div class="cell-title">
          性别
          <span class="tip" v-if="gender">注意：性别设置后无法更改</span>
        </div>
        <div class="gender-select-box flex-row-vc">
          <div class="oitem" :class="{ selected: gender === 2 }" @click="changeGender(2)">
            <div class="img avatar-img">
              <div class="avatar-wrap">
                <img src="@/assets/img/img-female.png" alt />
              </div>
              <span class="icon-right fx-c"></span>
            </div>
            <div class="txt">female</div>
          </div>
          <div class="oitem" :class="{ selected: gender === 1 }" @click="changeGender(1)">
            <div class="img avatar-img">
              <div class="avatar-wrap">
                <img src="@/assets/img/img-male.png" alt />
              </div>
              <span class="icon-right fx-c"></span>
            </div>
            <div class="txt">male</div>
          </div>
        </div>
      </div> -->
      <!-- <div class="mf-cell">
        <div class="cell-title">生日</div>
        <f-select-date :date.sync="birthDay" flex></f-select-date>
      </div> -->
      <div class="m-error-tips" v-if="errorTxt">{{ errorTxt }}</div>
    </div>

    <div class="pop-action">
      <button class="m-btn major" :class="{'major-act': nickName && gender && this.birthDay}" @click="subFormHandler" v-preventReClick>{{$t('base.confirm')}}</button>
    </div>
    <div class="cancel-box"><span class="cancel" @click="cancel">{{$t('base.cancel')}}</span></div>
  </base-pop>
</template>

<script>
import BasePop from '../BasePop.vue';
import { logReport } from '@/util/logReport';
import { formatTime } from '@/util/index';
import PopDatePicker from './PopDatePicker.vue';

export default {
  name: 'PopSupplyInfo',
  data () {
    return {
      nickName: '',
      birthDay: '',
      gender: '',
      errorTxt: '',
    };
  },
  props: {
    show: {
      type: Boolean,
      default: false,
    },
    tnickname: {
      type: String,
      default: ''
    },
    tgender: {
      type: Number,
      default: 0
    },
    tbirthday: {
      type: [String, Number],
      default: ''
    },
    loginType: {
      type: [String],
      default: ''
    }
  },
  components: {
    BasePop,
    PopDatePicker
    // FSelectDate,
  },
  computed: {},
  watch: {
    nickName () {
      this.errorTxt = '';
    },
    gender () {
      this.errorTxt = '';
    },
    birthDay (n) {
      this.errorTxt = '';
    }
  },
  methods: {
    subFormHandler () {
      if (!this.nickName || !this.gender || !this.birthDay) {
        this.errorTxt = this.$t('app.trust_algo_click_upload'); // '请把信息填写完整';
        return;
      }
      const age = this.checkBirthDay();
      if (age < 18) {
        this.$message({
          desc: {
            txt: this.$t('app.age_too_young')// '年龄不能小于18岁'
          }
        });
        logReport({
          eventId: '106-1-1-26',
          free_name2: {
            error: 'less 18',
            from: this.loginType
          },
        });
        return;
      }
      // 点击补全信息确认按钮上报
      logReport({
        eventId: '106-1-1-24',
        free_name2: {
          nickname: this.nickName,
          gender: this.gender,
          birthday: formatTime(this.birthDay, 'YYYY-MM-DD'),
          from: this.loginType
        }
      });
      this.$emit('cancel', {
        nickname: this.nickName,
        birthday: this.birthDay,
        gender: this.gender
      });
    },
    changeGender (type) {
      this.gender = type;
    },
    setErrorTxt (txt) {
      this.errorTxt = txt;
    },
    // 检查年龄
    checkBirthDay () {
      if (!this.birthDay) {
        return;
      }
      const birth = new Date(this.birthDay);
      const birthYear = birth.getFullYear();
      const birthMonth = birth.getMonth() + 1;
      const birthDay = birth.getDate();
      const myDate = new Date();
      const monthNow = myDate.getMonth() + 1;
      const dayNow = myDate.getDate();
      let age = myDate.getFullYear() - birthYear;
      if (monthNow < birthMonth || (monthNow === birthMonth && dayNow < birthDay)) {
        age--;
      }
      return age;
    },
    cancelDatePicker () {
      this.$refs.datePicker.drop = false;
    },
    cancel () {
      this.$emit('cancelClick');
    },
    get18Years () {
      const now = new Date();
      const year = now.getFullYear() - 20;
      const month = now.getMonth() + 1;
      return new Date(year + '/' + month + '/' + '1').getTime();
    }
  },
  mounted () {
    this.gender = this.tgender;
    this.birthDay = this.tbirthday || this.get18Years();
    this.nickName = this.tnickname;
  },
};
</script>

<style lang="less" scoped>
@import url("~@/style/var.less");

.top-tips{
  font-size:12px;
  background: linear-gradient(135deg, #FF78FF 0%, #32E5FF 100%);
  color:#fff;
  padding: 8px 10px;
  border-radius: 10px;
  text-align:center;
}
.m-form {
  padding-bottom: 20px;

  .tip {
    color: @cgray-5;
    font-size: 12px;
    margin-left: 10px;
  }

  .m-error-tips {
    position: absolute;
    left: 20px;
    right: 20px;
  }
}
.head {
  text-align: center;
  margin: 0 auto;
  width: 427px;
  .head-img {
    width: 152px;
    height: 152px;
    border-radius: 50%;
    border: 2px solid #17161F;
    margin-top: 30px;
  }
}
.pop-public {
  .nick-name {
    width: 427px;
    margin: 20px auto 0;
    border: 1px solid #505050;
    border-radius: 8px;
    height: 48px;
    display: flex;
    align-items: center;
    color: #777777;
    .title {
      font-size: 14px;
      margin: 0;
      padding-left: 20px;
      color: rgba(255,255,255,.5);
    }
    .desc {
      padding-left: 20px;
      color: rgba(255,77,77,.6);
      font-size: 10px;
    }
    .name-inp {
      height: 100%;
      background: transparent;
      flex: 1;
      color: #fff;
      text-align: right;
      font-size: 16px;
      padding-right: 10px;
    }
    .remnant{
      text-align: right;
      // width: 100%;
      display: inline-block;
      color: rgb(102, 100, 100);
      max-width: 80px;
      padding-right: 10px;
    }
    .cell-right {
      flex: 1;
      text-align: right;
      color: #fff;
      input {
        background: transparent;
        font-size: 16px;
        text-align: right;
        padding-right: 28px;
      }

      .pop-date-picker{
        padding-right:10px;
      }

    }
  }
  .gender {
    border-radius: 8px;
    border: 1px solid #505050;
    padding: 0 20px;
    width: 427px;
    box-sizing: border-box;
    margin:  20px auto 0;
    .title {
      color: #777777;
      font-size: 14px;
      font-weight: 600;
      margin: 15px 0 0 0;
      text-align: left;
    }
    .desc {
      color: rgba(255,77,77,.65);
      font-size: 10px;
      margin-bottom: 13px;
    }
    .gender-box {
      display: flex;
      margin-bottom: 10px;
      .gender-item {
        border-radius: 12px;
        background: #222;
        padding: 15px 20px 11px;
        flex: 1;
        display: flex;
        align-items: center;
        cursor: pointer;
        .gender-img {
          width: 54px;
          border-radius: 50%;
        }
        .gender-desc {
          color: #FFF;
          font-size: 16px;
          margin-left: 27px;
          font-weight: bold;
        }
      }
      .selected {
        background: linear-gradient(135deg, #FF78FF 0%, #32E5FF 100%);
      }
      .gender-item:nth-child(1) {
        margin-right: 20px;
      }
    }
  }
  .major {
    width: 324px;
    height: 64px;
    box-sizing: border-box;
    background: rgba(255,255,255,0.1);
    color: #595959;
  }
  .major-act {
    background: linear-gradient(135deg, #FF78FF 0%, #32E5FF 100%);
    color: #000;
  }
}
.cancel-box {
  text-align: center;
  .cancel {
    color: #fff;
    font-size: 14px;
    &:hover {
      font-weight: bold;
    }
  }
}
[lang="ar"],
[lang="he"],
[lang="ur"] {
  .pop-public .nick-name .cell-right[data-v-5913a755] {
      flex: 1;
      text-align: left;
      color: #fff;
      margin-left: 5px;
  }
  .pop-date-picker .drop-picker[data-v-241d3774] {
    position: absolute;
    width: 240px;
    right: -160px;
    background: #17161F;
    padding: 10px 10px;
    border-radius: 20px;
    box-shadow: 0 0 20px rgb(0 0 0 / 40%);
    border: solid 1px rgba(255, 255, 255, 0.1);
    font-size: 13px;
  }
  #app .pop-supplyinfo .pop-content .nick-name .title {
      padding-right: 10px;
  }
  .pop-public .gender .desc {
    padding-right: 20px;
  }
  .pop-public .nick-name .desc{
    padding-right: 20px;
  }
  .pop-supplyinfo .pop-content .gender .gender-box .gender-item:nth-child(1) {
    margin-left: 10px;
  }
  .pop-public .gender .gender-box .gender-item .gender-img {
    margin: 0 10px;
    width: 54px;
    border-radius: 50%;
  }
  .pop-supplyinfo .pop-content .nick-name .name-inp {
    text-align: left;
    padding: 0 10px;
}
}
@media screen and (max-width: 375px){
  .top-tips{
    padding: 4px 10px;
  }
  .head .head-img{
    width: 102px;
    height: 102px;
    margin-top: 10px;
  }
  .cancel-box{
    padding-bottom: 20px;
  }
}
</style>
