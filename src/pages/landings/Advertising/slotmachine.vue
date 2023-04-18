
<template>
  <div class="sspage-body">
    <div class="slotmain">
      <div class="lhj_item"  v-for="ite in 3" :key="ite" >
        <ul class="lhj_ul_1" :class="'lhj_imgs_'+ite" ref="ul">
          <li  v-for="(item, index) in hostList[ite-1]" :key="index"  @click="goToPlay">
            <img :src="item.headImg" v-if="index !== 5" />
            <span class="video-load" v-if="index === 5 && videoLoad"></span>
            <video v-if="index===5" autoplay muted :src="item.videoUrl" :poster="item.headImg" loop playsinline
                webkit-playsinline style="object-fit: cover; width: 100%; height: 100%;" @play="test(ite)"></video>
            <!-- <video v-if="index === 0" autoplay muted :src="item.videoUrl" :poster="item.headImg" loop playsinline
                webkit-playsinline style="object-fit: cover; width: 100%; height: 100%;"></video>
            <video v-else :src="item.videoUrl" :poster="item.headImg" loop playsinline webkit-playsinline
                style="object-fit: cover; width: 100%; height: 100%;"></video> -->
        </li>
        </ul>
        <div class="btn-call" @click="goToPlay" v-if="!videoLoad ">
              <span class="icon"></span>
        </div>
      </div>
    </div>
    <!-- 播放器 -->
    <div class="button">
      <div class="play" @click="goToPlay">Go to play</div>
    </div>
  </div>
</template>

