// import AgoraRTC from 'agora-rtc-sdk-ng';
import store from '@/store';
import router from '@/router';
import { apiNotifyJoinCall, apiNotifyEndCall, apiNotifyStartCall, apiHangup } from '@/api/call';

import { logReport } from '@/util/logReport';

import { getFirstDeviceTips, getDeviceErrorTips } from '@/components/messageBox/htmlData';

import { dataURItoBlob, delayFunc } from '@/util';
import { getPT } from '@/util/browser';
const AgoraRTC = require('@/assets/data/agoraRTC.js');

AgoraRTC.enableLogUpload();
export default class RTCClient {
  constructor (config) {
    this.enabled = true;
    this.deviceList = {
      cameras: [],
      microphones: [],
      speakers: [],
    };
    this.client = null;
    this.localVideoTrack = null;
    this.localAudioTrack = null;
    this.remoteVideoTrack = null;
    this.remoteAudioTrack = null;
    this.joined = false;
    this.videoTimer = null;
    this.leftTimer = null;
    this.living = false;
    this.firstFrameShow = false;

    this.videoPos = 1;

    this.loadTime = 0;

    this.callTimeNum = 0;
    this.callTimer = null;

    // 检查浏览器是否支持声网
    this.checkEnable();
    this.initClient();
  }

  // 创建客户端实例
  async initClient () {
    this.client = await AgoraRTC.createClient({
      mode: 'rtc',
      codec: 'vp8',
    });
    this.listenRemote();
  }

  async checkEnable () {
    // 检查浏览器是否支持声网
    this.enabled = AgoraRTC.checkSystemRequirements();

    if (!this.enabled) {
      // alert('浏览器不支持，请使用高级浏览器');
    }
    // 获取当前浏览器支持的语音视频编码格式
    const codec = await AgoraRTC.getSupportedCodec();

    console.log(codec);
  }

