<template>
  <div class="profile-edit">
    <div class="edit-wrap">
      <div class="btn-back hover fx-c" @click="jumpBack">
        <span class="icon-cross"></span>
      </div>

      <div class="mb-title flex-row-vc">
        <div class="actions l fx-c" @click="jumpBack">
          <span class="icon-arrow"></span>
        </div>
        <div class="title l fx-v">{{$t('app.profile_page_title')}}</div>
      </div>
      <div class="photos fx-v">
        <div class="common-img oimg" v-for="(item, index) in picList" :key="index">
          <div class="img-wrap">
            <div class="loading fx-c" v-if="loadIdx === index">
              <span class="icon-refresh2"></span>
            </div>
            <!-- <div class="tag" v-if="item.orderNum === 1">Avatar</div> -->
            <input type="file" name="" id="" @change="chooseImg($event, item, index)" accept="image/*" />
            <img :src="item.pic360" alt="" v-if="item.orderNum">
            <span class="icon-add" v-if="!item.orderNum && loadIdx !== index"></span>
            <span class="edit icon-edit" v-if="index === 0" ></span>
            <span class="del icon-delete" v-if="item.id && item.orderNum !== 1" @click="delPhoto(item, index)"></span>
          </div>
        </div>
      </div>
      <div class="m-item fx-be-vc">
        <div class="cell-left">
          {{$t('app.hint_name')}}
        </div>
        <div class="cell-right">
          <input type="text" v-model="nickName" spellcheck="false" :placeholder="profile.userName" maxlength="30" @blur="updateName">
          <span class="remnant">{{nickName.length}}/30</span>
        </div>
      </div>

      <div class="m-item birthday fx-be-vc">
        <div class="cell-left">
          {{$t('app.profile_birthday')}}
          <div class="tips">{{$t('app.profile_update_age_notice')}}</div>
        </div>
        <div class="cell-right">
          <pop-date-picker ref="datePicker" :date.sync="birthday" :disabled="profile.birthdayChange"></pop-date-picker>
        </div>

      </div>

      <div class="m-item sign-item flex-col">
        <div class="cell-left">
          {{$t('app.profile_bio_title')}}
        </div>
        <div class="cell-right">
          <textarea v-model="signature" spellcheck="false" :placeholder="originSign" @blur="updateSign" maxlength="140"></textarea>
        </div>
      </div>

      <div class="m-item list-item flex-col">
        <div class="cell-left">
          {{$t('base.interests')}}
        </div>
        <div class="cell-right">
          <div class="tag-list fx-row-c">
            <div class="otag fx-ic " v-for="(item, index) in intDic" :key="index"
              :class="{ selected: intSe.indexOf(item.id) !== -1 }" @click="addInt(item.id)">
              {{ $t(`interest.${item.id}`) }}
            </div>
          </div>
        </div>
      </div>

      <div class="m-item list-item flex-col">
        <div class="cell-left">
          {{$t('base.language')}}
        </div>
        <div class="cell-right">
          <div class="tag-list fx-row-c">
            <div class="otag fx-ic " v-for="(item, index) in langDic" :key="index"
              :class="{ selected: langSe.indexOf(item.id) !== -1 }" @click="addLang(item.id)">
              {{ item.name }}
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>

import { year, month, day } from '@/filters';
import { logReport } from '@/util/logReport';
import { mapState } from 'vuex';
import { formatTime, htmlEncode } from '@/util/index.js';
import { getInterestDic, getLangDic, apiUpdateUserInfo, apiUplodImg, apiUploadAlbumImg, apiDelAlbumImg } from '@/api/user';
import PopDatePicker from '@/components/PopFiles/PopDatePicker.vue';

import { apiGetUserPics } from '@/api/friend';

