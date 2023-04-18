<template>
    <div class="random-page">
        <div class="random-page__header">
            <div class="header-logo">
                <img src="~@/assets/img/tumile/logo.png" alt="" />
            </div>
        </div>
        <div class="section">
            <div class="container">
                <div class="section-l">
                    <div class="con-txt">
                        <h1 class="s-title">Random Video Chat</h1>
                        <div class="s-desc">
                            <p>
                                Random Video Chat allows you to connect with
                                people from all over the world, without ever
                                revealing your identity. With cutting-edge
                                technology LivU connects you with people from
                                around the globe. All you need is a web camera
                                and an internet connection, and you're ready to
                                start chatting. Random Video Chat is perfect for
                                those who want to meet new people, make new
                                friends, or just have a little fun. Random video
                                chat app is a convenient and fun way to connect
                                with people from all over the world. So why not
                                give it a try? You never know who you might
                                meet!
                            </p>
                        </div>
                    </div>
                    <div class="down-box">
                        <a class="link" href="https://apps.apple.com/US/app/id1273950116?mt=8" target="_blank" @click="appStore"><img src="@/assets/img/seo/apple.png" />Apple
                            Store</a>
                        <a class="link" href="https://play.google.com/store/apps/details?id=com.videochat.livu" target="_blank" @click="googlePay"><img src="@/assets/img/seo/Google-Play.png" />Google
                            Pay</a>
                        <a class="link" href="https://livuchat.me/" target="_blank" @click="toWeb"><img class="livu-logo"
                                src="@/assets/img/seo/livu-logo-1.png" />LivU Web</a>
                    </div>
                </div>
                <div class="section-img">
                    <div class="square-img">
                    <div class="animated animated1 top"><img src="@/assets/img/seo/top1.png" /><img class="hi" src="@/assets/img/seo/hi.png" /></div>
                    <div class="animated animated2 top"><img src="@/assets/img/seo/top2.png" /><img class="hi" src="@/assets/img/seo/hi.png" /></div>
                    <div class="animated animated3 top"><img src="@/assets/img/seo/top3.png" /><img class="hi" src="@/assets/img/seo/hi.png" /></div>
                </div>
                </div>
            </div>
        </div>
        <div class="random-page-content">
            <div class="con-num">
                <div class="bg-down">
                   <img src="@/assets/img/seo/bg1.png" />
                   <img src="@/assets/img/seo/bg1.png" />
                </div>
                <div class="bg-up">
                   <img src="@/assets/img/seo/bg2.png" />
                   <img src="@/assets/img/seo/bg2.png" />
                </div>
                <div class="bg-down">
                   <img src="@/assets/img/seo/bg3.png" />
                   <img src="@/assets/img/seo/bg3.png" />
                </div>

                <div class="bg-up">
                   <img src="@/assets/img/seo/bg4.png" />
                   <img src="@/assets/img/seo/bg4.png" />
                </div>
                <div class="bg-down">
                   <img src="@/assets/img/seo/bg5.png" />
                   <img src="@/assets/img/seo/bg5.png" />
                </div>
                <div class="num-bg"></div>
                <div class="active-number">
                    <count-to class="num" :startVal="starVal" :endVal="endVal" :duration="duration"
                        @mountedCallback="countCb">
                    </count-to>
                    <p class="slogn">Number of Matches</p>
                </div>
            </div>
            <div>
                <div class="con-txt">
                    <h2 class="s-title">Free Random Video Chat App</h2>
                    <div class="s-desc">
                        <p>
                            Random Video Chat allows you to connect with people from all over the world, without ever
                            revealing your identity. With cutting-edge technology LivU connects you with people from
                            around the globe. All you need is a web camera and an internet connection, and you're ready
                            to start chatting. Random Video Chat is perfect for those who want to meet new people, make
                            new friends, or just have a little fun. Random video chat app is a convenient and fun way to
                            connect with people from all over the world. So why not give it a try? You never know who
                            you might meet!
                        </p>
                        <p>When you use our chat platform, video chatting will be a breeze--without sacrificing any
                            features. Agree to our terms of use and privacy policy, grant access to your webcam, and
                            instantly connect with someone new and interesting. Plus, you can filter connections by
                            location, language and other tags!</p>
                    </div>
                </div>
            </div>
            <div class="video-img"><img src="@/assets/img/seo/img.png" /></div>
            <div class="tags-text">
                <div class="con-txt">
                    <h2 class="s-title">How can I chat online with strangers?</h2>
                    <div class="s-desc">
                        <p>
                            LivU has thousands of active users at all times looking to chat. To speak with someone new,
                             signup and click on the profile you’d like to chat with, you can also make use of the filters like Country,
                              Gender & Age Group to narrow down your search. This will instantly direct you to a new stranger.
                               You could potentially make hundreds of friends easily, or maybe even find that one special person.
                        </p>
                    </div>
                </div>
            </div>
        </div>
        <div class="random-page-video">
            <div class="random-page-video-content">
                <div class="content-text"><img class="herest-bg" src="@/assets/img/seo/herest-bg.png"/> <img class="herest" src="@/assets/img/seo/herest.png"/><img class="zan" src="@/assets/img/seo/zan.png" /><img class="close" src="@/assets/img/seo/close.png" /></div>
            <div>
                <div class="con-txt">
                    <h2 class="s-title">Random Video with Women</h2>
                    <div class="s-desc">
                        <p>
                            We make matching simple, that's it! LivU search and match making filters work incredibly well in providing the right match.
                             So if you’re looking to have a random chat with women or men you’re at the right place.
                        </p>
                        <p>When you use our chat platform, video chatting will be a breeze--without sacrificing any
                            features. Agree to our terms of use and privacy policy, grant access to your webcam, and
                            instantly connect with someone new and interesting. Plus, you can filter connections by
                            location, language and other tags!</p>
                    </div>
                </div>
                <div class="con-txt">
                    <h2 class="s-title">Thousands of Strangers Chatting Online</h2>
                    <div class="s-desc">
                        <p>
                            Whether you're looking for  friendship,
                             to have someone to share your story or just a stranger video chat, with over millions
                              of users all around the globe - we have a match for you!
                        </p>
                    </div>
                </div>
            </div>
            </div>
            <div v-if="isMobile" class="footer"><div class="bg-left"><img src="@/assets/img/seo/buttom-swiper.png"/><img src="@/assets/img/seo/buttom-swiper.png"/></div></div>
            <div class="con-txt">
                <h2 class="s-title" style="text-align: center;">Match with Like-Minded Strangers</h2>
                <div class="s-desc height-desc">
                    <p>
                        If you're hoping to find friends with similar interests,
                         use the tags shown above i.e "Singing", "dancing" .
                          Just select your interests and hobbies, and we'll match you up with people
                           who enjoy the same things as you do. This can be a great way to connect with
                            like-minded people instead of random strangers.
                    </p>
                </div>
            </div>
            <div v-if="!isMobile" class="footer"><div class="bg-left"><img src="@/assets/img/seo/buttom-swiper.png"/><img src="@/assets/img/seo/buttom-swiper.png"/></div></div>
        </div>
        <div class="random-page-text">
            <div class="content">
                <div v-if="isMobile" class="content-img"><img src="@/assets/img/seo/people.png" /></div>
                <div class="con-txt">
                    <h2 class="s-title">Meet new people</h2>
                    <div class="s-desc">
                        <p>
                            Random chat is a great way to meet new people and make new friends.
                             You can chat with strangers from all over the world, share your interests,
                              and have fun! There are no rules or restrictions, so you can be yourself
                               and say whatever you want. Just be respectful of other users and enjoy yourself!
                        </p>
                        <p>
                        LivUChat is a live video chat app that helps people have a meaningful and exciting
                         online social experience by connecting them with just a click of a button. LivUChat offers
                          Video Calling, Video Matching and Text chat so our users can choose the way they want to meet
                           and get to know their friends.
                        </p>
                        <p>
                        Video Calling -  You can call your friends or other users who are online to have 1 on 1 Video Calls.
                        Video Matching - You can customize your matching preferences and match someone right away.
                        Text Chat - Add users you meet on LivUChat as friends and message them without any limit, keep the conversation going when you can't connect via Video Calls
                        Chat Safety & Privacy - Our users' experience and privacy are our top priority. LivUChat offers various high quality safety features to maintain a safe and fun environment for everyone.
                        Filter by Interest - LivUChat offers you plenty of tags for different interests and topics. You will easily find like-minded friends here.
                        Meet New People - Find your new friends all over the world with only a simple tap on LivUChat.
                        </p>
                    </div>
                </div>
                <div v-if="!isMobile" class="con-top"><img src="@/assets/img/seo/people.png" /></div>
            </div>
            <div class="content-txt">
                <div class="con-txt">
                    <div class="title">
                        <h2 class="s-title">Frequently asked questions on Video Chat with Strangers</h2>
                    </div>
                    <div class="s-desc">
                        <div class="br">
                            <h3>
                            What is random video chat and how does it work?</h3>
                        <p>
                            Random video chat is a type of chat where you are paired with a random person from anywhere in the world. You can then chat with that person and get to know them. Random video chat is a great way to meet new people and make new friends.
                        </p>
                        </div>
                        <div class="br">
                            <h3>What are the benefits of using random video chat?</h3>
                        <p>
                        There are many benefits of using random video chat. Random video chat can help you connect with people from all over the world. You can learn about new cultures and make new friends. Random video chat can also be a great way to practice your English skills. If you are shy, random video chat can help you overcome your shyness. Random video chat can also be a great way to meet new people and make new friends.
                        </p>
                        </div>
                        <div class="br" v-if="!isMobile">
                            <h3>How to get started with random video chat?</h3>
                        <p>
                            It’s easy! Sign up with LivUChat now and get started in less than 60 seconds!&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;
                            </p>
                        </div>
                        <div class="br">
                            <h3>What are the best sites for random video chat?</h3>
                        <p>
                            LivUchat is the best site for Random Video chat. The matches we make and other features are unrivalled by any competitors. &emsp;&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;</p>
                        </div>
                        <div class="br">
                            <h3>What are some best tips for having a successful random video chat experience?</h3>
                        <p>
                            Here are some tips for having a successful random video chat experience:
                            </p>
                        <p>1. Be open and honest - When you're chatting with someone, be open and honest about who you are and what you're looking for. Don't be afraid to let your personality shine through.</p>
                        <p>2. Be respectful - Random video chat is a great way to meet new people, but it's important to remember that not everyone is the same. Be respectful of others and their opinions, and don't be afraid to disagree.</p>
                        <p>3. Keep an open mind - Random video chat is all about meeting new people and hearing new perspectives. Keep an open mind, and you're sure to have a great time.</p>
                        <p>4. Have fun! Random video chat is supposed to be fun, so make sure you're enjoying yourself. If you're not, there's no point in doing it.</p>
                        </div>
                    </div>
                </div>
            </div>
        </div>
        <div class="random-page-footer">
            <div class="random-footer">
                <div class="footer-logo">
                    <img src="~@/assets/img/tumile/logo.png" alt="" />
                </div>
            </div>
            <div class="footer-link">
                <div class="link-top"><a href="https://livuchat.me/Livu-safety-center" target="_blank">Safety Center </a> | <a href="https://livuchat.me/Livu-privacy-center" target="_blank"> Privacy Center </a> | <a href="https://livuchat.me/Livu-about-us" target="_blank">About LivU </a> </div>
            </div>
            <div class="footer-btn">
                <div class="down-box">
                    <a class="link" href="https://apps.apple.com/US/app/id1273950116?mt=8" target="_blank" @click="appStore"><img src="@/assets/img/seo/apple.png" />Apple
                        Store</a>
                    <a class="link" href="https://play.google.com/store/apps/details?id=com.videochat.livu" target="_blank" @click="googlePay"><img src="@/assets/img/seo/Google-Play.png" />Google
                        Pay</a>
                    <a class="link" href="https://livuchat.me/" target="_blank" @click="toWeb"><img class="livu-logo"
                            src="@/assets/img/seo/livu-logo-1.png" />LivU Web</a>
                </div>
                <div></div>
            </div>
        </div>
    </div>
