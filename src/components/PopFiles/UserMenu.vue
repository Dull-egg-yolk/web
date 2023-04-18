 <template>
  <div class="user-menu" @click.stop>
    <ul class="common-list menu">
      <li class="ocell  fx-be-vc" @click="editName = true" v-if="isFriend">
        {{$t('app.setting_note_name')}}
      </li>
      <li class="ocell fav fx-be-vc" v-if="isFriend">
        <div class="cell-main">
          {{$t('app.str_collection_text')}}
        </div>
        <div class="cell-right">
          <span class="icon-star" :class="{ faved: isFav }"  @click="addFav"></span>
        </div>
      </li>
      <li class="ocell online  fx-be-vc" v-if="isFriend">
        <div class="cell-main">
          {{$t('app.online_remind')}}
        </div>
        <div class="cell-right" @click="switchRemind">
          <f-switch :value="isOlineRm" :lock="false"></f-switch>
        </div>
      </li>
      <li class="ocell accoubts fx-be-vc" @click="addBlock">
       {{$t('app.black_dialog_positive')}}
      </li>
      <li class="ocell report fx-be-vc" @click.stop="reportFriend">
       {{$t('base.report')}}
      </li>
      <li class="ocell delete fx-be-vc" v-if="isFriend" @click="delFriend">
        {{$t('base.delete')}}
      </li>
    </ul>
    <!-- 修改昵称 -->
    <pop-input
      :show="editName"
      :inputVal="userName"
      :profileData="friendData"
      :title="$t('app.setting_note_name')"
      v-if="editName"
      @cancel="changeName"
    ></pop-input>
  </div>
</template>

<script>
import FSwitch from '../FormItem/FSwitch.vue';
import { apiSetStick, apiAddBlock, apiRemarkName, apiDelFriend, apiSwitchRemind } from '@/api/friend';
import Cookies from 'js-cookie';
import PopInput from '../../components/PopFiles/PopInput.vue';
import { deleteChatUser } from '@/util/message';
import { logReport } from '@/util/logReport';

export default {
  name: 'UserMenu',
  data () {
    return {
      isFav: 0,
      isOlineRm: true,
      isFriend: false,
      editName: false,
      userName: '',
      profileData: {}
    };
  },
  components: {
    FSwitch,
    PopInput,
  },
  props: {
    friendData: {
      type: Object,
      default: () => {
        return {};
      }
    }
  },
  methods: {
    changeName (name) {
      console.log(name, '12212');
      this.editName = false;

      if (name === false) {
        return;
      }
      apiRemarkName({
        friendUserId: this.friendData.id,
        remark: name || ''
      }).then(({ code, data }) => {
        console.log(code, data);
        this.$emit('update:userName', data.userName || this.friendData.userName);
        this.$emit('update:show', false);
        this.$emit('changeUserName', data.userName);
        this.userName = data.userName;
      });
    },
    addFav () {
      apiSetStick({
        friendUserId: this.friendData.id,
        stick: this.isFav === 0 ? 1 : 0
      }).then(({ code, data }) => {
        this.isFav = data.stick;
        logReport({
          eventId: '106-1-6-9',
          target_user_id: this.friendData.id,
          free_name2: { is_fav: this.isFav }
        });
      });
    },
    addBlock () {
      // 点击拉黑
      logReport({
        eventId: '106-1-6-11',
        target_user_id: this.friendData.id
      });
      this.$message({
        noCancelBtn: false,
        desc: {
          title: this.$t('base.blacklist'),
          txt: this.$t('app.black_dialog_message'),
        }
      }).then(() => {
        apiAddBlock({
          blacklistUserId: this.friendData.id,
          userId: Cookies.get('userId')
        }).then(async ({ code, data }) => {
          console.log(code, data);
          await deleteChatUser(this.friendData.id);
          this.$emit('update:show', false);
          logReport({
            eventId: '106-1-6-12',
            target_user_id: this.friendData.id
          });
        });
      }).catch(() => {
        logReport({
          eventId: '106-1-6-13',
          target_user_id: this.friendData.id
        });
      });
    },
    delFriend () {
      logReport({
        eventId: '106-1-6-16',
        target_user_id: this.friendData.id
      });
      this.$message({
        noCancelBtn: false,
        desc: {
          title: this.$t('base.delete'),
          txt: this.$t('app.dialog_friend_del_title'),
        }
      }).then(() => {
        apiDelFriend({
          friendUserId: this.friendData.id
        }).then(async ({ code, data }) => {
          await deleteChatUser(this.friendData.id);
          window.location.href = '/';
          logReport({
            eventId: '106-1-6-17',
            target_user_id: this.friendData.id
          });
        });
      }).catch(() => {
        logReport({
          eventId: '106-1-6-18',
          target_user_id: this.friendData.id
        });
      });
    },
    switchRemind () {
      apiSwitchRemind({
        friendUserId: this.friendData.id,
        switchStatus: !this.isOlineRm
      }).then(({ code, data }) => {
        this.isOlineRm = data.status;
        this.$emit('update:friendData', Object.assign({}, this.friendData, { remindSwitch: data.status }));
        logReport({
          eventId: '106-1-6-10',
          target_user_id: this.friendData.id,
          free_name2: { is_online: this.isOlineRm }
        });
      });
    },
    reportFriend () {
      logReport({
        eventId: '106-1-6-14',
        target_user_id: this.friendData.id
      });
      // this.$emit('reportData', this.friendData);
      // this.$emit('reportVideo', 1);
      this.$store.commit('setFriendInfo', this.friendData);
      this.$store.commit('setShowReport', true);
    }
  },
  mounted () {
    this.isFav = this.friendData.stick;
    this.isFriend = this.friendData.relation === 2;
    this.userName = this.friendData.userName;
    this.isOlineRm = this.friendData.remindSwitch;
  },
};
</script>

<style lang="less" scoped>
.user-menu {
  background: #17161F;
  box-shadow: 0px 0px 16px 0px rgb(0 0 0 / 50%);
  border-radius: 12px;
  padding: 15px 0;
  width:260px;
  box-sizing:border-box;

  .ocell {
    height: 40px;
  }

  .fav {
    .icon-star {
      font-size: 18px;
      opacity: .2;
      transition: all .2s;
      &.faved {
        opacity: 1;
        color: #FF78FF
      }
    }
  }
}
</style>
