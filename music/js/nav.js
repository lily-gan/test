;(function () {
    //滑屏区域
    var nav = document.querySelector("#wrap > .content div > .nav  ");
    //滑屏元素
    var list = document.querySelector("#wrap > .content div > .nav .list");

    //滚动元素的初始位置
    var eleStartX = 0;
    //手指的初始位置
    var fingerStartX = 0;

    //橡皮筋效果
    //可以滑动的最小距离
    var minX = nav.clientWidth - list.offsetWidth;
    //手指上一次的位置
    var lastLocation = 0;
    //上一次滑屏touchmove的时间
    var lastTime = 0;
    var disTime = 1;
    var disPoint = 0;

    nav.addEventListener("touchstart", function (ev) {
        ev = ev || event;
        list.style.transition = "none";

        var touchC = ev.changedTouches[0];

        //元素的初始位置
        eleStartX = transform.css(list, "translateX");

        //手指触屏的初始位置
        fingerStartX = touchC.clientX;
        //手指上一次的位置
        lastLocation = touchC.clientX;
        //时间
        lastTime = new Date().getTime();

        //解决速度的残留
        disTime = 1;
        disPoint = 0;
        list.handMove=false;
    });
    nav.addEventListener("touchmove", function (ev) {
        ev = ev || event;
        //手指
        var touchC = ev.changedTouches[0];
        //手指现在的位置
        var nowFingerX = touchC.clientX;
        //手指滑动的距离
        var fingerDis = nowFingerX - fingerStartX;
        var translateX = eleStartX + fingerDis;

        //手动橡皮筋效果
        var nowTime = new Date().getTime();
        disTime = nowTime - lastTime;
        disPoint = nowFingerX - lastLocation;
        lastLocation=nowFingerX;
        lastTime = nowTime;
        var scale = 0;
        //让手指每次滑动的有效距离越来越小
        if (translateX > 0) {
            list.handMove = true;
            scale = document.documentElement.clientWidth / ((document.documentElement.clientWidth + translateX) * 2);
            translateX = transform.css(list, "translateX") + disPoint * scale;
        } else if (translateX < minX) {
            list.handMove = true;
            var over = minX - translateX;
            scale = document.documentElement.clientWidth / ((document.documentElement.clientWidth + over) * 2);
            translateX = transform.css(list, "translateX") + disPoint * scale;
        }
        transform.css(list, "translateX", translateX);
    });
    nav.addEventListener("touchend", function (ev) {
        ev = ev || event;
        if (!list.handMove) {
            fast(disPoint,disTime,list);
        } else {
            var translateX = transform.css(list, "translateX");
            list.style.transition = "1s transform";
            if (translateX > 0) {
                translateX = 0;
            }
            else if (translateX < minX) {
                translateX = minX;
            }
            list.style.transition = "1s transform";
            transform.css(list, "translateX", translateX);
        }
    })

    function fast(disPoint, disTime, list) {
        var speed = disPoint / disTime;
        var time = 0;
        speed = Math.abs(speed) < 0.3 ? 0 : speed;
        time = Math.abs(speed) * 0.2;
        time = time > 2 ? 2 : time;
        time = time < 0.4 ? 0.5 : time;
        var translateX = transform.css(list, "translateX");
        var targetX = translateX + speed * 200;
        //快速滑屏的橡皮筋效果
        var bsr = "";  //利用贝塞尔曲线实现橡皮筋效果
        if (targetX > 0) {
            targetX = 0;
            bsr = "cubic-bezier(.09,1.51,.65,1.73)";
        }
        else if (targetX < minX) {
            targetX = minX;
            bsr = "cubic-bezier(.09,1.51,.65,1.73)";
        }
        list.style.transition = time + "s" + bsr + "transform";
        transform.css(list, "translateX", targetX);
    }

    //点击导航条改变背景颜色
    changeColor();
    function changeColor() {
        //滑屏区域
        var nav = document.querySelector("#wrap > .content div > .nav  ");
        //滑屏元素
        var list = document.querySelector("#wrap > .content div > .nav .list");
        var liNodes = document.querySelectorAll("#wrap > .content div > .nav .list li");
        nav.addEventListener("touchstart", function (ev) {
            ev = ev || event;
            nav.isMoved = false;
        })
        nav.addEventListener("touchmove", function (ev) {
            ev = ev || event;
            nav.isMoved = true;
        })
        list.addEventListener("touchend", function (ev) {
            ev = ev || event;
            if(!nav.isMoved){
                for(var i=0;i<liNodes.length;i++){
                    tools.removeClass(liNodes[i],"active");
                }
                if(ev.target.nodeName.toUpperCase()==="LI"){
                    tools.addClass(ev.target,"active");
                }
                if(ev.target.nodeName.toUpperCase()==="A"){
                    tools.addClass(ev.target.parentNode,"active");
                }
            }
        })
    }
})();