<!-- eslint-disable no-tabs -->
<template>
  <div>
    <div :class="['mask', { show: isShow }]" v-show='isShow'>
      <div class='dialog'>
        <div class='img'><img :src='videoListLop.headImg' alt='' /></div>
        <div class='name'>
          {{ videoListLop.userName
          }}<ins class='woman'
            ><em>{{ videoListLop.fabulous }}</em></ins
          >
        </div>
        <div class='text'>{{ $t('p5.friend') }}</div>
        <a
          class='bottom-wrap'
          :href='apk'
          target='_blank'
          @click.stop='actClickBtn(1)'
        >
          <div class='btn-bottom'>
            <img src='@/assets/img/h5download/video.png' />
            <div>{{ $t('p5.video') }}</div>
          </div>
        </a>
        <div class='close' @click.stop='actClose'></div>
      </div>
    </div>
    <div :class="['mask', { showTwo: isShowTwo }]" v-show='isShowTwo'>
      <div class='dialog'>
        <div class='imgTwo'>
          <img src='@/assets/img/h5download/email.png' alt='' />
        </div>
        <div class='text'>
          {{ videoListLop.userName }} {{ $t('p5.message') }}
        </div>
        <a
          class='bottom-wrap'
          :href='apk'
          target='_blank'
          @click.stop='actClickBtn(2)'
        >
          <div class='btn-bottom'>
            <img src='@/assets/img/h5download/video.png' />
            <div>{{ $t('p5.bannerBtn') }}</div>
          </div>
        </a>
        <div class='close' @click.stop='actClose'></div>
      </div>
    </div>
  </div>
</template>

<script scoped>
import { videoListLop } from './p3';
export default {
  props: {
    apk: {
      type: String,
      default: '',
    },
    isShow: {
      type: Boolean,
      default: false,
    },
    isShowTwo: {
      type: Boolean,
      default: false,
    },
    userId: {
      type: String,
      default: '',
    },
    hostData: {
      type: Array,
      default: () => [],
    },
  },
  beforeUpdate () {
    if (this.isShow || this.isShowTwo) {
      this.$emit('dialogStaFn');
    }
  },
  data () {
    return {
      videoListLop,
      link: 'https://livuchat.me',
    };
  },
  methods: {
    actClose () {
      this.$emit('close');
      this.$emit('clickClose');
    },
    actClickDialog () {
      this.$emit('clickDialog');
    },
    actClickBtn (type) {
      // window.open(this.link + window.location.search + '&register=1')
      if (window.location.search) {
        window.location.href =
          this.link + window.location.search + '&register=1';
      } else {
        window.location.href = this.link + '?register=1';
      }
    },
  },
  created () {
    var hostList = [];
    this.videoListLop.forEach((element) => {
      hostList.push(element.big);
      hostList.push(element.small1);
      hostList.push(element.small2);
    });
    this.videoListLop =
      hostList[Math.floor(Math.random() * hostList.length + 1) - 1];
  },
};
</script>

<style lang='less' rel='stylesheet/css' scoped>
@import '~@/style/rem-px.less';
.mask {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  display: flex;
  justify-content: center;
  align-items: center;
  background: rgba(0, 0, 0, 0.7);
  transform: scale(2);
  transition: all 0.4s cubic-bezier(0.55, 0, 0.1, 1);
  opacity: 0;
  z-index: 110;

  &.show {
    transform: scale(1);
    opacity: 1;
  }
  &.showTwo {
    transform: scale(1);
    opacity: 1;
  }
}

.woman {
  text-decoration: none;
  position: relative;
  background-color: #ff348b;
  color: #ffffff;
  padding-left: 0.625rem;
  border-radius: 3px;
  width: 0.4rem;
  height: 0.4rem;
  margin-left: 0.3125rem;

  em {
    font-size: 14px;
    line-height: 14px;
    display: block;
    transform: scale(0.75);
    margin-right: 0.5rem;
    margin-left: -0.1rem;
  }

  &::before {
    content: '';
    position: absolute;
    top: 0.0525rem;
    left: 0.1725rem;
    width: 0.2625rem;
    height: 0.2625rem;
    background: url(~@/assets/img/h5download/woman.png) no-repeat;
    background-size: 100%;
  }
}

