<template>
  <base-pop class="pop-report" :outClickCancel="false" :showPop="showReport" @cancelPop="closePop">
    <div class="report-menu" @click.stop>
      <div class="pop-close"><span class="user-icon icon-cross" @click="cancleBlock"></span></div>
      <ul class="common-list menu" v-if="showOne">
        <li class="ocell fx-be-vc" @click.stop="reportInfo(2, sexyList)">
          {{ $t('app.report_adult') }}
        </li>
        <li class="ocell fx-be-vc" @click.stop="reportInfo(5, deceptionList)">
          {{ $t('app.report_suspicious') }}
        </li>
        <li class="ocell fx-be-vc" @click.stop="reportInfo(1, genderList)">
          {{ $t('app.report_no_match') }}
        </li>
        <li class="ocell fx-be-vc" @click.stop="reportInfo(6, harassList)">
          {{ $t('app.report_harass') }}
        </li>
        <li class="ocell fx-be-vc" @click.stop="reportInfo(9, ageList)">
          {{ $t('app.report_under_age_use') }}
        </li>
        <li class="ocell fx-be-vc" @click.stop="reportInfo(3)">
          {{ $t('app.report_others') }}
        </li>
      </ul>
      <ul class="common-list menu" v-if="showTwo">
        <li class="ocell fx-be-vc" v-for="item in twoList" :key="item.key" @click.stop="reportTwo(item)">
          {{ item.name }}
        </li>
      </ul>
      <ul class="common-list menu" style="padding: 0 20px;" v-if="showThere">
        <li class="fx-be-vc">
          <div>{{ $t('app.report_information') }}<span class="optional">{{ $t('app.report_optional') }}</span></div>
        </li>
        <li class="info">
          <textarea v-model="userInfo" :placeholder="$t('app.report_letters')" maxlength="200"
            @input="descUserInfo"></textarea>
          <span class="remnant">{{ remnant }}/200</span>
        </li>
        <li class="fx-be-vc" v-if="showEmail">
          <div>{{ $t('app.report_email') }} <span class="optional">{{ $t('app.report_optional') }}</span></div>
        </li>
        <li class="email" v-if="showEmail">
          <textarea v-model="userEmail" :placeholder="$t('app.report_address')" maxlength="100"
            @input="descUserEmail"></textarea>
          <span class="remnant">{{ remnants }}/100</span>
        </li>
        <li class="report">
          <div class="report-btn" @click.stop="reportBlock">{{ $t('app.report_reporting') }}</div>
        </li>
        <!-- <li class="cancle">
          <div class="cancle-btn" @click.stop="cancleBlock">{{ $t('base.cancel') }}</div>
        </li> -->
      </ul>
    </div>
  </base-pop>
</template>

<script>
import { mapState } from 'vuex';
import BasePop from '../BasePop.vue';
import { logReport } from '@/util/logReport';
import { apiReportUser, apiReportVideo, apiReportUpgrade, apiReportEmail, apiAddBlock } from '@/api/friend';
import Cookies from 'js-cookie';
import { apiUplodImg } from '@/api/user';
import { deleteChatUser } from '@/util/message';

