(function(){
    var jq = {
        region_sel : $('#region_sel'),
        dis_district:$('#district_sel')
    }

    var streetData;
    var street_container = $('#street_container');
    var zone_container = $('#zone_container');
    $('#zone_picker')[CLICK](function() {
        new Picker({
            type : 'zone',
            el : this,
            onclick : function(id) {
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
    });

    $('#street_picker')[CLICK](function() {
        new Picker({
            type : 'street',
            el : this,
            data : streetData,
            onclick:function(id){

            }
        });
    });

    var jqRegionSel = $('#region_sel');
    var jqDistrictSel = $('#district_sel');
    var jqNewAddressInput = $('#new_address_popup');
    var jqNewContactInput =  $('#new_contact_popup');
    var jqNewTelInput =  $('#new_tel_popup');
    //地址表单的验证
    var vaildForm = function() {
        if ($.trim(jqNewContactInput.val()) == '') {
            M.confirm('请填写一个收货人姓名');
            return false;
        }

        var tel = $.trim(jqNewTelInput.val());
        if (!/\d{5,}/.test(tel)) {
            M.confirm('请填写一个合法的联系方式');
            return false;
        }

        if ($.trim($('#region_sel').val()) == 0) {
            M.confirm('送货地区选择错误');
            return false;
        }

        if ($.trim(jqDistrictSel.val()) == 0 && jqDistrictSel.parent().css('display') != 'none') {
            M.confirm('送货地区选择错误');
            return false;
        }

        if ($.trim(jqNewAddressInput.val()) == '') {
            M.confirm('请填写收货地址');
            return false;
        }

        return true;
    }
    $('#save_address')[CLICK](function() {

        var city = jqRegionSel.val();
        var district = jqDistrictSel.val();
        var address = jqNewAddressInput.val();
        var tel = jqNewTelInput.val();
        var contact = jqNewContactInput.val();
        //表单验证失败
        if (!vaildForm()) {
            return;
        }
        M.loading();
        $.post('/addOrderAddress?mod=order&action=add_order_address',{
            country : 441,
            city : city.split('_')[0],
            address : address,
            district : district.split('_')[0],
            tel : tel,
            contact : contact
        }, function(d) {
            if (d.code == 0) {
                location.href = "checkout";
            }
        });
    });
})()
