<template>
    <section class="rc-img-upload">
        <input @change="fileChange" type="file" accept="image/*" :multiple="multipleJudge" style="visibility: hidden; width: 0; height: 0;" ref="rcImgUpload"/>
        <div class="item" v-if="!multipleJudge && imgSrc">
            <img :src="imgSrc" class="upload-img"/>
            <img class="upload-close" @click="clearImg()"/>
        </div>
        <ul v-if="multipleJudge && imgSrcArr.length" class="rc-img-upload">
            <li class="item" v-for="(item, index) in imgSrcArr" :key="index">
                <img :src="item" class="upload-img"/>
                <img class="upload-close" @click="clearImg(index)" src="@/assets/img/shop/new/upload-close.png"/>
            </li>
        </ul>
        <div v-if="showAdd" class="item item-add" @click="uploadClick">
            <img src="@/assets/img/shop/new/img-upload.png" alt="empty image"/>
            <p v-if="!imgSrcArr.length && !imgSrc">{{tip}}</p>
        </div>
    </section>
</template>

<script>
import axios from 'axios';
import { request } from '@/api/base';
import { decryptData, encryptData } from '@/api/crypto';

export default {
  name: 'imgUpload',
  props: {
    multipleJudge: {
      type: Boolean,
      default: false
    },
    limit: {
      type: Number,
      default: 1
    },
    tip: {
      type: String,
      default: ''
    }
  },
  watch: {
    imgSrcArr (val) {
      if (val.length >= this.limit) this.showAdd = false;
      else this.showAdd = true;
    },
    imgSrc (val) {
      if (val) this.showAdd = false;
      else this.showAdd = true;
    }
  },
  data () {
    return {
      showAdd: true,
      imgSrc: '', // 单张图片
      imgSrcArr: [], // 多张图片
      files: []
    };
  },
  methods: {
    emitData () {
      if (this.multipleJudge) this.$emit('imgUpload', this.imgSrcArr);
      if (!this.multipleJudge) this.$emit('imgUpload', this.imgSrc);
    },
    fileChange (el) {
      console.log('fileChange');
      const files = el.target.files;
      this.files.push(...files);
      if (this.imgSrcArr.length + files.length > this.limit) {
        this.$Message.info('Up to three pictures can be uploaded');
        return;
      }

      // 本地预览图片
      const _this = this;
      const length = files.length;

      // 遍历文件图片预览
      for (let i = 0; i < length; i++) {
        const reader = new FileReader();
        console.log(reader);
        if (!reader) {
          console.log('对不起，您的浏览器不支持！请更换浏览器试一下');
          return;
        }

        // reader.error = function (e) {
        //     console.log("读取异常")
        // }

        // 读取成功
        reader.onload = function (event) {
          const _src = event.target.result;
          _this.imgSrcArr.push(_src);
          if (_this.imgSrcArr.length > 0) {
            _this.$emit('update:wetherUploadImg', true);
          } else {
            _this.$emit('update:wetherUploadImg', false);
          }
          console.log('imgSrcArr', _this.imgSrcArr);
        };
        reader.readAsDataURL(files[i]);
      }
      el.target.value = null;
    },
    async uploadImgs () {
      const formData = new FormData();

      // 添加多文件到form
      for (let i = 0; i < this.files.length; i++) {
        formData.append('multipartFiles', this.files[i]);
      }
      const uploadRes = await this.upload(formData).then(res => {
        this.$emit('imgUpload', res);
        console.log('上传图片成功');
        return true;
      });
      return !!uploadRes;
    },
    clearImg (index) {
      if (index === undefined) this.imgSrc = '';
      else {
        this.imgSrcArr = this.imgSrcArr.slice(0, index).concat(this.imgSrcArr.slice(index + 1));
        this.files = this.files.slice(0, index).concat(this.files.slice(index + 1));
      }
      if (this.imgSrcArr.length > 0) {
        this.$emit('update:wetherUploadImg', true);
      } else {
        this.$emit('update:wetherUploadImg', false);
      }
      this.emitData();
    },
    uploadClick () {
      if (this.multipleJudge && this.imgSrcArr.length >= this.limit) return;
      if (!this.multipleJudge && this.imgSrc) return;
      this.$nextTick(() => {
        this.$refs.rcImgUpload.click();
      });
    },
    async upload (formData) {
      // this.$Spin.show();
      const uploadUrl = `${baseConfig.shopApi}/thirdPaymentRecon/1/uploadBillImg`;
      const res = await axios.post(uploadUrl, formData, {
        headers: {
          'content-type': 'application/x-www-form-urlencoded',
          'Athena-Request-Decryption': 'disabled',
          'Athena-Response-Encryption': 'disabled'
        }
      });
      // this.$Spin.hide();
      // return JSON.parse(decryptData(res.data)).data || []
      console.log('imgupload data', res.data);
      return (res.data && res.data.data) || [];
    }
  }
};
</script>

<style lang="less" rel="stylesheet/less" scoped>
    .position-m-m {
        position: absolute;
        top: 50%;
        left: 50%;
        transform: translate(-50%, -50%);
    }
    .rc-img-upload {
        display: flex;
        justify-content: flex-start;
        flex-wrap: wrap;
        &.item, .item {
            width: 60px;
            height: 60px;
            box-sizing: border-box;
            position: relative;
            margin: .1rem .2rem 0 0;
            &.item-add {
                background-color: #ffffff;
                position: relative;
                > img {
                    .position-m-m;
                    width: 60px;
                    height: 60px;
                }
                > p {
                    display: block;
                    width: 76vw;
                    left: 60px;
                    top: 50%;
                    transform: translateY(-50%);
                    position: absolute;
                    line-height: 14px;
                    font-size: 12px;
                    color: #ff7f7f;
                }
            }
            .upload-img {
                width: 60px;
                height: 60px;
            }

            .upload-close {
                width: 18px;
                height: 18px;
                position: absolute;
                background-color: #000000;
                border-radius: 50%;
                top: -2px;
                right: -4px;
                z-index: 10;
            }

        }
    }
</style>
