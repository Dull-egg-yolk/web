export default class CanvasProgress {
  constructor (params) {
    const { el, number, time, lineWidth, success, w } = params;
    this.time = time;
    this.lineWidth = lineWidth;
    this.cb = success;
    this.ctimer = null;
    // 获取canvas 元素 及其 2d context
    const cav = document.querySelector(el);
    this.ctx = cav.getContext('2d');

    // 获取canvas 元素的宽高信息 用来计算圆形进度的 圆点坐标
    // const { width, height } = cav.getBoundingClientRect();

    // this.w = width;
    // this.h = height;
    this.w = w;
    this.h = w;
    this.x = w / 2;
    this.y = w / 2;
    this.r = this.x * 0.9;

    console.log(this.x, this.y, this.w, this.h, '----canvas');

    this.beginP = 0;
    this.number = number;
  }

  // 绘制圆形
  drawCircle (progress) {
    const { ctx, x, y, r } = this;
    ctx.beginPath();
    ctx.lineCap = 'round';
    ctx.lineWidth = this.lineWidth;

    // console.log(progress, '----canvas');

    let cr, cg, cb;

    // 255, 215, 0
    // 121, 255, 169,
    // 255, 94, 141

    if (progress <= 1) {
      cr = 255 - progress * 130;
      cg = 215 + progress * 40;
      cb = progress * 170;
    } else {
      cr = 125 + (progress - 1) * 200;
      cg = 255 - (progress - 1) * 200;
      cb = 170 - (progress - 1) * 100;
    }

    cr = Math.floor(cr);
    cg = Math.floor(cg);
    cb = Math.floor(cb);

    ctx.strokeStyle = `rgb(${cr},${cg},${cb})`;
    ctx.arc(x, y, r, -0.5 * Math.PI, -0.5 * Math.PI + progress * Math.PI, true);
    ctx.stroke();
    ctx.closePath();
  }

  // 动画绘制
  play () {
    this.beginP = 0;
    clearInterval(this.ctimer);
    const { ctx, w, h } = this;
    const rollTime = 40;
    const timeScale = 2000 / this.time * rollTime;

    console.log('---canvas', this.ctx);
    const draw = () => {
      // canvas 动画美帧绘制前 都需要把上一帧清除掉
      ctx.clearRect(0, 0, w, h);
      if (this.beginP < 1999) {
        const p = this.beginP / 1000;
        this.drawCircle(p);
        this.beginP += timeScale;
      } else {
        ctx.clearRect(0, 0, w, h);
        clearInterval(this.ctimer);
        this.cb && this.cb();
      }
    };
    this.ctimer = setInterval(() => {
      draw();
    }, rollTime);
  }

  stop () {
    const { ctx, w, h } = this;
    clearInterval(this.ctimer);
    ctx.clearRect(0, 0, w, h);
  }
}
