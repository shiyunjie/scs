

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
    let response = {
        errorCode: null,
        errorMsg: null,
        code: 10,
        msg: '操作成功',
        result: {
            list: [{
                file_url: '',
                big_url: 'http://www.doorto.cn/images/banner-01.jpg',
                id: '1',
            }, {
                file_url: '',
                big_url: 'http://www.doorto.cn/images/banner-02.jpg',
                id: '1',
            } ],
        },
    }
    return response
});


