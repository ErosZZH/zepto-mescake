var fs = require('fs');
var async = require('async');
var Mysql = require('../includes/db_connection.js').Mysql;
var PageView = {
	readIndexConfig:function(){
		var string = fs.readFileSync('goodsconfig.json','utf-8');
		return JSON.parse(string,true);
	},
	getGoodsDetailData:function(goodsId,callback){
		if(!goodsId||isNaN(goodsId)){
			callback({},true);
		}
		var res = {};
		var fn1 = function(fn){
			Mysql.getOne('ecs_goods',{goods_id:goodsId},function(d){
				res.goods = d;
				return fn && fn(null);
			});
		};

		var fn2 = function(fn){
			Mysql.getOne('ecs_goods_attr',{goods_id:goodsId,attr_id:9},function(d){
				res.goodsattr = d;
				return fn && fn(null);
			});
		}

		async.parallel([fn1,fn2],function(){
			callback(res,false);
		});
	},

	getGoodsAttrData:function(goodsId,callback){
		Mysql.getAll('ecs_goods_attr',{goods_id:goodsId},function(d){
			callback(d);
		});
	},
	_getMinPrice:function(arr){
	  var l = arr.length;
	  var min = 99999;
	 
	  for(var i=0;i<l;i++){
	    var price = parseInt(arr[i].attr_price);
	
		if(price<min){

		   min = price;
		}
	  }
	  return min;
	},
	getGoodsData:function(callback){
		var me = this;
		var config = this.readIndexConfig();
		var cat = config['party'].cato;
		var fnArray = [];
		var staffData = {};
		for(var cat in config){
			var currCato = config[cat].cato;
			for(var i=0;i<currCato.length;i++){
			   var currCatoData = currCato[i].data;
			   for(var j=0;j<currCatoData.length;j++){
				  var fn = (function(){
					var goodsId = currCatoData[j];
					return function(fn){
						if(!staffData[goodsId]){
							Mysql.getOne('ecs_goods',{goods_id:goodsId,is_on_sale:1},function(d){
								  if(d){
									Mysql.getAll('ecs_goods_attr',{
										goods_id:goodsId,
										attr_id:6
									},function(d2){
										if(d2[0]){
											d.startprice = me._getMinPrice(d2);
											staffData[goodsId]  = d;
										}
										return fn && fn(null);
									});
									staffData[goodsId]  = d;
								  }else{
									return fn && fn(null);
								  }
							 });
						}
					  }
				  })();
				  
				  
				  fnArray.push(fn);
			   }
			}
		}
	
		async.parallel(fnArray,function(){
			callback(staffData,config);
		});
	}

}
//PageView.getGoodsData();
exports.PageView = PageView;