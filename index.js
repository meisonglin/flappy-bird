//对象收编变量

/* 
  1 动画 animate 去管理所有动画函数
    1 天空移动
    2 小鸟跳跃
    3 小鸟飞
    4 字体大小变化

    5 集中一个函数 执行 以上所有函数
*/

var bird = {
    skyPosition: 0,
    skyStep: 2,
    birdTop: 220,
    startColor: "blue",
    startFlag: false,
    birdStepY: 0,
    minTop: 0,
    maxTop: 570,
    //初始化函数
    init: function() {
        this.animate();
        this.initData();
        this.handle();
    },
    initData: function() {
        this.el = document.querySelector("#game");
        this.oBird = this.el.querySelector(".bird");
        this.oStart = this.el.querySelector(".start");
        this.oScore = this.el.querySelector(".score");
        this.oEnd = this.el.querySelector(".end");
        this.oMask = this.el.querySelector(".mask");
    },

    animate: function() {
        var count = 0;

        this.timer = setInterval(() => {
            if (this.startFlag) {
                this.birdDrop();
            }

            //这里this 指向bird
            this.skyMove();
            if (++count % 10 === 0) {
                if (!this.startFlag) {
                    this.birdJump();
                    this.fontchange();
                }
                this.birdFly(count);
            }
        }, 30);
    },

    skyMove: function() {
        //让图片天空(背景图设置 background-position-x : **px)动起来
        this.skyPosition -= this.skyStep;
        this.el.style.backgroundPositionX = this.skyPosition + "px";
    },
    birdJump: function() {
        this.birdTop = this.birdTop === 220 ? 260 : 220;
        this.oBird.style.top = this.birdTop + "px";
    },

    birdDrop: function() {
        this.birdTop += ++this.birdStepY;
        this.oBird.style.top = this.birdTop + "px";
        //碰撞检测
        this.judgeKnock();
    },

    birdFly: function(count) {
        this.oBird.style.backgroundPositionX = (count % 3) * -30 + "px";
    },
    fontchange: function() {
        //保存以前的颜色
        var oldColor = this.startColor;
        //让颜色更换
        this.startColor = oldColor === "blue" ? "white" : "blue";
        //修改类名
        this.oStart.classList.remove("start-" + oldColor);
        this.oStart.classList.add("start-" + this.startColor);
    },

    judgeKnock: function() {
        this.judgeboundary();
        this.judgePipe();
    },
    //边界碰撞
    judgeboundary: function() {
        if (this.birdTop > this.maxTop || this.birdTop < this.minTop) {
            this.faliGame();
        }
    },
    //管子碰撞
    judgePipe: function() {},

    //所有事件管理
    handle: function() {
        this.handleStart();
    },
    handleStart: function() {
        this.oStart.onclick = () => {
            this.startFlag = true;
            this.oBird.style.left = "50px";

            this.oStart.style.display = "none";
            this.oScore.style.display = "block";
            this.skyStep = 5;
        };
    },

    //游戏输了之后
    faliGame: function() {
        clearInterval(this.timer);
        this.oMask.style.display = "block";
        this.oEnd.style.display = "block";
        this.oBird.style.display = "none";
        this.oScore.style.display = "none";
    },
};