export default {
  name: 'PopReport',
  data () {
    return {
      showOne: true,
      showTwo: false,
      showThere: false,
      reportData: {},
      userEmail: '',
      userInfo: '',
      reportId: '',
      showEmail: true,
      remnant: 0,
      remnants: 0,
      twoList: [],
      reportUpgrade: false,
      site: null,
      twoReportReason: 0,
      sexyList: [{
        name: this.$t('app.report_nude'),
        key: 210
      },
      {
        name: this.$t('app.report_sex_implication'),
        key: 220
      },
      {
        name: this.$t('app.report_prostitution'),
        key: 230
      },
      {
        name: this.$t('app.report_child_exploitation'),
        key: 240
      },
      {
        name: this.$t('app.report_others'),
        key: 250
      }],
      genderList: [{
        name: this.$t('app.report_gender_mismatch'),
        key: 110
      },
      {
        name: this.$t('app.report_pretend_celebrity'),
        key: 120
      },
      {
        name: this.$t('app.report_pretend_others'),
        key: 130
      },
      {
        name: this.$t('app.report_others'),
        key: 140
      }],
      deceptionList: [{
        name: this.$t('app.report_ask_gift'),
        key: 510
      },
      {
        name: this.$t('app.report_defraud'),
        key: 520
      },
      {
        name: this.$t('app.report_junk_mail'),
        key: 530
      },
      {
        name: this.$t('app.report_controlled_commodity'),
        key: 540
      },
      {
        name: this.$t('app.report_criminal_organization'),
        key: 550
      },
      {
        name: this.$t('app.report_terrorism'),
        key: 560
      },
      {
        name: this.$t('app.report_others'),
        key: 570
      }],
      harassList: [{
        name: this.$t('app.report_abusively'),
        key: 610
      },
      {
        name: this.$t('app.report_violence_threat'),
        key: 620
      },
      {
        name: this.$t('app.report_discriminate'),
        key: 630
      },
      {
        name: this.$t('app.report_unwanted_contact'),
        key: 640
      },
      {
        name: this.$t('app.report_others'),
        key: 650
      }],
      ageList: [{
        name: this.$t('app.report_record_nonage'),
        key: 910
      },
      {
        name: this.$t('app.report_contact_nonage'),
        key: 920
      }],
      reportList: {
        2: this.$t('app.report_adult'),
        5: this.$t('app.report_suspicious'),
        1: this.$t('app.report_no_match'),
        6: this.$t('app.report_harass'),
        9: this.$t('app.report_under_age_use'),
        3: this.$t('app.report_others')
      }
    };
  },
  props: {},
  components: {
    BasePop,
  },
  computed: {
    ...mapState({
      showReport: (state) => state.app.showReport,
      friendInfo: (state) => state.app.friendInfo,
      isMobile: (state) => state.app.isMobile,
      showVideoPop: (state) => state.app.showVideoPop,
      reportImg: (state) => state.app.reportImg,
      show1v1Pop: (state) => state.app.show1v1Pop,
    }),
  },
  watch: {
    friendInfo (n) {
      console.log(n, '0000000');
    },
    showVideoPop (n) {
      console.log(n, '1111');
    },
    showReport (n) {
      if (n) {
        apiReportEmail().then((data) => {
          if (data.data) {
          }
        });
      }
    }
  },
  methods: {
    descUserInfo () {
      var txtVal = this.userInfo.length;
      this.remnant = 0 + txtVal;
    },
    descUserEmail () {
      var txtVal = this.userEmail.length;
      this.remnants = 0 + txtVal;
    },
    reportInfo (data, list) {
      logReport({
        eventId: '106-1-10-1',
        target_user_id: this.friendInfo.id,
        free_name2: { report_info: this.reportList[data] }
      });
      if (this.showVideoPop) {
        this.reportUpgrade = true;
        this.$parent.$refs.reportCall.cancelVideo();
      }
      if (this.show1v1Pop) {
        this.reportUpgrade = true;
        this.$parent.$refs.reportCall1v1.cancelVideo();
        this.$router.push({ name: 'LivCam' });
      }
      this.twoList = list;
      if (data === 3) {
        this.userEmail = '';
        this.remnant = 0;
        this.remnants = 0;
        this.userInfo = '';
        this.showThere = true;
      } else {
        this.showTwo = true;
      }
      this.showOne = false;

      const params = {
        reason: data,
        reportType: 0,
        reportUserId: this.friendInfo.id,
        site: 2,
        wallGoddess: true
      };
      if (this.showVideoPop || this.show1v1Pop) {
        this.videoReportUpload(data);
      } else {
        apiReportUser(params).then((res) => {
          console.log(res);
        });
      }
    },
    // 视频report 上传图片
    videoReportUpload (data) {
      const imgUrl = this.reportImg;
      apiReportVideo({
        reportReq: {
          reportImg: imgUrl,
          gender: this.friendInfo.gender,
          reportReason: data,
          reportedUserId: this.friendInfo.id,
          reportPage: 15,
        }
      }).then(res2 => {
        if (res2.code === 200) {
          this.reportId = res2.data;
          this.$emit('reportSucc', true);
        }
      });
    },
    reportTwo (item) {
      this.twoReportReason = item.key;
      console.log(item, '0000000');
      this.userEmail = '';
      this.remnant = 0;
      this.remnants = 0;
      this.userInfo = '';
      this.showThere = true;
      this.showTwo = false;
    },
    // 举报按钮
    reportBlock () {
      const params = {
        email: this.userEmail,
        reportId: this.reportId || 0,
        threeReportReason: this.userInfo,
        twoReportReason: this.twoReportReason
      };
      logReport({
        eventId: '106-1-10-2',
        target_user_id: this.friendInfo.id,
      });
      console.log(this.showVideoPop, '9999999');
      if (!this.reportUpgrade) {
        this.$store.commit('setShowReport', false);
        this.$emit('show', false);
        this.$emit('reportSucc', false);
        this.showThere = false;
        this.showOne = true;
      } else {
        apiReportUpgrade(params).then((data) => {
          this.$store.commit('setShowReport', false);
          this.$emit('reportSucc', false);
          this.showThere = false;
          this.showOne = true;
        });
        this.$emit('show', false);
        this.reportUpgrade = false;
      }
      this.addBlock();
    },
    cancleBlock () {
      this.$store.commit('setShowReport', false);
      this.$emit('reportSucc', false);
      this.showThere = false;
      this.showTwo = false;
      this.$emit('show', false);
      this.showOne = true;
    },
    // 拉黑
    addBlock () {
      apiAddBlock({
        blacklistUserId: this.friendInfo.id,
        userId: Cookies.get('userId')
      }).then(async ({ code, data }) => {
        console.log(code, data);

        await deleteChatUser(this.friendInfo.id);
        this.$message({
          desc: {
            title: this.$t('app.report_thanks_title'),
            txt: this.$t('app.report_thanks_desc')
          }
        }).then(mres => {
          console.log('aaaaa');
          this.$store.commit('setShowReport', false);
          this.$emit('reportSucc', true);
          this.$emit('show', false);
        });
      });
    },
    closePop (type) {
      this.$store.commit('setShowReport', false);
      this.$emit('reportSucc', false);
      this.showThere = false;
      this.showTwo = false;
      this.$emit('show', false);
      this.showOne = true;
    },
  },
  mounted () {
    console.log(this.userEmail, this.userInfo);
    this.showOne = true;
  },
};
</script>

