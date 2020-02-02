if (typeof console === "undefined" || console === null) {
    console = {
      log: function() {}
    };
  }

var APP = APP || {};

APP.register = function(ns_name){
    var parts = ns_name.split('.'),
    parent = APP;
    for(var i = 0; i < parts.length; i += 1){
        if(typeof parent[parts[i]] === "undefined"){
               parent[parts[i]] = {};
        }else {
            throw new Error( ( parts[ i - 1 ] || "MYAPP" ) + " 부모객체에 이미 " + parts[ i ] + " 객체가 존재합니다." );
        }

        parent = parent[parts[i]];
    }
    return parent;
};


APP.isAlphaTween = true;

var browser = navigator.userAgent;
if(browser.toLowerCase().indexOf("msie 8")>0 || browser.toLowerCase().indexOf("msie 7")>0 ){
    APP.isAlphaTween = false;
}

(function(ns, $,undefined){

    // 스크린체크
    ns.register('chkScreen');
    ns.chkScreen = function(){
        var _init = function() {
            chkScreen();
        };
        var chkScreen = function(){
            var winW = $(window).width();
            if(winW > 1700){
                $("body").removeClass("smallscreen").addClass("widescreen");
            }else{
                $("body").removeClass("widescreen").addClass("smallscreen");
            }
        };

        $(window).resize(chkScreen);

        return {
            init: _init
        }
    }();

    // 로고슬라이더
    ns.register('logoSlider');
    ns.logoSlider = function(){

        var _init;
        var $sel;
        var _isInitialized;
        var _ListManager;
        var _leng, _winWidth, _liWidth, _actId;
        var _initResize, _initSlider, _initListManager, _act;

        _init = function() {
            if( _isInitialized ) return;
            _isInitialized = true;

            $sel = {
                win: $( window ),
                ul: $( '.partner .slider' ),
                li: $( '.partner .slider>li' )
            };

            _leng = $sel.li.length;

            _initResize();
            _initSlider();
            _initListManager();
        };

        _initResize = function() {
            var resize;
            resize = function() {
                _winWidth = $sel.win.width();
                _act( _actId, 0 );
            };
            $sel.win.on( 'resize', resize );
            resize();
        };

        _initSlider = function() {
            var clone, leng;
            clone = function() {
                $sel.ul.append( $sel.li.clone() );
                leng = $sel.ul.children().length;
                if( leng < 22 ) clone();
            };
            clone();
            $sel.li = $sel.ul.find( '>li' );

            _liWidth = $sel.li.width();
            TweenLite.set( $sel.ul, { skewX: 0.001 } );
        };

        _initListManager = function() {
            _ListManager = dk.ListManager( _leng, function( id, oldId, direction ) { _act( id, oldId, 2 ); }, { autoPlay: true, autoPlaySpeed: 3 } );
        };


        _act = function( id, oldId, time ) {
            var posX, initX;
            _actId = id;
            if( id < 3 ) {
                id = id + _leng;
            }
            posX = parseInt( _winWidth / 2 - 1180 / 2 - _liWidth * id );
            initX = posX + _liWidth
            TweenLite.killTweensOf( $sel.ul );
            TweenLite.set( $sel.ul, { x: initX } );
            TweenLite.to( $sel.ul, time, { x: posX, ease: Power2.easeInOut } );

            if( id <= 3 ) {
                $sel.li.each( function( i ) {
                    var $this = $( this ),
                        leng = 7,
                        r;
                    if( i >= oldId - 2 && i <= oldId + leng ) {
                        r = Math.sin( Math.PI * ( i - oldId + 2 ) / ( oldId + leng - oldId + 2 ) ) * 0.9 + 0.1;
                        TweenLite.set( $this, { opacity: r } );
                    } else {
                        TweenLite.set( $this, { opacity: 0.1 } );
                    }
                } );
            }

            $sel.li.each( function( i ) {
                var $this = $( this ),
                    leng = 7,
                    r;
                if( i >= id - 2 && i <= id + leng ) {
                    r = Math.sin( Math.PI * ( i - id + 2 ) / ( id + leng - id + 2 ) ) * 0.9 + 0.1;
                    TweenLite.to( $this, time, { opacity: r, ease: Power2.easeInOut } );
                } else {
                    TweenLite.to( $this, time, { opacity: 0.1, ease: Power2.easeInOut } );
                }
            } );
        };        

        return {
            init: _init
        }
    }();

    // GNB
    ns.register('gnb');
    ns.gnb = function(){
        var element, depth2Bg, depth2ConArr, depth1TotalNum, viewDepth2 = false, depth1Arr, depth2Arr=[], depth2ConArr=[], reSetTimer;

        var _init = function(){
            var i, max;
            var pathName = location.pathname;
            var activeOk = false;
            var folderDir;

            element = $('.gnb_depth_1');
            depth2Bg = $('#navbg');
            depth1Arr = element.find('> li > a');
            depth1TotalNum = depth1Arr.length;
            depth2ConArr = $('.gnb_depth_2');
            depth2Arr = depth2ConArr.find('>li>a');           
            depth1Arr.each(function(index, item){
                $(item).attr('name', 'depth1_'+index);
            });

            depth1Arr.on('mouseenter focusin mouseleave focusout', depth1Handler);
            for(i = 0, max = depth2ConArr.length; i<max; i++){
                depth2Arr[i] =  $(depth2ConArr[i]).find('a');
                depth2Arr[i].on('mouseenter focusin mouseleave focusout', depth2Handler);
            }

            depth2ConArr.on('mouseenter mouseleave', depth2Handler);
            depth2Bg.on('mouseenter mouseleave', function(e) {
                switch ( e.type ) {
                    case 'mouseenter':
                       stopTimer();
                        break;
                    case 'mouseleave':
                       startTimer();
                        break;
                    }
            });
        };

        var depth1Handler = function(e){
            var num = e.currentTarget.getAttribute('name').substr(7,1);
            switch ( e.type ) {
                case 'mouseenter':
                case 'focusin':
                    stopTimer();
                    depth1Over(num);
                    TweenLite.to($("#header"), 0.3, {css:{className:'+=open'}});
                    break;
                case 'focusout':
                case 'mouseleave':
                    startTimer();
                    break;
            }
        };
        var depth1Over = function(num){
            for(var i = 0; i < depth1TotalNum; i++){
                if(num == i){
                    $(depth1Arr[num]).addClass('on');
                }else{
                    $(depth1Arr[i]).removeClass('on');
                }
            }

            if(!viewDepth2){
                TweenLite.to($("#wrap"), 0.3, {css:{className:'+=bkon'}});
                TweenLite.to(depth2Bg, 0.3, {css:{className:'+=on'}});
                // 2depth 있을경우 : TweenLite.to(depth2Bg, 0.5, {css:{height:170}, ease:Cubic.easeOut});
                depth2ConArr.fadeIn();
            }
            viewDepth2 = true;
        };
        var depth2Handler = function(e){
            var name = e.currentTarget.getAttribute('name');
            if(name != null){
                var num = name.substr(7,1);
            }

            switch ( e.type ) {
                case 'mouseenter':
                case 'focusin':
                    TweenLite.to($(e.currentTarget), 0.2, {css:{className:'+=on'}});
                    stopTimer();
                    depth1Over(num);
                    break;
                case 'focusout':
                case 'mouseleave':
                    TweenLite.to($(e.currentTarget), 0.2, {css:{className:'-=on'}});
                    startTimer();
                    break;
            }
        };
        var startTimer = function(){
            clearTimeout( reSetTimer );
            reSetTimer = setTimeout (reSetMenu, 500 );
        };
        var stopTimer = function(){
            clearTimeout( reSetTimer );
        };
        var reSetMenu = function(){
            depth1Over(null);
            TweenLite.to($("#wrap"), 0.3, {css:{className:'-=bkon'}});
            TweenLite.to(depth2Bg, 0.3, {css:{className:'-=on'}});
            TweenLite.to(depth2Bg, 0.5, {css:{height:0}, ease:Cubic.easeOut});
            TweenLite.to($("#header"), 0.3, {css:{className:'-=open'}});
            depth2ConArr.fadeOut();
            viewDepth2 = false;
        };
         return {
            init: _init
        }
    }();

    // Numbering
    ns.register("Numbering");
    ns.Numbering = function(){
        var $gnb;       
        var localNum1, localNum2, pathName, titleName;

        var _init = function () {
            $gnb = $("#gnb");
            pathName = location.pathname + location.search;

            $gnb.find(".gnb_depth_1>li").each(function (i) {
                var href = $(this).find(">a").attr("href");
                

                if (location.href.match(href)) {
                    localNum1 = i;
                } else {
                    var url = $(this).find('>a').data("url"),
                        urlArr = [];
                        
                    if (url != undefined) {
                        if (url.indexOf(",") > -1) {
                            for (var k = 0; k < url.split(",").length; k++) {
                                urlArr[k] = url.split(",")[k];
                            }
                        } else {
                            urlArr[0] = url;
                        }

                        for (var m = 0; m < urlArr.length; m++) {
                            if (pathName == urlArr[m]) {
                                localNum1 = i;
                            }
                        }
                    }
                }

                //메인만 예외
                if(pathName === "/" || pathName === "/index.php"){
                    $("body").addClass("main");
                    $("header").addClass("main");                   
                } else{
                    $("body").attr("data-page", "sub");
                }

                $(this).find('.gnb_depth_2>li').each(function (j) {
                    var href = $(this).find('>a').attr('href');

                    if (location.href.match(href)) {
                        localNum1 = i;
                        localNum2 = j;
                        titleName = $(this).find("a").text();
                    } else {
                        /*if($(this).find('>a').data("url") != undefined){
                            if(pathName.match($(this).find('>a').data("url"))){
                                localNum1 = i;
                                localNum2 = j;
                            }
                        }*/

                        var url = $(this).find('>a').data("url"),
                            urlArr = [];
                            
                        if (url != undefined) {
                            if (url.indexOf(",") > -1) {
                                for (var k = 0; k < url.split(",").length; k++) {
                                    urlArr[k] = url.split(",")[k];
                                }
                            } else {
                                urlArr[0] = url;
                            }

                            for (var m = 0; m < urlArr.length; m++) {
                                if (pathName == urlArr[m]) {
                                    localNum1 = i;
                                    localNum2 = j;
                                }
                            }
                        }
                        /*if (pathName == "/regist/regist_event.php") {
                           localNum1 = 4;
                           localNum2 = 0;
                           return false;
                        }*/
                        

                    }

                });
            });

            localNum1 = localNum1;
            localNum2 = localNum2;


            /*if ($("body").data("page") === "sub") {
                console.log("sub");
            } else {
            } */
            _settingEle(localNum1, localNum2);
            console.log(localNum1, localNum2);
        };

        var _settingEle = function (localNum1, localNum2) {
            var num1 = localNum1,
                num2 = localNum2;
            var $depth1Target = $gnb.find(".gnb_depth_1>li").eq(num1),
                $depth2Target = $depth1Target.find(".gnb_depth_2>li").eq(num2);
            var $titleH2 = $("#title");

            titleName = $depth2Target.find(">a").text();
            titleName_1 = $depth1Target.find(">a").text();
            


            if (num1 != undefined) {                
                $(".path_depth_1 span").text($depth1Target.find(">a").text());
                $depth1Target.addClass("on");
                _makeLocation(num1, num2);
            }
            if (num2 != undefined) {                              
                _makeLocation(num1, num2);
                $(".path_depth_2 span").text($depth2Target.find(">a").text());
                $depth1Target.find(".gnb_depth_2>li").eq(num2).find("a").addClass("current");
            }
            if (titleName != undefined) $titleH2.text(titleName);              
            
            //온천만 추가 
            if (num2 == undefined){
                $(".depthtxt strong").text(titleName_1);
                $titleH2.text(titleName_1); //depth2가 없을때 예외처리
            } else {                                 
                 $(".depthtxt").addClass("active");
                 $(".depthtxt strong").text(titleName_1);
                 $(".path_depth_2>a").text(titleName);
            }

            //title 세팅
            var $title = $("title"); 
            var $siteName = $title.text();
            var remoteH2 = $("#container").find("#title").text();            
            nowTit1 = $depth1Target.find(">a").text();
            nowTit2 = $depth2Target.find(">a").text();
          

            if (nowTit2.length > 0 && nowTit1.length > 0) {
                $("title").text($siteName +" | " + nowTit1 + " | " + nowTit2);
                if (nowTit2 != remoteH2) {
                    $("title").text($siteName +" | " + nowTit1 + " | " + nowTit2 + " | " + remoteH2);
                }
            } else if (nowTit2.length == 0 && nowTit1.length > 0) {
                $("title").text($siteName +" | " + nowTit1);
            } else {
                $("title").text($siteName);
            }

            //온천만 추가 
            $(".remote_list").hide();
            $("#depthtoggle").click(function(e){
                e.preventDefault();
                if($(this).hasClass("open")){
                    $(this).removeClass("open");
                    $(".remote_list").hide();
                }else{
                    $(this).addClass("open");
                    $(".remote_list").show();
                }
            });

        }

        var _makeLocation = function (num1, num2) {
            var $location = $(".location_nav");
            var $locDepth1 = $location.find(".path_depth_1"),
                $locDepth2 = $location.find(".path_depth_2");
            var html = "", html2;

            $gnb.find(".gnb_depth_1>li").each(function () {
                html += "<li>";
                html += $(this).find(">a")[0].outerHTML;
                html += "</li>";                                                
            });            
            html2 = $gnb.find(".gnb_depth_1>li").eq(num1).find(".gnb_depth_2>li").clone();
            $locDepth1.find("ul").html(html);            
            $locDepth2.find("ul").html(html2);
            
            //온천만 추가 
            $(".visual_nav").find(".remote_list").html(html2);
            $(".visual_nav").find(".remote_list>li").eq(num2).addClass("on");
            $locDepth1.find("ul>li").eq(num1).addClass("on");            
            $locDepth2.find("ul>li").eq(num2).addClass("on");

            
            
            

            /*$(document).on('click', '.path-item .btn-open', function() {
                var pathItem = $(this).closest('.path-item');
                $(pathItem).addClass('active').children('dd').slideDown();
                $(pathItem).siblings().removeClass('active').children('dd').slideUp();
                }).on('click', '.path-item .btn-close', function() {
                var pathItem = $(this).closest('.path-item');
                $(pathItem).removeClass('active').children('dd').slideUp();
                $('.btn-open', pathItem).focus();
                }).on('mouseup', function(e) {
                var pathList = $('.path-item.active');
                if(pathList.length){
                    var objPos = $(pathList).offset();
                    objPos.right = (objPos.left + $(pathList).width());
                    objPos.bottom = (objPos.top + $(pathList).height());
                    if( e.pageX < objPos.left || e.pageX > objPos.right || e.pageY < objPos.top || e.pageY > objPos.bottom ) {
                    $(pathList).removeClass('active').children('dd').slideUp();
                    $('.btn-open', pathList).focus();
                    }
                }
            });*/
        
            //etc
            if (num2 == undefined) $(".path_depth_2").remove();
            /*var currentUrl = document.location.href.split("/"),
                folderDir = currentUrl[3];                
                if (folderDir != 'pages') {
                    $(".path_depth_2").remove();
                }*/
        };

        var _linkLocation = function (num1, num2) {            
            var num1 = localNum1,
                num2 = localNum2;           
            var $title = $(".sub_title");
            var $h2 = $title.find("h2");
            var $depth0Li = $gnb.find(".gnb_depth_1>li");

            var txtD1 = $depth0Li.eq(num1).find("> a").text(); //1depth text
            var txtD2 = $depth0Li.eq(num1).find("li").eq( num2 ).find("> a").text(); //2depth text

            var $pagePrev = $title.find(".page_prev");
            var $pageNext = $title.find(".page_next");
            var $submenuLi = $depth0Li.eq( num1 ).find('.gnb_depth_2>li');

            // 2depth있을때
            var $prevDepth0Li = $submenuLi.eq( num2 - 1 );
            var $nextDepth0Li = $submenuLi.eq( num2 + 1 );

            // 1depth만있을때
            //var $prevDepth0Li = $depth0Li.eq( num1 - 1 );
            //var $nextDepth0Li = $depth0Li.eq( num1 + 1 );

            if( $nextDepth0Li.length == 0 ) $nextDepth0Li = $submenuLi.eq( 0 );
            
            var prevTxt = $prevDepth0Li.find("> a").text();
            var nextTxt = $nextDepth0Li.find("> a").text();
            var prevUrl = $prevDepth0Li.find("> a").prop("href");
            var nextUrl = $nextDepth0Li.find("> a").prop("href");
            
            if(num1 != -1){              
                 if(num2 != -1){
                 }else{                    
                    $pagePrev.text(prevTxt);
                    $pageNext.text(nextTxt);
                    $pagePrev.prop("href", prevUrl);
                    $pageNext.prop("href", nextUrl);
                    if(num1 == ($depth0Li.length - 1)){
                        $pageNext.text($depth0Li.eq(0).find("> a").text());
                        $pageNext.prop("href", $depth0Li.eq(0).find("> a").prop("href"));
                    }
                 }
            }

        };

       return {
            init: _init
        }
    }();

    ns.register('gnb_hor');        
    ns.gnb_hor = function(){
        var  element, headerCon, gnbg, depth1Arr, depth2ConArr, depth1TotalNum, depth2Arr=[], reSetTimer, setDepth1 = null, setDepth2 = null;               
        var _init = function(){  
            var i, max;
            element = $('nav>ul');
            headerCon = $('header');
            gnbg = $('#navbg')
            depth1Arr = element.find('> li > a');       
            depth1TotalNum = depth1Arr.length;    
            depth2ConArr = element.find('>li> ul');

            depth1Arr.each(function(index, item){
                $(item).attr('name', 'depth1_'+index);
                $(item).parent().find("ul>li>a").each(function(index){
                    $(this).attr('name', 'depth2_'+index);
                });
            });             

            depth1Arr.on('mouseenter focusin mouseleave focusout', depth1Handler);      
            for(i = 0, max = depth2ConArr.length; i<max; i++){        
                depth2Arr[i] =  $(depth2ConArr[i]).find('> li > a');                
                depth2Arr[i].on('mouseenter focusin mouseleave focusout', depth2Handler);                              
            }  

            //setDepth1 = headerCon.find('.gnb_depth_1>li.on').find(">a").attr('name').substr(7,1);
            //setDepth2 = headerCon.find('.gnb_depth_2>li.on').find(">a").attr('name').substr(7,1);            

            reSetMenu();   
        };
          
        var depth1Handler = function(e){           
            var num = e.currentTarget.getAttribute('name').substr(7,1);
            switch ( e.type ) {
                case 'mouseenter':                        
                case 'focusin':
                    stopTimer();
                    depth1Over(num); 
                    break;
                case 'focusout':
                case 'mouseleave':
                    startTimer();                    
                    break;    
            }
        };        
        
        var depth1Over = function(num){ 

            for(var i = 0; i < depth1TotalNum; i++){
                if(num == i){
                    $(depth1Arr[num]).addClass('on');
                }else{
                    $(depth1Arr[i]).removeClass('on');
                }
            }
            //if($(depth1Arr).hasClass('on'))return;
            viewDepth2(num);
        };  
        var viewDepth2 = function(num){            
            $(depth2ConArr).css({'display':'none'}); 
            if(num){
                if($(depth1Arr[num]).next("ul").length > 0){
                    //TweenLite.to($(gnbg), 0.3, {css:{height:47}}); 
                    $(depth2ConArr).css({'display':'none', 'opacity':0}); 
                    $(depth1Arr[num]).parent().find('>ul').css({'display':'block', 'opacity':1}); 
                             
                }else{
                    //TweenLite.to($(gnbg), 0.3, {css:{height:0}}); 
                }
            }else{
                //TweenLite.to($(gnbg), 0.3, {css:{height:0}}); 
            } 
        }

        var depth2Handler = function(e){            
            var num = $(e.currentTarget).parent().parent().parent().find(">a").attr('name').substr(7,1);
            switch ( e.type ) {
                case 'mouseenter':
                case 'focusin':  
                    TweenLite.to($(e.currentTarget), 0.2, {className:'+=on'});               
                    stopTimer();       
                    depth1Over(num);                                           
                break;                    
                case 'focusout':
                case 'mouseleave':
                    TweenLite.to($(e.currentTarget), 0.2, {className:'-=on'}); 
                    startTimer();
                break;
            }
        };
          
        var startTimer = function(){
            clearTimeout( reSetTimer );
            reSetTimer = setTimeout (reSetMenu, 1000);
        };        
        
        var stopTimer = function(){
            clearTimeout( reSetTimer );
        };      
        
        var reSetMenu = function(){                    
           $(depth2ConArr).css({'display':'none'});                        
           TweenLite.to(depth1Arr, 0.3, {className:'-=on'}); 
           TweenLite.to($(depth1Arr).find("a[name=depth1_"+setDepth1+"]"), 0.3, {className:'+=on'});
           if(setDepth2){
                //2depth 항상 오픈
                //viewDepth2(setDepth1)       
                //var $current = $("a[name=depth1_"+setDepth1+"]").parent().find(">ul>li>a[name=depth2_"+setDepth2+"]");               
                //$current.trigger('mouseenter');                               
            }else{
                TweenLite.to($(gnbg), 0.3, {css:{height:0}});    
            }            
                   
        };       
        
        return{
          init:_init
          
        };
    }();

    // 아코디언FAQ
    ns.register('faqAcMenu');
    ns.faqAcMenu = function(ele){

        var element, btn, isOpen=false, listArr;
        var i, max;

        element=ele;
        listArr = $(element).find('>li>dl');

        btn = $(listArr).find('>dt>a');
        btn.on('click', openList);

        function listHandler(e) {
            switch ( e.type ) {
                case 'mouseenter':
                case 'focusin':
                    break;
                case 'focusout':
                case 'mouseleave':
                    break;
            }
        }

       function openList(e){
            var parent = $(e.currentTarget).parent().parent()
            var viewCon = parent.find('>dd')
            if(parent.hasClass('on')){
                parent.removeClass('on');
                viewCon.css('display', 'none')
            }else{
                //listArr.removeClass('on');
                $(listArr).removeClass('on')
                $(listArr).find('>dd').css('display', 'none');
                parent.addClass('on');
                viewCon.css('display', 'block');
                TweenLite.from(viewCon, 0.3, {css:{opacity:0}});
            }

        }
    };



    // sideMenu
    ns.register('sideMenu');
    ns.sideMenu = function(){
        var _init = function() {
            var $sideMenu = $("#sideMenu");
            var mPos = parseInt($sideMenu.css('top'));            
            var $top = $("#goTop");

            $(window).scroll(function(e) {
                var scrollTop = $(window).scrollTop();
                var movePos = scrollTop + mPos + "px";

                TweenMax.to($sideMenu, .5, {top:movePos, ease:Power2.easeOut});
                
            }).scroll();

            $top.on("click", function(e){
                e.preventDefault();
                TweenMax.to($("body, html"), .8, {scrollTop:0, ease:Power2.easeOut});

            });


        };
        return {
            init: _init
        }
    }();



    // 패밀리사이트
    ns.register('familybox');
    ns.familybox = function(){
        var _init = function() {
            var $btn = $(".family_wrap").find(">a");
                $con = $(".family_wrap").find(".list_con");
            $btn.click(function(e){
                e.preventDefault();
                if($(this).hasClass("on")){
                    $(this).removeClass("on");
                    $con.fadeOut();
                    $con.focus();
                }else{
                    $(this).addClass("on");
                    $con.fadeIn();
                }
            });
        };
        return {
            init: _init
        }
    }();

    // 퀵링크효과
    ns.register('navHover');
    ns.navHover = function(){
        var _init = function() {
           var $btn = $(".quick_info li a");
           $btn.on('mouseenter focusin mouseleave focusout', function(e) {
            switch ( e.type ) {
                case 'mouseenter':
                case 'focusin':
                    TweenLite.to($(this), 0.5, {width:"180px", backgroundColor:"#2253b8", ease:Cubic.easeOut});
                    TweenLite.to($(this).find("span"), 0.7, {left:30, opacity:1, ease:Cubic.easeOut});
                    break;
                case 'mouseleave':
                case 'focusout':
                    TweenLite.to($(this).find("span"), 0.3, {left:0, opacity:0, ease:Cubic.easeOut});
                    TweenLite.to($(this), 0.5, {width:"60px", backgroundColor:"#343434", ease:Cubic.easeOut});
                    break;
                }
            });
        };
        return {
            init: _init
        }
    }();

    //상단전화체인지
    ns.register('subTopMotion');
    ns.subTopMotion = function(){
        var $bg, $title;
        var _init = function() {          
            $bg = $(".sub_top");
            $title = $(".sub_title").find("h2");            
            $subtit = $bg.find(".summary");
            tl = new TimelineLite();
            //tl.from($bg, .9, {autoAlpha:.5, "backgroundPositionY":70, ease:Power2.easeOut}, 0.2)
            tl.from($title, .6, {autoAlpha:0, y:50, ease:Power2.easeOut})
              .from($subtit, .6, {autoAlpha:0, y:50, ease:Power2.easeOut},"-=0.5");              
            tl.play();

            rightBanner();
        };

        var rightBanner = function(){ 
            var $List = $(".r_banner>li");

            $List.on('mouseenter mouseleave', function(e) {    
                e.preventDefault();                                       
                switch (e.type) { 
                case 'mouseenter':       
                    TweenMax.to($(this), 0.3, {className:'+=on'});                                                                                      
                    TweenMax.to($(this).find(".txt"), 0.3, {top:45, ease:Cubic.easeOut});               
                    TweenMax.to($(this).find(".ico"), 0.3, {autoAlpha:0, ease:Cubic.easeOut});
                    TweenMax.to($(this).find(".img"), 0.5, {scale:1.1, skewX:0.001, ease:Cubic.easeOut});
                    break;
                case 'mouseleave':    
                    TweenMax.to($(this), 0.3, {className:'-=on'});                                 
                    TweenMax.to($(this).find(".txt"), 0.3, {top:13, ease:Cubic.easeOut});
                    TweenMax.to($(this).find(".ico"), 0.3, {autoAlpha:1, ease:Cubic.easeOut});
                    TweenMax.to($(this).find(".img"), 0.5, {scale:1, skewX:0.001, ease:Cubic.easeOut});
                    break;
                }
            });

        }

        return {
            init: _init
        }
    }();


    ns.register('gateFunc');
    ns.gateFunc = function(){
        var _init = function() {              
            resize();
            visualFn();
        };        

        var visualFn = function(){ 
            var $conLeft, $conRight;           
            leady = true;                                        
            $conLeft = $(".left_con");
            $conRight = $(".right_con");

            TweenMax.set($conLeft.find(".over"), {autoAlpha: 0, x:100});
            TweenMax.set($conRight.find(".over"), {autoAlpha: 0, x:-100});

            $conLeft.on('mouseenter mouseleave', function(e) {                
                if(!leady) return;
                switch (e.type) {
                case 'mouseenter':                        
                    TweenMax.to($(this), 0.3, {className:'+=on'});                                                
                    TweenMax.to($(this).find(".over"), 0.5, {autoAlpha: 1, x:0, ease:Cubic.easeOut});               
                    break;
                case 'mouseleave':                                      
                    TweenMax.to($(this), 0.3, {className:'-=on'});    
                    TweenMax.to($(this).find(".over"), 0.5, {autoAlpha: 0, x:100, ease:Cubic.easeOut});
                    break;
                }
            });

            $conRight.on('mouseenter mouseleave', function(e) {                
                if(!leady) return;
                switch (e.type) {
                case 'mouseenter':                        
                    TweenMax.to($(this), 0.3, {className:'+=on'});                                                
                    TweenMax.to($(this).find(".over"), 0.5, {autoAlpha: 1, x:0, ease:Cubic.easeOut});               
                    break;
                case 'mouseleave':                                      
                    TweenMax.to($(this), 0.3, {className:'-=on'});    
                    TweenMax.to($(this).find(".over"), 0.5, {autoAlpha: 0, x:-100, ease:Cubic.easeOut});
                    break;
                }
            });
        }


        var resize = function(){
            var winW = $(window).width();
            var winH = $(window).height();
            var fH = $(".gate_footer").height();
            if(winH > 980){                
                $(".gate_con").height(winH-fH);
            }else{
                $(".gate_con").height("980px");                
            }
        };

        $(window).resize(resize);       
        
        return {
            init: _init
        }
    }();


    ns.register('premiumHover');
    ns.premiumHover = function(){
        var _init = function() {
           var $ele = $(".maincon_list .premium_con");
           $ele.on('mouseenter focusin mouseleave focusout', function(e) {            
            e.preventDefault();
            switch ( e.type ) {
                case 'mouseenter':
                case 'focusin':                    
                    //TweenMax.to($(this).find(".con_txt"), 0.5, {autoAlpha: 0, ease:Cubic.easeOut});                    
                    //TweenMax.to($(this).find(".over_txt"), 0.5, {autoAlpha: 1, ease:Cubic.easeOut});
                    //TweenMax.to($(this).find(".premium_off"), 0.5, {autoAlpha: 0, ease:Cubic.easeOut});                    
                    //TweenMax.to($(this).find(".premium_on"), 0.5, {autoAlpha: 1, scale:1.1, skewX:0.001, ease:Linear.easeOut}, "-=.5");
                    break;
                case 'focusout':
                case 'mouseleave':                    
                    //TweenMax.to($(this).find(".con_txt"), 0.5, {autoAlpha: 1, ease:Cubic.easeOut});
                    //TweenMax.to($(this).find(".over_txt"), 0.5, {autoAlpha: 0, ease:Cubic.easeOut});
                    //TweenMax.to($(this).find(".premium_on"), 0.5, {autoAlpha: 0, scale:1, ease:Linear.easeOut}, "-=.5");
                    //TweenMax.to($(this).find(".premium_off"), 0.5, {autoAlpha: 1, ease:Cubic.easeOut});                    
                    break;
                }
            });
        };
        return {
            init: _init
        }
    }();


    ns.register('mainvis');
    ns.mainvis = function(){
        var _init = function(){
            _visualBanner();
            _bannerLink();
            _lineHover();
            //_scrollClip();
            //_bannerLink();
            //_interiorSlide();
        };

        var _bannerLink = function() {
           var $btns = $(".premium_con");  
           var $boxs = $(".normal_con");  

           //TweenMax.set($(".con_over .more"), {opacity:0, y:50});           

           TweenMax.set($btns, {autoAlpha:0, rotationY:180});                  
           TweenMax.set($boxs, {autoAlpha:0, rotationY:180});                  
           t1 = new TimelineLite();
           t1.staggerTo($btns, 1.5, {autoAlpha:1, rotationY:0, ease:Power2.easeOut},0.3)          
           t1.play();

           intro = new TimelineLite();
           intro.staggerTo($boxs, 2, {autoAlpha:1, rotationY:0, ease:Power2.easeOut},0.3)          
           intro.play();


           $btns.on('mouseenter focusin mouseleave focusout', function(e) {
            switch ( e.type ) {
                case 'mouseenter':
                case 'focusin':                                            
                    TweenMax.to($(this).find("dt"), 0.5, {autoAlpha: 0, y:-50, ease:Cubic.easeOut});
                    TweenMax.to($(this).find("dd"), 0.5, {autoAlpha: 1, ease:Cubic.easeOut});
                    TweenMax.to($(this).find(".direct_btn .con_txt"), 0.5, {autoAlpha: 0, ease:Cubic.easeOut});
                    TweenMax.to($(this).find(".over_txt"), 0.5, {autoAlpha: 1, ease:Cubic.easeOut});
                    TweenLite.to($(this).find(".premium_on"), 2, {opacity:1, scale:1.2, skewX:0.001, ease:Cubic.easeOut});                    
                    TweenLite.to($(this).find("dl"), 0.3, {css:{className:'+=on'}});
                    //TweenLite.to($(this).find(".con_ori .more"), 0.5, {rotation:180, opacity:0, transformOrigin:"ceter ceter", ease:Cubic.easeOut}); 
                    break;
                case 'mouseleave':
                case 'focusout':                                                    
                    TweenLite.to($(this).find("dl"), 0.3, {css:{className:'-=on'}}); 
                    TweenMax.to($(this).find("dt"), 0.5, {autoAlpha: 1, y:0, ease:Cubic.easeOut});
                    TweenMax.to($(this).find("dd"), 0.5, {autoAlpha: 1, ease:Cubic.easeOut});                    
                    TweenMax.to($(this).find(".direct_btn .con_txt"), 0.5, {autoAlpha: 1, ease:Cubic.easeOut});
                    TweenMax.to($(this).find(".over_txt"), 0.5, {autoAlpha: 0, ease:Cubic.easeOut});                              
                    TweenLite.to($(this).find(".premium_on"), 0.5, {opacity:0, scale:1, skewX:0.001, ease:Cubic.easeOut});                                      
                    //TweenLite.to($(this).find(".con_ori .more"), 0.5, {rotation:0, opacity:1, transformOrigin:"ceter ceter", ease:Cubic.easeOut}); 
                    break;
                }
            });


           $(".location_con").on('mouseenter focusin mouseleave focusout', function(e) {
            switch ( e.type ) {
                case 'mouseenter':
                case 'focusin':                                                               
                    TweenLite.to($(this).find(".bg"), 2, {scale:1.2, skewX:0.001, ease:Cubic.easeOut});                                        
                    break;
                case 'mouseleave':
                case 'focusout':                                                                                
                    TweenLite.to($(this).find(".bg"), 0.5, {scale:1, skewX:0.001, ease:Cubic.easeOut}); 
                    break;
                }
            });

        };

        var _visualBanner = function(){
            var $con = $(".first_banner");
             TweenMax.set($con.find(".bg"), {scale:1.8, autoAlpha:.2});                  
             TweenMax.set($con.find(".tobj_1"), {y:80, autoAlpha:0});
             TweenMax.set($con.find(".tobj_2"), {y:80, autoAlpha:0});
             TweenMax.set($con.find(".tobj_3"), {y:80, autoAlpha:0});             

             var tl1 = new TimelineMax({onComplete:evtBanner}); //delay:.5      
                tl1.to($con.find(".bg"), 4,{scale:1, skewX:0.001, autoAlpha:1,  ease:Cubic.easeOut})
                   .to($con.find(".tobj_1"), 1,{autoAlpha:1, y:0, ease:Power2.easeOut}, "-=3")  
                   .to($con.find(".tobj_2"), 1,{autoAlpha:1, y:0, ease:Power2.easeOut}, "-=2.5") 
                   .to($con.find(".tobj_3"), 1,{autoAlpha:1, y:0, ease:Power2.easeOut}, "-=1.8");
                tl1.play();

                var max_number = 2019;

                var padding_zeros = '';
                  for(var i = 0, l = max_number.toString().length; i < l; i++) {
                    padding_zeros += '0';
                }

                var padded_now, numberStep = function(now, tween) {
                    var target = $(tween.elem),
                        rounded_now = Math.round(now);

                    var rounded_now_string = rounded_now.toString()
                    padded_now = padding_zeros + rounded_now_string;
                    padded_now = padded_now.substring(rounded_now_string.length);

                    target.prop('number', rounded_now).text(padded_now);
                };

              function numberCount(){
                $('#year').animateNumber({
                  number: max_number,
                  numberStep: numberStep
                }, 3000);
                
                $('#month').prop('number', 0).animateNumber({
                    number: 12,
                    easing: 'easeInQuad'            
                }, 3000);
              }
            numberCount(); 

            function evtBanner(){               
                TweenMax.to($(".event_banner"), 1, {marginTop:0, ease:Cubic.easeOut});
            } 

        }

        var _lineHover = function(){
            $box = $(".inner-list-2").find(".regist_btn");
            $box.on('mouseenter mouseleave focusin focusout', function(e) {
                switch ( e.type ) {
                    case 'mouseenter':                        
                    case 'focusin':                                                                                             
                         TweenMax.to($(this).parent(), .5, {css:{"backgroundColor":"#685195"}, ease:"Power2.easeInOut"});
                         TweenMax.to($(this).find('.line_top'), .5, {css:{"autoAlpha":1, "width":"100%"}, ease:"Power2.easeInOut"});
                         TweenMax.to($(this).find('.line_left'), .5, {css:{"autoAlpha":1, "height":"100%"}, ease:"Power2.easeInOut"});
                         TweenMax.to($(this).find('.line_right'), .5, {css:{"autoAlpha":1, "height":"100%"}, ease:"Power2.easeInOut"});
                         TweenMax.to($(this).find('.line_bottom'), .5, {css:{"autoAlpha":1, "width":"100%"}, ease:"Power2.easeInOut"});
                        break;
                    case 'focusout':
                    case 'mouseleave':                        
                        TweenMax.to($(this).parent(), .5, {css:{"backgroundColor":"#856abb"}, ease:"Power2.easeInOut"});
                         TweenMax.to($(this).find('.line_top'), .5, {css:{"autoAlpha":0, "width":"0"}, ease:"Power2.easeInOut"});
                         TweenMax.to($(this).find('.line_left'), .5, {css:{"autoAlpha":0, "height":"0"}, ease:"Power2.easeInOut"});
                         TweenMax.to($(this).find('.line_right'), .5, {css:{"autoAlpha":0, "height":"0"}, ease:"Power2.easeInOut"});
                         TweenMax.to($(this).find('.line_bottom'), .5, {css:{"autoAlpha":0, "width":"0"}, ease:"Power2.easeInOut"});
                        break;    
                }
            });
        }



        var _interiorSlide = function(){            
            var $interSlide =$("#interSlide");
             $interSlide.slick({
                slidesToShow: 1,
                arrows:false,
                dots:true,
                infinite: true,
                centerMode: false,
                autoplay:false,      
                autoplaySpeed:1000,    
                speed: 1000,      
                variableWidth: true,
                customPaging: function(slider, i) {   
                    var inum = i+1;
                    return '<a href="javascript:;">' + inum + '</a>';
                },
                cssEase: 'cubic-bezier(.12,.56,.45,.88)'
            });

            
            $(".tab_con_wrap>div").each(function(index) {
                $(this).attr("data-con",index);                
            });

            $("ul.community_tab>li>a").each(function(index) {
                $(this).attr("data-tab",index);
                    }).click(function() {
                   var index = $(this).attr("data-tab");
                   $interSlide.slick('slickGoTo', index);    
                   return false;
            });


            $interSlide.on("beforeChange", function(event, slick, currentSlide, nextSlide){
                innerLayer(nextSlide);
            });

            function innerLayer(num){                
                $("ul.community_tab>li>a[data-tab!="+num+"]").removeClass("on");
                $("ul.community_tab>li>a[data-tab="+num+"]").addClass("on");
                $(".tab_con_wrap>div[data-con!="+num+"]").hide();
                $(".tab_con_wrap>div[data-con="+num+"]").fadeIn();                
            };

        }

        var _mainVisual = function(){
            var $visualcon, $copy1, $copy2, $copy3;
            var $mainVisual = $(".visual_slide");
            var wHeight = $(window).height();
            
            function resizeVis(){
                $mainVisual.find(".img").css("height", wHeight-98 + "px");
            }
            resizeVis();
            $(window).resize(resizeVis);            

            /*$mainVisual.on("init reInit afterChange", function (event, slick, currentSlide, nextSlide) {
                var $paging = $('.page_info');
                var i = (currentSlide ? currentSlide : 0) + 1;
                $paging.html('<li><a href="javascript:;">'+i+'</a></li>');
            });*/


            $mainVisual.on("init", function(slick){
                _bgMotion(0);
            });

            $mainVisual.slick({
                fade:true,
                slidesToShow:1,
                slidesToScroll:1,
                arrows:false,
                dots:true,
                customPaging: function(slider, i) {   
                    var inum = i+1;
                    return '<a href="javascript:;">' +'0'+ inum + '</a>';
                },
                infinite: true,
                autoplay:true,
                autoplaySpeed:6000,
                draggable:false,
                speed:1000,
                zIndex:10,
                pauseOnHover:false
            });

            $mainVisual.on("beforeChange", function(event, slick, currentSlide, nextSlide){
                _bgMotion(nextSlide);
            });


            function _bgMotion(num){

                var $nextLi = $mainVisual.find(".slick-slide").eq(num);

                TweenMax.set($nextLi.find(".img"), {autoAlpha:.5, scale:1.1, skewX:0.001});                
                TweenMax.set($nextLi.find(".t_obj_1"), {autoAlpha:0, x:-60});
                TweenMax.set($nextLi.find(".t_obj_2"), {autoAlpha:0, x:-60});
                TweenMax.set($nextLi.find(".t_obj_3"), {autoAlpha:0, y:150});

                TweenMax.to($nextLi.find(".img"), 2, {autoAlpha:1, ease:Cubic.easeOut});
                TweenMax.to($nextLi.find(".img"), 7, {scale:1.01, ease:Linear.easeNone});

                var tl1 = new TimelineMax({paused:true});                   
                tl1.to($nextLi.find(".t_obj_1"), 1,{delay:0.3, autoAlpha:1, x:0, ease:Power2.easeOut})  
                   .to($nextLi.find(".t_obj_2"), 1.2,{autoAlpha:1, x:0, ease:Power2.easeOut}, "-=0.3") 
                   .to($nextLi.find(".t_obj_3"), 1.5,{autoAlpha:1, y:0, ease:Power2.easeOut}, "-=0.7") 
                tl1.play();
            };

        };

        var _scrollClip = function(){
           var sTop = 0;
           var m_group = [$('.mcon_1'), $('.mcon_2'), $('.mcon_3'), $('.mcon_4'), $('.mcon_5')];           
           var t1, t2, t3, t4, t5;
           var mog;

           TweenMax.set($(m_group[0]).find('li'), {autoAlpha:0, y:100});
           TweenMax.set($(m_group[1]).find('li'), {autoAlpha:0, y:100});                      


            t1 = new TimelineLite();
            t1.staggerTo($(m_group[0]).find('li'), .9, {autoAlpha:1, y:0, ease:Power2.easeOut}, 0.2);             
            t1.pause();

            t2 = new TimelineLite();
            t2.from($(m_group[1]).find('.left_con'), 1, {x:-100, autoAlpha: 0, ease:Cubic.easeOut}) 
              .from($(m_group[1]).find('.right_con'), 1, {x:100, autoAlpha:1, ease:Power2.easeOut}, "-=1");   
            t2.pause();

            t3 = new TimelineLite();
            t3.from($(m_group[2]).find('.tit'), .7, {y:100, autoAlpha: 0, ease:Cubic.easeOut}) 
              .from($(m_group[2]).find('.hor_txt'), .9, {x:100, autoAlpha: 0, ease:Cubic.easeOut}, "-=.5") 
              .from($(m_group[2]).find('.left_con'), 1, {y:180, autoAlpha: 0, ease:Cubic.easeOut},"-=.8")
              .from($(m_group[2]).find('.right_con'), 1, {x:180, autoAlpha: 0, ease:Cubic.easeOut},"-=1");
            t3.pause();

            t4 = new TimelineLite();
            t4.from($(m_group[3]).find('.tit'), .7, {y:100, autoAlpha: 0, ease:Cubic.easeOut}) 
              .from($(m_group[3]).find('.ui_tabcontents'), 1, {autoAlpha:0, y:100, ease:Power2.easeOut},"-=.2");   
            t4.pause();

            t5 = new TimelineLite();
            t5.from($(m_group[4]).find('.location_img>dt'), 1, {x:-100, autoAlpha: 0, ease:Cubic.easeOut}) 
              .from($(m_group[4]).find('.location_img>dd'), 1, {x:100, autoAlpha:1, ease:Power2.easeOut}, "-=1");
            t5.pause();


            mog = [t1, t2, t3, t4, t5];

            function scroll(){
                sTop = $(window).scrollTop() + ($(window).height()/2)+150;
                  for(var i = 0; i < m_group.length; i++){
                    if($(m_group[i]).offset().top < sTop){
                      mog[i].play();
                      m_group.splice(i, 1);
                      mog.splice(i, 1);                                          
                    }                   
                  }                       
            };

            $(window).scroll(function(e) {
                scroll();
            });
           scroll();
        }    

        return{
            init:_init            
        };
    }(); 

    // Slick 갤러리스타일
    ns.register('shopGallery');
    ns.shopGallery = function(){
        var _init = function(selector) {
            var $ele = $(selector);
            $ele.slick({
                slidesToShow: 4,
                slidesToScroll: 1,
                dots: false,
                arrows: false,
                centerMode: false,
                focusOnSelect: true
            });

            $('#slidePrev').on('click', function(){
                $ele.slick('slickPrev');
            });

            $('#slideNext').on('click', function(){
                $ele.slick('slickNext');
            });
        };
        return {
            init: _init
        }
    }();

    ns.register('mainfunc');        
    ns.mainfunc = function(){
       
        var _init = function(){           
            visSlide();            
        }; 

        var visSlide = function(){
            var $mainSlide = $(".visual_slide");
            $mainSlide.on("init", function(slick){
                _bgMotion(0);
            });

            $mainSlide.slick({ 
                fade: true,                                 
                infinite: true,
                autoplay: true,
                arrows: false,
                prevArrow: "<a href='javascript:;' class='slick-prev'><span class='hidden'>prev</span></a>",
                nextArrow: "<a href='javascript:;' class='slick-next'><span class='hidden'>next</span></a>",
                draggable: true,
                autoplaySpeed: 4000,
                speed: 1500,
                dots:true,
                    customPaging: function(slider, i) {   
                        var inum = i+1;
                        return '<a href="javascript:;">' +'0'+ inum + '</a>';
                    },
                pauseOnHover: false,
                pauseOnFocus: false,
                focusOnSelect: false
            });

            $mainSlide.on("beforeChange", function(event, slick, currentSlide, nextSlide){
               _bgMotion(nextSlide);
            });

            $mainSlide.on("beforeChange", function(event, slick, currentSlide, nextSlide){           
                //$("#currentNum").text(nextSlide+1);
            });

            function _bgMotion(num){
                var $nextLi = $mainSlide.find(".slick-slide").eq(num);             
                TweenMax.set($nextLi.find(".obj_1"), {autoAlpha:0, y:60});
                TweenMax.set($nextLi.find(".obj_2"), {autoAlpha:0, y:60});                                        
                TweenMax.set($nextLi.find(".obj_3"), {autoAlpha:0, y:60}); 
                TweenMax.to($nextLi.find(".obj_1"), 0.8, {delay:.2, autoAlpha:1, y:0, ease:Power2.easeOut});
                TweenMax.to($nextLi.find(".obj_2"), 0.8, {delay:.4, autoAlpha:1, y:0, ease:Power2.easeOut});            
                TweenMax.to($nextLi.find(".obj_3"), 0.8, {delay:.8, autoAlpha:1, y:0, ease:Power2.easeOut});            
            };
        }  

        var intro_motion = function(){
        }

        var intro_end = function(){ 
            TweenMax.delayedCall(.1, mainSet);            
        }

        var mainSet = function() { 
            $("body").css("overflow", "inherit");
            TweenMax.to($("#header"), .8, {autoAlpha:1, y:0, ease:Power2.easeOut});
            TweenMax.to($("#sideMenu"), .8, {autoAlpha:1, x:0, ease:Power2.easeOut},"-=.8");
            TweenMax.to($(".scroll_label"), .8, {autoAlpha:1,ease:Power2.easeOut},"-=.8");
        }

        var text_motion = function() {
        }

        return{
            init:_init            
        };
    }(); 




    // 메인 팝업 모듈
    ns.register('popup');
    ns.popup = function(){
        var $popup, $popupList;

        var getCookie = function(name){
            var nameOfCookie = name + "=";
            var x = 0;
            while ( x <= document.cookie.length )
            {
                var y = (x+nameOfCookie.length);
                if ( document.cookie.substring( x, y ) == nameOfCookie ) {
                    if ( (endOfCookie=document.cookie.indexOf( ";", y )) == -1 )
                        endOfCookie = document.cookie.length;
                    return unescape( document.cookie.substring( y, endOfCookie ) );
                }
                x = document.cookie.indexOf( " ", x ) + 1;
                if ( x == 0 )
                    break;
            }
            return "";
        };

        var setCookie = function(name, value, expiredays){
            var todayDate = new Date();
            todayDate.setDate( todayDate.getDate() + expiredays );
            document.cookie = name + "=" + escape( value ) + "; path=/; expires=" + todayDate.toGMTString() + ";"
        };

        var closeCookie = function(layerId){
            var i = layerId.split("pop")[1];

            if ( document.getElementById("chkPop"+i).checked ) {
                setCookie( layerId, "checked" ,1 );
                console.log(layerId);
            }
            $("#"+layerId).css("display", "none");
        };

        var _init = function(){
            var $popup = $(".main_popup");
            var $popupList = $("#popList");
            var $nmpop = $(".nmpop");
            var $nmpopleft = $(".nmpop").data("pos");
            //$nmpop.css({marginLeft : Math.floor(978-$nmpopleft)}); 

            $popup.css("display", "block");
            $popup.each(function(i){
                if(getCookie("pop"+i) != "checked"){
                    $("#pop"+i).css("display", "block");
                }else{
                    $("#pop"+i).css("display", "none");                    
                }
            });

            $popup.find(".today a").on("click", function(e){
                e.preventDefault();
                var layerId = $(this).parent().parent().attr("id");
                closeCookie(layerId);
            });

            $popup.find(".popclose").on("click", function(e){
                e.preventDefault();                
                $(this).parent().hide();               
            });           

            popSlide();
        };

        var popSlide = function(){
            var $popup_slide = $(".popup_slide");

            $popup_slide.slick({
                fade: false,
                infinite: true,
                autoplay: true,
                arrows: false,
                draggable: true,
                autoplaySpeed: 3000,
                speed: 300,
                dots:true,
                    customPaging: function(slider, i) {
                        var inum = i+1;
                        return '<a href="javascript:;">' +'0'+ inum + '</a>';
                    },
                pauseOnHover: false,
                pauseOnFocus: false,
                focusOnSelect: false
            });
        }


        
        return {
            init:_init
        }
    }();
    
    // Tab UI 타겟 href 타입
    ns.register('tab');
    ns.tab = function(){
        var _init = function(ele){
            var $this = ele;
            var prev;

            $this.find("li>a").click(function(e){
                e.preventDefault();
                var $this = $(this);
                var $target = $(this).attr("href");

                if($($target).find(">ul").length > 0 ){
                   $($target).find(">ul>li:nth-child(1)>a").trigger("click");                                     
                 }

                if(prev){
                    prev.parent().removeClass("on");
                    TweenMax.set($(prev.attr("href")), {"opacity":0, "display":"none"});

                }
                $(this).parent().addClass("on");
                TweenMax.set($($this.attr("href")), {"display":"block"});
                TweenMax.to($($this.attr("href")), 0.8, {"opacity":1});

                prev = $this;
            });

            $this.find(">li:nth-child(1)>a").trigger("click");
        };

        return {
            init: _init
        }
    }();

    // Tab UI 배열타입
    ns.register('ui.tabMenu');
    ns.ui.tabMenu = function(ele, targetEle){
        var element, targetElement, tNum=0, tabContainer, tabBtn, tabBtnCon, contentsArr, totalTabNum;
        element = ele;
        targetElement = targetEle;
        tabBtn = element.find(">li:not(.deactive)");
        tabBtnCon = element.find(">li");
        totalTabNum = tabBtn.length;
        contentsArr= targetElement.find(">li");
        tabBtn.each(function(index, item){
            $(item).attr('name', 'tab_'+index);

        });
        tabBtn.on('mouseenter focusin mouseleave focusout click', tabHandler);

        function tabHandler(e){
            var num = e.currentTarget.getAttribute('name').substr(4,1);
            if(tNum == num)return;

            switch ( e.type ) {
                case 'mouseenter':
                case 'focusin':
                   // tabOver(num);
                    break;
                case 'focusout':
                case 'mouseleave':
                  //  tabOver(tNum);
                    break;
               case 'click':
                    tabSelect(num);
                    break;
            }
        };

        function tabOver(num){
            for(var i = 0; i<totalTabNum; i++){
                if(i== num){
                    TweenLite.to($(tabBtn[num]), 0, {className:'+=on'});
                    TweenLite.to($(tabBtnCon[num]), 0, {className:'+=on'});
                }else{
                    TweenLite.to($(tabBtn[i]), 0, {className:'-=on'});
                    TweenLite.to($(tabBtnCon[i]), 0, {className:'-=on'});
                }
            }

        };

        function tabSelect(num){
            tabOver(num)
            tNum = num;
            $(contentsArr[num]).siblings().removeClass('current');
            $(contentsArr[num]).addClass('current')
        }
        tabOver(tNum);
        tabSelect(tNum)
    };

    // ajaxTab 
    ns.register('ajaxTab');
    ns.ajaxTab = function(){
        var _init = function(ele){
            var $this = ele;
            var prev;

            $this.find("a").click(function(e){
                e.preventDefault();
                var $this = $(this);
                var loadURL = $(this).attr("data-load-url");

                if(prev){
                    prev.parent().removeClass("on");
                }

                $(this).parent().addClass("on");
                _loadData(loadURL);

                prev = $this;

            });

            $this.find("li:nth-child(1) a").trigger("click");

        };

        var _loadData = function(loadURL){
            var $viewCon = $(".type_tab_con");

             TweenMax.set($viewCon, {"display":"block"});

            $.ajax({
                url:loadURL+".asp",
                method: 'GET',
                cache: false,
                success:function(data){
                    $viewCon.empty().append(data);
                },
                error:function(xhr, status, error){
                }
            });
        };

        return {
            init: _init
        }
    }();

    // paramTab
    ns.register('paramTab');
    ns.paramTab = function(){

        var _init = function(ele){
            var $this = ele;

            function getUrlParameter(sParam) {
                var sPageURL = decodeURIComponent(window.location.search.substring(1)),
                    sURLVariables = sPageURL.split('&'),
                    sParameterName,
                    i;

                for (i = 0; i < sURLVariables.length; i++) {
                    sParameterName = sURLVariables[i].split('=');

                    if (sParameterName[0] === sParam) {
                        return sParameterName[1] === undefined ? true : sParameterName[1];
                    }
                }
            };
            var sParam = getUrlParameter('tab');
            $(".type_tab_con").not('#'+sParam).css("display", "none");
            $("#"+sParam).fadeIn();
            $this.find("."+sParam).addClass('on');
        };
        return {
            init: _init
        }
    }();

    // selecttype
    ns.register('selectbox');
    ns.selectbox = function(){
        var _init = function(ele) {
            var $ele = $(ele);
            var $btn = $ele.find('>a');
            var $list = $ele.find('>div');
            $btn.click(function(e){
                e.preventDefault();
                if($(this).hasClass("open")){
                    $(this).removeClass("open");
                    $list.hide();
                }else{
                    $(this).addClass("open");
                    $list.show();
                }
            });
        };
        return {
            init: _init
        }
    }();

    // placeholder
    ns.register('placeholder');
    ns.placeholder = function(){
        var _init = function() {
          var $placeholder = $("body").find('.placeholder'),
            $inTxt = $placeholder.find('input, textarea');
            $inTxt.each(function () {
                if ($(this).val() != '') {
                    $(this).addClass('focus');
                };
            });

            $inTxt.on('focusin', function () {
                $(this).addClass('focus');
            });

            $inTxt.on('focusout', function () {
                if ($(this).val() === '') {
                    $(this).removeClass('focus');
                } else {
                    $(this).addClass('focus');
                }
            });

            $placeholder.on('click', function () {
                $(this).find('input').focus();
            });
        };
        return {
            init: _init
        }
    }();

    // 셀렉트박스 ie만 예외 처리
    ns.register('selectie');
    ns.selectie = function(){
        var _init = function() {
            if ((navigator.userAgent.indexOf("MSIE") != -1) || (!!document.documentMode == true)) {
                $("body").find(".select-wrapper").addClass("iestyle");
            }
        };
        return {
            init: _init
        }
    }();

    // datePicker
    ns.register('datePicker');
    ns.datePicker = function(){
        var _init = function(inputId) {
            $(inputId).datepicker({
                showOn: "both", // focus / button / both
                dayNamesMin: ["일", "월", "화", "수", "목", "금", "토"],
                monthNames:[ "1월", "2월", "3월", "4월", "5월", "6월", "7월", "8월", "9월", "10월", "11월", "12월" ],
                monthNamesShort: ["1월","2월","3월","4월","5월","6월", "7월","8월","9월","10월","11월","12월"],
                buttonText: "<i class='fa fa-calendar'></i>",
                dateFormat: "yy-mm-dd",
                changeMonth: true,
                changeYear: true,
                yearRange: "1960:+nn",
                isRTL: false,
                yearSuffix: '',
                firstDay: 0

                //yearRange: '0+50'
            });
        };
        return {
            init: _init
        }
    }();

    // fileStyle
    ns.register('fileStyle');
    ns.fileStyle = function(){
        var _init = function() {
            var fileTarget = $('.filebox .upload-hidden');
                fileTarget.on('change', function () { // 값이 변경되면
                    if (window.FileReader) { // modern browser
                        var filename = $(this)[0].files[0].name;
                    } else { // old IE var
                        filename = $(this).val().split('/').pop().split('\\').pop(); // 파일명만 추출
                    }
                    // 추출한 파일명 삽입
                    $(this).siblings('.upload-name').val(filename);
                });
        };
        return {
            init: _init
        }
    }();

    // 공통 링크효과
    ns.register('linkHover');
    ns.linkHover = function(){
        var _init = function(ele) {
           var $ele = $(ele);
           $ele.on('mouseenter focusin mouseleave focusout', function(e) {
            switch ( e.type ) {
                case 'mouseenter':
                case 'focusin':
                    $(this).addClass("hover");
                    break;
                case 'focusout':
                case 'mouseleave':
                    $(this).removeClass("hover");
                    break;
                }
            });
        };
        return {
            init: _init
        }
    }();

    // selectUpBox 스타일 모듈
    ns.register('selectUpBox');
    ns.selectUpBox = function(ele){

        var element, btn, isOpen=false, listCon, listHeight, closeTimer, listWrap;
        var i, max;

        element=ele;
        listWrap = $(element).find('div');
        listCon = listWrap.find('ul');
        btn = $(element).find('>a');
        $(element).find('>a').on('mouseenter focusin mouseleave focusout', listHandler);
        $(element).find('>a').on('click', openList);
        listHeight = $(listCon).outerHeight(true)
        listWrap.css('height', 0)
        listCon.find('li>a').on('mouseenter focusin mouseleave focusout', listHandler);
        listCon.css('display', 'none');
        listCon.css('top', listHeight);
        function listHandler(e) {
            switch ( e.type ) {
                //case 'mouseenter':
                case 'focusin':
                    stopTimer();
                    break;
                case 'focusout':
                //case 'mouseleave':
                    startTimer();
                    break;
            }
        }
        function startTimer(){
            clearTimeout( closeTimer );
            closeTimer = setTimeout (close, 700 );
        };
        function stopTimer(){
            clearTimeout( closeTimer );
        };
        function close(){
            isOpen=true;
            openList()
        };

        function openList(){
            listHeight = $(listCon).outerHeight(true);
            if(isOpen){
                isOpen = false;
                listWrap.css('height', 0);
                listCon.css('display', 'none');
                $(btn).removeClass('on');
                TweenLite.to(listCon, 0, {css:{top:listHeight}});
            }else{
                isOpen = true;
                listWrap.css('height', listHeight);
                listCon.css('display', 'block');
                $(btn).addClass('on');
                TweenLite.to(listCon, 0.3, {css:{top:0}});
            }
        }
    };
   

}(APP || {}, jQuery));

