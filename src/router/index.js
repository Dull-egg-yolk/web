import Vue from 'vue';
import VueRouter from 'vue-router';
import store from '@/store';
import { getUrlCountry } from '@/util/config';
import setHead from '@/util/setHead';

const FriendDetail = () => import('@/pages/friendDetail');
const CoinPage = () => import('@/pages/coin');
const CoinPayPage = () => import('@/pages/coin/pay');
const ProfileEdit = () => import('@/pages/profileEdit');
const paymentInfoAdd = () => import('@/pages/coin/paymentInfoAdd');
const PaymentMethodsList = () => import('@/pages/coin/PaymentMethodsList');
const OrderDetail = () => import('@/pages/coin/orderDetail');
const CardList = () => import('@/pages/coin/CardList');
const PayOrderList = () => import('@/pages/coin/payOrderList');
const PayRefund = () => import('@/pages/coin/payRefund');
const RefundBack = () => import('@/pages/coin/refundBack');

const downLoad = () => import('@/pages/download');
const CookiePrivacy = () => import('@/pages/PopPrivacy/CookiePricy');
const PrivacyPolicy = () => import('@/pages/PopPrivacy/PrivacyPolicy');
const RandomVideoChat = () => import('@/pages/PopPrivacy/RandomVideoChat');
const TermsUse = () => import('@/pages/PopPrivacy/TermsUse');
const AboutUs = () => import('@/pages/PopPrivacy/AboutUs');
const CommunityGuidelines = () => import('@/pages/PopPrivacy/CommunityGuidelines');
const SafetyCenter = () => import('@/pages/PopPrivacy/SafetyCenter');
const PrivacyCenter = () => import('@/pages/PopPrivacy/PrivacyCenter');
const LivCam = () => import('@/pages/livcam');
const MatchPage = () => import('@/pages/matchs');
const Backpack = () => import('@/pages/backpack');
const Activity = () => import('@/pages/activity');
const ZhuShou = () => import('@/pages/zhushou');
const Omegle = () => import('@/pages/landings/omgle');
const Luckycrush = () => import('@/pages/landings/luckycrush');
const Coomeet = () => import('@/pages/landings/coomeet');
const Mides = () => import('@/pages/landings/mides');
const Page1 = () => import('@/pages/landings/p5/page1');
const Page2 = () => import('@/pages/landings/page2');
const Page3 = () => import('@/pages/landings/page3');
const Page4 = () => import('@/pages/landings/page4');
const ukp2 = () => import('@/pages/landings/Advertising/H5Download1');
const ukp5 = () => import('@/pages/landings/p5/index');
const slotmachine = () => import('@/pages/landings/Advertising/slotmachine');
const flipcard = () => import('@/pages/landings/Advertising/flipcard');
const Page11 = () => import('@/pages/landings/page11');
const Page8 = () => import('@/pages/landings/page8');
const Page7 = () => import('@/pages/landings/page7');
const waterfall = () => import('@/pages/landings/p5/index2');
const Page9 = () => import('@/pages/landings/page9');
const Page10 = () => import('@/pages/landings/page10');
const Page12 = () => import('@/pages/landings/page12');
const Video = () => import('@/pages/landings/video');
const Card = () => import('@/pages/landings/card');
const videomatch = () => import('@/pages/landings/videomatch');
const videocall = () => import('@/pages/landings/videocall');
const Page13 = () => import('@/pages/landings/page13');
const Page14 = () => import('@/pages/landings/page14');
const Page15 = () => import('@/pages/landings/page15');
const Page16 = () => import('@/pages/landings/page16');
const Page17 = () => import('@/pages/landings/page17');
const Page19 = () => import('@/pages/landings/page19');
const Page20 = () => import('@/pages/landings/page20');
const Page21 = () => import('@/pages/landings/page21');
const Page23 = () => import('@/pages/landings/page23');
const Page24 = () => import('@/pages/landings/page24');

const Wrap = () => import('@/pages/wrap');

const MobileTransfer = () => import('@/pages/mobileTransfer');

const GoddessWall = () => import('@/pages/goddessWall');
const CardPage = () => import('@/pages/card');
const SearchPage = () => import('@/pages/search');

Vue.use(VueRouter);

const originalPush = VueRouter.prototype.push;
VueRouter.prototype.push = function push (location) {
  return originalPush.call(this, location).catch(err => err);
};