.dialog {
  position: relative;
  width: 80%;
  background: #fff;
  .rem-px(border-radius, 8px);
  overflow: hidden;
}

.fix-h {
  min-height: 12rem;
}

.img {
  .rem-px(width, 120px);
  .rem-px(height, 120px);
  .rem-px(margin, 20px auto 0);
  .rem-px(border-radius, 50%);
  display: flex;
  justify-content: center;
  align-items: center;
  overflow: hidden;
  box-shadow: 0 0 15px rgba(234, 72, 121, 0.5);

  img {
    max-width: 100%;
  }
}
.imgTwo {
  .rem-px(width, 120px);
  .rem-px(height, 140px);
  .rem-px(margin, 20px auto 0);
  display: flex;
  justify-content: center;
  align-items: center;
  overflow: hidden;

  img {
    max-width: 100%;
  }
}

.bottom-wrap {
  display: inline-block;
  width: 100%;
  text-align: center;
  margin: 20px 0;

  .btn-bottom {
    background: linear-gradient(138deg, #a425ff 0%, #6b10ff 100%);
    width: 255px;
    height: 50px;
    border-radius: 10px;
    line-height: 50px;
    color: #fff;
    font-size: 17px;
    font-weight: 500;
    display: flex;
    justify-content: center;
    margin: 0 auto;
    animation: move 2s ease-in 1s infinite;

    img {
      width: 30px;
      height: 20px;
      margin-right: 10px;
      margin-top: 15px;
    }
  }
}

.static-img1 {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  z-index: 999;
  display: flex;
  justify-content: center;
  align-items: center;
  overflow: hidden;

  .nei-b {
    .rem-px(width, 304px);
    .rem-px(height, 304px);
    .rem-px(border-radius, 50%);
    z-index: 100;
    position: absolute;
    top: 10%;
    left: 50%;
    transform: translateX(-50%);
    display: flex;
    justify-content: center;
    align-items: center;
    overflow: hidden;
    box-shadow: 0 0 15px rgba(234, 72, 121, 0.5);

    img {
      max-width: 100%;
    }
  }
}

.static-img {
  background-color: #000;
  display: flex;
  padding: 3rem 0;
  justify-content: center;

  img {
    max-width: 100%;
    width: 14.96875rem;
    height: 6.25rem;
  }
}

.text {
  .rem-px(margin, 10px auto 0 auto);
  .rem-px(line-height, 60px);
  width: 90%;
  .rem-px(font-size, 40px);
  font-weight: bolder;
  font-size: 18px;
  line-height: 22px;
  color: #000;
  background-color: #fff;
  text-align: center;
}

.btn {
  position: relative;
  .rem-px(margin, 10px);
  text-align: center;

  .d-bg {
    display: inline-block;
    .rem-px(width, 600px);
    .rem-px(height, 40px);
    background: url(~@/assets/img/h5download/button-bg.png) no-repeat;
    background-size: cover;
    background: linear-gradient(90deg, #ea4879 0%, #eb7769 100%);
    border-radius: 5px;
    width: 90%;
    animation: move 3s ease-in 1s infinite;
  }

  .bt-text-img {
    position: absolute;
    top: 0;
    left: 50%;
    transform: translateX(-48%);
    // background: url(~@/assets/lpEN003/button-text.png) no-repeat;
    background-size: cover;
    .rem-px(width, 600px);
    .rem-px(height, 120px);
    z-index: 999;
  }
}

.img-name {
  display: flex;
  justify-content: center;
  height: 13px;
  margin-top: 0.625rem;

  img {
    max-height: 100%;
  }
}

.name {
  display: block;
  display: flex;
  align-items: center;
  justify-content: center;
  color: #333;
  font-weight: bold;
  font-size: 18px;
  line-height: 10px;
  margin-top: 0.625rem;
}

.woman {
  text-decoration: none;
  position: relative;
  background-color: #ff348b;
  color: #ffffff;
  padding-left: 0.625rem;
  border-radius: 3px;
  width: 0.4rem;
  height: 0.4rem;
  margin-left: 0.3125rem;

  em {
    font-size: 13px;
    line-height: 16px;
    display: block;
    transform: scale(0.75);
    margin-right: 0.5rem;
  }

  &::before {
    content: '';
    position: absolute;
    top: 0.0525rem;
    left: 0.1725rem;
    width: 0.3125rem;
    height: 0.3125rem;
    background: url('~@/assets/img/h5download/woman.png') no-repeat;
    background-size: 100%;
  }
}

.man {
  text-decoration: none;
  position: relative;
  background-color: #089ee6;
  color: #ffffff;
  padding-left: 0.625rem;
  border-radius: 3px;
  width: 1.875rem;
  height: 0.71875rem;
  margin-left: 0.3125rem;

  em {
    font-size: 12px;
    line-height: 12px;
    display: block;
    transform: scale(0.75);
  }

  &::before {
    content: '';
    position: absolute;
    top: 0.078125rem;
    left: 0.15625rem;
    width: 0.34375rem;
    height: 0.59375rem;
    // background: url('~@/assets/img/h5download/man.png') no-repeat;
    background-size: 100%;
  }
}

.video {
  position: absolute;
  top: 0;
  left: 50%;
  transform: translateX(-50%);
  width: 100%;
  .rem-px(height, 40px);
  display: flex;
  word-break: no-wrap;
  font-size: 0.5rem;
  color: #ffffff;
  justify-content: center;
  align-items: center;
  // padding-left: 1.5rem;
  text-align: center;
  font-weight: bold;
  z-index: 999;

  ins {
    position: absolute;
    top: 0.4rem;
    left: 1.3rem;
    width: 0.7rem;
    height: 0.4625rem;
    background: url('~@/assets/img/h5download/video.png') no-repeat;
    background-size: 100%;
  }
}

.phone {
  position: absolute;
  top: 0;
  left: 50%;
  transform: translateX(-50%);
  width: 100%;
  .rem-px(height, 100px);
  display: flex;
  word-break: no-wrap;
  font-size: 16px;
  color: #ffffff;
  justify-content: center;
  align-items: center;
  padding-left: 1rem;
  text-align: center;
  font-weight: bold;
  z-index: 999;

  ins {
    position: absolute;
    top: 0.9rem;
    left: 1.3rem;
    width: 1.125rem;
    height: 1.34375rem;
    background: url('~@/assets/img/h5download/phone.png') no-repeat;
    background-size: 100%;
  }
}

.close {
  position: absolute;
  z-index: 999999;
  .rem-px(top, 15px);
  .rem-px(right, 15px);
  .rem-px(width, 15px);
  .rem-px(height, 15px);
  background: url(~@/assets/img/h5download/close.png) no-repeat;
  background-size: cover;
}

@keyframes move {
  0% {
    transform: scale(1);
  }

  50% {
    transform: scale(1.05);
  }

  100% {
    transform: scale(1);
  }
}

.circle1 {
  position: absolute;
  background-color: rgba(234, 72, 121, 0.2);
  top: 33%;
  left: 50%;
  width: 0px;
  height: 0px;
  margin-top: 0px;
  margin-left: 0px;
  border-radius: 50%;
  box-shadow: 3px 3px 10px rgba(234, 72, 121, 0.2);
  animation-duration: 14s;
  animation-iteration-count: infinite;
  animation-name: circle;
  animation-delay: -10s;
}

.circle2 {
  position: absolute;
  background-color: rgba(234, 72, 121, 0.2);
  top: 33%;
  left: 50%;
  width: 0px;
  height: 0px;
  margin-top: 0px;
  margin-left: 0px;
  border-radius: 50%;
  box-shadow: 3px 3px 10px rgba(234, 72, 121, 0.2);
  animation-duration: 14s;
  animation-iteration-count: infinite;
  animation-name: circle;
  animation-delay: -8s;
}

.circle3 {
  position: absolute;
  background-color: rgba(234, 72, 121, 0.2);
  top: 33%;
  left: 50%;
  width: 0px;
  height: 0px;
  margin-top: 0px;
  margin-left: 0px;
  border-radius: 50%;
  box-shadow: 3px 3px 10px rgba(234, 72, 121, 0.2);
  animation-duration: 14s;
  animation-iteration-count: infinite;
  animation-name: circle;
  animation-delay: -6s;
}

.circle4 {
  position: absolute;
  background-color: rgba(234, 72, 121, 0.2);
  top: 33%;
  left: 50%;
  width: 0px;
  height: 0px;
  margin-top: 0px;
  margin-left: 0px;
  border-radius: 50%;
  box-shadow: 3px 3px 10px rgba(234, 72, 121, 0.2);
  animation-duration: 14s;
  animation-iteration-count: infinite;
  animation-name: circle;
  animation-delay: -4s;
}

.circle5 {
  position: absolute;
  background-color: rgba(234, 72, 121, 0.2);
  top: 33%;
  left: 50%;
  width: 0px;
  height: 0px;
  margin-top: 0px;
  margin-left: 0px;
  border-radius: 50%;
  box-shadow: 3px 3px 10px rgba(234, 72, 121, 0.2);
  animation-duration: 14s;
  animation-iteration-count: infinite;
  animation-name: circle;
  animation-delay: -2s;
}

.circle6 {
  position: absolute;
  background-color: rgba(234, 72, 121, 0.2);
  top: 33%;
  left: 50%;
  width: 0px;
  height: 0px;
  margin-top: 0px;
  margin-left: 0px;
  border-radius: 50%;
  box-shadow: 3px 3px 10px rgba(234, 72, 121, 0.2);
  animation-duration: 14s;
  animation-iteration-count: infinite;
  animation-name: circle;
  animation-delay: 0s;
}

.circle7 {
  position: absolute;
  background-color: rgba(234, 72, 121, 0.2);
  top: 33%;
  left: 50%;
  width: 0px;
  height: 0px;
  margin-top: 0px;
  margin-left: 0px;
  border-radius: 50%;
  box-shadow: 3px 3px 10px rgba(234, 72, 121, 0.2);
  animation-duration: 14s;
  animation-iteration-count: infinite;
  animation-name: circle;
  animation-delay: 2s;
}

.circle8 {
  position: absolute;
  background-color: rgba(234, 72, 121, 0.2);
  top: 33%;
  left: 50%;
  width: 0px;
  height: 0px;
  margin-top: 0px;
  margin-left: 0px;
  border-radius: 50%;
  box-shadow: 3px 3px 10px rgba(234, 72, 121, 0.2);
  animation-duration: 14s;
  animation-iteration-count: infinite;
  animation-name: circle;
  animation-delay: 4s;
}

.circle9 {
  position: absolute;
  background-color: rgba(234, 72, 121, 0.2);
  top: 33%;
  left: 50%;
  width: 0px;
  height: 0px;
  margin-top: 0px;
  margin-left: 0px;
  border-radius: 50%;
  box-shadow: 3px 3px 10px rgba(234, 72, 121, 0.2);
  animation-duration: 14s;
  animation-iteration-count: infinite;
  animation-name: circle;
  animation-delay: 6s;
}

.circle10 {
  position: absolute;
  background-color: rgba(234, 72, 121, 0.2);
  top: 33%;
  left: 50%;
  width: 0px;
  height: 0px;
  margin-top: 0px;
  margin-left: 0px;
  border-radius: 50%;
  box-shadow: 3px 3px 10px rgba(234, 72, 121, 0.2);
  animation-duration: 14s;
  animation-iteration-count: infinite;
  animation-name: circle;
  animation-delay: 8s;
}

.circle11 {
  position: absolute;
  background-color: rgba(234, 72, 121, 0.2);
  top: 33%;
  left: 50%;
  width: 0px;
  height: 0px;
  margin-top: 0px;
  margin-left: 0px;
  border-radius: 50%;
  box-shadow: 3px 3px 10px rgba(234, 72, 121, 0.2);
  animation-duration: 14s;
  animation-iteration-count: infinite;
  animation-name: circle;
  animation-delay: 10s;
}

.circle12 {
  position: absolute;
  background-color: rgba(234, 72, 121, 0.2);
  top: 33%;
  left: 50%;
  width: 0px;
  height: 0px;
  margin-top: 0px;
  margin-left: 0px;
  border-radius: 50%;
  box-shadow: 3px 3px 10px rgba(234, 72, 121, 0.2);
  animation-duration: 14s;
  animation-iteration-count: infinite;
  animation-name: circle;
  animation-delay: 12s;
}

@keyframes circle {
  0% {
    width: 10px;
    height: 10px;
    margin-top: -5px;
    margin-left: -5px;
    opacity: 1;
  }

  100% {
    width: 500px;
    height: 500px;
    margin-top: -250px;
    margin-left: -250px;
    opacity: 0;
  }
}
</style>
