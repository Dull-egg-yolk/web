<template>
  <div class="side-user flex-col" @click="showSet = false">
    <!-- 给移动端用的页面标题 -->
    <div class="im-page-title mb-page-title fx-be-vc">
      <div class="action back hover" @click="cancelPop">
        <span class="ico icon-arrow"></span>
      </div>
      <h2 class="title-txt r2">
        个人中心
      </h2>
    </div>
    <!-- 个人信息 -->

    <profile-detail :profileData="userInfo"></profile-detail>

    <div class="btn-setting fx-ic hover" @click.stop="showSet = !showSet">
      <span class="icon-setting"></span>
    </div>

    <!-- 修改资料 -->
    <transition name="slideDown"
    >
      <div class="user-control" v-if="showSet" @click.stop>
        <div class="list-title">Set Up</div>
        <ul class="m-cell-list">
          <!-- 购买金币 -->
          <li class="ocell coin" @click="jumpTo('CoinPage')">
            <div class="cell-left">
              <span class="icon-cart"></span>
            </div>
            <div class="cell-main">{{ '购买金币' }}</div>
            <div class="cell-right">
              <span class="num">{{ userInfo.goldNum }}</span>
              <span class="icon-arrow"></span>
            </div>
          </li>

          <!-- 通知设定 -->
          <li class="ocell" @click="showPopSetup('notify')">
            <div class="cell-left" >
              <span class="icon-notify"></span>
            </div>
            <div class="cell-main">Notification Settings</div>
          </li>

          <li class="ocell" @click="showPopSetup('language')">
            <div class="cell-left">
              <span class="icon-font"></span>
            </div>
            <div class="cell-main">Language</div>
          </li>

          <li class="ocell">
            <div class="cell-left">
              <span class="icon-helpnew"></span>
            </div>
            <div class="cell-main">FAQ</div>
          </li>

          <li class="ocell" @click="showPopSetup('block')">
            <div class="cell-left">
              <span class="icon-block"></span>
            </div>
            <div class="cell-main">block</div>
          </li>
          <!-- 登出 -->
          <li class="ocell" @click="logout">
            <div class="cell-left">
              <span class="icon-exit"></span>
            </div>
            <div class="cell-main">{{ $t('base.logout') }}</div>
          </li>
        </ul>
      </div>
    </transition>
  </div>
</template>

<script>
import { mapState } from 'vuex';
import { calculateAge, otherIdFilter } from '@/filters';
import { userLogout } from '@/api/user';
import { clearAllCookie } from '@/util';
import { logReport } from '@/util/logReport';

import ProfileDetail from '@/components/ProfileDetail';

export default {
  name: 'SideUser',
  data () {
    return {
      showSet: false
    };
  },
  components: {
    ProfileDetail
  },
  filters: {
    calculateAge,
    otherIdFilter
  },
  computed: {
    ...mapState({
      userInfo: (state) => state.app.userInfo,
    }),
  },
  methods: {
    cancelPop () {
      this.$emit('canclePop');
    },
    // 页面跳转
    jumpTo (pageName) {
      if (pageName === 'ProfilePage') {
        // this.actionLogReport('profile');
      } else if (pageName === 'CoinPage') {
        this.actionLogReport('coin');
      }
      this.cancelPop();
      setTimeout(() => {
        this.$router.push({ name: pageName });
      }, 320);
    },
    // 显示设置弹框
    showPopSetup (step) {
      this.actionLogReport('setting');
      // this.cancelPop();
      this.$store.commit('setPopSetup', step);
    },
    // 显示帮助反馈窗口
    showPopHelp () {
      // this.actionLogReport('help');
    },
    // 登出
    logout () {
      this.actionLogReport('logout');
      userLogout().then(res => {
        clearAllCookie();
        this.$store.commit('setIsLogin', false);
        window.location.href = '/';
      });
      // this.$router.push({ name: 'Home' });
    },
    actionLogReport (type) {
      const eventId = {
        profile: '106-1-2-1',
        coin: '106-1-2-2',
        setting: '106-1-2-4',
        logout: '106-1-2-5',
      }[type];
      logReport({
        eventId
      });
    }
  },
  mounted () {
    console.log(this.userInfo);
  },
};
</script>

<style lang="less" scoped>
@import url("~@/style/var.less");
.side-user {
  position: relative;
  z-index: 10;
  height: 100%;
  .m-page-title {
    display: none;
  }
  .btn-setting {
    position: absolute;
    top: 20px;
    right: 20px;
    width: 40px;
    height: 40px;
    font-size: 18px;
    z-index: 20;
  }
  .user-control {
    position: absolute;
    padding: 20px;
    width: 360px;

    .list-title {
      font-size: 24px;
      padding: 20px 10px;
      font-weight:700
    }

    li {
      padding: 5px 10px;
      height: 40px;
      font-size: 14px;
      border-radius: 10px;
      .cell-left {
        width: 24px;
        height: 24px;
        text-align: center;
        line-height: 24px;
        font-size: 16px;
      }

      .icon-arrow {
        flex: 0 0 auto;
        height: 24px;
        line-height: 24px;
        font-size: 12px;
        opacity: 0.6;
        display: inline-block;
      }

      &.coin {
        .num {
          padding: 0 2px 0 20px;
          color: @cgray-5;
          font-size: 12px;
          background: url(~@/assets/img/icon-coin.png) left top no-repeat;
          background-size: 16px auto;
        }
      }
    }
  }
}

@media screen and(max-width: 680px) {
  .side-user {
    .im-page-title {
      position: absolute;
      top: 0;
      left: 0;
      z-index: 10;
    }

    .btn-setting {
      width: 34px;
      height: 34px;
      right: 14px;
      top: 13px;
    }
    .user-control {
      width: 260px;
      padding: 14px;
      .list-title{
        font-size:20px;
      }
      li {
        font-size:14px;

        .cell-left{
          font-size:14px;
        }

      }
    }
  }
}
</style>
