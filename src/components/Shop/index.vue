<template>
  <div class="shop-page" @click.stop="() => {}"> <!-- 聊天消息也进入点击问题处理-->
    <div class="coins" >
        <section>
          <div class="top" v-if="loading">
            <div class="section-title">
                <span class="sequence">1</span>
                <span>{{$t('shop.codaFlowSelectCoins')}}</span>
            </div>
            <div class="sel-country" @click.stop="selCountryClick">
                  <img :src="`https://p.gomeet.today/static/img/countries/${selCountryCode}.png`"
                          class="country-choose"/>
                  <span class="name" :key="countryName">{{countryName}}</span>
                  <span class="rc-triangle" :class="{
                    'up': isShowSelCountry
                  }"></span>
            </div>
            <div class="country-box" v-if="showCountry">
              <div class="country-btn" @click.stop="btnCountry">
                <img src="@/assets/img/counntry-bg.png" alt="">
                <div class="text">You can switch countries and choose more appropriate payment channels.</div>
              </div>
            </div>
            <!-- 国家选择 -->
            <div class="country-content" v-if="isShowSelCountry">
                <div>
                  <div class="dialog-title" v-if="stateList.length">{{$t('shop.codaFlowHotCountries')}}</div>
                  <div class="state-list dialog-list">
                    <ul>
                        <li v-for="(item, index) in stateList" :key="index" @click.stop="actSelect('state', item)">
                          <div>
                            <div class="dialog-icon">
                                  <img :src="`https://p.gomeet.today/static/img/countries/${item.ab}.png`" alt="">
                              </div>
                              <div class="dialog-list-name foldTwo">{{ item.countryNameEn }}</div>
                          </div>
                        </li>
                    </ul>
                  </div>
                  <div class="dialog-title" v-if="countryList.length">{{$t('shop.codaFlowAllCountries')}}</div>
                  <div class="country-list dialog-list">
                    <ul>
                      <li v-for="(item, index) in countryList" :key="index" @click.stop="actSelect('country', item)">
                        <div>
                          <div class="dialog-icon">
                              <img :src="`https://p.gomeet.today/static/img/countries/${item.ab}.png`" alt="">
                          </div>
                          <div class="dialog-list-name foldTwo">{{ item.countryNameEn }}</div>
                        </div>
                      </li>
                    </ul>
                  </div>
                </div>
            </div>
          </div>
          <!-- 取消展示首充banner -->
          <div class="top-banner" v-if="false && !isPaidUser && coinsList && coinsList.length">
              <div>
                  <p>+{{$t('shop.firstPay')}}</p>
                  <p>{{$t('shop.firstPayInfo')}}</p>
              </div>
              <img src="@/assets/img/shop/top-banner.png" alt="">
          </div>
          <div class="top-banner" v-if="!isPaidUser && coinsList && coinsList.length">
              <img src="@/assets/img/shop/top-banner2.png" alt="">
          </div>
          <ul class="coins-wrap" v-if="coinsList && coinsList.length">
              <li v-for="(item, index) in coinsList" :key="index" :class="{ 'first-pay-item': (item.coinType === 1),
              'first-pay-hidden': (item.coinType === 1 && isPaidUser),
              'first-pay-item-single': (firstPayCountAndIdx.firstPayCount % 2  === 1 && index === firstPayCountAndIdx.lastFirstPayIndex),}">
                  <div :class="{
                    'coin-box': true,
                    'coin-box-active': currentCoin === index,
                    'first-pay': (item.coinType === 1),
                    'first-pay-single': (firstPayCountAndIdx.firstPayCount % 2  === 1 && index === firstPayCountAndIdx.lastFirstPayIndex)
                    }"
                    @click.stop="handleCoins(index)"
                    >
                      <template v-if="item.coinType !== 1">
                          <div class="coin-discount" v-if="item.discount != '' && item.discount !='0%'">{{item.discount}} Off</div>
                          <div class="img">
                              <img :src="item.coinImgDefault" alt="" class="coins-img" loading="lazy"/>
                              <figcaption><span class="coin-price">{{item.totalCoinNum}}</span></figcaption>
                          </div>
                      </template>
                      <template v-if="item.coinType === 1 && !isPaidUser" >
                        <div class="first-coins">
                          <p>{{$t('shop.firstPayCoin')}}</p>
                          <div>{{item.totalCoinNum}}</div>
                        </div>
                      </template>
                  </div>
              </li>
          </ul>
        </section>
        <section>
          <div class="top"  v-if="loading && channelList && channelList.length > 0">
            <div class="section-title">
                <span class="sequence">2</span>
                <span>{{$t('shop.codaFlowSelectPayMethod')}}</span>
            </div>
          </div>
          <template  v-if="channelList && channelList.length > 0">
            <ul class="channel-list">
                <li v-for="(item, index) in channelList" :key='index + selCoin.totalCoinNum'
                      :class="{
                        'channel-item': true,
                        'channel-item-active': index === channelChecked,
                        'channel-item-unavailable': item.isShow !== 2
                      }"
                      @click.stop="handleChannel(index)"
                  >
                    <div class="channel-logo">
                      <img v-if="item.channelUrl && !item.channelIcon" :src="`${imgBase}${item.channelUrl}`" :alt="item.channelCode" loading="lazy"/>
                      <img v-if="item.channelIcon" :src="item.channelIcon" :alt="item.channelCode" loading="lazy"/>
                    </div>
                    <div class="channel-name" v-if="item.isShow === 2">
                        <div class="channel-name-desc">{{item.channelName ? item.channelName : (item.channelCode | removeLine)}}</div>
                        <div class="right">
                          <span class="channel-price">{{item.currencyMark}} {{item.price}}</span>
                          <b class="channel-arrow">
                              <img height="20px" src="data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABwAAAAcCAMAAABF0y+mAAABm1BMVEVHcExd0f/jhv824/9az/824//wg/8A///eif/sgf9V0v/Yk/865v9A3v/lhf/fjv9G2P/Ilf9qyP/8e/93wf/7ev/7e//zgP//AP/8ev/7e//0fv////+rpv+Vsf/Cmf+Ntf+crf+GuP894P834/9N1/893/9T1P9hzP9xxP9T0/9hyv844//Okf/Xjf/Wjf9F2/9F2v9M2P815P9M1/814/9N2/9wxP+kqf/Qkf+5nP+zov9/vP+jqf+5oP+AvP+zof93wP/Ilf+5nf/Pkf9hy/9az//eif/Wjf/lhf+jqP+crP9+vP+GuP+NtP9wxP9E2/+yoP/9/f/sgf/Bmf/Amf////9T0/9L1/+qpP9pyP9ox/9ww/+UsP9S0/893/+yof+rpP+VsP9M1//0ff9px//Xjf/0fv883//tgf+qpf+jqf9/vP/y+P+Zw//X6v/MwP+Dvv+0zf/l5//Hw/+fr//f6v+Rtv/h6f/j6P+5yv++yP/zfv+Mw/+Nw//Grv/d7P/HsP+Kuv/Dxf/Cxf/d6/+Ku/+Ys/+Ysv+NGUSrAAAAQXRSTlMAIT/C6+chAfnHPyE+VOs/IVRU5z7CiVQB+D7YAcL42Of4wtiKP9j5x9j5x4nH6+vHx+v46/g/2OfHPomJ5z6KioNbjgYAAAGLSURBVCjPZZNlWwJBEIBHEVFRQVEUFLu7u2iQEA89EVBSwUKxu+tnu7e7F+B+fZ+Jd2YWgD5FzUJbS1PrjGF+rhHyXvW00e3x7rhWY1Fzc1UOKujZC1O4vW7eNA0qRVZWZA2GjccebxzDDZNlWMWzzj6bNbgmpkXQUVJImHpi12YNYRinaS0Oe2UxhiMBBFHN5wyuGSXQWcqxCl9gC0eeMOcoMoYj9+1Ofx3ya8cQ1TxlmXvX0SFuCEX6G+qhPOJLkJrZL5Z54BtCMKmHjgiO5Dy/r1nmk2/IeZDUgiztS3BpOc+bW5a5FNKmakEeIRCr/NyxzJmQVgPjKK3oeXXBMm8krf9RB5ME0tly8IXCpA7kad4TwV+clnqmNCCL8J7u/w0NCJ7ud6TyIfHUckOgntlXbggSTz0ounhPPD66Tzo+NHjqiQYv7pMMHmCUej5lpPskKwP1mOgp7pMuG6a6JZdA98mfCTkwCuk+h1SS0+wP5RzYrDL3qHvFu807avwdlrnvsGhYWRK+wx/nEr48gxahdAAAAABJRU5ErkJggg=="/>
                          </b>
                        </div>
                      </div>
                      <div v-else class="not-available">
                          {{$t('shop.codaFlowCoinNotAvailable')}}
                      </div>
                  </li>
            </ul>
          </template>
      </section>
    </div>
    <div class="empty-wrap" v-show="loading && (coinsList && coinsList.length === 0)">
         <p class="img"></p>
        <p>Sorry, no gold for sale</p>
    </div>
    <div class="protocol" v-if="coinsList && coinsList.length > 0">
        <section class="center title">🔒 {{$t('shop.secureInfoTitle')}}</section>
        <section class="info-aaa">
          <span @click="secureInfoClick" v-html="$t('shop.secureInfoContent', {email: `<a href='mailto:customer.service@yaarlive.com' style='color:#62ED18'>customer.service@yaarlive.com</a>`})"></span>
        </section>
    </div>
  </div>
