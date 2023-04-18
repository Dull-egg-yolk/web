<template>
  <div class="dialog-box" :class="{ [theme]: true, 'video-chat-dialog': chatTye==='video' }">
    <div class="dialog-placeholder" v-if="!dialogList.length">
      <p>{{$t('app.no_message')}}</p>
    </div>
    <div class="dialog-list" ref="dialogList">
      <div v-for="(item, index) of dialogList" :key="index">
        <msg-time-item v-if="showTime" :index="index" :list="dialogList" ></msg-time-item>
        <div class="odialog" :class="{ me: item.bizData.sendUserId === myUID }"
          >
          <msg-item :message="item" :isInVideo="isInVideo" @click="msgClick"></msg-item>
        </div>
      </div>
    </div>
    <!-- 系统消息 -->
    <div class="dialog-system-box" v-if="chatTye === 'video'">
      <div class="system-msg-list">
        <div class="system-msg-item" v-if="(videoRecharge && isMobile)">
          <div class="msg-item-content">{{$t('app.flash_charge_toast_hint')}}</div>
          <div class="msg-item-btn btn-top-up" @click="jumpToCoin">{{$t('app.tips_limit_gold_desc')}} {{resetTime}}s</div>
        </div>
      </div>
    </div>
    <!-- 用户操作 -->
    <div class="dialog-action" v-if="friendId>0">
      <!-- 发送信息 -->
      <div class="dialog-send fx-be-vc">
        <div class="translate icon-transform hover" :class="{active:needTranslate }" @click="toggleTran">
        </div>
        <div contenteditable="true" class="textArea" spellcheck="false" id="chat-textArea" @keyup="handleKeyup"
          ref="dlgTxtEdit" @keydown="handleKeyDown"  @click="reportEvent"></div>
        <div class="btn-send" :class="{ disabled: !message }" @click="sendMsg">
          <span class="icon-send"></span>
        </div>
      </div>
      <!-- 快捷操作按钮-->
      <div class="dialog-quick-btn fx-be-vc">
        <!-- 礼物 -->
        <div class="obtn cbtn gift hover fx-ic" @click.stop="showGiftBtn">
          <span class="ico hover"></span>
        </div>
        <!-- 图片 -->
        <div class="obtn file-btn fx-ic">
          <span class="icon-picture hover fx-c" >
            <input type="file" @change="dlgUploadImg" accept="image/*" @click="uploadImg"/>
          </span>
        </div>
        <!-- 表情 -->
        <div class="obtn  fx-ic">
          <span class="icon-face hover" @click.stop="getShowEmoji"></span>
        </div>
        <!-- 打电话 -->
        <div class="obtn cbtn call hover  fx-ic" v-if="theme !== 'dark'">
          <span class="icon-video2 hover" @click="sendCall"></span>
        </div>

        <!-- 表情弹框 -->
        <transition name="fade">
          <emoji-pop v-if="showEmoji" :show.sync="showEmoji" @addEmoji="insertEmoji" />
        </transition>
      </div>

    </div>
      <!-- 礼物弹框 -->
    <transition name="fade">
      <gift-pop v-if="showGift" :show.sync="showGift" @sendGift="sendGift" />
    </transition>
  </div>
</template>

<script>
import { mapState, mapActions } from 'vuex';
import { sendMessage, apiSendGift } from '@/api/message';
import { processMessage, faceShowMsg, webTipsMsg, videoBlurMsg } from '@/util/process';
import agoraMixin from '@/mixin/agoraMixin';
import { logReport } from '@/util/logReport';
import emojiPop from './emojiPop';
import giftPop from './giftPop';
import msgItem from './msgItem';
import msgTimeItem from './msgTimeItem';
import { apiUplodImg } from '@/api/user';
import { apiAddFriend } from '@/api/friend';
import { getDiscountCoin } from '@/components/messageBox/htmlData';

