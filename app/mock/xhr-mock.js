

import Mock from './react-native-mock'
//import Mock from 'mockjs'


function formatUrlParams(search) {
    //?a=1&b=2...#test
    var paramObj = {};
    var matchArr, innerMatchArr;
    var regexp = /^\??([^#]+)/;
    var match = regexp.exec(search);
    if(match) {
        matchArr = match[1].split('&');
        matchArr.forEach(function(item, index, arr) {
            innerMatchArr = item.split('=');
            paramObj[innerMatchArr[0]] = decodeURIComponent(innerMatchArr[1]);
        });
    }
    return paramObj;
}

//export const indexCartItems = Mock.mock( /\/proxy\/shoppingCart\/findShoppingCart$/, function(options) {
//    //console.log(options);
//    //var searchObj = formatUrlParams(options.body);
//    //console.log(searchObj);
//    return {
//        //"needLogin": true,
//        "needLogin": false,
//        "success": true,
//        "errorCode": "",
//        "errorMsg": "",
//        "msg": "",
//        "result": {
//            'shopping_num': 6,
//            'total': 32800,
//            // 属性 list 的值是一个数组，其中含有 1 到 10 个元素
//            'list': [{
//                'good_id': 1,
//                'good_name': '福临门 东北大米 水晶米 中粮出品 大米5kg',
//                'num': 3,
//                'price': 29.80
//            },
//                {
//                    'good_id': 2,
//                    'good_name': '金龙鱼 东北大米 蟹稻共生 盘锦大米5KG',
//                    'num': 100,
//                    'price': 29.90
//                },
//                {
//                    'good_id': 3,
//                    'good_name': '鲁花 5S压榨一级花生油 6.18L',
//                    'num': 9999,
//                    'price': 159.90
//                },
//                {
//                    'good_id': 4,
//                    'good_name': '十月稻田 2015新米 长粒香大米 东北大米5kg',
//                    'num': 832,
//                    'price': 39.00
//                },
//                {
//                    'good_id': 5,
//                    'good_name': '金龙鱼 葵花籽 食用调和油 5L',
//                    'num': 120,
//                    'price': 45.90
//                },
//                {
//                    'good_id': 6,
//                    'good_name': '金龙鱼 苏北米 软香稻大米 5kg',
//                    'num': 12560,
//                    'price': 29000.90
//                }]
//        }
//    }
//});
//
//
//export const delCartItem = Mock.mock( /\/proxy\/shoppingCart\/delShoppingCart/, function(options) {
//    //console.log(options);
//    //var searchObj = formatUrlParams(options.body);
//    //console.log(searchObj);
//    return {
//        "needLogin": true,
//        "success": true,
//        "errorCode": "",
//        "errorMsg": "",
//        "msg": ""
//    }
//});

//示例1,
export const errorXhrMock = Mock.mock( /\/httpbin.org\/delay/, function(options) {
    //console.log(options);
    //var searchObj = formatUrlParams(options.body);
    //console.log(searchObj);
    return '{"errorCode":"-202","errorMsg":"未登录或登录超时","code":null,"msg":null,"result":null,"recordsTotal":0,"recordsFiltered":0,"data":null,"permissions":null,"tokenName":null,"tokenVal":null}'
});

//示例2,
export const successXhrMock = Mock.mock( /\/httpbin.org\/delay/, function(options) {
    //console.log(options);
    //var searchObj = formatUrlParams(options.body);
    //console.log(searchObj);
    return '{"errorCode":null,"errorMsg":null,"code":10,"msg":操作成功,"result":null,"recordsTotal":0,"recordsFiltered":0,"data":null,"permissions":[{"/user/update":false},{"/user/add":false}],"tokenName":null,"tokenVal":null}'
});



//首页--轮显图片
export const index_showPicture = Mock.mock( /\/index\/showPicture/, function(options) {
    //console.log(options);
    //var searchObj = formatUrlParams(options.body);
    //console.log(searchObj);
    //http://www.doorto.cn/images/banner-02.jpg
    let response = {
        errorCode: null,
        errorMsg: null,
        code: 10,
        msg: '操作成功',
        result: [{
            file_url: 'http://www.doorto.cn/images/banner-02.jpg',
            big_url: 'http://www.doorto.cn/images/banner-02.jpg',
            id: '2',
        }, {
            file_url: 'http://www.doorto.cn/images/banner-01.jpg',
            big_url: 'http://www.doorto.cn/images/banner-01.jpg',
            id: '1',
        } ],
    }
    return response
});



//用户信息跳转
export const member_changeInfoShow = Mock.mock( /\/member\/changeInfoShow/, function(options) {
    console.log('member_changeInfoShow');
    var searchObj = formatUrlParams(options.body);
    console.log(searchObj);
    //http://www.doorto.cn/images/banner-02.jpg
    let response = {
        errorCode: null,
        errorMsg: null,
        code: 10,
        msg: '操作成功',
        result: {
            member: {
                account:'User1',
                email: '222@163.com',
                qq: '56665223',
                phone: '13211122776',
                real_name:'客户姓名',
                contact_time:'全天',
                company_name:'润码科技',
                company_address:'长寿路652号',
                company_introduction:'供应链,仓储,软件开发',

            }
        },
    }
    return response
});

//修改信息提交
export const member_changeInfo = Mock.mock( /\/member\/changeInfo/, function(options) {
    var searchObj = formatUrlParams(options.body);
    console.log(searchObj);
    //http://www.doorto.cn/images/banner-02.jpg
    let response = {
        errorCode: null,
        errorMsg: null,
        code: 1,
        msg: '操作成功',
        result:null,
    }
    return response
});
//密码修改提交
export const member_changePwd = Mock.mock( /\/member\/changePwd/, function(options) {
    var searchObj = formatUrlParams(options.body);
    console.log(searchObj);
    //http://www.doorto.cn/images/banner-02.jpg
    let response = {
        errorCode: null,
        errorMsg: null,
        code: 1,
        msg: '操作成功',
        result: null,
    }
    return response
});
//建议提交
export const sysInfo_feedBack = Mock.mock( /\/sysInfo\/feedBack/, function(options) {
    var searchObj = formatUrlParams(options.body);
    console.log(searchObj);
    //http://www.doorto.cn/images/banner-02.jpg
    let response = {
        errorCode: null,
        errorMsg: null,
        code: 1,
        msg: '操作成功',
        result: null,
    }
    return response
});
//发送验证码
export const register_firstStep = Mock.mock( /\/register\/firstStep/, function(options) {
    console.log('register_firstStep');
    var searchObj = formatUrlParams(options.body);
    console.log(searchObj);
    //http://www.doorto.cn/images/banner-02.jpg
    let response = {
        errorCode: null,
        errorMsg: null,
        code: 1,
        msg: '操作成功',
        result: null,
    }
    return response
});

//发送验证码成功
export const check_msg_code = Mock.mock( /\/checkMsgCode/, function(options) {
    console.log('check_msg_code');
    var searchObj = formatUrlParams(options.body);
    console.log(searchObj);
    //http://www.doorto.cn/images/banner-02.jpg
    let response = {
        errorCode: null,
        errorMsg: null,
        code: 10,
        msg: '操作成功',
        result: null,
    }
    return response
});
//注册
export const register_secondStep = Mock.mock( /\/register\/secondStep/, function(options) {
    var searchObj = formatUrlParams(options.body);
    console.log(searchObj);
    //http://www.doorto.cn/images/banner-02.jpg
    let response = {
        errorCode: null,
        errorMsg: null,
        code: 10,
        msg: '操作成功',
        result: null,
    }
    return response
});

//帮助列表
export const sysInfo_helpCenter = Mock.mock( /\/sysInfo\/helpCenter/, function(options) {
    var searchObj = formatUrlParams(options.body);
    console.log(searchObj);
    //http://www.doorto.cn/images/banner-02.jpg
    let response = {
        errorCode: null,
        errorMsg: null,
        code: 1,
        msg: '操作成功',
        result:
        [{
            id:'1',
            sender:'发件人',
            title:'标题',
            child:{

                id:'11',
                sender:'发件人',
                title:'标题',
                child:'text',
            },
        },
            {
                id:'2',
                sender:'发件人',
                title:'标题',
                child:{

                    id:'21',
                    sender:'发件人',
                    title:'标题',
                    child:'text',
                },
            },
            {
                id:'3',
                sender:'发件人',
                title:'标题',
                child:{

                    id:'31',
                    sender:'发件人',
                    title:'标题',
                    child:'text',
                },
            }

        ],
    }
    return response
});


//委托单列表
export const commissionOrder_commissionOrderList = Mock.mock( /\/commissionOrder\/commissionOrderList/, function(options) {
    console.log('commissionOrder_commissionOrderList:'+options);
    var searchObj = formatUrlParams(options.body);
    //console.log(searchObj);
    let response={};

    if(searchObj.current_page==1) {

        response = {
            errorCode: null,
            errorMsg: null,
            code: 10,
            msg: '操作成功',
            result: {
                list: [{
                    id: '1',
                    commission_order_no: '888777655',
                    departure_name: '日本',
                    destination_name: '中国',
                    create_time_str: '2017-01-01 12:00',
                    order_status_name: '已下单', // 订单状态 中文名称
                    order_status: 10 // 订单状态 值

                }, {
                    id: '2',
                    commission_order_no: '888777622',
                    departure_name: '日本',
                    destination_name: '中国',
                    create_time_str: '2017-01-01 12:00',
                    order_status_name: '已下单', // 订单状态 中文名称
                    order_status: 10 // 订单状态 值

                }, {
                    id: '3',
                    commission_order_no: '888777633',
                    departure_name: '日本',
                    destination_name: '中国',
                    create_time_str: '2017-01-01 12:00',
                    order_status_name: '已下单', // 订单状态 中文名称
                    order_status: 10 // 订单状态 值

                }, {
                    id: '4',
                    commission_order_no: '888777644',
                    departure_name: '日本',
                    destination_name: '中国',
                    create_time_str: '2017-01-01 12:00',
                    order_status_name: '已下单', // 订单状态 中文名称
                    order_status: 10 // 订单状态 值

                }, {
                    id: '5',
                    commission_order_no: '888777655',
                    departure_name: '日本',
                    destination_name: '中国',
                    create_time_str: '2017-01-01 12:00',
                    order_status_name: '已下单', // 订单状态 中文名称
                    order_status: 10 // 订单状态 值

                },],
            },
        }
    }else if(searchObj.current_page>3){
        response = {
            errorCode: null,
            errorMsg: null,
            code: 10,
            msg: '操作成功',
            result: {
                list: [],
            },
        }
    }else{
        response = {
            errorCode: null,
            errorMsg: null,
            code: 10,
            msg: '操作成功',
            result: {
                list: [{
                    id: ('1'+searchObj.current_page),
                    commission_order_no: '888777655',
                    departure_name: '日本',
                    destination_name: '中国',
                    create_time_str: '2017-01-01 12:00',
                    order_status_name: '已下单', // 订单状态 中文名称
                    order_status: 10 // 订单状态 值

                }, {
                    id: ('2'+searchObj.current_page),
                    commission_order_no: '8887776221',
                    departure_name: '日本',
                    destination_name: '中国',
                    create_time_str: '2017-01-01 12:00',
                    order_status_name: '已下单', // 订单状态 中文名称
                    order_status: 10 // 订单状态 值

                }, {
                    id: ('3'+searchObj.current_page),
                    commission_order_no: '8887776331',
                    departure_name: '日本',
                    destination_name: '中国',
                    create_time_str: '2017-01-01 12:00',
                    order_status_name: '已下单', // 订单状态 中文名称
                    order_status: 10 // 订单状态 值

                }, {
                    id: ('4'+searchObj.current_page),
                    commission_order_no: '888777644',
                    departure_name: '日本',
                    destination_name: '中国',
                    create_time_str: '2017-01-01 12:00',
                    order_status_name: '已下单', // 订单状态 中文名称
                    order_status: 10 // 订单状态 值

                }, {
                    id: ('5'+searchObj.current_page),
                    commission_order_no: '888777655',
                    departure_name: '日本',
                    destination_name: '中国',
                    create_time_str: '2017-01-01 12:00',
                    order_status_name: '已下单', // 订单状态 中文名称
                    order_status: 10 // 订单状态 值

                },],
            },
        }
    }
    return response
});



//服务单列表
export const serviceOrder_serviceOrderList = Mock.mock( /\/serviceOrder\/serviceOrderList/, function(options) {
    console.log('serviceOrder_serviceOrderList:'+options);
    var searchObj = formatUrlParams(options.body);
    //console.log(searchObj);
    let response={};

    if(searchObj.current_page==1) {

        response = {
            errorCode: null,
            errorMsg: null,
            code: 10,
            msg: '操作成功',
            result: {
                list: [{
                    id: '1',
                    commission_order_no: '888777655',
                    departure_name: '日本',
                    destination_name: '中国',
                    create_time_str: '2017-01-01 12:00',
                    order_status_name: '已下单', // 订单状态 中文名称
                    order_status: 10,// 订单状态 值
                    logistics_status:20,
                    total_cost:3000,
                }, {
                    id: '2',
                    commission_order_no: '888777622',
                    departure_name: '日本',
                    destination_name: '中国',
                    create_time_str: '2017-01-01 12:00',
                    order_status_name: '已下单', // 订单状态 中文名称
                    order_status: 10,// 订单状态 值
                    logistics_status:20,
                    total_cost:3000,
                }, {
                    id: '3',
                    commission_order_no: '888777633',
                    departure_name: '日本',
                    destination_name: '中国',
                    create_time_str: '2017-01-01 12:00',
                    order_status_name: '已下单', // 订单状态 中文名称
                    order_status: 10,// 订单状态 值
                    logistics_status:20,
                    total_cost:3000,
                }, {
                    id: '4',
                    commission_order_no: '888777644',
                    departure_name: '日本',
                    destination_name: '中国',
                    create_time_str: '2017-01-01 12:00',
                    order_status_name: '已下单', // 订单状态 中文名称
                    order_status: 10,// 订单状态 值
                    logistics_status:20,
                    total_cost:3000,
                }, {
                    id: '5',
                    commission_order_no: '888777655',
                    departure_name: '日本',
                    destination_name: '中国',
                    create_time_str: '2017-01-01 12:00',
                    order_status_name: '已下单', // 订单状态 中文名称
                    order_status: 10,// 订单状态 值
                    logistics_status:20,
                    total_cost:3000,
                },],
            },
        }
    }else if(searchObj.current_page>3){
        response = {
            errorCode: null,
            errorMsg: null,
            code: 10,
            msg: '操作成功',
            result: {
                list: [],
            },
        }
    }else{
        response = {
            errorCode: null,
            errorMsg: null,
            code: 10,
            msg: '操作成功',
            result: {
                list: [{
                    id: ('1'+searchObj.current_page),
                    commission_order_no: '888777655',
                    departure_name: '日本',
                    destination_name: '中国',
                    create_time_str: '2017-01-01 12:00',
                    order_status_name: '已下单', // 订单状态 中文名称
                    order_status: 10,// 订单状态 值
                    logistics_status:20,
                    total_cost:3000,
                }, {
                    id: ('2'+searchObj.current_page),
                    commission_order_no: '8887776221',
                    departure_name: '日本',
                    destination_name: '中国',
                    create_time_str: '2017-01-01 12:00',
                    order_status_name: '已下单', // 订单状态 中文名称
                    order_status: 10,// 订单状态 值
                    logistics_status:20,
                    total_cost:3000,
                }, {
                    id: ('3'+searchObj.current_page),
                    commission_order_no: '8887776331',
                    departure_name: '日本',
                    destination_name: '中国',
                    create_time_str: '2017-01-01 12:00',
                    order_status_name: '已下单', // 订单状态 中文名称
                    order_status: 10,// 订单状态 值
                    logistics_status:20,
                    total_cost:3000,
                }, {
                    id: ('4'+searchObj.current_page),
                    commission_order_no: '888777644',
                    departure_name: '日本',
                    destination_name: '中国',
                    create_time_str: '2017-01-01 12:00',
                    order_status_name: '已下单', // 订单状态 中文名称
                    order_status: 10,// 订单状态 值
                    logistics_status:20,
                    total_cost:3000,
                }, {
                    id: ('5'+searchObj.current_page),
                    commission_order_no: '888777655',
                    departure_name: '日本',
                    destination_name: '中国',
                    create_time_str: '2017-01-01 12:00',
                    order_status_name: '已下单', // 订单状态 中文名称
                    order_status: 10,// 订单状态 值
                    logistics_status:20,
                    total_cost:3000,
                },],
            },
        }
    }
    return response
});
//消息列表
export const message_findSysInfoShow = Mock.mock( /\/message\/findSysInfoShow/, function(options) {
    console.log('message_findSysInfoShow:'+options);
    var searchObj = formatUrlParams(options.body);
    //console.log(searchObj);
    let response={};
    if(!searchObj.memberId) return '{"errorCode":"-202","errorMsg":"未登录或登录超时","code":null,"msg":null,"result":null,"recordsTotal":0,"recordsFiltered":0,"data":null,"permissions":null,"tokenName":null,"tokenVal":null}'

    if(searchObj.current_page==1) {

        response = {
            errorCode: null,
            errorMsg: null,
            code: 10,
            msg: '操作成功',
            result: {
                list: [{
                    id: '1',
                    sender: '管理员',
                    title: '标题',
                    brief: '简介',
                    send_time: '2017-01-01 12:00',
                }, {
                    id: '2',
                    sender: '管理员',
                    title: '标题',
                    brief: '简介',
                    send_time: '2017-01-01 12:00',
                }, {
                    id: '3',
                    sender: '管理员',
                    title: '标题',
                    brief: '简介',
                    send_time: '2017-01-01 12:00',
                }, {
                    id: '4',
                    sender: '管理员',
                    title: '标题',
                    brief: '简介',
                    send_time: '2017-01-01 12:00',
                }, {
                    id: '5',
                    sender: '管理员',
                    title: '标题',
                    brief: '简介',
                    send_time: '2017-01-01 12:00',
                },{
                    id: '6',
                    sender: '管理员',
                    title: '标题',
                    brief: '简介',
                    send_time: '2017-01-01 12:00',
                },{
                    id: '7',
                    sender: '管理员',
                    title: '标题',
                    brief: '简介',
                    send_time: '2017-01-01 12:00',
                },{
                    id: '8',
                    sender: '管理员',
                    title: '标题',
                    brief: '简介',
                    send_time: '2017-01-01 12:00',
                },{
                    id: '9',
                    sender: '管理员',
                    title: '标题',
                    brief: '简介',
                    send_time: '2017-01-01 12:00',
                },{
                    id: '10',
                    sender: '管理员',
                    title: '标题',
                    brief: '简介',
                    send_time: '2017-01-01 12:00',
                },],
            },
        }
    }else if(searchObj.current_page>3){
        response = {
            errorCode: null,
            errorMsg: null,
            code: 10,
            msg: '操作成功',
            result: {
                list: [],
            },
        }
    }else{
        response = {
            errorCode: null,
            errorMsg: null,
            code: 10,
            msg: '操作成功',
            result: {
                list: [{
                    id: ('1'+searchObj.current_page),
                    sender: '管理员',
                    title: '标题',
                    brief: '简介',
                    send_time: '2017-01-01 12:00',
                }, {
                    id: ('2'+searchObj.current_page),
                    sender: '管理员',
                    title: '标题',
                    brief: '简介',
                    send_time: '2017-01-01 12:00',
                }, {
                    id: ('3'+searchObj.current_page),
                    sender: '管理员',
                    title: '标题',
                    brief: '简介',
                    send_time: '2017-01-01 12:00',
                }, {
                    id: ('4'+searchObj.current_page),
                    sender: '管理员',
                    title: '标题',
                    brief: '简介',
                    send_time: '2017-01-01 12:00',
                }, {
                    id: ('5'+searchObj.current_page),
                    sender: '管理员',
                    title: '标题',
                    brief: '简介',
                    send_time: '2017-01-01 12:00',
                },],
            },
        }
    }
    return response
});


