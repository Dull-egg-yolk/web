<template>
  <div class="coin-page">
    <div class="mb-title new-shop flex-row-vc">
      <div class="actions l fx-c">
        <span class="icon-arrow" @click.stop="closeBtn"></span>
      </div>
      <div class="title l fx-v">
        <div class="side-coin hover">
        <div class="coin-wrap fx-be-vc">
          <strong>{{ userInfo.goldNum }}</strong>
        </div>
      </div></div>
    </div>
    <span class="btn-back hover" @click.stop="closeBtn">
      <span class="icon-cross"></span>
    </span>
    <div class="inner" >
      <section class="refund-wrap">
        <h5>{{$t('shop.refundTitle')}}</h5>
        <ul class="refund-info">
            <li class="refund-user flex-s-c">
                <img :src="userInfo.headImg" alt="user"/>
                <section>
                    <h5 class="name">{{userInfo.userName}}</h5>
                    <p class="id">{{userInfo.id | otherIdFilter}}</p>
                </section>
            </li>
            <li class="refund-info-add">
                <h6>{{$t('shop.refundChooseBill')}}</h6>
                <div class="item-select flex-b-c" @click="chooseOrder">
                    <p class="item-text flex-column-b-s" v-if="form.orderId">
                        <span>Top up {{orderInfo.coinNum}} coins</span>
                        <span class="time">Time: {{new Date(orderInfo.paymentTime || orderInfo.createTime).format('yyyy-MM-dd hh:mm:ss')}}</span>
                    </p>
                    <p v-else class="item-text spec base-color-gray">{{$t('shop.refundSelect')}}{{$t('shop.refundChooseBill')}}</p>
                    <i class="rc-icon ich-list-angle angle-right-black"></i>
                </div>
            </li>
            <li class="refund-info-add">
                <h6>{{$t('shop.refundChooseProblem')}}</h6>
                <div class="item-select flex-b-c" @click="chooseType">
                    <p class="item-text" v-if="form.problemType">{{problemChoose}}</p>
                    <p v-else class="item-text spec base-color-gray">{{$t('shop.refundSelect')}}{{$t('shop.refundChooseProblem')}}</p>
                    <i class="rc-icon ich-list-angle angle-right-black"></i>
                </div>
            </li>
            <li class="refund-info-desc">
                <h6>{{$t('shop.refundProblemDesc')}}</h6>
                <section class="refund-desc">
                    <textarea :placeholder="$t('shop.refundProblemPlaceholder')" maxlength="300" v-model="form.problemDesc" @blur="triggerStatics(0)"></textarea>
                    <p class="textarea-right">{{form.problemDesc.length}}/300</p>
                    <img-upload ref="imgUploadInstance" :multiple-judge="true" :limit="3" @imgUpload="imgUpload" :tip="imgUploadTip" :wetherUploadImg.sync="canUploadImg"></img-upload>
                </section>
            </li>
            <li class="refund-info-add" v-show="enableEmail">
                <h6>{{$t('shop.email')}}</h6>
                <div class="item-select flex-s-c">
                    <input type="input" class="email-input" :placeholder="$t('shop.rightEmail')" maxlength="100" v-model="form.email" />
                </div>
            </li>
            <li class="refund-info-add">
                <h6>{{$t('shop.refundPhoneInput')}}</h6>
                <div class="item-select flex-s-c refund-phone">
                    <p class="flex-b-c" @click="chooseTelCode">
                        <img :src="'/images/countries/'+telSortCodeActive.countryCode+'.png'">
                        <span>+{{telSortCodeActive.telSortCode}}</span>
                        <span class="rc-triangle"></span>
                    </p>
                    <input type="number" :placeholder="$t('shop.refundInput') + $t('shop.refundPhoneInput')" maxlength="20" v-model="form.phone" @blur="triggerStatics(1)"/>
                </div>
            </li>
        </ul>

        <button type="button" class="submit" :disable="!canSubmit" @click="submit">Submit</button>

        <rc-popup :visible="orderShow" height="70vh" @on-close="orderShow=false">
            <h5 class="popup-title">{{$t('shop.refundChargeTitle')}}</h5>
            <div class="popup-order-list">
              <ul class="order-list" v-if="orderList && orderList.length > 0">
                  <li class="order-item" v-for="(item, index) in orderList" :key="index">
                      <section class="flex-b-c">
                          <div class="flex-s-c">
                              <img v-if="!item.subscriptionId" src="@/assets/img/shop/new/coin_price_new.jpg" alt="coin" class="coin-img"/>
                              <img v-if="item.subscriptionId" src="@/assets/img/shop/new/coin_price_new_sub.png" alt="coin" class="coin-img"/>
                              <span class="item-coin-num">{{item.coinNum}}</span>
                              <div class="item-status text-ellipsis" style="white-space: pre-wrap;" :class="{'fail': item.orderStatus === 10 || item.orderStatus === 11}">{{getOrderStatus(item.orderStatus)}}</div>
                          </div>
                          <!-- <div class="item-btn-info text-ellipsis"
                                    v-if="item.companyCode === 'dlocal' && item.orderStatus === 1 && (item.paymentInfo && item.paymentInfo.redirectUrl)"
                                    @click="goOrderInfo(item.paymentInfo)"
                                >{{$t('shop.paymentInfo')}}</div> -->
                                <button @click="report(item)"
                                        v-if="item.orderStatus === 1 ||
                                    item.orderStatus === 10 ||
                                    item.orderStatus === 11 ||
                                    item.orderStatus === 12 ||
                                    item.orderStatus === 22 ||
                                    item.orderStatus === 30 ||
                                    item.orderStatus === 31 ||
                                    item.orderStatus === 32 ||
                                    item.orderStatus === 43"
                                        class="item-report text-ellipsis" style="white-space: pre-wrap; margin-top: 0;">{{$t('shop.refundReport')}}</button>
                      </section>
                      <p>{{$t('shop.purchaseCategory')}}：<span class="item-detail" v-if="!item.subscriptionId">{{$t('shop.coinsPackage')}}</span><span class="item-detail" v-if="item.subscriptionId">{{$t('shop.subscribeCoins')}}</span>
                      </p>
                      <p v-if="item.paymentInfo && item.paymentInfo.paymentCode"><span>{{$t('shop.paymentCode')}}：</span> <span class="item-detail">{{item.paymentInfo.paymentCode}}</span></p>
                      <p>{{$t('shop.refundAccount')}}： <span class="item-detail">{{item.currencySymbol}}{{item.priceStr}}</span></p>
                      <p>{{$t('shop.refundPlatform')}}： <span class="item-detail">{{item.channelRealName}}</span></p>
                      <p class="flex-s-s" :class="{'ar-text': $i18n.locale == 'ar'}">
                          <span class="flex-b-s text-label">{{$t('shop.refundOrderId')}}：</span><span class="item-detail item-id">{{item.orderId}}</span>
                      </p>
                      <p><span>{{$t('shop.refundTime')}}：</span><span class="item-detail">{{new Date(item.paymentTime || item.createTime).format('yyyy-MM-dd hh:mm:ss')}}</span></p>
                  </li>
              </ul>
            </div>
        </rc-popup>

        <rc-popup :visible="refundTypeShow" height="180px" @on-close="refundTypeShow=false">
            <h5 class="popup-title">{{$t('shop.refundProblemTypeTitle')}}</h5>
            <ul class="popup-content-type">
                <li class="item-type" :class="{'item-type-active': index === chooseTypeIndex}"
                    v-for="(item, index) in refundTypes" :key="index"
                    @click="chooseTypeItem(index)">{{item.desc}}
                </li>
            </ul>
        </rc-popup>

        <rc-popup :visible="telCodeShow" height="70vh" @on-close="telCodeShow=false">
            <h5 class="popup-title">{{$t('shop.refundPhoneChooseTitle')}}</h5>
            <ul class="popup-tel-code">
                <li v-for="(item, index) in telSortCode" :key="index" class="flex-b-c"
                    @click="chooseTelCodeItem(index)"
                    :class="{'active': activeSortCodeIndex === index}"
                >
                    <p class="flex-s-c">
                        <img :src="'/images/countries/'+item.countryCode+'.png'">
                        <span>{{item.name}}</span>
                    </p>
                    <p>+{{item.telSortCode}}</p>
                </li>
            </ul>
        </rc-popup>
        <!-- // TODO 统一组件mask-->
        <div class="popup-mask" v-show="refundTypeShow || orderShow || telCodeShow" @click="orderShow=false;refundTypeShow=false;telCodeShow=false"></div>

        <Modal v-model="verifyCodeShow" class-name="max-modal-width" @maskEvent="verifyCodeShow=false" @on-cancel="verifyCodeShow=false" @on-ok="verifySubmit">
          <div style="width: 80vw; padding: 24px 12px;box-sizing: border-box;">
            <p class="verify-code-title">{{$t('shop.refundVerifyDesc')}}</p>
              <section class="verify-code-content flex-s-c">
                  <input type="text" maxlength="6" :autofocus="verifyCodeShow" :placeholder="$t('shop.refundVerifyPlaceholder')" v-model="validateCode" class="verify-code-input">
                  <img v-show="verifyCodeImg" :src="verifyCodeImg" class="verify-code-img" @click="getVerifyCode"/>
                  <img class="verify-code-refresh" src="@/assets/img/shop/new/refresh.png" @click="getVerifyCode"/>
              </section>
            </div>
        </Modal>
    </section>
    </div>
  </div>