  async checkDevice (vm) {
    const disableDevice = [];

    // 首次 获取 摄像头 麦克风 扬声器设备信息 提示框
    if (!localStorage.getItem('firstDeviceChecked')) {
      localStorage.setItem('firstDeviceChecked', 1);
      vm.$message({
        html: getFirstDeviceTips()
      }).then(e => {
        this.checkDevice(vm);
      });
      return Promise.reject(new Error());
    }

    // 摄像头权限相关 ---------------------------------
    const camersCheck = localStorage.getItem('RC_RTC_CAMERA_CHECK');
    const camersCheckRes = localStorage.getItem('RC_RTC_CAMERA_CHECK_RES');
    try {
      // 请求摄像头 -》 上报
      if (!camersCheck) {
        logReport({
          eventId: '106-1-9-1'
        });
      }
      const cameras = await AgoraRTC.getCameras();
      this.deviceList.cameras = cameras || [];
      console.log(cameras, '-----cameras------000------');
      if (cameras.length) {
        if (!camersCheckRes) {
          // 首次 -> 已允许
          logReport({
            eventId: '106-1-9-2',
            free_name2: '1'
          });
        }
      } else {
        console.log('----无摄像头---');
        disableDevice.push('camera');
        if (!camersCheckRes) {
          // 无设备
          logReport({
            eventId: '106-1-9-2',
            free_name2: 'no camera',
            device: 0,
          });
        }
      }
      localStorage.setItem('RC_RTC_CAMERA_CHECK', 'true');
      localStorage.setItem('RC_RTC_CAMERA_CHECK_RES', 'true');
    } catch (err) {
      console.log('摄像头权限异常', err);
      disableDevice.push('camera');
      // 首次 -> 已拒绝
      logReport({
        eventId: '106-1-9-2',
        free_name2: '0'
      });
    }

    // 麦克风权限相关 ---------------------------------
    const micCheck = localStorage.getItem('RC_RTC_MIC_CHECK');
    const micCheckRes = localStorage.getItem('RC_RTC_MIC_CHECK_RES');
    try {
      // 请求麦克风 -》 上报
      if (!micCheck) {
        logReport({
          eventId: '106-1-9-3'
        });
      }
      const microphones = await AgoraRTC.getMicrophones();
      this.deviceList.microphones = microphones || [];
      console.log(microphones, '------microphones----000----------');
      if (microphones.length) {
        if (!micCheckRes) {
        // 首次 -> 已允许
          logReport({
            eventId: '106-1-9-4',
            free_name2: '1'
          });
        }
      } else {
        console.log('----无麦克风----');
        disableDevice.push('microphones');
        if (!micCheckRes) {
          // 无设备
          logReport({
            eventId: '106-1-9-4',
            free_name2: '0',
            device: 0,
          });
        }
      }
      localStorage.setItem('RC_RTC_MIC_CHECK', 'true');
      localStorage.setItem('RC_RTC_MIC_CHECK_RES', 'true');
    } catch (err) {
      console.log('麦克风权限异常');
      disableDevice.push('microphones');
      // 首次 -> 已拒绝
      logReport({
        eventId: '106-1-9-4',
        free_name2: '0'
      });
    }

    // 扬声器权限相关 ---------------------------------
    try {
      const speakers = await AgoraRTC.getPlaybackDevices();
      this.deviceList.speakers = speakers || [];
    } catch (err) {
      console.log('喇叭权限异常');
      disableDevice.push('speakers');
    }

    const isReload = localStorage.getItem('RC_ISRELOAD_SQ');
    const { isAndroid } = getPT();

    if (isReload) {
      localStorage.removeItem('RC_ISRELOAD_SQ');
      return;
    }

    // 设备权限异常提示
    if (disableDevice.length) {
      vm.$message({
        html: getDeviceErrorTips(disableDevice)
      }).then(e => {
        // const isMatch = router.currentRoute ? router.currentRoute.name === 'MatchPage' : '';
        // console.log('-----设备权限异常提示--当前页面路由--', isMatch);
        // if (isMatch) {

        router.push({
          name: 'LivCam'
        });
        store.commit('setImChatConfig', {
          show: false,
          friendId: 0
        });

        if (!isReload) {
          if (isAndroid) {
            localStorage.setItem('RC_ISRELOAD_SQ', 1);
          } else {
            setTimeout(() => {
              window.location.reload();
            }, 10);
            localStorage.setItem('RC_ISRELOAD_SQ', 2);
          }
        }

        // }
      });
      return Promise.reject(disableDevice);
    }
    return Promise.resolve();
  }

  // 加入频道并推流
  async joinChannel (channel) {
    const { bizData, curRoomNum } = store.state.agora;
    const { rtcAppId, rtcRoomToken } = bizData;
    const { id } = store.state.app.userInfo;

    await this.client.join(
      rtcAppId,
      curRoomNum,
      rtcRoomToken,
      id,
    );

    this.loadTime = Date.now();

    apiNotifyJoinCall({ roomNum: curRoomNum }).then(res => {
      console.log(res, '自己进入房间调用');
    });

    // 重置参数
    this.videoPos = 1;
    this.living = true;
    this.callTimeNum = 0;

    // 开启定时器 30秒后如果没有接收到对方的推流 挂断
    this.setTimerHangup('videoTimer', 30);

    // 开始视频时长计时
    this.startCallTimeCount();

    if (!this.localVideoTrack) {
      AgoraRTC.setParameter('DISABLE_WEBAUDIO', true);
      const res = await AgoraRTC.createMicrophoneAndCameraTracks({ }, { encoderConfig: '480p_1' });
      this.localAudioTrack = res[0];
      this.localVideoTrack = res[1];
    }

    this.localVideoTrack.play(document.querySelector('#chat1v1-miniVideo'));
    await this.client.publish([this.localAudioTrack, this.localVideoTrack]);
    logReport({
      eventId: '106-1-3-44',
      free_name2: { roomNum: curRoomNum, callLocation: bizData.goddessLocation, isPublished: 1 },
      target_user_id: bizData.remoteUserInfo.id || ''
    });
  }

