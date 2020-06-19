/*
1 动画 animate 去管理所有动画函数
  1 天空移动
  2 小鸟跳跃
  3 小鸟飞
  4 字体大小变化
  5 集中一个函数 执行 以上所有函数
2 创建柱子 => 点击开始时创建柱子
    */

//对象收编变量
var bird = {
    skyPosition: 0,
    skyStep: 2,
    birdTop: 220,
    startColor: "blue",
    startFlag: false,
    birdStepY: 0,
    minTop: 0,
    maxTop: 570,
    pipeLength: 7,
    pipeArr: [],
    score: 0,
    pipeLastIndex: 6,
    //初始化函数
    init: function() {
        this.animate();
        this.initData();
        this.handle();

        if (sessionStorage.getItem("play")) {
            this.start();
        }
    },
    //初始化数据
    initData: function() {
        this.el = document.querySelector("#game");
        this.oBird = this.el.querySelector(".bird");
        this.oStart = this.el.querySelector(".start");
        this.oScore = this.el.querySelector(".score");
        this.oMask = this.el.querySelector(".mask");
        this.oEnd = this.el.querySelector(".end");
        this.oFinalScore = this.el.querySelector(".final-score");
        this.oRankList = this.oEnd.querySelector(".rank-list");
        this.oRestart = this.oEnd.querySelector(".restart");
        //存放本地 得分 数据
        this.scoreArr = this.getScore();
    },

    //获取本地存储数据
    getScore: function() {
        var scoreArr = getLocal("score");
        //如果返回的 本地数据 为ture 返回数据 为false 返回空数据  保证每次返回的都是数据形式
        return scoreArr ? scoreArr : [];
    },

    //动画 管理所有动画效果
    animate: function() {
        var count = 0;

        this.timer = setInterval(() => {
            //这里this 指向bird
            this.skyMove();

            if (this.startFlag) {
                this.birdDrop();
                this.pipeMove();
            }

            if (++count % 10 === 0) {
                if (!this.startFlag) {
                    this.birdJump();
                    this.fontchange();
                }
                this.birdFly(count);
            }
        }, 30);
    },
    //天空移动
    skyMove: function() {
        //让图片天空(背景图设置 background-position-x : **px)动起来
        this.skyPosition -= this.skyStep;
        this.el.style.backgroundPositionX = this.skyPosition + "px";
    },

    //小鸟跳跃
    birdJump: function() {
        this.birdTop = this.birdTop === 220 ? 260 : 220;
        this.oBird.style.top = this.birdTop + "px";
    },
    //小鸟下坠
    birdDrop: function() {
        this.birdTop += ++this.birdStepY;
        this.oBird.style.top = this.birdTop + "px";
        //碰撞检测
        this.judgeKnock();
        //加分
        this.addScore();
    },
    //小鸟飞 翅膀效果
    birdFly: function(count) {
        this.oBird.style.backgroundPositionX = (count % 3) * -30 + "px";
    },
    //字体变化
    fontchange: function() {
        //保存以前的颜色
        var oldColor = this.startColor;
        //让颜色更换
        this.startColor = oldColor === "blue" ? "white" : "blue";
        //修改类名
        this.oStart.classList.remove("start-" + oldColor);
        this.oStart.classList.add("start-" + this.startColor);
    },
    ///柱子移动
    pipeMove: function() {
        for (var i = 0; i < this.pipeLength; i++) {
            //拿到数组里的柱子
            var oUpPipe = this.pipeArr[i].up;
            var oDownPipe = this.pipeArr[i].down;
            //移动的left 值
            var x = oUpPipe.offsetLeft - this.skyStep;

            //如果柱子left小于-52 拿到最后一根柱子的 offsetLeft 值
            if (x < -52) {
                var lastPipeleft = this.pipeArr[this.pipeLastIndex].up.offsetLeft;
                oUpPipe.style.left = lastPipeleft + 300 + "px";
                oDownPipe.style.left = lastPipeleft + 300 + "px";
                this.pipeLastIndex = ++this.pipeLastIndex % this.pipeLength;
                // var pipeHeight = this.getPipeHeight();
                // oUpPipe.style.height = pipeHeight.up + "px";
                // oDownPipe.style.height = pipeHeight.down + "px";

                continue;
            }
            oUpPipe.style.left = x + "px";
            oDownPipe.style.left = x + "px";
        }
    },
    //随机获取柱子高度

    getPipeHeight: function() {
        //随机高度  (柱子间隙 150 ,600-150=450, 450➗2 = 225); 因为最小柱子高,最小50,结果上最小+50,最大-50,保持225
        var upHeight = 50 + Math.floor(Math.random() * 175);
        //总高 - 上柱子 - 中间间隙
        var downHeight = 600 - 150 - upHeight;

        return {
            up: upHeight,
            down: downHeight,
        };
    },

    ///同一处理 调用碰撞函数
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
    //柱子碰撞
    judgePipe: function() {
        //相遇的时候 pipeX = 95
        //离开的时候 pipeX = 13
        var index = this.score % this.pipeLength;
        var pipeX = this.pipeArr[index].up.offsetLeft;
        var pipeY = this.pipeArr[index].y;
        var birdY = this.birdTop;
        if (
            pipeX <= 95 &&
            pipeX >= 13 &&
            (birdY <= pipeY[0] || birdY >= pipeY[1])
        ) {
            this.faliGame();
        } else {}
    },
    //加分事件
    addScore: function() {
        //这里主要为了重复拿到 柱子 索引  0 ==> 7  ==> 0 ==> 7
        var index = this.score % this.pipeLength;
        var pipeX = this.pipeArr[index].up.offsetLeft;

        if (pipeX < 13) {
            //注意!!!这里不是vue框架,所有改变的只是页面上的 得分显示!!!!!!!!
            this.oScore.innerText = ++this.score;
        }
    },

    //所有事件管理 调用所有事件
    handle: function() {
        this.handleStart();
        this.handleClick();
        this.handleRestart();
    },
    // 点击开始游戏
    handleStart: function() {
        //强制改变 this  不执行函数 改变this bind

        this.oStart.onclick = this.start.bind(this);
    },

    //点击开始游戏
    start: function() {
        this.startFlag = true;
        this.oBird.style.left = "80px";
        //点击开始游戏,让小鸟当中的 transition = "none"
        this.oBird.style.transition = "none";

        this.oStart.style.display = "none";
        this.oScore.style.display = "block";
        this.skyStep = 5;

        //点击开始游戏 创建柱子
        for (let i = 0; i < this.pipeLength; i++) {
            this.createPipe(300 * (i + 1));
        }
    },

    //创建柱子 事件
    createPipe: function(x) {
        //var pipeHeight
        //随机高度  (柱子间隙 150 ,600-150=450, 450➗2 = 225); 因为最小柱子高,最小50,结果上最小+50,最大-50,保持225
        var upHeight = 50 + Math.floor(Math.random() * 175);
        //总高 - 上柱子 - 中间间隙
        var downHeight = 600 - 150 - upHeight;

        //创建上柱子
        var oUpPipe = createEl("div", ["pipe", "pipe-up"], {
            height: upHeight + "px",
            left: x + "px",
        });
        var oDownPipe = createEl("div", ["pipe", "pipe-down"], {
            height: downHeight + "px",
            left: x + "px",
        });
        this.el.appendChild(oUpPipe);
        this.el.appendChild(oDownPipe);

        //将创建的柱子保存起来
        this.pipeArr.push({
            up: oUpPipe,
            down: oDownPipe,
            y: [upHeight, upHeight + 150],
        });
    },
    //页面点击 上飞事件
    handleClick: function() {
        this.el.onclick = (e) => {
            if (!e.target.classList.contains("start")) {
                this.birdStepY = -10;
            }
        };
    },

    // 点击重新开始
    handleRestart: function() {
        this.oRestart.onclick = function() {
            sessionStorage.setItem("play", true);
            //让页面重新刷新
            window.location.reload();
        };
    },

    //存 得分数据
    setScore: function() {
        this.scoreArr.push({
            score: this.score,
            time: this.getDate(),
        });

        this.scoreArr.sort(function(a, b) {
            return b.score - a.score;
        });

        setLocal("score", this.scoreArr);
    },

    //获取日期
    getDate: function() {
        var d = new Date();
        var year = formatNum(d.getFullYear());
        var month = formatNum(d.getMonth());
        var day = formatNum(d.getDate());
        var hour = formatNum(d.getHours());
        var minute = formatNum(d.getMinutes());
        var second = formatNum(d.getSeconds());

        return `${year}.${month}.${day} ${hour}:${minute}:${second}`;
    },

    //游戏输了之后
    faliGame: function() {
        clearInterval(this.timer);
        //结束后 将数据 push 进scoreArr数组
        this.setScore();
        this.oMask.style.display = "block";
        this.oEnd.style.display = "block";
        this.oBird.style.display = "none";
        this.oScore.style.display = "none";

        //游戏结束后 Your Results
        this.oFinalScore.innerText = this.score;

        //循环设置排行列表
        this.renderRankList();
    },
    renderRankList: function() {
        //innerHTML 可以 设置 dom
        var template = "";
        for (let i = 0; i < 8; i++) {
            var degreeClass = "";
            switch (i) {
                case 0:
                    degreeClass = "first";
                    break;
                case 1:
                    degreeClass = "second";
                    break;
                case 2:
                    degreeClass = "third";
                    break;
            }

            //将这些模板 设置给 rank-list
            template += `<li class="rank-item">
            <span class="rank-degree ${degreeClass}">${i + 1}</span>
            <span class="rank-score">${this.scoreArr[i].score}</span>
            <span class="rank-time">${this.scoreArr[i].time}</span>
        </li>`;
        }
        this.oRankList.innerHTML = template;
    },
};