</template>

<script>
import rcPopup from '@/components/Shop/popup/popup';
import Modal from '@/components/Shop/modal';
import imgUpload from '@/components/imgUpload/imgUpload';
import { mapState } from 'vuex';
import { getEmailVerify, triggerService } from '@/util/shop';
import { getVerifyCode, submitRefundOrder, getOrderListByUserId } from '@/api/shop';
import contryData from '@/util/contry';
import Cookies from 'js-cookie';
import loading from '@/components/Shop/spin/loading';

const feedbackSource = sessionStorage.getItem('feedbackSource') || 2;
let submitFlag = false;
export default {
  name: 'payRefund',
  components: {
    imgUpload,
    Modal,
    rcPopup
  },
  data () {
    return {
      navBarVisible: Number(localStorage.getItem('fromApp')) !== 1,
      orderShow: false,
      refundTypeShow: false,
      telCodeShow: false,
      verifyCodeShow: false,
      form: {
        orderId: '',
        problemDesc: '',
        problemType: '',
        phone: '',
        billUrl: [],
        email: ''
      },
      validateCode: '',
      localRefundTypes: [{ desc: this.$t('shop.refundProblemRefund'), id: 1 }, { desc: this.$t('shop.refundProblemNoGot'), id: 2 }, { desc: this.$t('shop.refundProblemOther'), id: 9 }],
      refundTypes: [{ desc: this.$t('shop.refundProblemRefund'), id: 1 }, { desc: this.$t('shop.refundProblemNoGot'), id: 2 }, { desc: this.$t('shop.refundProblemOther'), id: 9 }],
      chooseTypeIndex: '',
      telSortCode: [],
      telSortCodeActive: {},
      verifyCodeImg: '',
      activeSortCodeIndex: '',
      orderInfo: {},
      canSubmit: false,
      imgUploadTip: this.$t('shop.refundImgUpload'),
      canUploadImg: false,
      enableEmail: false,
      orderList: null,
    };
  },
  computed: {
    ...mapState({
      userInfo: (state) => state.app.userInfo,
    }),
  },
  watch: {
    form: {
      handler (newName, oldName) {
        for (const i in newName) {
          if (i === 'phone') {
            continue;
          }
          if (!newName[i] && i !== 'billUrl' && i !== 'email') {
            console.log('bill url====');
            this.canSubmit = false;
            return newName;
          }
          if (this.enableEmail && ((sessionStorage.getItem('payRefundOrder') && sessionStorage.getItem('payRefundOrder').companyCode === 'pagsmile' && !getEmailVerify(newName[i])) || (this.enableEmail && i === 'email' && !getEmailVerify(newName[i])))) {
            console.log('email verify');
            this.canSubmit = false;
            return;
          }
          this.canSubmit = true;
        }
      },
      immediate: true,
      deep: true
    }
  },
  methods: {
    chooseOrder () {
      this.orderShow = true;
      this.chooseTypeIndex = '';
      this.form.problemType = '';
      this.problemChoose = '';
      // this.$nextTick(() => {
      //   this.$refs.payOrderList.init();
      // });
    },
    chooseType () {
      triggerService({ eventId: '14-1-1-73' });
      this.refundTypeShow = true;
    },
    chooseTypeItem (index) {
      this.chooseTypeIndex = index;
      this.form.problemType = this.refundTypes[index].id;
      this.problemChoose = this.refundTypes[index].desc;
      triggerService({ eventId: '14-1-1-67', problemType: this.form.problemType });
      this.timer = setTimeout(() => {
        this.refundTypeShow = false;
      }, 300);
    },
    chooseTelCode () {
      this.telCodeShow = true;
    },
    chooseTelCodeItem (index) {
      this.telSortCodeActive = this.telSortCode[index];
      triggerService({ eventId: '14-1-1-69', telSortCode: this.telSortCodeActive.telSortCode });
      this.activeSortCodeIndex = index;
      this.timer = setTimeout(() => {
        this.telCodeShow = false;
      }, 300);
    },
    /**
     * 如果没有staticsMark 则为本页面埋点， 有则为外部进入不需要埋点
     */
    reportOrderId (data, staticsMark = '') {
      if (!staticsMark) triggerService({ eventId: '14-1-1-66', orderId: data.orderId });
      console.log('report type', data);

      // 如果不支持退款，过滤不显示退款类型选项
      if (data.refundable === 0 || (data.orderStatus !== 10 && data.orderStatus !== 11)) {
        console.log('过滤去除refund type');
        this.refundTypes = this.localRefundTypes.filter(item => item.id !== 1);
      } else {
        this.refundTypes = this.localRefundTypes;
      }
      if (data.companyCode === 'pagsmile') {
        this.enableEmail = true;
      } else {
        this.enableEmail = false;
        this.form.email = '';
      }
      this.form.orderId = data.orderId;
      this.orderInfo = data;
      console.log('this.orderInfo', this.orderInfo);
      this.orderShow = false;
    },
    /**
     * 获取图片验证码
     */
    async getVerifyCode () {
      // this.$Spin.show();
      this.verifyCodeImg = await getVerifyCode({ userId: Cookies.get('userId') }) || '';
      // this.$Spin.hide();
    },
    /**
     * 检验信息 显示图片验证码
     */
    submit () {
      console.log(!this.canSubmit);
      if (!this.canSubmit) {
        triggerService({ eventId: '14-1-1-71', status: 2 });
        return;
      }
      console.log('though submit');
      triggerService({ eventId: '14-1-1-71', status: 1 });
      this.verifyCodeShow = true;
      this.getVerifyCode({ userId: Cookies.get('userId') });
    },
    /**
     * 图片验证码最终提交
     */
    async verifySubmit () {
      loading.show();
      if (submitFlag) return;
      submitFlag = true;
      if (this.canUploadImg) {
        try {
          const uploadImgRes = await this.$refs.imgUploadInstance.uploadImgs();
          if (!uploadImgRes) {
            this.$toast({
              html: 'Failed to upload image, please submit later'
            });
            loading.hide();
            submitFlag = false;
            return;
          }
        } catch (e) {
          this.$toast({
            html: 'Failed to upload image, please submit later'
          });
          loading.hide();
          submitFlag = false;
          return;
        }
      }
      const req = {
        userId: this.orderInfo.userId || Cookies.get('userId'),
        ...this.form,
        phone: `+${this.telSortCodeActive.telSortCode}${this.form.phone}`,
        validateCode: this.validateCode,
        feedbackSource: Number(feedbackSource)
      };
      const res = await submitRefundOrder(req);
      loading.hide();

      if ((res && res.code) || !res) {
        this.$toast({
          html: this.$t('shop.refundVerifyError') || ''
        });
        triggerService({ eventId: '14-1-1-72', status: 2 });
        submitFlag = false;
        return;
      }
      submitFlag = false;
      triggerService({ eventId: '14-1-1-72', status: 1 });
      this.$router.replace({ name: 'RefundBack' });
    },
    imgUpload (data) {
      console.log('imgUrls', data);
      this.form.billUrl = data;
    },
    triggerStatics (type) {
      switch (type) {
        case 0:
          triggerService({ eventId: '14-1-1-68', problemDesc: this.form.problemDesc });
          break;
        case 1:
          triggerService({ eventId: '14-1-1-70', phone: `+${this.telSortCodeActive.telSortCode}${this.form.phone}` });
          break;
        default:
          break;
      }
    },
    closeBtn () {
      this.$router.go(-1);
    },
    getOrderStatus (value) {
      // 订单状态 1未支付 10已支付 11已送达/完成 12退款驳回 20退款中 21已退款 22退款失败 30已超时 31已取消 32 充值失败 41 chargeback 42 chargeback evidence required, 43 order chargeback dispute was won, 44 order chargeback dispute was lost, 45 order chargeback dispute was won and add coin completed
      const orderStatus = {
        1: this.$t('shop.refundOrderProcessing'),
        10: this.$t('refundOrderSuc'),
        11: this.$t('shop.refundOrderSuc'),
        12: this.$t('shop.refundRejected'),
        20: this.$t('shop.refundHandling'),
        21: this.$t('shop.refundCharged'),
        22: this.$t('shop.refundOrderFail'),
        23: this.$t('shop.refundHandling'),
        30: this.$t('shop.newPaymentFailed'),
        31: this.$t('shop.cancelled'),
        32: this.$t('shop.purchaseFailed'),
        41: this.$t('shop.refundHandling'),
        42: this.$t('shop.refundHandling'),
        43: this.$t('shop.refundOrderSuc'),
        44: this.$t('shop.refundRejected'),
        45: this.$t('shop.refundOrderSuc')
      };
      return orderStatus[value];
    },
    /**
     * 报告问题
     */
    report (item) {
      if (this.transUserId) {
        console.log('refund page click report');
        this.$emit('report', item);
        return;
      }
      sessionStorage.setItem('payRefundOrder', JSON.stringify(item));
      this.reportOrderId(item);
    },
  },
  created () {
    this.timer = setTimeout(async () => {
      this.telSortCode = contryData || [];
      const countryCode = 'CN';
      this.telSortCodeActive = this.telSortCode.find(item => item.countryCode === countryCode) || {};
    }, 300);
    if (this.$route.query.item) {
      this.reportOrderId(JSON.parse(sessionStorage.getItem('payRefundOrder') || '{}'), 1);
    }
  },
  mounted () {
    getOrderListByUserId(Cookies.get('userId')).then(data => {
      this.orderList = data;
    });
  },
  beforeDestroy () {
    clearTimeout(this.timer);
    this.timer = null;
  }
};
</script>
<style lang="less" rel="stylesheet/less">
@import url("./coins.less");
.flex(@horiz, @vertical) {
    display: flex;
    justify-content: @horiz;
    align-items: @vertical;
}
.flex-c-c {
    .flex(center, center)
}
.flex-b-c {
    .flex(space-between, center)
}
.flex-b-s {
    .flex(space-between, flex-start)
}
.flex-s-c {
    .flex(flex-start, center)
}
.flex-s-s {
    .flex(flex-start, flex-start)
}
.flex-column-b-s {
    .flex(space-between, flex-start);
    flex-direction: column;
}
.flex-column-b-c {
    .flex(space-between, center);
    flex-direction: column;
}

