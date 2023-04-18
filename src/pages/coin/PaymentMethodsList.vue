<template>
  <div class="coin-page"  @click.stop="() => {}" ref="coinPage">
    <!-- mobile 给移动端的页面title -->
    <div class="mb-title flex-row-vc">
      <div class="actions l fx-c">
        <span class="icon-arrow" @click.stop="closeBtn"></span>
      </div>
      <div class="title l fx-v">{{$t('webChat.coinShop')}}</div>

      <!-- 金币 -->
    <div class="side-coin hover">
      <div class="coin-wrap fx-be-vc">
        <strong v-if="userInfo">{{ userInfo.goldNum }}</strong>
      </div>
    </div>

    </div>
    <span class="btn-back hover" @click.stop="closeBtn">
      <span class="icon-cross"></span>
    </span>
    <div class="inner" >
      <div class="bank-list full-height">
        <div class="bank-list-inner full-height scroll-y">
            <h4 v-if="query.formSource === 'dlocal'">Bank Supported:</h4>
            <h4 v-else>Payment method:</h4>
            <ul>
                <li v-for="(item, index) in filterBank" :key="index" @click="handleBank(item, index)">
                    <span class="method-logo">
                       <img v-if="item.image" :src="item.image" alt="image">
                    </span>
                    <p>{{item.name}}</p>
                    <i class="rc-icon-checkbox" :class="{'checked': currentBank.index === index}"></i>
                </li>
            </ul>
        </div>
        <div class="fixed-bottom" v-if="filterBank.length">
            <button class="next-button" @click="handleNext">Pay {{query.currencyMark + ' ' + query.price}}</button>
        </div>
    </div>
    </div>
  </div>
</template>

<script>
import { mapState } from 'vuex';
import { choosePay } from '@/components/Shop/payPlatforms/index';

export default {
  name: 'BankList',
  data () {
    return {
      query: { ...this.$route.query },
      bankList: [],
      currentBank: {},
      localImgList: ['th_bbl_bank.png', 'th_bay_bank.png', 'th_scb_bank.png', 'th_kasikorn_bank.png', 'my_simpanannasiona_bank.png']
    };
  },
  computed: {
    ...mapState({
      userInfo: (state) => state.app.userInfo,
    }),
    /**
     * 过滤可用的银行
     * @returns {*[]}
     */
    filterBank () {
      return this.bankList.filter(item => {
        return item.status === 1;
      });
    }
  },
  methods: {
    /**
     * 选择银行
     * @param item
     */
    handleBank (item, index) {
      this.currentBank = item;
      this.currentBank.index = index;
      // trigger('select bank', {
      //   bankName: this.currentBank.name,
      //   bankType: this.currentBank.type
      // });
      // console.log('current bank', this.currentBank);
    },
    /**
     * 本地存储选择的银行信息
     */
    addStoreBank (info) {
      const payBankInfo = Object.assign({}, info || this.currentBank);
      const storeArr = localStorage.getItem('rapydBankList') ? JSON.parse(localStorage.getItem('rapydBankList')) : [];
      const checkStoreHasBank = () => {
        return storeArr.some(item => {
          return item.type === payBankInfo.type;
        });
      };

      // 查询现有银行替换imageUrl
      const arrItemIndex = () => {
        return storeArr.findIndex(item => {
          return item.type === payBankInfo.type;
        });
      };
      const index = arrItemIndex(); // 获得索引位置
      // 当本地存储的渠道列表不存在此渠道
      if (index === -1) {
        // 如果本地存储的银行大于5个，就删除第一个
        if (storeArr.length > 5) {
          storeArr.shift();
        }

        // 存储本地
        storeArr.push(payBankInfo);
      } else { // 如果存在就替换对象数据(image url 403的图片)
        storeArr.splice(index, 1, payBankInfo);
      }
      localStorage.setItem('rapydBankList', JSON.stringify(storeArr));
    },
    /**
     * 下一步
     */
    async handleNext () {
      console.log('type', this.currentBank.type);
      if (!this.currentBank.type) {
        this.$Message.info('Please select a payment bank');
        return;
      }
      this.query.thirdPaymentChannelCode = this.currentBank.type;
      if (this.query.companyCode === 'razer' || this.query.companyCode === 'xendit') {
        this.query.thirdPaymentChannelCode = this.currentBank.channelCodeExt;
      }
      const fields = await this.payObj.getRequireFields(this.query.thirdPaymentChannelCode);

      // 只对 rapyd 渠道进行保存
      if (this.query.formSource === 'rapyd') {
        this.addStoreBank(this.currentBank); // 本地存储银行信息
      }

      // trigger('bank list next button');
      if (fields && fields.length > 0) {
        // trigger(this.query.formSource + ' go form', {
        //   bankType: this.currentBank.type,
        //   bankName: this.currentBank.name
        // });
        const dlocal = {};
        if (this.query.formSource === 'dlocal') {
          this.payObj.setPaymentMethod(this.currentBank);
          dlocal.isMultistage = 0;
        }
        this.payObj._goForm(Object.assign({}, this.query, dlocal)); // 跳转到银行填写表单页面
      } else {
        // trigger(this.query.formSource + ' to pay');
        // triggerService({ eventId: '14-1-1-77', freeName2: this.query.channelCode, freeName1: `${this.query.channelName}+${this.query.thirdPaymentChannelCode}` });
        // triggerService({ eventId: '14-2-6-2', freeName2: this.currentBank.name }); // 点击虚拟渠道"FPX"银行里子渠道银行
        const obj = {};
        if (this.query.companyCode === 'ideal') {
          obj.bic = this.currentBank.bic;
        }
        this.payObj._orderPay(Object.assign({}, obj, this.query));
      }
    },
    /*
    * 匹配图片名称并替换 url
    **/
    _matchImg (url) {
      const reg = /^http(s)?:\/\/(.*?)\//;
      const imgHost = 'https://h5-static.livuchat.com/images/';
      const arr = url.split('/');
      const imgName = arr[arr.length - 1];
      let imgUrl = url;
      if (this.localImgList.includes(imgName)) {
        imgUrl = url.replace(reg, imgHost);
      }
      return imgUrl;
    },
    closeBtn () {
      this.$router.go(-1);
    },
  },
  async mounted () {
    console.log(this.query.formSource);
    // 是否有依赖  param1: 支付平台, param2: 数据， param3: 是否需要安装依赖
    this.payObj = await choosePay(this.query.formSource, this.query, this.query.hasDepend);
    this.bankList = await this.payObj.getBankListByCountry(this.query);
    this.bankList.forEach(item => {
      item.image = this._matchImg(item.image);
    });
    console.log('this.bankList', this.bankList);
    // triggerService({ eventId: '14-2-6-1' }); // 点击虚拟渠道"FPX"弹出银行里面页面子渠道银行页面埋点
  }
};
</script>

