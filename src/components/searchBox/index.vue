<template>
  <div class="search">
    <div class="search-box">
      <div class="search-main" v-for="(item, index) in searchList" :key="index" @click.stop="selectChange(item)">
        <div>
          <span class="drop-down">{{ item.name }}</span>
          <!-- <span class="icon icon-drop-down" :class="{ 'ico': item.key === 1 }"></span> -->
        </div>
        <div class="input"><img v-if="searchList[index].id > 5"
            :src="'https://h5.livuchat.com/static/images/countryFlag/' + ($countryCode[searchList[index].id].short.toLowerCase()) + '.png'"
            alt /> <span v-if="index === 0 && searchList[index].id === 0" class="ico"
            :class="{ 'global': index === 0 }"></span> <span v-if="index === 1" class="ico"
            :class="{ [`ico-${searchList[index].id}`]: true }"></span>
          <span>{{ searchList[index].value }}</span></div>
        <div class="search-line" :class="{ 'myStyle': index === searchList.length - 1 }"></div>
      </div>
      <div class="search-btn" @click="searchBtn()"><img src="../../assets/img/search.png" alt="" /></div>
    </div>
    <transition name="slideDown">
      <div v-if="showPop" class="search-content" v-clickoutside:click="outClickHandler">
        <div class="title">{{ title }}</div>
        <div class="content" v-if="dropType === 0">
          <div v-for="(item, index) in list" :key="item.id" @click="changeBtn(item, index)"
            :class="{ cur: item.id === currentIndex }"><img v-if="item.id !== 0"
              :src="'https://h5.livuchat.com/static/images/countryFlag/' + ($countryCode[item.id] ? $countryCode[item.id].short.toLowerCase() : en) + '.png'"
              alt /><span v-if="index === 0 && item.id === 0" class="ico" :class="{ 'global': index === 0 }"></span> {{
                  item.name
              }} </div>
        </div>
        <div class="content" v-if="dropType === 1">
          <div class="gender" v-for="(item, index) in list" :key="item.id" @click="changeBtn(item, index)"
            :class="{ cur: item.id === currentIndex }">
            <span class="ico" :class="{ [`ico-${item.id}`]: true }"></span>
            {{ item.name }}
          </div>
        </div>

        <div class="content" v-if="dropType === 2">
          <div class="age" v-for="(item, index) in list" :key="item.id" @click="changeBtn(item, index)"
            :class="{ cur: item.id === currentIndex }">

            {{ item.name }} </div>
        </div>

      </div>
    </transition>
  </div>
</template>
<script>
import { apiGetGoddessHost } from '@/api/goddess';
// import { getOnlineStatus, getUserGender } from '@/api/user';
import { getOnlineStatus } from '@/api/user';
import Clickoutside from '@/util/clickoutside.js';
import { logReport } from '@/util/logReport';

