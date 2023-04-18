<template>
  <div class="friend-list common-list flex-col">
    <div class="fliter-box fx-be-vc">
      <div class="m-input-box search-box fx-be-vc">
        <div class="icon icon-search"></div>
        <div class="input-cell">
          <input type="text" v-model="searchVal" spellcheck="false" @focus="showSearchList = true"
          @blur="checkSearchState"
            :placeholder="$t('base.search')" />
        </div>
      </div>
      <div class="ico-remind" @click.stop="showOnlineList">
        <span class="icon-bell hover"></span>
      </div>
    </div>
    <div class="list-wrap">

      <div class="flist-box" ref="friendBox">
        <!-- <template v-if="remindFriend.length">
          <div class="sort-title fx-v">{{$t('app.str_collection_text')}}</div>
          <div class="ocell fx-be-vc" v-for="(item) in remindFriend" :key="item.id" @click="jumpToProfile(item.id)" :data-id="item.id" :id="'u-'+item.id">
            <div class="cell-left">
              <div class="avatar-img">
                <div class="avatar-wrap">
                  <fitimg :headImg="item.headImg" type="smailimg"></fitimg>
                </div>
                <span class="online-status" :class="['s-'+item.status]"></span>
              </div>
            </div>
            <div class="cell-main">
              <h3 class="name">{{ item.userName }}</h3>
              <p><country :countryId="item.countryId"></country></p>
            </div>
          </div>
        </template> -->

        <template v-if="friendList.length">
          <div class="sort-title fx-v">{{$t('base.friends')}}</div>
          <div class="ocell fx-be-vc" v-for="(item) in friendList" :key="item.id" @click="jumpToProfile(item.id)" :data-id="item.id" :id="'u-'+item.id">
            <div class="cell-left">
              <div class="avatar-img">
                <div class="avatar-wrap">
                  <fitimg :headImg="item.headImg" type="smailimg"></fitimg>
                </div>
                <span class="online-status"  :class="['s-'+item.status]"></span>
              </div>
            </div>
            <div class="cell-main">
              <h3 class="name">{{ item.userName }}</h3>
              <p><country :countryId="item.countryId"></country></p>
            </div>
          </div>
        </template>

        <div class="load-more" ref="loadMore">
          {{noMorePage ? '' : $t('base.loading')}}
        </div>

        <div class="load-more" v-if="noMorePage && friendList.length===0 && remindFriend.length===0">
          {{$t('webChat.emptyFriends')}}
        </div>

      </div>
      <!-- 搜索列表 -->
      <div class="search-list" v-if="showSearchList">
          <div class="ocell fx-be-vc" v-for="(item) in searchList" :key="item.id" @click="jumpToProfile(item.id)">
            <div class="cell-left">
              <div class="avatar-img">
                <div class="avatar-wrap">
                  <fitimg :headImg="item.headImg" type="smailimg"></fitimg>
                </div>
              </div>
            </div>
            <div class="cell-main">
              <h3 class="name">{{ item.userName }}</h3>
              <p><country :countryId="item.countryId"></country></p>
            </div>
          </div>
      </div>

    </div>

  </div>
</template>

<script>
import { mapState } from 'vuex';
import { apiGetFriends, apiSearchFriend } from '@/api/friend';
import { apiGetGoddessStatus } from '@/api/goddess';
import debounce from 'lodash/debounce';
import { endeUserId } from '@/filters';
import { logReport } from '@/util/logReport';