<style lang="less" scoped>
@import url('~@/style/var.less');

#app {
  .pop-report {
    .report-menu {
      background-color: #fff;
      color: #000;
      width: 320px;
      height: 379px;
      border-radius: 12px;
      backdrop-filter: blur(20px);

      .pop-close {
        display: flex;
        justify-content: flex-end;
        padding-top: 15px;
        padding-right: 20px;

        span {
          cursor: pointer;
          font-size: 16px;
        }
      }

      .common-list {
        .ocell {
          height: 56px;
        }
      }

        li {
          min-width: 220px;
          white-space: nowrap;
          height: 40px;
          font-size: 14px;
          position: relative;

          .optional {
            color: #FF78FF;
            font-size: 12px;
            margin-left: 5px;
          }

          .remnant {
            position: absolute;
            right: 5px;
            bottom: 5px;
            color: rgb(102, 100, 100);
          }
        }

        .info {
          min-width: 220px;
          white-space: nowrap;
          height: 100px;
          font-size: 14px;
          border: 1px solid #666464;
          border-radius: 10px;
          overflow: hidden;

          textarea {
            height: 80px;
            // color: #fff;
            color: #000;
          }
        }

        .report {
          display: flex;
          justify-content: center;
          align-items: center;
          height: 60px;
        }

        .cancle {
          display: flex;
          justify-content: center;
          align-items: center;
          height: 40px;
        }

        .email {
          border: 1px solid #666464;
          border-radius: 10px;
          overflow: hidden;
          height: 70px;

          textarea {
            height: 50px;
            // color: #fff;
            color: #000;
          }
        }

        textarea {
          width: 100%;
          padding: 10px;
        }

        .ocell {
          cursor: pointer;
          // transition: all 0.3s;
          padding: 0 20px;
          box-sizing: border-box;
        }

      .report-btn {
        border-radius: 30px;
        background: linear-gradient(135deg, #FF78FF 0%, #32E5FF 100%);
        text-align: center;
        line-height: 25px;
        margin-top: 30px;
        cursor: pointer;
        color: #000;
        padding: 10px 20px;
        font-weight: 700;
        margin-bottom: 10px;
      }

      .cancle-btn {
        text-align: center;
        color: #222;
        line-height: 25px;
        padding-top: 15px;
      }
    }
  }
}

@media screen and(max-width: 680px) {
  #app {
    .pop-report {
      &>.pop-content {
        width: 100%;
        height: 60%;
        position: fixed;
        bottom: 0;
      }

      .report-menu {
        padding-bottom: 15px;
        background-color: #fff;
        width: 100%;
        height: auto;
        justify-content: flex-end;
        .common-list .ocell {
          font-size: 12px;
          height: 40px;
        }
      }
    }
  }
}</style>