</template>

<script>
import { getCoinAndChannelOld, queryCountryListHot } from '@/api/shop';
import { apiGetUserPayStatus } from '@/api/user';
import { toGlobal } from '@/util/shop';
import { getBrowser, getPlatformType } from '@/util/browser';
import { logReport } from '@/util/logReport';
import { mapState } from 'vuex';
import countries from '@/util/contry';
import Cookies from 'js-cookie';
import { choosePay } from './payPlatforms/index'; // 命令模式支付路由

export default {
  name: 'Shop',
  data () {
    const ab = localStorage.getItem('RC_USER_COUNTRY_CODE');
    const selCountryCode = toGlobal(ab);
    let countryName = '';
    countries.forEach(element => {
      if (element.countryCode === selCountryCode) {
        countryName = element.name;
      }
    });
    return {
      selCountryCode,
      countryName,
      coinsList: [], // 金币包列表
      isLoadingCoins: false,
      channelList: [], // 渠道列表
      allChannelList: [], // 国家全量渠道
      currentCoin: 0, // 当前金币包索引
      selCoin: {},
      channelChecked: '', // 渠道选中索引
      currentCountryChannels: [],
      isPaidUser: true, // 是否是付费用户
      firstPayCountAndIdx: {
        firstPayCount: 0,
        lastFirstPayIndex: -1
      },
      loading: false,
      imgBase: 'https://h5.livuchat.com/images',
      queryObj: {
        icon500: '', // 500 金币包
        icon1000: '', // 1000 金币包
        icon5000: '', // 5000 金币包
        icon10000: '', // 10000 金币包
        bgOne: '', // 一个特惠包时的图
        bgTwo: '', // 两个特惠包时的图
        bgDefault: '', // 普通包的图
        bgDefaultActive: '', // 普通包的选中状态
        bgOneActive: '', // 选中状态 一个特惠包时的图
        channelPriceStyle: '', // 渠道样式
        bannerTop: '', // 多个用逗号分开
        bannerBottom: '' // 多个用逗号分开
      },
      isShowSelCountry: false
    };
  },
  computed: {
    ...mapState({
      userInfo: (state) => state.app.userInfo,
    }),
  },
  props: {
    showCountry: {
      type: Boolean,
      default: false
    },
    startTime: {
      type: Number,
    },
    changeIsSroll: {
      type: Function
    },
  },
  methods: {
    getCountryName (selCountryCode) {
      let countryName = '';
      countries.forEach(element => {
        if (element.countryCode === selCountryCode) {
          countryName = element.name;
        }
      });
      return countryName;
    },
    secureInfoClick (event) {
      if (event.target.tagName === 'A') {
        logReport({
          eventId: '14-2-1-7',
        });
      }
    },
    btnCountry () {
      this.$emit('changeIsSroll');
      this.$store.commit('setCountry', false);
      this.isShowSelCountry = true;
      logReport({
        eventId: '14-2-1-21',
      });
    },
    async getCoinsAndChannleData (selCountry) {
      const reulst = await getCoinAndChannelOld({ countryCode: selCountry });
      this.loading = true;
      let res;
      if (reulst.code === 0) {
        res = reulst.data;
      }
      const allChannelList = [];
      const coinsList = [];
      const channel = res.channel; // 当前国家全部渠道
      let coinChannel = res.coinChannel; // 当前金币包和金币包对应的有效渠道
      if (!coinChannel) {
        return;
      }
      // 过滤 20000 50000金币包
      coinChannel = coinChannel.filter(item => {
        const flag = item.rcpCoinCountry.totalCoinNum <= 10000;
        if (flag) {
          const channelAndPayCompanyDtoList = [...item.channelAndPayCompanyDtoList];
          item.channelAndPayCompanyDtoList = channelAndPayCompanyDtoList.filter(c => {
            let ret = true;
            if (c.payCompanyCode === 'payermax') {
              if (getBrowser() === 'Safari' && getPlatformType() !== 'mobile' && c.thirdPaymentChannelCode === 'APPLEPAY') {
                return false;
              }
              if (getBrowser() !== 'Safari' && c.thirdPaymentChannelCode === 'APPLEPAY') {
                ret = false;
              }
            }
            return ret;
          });
        }
        return flag;
      });

      let firstPayCount = 0; // 首充包个数
      let lastFirstPayIndex = -1;
      coinChannel.forEach((item, index) => {
        if (item.rcpCoinCountry.totalCoinNum) {
          const pic = this.toolCoinImgHandle(item.rcpCoinCountry.totalCoinNum);
          item.rcpCoinCountry.coinImg = require(`@/assets/img/shop/new/plan-b-${pic}.png`);
          item.rcpCoinCountry.coinImgDefault = require(`@/assets/img/shop/new/plan-b-${pic}.png`);
        }
        if (item.rcpCoinCountry.coinType === 1) {
          firstPayCount += 1;
          lastFirstPayIndex = index;
        }
        coinsList.push(item.rcpCoinCountry);
        allChannelList.push(item.channelAndPayCompanyDtoList);
      });

      channel.forEach(item => {
        item.channelUrl = item.icon;
        delete item.icon;
      });
      this.currentCountryChannels = channel;
      this.allChannelList = allChannelList;
      this.coinsList = coinsList;
      this.firstPayCountAndIdx = { firstPayCount, lastFirstPayIndex };
      this.channelList = allChannelList[0];
      this.handleCoins(this.isPaidUser && lastFirstPayIndex >= 0 ? (lastFirstPayIndex + 1) : 0, true);
      logReport({
        eventId: '14-2-1-13',
        freeName2: { durationTime: new Date().getTime() - this.startTime }
      });
    },
    /**
         * 查询用户是否是首充
         */
    async getUserPayStatus () {
      const res = await apiGetUserPayStatus({ userId: this.$store.state.app.userInfo.id });
      if (res.code === 200) {
        this.isPaidUser = res.data;
      }
    },
    toolCoinImgHandle (coinNum) {
      if (coinNum <= 500) return '500';
      else if (coinNum > 500 && coinNum <= 1000) return '1000';
      else if (coinNum > 1000 && coinNum <= 5000) return '5000';
      else if (coinNum > 5000) return '10000';
    },
    handleCoins (i, defaultTrack) {
      let index = i;
      // 如果url携带coinCode
      const coinCode = this.$route.query.coinCode || '';
      if (coinCode && defaultTrack) {
        const mIndex = this.matchCoin(coinCode); // 匹配金币包得到索引
        index = mIndex === -1 ? 0 : mIndex;
      }
      if (!this.coinsList[index]) return;
      this.currentCoin = index;
      this.channelChecked = '';
      this.currentSubscriptionChecked = '';
      this.channelList = this.matchChannels(index);
      const selCoin = this.coinsList[index];
      this.selCoin = selCoin;
      console.log('selCoin', selCoin);
      // 高级匹配
      window.ttq.identify({
        email: localStorage.getItem('RC_USER_EMAIL') || '',
        phone: localStorage.getItem('RC_USER_PHONE') || ''
      });
      window.ttq.track('ClickButton', { content_name: selCoin.sort });
      if (!defaultTrack) {
        logReport({
          eventId: '14-2-1-10',
          freeName2: {
            coinType: selCoin.coinType,
            coinCode: selCoin.coinCode
          }
        });
      }
    },
    matchChannels (index) {
      const matchedChannelsActive = [];
      // let matchedChannelsInactive = []
      const originalKeyChannels = {};
      this.allChannelList[index].forEach(item => {
        item.channelType = 'coin'; // 用来标识当前渠道是金币包渠道还是订阅包渠道 coin:金币包， subscription 订阅包
        originalKeyChannels[item.channelCode] = item;
      });
      this.currentCountryChannels.forEach(item => {
        if (originalKeyChannels[item.code]) {
          originalKeyChannels[item.code].channelUrl = item.channelUrl; // 使用全量渠道logo进行展示
          originalKeyChannels[item.code].channelName = item.name; // 使用全量渠道name进行展示
          matchedChannelsActive.push(originalKeyChannels[item.code]);
          return;
        }
        matchedChannelsActive.push(item);
      });
      return matchedChannelsActive;
    },
    handleChannel (index) {
      if (this.channelList[index].isShow !== 2) return;
      const activeChannel = this.channelList[index];
      const activeCoin = this.coinsList[this.currentCoin];
      this.channelChecked = index;
      console.log(activeChannel, activeCoin, '9999');
      // 高级匹配
      window.ttq.identify({
        email: localStorage.getItem('RC_USER_EMAIL') || '',
        phone: localStorage.getItem('RC_USER_PHONE') || ''
      });
      window.fbq('track', 'InitiateCheckout', { content_name: activeChannel.channelName, currency: activeChannel.currency, value: activeChannel.price });
      window.ttq.track('ClickButton', { content_category: activeChannel.payCompanyCode, content_name: activeChannel.channelName, currency: activeChannel.currency, value: activeChannel.price, price: activeChannel.price });
      logReport({
        eventId: '14-2-3-2',
        freeName2: { channelName: activeChannel.channelName, code: activeChannel.channelCode + '-' + activeChannel.coinCode + '-' + activeCoin.coinType },
      });
      if (['giropay', 'ideal', 'codapay'].includes(activeChannel.payCompanyCode)) {
        this.toolPay(activeChannel);
      } else {
        this.$router.push({
          name: 'CoinPayPage',
          query: {
            country: this.selCountryCode,
            channelCode: this.channelList[index].channelCode,
            channelIndex: index,
            currentCoin: this.currentCoin
          }
        });
      }
    },
    async toolPay (activeChannel) {
      const kochavaDeviceId = localStorage.getItem('kv_id');
      const activeCoin = activeChannel.channelType === 'coin' ? this.coinsList[this.currentCoin] : this.subscriptionCoinList[this.currentSubscriptionChecked];
      // checkout 中可能有 checkout-esp 这种方式
      const payTypes = activeChannel.payCompanyCode.split('-');
      const payCompany = payTypes[0];
      const payChannel = payTypes[1];
      if (payCompany === 'checkout' && payChannel) {
        activeChannel.payCompanyCode = payCompany;
        activeChannel.payChannel = payChannel;
      }

      // codapay 的订阅包渠道 payCompanyCode 是 codapay-subscription
      if (activeChannel.payCompanyCode === 'codapay-subscription') {
        activeChannel.payCompanyCode = payCompany;
        activeChannel.payChannel = payChannel;
      }

      const data = {
        channelName: activeChannel.channelName,
        channelCode: activeChannel.channelCode,
        companyCode: activeChannel.payCompanyCode,
        code: activeChannel.coinChannelCode, // 金币code码
        userId: this.userInfo.userId, // 计算转换得到实际的userId
        type: 7,
        coins: activeCoin.totalCoinNum,
        price: activeChannel.price,
        currency: activeChannel.currency,
        currencyMark: activeChannel.currencyMark,
        pageName: this.pathName,
        adFrom: this.linkFrom,
        couponId: this.$route.query.couponId || '',
        locale: navigator.language.split('-')[0],
        country: this.selCountryCode,
        kochaveAppId: baseConfig.kochavaAppId,
        kochaveDeviceId: kochavaDeviceId,
        source: baseConfig.appName === 'Vivah' ? 'LivU' : baseConfig.appName,
        payChannel: activeChannel.payChannel,
        thirdPaymentChannelCode: activeChannel.thirdPaymentChannelCode || '',
        isMultistage: activeChannel.isMultistage || '', // 是否有二级渠道
        channelType: activeChannel.channelType // 渠道的类型 coin:金币包， subscription 订阅包
      };
      // dlocal 的 Payins 支付方式
      if (activeChannel.payCompanyCode === 'dlocal') {
        data.paymentMethodFlow = activeChannel.paymentMethodFlow;
        data.paymentMethodId = activeChannel.paymentMethodId;
      }
      data.channelLogo = activeChannel.channelUrl;
      localStorage.setItem('payInfo', JSON.stringify(Object.assign({
        routerName: this.$route.name,
        totalCoin: activeCoin.totalCoinNum
      }, data)));
      Cookies.set('payInfo', JSON.stringify(Object.assign({
        routerName: this.$route.name,
        totalCoin: activeCoin.totalCoinNum
      }, data)), { expires: 7 });
      localStorage.setItem('rlen', history.length);
      this.spinShow = true;
      await choosePay.call(this, data.companyCode, data);
      this.spinShow = false;
    },
    closeSelCountry () {
      this.isShowSelCountry = false;
    },
    selCountryClick () {
      this.isShowSelCountry = !this.isShowSelCountry;
      this.$store.commit('setCountry', false);
      this.$emit('changeIsSroll');
      logReport({
        eventId: '14-2-1-6',
      });
    },
    actSelect (type, item) {
      if (item.name === this.selCountryCode) {
        return;
      }
      this.selCountryCode = item.ab;
      this.countryName = this.getCountryName(item.ab);
      console.log(this.getCountryName(item.ab));
      this.isShowSelCountry = false;
      this.getCoinsAndChannleData(this.selCountryCode);
      logReport({
        eventId: '14-2-1-22',
        freeName2: { countryCode: this.selCountryCode }
      });
      // localStorage.setItem('RC_USER_COUNTRY_CODE', item.ab);
    },
    async getCountryData () {
      const reulst = await queryCountryListHot();
      let list;
      if (reulst.code === 0) {
        list = reulst.data;
      }
      if (!list) return;
      if (list.countryList) {
        const countryList = JSON.parse(JSON.stringify(list.countryList));
        this.countryList = Object.freeze(countryList) || [];
      }
      if (list.stateList) {
        const stateList = JSON.parse(JSON.stringify(list.stateList));
        this.stateList = Object.freeze(stateList) || [];
      }
    },
    async init () {
      await this.getUserPayStatus();

      // 加载金币包
      this.getCoinsAndChannleData(this.selCountryCode);

      this.getCountryData();
    }
  },
  async mounted () {
    this.init();
    logReport({
      eventId: '14-2-1-1',
      freeName1: this.selCountryCode
    });
  },
};
</script>

<style lang="less" scoped>
@import url("./index.less");
</style>
