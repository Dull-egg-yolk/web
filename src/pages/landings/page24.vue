<template>
  <div class="page-body">
    <div class="home-page">
      <div class="title">START DATING</div>
      <div class="content" v-if="step === 1">
        <div class="order">
          <div class="number number1"><div><span style="color: #E55DFF">1</span>/4</div></div>
        </div>
        <div class="img-div">
          <img src="@/assets/img/lp-24-img1.png" />
        </div>
        <div class="title">What are you looking</div>
        <div class="ridio-div">
          <div class="ridio" v-for="(item, index) in step1List" :key="index" @click="selectStep1(index)">
            <div :class="{selected: index == step1, ico: index != step1}"></div>
            <div class="text">{{ item }}</div>
          </div>
        </div>
        <div class="fotter">
          <div class="btn" @click="nextStep(1)">Next</div>
        </div>
      </div>
      <div class="content" v-if="step === 2">
        <div class="order">
          <div class="pre" @click="prevStep(2)"><span class="icon-arrow"></span> Previous</div>
          <div class="number number2"><div><span style="color: #E55DFF">2</span>/4</div></div>
        </div>
        <div class="img-div">
          <img src="@/assets/img/lp-24-img2.png" />
        </div>
        <div class="title"> What is your gender?</div>
        <div class="ridio-div">
          <div class="ridio" v-for="(item, index) in step2List" :key="index" @click="selectStep2(index)">
            <div :class="{selected: index == step2, ico: index != step2}"></div>
            <div class="text">{{ item }}</div>
          </div>
        </div>
        <div class="fotter">
          <div class="btn" @click="nextStep(2)">Next</div>
        </div>
      </div>
      <div class="content" v-if="step === 3">
        <div class="order">
          <div class="pre" @click="prevStep(3)"><span class="icon-arrow"></span> Previous</div>
          <div class="number number3"><div><span style="color: #E55DFF">3</span>/4</div></div>
        </div>
        <div class="img-div">
          <img src="@/assets/img/lp-24-img3.png" />
        </div>
        <div class="title">What are you looking for?</div>
        <div class="ridio-div">
          <div class="ridio" v-for="(item, index) in step3List" :key="index" @click="selectStep3(index)">
            <div :class="{selected: index == step3, ico: index != step3}"></div>
            <div class="text">{{ item }}</div>
          </div>
        </div>
        <div class="fotter">
          <div class="btn" @click="nextStep(3)">Next</div>
        </div>
      </div>
      <div class="content" v-if="step === 4">
        <div class="order">
          <div class="pre" @click="prevStep(4)"><span class="icon-arrow"></span> Previous</div>
          <div class="number number4"><div><span style="color: #E55DFF">4</span>/4</div></div>
        </div>
        <div class="title">How old are you?</div>
        <div class="ridio-div">
          <div class="ridio" v-for="(item, index) in ageList" :key="index" @click="selectAge(index)">
            <div :class="{selected: index == age, ico: index != age}"></div>
            <div class="text">{{ item }}</div>
          </div>
        </div>
        <div class="fotter">
          <div class="btn" @click="goToPlay()">Join Now</div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { logReport } from '@/util/logReport';
