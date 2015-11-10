/**
 * Created by user on 15/11/5.
 */

module.exports = function(app) {

    app.post('/addShopCart', function (req, res) {
        var mod = req.query.mod;
        var action = req.query.action;
        var goods = req.body.goods;
        console.log('=====mod======' + mod);
        console.log('=====action======' + action);
        console.log('====goods=====' + JSON.stringify(goods));
        return res.send({});
    });

    app.get('/getShopCartAmount', function (req, res) {
        var mod = req.query.mod;
        var action = req.query.action;
        console.log('=====mod======' + mod);
        console.log('=====action======' + action);
        return res.send({"code": "0", "count": 2});
    });

    app.get('/checklogin', function (req, res) {
        var mod = req.query.mod;
        var action = req.query.action;
        console.log('=====mod======' + mod);
        console.log('=====action======' + action);
        return res.send({res: true});
    });

    app.get('/getOrderList', function (req, res) {
        var mod = req.query.mod;
        var action = req.query.action;
        console.log('=====mod======' + mod);
        console.log('=====action======' + action);
        return res.send({
            goods_list: [{goods_name: '苹果', goods_attr: '1.0磅', goods_sn: 'D12ssss', goods_number: 1}],
            order_total: {
                amount_formated: '0'
            }
        });
    });

    app.get('/getOrderAddress', function(req, res) {
        var mod = req.query.mod;
        var action = req.query.action;
        console.log('=====mod======' + mod);
        console.log('=====action======' + action);
        return res.send([
            {
                address_id: 1,
                address: '南极长城站',
                mobile: '13112345678',
                consignee: 'consignee',
                city: 1,
                district: 1,
                cityName: '苏州',
                districtName: '工业园区'
            }
        ]);
    });

    app.get('/ifAddressNeedFee', function(req, res) {
        var mod = req.query.mod;
        var action = req.query.action;
        var address = req.body.address_id;
        console.log('=====mod======' + mod);
        console.log('=====action======' + action);
        console.log('=====address======' + address);
        return res.send({code: 0, fee: 100, order_total: 1000, amount_formated: 10});
    });

    app.get('/updateCart', function(req, res) {
        var mod = req.body.mod;
        var action = req.body.action;
        var id = req.body.id;
        var num = req.body.num;
        console.log('=====mod======' + mod);
        console.log('=====action======' + action);
        console.log('=====id======' + id);
        console.log('=====num======' + num);
        return res.send({result: 2, order_total: 1000, amount_formated: 10});
    });

    app.get('/getRegion', function(req, res) {
        var mod = req.query.mod;
        var action = req.query.action;
        console.log('=====mod======' + mod);
        console.log('=====action======' + action);
        return res.send([
            {
                region_id: 1,
                region_name: '工业园区'
            }
        ]);
    });

    app.get('/getDistrict', function(req, res) {
        var mod = req.query.mod;
        var action = req.query.action;
        var cityId = req.body.city;
        console.log('=====mod======' + mod);
        console.log('=====action======' + action);
        console.log('=====cityId======' + cityId);
        return res.send({
            code: 0,
            data: [
                {
                    name: '斜塘',
                    fee: ''
                }
            ]
        });
    });

    app.post('/addOrderAddress', function(req, res) {
        var mod = req.query.mod;
        var action = req.query.action;
        console.log('=====mod======' + mod);
        console.log('=====action======' + action);
        return res.send({code: 0});
    });

    app.get('/getUsersInfo', function(req, res) {
        var mod = req.query.mod;
        var action = req.query.action;
        console.log('=====mod======' + mod);
        console.log('=====action======' + action);
        return res.send({info: [{mobile_phone: '13140998809', user_money: '10000000'}]});
    });

    app.get('/getUserOrderList', function(req, res) {
        var mod = req.query.mod;
        var action = req.query.action;
        console.log('=====mod======' + mod);
        console.log('=====action======' + action);
        return res.send({
            orders: []
        });
    });

    app.get('/logout', function(req, res) {
        var mod = req.query.mod;
        var action = req.query.action;
        console.log('=====mod======' + mod);
        console.log('=====action======' + action);
        return res.send({});
    });

    app.post('/loginApi', function(req, res) {
        var mod = req.query.mod;
        var action = req.query.action;
        var username = req.body.username;
        var password = req.body.password;
        console.log('=====mod======' + mod);
        console.log('=====action======' + action);
        console.log('=====username======' + username);
        console.log('=====password======' + password);
        return res.send({code: 0});
    });

    app.post('/changePassword', function(req, res) {
        var mod = req.query.mod;
        var action = req.query.action;
        var old = req.body.old;
        var newPass = req.body.new;
        console.log('=====mod======' + mod);
        console.log('=====action======' + action);
        console.log('=====old======' + old);
        console.log('=====new======' + newPass);
        return res.send({code: 0});
    });

    app.post('/signupVaildCode', function(req, res) {
        var mod = req.query.mod;
        var action = req.query.action;
        var mobile = req.body.mobile;
        console.log('=====mod======' + mod);
        console.log('=====action======' + action);
        console.log('=====mobile======' + mobile);
        return res.send({code: 0});
    });

    app.post('/signup', function(req, res) {
        var mod = req.query.mod;
        var action = req.query.action;
        var password = req.body.password;
        var username = req.body.username;
        var vaild_code = req.body.vaild_code;
        console.log('=====mod======' + mod);
        console.log('=====action======' + action);
        console.log('=====password======' + password);
        console.log('=====username======' + username);
        console.log('=====vaild_code======' + vaild_code);
        return res.send({code: 0});
    });

    app.get('/getOrderCountBySid', function(req, res) {
        var mod = req.query.mod;
        var action = req.query.action;
        console.log('=====mod======' + mod);
        console.log('=====action======' + action);
        return res.send({code: 0, count: 1});
    });

    app.get('/getAutoRegisterMobile', function(req, res) {
        var mod = req.query.mod;
        var action = req.query.action;
        console.log('=====mod======' + mod);
        console.log('=====action======' + action);
        return res.send({code: 0, msg:'1234566577'});
    });

    app.post('/changeUnregisterPassword', function(req, res) {
        var mod = req.query.mod;
        var action = req.query.action;
        var password = req.body.password;
        console.log('=====mod======' + mod);
        console.log('=====action======' + action);
        console.log('=====password======' + password);
        return res.send({code: 0});
    });

    app.get('/shippingFeeCal', function(req, res) {
        var mod = req.query.mod;
        var action = req.query.action;
        var city = req.body.city;
        var district = req.body.district;
        console.log('=====mod======' + mod);
        console.log('=====action======' + action);
        console.log('=====city======' + city);
        console.log('=====district======' + district);
        return res.send({code: 0, fee: 100});
    });

    app.get('/checkUserExsit', function(req, res) {
        var mod = req.query.mod;
        var action = req.query.action;
        var username = req.body.username;
        console.log('=====mod======' + mod);
        console.log('=====action======' + action);
        console.log('=====username======' + username);
        return res.send({code: 0, exist: false});
    });

    app.post('/autoRegister', function(req, res) {
        var mod = req.query.mod;
        var action = req.query.action;
        var username = req.body.username;
        console.log('=====mod======' + mod);
        console.log('=====action======' + action);
        console.log('=====username======' + username);
        return res.send({code: 0});
    });

    app.post('/delOrderAddress', function(req, res) {
        var mod = req.query.mod;
        var action = req.query.action;
        var id = req.body.id;
        console.log('=====mod======' + mod);
        console.log('=====action======' + action);
        console.log('=====id======' + id);
        return res.send({code: 0});
    });

    app.post('/checkoutApi', function(req, res) {
        var mod = req.query.mod;
        var action = req.query.action;
        var card_message = req.body.card_message;
        var vaild_code = req.body.vaild_code;
        var source = req.body.source;
        console.log('=====mod======' + mod);
        console.log('=====action======' + action);
        console.log('=====card_message======' + card_message);
        console.log('=====vaild_code======' + vaild_code);
        console.log('=====source======' + source);
        return res.send({code: 0});
    });

    app.post('/saveConsignee', function(req, res) {
        var mod = req.query.mod;
        var action = req.query.action;
        console.log('=====mod======' + mod);
        console.log('=====action======' + action);
        return res.send({code: 0, exist: false});
    });

    app.get('/getUserOrderDetail', function(req, res) {
        var mod = req.query.mod;
        var action = req.query.action;
        var order_id = req.body.order_id;
        console.log('=====mod======' + mod);
        console.log('=====action======' + action);
        console.log('=====order_id======' + order_id);
        return res.send({code: 0, goods_list: [], order: []});
    });

    app.post('/delOneOrder', function(req, res) {
        var mod = req.query.mod;
        var action = req.query.action;
        var order_id = req.body.order_id;
        console.log('=====mod======' + mod);
        console.log('=====action======' + action);
        console.log('=====order_id======' + order_id);
        return res.send({code: 0});
    });

    app.post('/setPaySession', function(req, res) {
        var mod = req.query.mod;
        var action = req.query.action;
        var ordersn = req.body.ordersn;
        console.log('=====mod======' + mod);
        console.log('=====action======' + action);
        console.log('=====ordersn======' + ordersn);
        return res.send({code: 0});
    });

    app.get('/dropShopcart', function(req, res) {
        var mod = req.query.mod;
        var action = req.query.action;
        var id = req.body.id;
        console.log('=====mod======' + mod);
        console.log('=====action======' + action);
        console.log('=====id======' + id);
        return res.send({code: 0});
    });
};