var fs = require('fs');
var async = require('async');
var Mysql = require('../includes/db_connection.js').Mysql;
var Goods = {
	getGoodsAttrData:function(goodsId,callback){
		Mysql.getAll('ecs_goods_attr',{
			goods_id:goodsId,
			attr_id:6
		},function(d){
			callback(d);
		}, ' order by goods_attr_id');
	}
}

exports.Goods = Goods;