.rc-ui-warp.max-modal-width{
  width: 100%;
}

.inner > .refund-wrap {
    font-size: 12px;
    padding: 12px;
    color: #000;
    .ich-list-angle {float: right; width: 14px ;height: 14px ;margin-top: 6px; background-repeat: no-repeat;}
    .angle-right-black{
        background-image: url(~@/assets/img/shop/Icon/angle-right-black.svg);
    }
    .rc-close-gray{
        background-repeat: no-repeat;
        background-size:  16px 16px;
        background-position: right 4px;
        background-image: url(~@/assets/img/shop/Icon/rc-close-gray.svg);
    }
    > h5 {
        text-align: center;
        font-size: 12px;
        color: #333333;
        font-weight: bold;
    }
    .refund-info {
        > li {
            width: 100%;
            box-sizing: border-box;
            margin: .4rem auto 0;
            > h6 {
                color: #1a1a1a;
                font-weight: bold;
                font-size: 12px;
                margin-bottom: .1rem;
            }
            .item-select {
                height:46px;
                box-sizing: border-box;
                background-color: #fff;
                border-radius: 6px;
                padding: 0 4px;;
                border: 1px solid #E8E8E8;
                .item-text {
                    width: 200px;
                    overflow: hidden;
                    font-size: 12px;
                    color: #000;
                    text-overflow: ellipsis;
                    white-space: nowrap;
                    > span {
                        color: #000;
                        font-size: 12px;
                    }
                    .time {
                        color: #c6c6c6;
                        font-size: 12px;
                    }
                    &.spec {
                        color: #cfcfcf;
                    }

                }
            }
        }
        .refund-user {
          height:46px;
          box-sizing: border-box;
          background-color: #fff;
          border-radius: 6px;
          padding: 0 4px;;
          border: 1px solid #E8E8E8;
            > img {
                width: 36px;
                height: 36px;
                border-radius: 18px;
                margin-right: 12px;
                margin-left: 6px;
            }
            .name {
                color: #000;
                font-size: 13px;
                font-weight: bold;
            }
            .id {
                color: #999999;
                font-size:13px;
            }
        }
        .refund-desc {
            border: 1px solid #E8E8E8;
            border-radius: 6px;
            background-color: #fff;
            position: relative;
            color: #000;
            padding: 2px;
            > textarea {
                font-size: 12px;
                width: 100%;
                height:130px;
                outline: none;
                &::placeholder {
                    color: #CFCFCF;
                }
            }
            .textarea-right {
                text-align: right;
                color: #000000;
                font-size: 12px;
                padding-bottom: 5px;
                width: 100%;
                box-sizing: border-box;
                border-bottom: 1px solid #ECECEC;
            }
            .rc-img-upload {
                margin-top: .2rem;
            }
        }
        .refund-phone {
          color:#000;
            img {
                display: inline-block;
                width: 24px;
                height: 24px;
                margin-right: 6px;
            }
            > input {
                width: 340px;
                height: 44px;
                font-weight: normal;
                margin-left: 6px;
                font-size: 12px;
                outline: none;
                &::placeholder {
                    color: #CFCFCF;
                }
            }
            .rc-triangle {
                display: inline-block;
                width: 0;
                height: 0;
                margin-left: 0px;
                border-top: 6px solid #000;
                border-left: 4px solid #f7f7f7;
                border-right: 4px solid #f7f7f7;
            }
        }
    }
    .submit {
        width: 160px;
        height: 40px;
        font-size: 12px;
        line-height: 40px;
        display: block;
        background: #6B10FF;
        color: #ffffff;
        text-align: center;
        border-radius: 20px;
        margin:16px auto 0;

        &[disable] {
            background-color: #CFCFCF;
        }
    }
    .email-input {
        width: 100%;
        height: 100%;
        background-color: transparent;
        &:focus {
            border: none;
            outline: none;
        }
    }
    .popup-title {
        height: 40px;
        line-height: 40px;
        font-size: 14px;
        text-align: center;
    }
    .popup-order-list {
        height: calc(70vh - 1rem);
        overflow-y: scroll;
    }

    .popup-content-type {
        height: auto;
        padding: 6px 8px;
        box-sizing: border-box;
        .item-type {
            margin: 10px auto;
            width: auto;
            height: 40px;
            line-height: 40px;
            text-align: center;
            border-radius: 4px;
            margin-top: 4px;
            border: 1px solid rgba(232, 232, 232, 1);
            &.item-type-active {
                background-color: #E8E8E8;
            }
        }
    }
    .popup-tel-code {
        box-sizing: border-box;
        height: 65vh;
        overflow-y: scroll;
        > li {
            height: 36px;
            padding: 0 12px;
            border-bottom: 1px solid #f7f7f7;
            img {
                width: 16px;
                height: 16px;
                margin-right: 4px;
            }
        }
        .active {
            background-color: #E8E8E8;
        }
    }
    .popup-mask {
        position: fixed;
        top: 0;
        left: 0;
        width: 100vw;
        height: 100vh;
        z-index: 999;
        background-color: rgba(0, 0, 0, .5);
    }

    .base-color-gray {
        color: #CFCFCF !important;
    }

    .verify-code-title {
        padding-top: 10px;
    }
    .verify-code-content {
        margin: 30px auto 0;
        padding-bottom: 4px;
        font-size: 13px;
        border-bottom: 1px solid #DFDFDF;
        .verify-code-input {
            font-size: 13px;
            width: 240px;
            outline: none;
            caret-color: #6B10FF;
            overflow: hidden;
            white-space: nowrap;
            text-overflow: ellipsis;
            &::placeholder {
                color: #CFCFCF;
            }
        }
        .verify-code-img {
            width: 60px;
            height: 24px;
            margin-right: 4px;
        }
        .verify-code-refresh {
            width: 14px;
            height: 14px;
        }
    }
    .disable {
        background-color: #CFCFCF;
    }
    .ich-list-angle {
        margin-top: 0 !important;
    }
    .order-list {
      box-sizing: border-box;
      color: #999999;
      font-size: 12px;
      margin: 16px 10px;
      font-weight: bold;
      padding-bottom: 50px;
    }
    .order-item {
        position: relative;
        box-sizing: border-box;
        background-color: #ffffff;
        margin: 0 auto 10px;
        border-radius: 10px;
        padding: 12px;
        border: 1px solid rgba(224, 224, 224, 1);
        > section {
            margin-bottom: 6px;
            padding-bottom: 4px;
            border-bottom: 2px #F7F7F7 dashed;
            .coin-img {
                width: 24px;
                height: 22px;
                margin-right: 12px;
            }
            .item-coin-num {
                color: #000;
                font-size: 12px;
            }
            .item-status, .item-btn-info {
                max-width: 130px;
                border-radius: 4px;
                padding: 0 4px;
                color: #ffffff;
                height: 24px;
                text-align: center;
                line-height: 24px;
                margin-left: 8px;
                background-color: #f7b500;
                &.fail {
                    background-color: #6dd35a;
                }
            }
            .item-status {
              padding: 0 4px;
            }
            .item-btn-info {
                background: #169bd5;
                margin-left: auto;
                margin-right:8px;
                padding: 4px;
            }
            .item-report {
                max-width: 130px;
                /*height: .5rem;*/
                font-size: 12px;
                font-weight: bold;
                height: 34px;
                line-height: 34px;
                text-align: center;
                border-radius: 15px;
                color: #fff;
                padding: 0 10px;
                background: rgba(107, 16, 255, 1);
            }
            .text-ellipsis {
                display: inline-block;
                white-space: nowrap !important;
                text-overflow: ellipsis;
                overflow: hidden;
            }
        }
        > p {
            margin-bottom: 4px;
            font-weight: normal;
            color: #000;
            .item-detail {
                color: #999999;
                &.item-id {
                    display: inline-block;
                    width: 140px;
                }
            }
            .item-copy {
                width: 10px;
                height: 10px;
                margin-top: 6px;
                margin-right: 6px;
            }
        }
    }
}
.rc-modal-fix {
  text-align: center;
}
[lang="ar"],
[lang="he"],
[lang="ur"] {
  .inner  > .refund-wrap  .order-list {
    direction: rtl;
  }
}
</style>