import { mapState } from 'vuex';
import { getCountry } from '@/util/getCountry';
export default {
  data () {
    return {
      step: 1,
      age: -1,
      step1: -1,
      step2: -1,
      step3: -1,
      ageList: ['18-29', '30-39', '40-49', '50+'],
      step1List: ['Serious Relationships', 'Fun Dating. No commitment', 'Chill Chat'],
      step2List: ['I’m a Man', 'I’m a Woman'],
      step3List: ['I’m looking for a Women', 'I’m looking for a Man']
    };
  },

  components: {},

  computed: {
    ...mapState({
      isLogin: (state) => state.app.isLogin
    }),
  },

  methods: {
    selectAge (index) {
      console.log(index);
      this.age = index;
    },
    selectStep1 (index) {
      console.log(index);
      this.step1 = index;
    },
    selectStep2 (index) {
      console.log(index);
      this.step2 = index;
    },
    selectStep3 (index) {
      console.log(index);
      this.step3 = index;
    },
    nextStep (data) {
      this.step = data + 1;
    },
    prevStep (data) {
      this.step = data - 1;
    },
    goToPlay () {
      logReport({
        eventId: '106-6-1-1',
        free_name2: Object.assign({
          from: 'gomeet-videomatch'
        }, window.$mObj.adData || {}),
      });
      window.$mObj.adData.lpName = 'gomeet-videomatch';
      localStorage.setItem('lpName', 'gomeet-videomatch');
      this.$router.push({ name: 'LivCam' });
      if (!this.isLogin) {
        this.$store.commit('setLoginPopFrom', 'lp');
        this.$store.commit('setShowLoginPop', true);
      }
      localStorage.setItem('LANDINGSPAGE', true);
    },
  },
  mounted () {
    getCountry('gomeet-videomatch');
  }
};
</script>
<style lang='less' scoped>
.page-body {
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  z-index: 1000;
  overflow-y: scroll;
  background-color: #56c1f0;
  padding: 0;
  padding-bottom: 30px;
  .home-page {
    width: 100%;
    height: 100%;
    margin: 0 auto;
    box-sizing: border-box;
    background: url(~@/assets/img/lp-24-bg.png) center center no-repeat;
    background-size: cover;
    position: relative;
    .title {
      width: 100%;
      text-align: center;
      font-size: 24px;
      font-family: Arial-BoldMT, Arial;
      font-weight: normal;
      color: #000000;
      line-height: 28px;
      padding: 20px 0;
    }
    .content {
      background: #FFFFFF;
      border-radius: 20px;
      padding: 40px 20px;
      margin: 0 20px;
      .order {
        width: 100%;
        display: flex;
        justify-content: center;
        align-items: center;
        margin-bottom: 10px;
        position: relative;
        .pre{
          color: #9CA7B3;
    font-size: 16px;
    position: absolute;
    left: 10px;
        }
        .number {
          width: 50px;
          height: 50px;
          font-size: 20px;
          border: 4px solid #DBE5EF;
          border-radius: 50px;
          color: #B4BFCD;
          display: flex;
          justify-content: center;
          align-items: center;
          >div{
            transform: rotate(-45deg);
          }
        }
        .number1{
          border-color: #E55DFF #DBE5EF #DBE5EF #DBE5EF;
          transform: rotate(45deg);
        }
        .number2{
          border-color: #E55DFF #E55DFF #DBE5EF #DBE5EF;
          transform: rotate(45deg);
        }
        .number3{
          border-color: #E55DFF #E55DFF #E55DFF #DBE5EF;
          transform: rotate(45deg);
        }
        .number4{
          border-color: #E55DFF #E55DFF #E55DFF #E55DFF;
          transform: rotate(45deg);
        }
      }
      .img-div {
        width: 100%;
        display: flex;
        justify-content: center;
        align-items: center;
        img {
          height: 150px;
        }
      }
      .ridio-div {
        width: 100%;
        .ridio {
          height: 42px;
          border-radius: 24px;
          border: 1px solid #DBE5EF;
          margin-bottom: 10px;
          display: flex;
          align-items: center;
          padding: 0 20px;
          .ico {
            width: 20px;
            height: 20px;
            border: 2px solid #DBE5EF;
            border-radius: 20px;
          }
          .selected {
              width: 22px;
              height: 22px;
              background: url(~@/assets/img/lp-24-dui.png) center center no-repeat;
              background-size: cover;
            }
          .text {
            flex: 1;
            text-align: center;
            color: #000;
          }
        }
      }
      .fotter {
        width: 100%;
        display: flex;
        justify-content: center;
        align-items: center;
        .btn {
          width: 100%;
          height: 50px;
          background: linear-gradient(90deg, #FF78FF 0%, #32E5FF 100%);
          border-radius: 30px;
          color: #fff;
          text-align: center;
          line-height: 50px;
          font-size: 20px;
        }
      }
    }
  }
}
@media screen and(max-width: 370px) {
  .page-body .home-page .content{
    padding: 10px;
  }
  .page-body .home-page .content .img-div img{
    height: 100px;
  }
}
</style>
