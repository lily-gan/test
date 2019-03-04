;(function () {
    var wrap = document.querySelector(".tap-wrap");
    var contentNodes = document.querySelectorAll(".tap-wrap .tap-content");
    var loadings = document.querySelectorAll(".tap-wrap .tap-content .loading");
    //获取loading的高度
    setTimeout(function () {
        for (var i = 0; i < loadings; i++) {
            loadings[i].style.height = contentNodes[0].offsetHeight + "px";
        }
    }, 200);

    for (var i = 0; i < contentNodes.length; i++) {
        contentNodes[i].index = 0;
        move(contentNodes[i]);
    }

    function move(contentNode) {
        transform.css(contentNode, "translateX", -wrap.clientWidth);
        var elePoint = {x: 0, y: 0};
        var startPoint = {x: 0, y: 0};
        var isX = true;
        var isFirst = true;
        var dis = {x: 0, y: 0};
        contentNode.addEventListener("touchstart", function (ev) {
            if (contentNode.isJump) {
                return;
            }
            ev = ev || event;
            contentNode.style.transition = "";
            var touchC = ev.changedTouches[0];
            elePoint.x = transform.css(contentNode, "translateX");
            elePoint.y = transform.css(contentNode, "translateY");
            startPoint.x = touchC.clientX;
            startPoint.y = touchC.clientY;
            isX=true;
            isFirst=true;
        });
        contentNode.addEventListener("touchmove", function (ev) {
            if (contentNode.isJump) {
                return;
            }
            if (!isX) {
                return;
            }
            ev = ev || event;
            var touchC = ev.changedTouches[0];
            var nowPoint = {x: 0, y: 0};
            nowPoint.x = touchC.clientX;
            nowPoint.y = touchC.clientY;
            dis.x = nowPoint.x - startPoint.x;
            dis.y = nowPoint.y - startPoint.y;
            if (isFirst) {
                isFirst = false;
                if (Math.abs(dis.y) > Math.abs(dis.x)) {
                    isX = false;
                    return;
                }
            }
            transform.css(contentNode, "translateX", elePoint.x + dis.x);
            jump(dis.x, contentNode);
        })
        contentNode.addEventListener("touchend", function (ev) {
            if (contentNode.isJump) {
                return;
            }
            ev = ev || event;
            //如果滑动的距离大于wrap.clientWidth/2,就切换屏幕
            if (Math.abs(dis.x) <= wrap.clientWidth / 2) {
                contentNode.style.transition = "1s transform";
                transform.css(contentNode, "translateX", -wrap.clientWidth);
            }
        })
    }

    function jump(disX, contentNode) {
        if (Math.abs(disX) > wrap.clientWidth / 2) {
            contentNode.isJump = true;
            contentNode.style.transition = "1s transform";
            var translateX = disX > 0 ? 0 : -2 * wrap.clientWidth;
            transform.css(contentNode, "translateX", translateX);

            var loadings = contentNode.querySelectorAll(".loading");
            var smallG = contentNode.parentNode.querySelector(".tap-nav .smallG");
            var aNodes = contentNode.parentNode.querySelectorAll(".tap-nav a");

            contentNode.addEventListener("transitionend", end);

            function end() {
                //每一次添加过渡完成事件之前先移出前一次的事件
                contentNode.removeEventListener("transitionend", end);
                for (var i = 0; i < loadings.length; i++) {
                    loadings[i].style.opacity = 1;
                }

                //绿色指示条
                disX > 0 ? contentNode.index-- : contentNode.index++;
                if (contentNode.index < 0) {
                    contentNode.index = aNodes.length - 1;
                }
                else if (contentNode.index > aNodes.length - 1) {
                    contentNode.index = 0;
                }

                smallG.style.width = aNodes[contentNode.index].offsetWidth + "px";
                transform.css(smallG, "translateX", aNodes[contentNode.index].offsetLeft);

                //模拟发送ajax请求
                setTimeout(function () {
                    var arr=[
                        ["./img/a.jpg","./img/b.jpg","./img/c.jpg","./img/d.jpg","./img/e.jpg","./img/f.jpg"],
                        ["./img/2/a2.jpg","./img/2/b2.png","./img/2/c2.png","./img/2/d2.png","./img/2/e2.jpg","./img/2/f2.jpg"],
                        ["./img/a.jpg","./img/b.jpg","./img/c.jpg","./img/d.jpg","./img/e.jpg","./img/f.jpg"],
                        ["./img/2/a2.jpg","./img/2/b2.png","./img/2/c2.png","./img/2/d2.png","./img/2/e2.jpg","./img/2/f2.jpg"],
                        ["./img/a.jpg","./img/b.jpg","./img/c.jpg","./img/d.jpg","./img/e.jpg","./img/f.jpg"],
                        ["./img/2/a2.jpg","./img/2/b2.png","./img/2/c2.png","./img/2/d2.png","./img/2/e2.jpg","./img/2/f2.jpg"],
                    ]
                    var imgs = contentNode.querySelectorAll("img");
                    for (var i = 0; i < imgs.length; i++) {
                        imgs[i].src = arr[contentNode.index][i];
                    }

                    //将元素拉回来
                    contentNode.style.transition = "";
                    transform.css(contentNode, "translateX", -wrap.clientWidth);
                    contentNode.isJump = false;
                }, 1000)
            }
        }
    }
})();