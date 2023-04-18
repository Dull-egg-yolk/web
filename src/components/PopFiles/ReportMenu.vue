<template>
  <div class="report-menu" @click.stop>
    <ul class="common-list menu" v-if="showOne">
      <li class="ocell fx-be-vc" @click.stop="reportInfo(2, sexyList)">
        {{$t('app.report_adult')}}
      </li>
      <li class="ocell fx-be-vc" @click.stop="reportInfo(5, deceptionList)">
        {{$t('app.report_suspicious')}}
      </li>
      <li class="ocell fx-be-vc" @click.stop="reportInfo(1, genderList)">
        {{$t('app.report_no_match')}}
      </li>
      <li class="ocell fx-be-vc" @click.stop="reportInfo(6, harassList)">
        {{$t('app.report_harass')}}
      </li>
      <li class="ocell fx-be-vc" @click.stop="reportInfo(9, ageList)">
        {{$t('app.report_under_age_use')}}
      </li>
      <li class="ocell fx-be-vc" @click.stop="reportInfo(3)">
        {{$t('app.report_others')}}
      </li>
    </ul>
    <ul class="common-list menu" v-if="showTwo">
      <li class="ocell fx-be-vc" v-for="item in twoList" :key="item.key" @click.stop="reportTwo()">
        {{ item.name }}
      </li>
    </ul>
    <ul class="common-list menu" v-if="showThere">
      <li class="fx-be-vc">
        <div>{{$t('app.report_information')}}<span class="optional">{{$t('app.report_optional')}}</span></div>
      </li>
      <li class="info">
        <textarea v-model="userInfo" :placeholder="$t('app.report_letters')" maxlength="200" @input="descUserInfo"></textarea>
        <span class="remnant">{{remnant}}/200</span>
      </li>
      <li class="fx-be-vc" v-if="showEmail">
        <div>{{$t('app.report_email')}} <span class="optional">{{$t('app.report_optional')}}</span></div>
      </li>
      <li class="email" v-if="showEmail">
        <textarea v-model="userEmail" :placeholder="$t('app.report_address')" maxlength="100" @input="descUserEmail"></textarea>
        <span class="remnant">{{remnants}}/100</span>
      </li>
      <li class="report">
        <div class="report-btn" @click.stop="reportBlock">{{$t('app.report_reporting')}}</div>
      </li>
      <li class="cancle">
        <div class="cancle-btn" @click.stop="cancleBlock">{{$t('base.cancel')}}</div>
      </li>
    </ul>
  </div>
</template>

<script>
import { apiReportUser, apiReportVideo, apiReportUpgrade, apiReportEmail, apiAddBlock } from '@/api/friend';
import Cookies from 'js-cookie';
import { apiUplodImg } from '@/api/user';
import { deleteChatUser } from '@/util/message';
import { logReport } from '@/util/logReport';

