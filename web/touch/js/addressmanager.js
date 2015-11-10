(function(){
    window.current_id = location.href.split('id=').pop();

    var address_container = $('#address_container');
    var addressTmpl = '<%for(var i=0;i<data.length;i++){%>\
						<div class="data-item address_item" data-id="<%=data[i].address_id%>">\
							<p class="address-detail">\
							北京市-<%=data[i].cityName%> <%=data[i].districtName%> <%=data[i].address%><br/>\
							<%=data[i].consignee%> <span class="address-num"><%=data[i].mobile%></span>\
							<em class="wap-radio wap-radio-item <%if(data[i].address_id == window.current_id){%>checked<% } %>"></em>\
							</p>\
						  </div>\
						<% }　%>';
    $.get('/getOrderAddress?mod=order&action=get_order_address', {}, function(d) {
        var renderData;
        d = d.reverse();
        var html = M.mstmpl(addressTmpl, {
            data : d
        });
        address_container.show().append(html);
    });
    $('#new_address_link')[CLICK](function(){
        location.href = '/newaddress';
    });

    $('body').delegate('.address_item',CLICK,function(){
        location.href = '/checkout?addressid='+$(this).data('id');
    });
})();