<template>
  <div class="pop-date-picker" v-clickoutside:click="cancelDrop">
    <div class="date-bar" @click="toggleDrop" :class="{'disabled': disabled}">
      <span class="day">{{  day |addZero  }}</span>/<span class="month">{{  month |addZero  }}</span>/<span class="year">{{  year  }}</span>
    </div>
    <transition name="slideDown">
      <div class="drop-picker flex-row-strech" v-if="drop">
        <div class="o-drop day">
          <div class="drop-title">{{$t('webChat.day')}}</div>
          <div class="list" id="dayList">
            <div class="olist" v-for="item of dayList" :key="item"  :class="{'cur': (+item === day)}" @click="chooseDate('day',item)">{{item |addZero}}</div>
          </div>
        </div>
        <div class="o-drop month">
          <div class="drop-title">{{$t('webChat.month')}}</div>
          <div class="list" id="monthList">
            <div class="olist" v-for="item of monthList" :key="item"  :class="{'cur': (+item === month)}" @click="chooseDate('month', item)">{{item |addZero}}</div>
          </div>
        </div>
        <div class="o-drop year">
          <div class="drop-title">{{$t('webChat.year')}}</div>
          <div class="list" id="yearList">
            <div class="olist" v-for="item of yearList" :key="item" :class="{'cur': (+item === year)}" @click="chooseDate('year', item)">{{item}}</div>
          </div>
        </div>
      </div>
    </transition>
  </div>
</template>

<script>
import Clickoutside from '@/util/clickoutside.js';
export default {
  name: 'PopDatePicker',
  data () {
    return {
      year: '',
      month: '',
      day: '',
      time: '',
      drop: false
    };
  },
  directives: { Clickoutside },
  filters: {
    addZero (v) {
      return v >= 10 ? v : '0' + v;
    }
  },
  watch: {
    date (n) {
      console.log(n, 'change');
      this.resetVal();
    },
    dayList (n) {
      // 月末变化
      if (!n.includes(this.day)) {
        this.day = n[n.length - 1];
      }
    },
    drop (n, o) {
      if (!n && o) {
        this.$emit('update:date', new Date(this.year + '/' + this.month + '/' + this.day).getTime());
      }
    }
  },
  props: {
    date: [String, Number],
    disabled: {
      type: Boolean,
      default: false
    }
  },
  methods: {
    resetVal () {
      const date = this.date ? new Date(this.date) : new Date();
      this.year = date.getFullYear();
      this.month = date.getMonth() + 1;
      this.day = date.getDate();
    },
    setScroll () {
      const yearDom = document.querySelector('#yearList');
      const monthDom = document.querySelector('#monthList');
      const dayDom = document.querySelector('#dayList');

      if (!yearDom || !monthDom || !dayDom) return;

      const yearCur = yearDom.querySelector('.cur');
      const monthCur = monthDom.querySelector('.cur');
      const dayCur = dayDom.querySelector('.cur');

      const listH = yearDom.clientHeight / 2 + 30;

      yearDom.scrollTo(0, yearCur.offsetTop - listH);
      monthDom.scrollTo(0, monthCur.offsetTop - listH);
      dayDom.scrollTo(0, dayCur.offsetTop - listH);
    },
    chooseDate (type, val) {
      this[type] = val;
    },
    toggleDrop () {
      if (this.disabled) return;
      this.drop = !this.drop;
    },
    cancelDrop () {
      this.drop = false;
    }
  },
  computed: {
    yearList () {
      const curYear = new Date().getFullYear();
      const list = [];
      for (let i = curYear - 18; i >= 1930; i--) {
        list.push(i);
      }
      return list;
    },
    monthList () {
      const list = [];
      for (let i = 1; i <= 12; i++) {
        list.push(i);
      }
      return list;
    },
    dayList () {
      const totalDay = new Date(this.year, this.month, 0).getDate();
      const list = [];
      for (let i = 1; i <= totalDay; i++) {
        list.push(i);
      }
      return list;
    },
  },
  updated () {
    // this.$emit('update:date', new Date(this.year + '/' + this.month + '/' + this.day).getTime());
    this.$nextTick(() => {
      this.setScroll();
    });
  },
  mounted () {
    console.log(this.date, 'date');
    this.resetVal();
  }
};

</script>

<style lang="less" scoped>
@import url("~@/style/var.less");

.pop-date-picker{
  display:inline-block;
  position:relative;
  z-index:9;
  color:#fff;

  .date-bar{
    font-size:14px;
    cursor: pointer;
    &.disabled{
      opacity: .8;
    }
    span{
      display:inline-block;
      padding:0 1px;
      text-align:center;
      &.year{
        width: 38px;
      }
      &.month,&.day{
        width:20px;
      }
    }
  }

  .drop-picker{
    position:absolute;
    width:240px;
    right:0;
    background:#17161F;
    padding:10px 10px;
    border-radius: 20px;
    box-shadow: 0 0 20px  rgba(0,0,0,.4);
    border:solid 1px rgba(255,255,255,.1);
    font-size:13px;
    .o-drop{
      height: 180px;
      overflow: auto;
      flex:1;
      text-align: center;
      margin:0 5px;
      display: flex;
      flex-direction: column;
      .list{
        flex:1;
        overflow:auto;
        scroll-behavior:smooth;
        padding:60px 0;
        border-radius: 12px;
        background-color: rgba(0,0,0,.5);
      }
      .drop-title{
        line-height: 1;
        font-size:12px;
        opacity: .5;
        padding:5px 0;
        background:rgba(255,255,255,.2);
        border-radius: 100px;
        margin-bottom:10px;
      }
      .olist{
        display: block;
        line-height:30px;
        height:30px;
        cursor: pointer;
        opacity: .8;
        border-radius: 100px;
        background: transparent;
        &.cur{
          opacity: 1;
          font-weight:bold;
          background:#FF78FF;
        }
      }
    }
  }
}
</style>
