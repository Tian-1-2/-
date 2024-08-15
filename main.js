// 设置画布
const canvas = document.querySelector('canvas');
const ctx = canvas.getContext('2d');
const width = canvas.width = window.innerWidth;
const height = canvas.height = window.innerHeight;
ctx.fillRect(0, 0, width, height);

// 生成随机数的函数
function random(min, max) {
  const num = Math.floor(Math.random() * (max - min)) + min;
  return num;
}
function Ball(width, height, ctx) {
  this.width = width;
  this.height = height;
  this.ctx = ctx;
  this.r = random(10, 20);
  this.x = random(this.r, this.width - this.r);
  this.y = random(this.r, this.height - this.r)
  this.speedX = random(-4, 4);
  this.speedY = random(-4, 4);
  this.color = `rgb(${random(0, 255)},${random(0, 255)},${random(0, 255)})`;
}
Ball.prototype = {
  draw: function () {
    ctx.beginPath();
    ctx.fillStyle = this.color;
    ctx.arc(this.x, this.y, this.r, 0, Math.PI * 2);
    ctx.fill();
    ctx.closePath();
  },
  move: function () {
    //解决生成球不动情况
    if (this.speedX == 0) {
      this.speedX = 1;
    }
    if (this.speedY == 0) {
      this.speedY = 1;
    }
    //判断边界值，让圆球始终保证在画面内
    if (this.x > this.width - this.r || this.x < this.r) {
      this.speedX = -this.speedX;
    }
    if (this.y > this.height - this.r || this.y < this.r) {
      this.speedY = -this.speedY;
    }
    this.x += this.speedX;
    this.y += this.speedY;
  },
  playermove: function () {
    var that = this;
    //为document绑定一个按键按下的事件
    document.onkeydown = function (event) {
      //定义一个变量，来表示移动的速度
      var speed = 30;
      //当用户按了ctrl以后，速度加快
      if (event.ctrlKey) {
        speed = 100;
      }
      switch (event.code) {
        case "ArrowLeft":
          //alert("向左"); 
          that.x = that.x - speed;
          break;
        case "ArrowRight":
          //alert("向右");
          that.x = that.x + speed;
          break;
        case "ArrowUp":
          //alert("向上");
          that.y = that.y - speed;
          break;
        case "ArrowDown":
          //alert("向下");
          that.y = that.y + speed;
          break;
      }
      //判断玩家小球不会出界
      if (that.x < that.r) {
        that.x = that.r;
      } else if (that.x > width - that.r) {
        that.x = width - that.r;
      } else if (that.y < that.r) {
        that.y = that.r;
      } else if (that.y > height - that.r) {
        that.y = height - that.r;
      }
    };
  }
}
// 创建20个移动Ball实例
let balls = [];
for (let i = 0; i < 10; i++) {
  let newBall = new Ball(width, height, ctx);
  newBall.draw();
  balls.push(newBall);
}
// 创建玩家小球
var playerBall = new Ball(width, height, ctx);
playerBall.draw();
playerBall.r = 30;
playerBall.playermove();

handlerid = requestAnimationFrame(function fn() {
  //每次画之前都有清除画布
  ctx.fillStyle = "rgba(0,0,0,0.2)"
  ctx.fillRect(0, 0, width, height);
  playerBall.draw(ctx);

  for (let j = 0; j < balls.length; j++) {
    balls[j].draw(ctx);
    balls[j].move();
    //判断球相撞变色
    for (let k = 0; k < balls.length; k++) {
      if (j != k) {
        if (Math.sqrt(Math.pow(balls[j].x - balls[k].x, 2) + Math.pow(balls[j].y - balls[k].y, 2)) <= balls[k].r + balls[j].r) {
          balls[j].color = balls[k].color = `rgb(${random(0, 255)},${random(0, 255)},${random(0, 255)})`;
        }
      }
    }
    //判断玩家球和其他球相撞
    if (Math.sqrt(Math.pow(balls[j].x - playerBall.x, 2) + Math.pow(balls[j].y - playerBall.y, 2)) <= playerBall.r + balls[j].r) {
      balls.splice(j, 1);
      playerBall.r = playerBall.r + 5;

    }

  }
  if (balls.length == 0) {
    alert("球被吃完了！")
    cancelAnimationFrame(handlerid);
  } else {
    requestAnimationFrame(fn);
  }
});







