import { mapActions, mapState } from 'vuex';
import { apiGetRelations, apiAddFriend } from '@/api/friend';
import Cookies from 'js-cookie';
import i18n from '@/i18n';
import { insertAddFriend } from '@/util/broadcast';
import { logReport } from '@/util/logReport';
import debounce from 'lodash/debounce';

export default {
  data () {
    return {
      isRequestAddFriend: false
    };
  },
  computed: {
    ...mapState({
      isLogin: (state) => state.app.isLogin,
      isMobile: (state) => state.app.isMobile
    }),
  },
  methods: {
    ...mapActions(['updateMyUserData']),
    // im 陌生人需要发送单向好友请求 扣9金币
    imChatCheck: debounce(function (data) {
      const { id, userName, headImg, name } = data;
      apiGetRelations({
        friendUserId: id
      }).then(({ code, data }) => {
        if (data === 4) {
          if (Cookies.get('oneWayAFPop')) {
            this.imAddFriend(id);
            return;
          };
          this.$message({
            confirmBtnTxt: i18n.t('base.ok'), // '继续添加',
            noCancelBtn: false,
            desc: {
              txt: i18n.t('app.add_friend_pay_attention_message_female', { gold: 9 }) // 'this chat will coast 9 gold'
            }
          }).then(res => {
            this.imAddFriend(id);
            Cookies.set('oneWayAFPop', 'true', { expires: 365 });
            logReport({
              eventId: '106-1-2-6',
              target_user_id: id
            });
          }).catch(res => {
            logReport({
              eventId: '106-1-2-7',
              target_user_id: id
            });
          });
        } else {
          this.$store.commit('setImChatConfig', {
            show: !this.isMobile,
            friendId: id,
            headImg,
            userName: userName || name
          });
          if (this.isMobile) {
            this.$router.push({
              name: 'IMMessageSession'
            });
          }
        }
        console.log(data, '---------imcheck');
      });
    }, 400),
    imAddFriend (id) {
      if (this.isRequestAddFriend) return;
      this.isRequestAddFriend = true;
      apiAddFriend({
        addWay: 102,
        friendUserId: id,
        addReally: true
      }).then(({ code, data }) => {
        if (code === 200) {
          // 插入加好友消息
          console.log('---加好友----', data);
          // insertAddFriend(data, 1);
          this.updateMyUserData();
          this.$store.commit('setImChatConfig', {
            show: !this.isMobile,
            friendId: id,
            headImg: data.headImg,
            userName: data.userName
          });
          if (this.isMobile) {
            this.$router.push({
              name: 'IMMessageSession'
            });
          }
        } else if (code === 20001) {
          this.$message({
            confirmBtnTxt: i18n.t('app.exchange_lucky_draw'), // '充值',
            noCancelBtn: false,
            desc: {
              txt: i18n.t('app.gold_not_enough'), // '金币不足'
            }
          }).then(() => {
            logReport({
              eventId: '106-1-2-8',
              target_user_id: id
            });
            this.$router.push('/coin');
          }).catch(res => {
            logReport({
              eventId: '106-1-2-9',
              target_user_id: id
            });
          });
        }

        this.isRequestAddFriend = false;
      });
    },
    checkLoginStatus (from) {
      if (!this.isLogin) {
        this.$store.commit('setLoginPopFrom', from);
        window.fbq('trackCustom', 'GomeetShowLoginPop');
        window.gtag && window.gtag('event', 'goMeetShowLoginPop', { send_to: ['AW-834247273/TQgKCNy00YIYEOm05o0D', 'livu'] });
        return false;
      }
      return true;
    }
  }
};
