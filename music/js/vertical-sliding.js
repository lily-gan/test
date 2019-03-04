;(function (w) {
    w.verticalSliding = {};

    function move(content, list, callBack) {
        //滑屏区域
        var wrap = document.querySelector("#wrap > .content ");
        //滑屏元素
        var content = wrap.children[0];
        //滚动元素的初始位置
        var eleStartY = 0;
        //手指的初始位置
        var fingerStartY = 0;

        //橡皮筋效果
        //可以滑动的最小距离
        var minY = 0;
        setTimeout(function () {
            minY = wrap.clientHeight - content.offsetHeight;
        }, 200)

        //手指上一次的位置
        var lastLocation = 0;
        //上一次滑屏touchmove的时间
        var lastTime = 0;
        var disTime = 1;
        var disPoint = 0;

        wrap.addEventListener("touchstart", function (ev) {
            ev = ev || event;
            content.style.transition = "none";

            var touchC = ev.changedTouches[0];

            //元素的初始位置
            eleStartY = transform.css(content, "translateY");

            //手指触屏的初始位置
            fingerStartY = touchC.clientY;
            //手指上一次的位置
            lastLocation = touchC.clientY;
            //时间
            lastTime = new Date().getTime();

            //解决速度的残留
            disTime = 1;
            disPoint = 0;
            content.handMove = false;

            isY = true;
            isFirst = true;

            //滚动条逻辑
            if (callBack && (typeof callBack["start"]).toLowerCase() === "function") {
                callBack["start"].call(list);
            }
        });
        wrap.addEventListener("touchmove", function (ev) {
            ev = ev || event;
            //手指
            var touchC = ev.changedTouches[0];
            //手指现在的位置
            var nowFingerY = touchC.clientY;
            //手指滑动的距离
            var fingerDis = nowFingerY - fingerStartY;
            var translateY = eleStartY + fingerDis;

            //手动橡皮筋效果
            var nowTime = new Date().getTime();
            disTime = nowTime - lastTime;
            disPoint = nowFingerY - lastLocation;
            lastLocation = nowFingerY;
            lastTime = nowTime;
            var scale = 0;
            //让手指每次滑动的有效距离越来越小
            if (translateY > 0) {
                content.handMove = true;
                scale = document.documentElement.clientWidth / ((document.documentElement.clientWidth + translateY) * 2);
                translateY = transform.css(content, "translateY") + disPoint * scale;
            } else if (translateY < minY) {
                content.handMove = true;
                var over = minY - translateY;
                scale = document.documentElement.clientWidth / ((document.documentElement.clientWidth + over) * 2);
                translateY = transform.css(content, "translateY") + disPoint * scale;
            }

            //向上滑时的高度大于head的高度的一般时,head-bottom隐藏
            var head= document.querySelector("#wrap .head ");
            var headBottom = document.querySelector("#wrap .head .head-bottom ");
            var form = document.querySelector("#wrap .head .head-bottom > form");
            var headH=head.clientHeight;
            var th = transform.css(list, "translateY"); //元素移动距离
            if ((th < 0) && (Math.abs(th) > (headH / 2))) {
                headBottom.style.height = 0;
                headBottom.style.transition = "1s";
                headBottom.style.padding = 0;
                form.style.display = "none";
            } else if (th > 0){
                headBottom.style.height = 36+"px";
                headBottom.style.transition = "1s";
                headBottom.style.padding =5.5+"px";
                form.style.display = "block";
            }

            transform.css(content, "translateY", translateY);
            if (callBack && (typeof callBack["move"]).toLowerCase() === "function") {
                callBack["move"].call(list);
            }
        });
        wrap.addEventListener("touchend", function (ev) {
            ev = ev || event;
            if (!content.handMove) {
                fast(disPoint, disTime, content);
            } else {
                var translateY = transform.css(content, "translateY");

                if (translateY > 0) {
                    translateY = 0;
                }
                else if (translateY < minY) {
                    translateY = minY;
                }
                content.style.transition = "1s transform";
                transform.css(content, "translateY", translateY);
            }
            if (callBack && (typeof callBack["end"]).toLowerCase() === "function") {
                callBack["end"].call(list);
            }
        })

        var Tween = {
            Linear: function (t, b, c, d) {
                return c * t / d + b;
            },
            Back: function (t, b, c, d, s) {
                if (s == undefined) s = 1.70158;
                return c * ((t = t / d - 1) * t * ((s + 1) * t + s) + 1) + b;
            }
        }

        function fast(disPoint, disTime, content) {
            var speed = disPoint / disTime;
            var time = 0;
            speed = Math.abs(speed) < 0.3 ? 0 : speed;
            speed = speed > 15 ? 15 : speed;
            speed = speed < -15 ? -15 : speed;
            time = Math.abs(speed) * 0.2;
            time = time > 2 ? 2 : time;
            time = time < 0.4 ? 0.5 : time;
            var translateY = transform.css(content, "translateY");
            var targetY = translateY + speed * 100;
            var type = "Linear";
            //快速滑屏的橡皮筋效果
            if (targetY > 0) {
                targetY = 0;
                type = "Back";
            }
            else if (targetY < minY) {
                targetY = minY;
                type = "Back";
            }
            move(content, targetY, time, type);
        }

        function move(node, targetY, time, type) {
            clearInterval(timer);
            /*
                t: current time（当前是哪一次）；
                b: beginning value（初始值）；
                c: change in value（变化量）；
                d: duration（总共多少次）。
            */
            var t = 0;
            var b = transform.css(content, "translateY");
            var c = targetY - b;
            var d = (time * 1000) / (1000 / 60);
            var timer = setInterval(function () {
                t++;
                if (t > d) {
                    clearInterval(timer);
                    if (callBack && (typeof callBack["over"]).toLowerCase() === "function") {
                        callBack["over"].call(list);
                    }
                    return;
                }

                transform.css(node, "translateY", Tween[type](t, b, c, d));
                if (callBack && (typeof callBack["move"]).toLowerCase() === "function") {
                    callBack["move"].call(list);
                }
            }, 1000 / 60)
        }
    }

    verticalSliding.move = move;
})(window);