<style lang="less" scoped>
@import url("./index.less");
.coin-page {
  .inner {
  background: none;
}
}
.bank-list {
      font-size: 13px;
      min-height: 100vh;
        .bank-list-inner {
            padding: 0px 12px 50px;
        }
        h4 {
            font-size: 14px;
            color: #fff;
            height: 40px;
            line-height: 40px;
        }
        ul {
        }
        ul > li {
            display: flex;
            height: 40px;
            position: relative;
            align-items: center;
            justify-content: flex-start;
            color: #fff;
            &::before {
                position: absolute;
                top: 0;
                content: '';
                left: 0;
                right: 0;
                height: 1px;
                font-size: 0;
                clear: both;
                background-color: #e6e6e6;
                transform: scaleY(0.5);
            }

            .method-logo {
                flex-basis:60px;
                font-size: 0;
                img {
                    display: inline-block;
                    width: 45px;
                    max-height: 38px;
                }
            }

            p {
                flex-basis: 280px;
                text-indent: 6px;
                text-overflow: ellipsis;
                white-space: nowrap;
                overflow: hidden;
            }
            .rc-icon-checkbox {
                margin-left: 6px;
                width: 28px;
                height: 22px;
                background-repeat: no-repeat;
                background-size: 100%;

                &.checked {
                    background-image: url("../../assets/img/shop/new/checked_icon.png");
                }
            }
        }
        .fixed-bottom {
          position: fixed;
          bottom: 0px;
          left: 0px;
          width: 100%;
          .next-button {
              display: block;
              width: 100%;
              height: 60px;
              color: #fff;
              font-weight: 600;
              font-size: 13px;
              cursor: pointer;
              background-color: #6900ff;
              box-shadow: 0 0 5px rgba(0, 0, 0, .3);
          }
        }
    }
</style>
