<!-- about -->
<template>
  <div class="about-page">
    <div class="banner">
      <div class="banner-text">
        <p class="title">Our approach to safety</p>
      </div>
    </div>
    <div class="banner-content">
      <p>Everyday you’re opening our app to make new connections, share your story and learn about the world. We
        recognize that in order for you to have meaningful interactions with new people, you need to feel safe – and
        this is our priority.</p>
      <p>We created this space so that you can learn how to keep yourself safe, how we can help you and all about our
        leading security technology.</p>
    </div>
    <div class="full-content">
      <div class="full-div">
        <img class="full-img" src="@/assets/img/livcam/img2-1.png" alt="">
        <p class="full-title">Community Guideline</p>
        <p class="full-writing">Our Community Guidelines define what is and what is not allowed to be shared on our
          platforms to help support a safe experience for people to make meaningful connections.<router-link
            to="/community-guidelines">Learn more</router-link>
        </p>
      </div>
      <div class="full-div">
        <img class="full-img" src="@/assets/img/livcam/img2-2.png" alt="">
        <p class="full-title">Safety Tips&Tools</p>
        <div>
          <p class="full-writing">We have a number of tips and tools designed to empower you to take control of your
            online experience<router-link to="/safety-tips">Learn more</router-link>
          </p>
        </div>
      </div>
    </div>
    <div class="full-content">
      <div class="full-div">
        <img class="full-img" src="@/assets/img/livcam/img2-3.png" alt="">
        <p class="full-title">Submit a Report</p>
        <p class="full-writing">We encourage everyone to follow our Community Guidelines and engage with one another
          respectfully. However,if you come across inappropriate conter or behavior that violates our policies and
          guidelines, We`ve made reporting easy and fast! <router-link to="/make-report">Learn more</router-link>
        </p>
      </div>
      <div class="full-div">
        <img class="full-img" src="@/assets/img/livcam/img2-4.png" alt="">
        <p class="full-title">FAQs</p>
        <p class="full-writing">At LivCam, we are on a mission to inspire millions of users across the globe to foster
          meaningful …<router-link to="/faqs">Learn more</router-link>
        </p>
      </div>
    </div>
    <backTop></backTop>
  </div>
</template>

<script>

export default {
  name: 'about-our-safety-center',
  components: {
  },
  data () {
    return {
    };
  },
  methods: {}
};

</script>
<style lang='less' scoped>
.about-page {
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  z-index: 1000;
  background: #fff;
  overflow-y: scroll;
  color: #000;
}
@media (min-width: 750px) {
  .to-top {
    width: 50px;
    height: 50px;
    position: fixed;
    right: 20px;
    bottom: 60px;
    background: center center / contain no-repeat transparent;
    transition: opacity 300ms ease 0s;
    cursor: pointer;
    z-index: 7;
  }

  .about-page {
    .banner-content {
      padding: 50px;
      font-size: 18px;
      text-align: left;
    }

    .banner {
      width: 100%;
      height: 500px;
      background: url(~@/assets/img/livcam/banner-4.png) no-repeat;
      background-size: 100% 100%;
    }

    .banner-text {
      width: 999px;
      margin: 0 auto;
      padding-top: 30px;

      p {
        margin-bottom: 15px;
        font-size: 24px;
        line-height: 28px;
        color: #5E5E5E;
      }

      .title {
        color: #ffffff;
        font-size: 45px;
        font-weight: bold;
        text-align: center;
        line-height: 400px;
        margin-bottom: 40px;
      }
    }

    .full-content {
      display: flex;
    }

    .full-div {
      flex: 1;
      margin: 20px 10px;
      // padding: 10px 40px;
      background: #FFFFFF;
      border-radius: 40px;
      border: 1px solid #9D9D9D;

      .full-title {
        font-size: 30px;
        line-height: 25px;
        font-weight: bold;
        color: #333;
        margin-bottom: 10px;
      }

      .full-writing {
        font-size: 18px;
        text-align: left;
        padding: 10px 40px;
      }

      .full-img {
        margin-bottom: 30px;
        width: 100%;
      }
    }

    .full-row {
      width: 100%;
      padding: 80px 0;

      &:nth-child(odd) {
        background-color: #FAFAFA;
      }

      .img-text-warp {
        width: 990px;
        margin: 0 auto;
        display: flex;
        align-items: center;

        dt {
          width: 408px;
          height: 381px;
        }

        dd {
          text-align: left;
        }

        .row-title {
          font-size: 40px;
          line-height: 47px;
          font-weight: bold;
          color: #333;
          margin-bottom: 25px;
        }

        .row-p {
          color: #6B6B6B;
          font-size: 24px;
          line-height: 32px;
          margin-bottom: 15px;
        }

        .row-link {
          color: #1466ED;
          font-size: 24px;
        }
      }
    }

    .margin-l {
      margin-left: 40px;
    }

    .margin-r {
      margin-right: 40px;
    }

    .safety-list {
      width: 100%;
      padding: 60px 0;
      background-color: #FAFAFA;

      .safe-title {
        font-weight: bold;
        font-size: 40px;
        color: #333;
        text-align: center;
      }

      .list-warp {
        display: flex;
        width: 990px;
        margin: 0 auto;
        flex-wrap: wrap;
        justify-content: space-between;
        padding-bottom: 20px;

        li {
          width: 200px;
          height: 107px;
          background-color: #ffffff;
          margin-top: 50px;
        }
      }
    }

    .mobile {
      display: none;
    }
  }
}

@media (max-width: 750px) {
  .to-top {
    width: 50px;
    height: 50px;
    position: fixed;
    right: 20px;
    bottom: 60px;
    background: center center / contain no-repeat transparent;
    transition: opacity 300ms ease 0s;
    cursor: pointer;
    z-index: 7;

  }

  .about-page {
    .banner-content {
      padding: 10px 20px;
      font-size: 14px;
      text-align: left;
    }

    .banner {
      width: 100%;
      height: 150px;
      background: url(~@/assets/img/livcam/banner-4.png) no-repeat;
      background-size: 100% 100%;
    }

    .banner-text {
      padding: 25px;

      p {
        margin-bottom: 10px;
        font-size: 14px;
        line-height: 18px;
        color: #5E5E5E;
      }

      .title {
        color: #ffffff;
        font-size: 25px;
        font-weight: bold;
        text-align: center;
        line-height: 100px;
        margin-bottom: 20px;
      }
    }

    // .full-content{
    //   display: flex;
    // }
    .full-contentbut {
      margin: 0 auto;
    }

    .full-div {
      flex: 1;
      background: #FFFFFF;
      border-radius: 20px;
      border: 1px solid #9D9D9D;
      margin: 20px 10px;

      // padding: 10px 40px;
      .full-title {
        font-size: 22px;
        line-height: 25px;
        font-weight: bold;
        color: #333;
        margin-bottom: 10px;
      }

      .full-writing {
        font-size: 14px;
        text-align: left;
        padding: 10px 40px;
      }

      .full-img {
        margin-bottom: 30px;
        width: 100%;
      }
    }

    .full-row {
      width: 100%;
      padding: 40px 25px;

      &:nth-child(odd) {
        background-color: #FAFAFA;
      }

      .img-text-warp {
        dt {
          padding: 20px 30px 0 30px;

          img {
            max-width: 100%;
          }
        }

        dd {
          text-align: left;
        }

        .row-title {
          font-size: 22px;
          line-height: 25px;
          font-weight: bold;
          color: #333;
          margin-bottom: 10px;
        }

        .row-p {
          color: #6B6B6B;
          font-size: 14px;
          line-height: 18px;
          margin-bottom: 8px;
        }

        .row-link {
          color: #1466ED;
          font-size: 14px;
        }
      }
    }

    .margin-l {
      margin-left: 0;
    }

    .margin-r {
      margin-right: 0;
    }

    .safety-list {
      width: 100%;
      padding: 30px 0;
      background-color: #FAFAFA;

      .safe-title {
        font-weight: bold;
        font-size: 22px;
        color: #333;
        text-align: center;
      }

      .list-warp {
        display: flex;
        flex-wrap: wrap;
        justify-content: space-around;
        padding: 20px 0;

        li {
          width: 150px;
          height: 78px;
          background-color: #ffffff;
          margin-top: 25px;
        }
      }
    }

    .pc {
      display: none;
    }
  }
}
</style>
