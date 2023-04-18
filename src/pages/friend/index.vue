<template>
  <div class="page-body">
    <div class="friend-page im-page-layout" @click="showReminder = false">
      <div class="im-page-side">
        <div class="im-page-title fx-be-vc">
          <h2 class="title-txt">Friends </h2>
          <!-- <div class="action"></div> -->
        </div>

        <!-- 搜索 -->
        <div class="search-box">
          <div class="m-input-box mini drak fx-be-vc">
            <span class="icon icon-search"></span>
            <div class="input-cell fx-c">
              <input type="text" placeholder="搜索好友" />
            </div>
          </div>
        </div>

        <!-- 列表 -->
        <div class="im-side-list" ref="friendList">
          <div class="m-user-list m-cell-list">
            <!-- 暂时隐藏 -->
            <template v-if="false">
              <div
                class="ocell"
                :class="{ cur: showReminder }"
                @click.stop="showReminder = !showReminder"
              >
                <div class="cell-left">
                  <div class="avatar-img fx-c special online-tip">
                    <span class="icon-bell"></span>
                  </div>
                </div>
                <div class="cell-main">
                  <h3 class="name">好友上线提醒</h3>
                </div>
              </div>
              <div class="sort-title">收藏</div>
              <div class="ocell" @click="jumpDetail">
                <div class="cell-left">
                  <div class="avatar-img">
                    <div class="avatar-wrap">
                      <img src="@/assets/img/t-img-avatar.png" alt />
                    </div>
                  </div>
                </div>
                <div class="cell-main">
                  <h3 class="name">Tommy</h3>
                  <p>
                    <span class="icon-location-line"></span> hello~
                  </p>
                </div>
              </div>
              <div class="sort-title">好友</div>

              <div class="ocell">
                <div class="cell-left">
                  <div class="avatar-img fx-c special vip">
                    <span class="icon-headset"></span>
                  </div>
                </div>
                <div class="cell-main">
                  <h3 class="name">客服</h3>
                </div>
              </div>
            </template>

            <div class="sort-title">Collection</div>
            <!-- 好友列表 -->
            <template v-if="friendList.length">
              <div
                class="ocell"
                v-for="(item, index) in friendList"
                :class="{ cur: (curFIndex === index || curFId == item.id), disabled: item.allowCall === false }"
                :key="index"
                @click="jumpDetail(item, index)"
              >
                <div class="cell-left">
                  <div class="avatar-img">
                    <div class="avatar-wrap">
                      <img :src="item.headImg" alt />
                    </div>
                  </div>
                </div>
                <div class="cell-main">
                  <h3 class="name">{{ item.userName }}</h3>
                  <p v-if="item.countryId">
                    <span class="icon-location-line"></span>
                    <country :countryId="item.countryId" type="name"></country>
                  </p>
                </div>
              </div>
            </template>
          </div>
          <div class="load-more" ref="fLoadMore">
            <span v-if="!noMorePage">loading...</span>
          </div>
        </div>

        <!-- 好友上线提醒 -->
        <!-- <transition name="slideDown"> -->
          <div class="online-reminder-list" v-if="showReminder" @click.stop>
            <!-- 手机时显示的标题和回退 -->
            <div class="m-page-title">
              <span class="actions l icon-arrow" @click.stop="showReminder = false"></span>
              <h2 class="title-txt">好友上线提醒</h2>
            </div>
            <div class="inner m-cell-list">
              <div class="ocell">
                <div class="cell-left">
                  <div class="avatar-img">
                    <div class="avatar-wrap">
                      <img src="@/assets/img/t-img-avatar.png" alt />
                    </div>
                  </div>
                </div>
                <div class="cell-main">
                  <div class="name">Tommy</div>
                  <div class="location small-font txt-gray">
                    <span class="ico icon-location-line"></span>
                    NewYork
                  </div>
                </div>
                <div class="cell-right">
                  <f-switch :value="false" @change="changeReminder(1, ...arguments)"></f-switch>
                </div>
              </div>
              <div class="ocell">
                <div class="cell-left">
                  <div class="avatar-img">
                    <div class="avatar-wrap">
                      <img src="@/assets/img/t-img-avatar.png" alt />
                    </div>
                  </div>
                </div>
                <div class="cell-main">
                  <div class="name">Andy</div>
                  <div class="location small-font txt-gray">
                    <span class="ico icon-location-line"></span>
                    NewYork
                  </div>
                </div>
                <div class="cell-right">
                  <f-switch :value="true" @change="changeReminder(1, ...arguments)"></f-switch>
                </div>
              </div>
              <div class="ocell">
                <div class="cell-left">
                  <div class="avatar-img">
                    <div class="avatar-wrap">
                      <img src="@/assets/img/t-img-avatar.png" alt />
                    </div>
                  </div>
                </div>
                <div class="cell-main">
                  <div class="name">Cindy</div>
                  <div class="location small-font txt-gray">
                    <span class="ico icon-location-line"></span>
                    NewYork
                  </div>
                </div>
                <div class="cell-right">
                  <f-switch :value="false" @change="changeReminder(1, ...arguments)"></f-switch>
                </div>
              </div>
            </div>
            <div class="arrow"></div>
          </div>
        <!-- </transition> -->
      </div>

      <router-view></router-view>
    </div>
  </div>