const pathTxt = getUrlCountry();
const routes = [
  {
    path: `/${pathTxt}`,
    name: 'Wrap',
    component: Wrap,
    children: [
      {
        path: '',
        name: 'LivCam',
        component: LivCam,
      },
      {
        path: '/wall',
        name: 'GoddessWall',
        component: GoddessWall,
        meta: {
          keepAlive: true
        }
      },

      {
        path: 'login',
        name: 'LoginPage',
        component: LivCam,
      },
      {
        path: 'match',
        name: 'MatchPage',
        component: MatchPage,
      },
      {
        path: 'card',
        name: 'CardPage',
        component: CardPage,
      },
      {
        path: 'search',
        name: 'SearchPage',
        component: SearchPage,
      },
      {
        path: 'profile/edit',
        name: 'EditProfile',
        component: ProfileEdit,
      },
      {
        path: 'profile/:friendId',
        name: 'FriendPage',
        component: FriendDetail,
      },
      {
        path: 'shop',
        name: 'CoinPage',
        component: CoinPage,
      },
      {
        path: 'pay',
        name: 'CoinPayPage',
        component: CoinPayPage,
      }, {
        path: '/paymentInfoAdd',
        name: 'paymentInfoAdd',
        component: paymentInfoAdd
      }, {
        path: '/payOrderList',
        name: 'PayOrderList',
        component: PayOrderList
      }, {
        path: '/payRefund',
        name: 'PayRefund',
        component: PayRefund
      }, {
        path: '/refundBack',
        name: 'RefundBack',
        component: RefundBack
      },
      {
        path: '/cardList',
        name: 'cardList',
        component: CardList
      },

      {
        path: '/paymentMethodsList',
        name: 'paymentMethodsList',
        component: PaymentMethodsList
      },
      {
        path: '/payRes',
        name: 'CallbackPage',
        component: OrderDetail
      },
      {
        path: 'backpack',
        name: 'Backpack',
        component: Backpack,
        meta: {
          fullPage: true
        },
      },
      {
        path: 'activity',
        name: 'ActivityPage',
        component: Activity,
        meta: {
          fullPage: true
        },
      },
      {
        path: 'zhushou',
        name: 'ZhuShou',
        component: ZhuShou,
        meta: {
          fullPage: true
        },
      },
      {
        path: 'download',
        name: 'downLoad',
        component: downLoad,
      },
      {
        path: 'message',
        name: 'MessagePage',
        component: MobileTransfer,
        children: [
          {
            path: 'IMMessageSession',
            name: 'IMMessageSession',
          },
          {
            path: 'IMSayHiSession',
            name: 'IMSayHiSession',
          }
        ]
      },
      {
        path: 'friends',
        name: 'FriendsPage',
        component: MobileTransfer,
      },
      {
        path: 'cookie-policy',
        name: 'CookiePrivacy',
        component: CookiePrivacy,
      },
      {
        path: 'privacy-policy',
        name: 'PrivacyPolicy',
        component: PrivacyPolicy,
      },
      {
        path: 'random-video-chat',
        name: 'RandomVideoChat',
        component: RandomVideoChat,
      },
      {
        path: 'terms-of-use',
        name: 'TermsUse',
        component: TermsUse,
      },
      {
        path: 'about-us',
        name: 'AboutUs',
        component: AboutUs,
      },
      {
        path: 'community-guidelines',
        name: 'CommunityGuidelines',
        component: CommunityGuidelines,
      },
      {
        path: 'safety-center',
        name: 'SafetyCenter',
        component: SafetyCenter,
      },
      {
        path: 'privacy-center',
        name: 'PrivacyCenter',
        component: PrivacyCenter,
      },
      {
        path: 'landings/en/cam-chat',
        name: 'Omegle',
        component: Omegle,
      },
      {
        path: 'landings/en/live-video-chat',
        name: 'Luckycrush',
        component: Luckycrush,
      },
      {
        path: 'landings/en/chat-roulette',
        name: 'Coomeet',
        component: Coomeet,
      },
      {
        path: 'landings/en/webcamonline',
        name: 'Mides',
        component: Mides,
      },
      {
        path: 'landings/en/Luckycrush',
        name: 'Page1',
        component: Page1,
      },
      {
        path: 'landings/en/onlinevideochat',
        name: 'Page2',
        component: Page2,
      },
      {
        path: 'landings/en/omegle',
        name: 'Page3',
        component: Page3,
      },
      {
        path: 'landings/en/omegle2',
        name: 'Page4',
        component: Page4,
      },
      {
        path: 'landings/en/waterfall2',
        name: 'ukp2',
        component: ukp2,
      },
      {
        path: 'landings/en/waterfall1',
        name: 'ukp5',
        component: ukp5,
      },
      {
        path: 'landings/en/callings',
        name: 'slotmachine',
        component: slotmachine,
      },
      {
        path: 'landings/en/pick',
        name: 'flipcard',
        component: flipcard,
      },
      {
        path: 'landings/en/privacy',
        name: 'Page11',
        component: Page11,
      },
      // {
      //   path: 'landings/en/videochat',
      //   name: 'Page8',
      //   component: Page8,
      // },
      {
        path: 'landings/ar/waterfall3',
        name: 'waterfall',
        component: waterfall,
      },
      // {
      //   path: 'landings/ar/onlinechat',
      //   name: 'Page7',
      //   component: Page7,
      // },
      {
        path: 'landings/ar/chatrandom',
        name: 'Page9',
        component: Page9,
      },
      {
        path: 'landings/it/video',
        name: 'Page10',
        component: Page10,
      },
      {
        path: 'landings/es/onlinechat2',
        name: 'Page12',
        component: Page12,
      },
      // {
      //   path: 'landings/en/video',
      //   name: 'video',
      //   component: Video,
      // },
      {
        path: 'landings/en/card',
        name: 'card',
        component: Card,
      },
      // {
      //   path: 'landings/en/videomatch',
      //   name: 'videomatch',
      //   component: videomatch,
      // },
      {
        path: 'landings/en/videocall',
        name: 'videocall',
        component: videocall,
      },
      {
        path: 'landings/en/camtocam',
        name: 'Page13',
        component: Page13,
      },
      {
        path: 'landings/en/choose',
        name: 'Page14',
        component: Page14,
      },
      {
        path: '/lp/en/gomeet',
        name: 'Page15',
        component: Page15,
      },
      {
        path: 'landings/ar/onlinechat',
        name: 'Page16',
        component: Page16,
      },
      {
        path: 'landings/en/Page17',
        name: 'Page17',
        component: Page17,
      },
      {
        path: 'lp/en/247',
        name: 'Page19',
        component: Page19,
      },
      {
        path: 'landings/en/video',
        name: 'Page20',
        component: Page20,
      },
      {
        path: 'landings/ar/female-video',
        name: 'Page21',
        component: Page21,
      },
      {
        path: 'landings/en/videochat',
        name: 'Page23',
        component: Page23,
      },
      {
        path: 'landings/en/videomatch',
        name: 'Page24',
        component: Page24,
      },
    ]
  },
  {
    path: '*',
    redirect: `/${pathTxt}`
  }
];