export default {
  data () {
    return {
      showPop: false,
      title: '',
      currentIndex: null,
      currentSearch: '',
      countryList: [],
      genderList: [
        { id: 0, name: this.$t('webChat.all') },
        { id: 1, name: this.$t('base.male') },
        { id: 2, name: this.$t('base.female') },
      ],
      searchList: [
        {
          tabId: 0,
          key: 'Country',
          value: this.$t('app.country_global'), // 'Global',
          name: this.$t('base.country'),
          id: 0
        },
        {
          tabId: 1,
          key: 'Gender',
          value: this.$t('webChat.all'), // 'All',
          name: this.$t('app.filter_dialog_gender'),
          id: 0
        },
        {
          tabId: 2,
          key: 'Age Group',
          value: this.$t('webChat.allAge'), // 'All Age',
          name: this.$t('webChat.ageGroup'),
          id: 0
        }
      ],
      ageList: [
        {
          id: 0,
          name: this.$t('webChat.allAge')
        },
        {
          id: 1,
          name: '18-25'
        },
        {
          id: 2,
          name: '25-30'
        },
        {
          id: 3,
          name: '30+'
        }
      ],
      list: [],
      dropType: ''
    };
  },
  directives: { Clickoutside },
  components: {},
  computed: {},
  methods: {
    selectChange (data) {
      if (this.currentSearch === data.key) {
        this.showPop = !this.showPop;
      } else {
        this.showPop = true;
      }
      this.currentIndex = data.id;
      this.currentSearch = data.key;

      if (data.key === 'Country' || data.key === 'Host state') {
        // data.key = 'Host state';
        this.list = this.countryList;
      } else if (data.key === 'Gender') {
        this.list = this.genderList;
      } else {
        this.list = this.ageList;
      }
      this.title = data.name;
      this.dropType = data.tabId;
    },
    changeBtn (data, index) {
      this.currentIndex = index;
      this.searchList.forEach(element => {
        if (element.key === this.currentSearch) {
          element.value = data.name;
          element.id = data.id;
        }
      });
      this.showPop = false;
    },
    getGoddessHost () {
      apiGetGoddessHost().then(({ code, data }) => {
        const cdata = new Map([[0, { id: 0, name: this.$t('app.country_global') }]]);

        if (data && data.length) {
          data.forEach(item => {
            if (item !== 0) {
              if (this.$countryCode[item]) {
                const code = this.$countryCode[item].short;
                if (!cdata.has(item)) {
                  const obj = {
                    id: item,
                    name: this.$t(`country.${code}`)
                  };
                  cdata.set(item, obj);
                }
              }
            }
          });
        }
        const list = cdata.values();
        this.countryList = [...list];
      });
    },
    // getUserGender () {
    //   getUserGender().then(({ code, data }) => {
    //     this.genderList = data || [];
    //   });
    // },
    getOnlineStatus () {
      getOnlineStatus().then(({ code, data }) => {
        console.log(data, 'getOnlineStatus');
      });
    },
    searchBtn () {
      this.$emit('searchData', this.searchList);
      console.log(this.searchList, 'this.searchList-------');
      // 点击搜索按钮
      logReport({
        eventId: '106-1-1-3',
        free_name2: { country: this.searchList[0].value, gender: this.searchList[1].value, age: this.searchList[2].value }
      });
    },
    outClickHandler () {
      this.showPop = false;
    }
  },
  mounted () {
    this.getGoddessHost();
    this.getOnlineStatus();
    // this.getUserGender();
  },
};
</script>
<style lang='less' scoped>
.search {
  position: relative;
}
.search-box {
  display: flex;
  // justify-content: space-between;
  flex-direction: row;
  align-content: center;
  align-items: center;
  height: 72px;
  background: #222222;
  border-radius: 40px;
  width: 80%;
  margin: 0 auto;
  margin-bottom: 20px;
  overflow: hidden;

  .search-main {
    position: relative;
    flex: 1;
    cursor: pointer;
    text-align: center;
    background-clip: padding-box;
    padding: 10px 0;

    // border-right: 1px solid #ccc;
    // border-radius: 32px;
    // &:hover {
    //   background: rgba(10, 7, 15, 0.60);
    //   border-radius: 40px;
    // }

    .input {
      width: 100%;
      text-align: center;
      font-family: Helvetica-Bold;
      font-size: 18px;
      color: #FFFFFF;
      font-weight: 700;
      display: flex;
      justify-content: center;
      align-items: center;
      padding: 5px 0;

      img {
        width: 24px;
        height: 24px;
        border-radius: 15px;
        margin-right: 10px;
        object-fit: cover;
      }
      span {
        max-width: 100px;
        overflow: hidden;
        text-overflow: ellipsis;
        white-space: nowrap;
      }
      .ico {
        width: 24px;
        height: 24px;
        background-size: 100% auto;
        background-repeat: no-repeat;
        background-position: center;
        margin-right: 10px;

        &.global {
          background-image: url(~@/assets/img/global.png)
        }

        &.ico-0 {
          background-image: url(~@/assets/img/icon-gd-0.png)
        }

        &.ico-1 {
          background-image: url(~@/assets/img/icon-gd-1.png)
        }

        &.ico-2 {
          background-image: url(~@/assets/img/icon-gd-2.png)
        }
      }
    }

    .drop-down {
      font-family: PingFangSC-Regular;
      font-size: 14px;
      color: rgba(255,255,255,.6);
      letter-spacing: 0;
      font-weight: 400;
    }

    .icon {
      display: inline-block;
      transform: scale(0.5) rotate(0deg);
    }

    .ico {
      // transform: scale(0.5) rotate(180deg);
    }

    .search-line {
      height: 28px;
      border-right: 1px solid rgba(255,255,255,.6);
      position: absolute;
      top: 25%;
      right: 0;
    }

    .myStyle {
      border: none;
    }
  }

  .search-btn {
    cursor: pointer;
    width: 64px;
    height: 64px;
    border-radius: 32px;
    background: linear-gradient(135deg, #FF78FF 0%, #32E5FF 100%);
    display: flex;
    justify-content: center;
    align-items: center;
    margin-right: 5px;
    margin-left: 20px;
    color:#fff;

    img {
      width: 32px;
      height: 32px;
    }
  }
}

.search-content {
  position: absolute;
  left: 10%;
  z-index: 9;
  width: 80%;
  margin: 0 auto;
  background: #0A070F;
  padding: 20px;
  border-radius: 26px;
  max-height: 300px;
  overflow-y: auto;
  box-sizing: border-box;

  .title {
    font-size: 16px;
    margin-bottom: 20px;
    color: #fff;
    margin-left: 40px;
    font-weight: 700;
  }

  .content {
    display: flex;
    flex-wrap: wrap;
    margin-left: 30px;

    div {
      cursor: pointer;
      height: 56px;
      width: 138px;
      border: 1px solid rgba(255,255,255,.2);
      border-radius: 28px;
      margin: 10px 6px;
      display: flex;
      justify-content: left;
      align-items: center;
      font-weight: 700;
      color: #fff;

      &.age{
        text-align: center;
        padding-right:0;
      }

      img {
        width: 24px;
        height: 24px;
        border-radius: 15px;
        margin-right: 10px;
        object-fit: cover;
        margin-left: 20px;
      }

      span {
        margin-left: 20px;
      }

      &.cur {
        color: #fff;
        font-weight: 500;
        background: linear-gradient(138deg, #FF78FF 0%, #32E5FF 100%);
      }

      .ico {
        width: 24px;
        height: 24px;
        background-size: 100% auto;
        background-repeat: no-repeat;
        background-position: center;
        margin-right: 10px;

        &.global {
          background-image: url(~@/assets/img/global.png)
        }

        &.ico-0 {
          background-image: url(~@/assets/img/icon-gd-0.png)
        }

        &.ico-1 {
          background-image: url(~@/assets/img/icon-gd-1.png)
        }

        &.ico-2 {
          background-image: url(~@/assets/img/icon-gd-2.png)
        }
      }
    }

    .age {
      justify-content: center;
    }

    .gender {
      justify-content: center;

      span {
        margin-left: 0;
      }
    }
  }
}

// mobile
@media screen and(max-width: 680px) {
  .search-box {
    width: 100%;
    margin-bottom: 10px;
    background: #222222;
    height: auto;
    padding: 4px 4px 4px 6px;
    box-sizing: border-box;

    .search-btn {
      width: 34px;
      height: 34px;
      margin: 0;

      img {
        width: 20px;
        height: 20px;
      }
    }

    .search-main {
      padding: 0 5px;

      &:nth-child(3) {
        width: 80px;
        flex: inherit
      }

      .drop-down,
      .icon-drop-down {
        display: none;
      }

      .search-line {
        height: 18px;
        opacity: .2;
      }

      .input {
        font-size: 14px;
        img {
          width: 18px;
          height: 18px;
          margin-right:5px;
        }
        .ico {
          width: 18px;
          height: 18px;
          margin-right:5px;
        }
      }
    }
  }

  .search-content {
    width: 96%;
    left: 2%;
    border-radius: 15px;
    box-sizing: border-box;
    padding: 15px 5px;

    .title {
      font-size: 14px;
      text-align: center;
      margin-bottom: 10px;
      margin-left: 0;
    }

    .content {
      display: flex;
      flex-wrap: wrap;
      justify-content: center;
      align-items: center;
      margin-left: 0;
      &>div {
        width:auto;
        min-width: 100px;
        height: 45px;
        margin: 0 5px 6px 0;
        box-sizing: border-box;
        border-color:rgba(255, 255, 255, .15);
        white-space: nowrap;
        padding-right:15px;
        &:nth-child(3n) {
          margin-right: 0;
        }
        img,.ico{
          width:14px;
          height:14px;
          margin-left:15px;
        }
      }
    }
  }
}
</style>