export default {
  name: 'ReportMenu',
  data () {
    return {
      showOne: true,
      showTwo: false,
      showThere: false,
      reportData: {},
      userEmail: '',
      userInfo: '',
      showEmail: true,
      remnant: 0,
      remnants: 0,
      twoList: [],
      site: null,
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
  components: {
  },
  props: {
    friendData: {
      type: Object,
      default: () => {
        return {};
      }
    },
    reportVideo: {
      type: Number,
      default: () => {
        return {};
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
        target_user_id: this.friendData.id,
        free_name2: { report_info: this.reportList[data] }
      });
      this.twoList = list;
      if (data === 3) {
        this.showThere = true;
      } else {
        this.showTwo = true;
      }
      this.showOne = false;

      const params = {
        reason: data,
        reportType: 0,
        reportUserId: this.friendData.id,
        site: 2,
        wallGoddess: true
      };
      if (this.reportVideo === 1) {
        apiReportUser(params).then((res) => {
          console.log(res);
        });
      } else {
        this.videoReportUpload(data);
      }
    },
    // 视频report 上传图片
    videoReportUpload (data) {
      const imgFormData = this.$rtc.screenShot();
      if (!imgFormData) return;

      const formData = new FormData();
      formData.append('image', imgFormData);

      apiUplodImg(formData, true).then(res => {
        const imgUrl = res?.data?.data?.url;
        if (imgUrl) {
          apiReportVideo({
            reportReq: {
              reportImg: imgUrl,
              gender: this.friendData.gender,
              reportReason: data,
              reportedUserId: this.friendData.id,
              reportPage: 15,
            }
          }).then(res2 => {
            if (res2.code === 200) {
              this.$emit('reportSucc', true);
            }
          });
        }
      });
    },

    reportTwo () {
      this.showThere = true;
      this.showTwo = false;
    },
    // 举报按钮
    reportBlock () {
      const params = {
        email: this.userEmail,
        reportId: this.friendData.id,
        threeReportReason: this.userInfo,
        twoReportReason: 0
      };
      if (this.reportVideo === 1) {
        this.$emit('show', false);
      } else {
        apiReportUpgrade(params).then((data) => {
          this.showThere = false;
          this.showTwo = false;
        });
        this.$emit('show', false);
      }
      this.addBlock();
    },
    cancleBlock () {
      this.$emit('reportSucc', false);
      this.showThere = false;
      this.$emit('show', false);
    },
    // 拉黑
    addBlock () {
      apiAddBlock({
        blacklistUserId: this.friendData.id,
        userId: Cookies.get('userId')
      }).then(async ({ code, data }) => {
        console.log(code, data);
        try {
          await deleteChatUser(this.friendData.id);
        } catch (error) {
          console.log(error, '--indexdb--error---');
        }
        this.$message({
          desc: {
            title: this.$t('app.report_thanks_title'),
            txt: this.$t('app.report_thanks_desc')
          }
        }).then(mres => {
          console.log('aaaaa');
          this.$emit('reportSucc', true);
          this.$emit('show', false);
        });
      });
    },
  },
  mounted () {
    console.log(this.friendData);
    apiReportEmail().then((data) => {
      if (data.data) {
        // this.showEmail = false;
      }
    });
  },
};
</script>

<style lang="less" scoped>
.user-report-pop {
    position: absolute;
    top: 130px;
    left:45%;
    background: #17161F;
    box-shadow: 0px 0px 16px 0px rgb(0 0 0 / 50%);
    border-radius: 12px;
    padding: 15px 10px;
    z-index: 10;
    li {
      position: relative;
      min-width: 220px;
      white-space: nowrap;
      height: 40px;
      color: #fff;
      font-size: 14px;
      .optional{
        color: #FF78FF;
        font-size: 12px;
        margin-left: 5px;
      }
      .remnant{
        position: absolute;
        right: 5px;
        bottom: 5px;
        color: rgb(102, 100, 100);
      }
    }
    .info {
      min-width: 220px;
      white-space: nowrap;
      height: 130px;
      color: #BEBCDF;
      font-size: 14px;
      border: 1px solid #666464;
      border-radius: 10px;
      overflow: hidden;
      textarea {
        height: 100px;
        color: #fff;
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
        color: #fff;
      }
    }
    textarea {
      color: #fff;
      width: 100%;
      background-color: #17161F;
      padding: 10px;
    }

    .ocell {
      cursor: pointer;
      // transition: all 0.3s;
      padding: 0 20px;
      box-sizing: border-box;
    }
  }

.report-btn {
  border-radius: 30px;
  background-image: linear-gradient(135deg, #FF78FF 0%, #32E5FF 100%);
  text-align: center;
  line-height: 25px;
  margin-top: 10px;
  cursor: pointer;
  color: #fff;
  padding: 10px 20px;
  font-weight: 700;
}
.cancle-btn {
  text-align: center;
  color: #777777;
  line-height: 25px;
  padding-top: 5px;
}
</style>
