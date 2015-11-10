(function(){
    var SEL_ADDRESS_ID = location.href.split('addressid=').pop();
    var CURRENT_ADDRESS_ID;
    var address_container = $('#address_container');

    var addressSingleTmpl = '<p class="address-detail address_item" data-id="<%=data.address_id%>" id="address_<%=data.address_id%>"\
							data-id="<%=data.address_id%>"\
							data-address="<%=data.address%>"\
							data-tel="<%=data.mobile%>"\
							data-contact="<%=data.consignee%>"\
							data-city="<%=data.city%>"\
							data-district="<%=data.district%>"\
						>\
						北京市-<%=data.cityName%> <%=data.districtName%> <%=data.address%><br>\
						<%=data.consignee%> <span class="address-num"><%=data.mobile%></span>\
						<em class="wap-more-ico"></em>\
						</p>';




    M.checklogin(function(isLogin) {
        if (isLogin) {
            window.IS_LOGIN = true;
            $.get('/getOrderAddress?mod=order&action=get_order_address', {}, function(d) {
                var renderData;
                //如果有地址
                if(d.length){
                    d = d.reverse();

                    if(SEL_ADDRESS_ID){
                        for(var i=0;i<d.length;i++){
                            if(d[i].address_id == SEL_ADDRESS_ID){
                                renderData = d[i];
                            }
                        }
                        if(!renderData){
                            renderData = d[0];
                        }
                    }else{
                        renderData = d[0];
                    }
                    var html = M.mstmpl(addressSingleTmpl, {
                        data : renderData
                    });

                    if (d.length) {
                        CURRENT_ADDRESS_ID = renderData.address_id;
                        address_container.append(html);
                        var shipping_site = localStorage.getItem('shipping_site');
                        if(!shipping_site){
                            address_container.show();
                        }
                    }
                    ifAddressNeedFee();
                }else{
                    //添加新地址的地方
                    $('#new_address_link').show();
                    $('#new_address_link')[CLICK](function(){
                        location.href = '/newaddress';
                    });
                }
            });
        } else {
            var shipping_site = localStorage.getItem('shipping_site');
            if(!shipping_site){
                $('#new_address_container').show();
            }

        }
    });

    var streetData;
    var street_container = $('#street_container');
    var zone_container = $('#zone_container');
    var curCity;
    $('#zone_picker')[CLICK](function(e) {
        e.preventDefault();
        $(this).blur();
        new Picker({
            type : 'zone',
            el : this,
            onclick : function(id) {
                curCity = id;
                calAddressFee(curCity,0);
                $.get('/getDistrict?mod=order&action=get_district', {
                    city : id
                }, function(d) {
                    if (d.code == 0) {
                        if (d.data) {
                            for (var i in d.data) {
                                var name = d.data[i].name;
                                if (!d.data[i].free) {
                                    if (name.indexOf('*') < 0) {
                                        d.data[i].name = '*' + name;
                                    }
                                }
                            }
                            streetData = d.data;
                            street_container.show();

                            zone_container.css({'width':'30%'});
                        } else {
                            street_container.hide();
                            zone_container.css({'width':'75%'});
                        }
                    }
                });
            }
        });
        return false;
    });

    $('#street_picker')[CLICK](function(e) {
        e.preventDefault();
        $(this).blur();

        new Picker({
            type : 'street',
            el : this,
            data : streetData,
            onclick:function(id){
                calAddressFee(curCity,id);
            }
        });
        return false;
    });
    //日期选择
    var time = (new Date(window.server_date * 1));
    var year = time.getFullYear();
    var month = time.getMonth() + 1;
    var day = time.getDate();
    var hour = time.getHours();
    var minutes = time.getMinutes();
    var monthHtml = '';
    var dayHtml = '';
    var jq = {
        year_sel : $('#year_sel'),
        month_sel : $('#month_sel'),
        day_sel : $('#day_sel'),
        hour_sel : $('#hour_sel'),
        minute_sel : $('#minute_sel'),
        region_sel : $('#region_sel'),
        dis_district : $('#district_sel'),
        message_input : $('#message_input'),
        shipping_fee_display : $('#shipping_fee_display'),
        shipping_fee : $('#shipping_fee')
    }
    var getSelDate = function() {
        var month = jq.month_sel.val();
        if(month<10){
            month = '0'+month;
        }
        return jq.year_sel.val() + '-' + month + '-' + jq.day_sel.val();
    }
    var getCurDate = function() {
        return year + '-' + month + '-' + day;
    }
    var endHour = 22;
    var beginHour = 10;
    var tips = '';


    $('#date_picker_parent')[CLICK](function(e) {
        e.preventDefault();
        e.stopPropagation();
        $(this).blur();
        $('#time_picker').val('');
        tips = false;
        new Picker({
            type : 'date',
            el : $('#date_picker'),
            onclick : function(year, month, day) {
                jq.year_sel.val(year);
                jq.month_sel.val(month);
                jq.day_sel.val(day);
                beginHour = 10;
                endHour = 22;

                var _date = (new Date(server_date * 1));
                var html = '';
                var selDate = getSelDate();
                var currentDate = getCurDate();
                var currHour = _date.getHours();
                var currTime = (new Date(window.server_date)).getTime();
                var selTime = (new Date(selDate)).getTime();

                if (window.HAS_BIG_STAFF || window.HAS_NO_SUGAR_STAFF) {
                    if (selTime - currTime > 3600 * 1000 * 24) {
                        beginHour = 14;
                    } else {
                        if (window.HAS_NO_SUGAR_STAFF) {
                            tips = '无糖蛋糕制作需要24小时，所选择日期不能送货';
                        } else {
                            tips = '大于5磅蛋糕制作需要24小时，所选择日期不能送货';
                        }
                    }
                } else {
                    //10点以后了 选择第二天的订单 只能是14点之后的
                    if ((selTime - currTime == 3600 * 1000 * 24 && currHour > 21) || (selTime == currTime && currHour < 10)) {
                        beginHour = 14;
                    } else {
                        //其他时间点下单

                        var _hour = hour;
                        var minute = minutes;
                        _hour += 5;
                        if (currentDate == selDate) {
                            if (minute >= 30) {
                                _hour += 1;
                            }
                            if (_hour > endHour) {
                                tips = '制作需要5小时，今天已不能送货';
                            } else if (hour < 10) {
                                beginHour = 14;
                            } else {
                                beginHour = _hour;
                            }
                        }
                    }
                }
                if (tips) {
                    $('#time_picker').val(tips);
                }
            }
        });
    });

    $('#time_picker_parent')[CLICK](function(e) {
        e.preventDefault();
        $(this).blur();
        if (tips) {
            return;
        }
        if($('#date_picker').val()==''){
            alert('请先选择一个送货日期,然后再选择时间');
            //M.confirm('请先选择一个送货日期');
            return;
        }
        new Picker({
            type : 'time',
            el : $('#time_picker'),
            beginHour : beginHour,
            endHour : endHour,
            tips : tips,
            onclick:function(hour,minute){
                jq.hour_sel.val(hour);
                jq.minute_sel.val(minute);
            }
        });
    });

    //锁定支付
    var payLock = false;
    $('body').delegate('.pay_container', CLICK, function() {
        if (payLock) {
            return;
        }
        payLock = true;
        var _this = $(this);
        var payId = _this.data('id');
        _this.find('em').trigger(CLICK);
        $('#pay_id').val(payId);
        setTimeout(function() {
            payLock = false;
        }, 20);

    })

    var _feeDomOperate = function(d){
        if (parseInt(d.fee)) {
            jq.shipping_fee_display.show();
            $('#fee_bar').show();
            $('#address_fee_top').html('10元');
        } else {
            jq.shipping_fee_display.hide();
            $('#fee_bar').hide();
            $('#address_fee_top').html('免邮费');
        }
        jq.shipping_fee.val(d.fee);
        updateTotalPriceDisplay(d);
    }

    var calAddressFee = function(city,district){
        $.get('/shippingFeeCal?mod=order&action=shipping_fee_cal', {
            city:city,
            district:district
        },function(d){
            _feeDomOperate(d);
        });
    }

    //地址选择
    var ifAddressNeedFee = function() {
        $.get('/ifAddressNeedFee?mod=order&action=if_address_need_fee', {
            'address_id' : CURRENT_ADDRESS_ID
        }, function(d) {
            if (d.code == 0) {
                _feeDomOperate(d);
            }
        });
    }

    address_container.delegate('.address_item', CLICK, function() {

        var _this = $(this);
        address_container.find('.address_item').removeClass('ama-item-current');
        _this.addClass('ama-item-current');

        //set current id
        CURRENT_ADDRESS_ID = _this.data('id');

        //计算一个地址是否需要运送费


    }).delegate('.addr_del', CLICK, function() {
        //delete an address info if you want
        var _this = $(this);
        var id = _this.data('id');
        M.confirm('确认删除这个地址信息吗？', function() {
            $.post('/delOrderAddress?mod=order&action=del_order_address', {
                id : id
            }, function(d) {
                if (d.code == 0) {
                    //把当前选中的送货地址删除了 就要更新这个id
                    if (window.CURRENT_ADDRESS_ID == id) {
                        window.CURRENT_ADDRESS_ID = null;
                    }
                    //remove it from UI
                    $('#address_' + id).remove();
                }
            });
        })
        return false;
    }).delegate('.addr_edit', CLICK, function() {
        //edit address info
        var _this = $(this);
        var id = _this.data('id');
        _this = $('#address_' + id);
        //update current mod ID
        CURRENT_ID = id;
        require(['ui/newaddress'], function(newaddress) {
            newaddress.show({
                mod : true,
                id : id,
                data : {
                    city : _this.data('city'),
                    address : _this.data('address'),
                    tel : _this.data('tel'),
                    contact : _this.data('contact'),
                    district : _this.data('district')
                },
                callback : function(id) {
                    JQ.address_container.find('.address_item').removeClass('ama-item-current');
                    CURRENT_ADDRESS_ID = id;
                    $('#address_' + id).addClass('ama-item-current');
                    ifAddressNeedFee();
                }
            });
        });
        return false;
    }).delegate('.address_item',CLICK,function(){
        M.loading();
        var id = $(this).data('id');
        location.href = '/addressmanager?id='+id;
    });

    //提交相关
    var checkout = function() {
        //直接提交数据到订购表单
        $.post('/checkoutApi?mod=order&action=checkout', {
            card_message : '',
            vaild_code : '',
            source : 'FROM_MOBILE'
        }, function(d) {
            var jqInput = jq.message_input;
            $('#leaving_message').val(jqInput.val());
            if (d.code == 0) {
                $('#submit_form').submit();
            } else {
                submitFail();
            }
        });

    }
    var vaildDate = function() {
        var ret = true;


        if (!getSelDate()) {
            ret = false;
        }

        var hour = jq.hour_sel.val();
        if (hour > 22 || hour < 10) {
            ret = false;
        }

        var minute = jq.minute_sel.val();
        if (minute != 0 && minute != 30) {
            ret = false;
        }

        if($('#date_picker').val()==''){
            inputVaildError($('#date_picker'), 350);
            return ret;
        }

        return ret;
    }
    var submitFail = function() {
        M.loadingEnd();
    }
    var inputVaildError = function(jqObj, t) {
        var _p = jqObj.parent();
        jqObj.addClass('error-border');
        t-=100;
        $('#scroll_container').scrollTop(t);
        setTimeout(function(){
            jqObj.removeClass('error-border');
        },2000);
    }
    var addressInfoVaild = function() {
        if ($('#new_contact').val() == '') {
            inputVaildError($('#new_contact'), 350);
            return false;
        }

        if (!M.IS_MOBILE($('#new_tel').val())) {
            inputVaildError($('#new_tel'), 400);
            return false;
        }

        if($('#district_sel').val()==0&&$('#street_container').css('display')!='none'){
            inputVaildError($('#street_picker'), 300);
            return false;
        }

        if($('#region_sel').val()==0){
            inputVaildError($('#zone_picker'), 300);
            return false;
        }

        if ($('#new_address').val() == '') {
            inputVaildError($('#new_address'), 300);
            return false;
        }


        return true;
    }

    var saveconsignee = function(_this) {

        var me = this;
        var addressObj;
        if(!window.ZT){
            if(window.IS_LOGIN&&!CURRENT_ADDRESS_ID){
                //M.confirm('您还没有创建收货地址，请先创建一个收货地址',function(){
                //	  location.href = '/newaddress';
                //});
                alert('您还没有创建收货地址，请先创建一个收货地址');
                location.href = '/newaddress';
                return;
            }

            if (CURRENT_ADDRESS_ID) {
                addressObj = $('#address_' + CURRENT_ADDRESS_ID);
            } else {
                if (!addressInfoVaild()) {
                    return false;
                }
            }
        }else{
            //自提流程
            var shipping_site = localStorage.getItem('shipping_site');
            var self_shipping_name = $('#self_shipping_name').val();
            var self_shipping_mobile = $('#self_shipping_mobile').val();
            if(!self_shipping_name){
                inputVaildError($('#self_shipping_name'), 350);
                alert('请填写一个联系人姓名')
                return;
            }
            if(!self_shipping_mobile || !/\d{11}/.test(self_shipping_mobile)){
                inputVaildError($('#self_shipping_mobile'), 350);
                alert('请填写一个11位联系人手机号码')
                return;
            }
            if(!shipping_site){
                alert('请先选择一个自提站点')
                return;
            }
        }

        var data = {
            address_id : CURRENT_ADDRESS_ID || 0,
            consignee : addressObj ? addressObj.data('contact') : $('#new_contact').val(),
            country : 441,
            city : addressObj ? addressObj.data('city') : jq.region_sel.val(),
            address : addressObj ? addressObj.data('address') : $('#new_address').val(),
            district : addressObj ? addressObj.data('district') : jq.dis_district.val(),
            mobile : addressObj ? addressObj.data('tel') : $('#new_tel').val(),
            bdate : getSelDate(),
            hour : jq.hour_sel.val(),
            minute : jq.minute_sel.val(),
            message_input : jq.message_input.val().substring(0, 140),
            inv_payee : '',
            inv_content : ''
        };

        if(window.ZT){
            data.shipping = 'ZT';
            data.self_shipping_name = self_shipping_name;
            data.self_shipping_mobile = self_shipping_mobile;
        }

        if (!vaildDate()) {
            submitFail();
            return;
        }

        M.loading();
        //保存订单
        $.post('/saveConsignee?action=save_consignee&mod=order', data || {}, function(d) {
            if (d.msg == 'time error') {
                //M.confirm('选择的送货时间距离制作时间不能少于5小时!');
                alert('选择的送货时间距离制作时间不能少于5小时!');
                submitFail();
                return;
            }

            if (d.code != 0) {
                //M.confirm('收货信息填写不完整，重新填写后再提交');
                alert('收货信息填写不完整，重新填写后再提交');
                submitFail();
                return;
            }

            if (window.IS_LOGIN) {
                checkout();
            } else {
                var username = $('#new_tel').val();
                if (!M.IS_MOBILE(username)) {
                    M.inputError('new_tel_error');
                    return;
                }

                $.get('/checkUserExsit?action=check_user_exsit&mod=account', {
                    username : username
                }, function(d) {
                    if (d.exsit) {
                        M.confirm('您所使用的手机号已经被注册，请登录后再继续订购', function() {
                            location.href = '/login';
                        });
                        submitFail();
                    } else {
                        var username = data.mobile;
                        $.post('/autoRegister?action=auto_register&mod=account', {
                            username : username
                        }, function(d) {
                            if (d.code == 0) {
                                //注册成功后给这个用户结帐
                                setTimeout(function() {
                                    checkout();
                                }, 100);
                            } else {
                                submitFail();
                            }
                        });
                    }
                });
            }

        });
    }

    //保存支付信息
    $('#done_button')[CLICK](function() {
        saveconsignee();
    });

    $('.pay_sel')[CLICK](function() {
        $('.pay_sel').removeClass('checked');
        $(this).addClass('checked');
    });

})();