const route = new VueRouter({
  mode: 'history',
  routes,
});

route.beforeEach((to, from, next) => {
  const { name, meta } = to;

  // 设置页面seo信息
  if (['LivCam', 'SafetyCenter', 'PrivacyPolicy', 'AboutUs', 'CommunityGuidelines', 'RandomVideoChat', 'Coomeet', 'Luckycrush', 'Omegle', 'Mides', 'Page1', 'Page2', 'Page3', 'Page4', 'ukp2', 'ukp5', 'slotmachine', 'flipcard', 'Page11', 'Page8', 'Page7', 'waterfall', 'Page9', 'Page10', 'Page12', 'video', 'card', 'videomatch', 'videocall', 'Page13', 'Page14', 'Page15', 'Page16', 'Page17', 'Page19', 'Page20', 'Page21', 'Page23', 'Page24'].indexOf(name) !== -1) {
    setHead(name);
  }
  // 是否清除外布局
  if (meta && meta.layoutRemove) {
    document.body.classList.add('layout-remove');
  } else {
    document.body.classList.remove('layout-remove');
  }

  // 不需要登录判断的白名单
  if (['LivCam', 'LoginPage', 'VideoView', 'LiveChat', 'TermsUse', 'PrivacyPolicy', 'CookiePrivacy', 'AboutUs', 'CommunityGuidelines', 'SafetyCenter', 'PrivacyCenter', 'RandomVideo', 'RandomVideoChat', 'Coomeet', 'Luckycrush', 'Omegle', 'Mides', 'Page1', 'Page2', 'Page3', 'Page4', 'ukp2', 'ukp5', 'slotmachine', 'flipcard', 'Page11', 'Page8', 'Page7', 'waterfall', 'Page9', 'Page10', 'Page12', 'video', 'card', 'videomatch', 'videocall', 'Page13', 'Page14', 'Page15', 'Page16', 'Page17', 'Page19', 'Page20', 'Page21', 'Page23', 'Page24'].indexOf(name) !== -1) {
    return next();
  }

  // macthPage 刷新退回livcam
  if (!from.name && to.name === 'MatchPage') {
    next({ name: 'LivCam' });
  }

  if (from.name === 'CoinPage' && to.name === 'MatchPage') {
    next({ name: 'LivCam' });
  }

  // 登录框调起
  if (!store.state.app.isLogin) {
    store.commit('setLoginPopFrom', 'router');
    store.commit('setShowLoginPop', true);
    window.gtag && window.gtag('event', 'goMeetShowLoginPop', { send_to: ['AW-834247273/TQgKCNy00YIYEOm05o0D', 'livu'] });
    return false;
  }
  return next();
});

export default route;
