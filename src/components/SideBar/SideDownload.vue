<template>
  <div class="side-download">
    <h2>{{$t('webChat.downloadLivU')}}</h2>

    <div class="cancel fx-ic hover" @click="cancelDl">
      <span class="icon-cross"></span>
    </div>

    <div class="dl-box fx-be-vc">
      <div class="odl android">
        <div class="cover">
          <div class="icon"></div>
          <div class="qr-code">
            <img src="@/assets/img/t-img-qrcode.png" alt />
          </div>
        </div>
        <h3>{{$t('webChat.android')}}</h3>
        <div class="btn fx-c hover">{{$t('webChat.download')}}</div>
      </div>
      <div class="odl ios">
        <div class="cover">
          <div class="icon"></div>
          <div class="qr-code">
            <img src="@/assets/img/t-img-qrcode.png" alt />
          </div>
        </div>
        <h3>{{$t('webChat.iOS')}}</h3>
        <div class="btn fx-c hover">{{$t('webChat.download')}}</div>
      </div>
    </div>
  </div>
</template>

<script>
import { logReport } from '@/util/logReport';
export default {
  name: 'SideDownload',
  data () {
    return {};
  },
  computed: {},
  methods: {
    cancelDl () {
      this.$emit('canclePop', false);
    }
  },
  mounted () {
    logReport({
      eventId: '106-1-1-5'
    });
  },
};
</script>

<style lang="less" scoped>
.side-download {
  display: flex;
  align-items: center;
  justify-content: center;
  flex-direction: column;
  height: 100%;

  h2 {
    margin: 0;
    font-weight: 600;
    font-size: 24px;
  }

  .cancel {
    position: absolute;
    right: 30px;
    top: 30px;
    width: 40px;
    height: 40px;
    border-radius: 50%;
    font-size: 14px;
  }

  .dl-box {
    justify-content: center;
    margin-top: 60px;
    .odl {
      text-align: center;
      width: 260px;
      padding: 40px;
      margin: 0 30px;
      border-radius: 16px;
      .cover {
        position: relative;
        width: 200px;
        height: 200px;
        overflow: hidden;
        margin: 0 auto;
        cursor: pointer;

        .icon {
          width: 200px;
          height: 200px;

          transition: margin 0.2s;
        }
        &:hover {
          .icon {
            margin-top: -200px;
          }
        }
      }

      &.ios {
        .cover {
          .icon {
            background-position: -200px 0;
          }
        }
      }
      h3 {
        font-size: 20px;
        margin: 20px 0 50px;
      }
    }

    .btn {
      height: 54px;
      border-radius: 50px;
      font-size: 18px;
      font-weight: bold;
    }
  }
  .qr-code {
    width: 146px;
    height: 146px;
    padding: 4px;
    border: solid 1px #d6d6d6;
    border-radius: 7px;
    margin: 20px auto 30px;
    img {
      display: block;
      width: 100%;
      height: 100%;
      background: #f2f2f4;
    }
  }

  .action {
    .btn {
      display: inline-block;
      width: 122px;
      height: 47px;
      background: url(~@/assets/img/icon-download.png) no-repeat;
      background-size: auto 47px;
      margin: 0 5px;
      cursor: pointer;

      &.btn-ios {
        background-position: -122px 0;
      }
    }
  }
}
</style>
