// eslint-disable-next-line import/no-duplicates
import { createInstance } from 'agora-rtm-sdk';
import store from '@/store';
import Cookies from 'js-cookie';
import { logReport } from '@/util/logReport';
import { init } from '@/util/message';
import Base64 from 'crypto-js/enc-base64';
import Utf8 from 'crypto-js/enc-utf8';
import { distribute, distributeOther } from '@/util/broadcast';
import { decodeMessage } from '@/util/process';
import router from '@/router';

export default class RTMClient {
  constructor (appId) {
    this.client = createInstance(appId);
    this.status = 'offline';
    this.localInvite = null;
    this.remoteInvite = null;
    this.channel = null;
    // 事件监听
    this.addListenerEvent();
  }

  // 登录
  login (options) {
    if (self !== top) {
      console.log('----在iframe中--------');
      return;
    }
    return this.client
      .login(options)
      .then(async () => {
        console.log('rtm login success -----', options);
        this.status = 'online';
        init();
      })
      .catch((err) => {
        console.log(new Error(err));
      });
  }

  // 监听事件
  addListenerEvent () {
    // message 监听

    this.client.on('MessageFromPeer', (message, peerId) => {
      const { messageType, text } = message;
      const msgData = JSON.parse(text);
      const { bizData, bizType } = msgData;
      console.log(msgData, messageType, ' MessageFromPeer +++++++++++++');

      const { content } = msgData;
      const msg = decodeMessage(content);
      console.log('---++++++解码消息+++++++----', msg);

      const isMatch = router.currentRoute ? router.currentRoute.name === 'MatchPage' : '';
      const callLocation = bizData ? bizData.goddessLocation : '';
      const lastCallLocation = store.state.agora.tempData.bizData && store.state.agora.tempData.bizData.goddessLocation;
      const fakeCL = [window.$mObj.cardConf.afterLikeFakeCallLocation, window.$mObj.searchConf.afterLikeFakeCallLocation];
      const isFakeCall = store.state.app.fakeCallBegin || fakeCL.includes(callLocation) || fakeCL.includes(lastCallLocation);
      const isHiddenToast = [100].includes(callLocation) || isMatch || isFakeCall;

      // 发起邀请的im通信
      if (bizType === 1050 && bizData && bizData.callAction) {
        const roomNum = text.match(/roomNum":([0-9]+)/ig)[0].split(':')[1];

        const myCallRole = bizData.sendUserId - Cookies.get('userId') ? 'callee' : 'caller';

        // 处理
        switch (bizData.callAction) {
          case 1:
            // 超时检测 消息可能是过期的离线消息 需要过滤
            if (new Date().getTime() - msgData.timestamp >= 30000) {
              console.log('过期的邀请');
              return false;
            }
            // 收到邀请 邀请方也会收到 需要区分
            // 1 被交  0 主叫
            store.commit('setCurRoomNum', roomNum);
            store.commit('setCurCallRole', myCallRole);
            store.commit('setBizData', bizData);

            // 模拟来电 不展示邀请界面
            if ([window.$mObj.cardConf.afterLikeFakeCallLocation, window.$mObj.searchConf.afterLikeFakeCallLocation].includes(bizData.goddessLocation) && myCallRole === 'caller') {
              store.commit('setFakeCallBegin', true);
              return;
            }

            store.commit('setBellState', true);
            break;
          case 7: // 视频通话挂断
            window.curMsgPop && window.curMsgPop.close();
            store.commit('setVideoPopState', false);

            if (store.state.app.show1v1Pop) {
              const isHostHangup = bizData.sendUserId !== store.state.app.userInfo.id;
              window.$mObj.vm.$rtc.leavl1V1(isHostHangup);
              return;
            }

            if (myCallRole === 'caller') {
              !isHiddenToast && window.$mObj.vm.$toast({
                html: window.$mObj.vm.$t('app.video_toast_hangup_by_receiver')
              });
            } else {
              !isHiddenToast && window.$mObj.vm.$toast({
                html: window.$mObj.vm.$t('app.video_toast_be_hangup_by_receiver')
              });
              // if (isFakeCall) {
              //   window.$mObj.vm.$toast({
              //     html: window.$mObj.vm.$t('webChat.fakeCallFail')
              //   });
              // }
            }
            window.gtag && window.gtag('event', 'GoMeetVideoCallDuration ', { send_to: ['AW-834247273/TQgKCNy00YIYEOm05o0D', 'livu'], callDuration: store.state.agora.callTimeSec });

            logReport({
              eventId: '106-1-3-4',
              free_name2: {
                reason: 'hangup'
              },
              target_user_id: bizData.sendUserId
            });
            break;
          case 5: // 对方主动挂断邀请
            if (store.state.agora.curCallRole === 'caller') {
              store.commit('setFakeCallBegin', false);
              store.dispatch('cancelBell');
            }

            if (!store.state.app.isMatchCall) {
              if (store.state.agora.curCallRole === 'caller') {
                !isHiddenToast && window.$mObj.vm.$toast({
                  html: window.$mObj.vm.$t('app.video_toast_no_answer')
                });
              } else {
                !isHiddenToast && window.$mObj.vm.$toast({
                  html: window.$mObj.vm.$t('app.video_toast_cancel')
                });
              }

              if (isFakeCall) {
                window.$mObj.vm.$toast({
                  html: window.$mObj.vm.$t('webChat.fakeCallFail')
                });
              }
            } else {
              setTimeout(() => {
                store.commit('setMatchCall', false);
                store.commit('setMatchCallCancel', true);
              }, 200);
            }

            store.commit('setBellState', false);
            store.commit('resetVideoChat');
            break;
          case 2: // 自己主动挂断邀请
          // 关闭邀请
            if (store.state.agora.tempData.curCallRole === 'caller') {
              store.dispatch('cancelBell');
            }

            if (!store.state.app.isMatchCall) {
              if (store.state.agora.tempData.curCallRole === 'caller') {
                !isHiddenToast && window.$mObj.vm.$toast({
                  html: window.$mObj.vm.$t('app.audio2video_cancle_request')
                });
              } else {
                !isHiddenToast && window.$mObj.vm.$toast({
                  html: window.$mObj.vm.$t('app.video_toast_be_hangup_by_caller')
                });
              }
            } else {
              setTimeout(() => {
                store.commit('setMatchCall', false);
              }, 200);
            }

            store.commit('setBellState', false);
            store.commit('resetVideoChat');
            break;
          case 3:
            // 被邀请方进入房间了 邀请方可以加入了
            // 发起方关闭了邀请 但是网络延迟了 被邀请方进入了房间 此时不进入
            if (bizData.roomNum === +localStorage.getItem('RC_CANCEL_ROOM')) return;

            store.commit('setBellState', false);
            store.commit('setVideoPopState', true);
            // 清除定时器
            window.$mObj.timer && clearTimeout(window.$mObj.timer);
            break;
          case 6:
            // 超时30秒没有接通 挂断
            if (store.state.agora.tempData.curCallRole === 'caller') {
              store.commit('setFakeCallBegin', false);
              store.dispatch('cancelBell');

              if (!store.state.app.isMatchCall) {
                !isHiddenToast && window.$mObj.vm.$toast({
                  html: window.$mObj.vm.$t('app.chat_message_content_call_no_answer')
                });
              } else {
                setTimeout(() => {
                  store.commit('setMatchCall', false);
                  store.commit('setMatchCallCancel', true);
                }, 200);
              }
              if (isFakeCall) {
                window.$mObj.vm.$toast({
                  html: window.$mObj.vm.$t('webChat.fakeCallFail')
                });
              }
            }
            store.commit('setBellState', false);
            store.commit('setVideoPopState', false);
            console.log('timeup');
            logReport({
              eventId: '106-1-3-4',
              free_name2: {
                reason: 'timeup'
              },
              target_user_id: bizData.sendUserId
            });
            window.gtag && window.gtag('event', 'GoMeetVideoCallDuration ', { send_to: ['AW-834247273/TQgKCNy00YIYEOm05o0D', 'livu'], callDuration: store.state.agora.callTimeSec });
            break;
          case 101:
            // 金币扣除消息
            if (store.state.agora.curCallRole === 'caller') {
              console.log('扣金币了', bizData, '+++++++++');
              store.commit('updateCoin', bizData.goldNum);

              if (!bizData.isGoldEnough) {
                store.commit('updateVideoRecharge', true);
              }
            }

            break;
          default:
            break;
        }
      }

      switch (bizType) {
        case 1040:
          // 收到im消息上报

          distribute(msgData);
          break;
        default:
          distributeOther(msgData);
          break;
      }
    });
  }

  // 主动邀请
  localInvitation (callObj) {
    if (![window.$mObj.cardConf.afterLikeFakeCallLocation, window.$mObj.searchConf.afterLikeFakeCallLocation].includes(callObj.goddessLocation)) {
      store.commit('setBellState', { show: true, type: 'invite' });
    };
    this.status = 'calling';

    if (this.localInvite !== null) {
      this.localInvite.removeAllListeners();
      this.localInvite = null;
    }

    console.log(callObj.calleeRtmIds[0], 12);
    try {
      this.localInvite = this.client.createLocalInvitation(callObj.calleeRtmIds[0]);
    } catch (err) {
      console.log(err);
    }

    // 对方接收到邀请
    this.localInvite.on('LocalInvitationReceivedByPeer', () => {
      console.log('LocalInvitationReceivedByPeer');
    });
    // 主动取消呼叫
    this.localInvite.on('LocalInvitationCanceled', () => {
      // store.commit('setBellState', false);
      console.log('LocalInvitationCanceled');
    });
    // 对方接收邀请
    this.localInvite.on('LocalInvitationAccepted', () => {
      // store.commit('setBellState', false);
      // store.commit('setVideoPopState', true);
      // this.createChannel(channel);
      // console.log('LocalInvitationAccepted');
      // this.status = 'meeting';
    });
    // 对方拒绝邀请
    this.localInvite.on('LocalInvitationRefused', () => {
      // store.commit('setBellState', false);
      console.log('LocalInvitationRefused');
      // this.status = 'onLine';
    });
    // 呼叫失败
    this.localInvite.on('LocalInvitationFailure', (res, ddd) => {
      // store.commit('setBellState', false);
      console.log('LocalInvitationFailure', res, ddd);
      // this.status = 'onLine';
    });

    // 把channel包含进邀请信息中

    const userData = JSON.parse(JSON.stringify(store.state.app.userInfo));

    // if (userData.birthday) {
    //   console.log(userData, '----brithday');
    //   userData.birthday.replace(/-/g, '/');
    //   userData.birthday = new Date(userData.birthday).getTime();
    // }

    const dd = { id: callObj.roomNum, callType: callObj.callType, mediaType: 0, relationship: 2, friendAddWay: 3, pricePerMinute: callObj.callPrice, video_location: callObj.goddessLocation, serverCall: callObj.serverCall, token: callObj.calleeRtcRoomToken, rtcAppId: callObj.rtcAppId };
    dd.realUserId = Cookies.get('userId');
    const str = Utf8.parse(JSON.stringify(userData));
    dd.user = Base64.stringify(str);

    this.localInvite.content = JSON.stringify(dd);
    this.localInvite.channelId = callObj.roomNum;

    console.log(dd, '---ddsad--');
    // 开始发送邀请
    this.localInvite.send();
  }

  // 被邀请监听
  // onRemoteInvitation () {
  //   this.client.on('RemoteInvitationReceived', (remoteInvitation) => {
  //     console.log('RemoteInvitationReceived', remoteInvitation);
  //     // 非闲置状态 拒接
  //     // if (this.status !== 'online') {
  //     //     remoteInvitation.refuse();
  //     // }
  //     // 重新清空
  //     if (this.remoteInvite !== null) {
  //       this.remoteInvite.removeAllListeners();
  //       this.remoteInvite = null;
  //     }

  //     this.status = 'calling';
  //     this.remoteInvite = remoteInvitation;

  //     store.commit('setBellState', true);

  //     // 邀请我的人主动挂断了
  //     this.remoteInvite.on('RemoteInvitationCanceled', () => {
  //       store.commit('setBellState', false);
  //       console.log('RemoteInvitationCanceled');
  //       this.status = 'onLine';
  //     });

  //     // 我接受了别人的邀请
  //     this.remoteInvite.on('RemoteInvitationAccepted', () => {
  //       store.commit('setBellState', false);
  //       store.commit('setVideoPopState', true);
  //       this.createChannel(remoteInvitation.content);
  //       console.log('RemoteInvitationAccepted');
  //     });

  //     // 我拒绝了邀请
  //     this.remoteInvite.on('RemoteInvitationRefused', () => {
  //       store.commit('setBellState', false);
  //       console.log('RemoteInvitationRefused');
  //     });

  //     // 呼叫失败
  //     this.remoteInvite.on('RemoteInvitationFailure', () => {
  //       store.commit('setBellState', false);
  //       console.log('RemoteInvitationFailure');
  //       this.status = 'onLine';
  //     });
  //   });
  //   // 对端发送的消息
  //   this.client.on('MessageFromPeer', function (message, peerId) {
  //     console.log('我收到了一条消息Message from: ' + peerId + ' Message: ', message);
  //   });
  // }

  // 挂断我的邀请
  // cancelCall () {
  //   this.localInvite && this.localInvite.cancel();
  //   this.status = 'online';
  // }

  // // 接收邀请
  // acceptCall () {
  //   this.remoteInvite && this.remoteInvite.accept();
  //   this.status = 'calling';
  // }

  // // 拒绝邀请
  // refuseCall () {
  //   this.remoteInvite && this.remoteInvite.refuse();
  //   this.status = 'online';
  // }

  // 接收message
  // listenMessage () {
  //   this.channel.on('ChannelMessage', (message, peerId) => {
  //     store.commit('pushChat1v1', Object.assign(message, { peerId }));
  //     console.log(message, peerId);
  //   });
  // }

  // 创建频道并加入；
  // createChannel (channel) {
  //   store.commit('setChat1v1Channel', channel);

  //   // 重新清空
  //   if (this.channel !== null) {
  //     this.channel.removeAllListeners();
  //     this.channel = null;
  //   }
  //   this.channel = this.client.createChannel(channel);
  //   this.listenMessage();

  //   this.channel.join();
  // }

  // 发送消息
  // async sendMessage (channelMessage) {
  //   if (this.channel != null) {
  //     await this.channel
  //       .sendMessage({ text: channelMessage })
  //       .then(() => {
  //         store.commit('pushChat1v1', { text: channelMessage });
  //         // 发送成功
  //       })
  //       .catch((err) => {
  //         // 发送失败
  //         console.log(err);
  //       });
  //   }
  // }

  // // 挂断退出
  // cancelRtm () {
  //   return this.channel && this.channel.leave();
  // }
}