<script>
import { getParams } from '@/util/index';
import { logReport } from '@/util/logReport';
import { mapState } from 'vuex';
import { getCountry } from '@/util/getCountry';
import { videoListLop, countryList } from './list';
let UL_BOXS = [];
export default {
  data () {
    return {
      liHeight: 10,
      arr: [5, 4, 5],
      hostList: [],
      videoListLop,
      loadstatus: [0, 0, 0],
      videoLoad: true,
    };
  },

  components: {},
  // watch: {
  //   isLogin (n, v) {
  //     if (n) {
  //       this.$store.commit('setShowLoginPop', false);
  //     }
  //   },
  // },
  computed: {
    ...mapState({
      isLogin: (state) => state.app.isLogin,
    }),
  },
  created () {
    // for (let x = 0; x < 3; x++) {
    //   const random = Math.floor(Math.random() * 6);
    //   this.arr.push(random);
    // }
    console.log(this.arr, '666666666');

    this.hostList.push(this.changeArr(videoListLop.filter(item => item.countryCode)).splice(0, 6));
    this.hostList.push(this.changeArr(videoListLop.filter(item => item.countryCode)).splice(0, 6));
    this.hostList.push(this.changeArr(videoListLop.filter(item => item.countryCode)).splice(0, 6));
    console.log(this.hostList, '--abbc');
    // this.toStart();
  },
  methods: {
    goToPlay () {
      logReport({
        eventId: '106-6-1-1',
        free_name2: Object.assign(
          {
            from: 'pick',
          },
          window.$mObj.adData || {}
        ),
      });
      localStorage.setItem('LANDINGSPAGE', true);
      // localStorage.setItem('LANDINGSOMEGLE', true);
      window.$mObj.adData.lpName = 'gomeet-pick';
      localStorage.setItem('lpName', 'gomeet-pick');
      this.$router.push({ name: 'LivCam' });
      if (!this.isLogin) {
        this.$store.commit('setLoginPopFrom', 'lp');
        this.$store.commit('setShowLoginPop', true);
      }
    },
    async toStart () {
      // 圈数
      const loop = 6;
      // 一圈基础高度 奖品数*每个高度
      const base = 5 * this.liHeight;
      for (let i = 0; i < this.arr.length; i++) {
        const a = await this.delayPerform(i * 100);
        console.log(base, '---奖品数---');
        if (a === 1) {
          const y = base * loop + (this.arr[i] - 1) * this.liHeight;
          this.aniImg(y, i);
        }
      }
    },
    // 目标位置
    aniImg (y, index, duration = 3000) {
      UL_BOXS[index].style.transitionDuration = `${duration}ms`;
      UL_BOXS[
        index
      ].style.transform = `translate(0px, -${y}px) translateZ(0px)`;
    },
    // 设置重复数组
    setArr () {
      const arr = [1, 2, 3, 4, 5];
      const img2 = [];
      for (let i = 0; i < 10; i++) {
        img2.push(...arr);
      }
      this.img = Object.freeze(img2);
    },
    // 改变中奖位置
    toChang () {
      this.arr = [1, 1, 1];
    },
    // 延时函数
    delayPerform (delay = 200) {
      return new Promise((resolve, reject) => {
        setTimeout(() => {
          resolve(1);
        }, delay);
      });
    },
    // 动画兼容
    whichTransitionEvent () {
      let el = document.createElement('span');
      const transitions = {
        transition: 'transitionend',
        OTransition: 'oTransitionEnd',
        MozTransition: 'transitionend',
        WebkitTransition: 'webkitTransitionEnd',
      };
      for (const t in transitions) {
        if (el.style[t] !== undefined) {
          return transitions[t];
        }
      }
      el = null;
    },
    // 随机取4个
    changeArr (array) {
      const arr = [].concat(array);
      for (let i = arr.length - 1; i >= 0; i--) { // 遍历数组
        const num = Math.floor(Math.random() * (i + 1));
        const arr2 = arr[num];
        arr[num] = arr[i];
        arr[i] = arr2;
      }
      return arr;
    },
    randomArr (arr) {
      return arr[parseInt(Math.random() * arr.length, 6)];
    },
    test (index) {
      this.$nextTick(() => {
        this.loadstatus[index - 1] = 1;
      });
      this.videoLoad = false;
      console.log('abc3', index, this.loadstatus);
    }
  },
  async mounted () {
    getCountry('pick');
    const evenTransition = this.whichTransitionEvent();
    await this.$nextTick();
    // 获取 ul 3个 box
    UL_BOXS = this.$refs.ul;
    console.log('UL_BOXS', UL_BOXS);
    // 计算每个 图片高度
    const ulH = UL_BOXS[0].offsetHeight;
    console.log(ulH, '图片高度');
    // 我自己默认循环的 6个图片
    this.liHeight = ulH / 6;
    // 监听动画结束函数
    UL_BOXS[2].addEventListener(evenTransition, rest, false);
    const that = this;
    // 复位函数
    function rest () {
      for (let i = 0; i < that.arr.length; i++) {
        const y = (that.arr[i] - 1) * that.liHeight;
        that.aniImg(y, i, 0);
      }
      console.log('中奖下标' + JSON.stringify(that.arr));
    }
  },
  beforeDestroy () {
    UL_BOXS = null;
    this.arr = [];
  },
};
</script>
<style lang='less' scoped>
.sspage-body {
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  z-index: 1000;
  overflow-y: scroll;
  background: url(~@/assets/img/h5download/slotmachine.jpg) center center;
  font-family: Futura-Medium, Futura;
  background-size: cover;
  &.showPop {
    .body {
      animation: showPop 0.4s both;
    }
  }

  &.hidePop {
    .body {
      animation: hidePop 0.4s both;
    }
  }

  .button {
    display: flex;
    justify-content: center;
    align-items: center;
    position: absolute;
    bottom: 50px;
    width: 100%;

    .play {
      width: 250px;
      height: 55px;
      border-radius: 38px;
      color: #fff;
      line-height: 55px;
      text-align: center;
      font-size: 18px;
      font-weight: bold;
      background: linear-gradient(111deg, #f99e47 0%, #ff3463 100%);
      animation: callIconAni 2s infinite;
    }
  }
  .slotmain {
    position: absolute;
    width: 92%;
    height: 250px;
    border: 2px solid #FF00DB;
    top: 50%;
    transform: translateY(-50%) translateX(-50%);
    left: 50%;
    display: flex;
    justify-content: space-between;
    .lhj_item {
      flex:1;
      width:100%;
      height: 100%;
      overflow: hidden;
      position: relative;
      .btn-call{
      position:absolute;
      left:50%;
      margin-left: -27px;
      bottom: 15px;
      width:54px;
      height:54px;
      z-index:10;
      background: #37c761;
      border-radius: 50%;
      display:inline-flex;
      align-items: center;
      justify-content: center;
      &::after,&::before{
        content: '';
        position:absolute;
        width:54px;
        height:54px;
        box-sizing: border-box;
        left: 0;
        top:0;
        border-radius: 50%;
        border:solid 1px #37c761;
        opacity: 0;
        z-index:1;
      }

      &::after{
        animation: callBtnAni 2s infinite linear;
      }
      &::before{
        animation: callBtnAni 2s 1s infinite linear;
      }
      .icon{
        display:block;
        width: 24px;
        height:24px;
        background:url(~@/assets/img/storyhost/icon-call.png) center no-repeat;
        background-size: 100% auto;
        animation: callIconAni2 2s infinite;
        position:relative;
        z-index:2;
      }
    }
      ul {
        li {
          position: relative;
          height: 250px;
          background: #000;
          img{
            width:100%;
            height: 100%;
            object-fit: cover;
            box-sizing: border-box;
            display:block;
            background: #000;
          }
          .video-load {
            position: absolute;
            z-index: 100;
            width: 30px;
            opacity: 1;
            height: 30px;
            background: url(~@/assets/img/storyhost/icon-video-loading.png) center no-repeat;
            background-size: 100% auto;
            left: 50%;
            top: 50%;
            margin-left: -15px;
            margin-top: -15px;
            animation: loadAni 4s infinite linear;
          }
        }
      }
      .lhj_imgs_1{
        animation: lhjAni 3s .3s both;
      }
      .lhj_imgs_2{
        animation: lhjAni 3s .6s both;
        border-left: 2px solid #FF00DB;
        border-right: 2px solid #FF00DB;
      }
      .lhj_imgs_3{
        animation: lhjAni 3s 1s both;
      }
    }
  }
}

@media screen and(max-width: 680px) {
  .sspage-body {
    position: fixed;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    z-index: 1000;
    overflow-y: scroll;
    background: url(~@/assets/img/h5download/slotmachine.jpg) center center;
    background-size: cover;
    .button {
      display: flex;
      justify-content: center;
      align-items: center;
      position: absolute;
      bottom: 50px;
      width: 100%;

      .play {
        width: 250px;
        height: 55px;
        border-radius: 38px;
        color: #fff;
        line-height: 55px;
        text-align: center;
        font-size: 18px;
        font-weight: bold;
        background: linear-gradient(111deg, #f99e47 0%, #ff3463 100%);
        animation: callIconAni 2s infinite;
      }
    }
  }
}

@keyframes lhjAni {
    0%{
        transform: translateY(0);
    }
    100%{
        transform: translateY(-83.33%)
        // transform: translateY(-100%)
    }
}
@keyframes loadAni{
  0%{
    transform: rotate(0);
  }
  100%{
    transform: rotate(360deg);
  }
}
@keyframes callIconAni2{
  0%{
    transform: scale(.8);
  }
  50%{
    transform: scale(1);
  }
  100%{
    transform: scale(.8);
  }
}
</style>
