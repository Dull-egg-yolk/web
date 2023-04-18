<template>
  <base-pop class="pop-public pop-hobby" :showPop="show" @cancelPop="cancelPop">
    <div class="pop-title">{{ $t('base.interests') }}</div>
    <!-- 选择兴趣 -->
    <div class="hobby-list">
      <div
        class="oitem"
        v-for="(item, index) in hobbyList"
        :key="index"
        :class="{ selected: selectedHobby.indexOf(item.name) !== -1 }"
        @click="selectHandler(item.name)"
      >
        <span class="ico">
          <img :src="item.icon" alt="" />
        </span>
        <span>
          {{ item.txt }}
        </span>
        <span class="icon-right fx-ic"></span>
      </div>
    </div>
    <div class="pop-action">
      <div class="m-btn major" @click="cancelPop">{{$t('base.save')}}</div>
    </div>
  </base-pop>
</template>

<script>
import BasePop from '../BasePop.vue';

export default {
  name: 'PopHobby',
  data () {
    return {
      hobbyList: [
        {
          name: 'beauty',
          txt: this.$t('interest.beauty'),
          icon: './assets/img/hobby/beauty.png',
        },
        {
          name: 'dance',
          txt: this.$t('interest.dance'),
          icon: './assets/img/hobby/dance.png',
        },
        {
          name: 'shopping',
          txt: this.$t('interest.shopping'),
          icon: './assets/img/hobby/shopping.png',
        },
        {
          name: 'cooking',
          txt: this.$t('interest.cooking'),
          icon: './assets/img/hobby/cooking.png',
        },
        {
          name: 'reading',
          txt: this.$t('interest.reading'),
          icon: './assets/img/hobby/reading.png',
        },
        {
          name: 'sport',
          txt: this.$t('interest.sport'),
          icon: './assets/img/hobby/sport.png',
        },
        {
          name: 'cat',
          txt: this.$t('interest.cat'),
          icon: './assets/img/hobby/cat.png',
        },
        {
          name: 'dog',
          txt: this.$t('interest.dog'),
          icon: './assets/img/hobby/dog.png',
        },
        {
          name: 'yoga',
          txt: this.$t('interest.yoga'),
          icon: './assets/img/hobby/yoga.png',
        },
        {
          name: 'football',
          txt: this.$t('interest.football'),
          icon: './assets/img/hobby/football.png',
        },
        {
          name: 'music',
          txt: this.$t('interest.music'),
          icon: './assets/img/hobby/music.png',
        },
        {
          name: 'camping',
          txt: this.$t('interest.camping'),
          icon: './assets/img/hobby/camping.png',
        },
        {
          name: 'fashion',
          txt: this.$t('interest.fashion'),
          icon: './assets/img/hobby/fashion.png',
        },
        {
          name: 'party',
          txt: this.$t('interest.party'),
          icon: './assets/img/hobby/party.png',
        },
        {
          name: 'photography',
          txt: this.$t('interest.photography'),
          icon: './assets/img/hobby/photography.png',
        },
        {
          name: 'traveling',
          txt: this.$t('interest.traveling'),
          icon: './assets/img/hobby/traveling.png',
        },
      ],
      selectedHobby: [],
    };
  },
  props: {
    show: {
      type: Boolean,
      default: false,
    },
    myHobby: {
      type: Array,
      default: () => [],
    },
  },
  components: {
    BasePop,
  },
  computed: {},
  methods: {
    cancelPop () {
      this.$emit('cancel');
    },
    selectHandler (name) {
      const itemPos = this.selectedHobby.indexOf(name);
      if (itemPos === -1) {
        this.selectedHobby.push(name);
      } else {
        this.selectedHobby.splice(itemPos, 1);
      }
    },
  },
  mounted () {
    this.selectedHobby = this.myHobby.slice();
  },
};
</script>

<style lang="less">
@import url('~@/style/var.less');
.pop-hobby {
  .hobby-list {
    height: 380px;
    overflow: scroll;
    display: flex;
    flex-flow: row wrap;
    padding: 0 14px;
    .oitem {
      width: 112px;
      height: 144px;
      background: @cblue-6;
      border-radius: 8px;
      margin: 0 6px 6px 0;
      text-align: center;
      cursor: pointer;
      transition: all 0.3s;
      font-size: 13px;
      position: relative;
      &:hover {
        opacity: 0.8;
      }
      &:nth-child(3n) {
        margin-right: 0;
      }
      .ico {
        display: block;
        padding: 12px 0;
        margin-bottom: -10px;
        img {
          display: block;
          margin: 0 auto;
          width: 88px;
        }
      }
      .icon-right {
        position: absolute;
        right: 6px;
        bottom: 6px;
        width: 28px;
        height: 28px;
        background: #fff;
        color: @cblue-2;
        font-size: 12px;
        border-radius: 50%;
        transform: scale(0);
        transform-origin: center;
        transition: all 0.2s;
      }
      &.selected {
        background: @cblue-2;
        color: #fff;
        .icon-right {
          transform: scale(0.7);
        }
      }
    }
  }
}
@media screen and (max-width: 680px) {
  .pop-hobby {
    .hobby-list {
      height: 300px;
      .oitem {
        width: 86px;
        height: 112px;
        .ico {
          padding: 8px 0;
          img {
            width: 68px;
          }
        }
        .icon-right{
          right:0;
          bottom:0;
        }
        &.selected {
          .icon-right {
            transform: scale(0.6);
          }
        }
      }
    }
  }
}
</style>