/* 맨위로 */
function GoTop() {
    TweenMax.to($('body, html'), 0.5, {scrollTop:0, ease:"Cubic.easeOut"});
}

/* 레이어팝업 */
var LayerPopups = {
    find: function (id) {
        if (typeof (id) === 'string')
            return $((id.match(/^#/)) ? id : '#' + id);
        else
            return $(id).parents('.layerPopup');
    },
    open: function (id, closeOthers) {
        var $id = this.find(id);
        if ($id.length == 0)
            return;
        //$("html, body").stop().animate({scrollTop:(thisPos.top)-600}, 400);

        //if (id == "danziPop") {
        //    GoTop();
        //}

        this.showScreen();
        if (closeOthers) {
            $('.layerPopup').each(function () {
                if (this.id == $id[0].id)
                    $(this).show();
                else
                    $(this).hide();
            });
        }
        else {
            $id.show();
        }
    },
    close: function (id) {
        this.find(id).hide();
        this.hideScreen();
    },
    closeAll: function () {
        $('.layerPopup').hide();
        this.hideScreen();
    },
    opened: function () {
        var opened = false;
        $('.layerPopup').each(function () {
            if ($(this).css('display') != 'none')
                opened = true;
        });
        return opened;
    },
    showScreen: function () {
        $('#layerScreen').show();
    },
    hideScreen: function () {
        if (!this.opened())
            $('#layerScreen').hide();
    },
    closeId: function (id) {
        var $id = this.find(id);
        $id.hide();
        this.hideScreen();
        return;
    },
    openAlert: function (id, closeOthers, target, txt) {
        var $id = this.find(id);
        if ($id.length == 0)
            return;

        //GoTop(); //맨위로
        this.showScreen();
        if (closeOthers) {
            $('.layerPopup').each(function () {
                if (this.id == $id[0].id){
                    $(this).attr("data-target", target);
                    $(this).find(".layer_txt").html(txt);
                    $(this).show();
                }else{
                    $(this).hide();
                }
            });
        }
        else {
            $id.show();
        }
    },
    closeAlert: function (id) {
        var $id = this.find(id);
        $id.hide();
        this.hideScreen();
        if($id.attr("data-target") != "") {
            $($id.attr("data-target")).focus();
        }
        return;
    }
};

if( typeof String.prototype.startsWith !== 'function' )
{
    /**
     * 문자열이 해당 suffix 로 시작하는지 체크
     *
     * @param suffix
     * @returns {boolean}
     */
    String.prototype.startsWith = function (suffix) {

        return this.indexOf(suffix) == 0;
    };
}

/* 숫자만입력 */
function onlyNumber(obj) {
    $(obj).keyup(function () {
        $(this).val($(this).val().replace(/[^0-9]/g, ""));
    });
}


function emodel(target) {        
    var win = window.open('/main2/vr/'+target+'/index.html','ecyber', 'width=980, height=724, top=0, left=0, scrollbars=no');
    win.focus();
}