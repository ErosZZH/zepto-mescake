(function(){
    var scrollArea = $($('.scroll-area')[0]);
    var lazyLoad = $('.lazyload');
    lazyLoad[0].className+= ' animated-quick fadeIn';
    lazyLoad[0].src = lazyLoad[0].getAttribute('data-src');
    var loadImg = function(){

        for(var i=1;i<lazyLoad.length;i++){
            lazyLoad[i].className+= ' animated-quick fadeIn';
            lazyLoad[i].src = lazyLoad[i].getAttribute('data-src');
        }
    }

    scrollArea.one('scroll',loadImg);
    if(window.GOODS_ID == 68||window.GOODS_ID>80){
        $($('.s-img-area')[0]).after($('#operate').html());
    }else{
        $('.sia_01').after($('#operate').html());
    }

    var id = window.GOODS_ID;
    var container = $('#sel_list');

    $.get('getGoodsAttrAnsyc',{id:id},function(d){
        var data = d.data;
        var html = '';
        for(var i=0;i<data.length;i++){
            if(data[i].attr_value.indexOf('：')>-1){
                var attr_short = data[i].attr_value.split('：')[0];
            }else{
                var attr_short = data[i].attr_value.split(':')[0];
            }
            html+='<em class="check-btn" data-id="'+data[i].goods_attr_id+'" data-price="'+data[i].attr_price+'">'+attr_short+'</em>';
        }
        container.prepend(html);
        $(container.find('em')[0]).trigger(CLICK);
    });

    $('#attr_sel')[CLICK](function(){
        if(container.css('display')=='none'){
            container.show();
        }else{
            container.hide();
        }
    });

    container.delegate('em',CLICK,function(){

        var _this = $(this);
        var price = _this.data('price');
        window.ATTR = _this.data('id');
        $('.display_price').html(price);
        container.find('em').removeClass('checked');
        _this.addClass('checked');
    });
    function add_to_cart(callback){
        var goods = {};
        var spec_arr = [];
        var fittings_arr = [];
        var number = 1;
        var quick = 0;

        // 检查是否有商品规格
        goods.quick = 1;
        //商品重量
        goods.spec = window.ATTR||[];
        goods.goods_id = window.GOODS_ID;
        //数量
        goods.number = 1;
        goods.parent = 0;
        $.post('/addShopCart?mod=order&action=add_to_cart',{
            goods : JSON.stringify(goods),
            goods_id : window.GOODS_ID,
            parent_id :0,
            is_cut:0
        },function(d){
            callback();
        });
    }

    $('#buy_now')[CLICK](function(){
        M.checklogin(function(isLogin) {
            if (isLogin) {
                M.loading();
                add_to_cart(function(){
                    location.href = 'checkout';
                });
            } else {
                location.href = M.touchDomain+'login';
                localStorage.setItem('login_redirect_url',location.href);
            }
        })
        return false;
    });

    $('#add_to_cart')[CLICK](function(){
        M.checklogin(function(isLogin) {
            if (isLogin) {
                add_to_cart(function(){
                    M.getShopCarCount(true);
                });
            } else {
                location.href = M.touchDomain+'login';
                localStorage.setItem('login_redirect_url',location.href);
            }
        });

        return false;
    });

    var height = $($('.sia_01')[0]).height();

    var bottomBar = $('#bottom_bar');
    var scrollTimer;
    scrollArea.scroll(function(){
        clearTimeout(scrollTimer);
        var _this = scrollArea.scrollTop();
        //if(!bottomBar.hasClass('fadeOutDown')){
        //   bottomBar.addClass('animated-quick fadeOutDown');
        //}

        if(_this>height){
            $('#top_price').show();
        }else{
            $('#top_price').hide();
        }
        //scrollTimer = setTimeout(function(){
        //  bottomBar.removeClass('fadeOutDown');
        //  bottomBar.addClass('fadeInUp');
        //},800);

    });
})();