export default {
  name: 'DialogBox',
  data () {
    return {
      message: '',
      showEmoji: false,
      showGift: false,
      needTranslate: true,
      isLock: false,
      resetTime: 58,
      resetFn: null,
      isRequestAddFriend: false,
    };
  },
  props: {
    theme: {
      type: String,
      default: '',
    },
    friendId: {
      type: [String, Number],
      require: true
    },
    friendAvatar: {
      type: [String]
    },
    giftLine: {
      type: [Boolean]
    },
    friendDetail: {
      type: [Object],
      default () {
        return {};
      }
    },
    chatTye: {
      type: String,
      default: 'im' // video 视频内聊天  im im聊天
    },
    // 是否显示时间
    showTime: {
      type: Boolean,
      default: () => {
        return true;
      }
    }
  },
  components: { emojiPop, giftPop, msgItem, msgTimeItem },
  mixins: [agoraMixin],
  computed: {
    ...mapState({
      bizData: (state) => state.agora.bizData,
      myAvatar: (state) => state.app.userInfo.headImg,
      myUID: (state) => state.app.userInfo.id,
      dialogList: (state) => state.agora.curDialogList,
      curRoomNum: (state) => state.agora.curRoomNum,
      isMobile: (state) => state.app.isMobile,
      videoRecharge: (state) => state.app.videoRecharge,
      payStatus: (state) => state.app.userInfo.payStatus,
    }),
    isInVideo () {
      return this.chatTye === 'video';
    },
  },
  watch: {
    dialogList (_n, _o) {
      console.log(this.dialogList, '----');
      // 自动滚动到底
      this.$nextTick(() => {
        this.$refs.dialogList.scrollTo(0, 1000000);
      });
    },
    curRoomNum (ne, ol) {
      if (ne === '' && ol.length > 15) {
        this.$parent.getAllMsg && this.$parent.getAllMsg();
      }
    },
    showGift (e) {
      this.$emit('giftLine', e);
    },
    videoRecharge (ne, ol) {
      if (!this.isMobile) return;
      if (ne) {
        logReport({
          eventId: '106-1-3-23',
          roomId: this.curRoomNum,
          callLocation: this.bizData.goddessLocation,
          target_user_id: this.friendId
        });
        this.resetTime = 58;
        this.cutDownTime();
      } else {
        this.resetRecharge();
      }
    }
  },
  methods: {
    ...mapActions(['updateMyUserData']),
    cutDownTime () {
      clearInterval(this.resetFn);
      this.resetFn = setInterval(() => {
        if (!this.resetTime) {
          this.resetRecharge();
          return;
        }
        this.resetTime -= 1;
      }, 1000);
    },
    resetRecharge () {
      clearInterval(this.resetFn);
      this.$store.commit('updateVideoRecharge', false);
      this.resetTime = 58;
    },
    getShowEmoji () {
      logReport({
        eventId: '106-1-4-5',
        target_user_id: this.friendId
      });
      this.showEmoji = !this.showEmoji;
    },
    // 表情
    insertEmoji (emoji) {
      this.$refs.dlgTxtEdit.focus();
      const html = `<img class="emoji" alt="${emoji.txt}" src="https://h5.livuchat.com/static/images/emoji/${emoji.imgUrl}" />`;
      let sel, range;
      if (window.getSelection) {
        // IE9 或 非IE浏览器
        sel = window.getSelection();
        if (sel.getRangeAt && sel.rangeCount) {
          range = sel.getRangeAt(0);
          range.deleteContents();
          const el = document.createElement('div');
          el.innerHTML = html;
          const frag = document.createDocumentFragment();
          let node; let lastNode;
          while ((node = el.firstChild)) {
            lastNode = frag.appendChild(node);
          }
          range.insertNode(frag);
          // Preserve the selection
          if (lastNode) {
            range = range.cloneRange();
            range.setStartAfter(lastNode);
            range.collapse(true);
            sel.removeAllRanges();
            sel.addRange(range);
          }
        }
      } else if (document.selection && document.selection.type !== 'Control') {
        // IE < 9
        document.selection.createRange().pasteHTML(html);
      }

      this.transferMsg();
      this.showEmoji = false;
    },
    handleKeyup (event) {
      setTimeout(() => {
        if (this.isLock) return;
        this.transferMsg();
        if (event.keyCode === 13) {
          this.sendMsg();
        }
      }, 40);
    },
    handleKeyDown (event) {
      if (event.keyCode === 13) {
        // enter发送  和 app保持一致  不能换行
        event.preventDefault();
      }
    },

    reportEvent () {
      logReport({
        eventId: '106-1-3-19',
        target_user_id: this.friendId,
        gender: this.friendDetail.gender,
        r_source: this.friendDetail.gender === 1 ? 'match' : 'call',
        roomId: this.curRoomNum
      });
      const relation = this.friendDetail.relation;
      console.log('---输入框点击----', relation);
      if (relation !== 4 || this.chatTye !== 'im') return;
      this.addFriendCheck(this.friendDetail);
    },

    addFriendCheck (data) {
      const { id, userName, headImg, name } = data;
      logReport({
        eventId: '106-1-3-33',
        target_user_id: id,
        callLocation: this.bizData.goddessLocation,
      });
      this.$message({
        confirmBtnTxt: this.$t('base.ok'), // '继续添加',
        noCancelBtn: false,
        desc: {
          txt: this.$t('app.add_friend_pay_attention_message_female', { gold: 9 }) // 'this chat will coast 9 gold'
        }
      }).then(res => {
        this.$parent.friendDetail.relation = 1;
        this.chatAddFriend(id);
        logReport({
          eventId: '106-1-2-6',
          target_user_id: id,
          r_resource: 'chat'
        });
      }).catch(res => {
        logReport({
          eventId: '106-1-2-7',
          target_user_id: id,
          r_resource: 'chat'
        });
      });
    },

    chatAddFriend (id) {
      if (this.isRequestAddFriend) return;
      this.isRequestAddFriend = true;
      apiAddFriend({
        addWay: 102,
        friendUserId: id,
        addReally: true
      }).then(({ code, data }) => {
        this.$parent.getOtherUserInfo();
        if (code === 200) {
          // 插入加好友消息
          this.updateMyUserData();
        } else if (code === 20001) {
          this.$message({
            confirmBtnTxt: this.$t('app.exchange_lucky_draw'), // '充值',
            noCancelBtn: false,
            desc: {
              txt: this.$t('app.gold_not_enough'), // '金币不足'
            }
          }).then(() => {
            logReport({
              eventId: '106-1-2-8',
              target_user_id: id,
              r_resource: 'chat'
            });
            this.$router.push({
              name: 'CoinPage',
            });
          }).catch(res => {
            logReport({
              eventId: '106-1-2-9',
              target_user_id: id,
              r_resource: 'chat'
            });
          });
        }

        this.isRequestAddFriend = false;
      });
    },

    // 转化消息输入框里的emoji 图片为 文字
    transferMsg () {
      const originHTML = this.$refs.dlgTxtEdit.childNodes;
      if (!originHTML.length) {
        this.message = '';
        return;
      };

      let realMsg = '';
      originHTML.forEach((dom) => {
        if (dom.alt) {
          realMsg += dom.alt;
        } else {
          realMsg += dom.textContent;
        }
      });
      console.log(realMsg, '----发送的消息----realMsg-------');
      this.message = realMsg.trim();
    },

    toggleTran () {
      this.needTranslate = !this.needTranslate;
    },

    sendMsg () {
      this.$refs.dlgTxtEdit.focus();
      if (!this.message) return;
      // 发送im消息动作上报
      // logReport({
      //   eventId: '106-1-4-3',
      //   target_user_id: this.friendId
      // });

      // 消息发送接口请求上报
      const rqStartTime = new Date().getTime();
      // logReport({
      //   eventId: '106-2-1-3',
      //   target_user_id: this.friendId,
      //   free_name2: this.curRoomNum,
      // });
      const messageType = this.isInVideo ? 4 : 1;
      const data = {
        message: this.message,
        messageType, // 消息类型 参考MessageTypeEnum枚举，1是文字
        receiveUserId: this.friendId,
        sendUserId: this.$store.state.app.userInfo.id,
        needTranslate: this.needTranslate, // 是否需要翻译 0：否 1：是
        targetLanguage: 1, // 翻译的目标语言
        routeType: 1, // 是否在线才投递消息 0：否 1：是
      };

      if (this.$store.state.app.show1v1Pop) {
        data.flag = this.$store.state.agora.matchCallData.ident;
      }

      const sendData = processMessage(data, this.isInVideo);
      console.log('----发消息-----', sendData);
      sendMessage(sendData).then(res => {
        const { data } = res;

        if (data && data.translateCode === 54000) {
          this.needTranslate = false;
          this.$message({
            desc: {
              txt: this.$t('app.translate_limit_dialog_title')
            }
          });
        }
        // 翻译限制弹框

        if (+localStorage.getItem('RC_SAFARI_CALL') === 1) {
          localStorage.setItem('RC_SAFARI_CALL', 2);
        }

        console.log(res, '-----sendMessage-000-----');
        // 消息发送接口成功返回上报
        // logReport({
        //   eventId: '106-2-1-4',
        //   target_user_id: this.friendId,
        //   free_name2: this.curRoomNum,
        //   free_name1: 1,
        //   free_name4: 200,
        //   free_id2: new Date().getTime() - rqStartTime
        // });
      }).catch((err) => {
        // 消息发送接口失败返回上报
        // logReport({
        //   eventId: '106-2-1-4',
        //   target_user_id: this.friendId,
        //   free_name2: this.curRoomNum,
        //   free_name1: 0,
        //   free_name4: err.response.data.code || err.response.status,
        //   free_id2: new Date().getTime() - rqStartTime
        // });
        console.log(err);
      });
      this.$emit('send', this.message);
      this.message = '';
      this.$refs.dlgTxtEdit.innerText = '';
    },

    /**
     * 发送礼物
     */
    sendGift (giftId) {
      const chatType = this.chatTye === 'video' ? 1 : 0;
      if (chatType === 1) {
        logReport({
          eventId: '106-1-3-10',
          target_user_id: this.friendId
        });
      }
      const ident = this.$store.state.agora.matchCallData && this.$store.state.agora.matchCallData.ident ? this.$store.state.agora.matchCallData.ident : '';
      const params = {
        giftPage: chatType,
        giftId,
        receiveUserId: this.friendId,
        userId: this.myUID,
        roomId: this.curRoomNum || ident,
        source: chatType
      };

      if (this.$store.state.app.show1v1Pop) {
        params.flag = ident || '';
      }
      apiSendGift(params).then(({ code, data }) => {
        // 金币不足
        if (code === 10014) {
          this.$message({
            confirmBtnTxt: this.$t('app.exchange_lucky_draw'), // '充值',
            cancelBtnTxt: this.$t('base.cancel'), // '取消',
            noCancelBtn: false,
            desc: {
              txt: this.$t('app.gold_not_enough')
            }
          }).then(() => {
            this.$store.commit('setImChatConfig', {
              show: false,
              friendId: 0
            });
            this.$store.commit('setImPanelConfig', {
              show: false,
              tabId: 0
            });
            this.$router.push({ name: 'CoinPage' });
          });
          return;
        }

        const { gold } = data;
        if (gold) {
          this.$store.commit('updateCoin', gold);
        }

        if (+localStorage.getItem('RC_SAFARI_CALL') === 1) {
          localStorage.setItem('RC_SAFARI_CALL', 2);
        }
      });
    },

    /**
     * 发送电话邀请
     */
    sendCall () {
      // 发起视频邀请上报
      logReport({
        eventId: '106-1-4-6',
        target_user_id: this.friendId
      });
      if (!this.payStatus) {
        const disCoin = getDiscountCoin();
        logReport({
          eventId: '106-1-3-35',
          target_user_id: this.friendId,
          payStatus: this.payStatus,
          callLocation: 14,
          coin: disCoin && disCoin.totalCoinNum,
        });
        let con = this.$t('webChat.callFreeTips');
        if (disCoin) {
          con = `<p>${con}</p>${disCoin.con}`;
        }
        this.$message({
          confirmBtnTxt: this.$t('webChat.becomeVIP'), // '充值',
          noCancelBtn: true,
          className: 'become-vip',
          html: `<div class='pop-gold-message'>${con}</div>`,
        }).then(() => {
          logReport({
            eventId: '106-1-3-36',
            target_user_id: this.friendId,
            payStatus: this.payStatus,
            callLocation: 14,
            coin: disCoin && disCoin.totalCoinNum,
          });
          // if (disCoin) {
          //   this.$store.commit('setDisCoinIframe', true);
          // } else {
          // }
          this.$store.commit('setImChatConfig', {
            show: false,
            friendId: 0
          });
          this.$store.commit('setImPanelConfig', {
            show: false,
            tabId: 0
          });
          this.$router.push({ name: 'CoinPage' });
        });
        return;
      }
      // this.$store.commit('setInviterInfo', { id: this.friendId });
      this.callAction(this.friendDetail, 14);
      this.$store.commit('setHomeHost', false);
    },
    uploadImg () {
      logReport({
        eventId: '106-1-4-4',
        target_user_id: this.friendId
      });
    },
    dlgUploadImg (e) {
      const resFile = e.target.files[0];
      if (!resFile) return;
      const formData = new FormData();
      formData.append('image', resFile);
      e.target.value = '';
      apiUplodImg(formData, true).then(res => {
        const imgUrl = res?.data?.data?.url;
        if (imgUrl) {
          this.sendImg(imgUrl);
        }
      });
    },
    sendImg (imgUrl) {
      const data = {
        message: this.message,
        messageType: 1,
        receiveUserId: this.friendId,
        sendUserId: this.$store.state.app.userInfo.id,
        routeType: 1,
        messageTypeValue: 3, // 是否在线才投递消息 0：否 1：是
        pictureUrl: imgUrl
      };
      const sendData = processMessage(data);
      sendData.messageType = 3;
      sendMessage(sendData).then(res => {
        this.$emit('send', sendData);
      }).catch((err) => { console.log(err); });
    },

    sendWebTipsShow (params = {}) {
      logReport({
        eventId: '106-1-3-26', // 发送web用户消息
        freeName2: window.$mObj.adData || {},
        roomId: this.curRoomNum || this.$store.state.agora.matchCallData.ident,
        callLocation: this.bizData.goddessLocation,
        target_user_id: this.friendId
      });
      const data = {
        receiveUserId: this.friendId,
        ...params
      };
      const sendData = webTipsMsg(data);
      console.log(sendData, '----使用 web 端-提示-sendData------');
      sendMessage(sendData).then(res => {
        console.log('---使用 web 端-提示消息----', res);
      }).catch((err) => { console.log(err, '----使用 web 端-提示-err----'); });
    },
    sendFaceShow (params = {}) {
      const data = {
        receiveUserId: this.friendId,
        ...params
      };
      const sendData = faceShowMsg(data);
      console.log(sendData, '----露脸--sendData------');
      sendMessage(sendData).then(res => {
        console.log('---露脸消息----', res);
      }).catch((err) => { console.log(err, '----露脸-err----'); });
    },
    sendVideoBlurMsg (params = {}) {
      const data = {
        receiveUserId: this.friendId,
        ...params
      };
      const sendData = videoBlurMsg(data);
      console.log(sendData, '----视频模糊--sendData------');
      sendMessage(sendData).then(res => {
        console.log('---视频模糊消息----', res);
      }).catch((err) => { console.log(err, '----视频模糊-err----'); });
    },
    msgClick (message) {
      const msg = message.msg;
      console.log('----你点击了一条消息----', msg);
      // 查看图片
      if (msg.type === 'img') {
        this.$message({
          confirmBtnTxt: this.$t('base.close'),
          html: `<img id="img" src="${msg.rawDate.picture_url}" />`,
          showCloseIcon: true,
          className: 'img-view'
        });
        // if (!this.isMobile) {
        //   setTimeout(() => {
        //     const dom = document.getElementsByName('pop-content').item(0);
        //     const img = document.getElementById('img');
        //     const html = document.querySelector('.pop-html');
        //     html.style.height = '100%';
        //     if (message.isOblong) {
        //       dom.style.width = '100%';
        //       dom.style.height = 'auto';
        //       dom.style.maxHeight = '100%';
        //       dom.style.overflow = 'hidden';
        //       img.style.width = '100%';
        //       img.style.height = 'auto';
        //       img.style.maxHeight = '100%';
        //     } else {
        //       dom.style.maxWidth = '100%';
        //       dom.style.width = '100%';
        //       dom.style.height = '100%';
        //       dom.style.overflow = 'hidden';
        //       img.style.maxWidth = '100%';
        //       img.style.width = 'auto';
        //       img.style.height = '100%';
        //     }
        //   });
        // }
        return;
      }
      // 打电话
      if (msg.type === 'video') {
        this.sendCall();
      }
      // 系统消息
      if (msg.type === 'system') {
        if (msg.html.target) {
          const target = msg.html.target.toLowerCase();
          console.log('----打开一个链接-----', target);
          if (target.indexOf('checkinvip') !== -1) {
            logReport({
              eventId: '106-1-1-63', // vip 用户签到入口提示点击
              freeName2: window.$mObj.adData || {},
              r_resource: 'push',
              checkinType: 'vip',
            });
            this.$router.push({ name: 'CoinPage' });
            this.$store.commit('setVipCheckIn', true);
          } else if (target.indexOf('checkin') !== -1) {
            logReport({
              eventId: '106-1-1-63', // 新用户签到入口提示点击
              freeName2: window.$mObj.adData || {},
              r_resource: 'push',
              checkinType: 'new',
            });
            this.$router.push({ name: 'CoinPage' });
            this.$store.commit('setCheckIn', true);
          } else if (msg.html.target.indexOf('h5.livuchat.com') !== -1) {
            this.$router.push({ name: 'ZhuShou', params: { url: msg.html.target } });
          } else {
            window.open(msg.html.target, '_blank');
          }
        }
      }
    },
    showGiftBtn () {
      logReport({
        eventId: '106-1-4-3',
        target_user_id: this.friendId
      });
      this.showGift = !this.showGift;
    },
    onCompositionstart (e) {
      console.log('-------start-----');
      this.isLock = true;
    },
    onCompositionend (e) {
      console.log('-------end-----');
      this.isLock = false;
      this.transferMsg();
    },
    jumpToCoin () {
      logReport({
        eventId: '106-1-3-24',
        roomId: this.curRoomNum || this.$store.state.agora.matchCallData.ident,
        callLocation: this.bizData.goddessLocation,
        target_user_id: this.friendId
      });
      this.$emit('toCoin');
    },
  },
  mounted () {
    console.log(this.dialogList, '---');
    this.$nextTick(() => {
      // 禁止输入框粘贴 防止混乱的样式问题
      const el = this.$refs.dlgTxtEdit; if (el) {
        console.log('----el--------');
        el.addEventListener('paste', (e) => {
          console.log(e);
          e.preventDefault();
        });
        el.addEventListener('compositionstart', this.onCompositionstart, false);
        el.addEventListener('compositionend', this.onCompositionend, false);
      }
    });
  },
  beforeDestroy () {
    console.log('---------beforeDestroy-----');
    const el = this.$refs.dlgTxtEdit;
    if (el) {
      el.removeEventListener('compositionstart', this.onCompositionstart);
      el.removeEventListener('compositionend', this.onCompositionend);
    }
    this.resetRecharge();
  }
};
</script>

<style lang="less">
@import url("./index.less");
.fixed-box {
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background: rgba(0,0,0,.6);
  .img-box {
    display: flex;
    justify-content: center;
    align-items: center;
  }
  .img-height {
    height: 100%;
    width: auto;
  }
  .img-width {
    width: 100%;
  }
}
</style>
