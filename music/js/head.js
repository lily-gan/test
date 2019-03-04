;(function () {
    var wrap= document.querySelector("#wrap");
    var btn = document.querySelector("#wrap .head .head-top .btn");
    var mask = document.querySelector("#wrap .head .mask");
    var input= document.querySelector("#wrap .head .head-bottom > form > input[type='text']");
    var isFlag=false; //false表示没有显示mask
    btn.addEventListener("touchstart", function (ev) {
        ev=ev||event;
        isFlag=!isFlag;
        if(isFlag){
            this.classList.add("active");
            mask.style.display="block";
        }else{
            this.classList.remove("active");
            mask.style.display="none";
        }
        ev.stopPropagation();
        ev.preventDefault();
    })
    wrap.addEventListener("touchstart",function (ev) {
        ev=ev||event;
        if(isFlag){
            mask.style.display="none";
            btn.classList.remove("active");
        }
        isFlag=!isFlag;
    })
    mask.addEventListener("touchstart",function (ev) {
        ev=ev||event;
        ev.stopPropagation();
        ev.preventDefault();

    })
    input.addEventListener("touchstart",function (ev) {
        ev=ev||event;
        this.focus();
        ev.stopPropagation();
        ev.preventDefault();
    })
    wrap.addEventListener("touchstart",function () {
        input.blur();
    })
})()