  // 监听远端
  listenRemote () {
    this.client.on('user-published', async (user, mediaType) => {
      await this.client.subscribe(user, mediaType);

      // 1v1 视频区别处理
      if (store.state.agora.matchCallData.callStatus === 1) {
        this.save1v1(user, mediaType);
        return;
      }

      if (mediaType === 'video') {
        // 订阅完成后，从 `user` 中获取远端视频轨道对象。
        this.remoteVideoTrack = user.videoTrack;
        // 订阅完成，播放远端音视频。
        // 传入 DIV 节点，让 SDK 在这个节点下创建相应的播放器播放远端视频。

        this.remoteVideoTrack.play(
          document.querySelector('#chat1v1-mainVideo'),
        );

        // 首帧返回监听 请求接口
        this.remoteVideoTrack.on('first-frame-decoded', () => {
          const loadTime = Date.now() - this.loadTime;

          logReport({
            eventId: '106-1-3-25',
            free_name2: { loadTime: loadTime, roomNum: store.state.agora.curRoomNum },
            target_user_id: user.uid || ''
          });

          // 切换屏幕是会重复触发 first-frame-decoded  需要过滤;
          if (this.firstFrameShow) return;
          this.firstFrameShow = true;
          window.fbq('track', 'StartTrial');
          // 接收到对方推流 清除30秒挂断定时器
          console.log('清除定时器 first-frame-decoded videoTimer');
          clearTimeout(this.videoTimer);

          apiNotifyStartCall({ roomNum: store.state.agora.tempData.curRoomNum }).then(res => {
            console.log(res, 'first-frame-decoded 首帧监听上报 apiNotifyStartCall');
          });
        });
      }
      // 表示本次订阅的是音频。
      if (mediaType === 'audio') {
        // 订阅完成后，从 `user` 中获取远端音频轨道对象。
        this.remoteAudioTrack = user.audioTrack;
        // 播放音频因为不会有画面，不需要提供 DOM 元素的信息。
        this.remoteAudioTrack.play();
      }
    });

    this.client.on('user-unpublished', async (user, mediaType) => {
      await this.client.unsubscribe(user, mediaType);
      document.querySelector('#chat1v1-mainVideo').innerHTML = '';
    });

    // 状态变更
    this.client.on('connection-state-change', (status) => {
      console.log(status, 'connection-state-change');
    });

    // 用户加入
    this.client.on('user-joined', async () => {
      console.log('user-joined');
      console.log('清除定时器 user-joined');
      clearTimeout(this.leftTimer);

      // 1v1 对方加入房间开始推流
      if (store.state.agora.matchCallData.callStatus === 1) {
        this.st1v1 = Date.now();
        await this.push1v1();
      }
    });
    // 对方离开
    this.client.on('user-left', () => {
      console.log('user-left', this.living);
      // 开启20秒超时挂断定时器
      this.setTimerHangup('leftTimer', 20);
    });

    // 网络质量监控
    // this.client.on('network-quality', (stats) => {
    //   console.log('downlinkNetworkQuality', stats.downlinkNetworkQuality);
    //   console.log('uplinkNetworkQuality', stats.uplinkNetworkQuality);
    // });

    // this.client.on('stream-published', this.steamPublishHandler);
  }

  // 创建音视频流
  async creatRTCTrack (vm) {
    console.log('rtc== create');

    if (this.localVideoTrack && this.localAudioTrack) {
      return Promise.resolve();
    }

    try {
      AgoraRTC.setParameter('DISABLE_WEBAUDIO', true);
      const res = await AgoraRTC.createMicrophoneAndCameraTracks({ }, { encoderConfig: '480p_1' });
      this.localAudioTrack = res[0];
      this.localVideoTrack = res[1];
      return Promise.resolve();
    } catch (e) {
      vm.$message({
        html: getDeviceErrorTips(['camera', 'microphones'])
      }).then(e => {
      });
      return Promise.reject(e);
    }
  }