</template>

<script>
import countTo from 'vue-count-to';
import { mapState } from 'vuex';
import Cookies from 'js-cookie';
import { logReport } from '@/util/logReport';

export default {
  data () {
    return {
      starVal: 0,
      endVal: 0,
      duration: 500,
      countTimer: null,
    };
  },
  components: {
    countTo
  },
  computed: {
    ...mapState({
      isMobile: (state) => state.app.isMobile
    })
  },
  methods: {
    appStore () {
      logReport({
        eventId: '106-2-2-1',
        free_name2: { name: 'appStore' }
      });
    },
    googlePay () {
      logReport({
        eventId: '106-2-2-2',
        free_name2: { name: 'googlePay' }
      });
    },
    toWeb () {
      logReport({
        eventId: '106-2-2-3',
        free_name2: { name: 'webLivu' }
      });
    },
    countCb () {
      // 计数器
      if (this.countTimer === null) {
        this.starVal = 0;
        this.endVal = +localStorage.getItem('RC_COUNT_NUM') || 122987212;
      } else {
        this.duration = 1000;
        this.starVal = this.endVal;
        this.endVal = this.starVal + Math.floor(Math.random() * 10 + 1);
      }

      this.countTimer = setTimeout(() => {
        this.countCb();
        localStorage.setItem('RC_COUNT_NUM', this.endVal);
      }, this.duration);
    },
  },
  created () {
    Cookies.set('RC_POP_18', 1, { expires: 365 });
    logReport({
      eventId: '106-2-2-4'
    });
  }
};
</script>

<style>
#app-area {
    overflow: auto !important;
}
</style>
<style lang="less" scoped>
@import url("./index.less");
</style>
