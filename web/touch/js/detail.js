(function(){
    var eventBind = function(){
        $('#canel_order')[CLICK](function(){
            M.confirm('确认取消该订单吗？取消后将无法恢复！',function(){
                $.post('/delOneOrder?action=del_one_order&mod=account',{
                    'order_id':window.orderId
                },function(d){
                    if(d.code == 0){
                        location.reload();
                    }else{
                        M.confirm("订单取消失败！可能是该订单已经确认，将不能取消，请联系客服");
                    }
                });
            });
            return false;
        });
    }
    $.get('/getUserOrderDetail?action=get_user_order_detail&mod=account',{
        order_id:window.orderId
    },function(d){

        var tmpl ='<div class="order-detail-con clearfix">\
					  <p class="hide">订单号：<%=order.order_sn%> | <%=order.formated_add_time%></p>\
					  <p>订单状态：<b><%if(order.order_status==0){%>未确认\
									<%}else if(order.order_status==1){%>已确认\
									<%}else if(order.order_status==2){%>已取消\
									<%}else if(order.order_status==3){%>无效\
									<%}else if(order.order_status==4){%>退货\
									<%}else if(order.order_status==5){%>已分单\
									<%}else if(order.order_status==6){%>部分分单\
							<%}%></b> | 配送状态：\
							<b><%if(order.shipping_status==0){%>未发货\
							<%}else if(order.shipping_status==1){%>已发货\
							<%}else if(order.shipping_status==2){%>已收货\
							<%}else if(order.shipping_status==3){%>备货中\
							<%}else if(order.shipping_status==4){%>已发货(部分商品)\
							<%}else if(order.shipping_status==5){%>发货中(处理分单)\
						    <%}else if(order.shipping_status==6){%>已发货(部分商品)<%}%></b> |\
					<%if(order.pay_id==4){%>货到付款\
					<% } else {%>\
						<%if(order.pay_status==0||!order.pay_status){%>\
							未付款\
						<% }else if(order.pay_status==1){%>\
							付款中\
						<% } else {%>\
							已付款\
						<% } %>\
					<% } %></p>\
					</div>\
				 <%for(var i=0;i<data.length;i++){%>\
					<%if(data[i].goods_id != FORK){%>\
					<div class="wap-order-item">\
						<%if(data[i].goods_id == CANDLE||data[i].goods_id == NUM_CANDLE){%>\
								<%if(data[i].goods_id == CANDLE){%>\
								<img src="css/img/lazhu1.jpg" class="woi-img" width="50">\
								<% } %>\
								<%if(data[i].goods_id == NUM_CANDLE){%>\
								<img src="css/img/lazhu-num-<%=data[i].goods_attr%>.jpg" class="od-img" width="50">\
								<% } %>\
							<%}else{%>\
								<a target="_blank" href="/cake?id=<%=data[i].goods_id%>">\
									<%if(data[i].goods_id == CAT_CAKE){%>\
										<img src="css/img/cat-little.jpg" class="woi-img" width="70">\
								    <% } else {%>\
										<img src="'+M.mainDomain+'themes/default/images/sgoods/<%=data[i].goods_sn.substring(0,3)%>.jpg" class="woi-img" width="70">\
									<% } %>\
								</a>\
						<% } %>\
					  <div class="woi-intro-area">\
						<p class="woi-title"><%=data[i].goods_name%> <span class="woi-tip">尺寸：<%=data[i].goods_attr%></span>\<span class="woi-price"><%=data[i].subtotal%>元</span></p>\
						<div class="" style="padding-top:6px;">\
							数量：<b><%=data[i].goods_number%></b> / 个\
						  </div>\
					  </div>\
					</div>\
					<% } %>\
			     <% } %>\
				 <h4 class="wap-order-title-item">送货及地址信息</h4>\
					<div class="address-con">\
					  <p><em>送货时间：</em>将于<%=order.best_time%>送达</p>\
					  <p><em>收货地址：</em>北京市 <%=order.cityName%> <%=order.address%><br />\
					  <%=order.consignee%>，<%=order.ordertel%></p>\
				  </div>';
        var data = d.goods_list;
        var orderObj = d.order;
        var html = M.mstmpl(tmpl,{
            data:data,
            order:orderObj
        });
        $('#container').append(html);
        var tmpl2 = '<div class="wap-total-btn-area tl-c" style="bottom:10px">\
						<p>总计<%=order.formated_total_fee%>元<%if(parseInt(order.formated_shipping_fee.replace("￥",""),10)>0){%>（含运费：<%=order.formated_shipping_fee%>元）<br/><% } %><p/>\
						<%if((order.pay_status==0||!order.pay_status)&&order.pay_id!=4&&order.order_status!=2){%>\
							<%if(order.pay_name=="快钱") {%>\
								<a href="#" class="btn status1-btn" onclick="document.forms[&quot;kqPay&quot;].submit();">去付款</a>\
								<div style="display:none"><%=order.pay_online.replace(/script/gi,"a")%></div>\
							<%} else {%>\
								<a href="#" style="padding:0 40px;" id="pay_online" class="btn status1-btn">去付款</a>\
							<% } %>\
						<% } %>\
						<%if(order.order_status==0&&order.pay_status!==2){%>\
							<a href="#" id="canel_order" style="font-size:12px">取消订单</a>\
						<% } %>\
					  </div>';

        var html = M.mstmpl(tmpl2,{
            order:orderObj
        });

        $('#container').after(html);
        if(IN_WX_PAY){
            $('#pay_online').html('微信支付');
        }
        eventBind();
        var WX_PAY = 9;
        $('#pay_online').click(function(){
            if(IN_WX_PAY){
                callpay();
                return;
            }
            if(orderObj.pay_id == WX_PAY){
                var ordersn = orderObj.order_sn;
                var url = 'http://www.mescake.com/weixin_checkout.php?orderid='+orderId;
                $.post('/setPaySession?mod=order&action=set_pay_session', {
                    ordersn:ordersn
                },function(d){
                    location.href = url;
                });
                //document.cookie = 'pay_from_detail=' + orderId;
                //location.href = url;
            }
        });
        M.loadingEnd();
    });
})();