  // 加入频道并推流
  async matchJoinChannel (data) {
    const { ident, rtcAppId, token } = data;
    const { id } = store.state.app.userInfo;
    await this.client.join(
      rtcAppId,
      ident,
      token,
      id,
    );
    console.log('rtc===', this.client.channelName);

    apiNotifyJoinCall({ roomNum: ident }).then(res => {
      console.log(res, '自己进入房间调用');
    });
  }

  async matchLeavChannel () {
    if (!this.client) return;
    await this.client.leave();
  }

  save1v1 (user, mediaType) {
    if (!store.state.app.show1v1Pop) {
      store.commit('setShow1v1Pop', true);
    }

    console.log('rtc== listen', mediaType);

    if (mediaType === 'video') {
      // 订阅完成后，从 `user` 中获取远端视频轨道对象。
      this.remoteVideoTrack = user.videoTrack;
      // 订阅完成，播放远端音视频。
      // 传入 DIV 节点，让 SDK 在这个节点下创建相应的播放器播放远端视频。

      window.$mObj.callst1v1 = Date.now();

      setTimeout(() => {
        this.remoteVideoTrack.play(
          document.querySelector('#chat1v1-mainVideo'),
        );
      }, 100);

      // 首帧返回监听 请求接口
      this.remoteVideoTrack.on('first-frame-decoded', () => {
        const loadTime = Date.now() - this.st1v1;
        logReport({
          eventId: '106-1-3-25',
          free_name2: { loadTime: loadTime, from: '1v1', roomNum: store.state.agora.matchCallData.ident || '' },
          target_user_id: user.uid || ''
        });

        if (this.firstFrameShow) return;
        this.firstFrameShow = true;

        apiNotifyStartCall({ roomNum: store.state.agora.matchCallData.ident }).then(res => {
          console.log(res, 'first-frame-decoded 首帧监听上报 apiNotifyStartCall');
        });
      });
    }
    // 表示本次订阅的是音频。
    if (mediaType === 'audio') {
      // 订阅完成后，从 `user` 中获取远端音频轨道对象。
      this.remoteAudioTrack = user.audioTrack;
      // 播放音频因为不会有画面，不需要提供 DOM 元素的信息。
      this.remoteAudioTrack.play();
    }
  }

  cancelRTCTrack () {
    console.log('rtc== cancel');

    // this.localAudioTrack && this.localAudioTrack.close();
    // this.localAudioTrack = null;

    // this.localVideoTrack && this.localVideoTrack.close();
    // this.localVideoTrack = null;
  }

  async push1v1 () {
    console.log('rtc== pushtrack', this.localAudioTrack, this.localVideoTrack);
    await this.client.publish([this.localAudioTrack, this.localVideoTrack]);
  }

  async leavl1V1 (cancelByHost) {
    if (this.client.channelName) {
      this.client.unpublish();
    }
    apiNotifyEndCall({ roomNum: store.state.agora.matchCallData.ident }).then(res => {
      console.log(res, '视频结束 apiNotifyEndCall');
    });

    if (cancelByHost) {
      store.commit('set1v1endByHost', true);
    }

    this.firstFrameShow = false;
    await this.client.leave();
    clearTimeout(this.leftTimer);
    this.remoteAudioTrack = null;
    this.remoteVideoTrack = null;
    store.commit('setShow1v1Pop', false);
    store.commit('setMatchCallData', { callStatus: 0 });
  }

  // 视频通话时长统计 从首帧开始 到通话挂断结束
  startCallTimeCount () {
    const start = Date.now();
    this.callTimer = setInterval(() => {
      const end = Date.now();
      this.callTimeNum = Math.floor((end - start) / 1000);
      let min = Math.floor(this.callTimeNum / 60);
      let sec = this.callTimeNum % 60;
      min = min < 10 ? '0' + min : min;
      sec = sec < 10 ? '0' + sec : sec;
      store.commit('setCallTime', {
        time: min + ':' + sec,
        sec: this.callTimeNum
      });
    }, 1000);
  }