</template>

<script>
import { mapState } from 'vuex';
import FSwitch from '@/components/FormItem/FSwitch';
import { apiGetFriends } from '@/api/friend';
import debounce from 'lodash/debounce';

export default {
  name: 'FriendList',
  data () {
    return {
      showReminder: false,
      pageNum: 1,
      loadLock: false,
      pageSize: 100,
      friendList: [],
      inViewPos: [],
      noMorePage: false,
      removeScrollEvent: null,
      curFIndex: -1,
      curFId: 0
    };
  },
  components: {
    FSwitch,
  },
  computed: {
    ...mapState({
      isLogin: (state) => state.app.isLogin,
    }),
  },
  watch: {
    $route (n, v) {
      if (n.name !== 'FriendDetail') {
        this.curFIndex = -1;
        this.curFId = 0;
      }
      this.checkMobile();
    }
  },
  methods: {
    changeReminder (...arg) { },
    jumpDetail (item, index) {
      if (item.allowCall === false) {
        this.$message({
          title: 'oops',
          desc: {
            title: '',
            txt: '该用户暂不支持web端'
          }
        });
        return;
      }

      this.curFIndex = index;
      this.curFId = item.id;
      this.$router.push({
        name: 'FriendDetail',
        query: { friendId: item.id }
      });
    },
    getFriendsData () {
      this.loadLock = true;
      apiGetFriends({
        page: this.pageNum,
        size: this.pageSize
      }).then(res => {
        const { pageNo, pages, list } = res;

        this.loadLock = false;

        if (pageNo === pages || pages === 0) {
          this.noMorePage = true;
        }

        // this.friendList.push(...mockDate);
        if (list.length) {
          this.friendList.push(...list);
        }

        this.pageNum += 1;
        console.log(res, 'friends');
      });
    },
    /* 挂载好友列表滚动监听
     * 1 加载下一页数据
     * 2 获取当前可视区域的起始坐标
     */
    listenerScroll () {
      const { friendList, fLoadMore } = this.$refs;
      // 初始可视区域值
      this.inViewPos = [0, friendList.clientHeight];

      const scrollHandler = debounce(() => {
        const movePos = friendList.scrollTop + friendList.clientHeight + friendList.offsetTop;
        const morePos = fLoadMore.offsetTop;

        // 获取视窗范围 没登录不处理
        if (this.isLogin) {
          this.inViewPos = [friendList.scrollTop, movePos];
          // this.getInViewUid();
        }

        // 加载更多
        if (this.loadLock) return;
        if (movePos >= morePos) {
          if (this.noMorePage) return;
          this.getFriendsData();
        }
      }, 500);
      friendList.addEventListener('scroll', scrollHandler);
      // 抛出清除监听函数 方便后续清理
      return {
        removeEvent () {
          friendList.removeEventListener('scroll', scrollHandler);
        },
      };
    },
    // 检测是否为移动适配样式 自动跳转到移动端路由
    checkMobile () {
      if (this.$route.name === 'FriendPage' && document.documentElement.clientWidth > 680) {
        this.$router.push({
          name: 'FriendIndex'
        });
      }

      if (this.$route.name === 'FriendIndex' && document.documentElement.clientWidth <= 680) {
        this.$router.push({
          name: 'FriendPage'
        });
      }
    }
  },
  mounted () {
    this.checkMobile();
    this.getFriendsData();
    this.removeScrollEvent = this.listenerScroll();
    this.curFId = this.$route.query.friendId;

    window.addEventListener('resize', this.checkMobile);
  },
  beforeDestroy () {
    console.log('remove resize');
    window.removeEventListener('resize', this.checkMobile);
  }
};
</script>

<style lang="less" scoped>
@import url("./index.less");
</style>
