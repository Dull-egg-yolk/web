import { apiFriendVideo } from '@/api/call';
import { apiGetGoddessStatus } from '@/api/goddess';

const curDialogListSet = new Set();
export default {
  state: {
    rtmToken: '',
    rtmUserId: '',
    bizData: {
      remoteUserInfo: {
        id: ''
      }
    },
    curRoomNum: '',
    curCallRole: '',
    curDialogList: [],
    curDialogId: '',
    callTime: '00:00',
    callTimeSec: 0,
    unReadCount: 0,
    tempData: {
      bizData: {
        remoteUserInfo: {}
      },
      curRoomNum: '',
      curCallRole: '',
    },
    matchCallData: {
      callStatus: 0, // 0 未开始  1 匹配到
    },
    matchToMin: {
      show: false,
      time: 0,
      enough: true,
    },
    beginMinCall: false,
    minCallConf: {},
    end1v1ByHost: false
  },
  mutations: {
    set1v1endByHost (state, payload) {
      state.end1v1ByHost = payload;
    },
    setBeginMinCall (state, payload) {
      window.$mObj.callstMinu = Date.now();
      state.beginMinCall = true;
      state.minCallConf = { ...payload };
      state.matchCallData = { ...state.matchCallData, ...{ relation: payload.relation } };
    },
    resetBeginMinCall (state, payload) {
      state.beginMinCall = false;
    },
    setMatchToMin (state, payload = {}) {
      state.matchToMin = { ...state.matchToMin, ...payload };
    },
    setMatchCallData (state, payload = {}) {
      state.matchCallData = { ...state.matchCallData, ...payload };
    },
    saveRtmConfig (state, payload) {
      state.rtmToken = payload.rtmToken;
      state.rtmUserId = payload.rtmUserId;
    },
    setBizData (state, payload) {
      console.log(payload, '-=====22-setBizData--payload--');
      if (typeof payload !== 'object') {
        state.bizData = {
          remoteUserInfo: {
            id: ''
          }
        };
      } else {
        state.bizData = { remoteUserInfo: { id: '' }, ...payload };
      }
      state.tempData.bizData = JSON.parse(JSON.stringify(state.bizData));
    },
    setRemoteUserData (state, payload) {
      state.bizData.remoteUserInfo = { ...state.bizData.remoteUserInfo, ...payload };
      state.tempData.bizData.remoteUserInfo = JSON.parse(JSON.stringify(state.bizData.remoteUserInfo));
    },
    setCurRoomNum (state, roomNum) {
      state.curRoomNum = roomNum;
      state.tempData.curRoomNum = roomNum;
      localStorage.setItem('RC_CURROOM_NUM', roomNum);
    },
    setCurCallRole (state, callRole) {
      state.curCallRole = callRole;
      state.tempData.curCallRole = callRole;
      localStorage.setItem('RC_MY_CALL_ROLE', callRole);
    },
    setCurDialogId (state, friendId) {
      state.curDialogId = friendId;
    },
    setUnReadCount (state, count) {
      state.unReadCount = count;
    },
    saveDialog (state, payload) {
      // debugger;
      if (Array.isArray(payload)) {
        payload.forEach(item => {
          const id = item.messageId;
          if (!curDialogListSet.has(id)) {
            curDialogListSet.add(id);
            state.curDialogList.push(item);
          }
        });
        // state.curDialogList.push(...payload);
      } else {
        // const { userId, bizData } = payload;
        // const isCurrChat =
        // state.curDialogId && (state.curDialogId === bizData.sendUserId ||
        //   userId === bizData.sendUserId);
        const id = payload.messageId;
        if (!curDialogListSet.has(id)) {
          curDialogListSet.add(id);
          state.curDialogList.push(payload);
        }
      }
    },
    resetDialog (state) {
      curDialogListSet.clear();
      state.curDialogList = [];
    },
    resetVideoChat (state) {
      state.curRoomNum = '';
      state.bizData = {};
      state.curCallRole = '';
      localStorage.removeItem('RC_CURROOM_NUM');
      localStorage.removeItem('RC_MY_CALL_ROLE');
    },
    setCallTime (state, payload) {
      const { time, sec } = payload;
      state.callTime = time || '00:00';
      state.callTimeSec = sec;
    }
  },
  actions: {
    cancelBell ({ state, commit }) {
      const { bizData, curRoomNum, curCallRole } = state.tempData;
      const { remoteUserInfo } = bizData;

      const params = {
        onlineStatus: 1,
        busyStatus: 0,
        goddessCall: bizData.goddessLocation,
        matchUserId: remoteUserInfo.id,
        gold: bizData.pricePerMinute,
        requestType: curCallRole === 'caller' ? 1 : 2,
        roomId: curRoomNum,
        inappFlag: 0,
        matchFlag: -1,
        feeType: bizData.pricePerMinute ? 1 : 0,
      };

      apiGetGoddessStatus({
        userIds: remoteUserInfo.id
      }).then(({ code, data }) => {
        const { status } = data[0];

        // 0: 'offline',
        // 1: 'busy',
        // 2: 'online',
        // 3: 'invsible'

        if (status === 0) {
          params.onlineStatus = 0;
          params.busyStatus = 0;
        } else if (status === 1) {
          params.onlineStatus = 2;
          params.busyStatus = 1;
        } else if (status === 2) {
          params.onlineStatus = 1;
          params.busyStatus = 0;
        } else if (status === 3) {
          params.onlineStatus = -1;
          params.busyStatus = 0;
        }

        // 挂断通话上报
        apiFriendVideo(params).then(res => {
          console.log(res, 'dddaa');
        });
      }).catch(e => {
        params.onlineStatus = -1;
        params.busyStatus = 0;
        // 挂断通话上报
        apiFriendVideo(params).then(res => {
          console.log(res, 'dddaa');
        });
      });
    }
  }
};