export default {
  name: 'ProfileEdit',
  data () {
    return {
      nickName: '',
      birthday: '',
      signature: '',
      intDic: [],
      langDic: [],
      intSe: [],
      langSe: [],
      picList: [],
      picEmpty: [2, 3, 4, 5, 6],
      loadIdx: -1,
    };
  },
  filters: {
    year, month, day
  },
  watch: {
    profile (n) {
      this.initData();
    },
    birthday (n) {
      if (formatTime(n, 'YYYY-MM-DD') === this.originBirthDay) {
        return;
      }
      this.updateT();
    },
  },
  computed: {
    ...mapState({
      profile: (state) => state.app.userInfo
    }),
    originBirthDay () {
      if (this.profile.birthday) {
        return formatTime(this.profile.birthday, 'YYYY-MM-DD');
      }
      return '';
    },
    originSign () {
      return this.profile.introduce || this.$t('app.profile_bio_hint');
    }
  },
  components: {
    PopDatePicker
  },
  methods: {
    updateName () {
      if (!this.nickName || (this.nickName === this.profile.userName)) return false;

      this.nickName = htmlEncode(this.nickName);

      apiUpdateUserInfo({
        userName: this.nickName
      }).then(res => {
        console.log(res, 'userName');
        logReport({
          eventId: '106-1-7-2',
          free_name2: { user_name: this.nickName }
        });
      });
    },
    chooseImg (e, imgData, index) {
      const resFile = e.target.files[0];
      if (!resFile) return;

      if (resFile.size / (1024 * 1024) > 5) {
        this.$message({
          desc: {
            txt: this.$t('webChat.imgSizeErr'),
          }
        });
        return;
      }
      const formData = new FormData();
      formData.append('image', resFile);

      // 计算当前需要修改的图片的位置 添加loading 状态
      const params = {};
      if (imgData.orderNum && (imgData.orderNum === 1 || imgData.id)) {
        params.replaceId = imgData.id;
        params.orderNum = imgData.orderNum;
        params.imgIdx = index;
        params.type = 'edit';
      } else {
        params.orderNum = this.picEmpty[0];

        // 获取空位
        for (let i = 0; i < this.picList.length; i++) {
          if (!this.picList[i].orderNum) {
            params.imgIdx = i;
            break;
          }
        }
        params.type = 'add';
      }

      this.loadIdx = params.imgIdx;

      e.target.value = '';

      apiUplodImg(formData).then((res) => {
        console.log(res, 'ddd');
        const { code, data } = res?.data || {};
        if (code === 200) {
          this.updatePhotos(data, params);
          logReport({
            eventId: '106-1-7-1',
            free_name2: { img_url: data.pic }
          });
        }
      });
    },
    updatePhotos (urls, params) {
      Object.assign(urls, params);
      apiUploadAlbumImg(urls).then(({ code, data }) => {
        this.loadIdx = -1;
        if (data.status === 0 && data.pic) {
          this.picList.splice(params.imgIdx, 1, data.pic);
          if (params.type === 'add') {
            this.picEmpty.splice(0, 1);
          }
        }
      });
    },
    updateSign () {
      if (!this.signature || (this.signature === this.originSign)) return false;
      apiUpdateUserInfo({
        introduce: this.signature
      }).then(res => {
        console.log(res);
      });
    },
    getDicData () {
      getInterestDic().then(({ code, data }) => {
        console.log(data, '---dic');
        this.intDic = data.list || [];
        this.intSe = data.selected || [];
      });

      getLangDic().then(({ code, data }) => {
        console.log(data, '---dic');
        this.langDic = data.list || [];
        this.langSe = data.selected || [];
      });
    },
    addInt (id) {
      const idx = this.intSe.indexOf(id);
      if (idx !== -1) {
        this.intSe.splice(idx, 1);
      } else {
        if (this.intSe.length >= 5) {
          this.$message({
            desc: {
              txt: this.$t('app.select_interest_beyond_hint'),
            }
          });
          return;
        }
        this.intSe.push(id);
      }

      apiUpdateUserInfo({
        interestList: this.intSe
      }).then(res => {
        console.log(res);
        logReport({
          eventId: '106-1-7-4',
          free_name2: { interest: this.intSe }
        });
      });
    },
    addLang (id) {
      const idx = this.langSe.indexOf(id);
      if (idx !== -1) {
        this.langSe.splice(idx, 1);
      } else {
        if (this.langSe.length >= 3) {
          this.$message({
            desc: {
              txt: this.$t('app.select_language_beyond_hint'),
            }
          });
          return;
        };
        this.langSe.push(id);
      }
      apiUpdateUserInfo({
        languageList: this.langSe
      }).then(res => {
        console.log(res);
        logReport({
          eventId: '106-1-7-5',
          free_name2: { language: this.langSe }
        });
      });
    },
    jumpBack () {
      this.$router.back();
    },

    // 检查年龄
    checkBirthDay () {
      if (!this.birthday) {
        return;
      }
      const birth = new Date(this.birthday);
      const birthYear = birth.getFullYear();
      const birthMonth = birth.getMonth() + 1;
      const birthDay = birth.getDate();
      const myDate = new Date();
      const monthNow = myDate.getMonth() + 1;
      const dayNow = myDate.getDate();
      let age = myDate.getFullYear() - birthYear;
      if (monthNow < birthMonth || (monthNow === birthMonth && dayNow < birthDay)) {
        age--;
      }
      return age;
    },
    updateT () {
      const age = this.checkBirthDay();
      if (age < 18) {
        this.$message({
          desc: {
            txt: this.$t('app.age_too_young')// '年龄不能小于18岁'
          }
        });
        return;
      }

      apiUpdateUserInfo({
        birthday: this.birthday
      }).then(res => {
        console.log(res);
        logReport({
          eventId: '106-1-7-3',
          free_name2: { brithday: this.birthday }
        });
      });
    },
    /**
     * 获取我的图集
     */
    getMyPhotos () {
      apiGetUserPics({
        searchUserId: this.profile.id
      }).then(({ code, data }) => {
        const picList = data?.picList || [];
        this.picPhotosHandle(picList);
      });
    },
    picPhotosHandle (data) {
      const idxArr = [1, 2, 3, 4, 5, 6];
      const resArr = [];
      console.log(data, 'aaa');
      data.forEach(item => {
        idxArr.splice(idxArr.indexOf(item.orderNum), 1);
        resArr.push(item);
      });

      // 头像处理
      if (idxArr.indexOf(1) !== -1) {
        resArr.unshift({ orderNum: 1, pic360: this.profile.headImg });
        idxArr.splice(0, 1);
      }

      // 补够6个
      while (resArr.length < 6) {
        resArr.push({});
      }

      this.picEmpty = idxArr;
      this.picList = resArr;

      console.log(this.picList, this.picEmpty, '----aaa');
    },
    // 删除图集图片
    delPhoto (imgData, index) {
      this.$message({
        noCancelBtn: false,
        desc: {
          txt: this.$t('app.video_delete_hint_title'),
        }
      }).then(res => {
        apiDelAlbumImg({
          picId: imgData.id
        }).then(({ code, data }) => {
          // const picList = data?.picList || [];
          // this.picPhotosHandle(picList);

          this.picList.splice(index, 1, {});
          this.picEmpty.push(imgData.orderNum);
          console.log(this.picEmpty);
        });
      });
    },
    initData () {
      this.getMyPhotos();
      this.birthday = this.profile.birthday;
      this.nickName = this.profile.userName || '';
      console.log(this.birthday, this.nickName);
    }
  },
  mounted () {
    if (this.profile.id) {
      this.initData();
    }
    if (this.originSign !== this.$t('app.profile_bio_hint')) this.signature = this.originSign;
    this.getDicData();
  },
};
</script>

<style lang="less">
@import url("./index.less");
.remnant{
  text-align: right;
  width: 100%;
  display: inline-block;
  color: rgb(102, 100, 100);
}
</style>