export default {
  name: 'FriendList',
  data () {
    return {
      pageNum: 1,
      loadLock: false,
      pageSize: 100,
      friendList: [],
      noMorePage: false,
      searchVal: '',
      remindFriend: [],
      searchList: [],
      showSearchList: false,
      removeScrollEvent: null,
      inViewPos: [],
      inViewUid: [],
      statusTime: null,
    };
  },
  components: {
  },
  watch: {
    searchVal (v) {
      this.searchFriend();
    },
    showSearchList (n, v) {
      if (n) {
        clearTimeout(this.statusTime);
      } else {
        this.$nextTick(() => {
          this.getInViewUid();
        });
      }
    },
    imOnlineShow (o, n) {
      if (!o) {
        this.$nextTick(() => {
          this.getInViewUid();
        });
      }
    }
  },
  computed: {
    ...mapState({
      isMobile: (state) => state.app.isMobile,
      imOnlineShow: (state) => state.app.imOnlineShow
    }),
  },
  methods: {
    jumpToProfile (userId) {
      // 点击好友
      logReport({
        eventId: '106-1-5-1',
        target_user_id: userId
      });
      if (!this.isMobile) {
        this.$store.commit('setImPanelConfig', {
          show: false,
          tabId: 0
        });
      }

      this.$router.push({ name: 'FriendPage', params: { friendId: endeUserId(userId) } });
    },
    sortFriends (data) {
      data.forEach((item) => {
        if (item.stick) {
          this.remindFriend.push(item);
        } else {
          this.friendList.push(item);
        }
      });
      this.getFriendsStatus(this.remindFriend, 'remindFriend');
      this.getFriendsStatus(this.friendList, 'friendList');
    },
    getFriendsStatus (arr, property) {
      if (arr.length < 1) return;
      const list = [];
      arr.forEach(item => {
        list.push(item.id);
      });
      apiGetGoddessStatus({ userIds: list.join(',') }).then(({ data }) => {
        data.forEach(item => {
          const userId = item.userId;
          const length = arr.length;
          for (let i = 0; i < length; i++) {
            if (userId === arr[i].id) {
              this.$set(this[property][i], 'status', item.status);
              break;
            }
          }
        });
      });
    },
    getFriendsData () {
      this.loadLock = true;
      apiGetFriends({
        page: this.pageNum,
        size: this.pageSize
      }).then(({ code, data }) => {
        const { pageNo, pages, list } = data;

        this.loadLock = false;

        if (pageNo === pages || pages === 0) {
          this.noMorePage = true;
        }
        if (list.length) {
          this.friendList.push(...list);
          // this.sortFriends(list);
          this.$nextTick(() => {
            this.getInViewUid();
          });
        }

        this.pageNum += 1;
        console.log(data, 'friends');
      });
    },
    searchFriend: debounce(function () {
      if (!this.searchVal) {
        this.searchList = [];
        return;
      };
      apiSearchFriend({
        searchQ: this.searchVal
      }).then(({ code, data }) => {
        if (data && data.length) {
          this.searchList = data;
        }
      });
    }, 500),
    checkSearchState () {
      if (!this.searchVal) {
        this.showSearchList = false;
        this.searchList = [];
      }
    },
    showOnlineList () {
      clearTimeout(this.statusTime);
      // 点击上线提醒
      logReport({
        eventId: '106-1-5-2'
      });
      // this.$store.commit('setImPanelConfig', false);
      this.$store.commit('setImOnlineState', true);
    },
    addScrollListen () {
      // const wrap = this.$refs.friendBox;

      const wrap = this.isMobile ? window : this.$refs.friendBox;
      const loadDom = this.$refs.loadMore;

      // 窗体高度
      const dfHeight = this.isMobile ? wrap.innerHeight : wrap.clientHeight;

      this.inViewPos = [0, dfHeight];

      const scrollHandler = debounce(() => {
        const morePos = loadDom.offsetTop;
        clearTimeout(this.statusTime);

        const scrollTop = this.isMobile ? wrap.scrollY : wrap.scrollTop;

        let movePos = 0;
        if (this.isMobile) {
          movePos = window.scrollY + window.innerHeight;
        } else {
          movePos = wrap.offsetTop + wrap.scrollTop + wrap.clientHeight;
        }

        this.inViewPos = [scrollTop, movePos];

        this.getInViewUid();

        if (this.loadLock || this.noMorePage) return;
        if (movePos >= morePos) {
          this.getFriendsData();
        }
      }, 500);
      wrap.addEventListener('scroll', scrollHandler);
      return {
        removeEvent () {
          wrap.removeEventListener('scroll', scrollHandler);
        },
      };
    },
    getInViewUid () {
      clearTimeout(this.statusTime);
      const list = [...this.remindFriend, ...this.friendList];
      if (!list.length) return;
      if (!this.$refs.friendBox) return;
      const goddessList = this.$refs.friendBox.querySelectorAll('.ocell');
      const [top, bottom] = this.inViewPos;

      this.inViewUid = [];
      const boxTop = this.isMobile ? document.querySelector('.friend-list').offsetTop : 0;

      goddessList.forEach((item, index) => {
        const offsetTop = item.offsetTop + boxTop;
        if (offsetTop >= top && offsetTop < bottom) {
          const uid = item.getAttribute('data-id');
          if (!uid || +uid <= 0) return;
          this.inViewUid.push(uid);
        }
      });

      this.pollCheckStatus();
    },
    pollCheckStatus () {
      console.log('firend');
      clearTimeout(this.statusTime);
      if (this.inViewUid.length < 1) return;
      // const flist = JSON.parse(JSON.stringify(this.friendList));
      const cls = ['s-0', 's-1', 's-2', 's-3'];
      apiGetGoddessStatus({ userIds: this.inViewUid.join(',') }).then(({ code, data }) => {
        if (data && data.length) {
          data.forEach(item => {
            const className = `s-${item.status}`;
            try {
              document.querySelector(`#u-${item.userId} .online-status`).classList.remove(...cls);
              document.querySelector(`#u-${item.userId} .online-status`).classList.add(className);
            } catch (error) {
              console.log(error, '----err-设置好友在线样式报错--');
            }
          });
        }
      });
      this.statusTime = setTimeout(() => {
        this.pollCheckStatus();
      }, 2000);
    }
  },
  mounted () {
    this.getFriendsData();
    this.$nextTick(() => {
      this.removeScrollEvent = this.addScrollListen();
    });
  },
  beforeDestroy () {
    clearTimeout(this.statusTime);
    this.removeScrollEvent && this.removeScrollEvent.removeEvent();
    console.log('beforeDestroy');
  }
};
</script>
