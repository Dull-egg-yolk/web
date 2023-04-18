import { mapActions, mapState } from 'vuex';
import { apiRtmInviter, apiTimeout, apiGetCallInfo } from '@/api/call';
import { logReport } from '@/util/logReport';
import { getGiftList } from '@/api/message';
import i18n from '@/i18n';
import { getDiscountCoin } from '@/components/messageBox/htmlData';
const coin = require('@/assets/img/icon-coin.png');

let callId = 0;
let rtcLoading = false;

export default {
  data () {
    return {
      callErrorCode: {
        100001: i18n.t('app.chat_message_content_call_no_answer'), // '对方正忙，请稍后再拨',
        100002: i18n.t('app.chat_message_content_call_no_answer'), // '对方正忙，请稍后再拨',
        100003: i18n.t('app.toast_video_call_need_add_friend'), // todo'无法呼叫',
        100004: i18n.t('app.dialog_goddess_wall_gold_not_enough_message'), // 金币不足，请充值后再拨',
        100000: i18n.t('base.reply'), // todo'呼叫失败，请重试'
        200: i18n.t('base.reply'), // todo'呼叫失败，请重试'
      }
    };
  },
  computed: {
    ...mapState({
      isMatchCall: (state) => state.app.isMatchCall
    })
  },
  methods: {
    ...mapActions(['getLoginState']),
    // 拨打电话
    // callLocation 不同页面发起的邀请传不同的值
    // 11 女神墙 14 chat聊天页  26 个人主页  1000 匹配
    async callAction (data, callLocation) {
      if (!data.id && !data.hostId) return;

      this.getLoginState().then(async () => {
        callId = data.id || data.hostId;

        if (rtcLoading) return;
        rtcLoading = true;

        try {
          await this.$rtc.creatRTCTrack(this);
          rtcLoading = false;
        } catch (e) {
          rtcLoading = false;
          return;
        }

        if (!data.id) {
          data.id = data.hostId;
        }

        if (data.id !== callId) return;

        clearTimeout(window.$mObj.timer);

        // match call 直接打电话呀
        // 匹配
        if (this.isMatchCall || callLocation === 100) {
          this.sendCallReq(data, callLocation);
          return;
        }

        // 电话信息
        apiGetCallInfo({
          calleeUserId: +data.id,
          callLocation,
        }).then(({ data: d2 }) => {
          const { currentCoin, price } = d2;
          const thePrice = +data.gender === 1 ? 80 : price;

          // 钱不够提示
          if (currentCoin < thePrice) {
            const disCoin = getDiscountCoin();
            logReport({
              eventId: '106-1-3-30',
              callLocation,
              target_user_id: data.id,
              coin: disCoin && disCoin.totalCoinNum
            });
            let con = i18n.t('app.dialog_goddess_wall_gold_not_enough_message', { coin: thePrice, img: `<img class='icon-coin' src='${coin}'>` });
            if (disCoin) {
              con = `<p>${con}</p>${disCoin.con}`;
            }

            this.$message({
              confirmBtnTxt: i18n.t('app.exchange_lucky_draw'), // '充值',
              cancelBtnTxt: i18n.t('base.cancel'), // '取消',
              noCancelBtn: false,
              html: `<div class='pop-gold-message'>${con}</div>`,
            }).then(() => {
              logReport({
                eventId: '106-1-3-31',
                callLocation,
                target_user_id: data.id,
                coin: disCoin && disCoin.totalCoinNum
              });
              // if (disCoin) {
              //   this.$store.commit('setDisCoinIframe', true);
              // } else {
              // }
              this.$router.push({ name: 'CoinPage' });
            }).catch(() => {
              logReport({
                eventId: '106-1-3-32',
                callLocation,
                target_user_id: data.id,
                coin: disCoin && disCoin.totalCoinNum
              });
              // 开始下一次匹配
              if (this.toMatchNext) {
                this.toMatchNext();
              }
              // 模拟来电
              if (this.cancelFakeCall) {
                this.cancelFakeCall();
              }
            });
            return;
          }
          // 模拟来电价格弹框只弹一次
          if (callLocation === window.$mObj.cardConf.afterLikeFakeCallLocation && localStorage.getItem('RC_CALL_PRICE_POP_FAKE')) {
            this.sendCallReq(data, callLocation);
            return;
          }

          // 钱够了 价格提示 或者直接打电话

          // 女神墙价格弹框只弹一次
          if (callLocation === 104 && localStorage.getItem('RC_CALL_PRICE_POP')) {
            this.sendCallReq(data, callLocation);
            return;
          }
          if (callLocation === 104) {
            localStorage.setItem('RC_CALL_PRICE_POP', true);
          }
          if (callLocation === window.$mObj.cardConf.afterLikeFakeCallLocation) {
            localStorage.setItem('RC_CALL_PRICE_POP_FAKE', true);
          }

          if (callLocation === window.$mObj.cardConf.mainPageCallLocation) {
            if (localStorage.getItem('RC_CALL_PRICE_POP_CARD')) {
              this.sendCallReq(data, callLocation);
              return;
            } else {
              localStorage.setItem('RC_CALL_PRICE_POP_CARD', true);
            }
          }
          if (callLocation === window.$mObj.cardConf.afterLikeNormalCallLocation) {
            if (localStorage.getItem('RC_CALL_PRICE_POP_CARD_MATCHED')) {
              this.sendCallReq(data, callLocation);
              return;
            } else {
              localStorage.setItem('RC_CALL_PRICE_POP_CARD_MATCHED', true);
            }
          }

          if (callLocation === window.$mObj.searchConf.afterLikeNormalCallLocation) {
            if (localStorage.getItem('RC_CALL_PRICE_POP_LIVCAM_MATCHED')) {
              this.sendCallReq(data, callLocation);
              return;
            } else {
              localStorage.setItem('RC_CALL_PRICE_POP_LIVCAM_MATCHED', true);
            }
          }

          if (callLocation === window.$mObj.searchConf.afterLikeFakeCallLocation) {
            if (localStorage.getItem('RC_CALL_PRICE_POP_LIVCAM_FAKE')) {
              this.sendCallReq(data, callLocation);
              return;
            } else {
              localStorage.setItem('RC_CALL_PRICE_POP_LIVCAM_FAKE', true);
            }
          }

          // recall 格弹框只弹一次
          if (callLocation === window.$mObj.matchConf.continueCallLocation) {
            if (localStorage.getItem('RC_CALL_PRICE_RECALL_POP')) {
              this.sendCallReq(data, callLocation);
              return;
            } else {
              localStorage.setItem('RC_CALL_PRICE_RECALL_POP', true);
            }
          }

          // 从别的位置打电话每次都弹
          const con = i18n.t('app.dialog_goddess_pay_attention_message', { coin: thePrice, img: `<img class='icon-coin' style="width:16px;vertical-align:middle" src='${coin}'>` });
          logReport({
            eventId: '106-1-3-27',
            callLocation,
            target_user_id: data.id,
          });
          this.$message({
            noCancelBtn: false,
            html: `<div class='pop-gold-message'>${con}</div>`,
          }).then(() => {
            logReport({
              eventId: '106-1-3-28',
              callLocation,
              target_user_id: data.id,
            });
            this.sendCallReq(data, callLocation);
          }).catch(() => {
            logReport({
              eventId: '106-1-3-29',
              callLocation,
              target_user_id: data.id,
            });
            // 开始下一次匹配
            if (this.toMatchNext) {
              this.toMatchNext();
            }
            // 模拟来电
            if (this.cancelFakeCall) {
              this.cancelFakeCall();
            }
          });
        });
      }).catch(() => {
      });
    },

    sendCallReq (data, callLocation) {
      // 请求上报
      logReport({
        eventId: '106-1-3-18',
        target_user_id: data.id,
        callLocation
      });
      // 模拟来电
      if (this.fakeStarCall) {
        this.fakeStarCall();
      }
      // 发起邀请请求
      apiRtmInviter({
        calleeUserId: +data.id,
        // calleeUserId: 11622022533,
        callLocation,
      }).then(res => {
        console.log('call respones', res);
        const callData = res.data || {};
        const { goddessLocation } = callData;
        if (goddessLocation === 100 && this.$route.name !== 'MatchPage') {
          console.log('-----已经退出匹配了, 忽略吧--99----');
          this.$parent.$parent.$refs.inviteCall.cancel();
          return;
        }
        // 异常提示
        if (!callData || !callData.serverCall) {
          let logParams = {
            reason: res.code
          };
          if (this.$store.state.app.isHomeHost) {
            logParams = Object.assign(logParams, this.$store.state.app.homeParams);
          }
          logReport({
            eventId: '106-1-3-3',
            target_user_id: data.id,
            freeName2: logParams
          });
          const disCoin = getDiscountCoin();
          if (res.code !== 100004) {
            if (res.code === 100008) {
              logReport({
                eventId: '106-1-3-35',
                target_user_id: data.id,
                freeName2: logParams,
                coin: disCoin && disCoin.totalCoinNum
              });
              let con = this.$t('webChat.callFreeTips');
              if (disCoin) {
                con = `<p>${con}</p>${disCoin.con}`;
              }
              this.$message({
                confirmBtnTxt: this.$t('webChat.becomeVIP'), // '充值',
                noCancelBtn: true,
                html: `<div class='pop-gold-message'>${con}</div>`,
              }).then(() => {
                logReport({
                  eventId: '106-1-3-36',
                  target_user_id: data.id,
                  freeName2: logParams,
                  coin: disCoin && disCoin.totalCoinNum
                });
                // if (disCoin) {
                //   this.$store.commit('setDisCoinIframe', true);
                // } else {
                // }
                this.$router.push({ name: 'CoinPage' });
              });
              return;
            }
            if (callLocation !== 100) { // 不是匹配的电话则弹提示
              this.$message({
                desc: {
                  txt: this.callErrorCode[res.code]
                }
              });
            }
          } else {
            const { callPrice } = res.data;
            let con = i18n.t('app.dialog_goddess_wall_gold_not_enough_message', { coin: callPrice, img: `<img class='icon-coin' src='${coin}'>` });

            if (disCoin) {
              con = `<p>${con}</p>${disCoin.con}`;
            }
            logReport({
              eventId: '106-1-3-30',
              callLocation,
              target_user_id: data.id,
              coin: disCoin && disCoin.totalCoinNum
            });
            this.$message({
              confirmBtnTxt: i18n.t('app.exchange_lucky_draw'), // '充值',
              cancelBtnTxt: i18n.t('base.cancel'), // '取消',
              noCancelBtn: false,
              html: `<div class='pop-gold-message'>${con}</div>`,
            }).then(() => {
              logReport({
                eventId: '106-1-3-31',
                callLocation,
                target_user_id: data.id,
                coin: disCoin && disCoin.totalCoinNum
              });
              // if (disCoin) {
              //   this.$store.commit('setDisCoinIframe', true);
              // } else {
              // }
              this.$router.push({ name: 'CoinPage' });
            }).catch(() => {
              logReport({
                eventId: '106-1-3-32',
                callLocation,
                target_user_id: data.id,
                coin: disCoin && disCoin.totalCoinNum
              });
            });
          }
          return;
        }
        this.$rtm.localInvitation(callData, data);
        window.$mObj.callSt = Date.now();
        // 30秒timeout挂断
        window.$mObj.timer = setTimeout(() => {
          if (!this.$store.state.agora.curRoomNum) return;
          if (this.$store.state.app.showVideoPop) return;
          apiTimeout({ roomNum: this.$store.state.agora.curRoomNum }).then(res => {
            console.log('call timeout');
            this.$store.commit('setBellState', false);
            this.$store.commit('resetVideoChat');
          });
        }, 30 * 1000);
        if ([window.$mObj.cardConf.afterLikeFakeCallLocation, window.$mObj.searchConf.afterLikeFakeCallLocation].includes(+callLocation)) return;
        console.log('------setBellState-------');
        this.$store.commit('setBellState', true);
        console.log(res, 'apiRtmInviter');
      }).catch(e => {
        this.$message({
          desc: {
            txt: i18n.t('base.reply')// '请稍后重试'reply
          }
        });
        console.log('apiRTmInviter error', e);
      });
    },

    /**
     * 页面初始化请求礼物列表
     * 存储在store 中 即用即取
     * 数据处理 数组转对象
     */
    async getGiftListData () {
      const hardCode = [160, 152, 155, 157, 148, 159, 183, 185, 187, 189, 165, 191, 163, 169, 167, 193, 195, 174, 173, 171, 197, 199, 201];
      return getGiftList().then(({ code, data }) => {
        const giftArr = {};
        const giftAllArr = {};
        if (data && data.length) {
          data.forEach((item, index) => {
            if (hardCode.includes(item.id)) {
              giftArr[item.id] = item;
            }
            giftAllArr[item.id] = item;
          });
          this.$store.commit('setGiftList', giftArr);
          this.$store.commit('setGiftAllList', giftAllArr);
        }
      });
    }

  }
};