  async steamPublishHandler () {
    console.log('steamPublishHandler');
    await this.localVideoTrack.setBeautyEffect(true, {
      lighteningContrastLevel: 2,
      smoothnessLevel: 1,
      rednessLevel: 1
    });
    this.client.off('stream-published', this.steamPublishHandler);
  }

  // 设置超时挂断
  setTimerHangup (timer, time = 20) {
    console.log('开启定时器', timer, time);
    clearTimeout(this[timer]);
    this[timer] = setTimeout(() => {
      if (store.state.agora.curRoomNum) {
        apiHangup({ roomNum: store.state.agora.tempData.curRoomNum }).then(res => {
          console.log('apiTimeout 离开超时');
          store.commit('setVideoPopState', false);
        });
      }
    }, time * 1000);
  }

  // 视频位置互换
  changeVideoPos () {
    let myVideoDom, peerVideoDom;
    if (this.videoPos === 1) {
      myVideoDom = document.querySelector('#chat1v1-mainVideo');
      peerVideoDom = document.querySelector('#chat1v1-miniVideo');
      this.videoPos = 2;
    } else {
      myVideoDom = document.querySelector('#chat1v1-miniVideo');
      peerVideoDom = document.querySelector('#chat1v1-mainVideo');
      this.videoPos = 1;
    }

    this.localVideoTrack && this.localVideoTrack.play(myVideoDom);
    this.remoteVideoTrack && this.remoteVideoTrack.play(peerVideoDom);
  }

  // 离开
  async leaveCall () {
    try {
      this.firstFrameShow = false;
      if (!this.living) { return; }
      this.living = false;
      if (store.state.agora.curRoomNum) {
        apiNotifyEndCall({ roomNum: store.state.agora.tempData.curRoomNum }).then(res => {
          console.log(res, '视频结束 apiNotifyEndCall');
        });
      }

      this.client.unpublish();
      // this.localAudioTrack && this.localAudioTrack.close();
      // this.localVideoTrack && this.localVideoTrack.close();

      await this.client.leave();

      console.log('清除所有定时器');
      clearTimeout(this.videoTimer);
      clearTimeout(this.leftTimer);

      clearInterval(this.callTimer);
      // this.localAudioTrack = null;
      // this.localVideoTrack = null;
      this.remoteAudioTrack = null;
      this.remoteVideoTrack = null;
    } catch (e) {
      console.log(e);
    }
  }

  // 截图生成formData格式数据
  screenShot () {
    console.log('bbbb');
    if (!this.remoteVideoTrack) return false;
    const imgData = this.remoteVideoTrack.getCurrentFrameData();
    const canvas = document.createElement('canvas');
    canvas.width = imgData.width;
    canvas.height = imgData.height;
    const ctx = canvas.getContext('2d');
    ctx.putImageData(imgData, 0, 0, 0, 0, imgData.width, imgData.height);
    const base64Img = canvas.toDataURL('image/jpeg', 0.2);

    const blob = dataURItoBlob(base64Img);
    return blob;
  }

  // toggle对方静音
  toggleRemoteMute (v) {
    if (!this.remoteAudioTrack) return;
    this.remoteAudioTrack.setVolume(v);
  }

  // toggle 自己静音
  toggleMyMute (v) {
    if (!this.localAudioTrack) return;
    this.localAudioTrack.setVolume(v);
  }

  // 生成本地视频流
  async createLocalV () {
    if (!this.localVideoTrack) {
      this.localVideoTrack = await AgoraRTC.createCameraVideoTrack({ encoderConfig: '480p_1' });
    }
    await delayFunc(200);

    if (!this.localAudioTrack) {
      this.localAudioTrack = await AgoraRTC.createMicrophoneAudioTrack();
    }
    return Promise.resolve(this.localVideoTrack);
  }

  cancelLocalV () {
    // this.localVideoTrack && this.localVideoTrack.close();
    // this.localVideoTrack = null;
  }
}
