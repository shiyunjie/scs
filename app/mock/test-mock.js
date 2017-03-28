/**
 * @fileoverview
 * @since 17/1/30 22:05
 * @author chenyiqin
 */

import {NativeModules,} from 'react-native'
import Url from 'url'
import fetchMock from 'fetch-mock'

const HttpRSAModule = NativeModules.HttpRSAModule;

//fetchMock.get(/facebook.github.io/, (url, opts) => {
export const testMock = fetchMock.mock(/\/app\/gateway/, (url, opts) => {
    //console.log(`fetchMock url, opts = `, url, opts)

    /*
     let parsedUrlObj = Url.parse(url)
     let {query,} = parsedUrlObj
     let params, param, keyValue, queryParam = {}
     if(query) {
     params = query.split('&')
     for(let param of params) {
     keyValue = param.split('=')
     queryParam[keyValue[0]] = keyValue[1]
     }
     }
     console.log(`queryParam = `, queryParam)*/

    let result
    let {data,} =opts
    return new Promise((resolve, reject) => {

        this.gunZip(data.s).then(
            (parameter)=> {
                //请求参数获得
                //console.log(`parameter:`, parameter)
                let requestData = JSON.parse(parameter)
                //console.log(`parameter_itype:`, requestData.itype)
                //console.log(`fetchMock parameter:`, requestData)
                switch (requestData.itype) {
                    //首页轮播
                    case 111:
                        result = {
                            code: 10,
                            msg: 'msg',
                            result: [{
                                file_url: 'http://www.doorto.cn/images/banner-02.jpg',
                                big_url: 'http://www.doorto.cn/images/banner-02.jpg',
                                sort_no:1
                            },
                                {
                                    file_url: 'http://www.doorto.cn/images/banner-01.jpg',
                                    big_url: 'http://www.doorto.cn/images/banner-01.jpg',
                                    sort_no:2
                                },
                            ]
                        }
                        break;
                    //登录
                    case 100:
                        if (requestData.data.member_name == '13816062603') {
                            result = {
                                code: 10,
                                msg: '登录成功',
                                result: {
                                    real_name: '测试用户',
                                    token: 'ddggkkmsnhjksdnknnudhjijjmsmpooj',
                                    phone: '13816062603',
                                },
                            }
                        } else {
                            result = {code: -10, msg: '用户名或者密码错误'}
                        }
                        break;
                    //查询询价单列表
                    case 232:
                        if (requestData.data.current_page == 1) {
                            result = {
                                code: 10,
                                msg: '查询询价单列表',
                                result: [
                                    {
                                        id: '1234567891',
                                        commission_order_no: 'no2255361',
                                        create_time_str: '2017-01-31 19:00',
                                        order_status_name: '已下单',
                                        departure_name: '澳大利亚',
                                        destination_name: '中国',
                                    },
                                    {
                                        id: '1234567892',
                                        commission_order_no: 'no2255362',
                                        create_time_str: '2017-01-31 19:00',
                                        order_status_name: '已取消',
                                        departure_name: '澳大利亚',
                                        destination_name: '中国',
                                    },
                                    {
                                        id: '1234567893',
                                        commission_order_no: 'no2255363',
                                        create_time_str: '2017-01-31 19:00',
                                        order_status_name: '已下单',
                                        departure_name: '中国',
                                        destination_name: '日本',
                                    },
                                    {
                                        id: '1234567894',
                                        commission_order_no: 'no2255364',
                                        create_time_str: '2017-01-31 19:00',
                                        order_status_name: '待报价',
                                        departure_name: '澳大利亚',
                                        destination_name: '中国',
                                    },
                                    {
                                        id: '1234567895',
                                        commission_order_no: 'no2255365',
                                        create_time_str: '2017-01-31 19:00',
                                        order_status_name: '已下单',
                                        departure_name: '澳大利亚',
                                        destination_name: '中国',
                                    },
                                    {
                                        id: '1234567901',
                                        commission_order_no: 'no2255373',
                                        create_time_str: '2017-01-31 19:50',
                                        order_status_name: '已下单',
                                        departure_name: '澳大利亚',
                                        destination_name: '中国',
                                    },
                                    {
                                        id: '1234567903',
                                        commission_order_no: 'no2255373',
                                        create_time_str: '2017-01-31 19:50',
                                        order_status_name: '已下单',
                                        departure_name: '澳大利亚',
                                        destination_name: '中国',
                                    },
                                    {
                                        id: '1234567895',
                                        commission_order_no: 'no2255965',
                                        create_time_str: '2017-01-31 19:00',
                                        order_status_name: '已下单',
                                        departure_name: '澳大利亚',
                                        destination_name: '中国',
                                    },
                                    {
                                        id: '1234567901',
                                        commission_order_no: 'no2255973',
                                        create_time_str: '2017-01-31 19:50',
                                        order_status_name: '已下单',
                                        departure_name: '澳大利亚',
                                        destination_name: '中国',
                                    },
                                    {
                                        id: '1234567903',
                                        commission_order_no: 'no2255973',
                                        create_time_str: '2017-01-31 19:50',
                                        order_status_name: '已下单',
                                        departure_name: '澳大利亚',
                                        destination_name: '中国',
                                    },
                                ],
                            }
                        } else if (requestData.data.current_page == 2) {
                            result = {
                                code: 10,
                                msg: '查询询价单列表',
                                result: [
                                    {
                                        id: '1234567896',
                                        commission_order_no: 'no2255366',
                                        create_time_str: '2017-01-31 19:00',
                                        order_status_name: '已下单',
                                        departure_name: '澳大利亚',
                                        destination_name: '中国',
                                    },
                                    {
                                        id: '1234567897',
                                        commission_order_no: 'no2255367',
                                        create_time_str: '2017-01-31 19:00',
                                        order_status_name: '已取消',
                                        departure_name: '中国',
                                        destination_name: '香港',
                                    },
                                    {
                                        id: '1234567898',
                                        commission_order_no: 'no2255368',
                                        create_time_str: '2017-01-31 20:00',
                                        order_status_name: '已下单',
                                        departure_name: '中国',
                                        destination_name: '日本',
                                    },
                                    {
                                        id: '1234567899',
                                        commission_order_no: 'no2255369',
                                        create_time_str: '2017-01-31 21:00',
                                        order_status_name: '待报价',
                                        departure_name: '澳大利亚',
                                        destination_name: '中国',
                                    },
                                    {
                                        id: '1234567900',
                                        commission_order_no: 'no2255370',
                                        create_time_str: '2017-01-31 22:00',
                                        order_status_name: '已下单',
                                        departure_name: '澳大利亚',
                                        destination_name: '中国',
                                    },
                                    {
                                        id: '1234567902',
                                        commission_order_no: 'no2255372',
                                        create_time_str: '2017-01-31 22:50',
                                        order_status_name: '已下单',
                                        departure_name: '日本',
                                        destination_name: '中国',
                                    },
                                    {
                                        id: '1234567904',
                                        commission_order_no: 'no2255373',
                                        create_time_str: '2017-01-31 19:50',
                                        order_status_name: '已下单',
                                        departure_name: '澳大利亚',
                                        destination_name: '中国',
                                    },
                                    {
                                        id: '1234567895',
                                        commission_order_no: 'no2255865',
                                        create_time_str: '2017-01-31 19:00',
                                        order_status_name: '已下单',
                                        departure_name: '澳大利亚',
                                        destination_name: '中国',
                                    },
                                    {
                                        id: '1234567901',
                                        commission_order_no: 'no2255873',
                                        create_time_str: '2017-01-31 19:50',
                                        order_status_name: '已下单',
                                        departure_name: '澳大利亚',
                                        destination_name: '中国',
                                    },
                                    {
                                        id: '1234567903',
                                        commission_order_no: 'no2255873',
                                        create_time_str: '2017-01-31 19:50',
                                        order_status_name: '已下单',
                                        departure_name: '澳大利亚',
                                        destination_name: '中国',
                                    },
                                ],
                            }
                        } else {
                            result = {
                                code: 10,
                                msg: '查询询价单列表',
                                result: [],
                            }
                        }
                        break;
                    case 233:
                        if (requestData.data.id) {
                            result = {
                                code: 10,
                                msg: '取消成功',
                                result: {

                                },
                            }
                        } else {
                            result = {code: -10, msg: '系统异常'}
                        }
                        break;
                    //服务单列表
                    case 331:

                        if (requestData.data.current_page == 1) {
                            result = {
                                code: 10,
                                msg: '查询服务单列表',
                                result: [
                                    {
                                        id: '1234567891',
                                        commission_order_no: 'no2255361',
                                        create_time_str: '2017-01-31 19:00',
                                        order_status_name: '已报价',
                                        logistics_status_str: '已抵达',
                                        total_cost: '20078',
                                        departure_name: '澳大利亚',
                                        destination_name: '中国',
                                    },
                                    {
                                        id: '1234567892',
                                        commission_order_no: 'no2255362',
                                        create_time_str: '2017-01-31 19:00',
                                        order_status_name: '已失效',
                                        logistics_status_str: '待报关',
                                        total_cost: '10012',
                                        departure_name: '澳大利亚',
                                        destination_name: '中国',
                                    },
                                    {
                                        id: '1234567893',
                                        commission_order_no: 'no2255363',
                                        create_time_str: '2017-01-31 19:00',
                                        order_status_name: '待报价',
                                        logistics_status_str: '',
                                        total_cost: '30034',
                                        departure_name: '中国',
                                        destination_name: '日本',
                                    },
                                    {
                                        id: '1234567894',
                                        commission_order_no: 'no2255364',
                                        create_time_str: '2017-01-31 19:00',
                                        order_status_name: '待报价',
                                        logistics_status_str: '',
                                        total_cost: '1022',
                                        departure_name: '澳大利亚',
                                        destination_name: '中国',
                                    },
                                    {
                                        id: '1234567895',
                                        commission_order_no: 'no2255365',
                                        create_time_str: '2017-01-31 19:00',
                                        order_status_name: '已下发',
                                        logistics_status_str: '已抵达',
                                        total_cost: '3022',
                                        departure_name: '澳大利亚',
                                        destination_name: '中国',
                                    },
                                    {
                                        id: '1234567901',
                                        commission_order_no: 'no2255373',
                                        create_time_str: '2017-01-31 19:50',
                                        order_status_name: '待报价',
                                        logistics_status_str: '',
                                        total_cost: '13045',
                                        departure_name: '澳大利亚',
                                        destination_name: '中国',
                                    },
                                    {
                                        id: '1234567901',
                                        commission_order_no: 'no2255373',
                                        create_time_str: '2017-01-31 19:50',
                                        order_status_name: '待报价',
                                        logistics_status_str: '',
                                        total_cost: '13067',
                                        departure_name: '澳大利亚',
                                        destination_name: '中国',
                                    },
                                    {
                                        id: '1234567901',
                                        commission_order_no: 'no2255373',
                                        create_time_str: '2017-01-31 19:50',
                                        order_status_name: '待报价',
                                        logistics_status_str: '',
                                        total_cost: '13015',
                                        departure_name: '澳大利亚',
                                        destination_name: '中国',
                                    },
                                    {
                                        id: '1234567901',
                                        commission_order_no: 'no2255373',
                                        create_time_str: '2017-01-31 19:50',
                                        order_status_name: '待报价',
                                        logistics_status_str: '',
                                        total_cost: '13005',
                                        departure_name: '澳大利亚',
                                        destination_name: '中国',
                                    },
                                    {
                                        id: '1234567901',
                                        commission_order_no: 'no2255373',
                                        create_time_str: '2017-01-31 19:50',
                                        order_status_name: '待报价',
                                        logistics_status_str: '',
                                        total_cost: '13007',
                                        departure_name: '澳大利亚',
                                        destination_name: '中国',
                                    },
                                ],
                            }
                        } else if (requestData.data.current_page == 2) {
                            result = {
                                code: 10,
                                msg: '查询询价单列表',
                                result: [
                                    {
                                        id: '1234567896',
                                        commission_order_no: 'no2255366',
                                        create_time_str: '2017-01-31 19:00',
                                        order_status_name: '已报价',
                                        logistics_status_str: '已抵达',
                                        total_cost: '3013',
                                        departure_name: '澳大利亚',
                                        destination_name: '中国',
                                    },
                                    {
                                        id: '1234567897',
                                        commission_order_no: 'no2255367',
                                        create_time_str: '2017-01-31 19:00',
                                        order_status_name: '已失效',
                                        logistics_status_str: '已抵达',
                                        total_cost: '3012',
                                        departure_name: '中国',
                                        destination_name: '香港',
                                    },
                                    {
                                        id: '1234567898',
                                        commission_order_no: 'no2255368',
                                        create_time_str: '2017-01-31 20:00',
                                        order_status_name: '已报价',
                                        logistics_status_str: '',
                                        total_cost: '6001',
                                        departure_name: '中国',
                                        destination_name: '日本',
                                    },
                                    {
                                        id: '1234567899',
                                        commission_order_no: 'no2255369',
                                        create_time_str: '2017-01-31 21:00',
                                        order_status_name: '待报价',
                                        logistics_status_str: '',
                                        total_cost: '4002',
                                        departure_name: '澳大利亚',
                                        destination_name: '中国',
                                    },
                                    {
                                        id: '1234567900',
                                        commission_order_no: 'no2255370',
                                        create_time_str: '2017-01-31 22:00',
                                        order_status_name: '已下发',
                                        logistics_status_str: '已抵达',
                                        total_cost: '3001',
                                        departure_name: '澳大利亚',
                                        destination_name: '中国',
                                    },
                                    {
                                        id: '1234567902',
                                        commission_order_no: 'no2255372',
                                        create_time_str: '2017-01-31 22:50',
                                        order_status_name: '待报价6',
                                        logistics_status_str: '',
                                        total_cost: '3002',
                                        departure_name: '日本',
                                        destination_name: '中国',
                                    },
                                    {
                                        id: '1234567902',
                                        commission_order_no: 'no2255372',
                                        create_time_str: '2017-01-31 22:50',
                                        order_status_name: '待报价4',
                                        logistics_status_str: '',
                                        total_cost: '3000',
                                        departure_name: '日本',
                                        destination_name: '中国',
                                    },
                                    {
                                        id: '1234567902',
                                        commission_order_no: 'no2255372',
                                        create_time_str: '2017-01-31 22:50',
                                        order_status_name: '待报价1',
                                        logistics_status_str: '',
                                        total_cost: '3003',
                                        departure_name: '日本',
                                        destination_name: '中国',
                                    },
                                    {
                                        id: '1434567902',
                                        commission_order_no: 'no2255372',
                                        create_time_str: '2017-01-31 22:50',
                                        order_status_name: '待报价2',
                                        logistics_status_str: '',
                                        total_cost: '3004',
                                        departure_name: '日本',
                                        destination_name: '中国',
                                    },
                                    {
                                        id: '1334567902',
                                        commission_order_no: 'no2255372',
                                        create_time_str: '2017-01-31 22:50',
                                        order_status_name: '待报价3',
                                        logistics_status_str: '',
                                        total_cost: '3005',
                                        departure_name: '日本',
                                        destination_name: '中国',
                                    },
                                ],
                            }
                        } else {
                            result = {
                                code: 10,
                                msg: '查询服务单单列表',
                                result: [],
                            }
                        }
                        break;
                    //委托单详情
                    case 234:
                        if (requestData.data.id) {

                            result = {
                                code: 10,
                                msg: '查询成功',
                                result: {
                                    commissionOrder: {
                                        service_no: 'no778299381',// 委托单号

                                        order_status_name: '待接单',// 订单状态

                                        create_time_str: '2017-01-31 19:00',// 发布时间

                                        remark: '你的出价实在太低了',// 备注

                                        trade_terms: 'FOB',// 贸易条款

                                        departure_name: '中国',// 起运国

                                        destination_name: '澳大利亚',// 目的国

                                        import_clearance: 0,// 进口清关,0否，1是

                                        international_logistics: 1,// 国际物流,0否，1是

                                        export_country_land: 1,// 出口国陆运,0否，1是

                                        booking_service_name: 0,// 订舱服务,0海运，1空运

                                        domestic_logistics: 1,// 国内物流,0否，1是

                                        credit_letter: 1,// 信用证,0否，1是

                                        client_name: '张先生',// 委托人名称

                                        client_phone: '13988255783',// 委托人电话

                                        order_status: 40,// 订单状态 值

                                        commission_content: '小心轻放,易碎物品',//委托内容
                                        cash: 0,// 现金 ,0否，1是
                                        trans: 0,// 转账 ,0否，1是
                                        aliPay: 1,// 支付宝 ,0否，1是
                                        receiving_address: '百度商业大厦',// 收货地址
                                    },
                                    list:[{
                                        file_url:'http://o2o.doorto.cn/upload/yun-o2o/ff8080814f2ab654014f2b9ad24b063a.jpg',
                                        id: '1998276354428',
                                        filename:'Imagedemo',
                                        file_mine:'image/jpg',
                                        big_url: 'http://o2o.doorto.cn/upload/yun-o2o/ff8080814f2ab654014f2b9ad24b063a.jpg',
                                        }]

                                },
                            }

                        } else {
                            result = {
                                code: -10,
                                msg: '系统错误',
                                result: {},
                            }
                        }
                        break;
                    //服务单详情
                    case 332:
                        if (requestData.data.id) {
                            result = {
                                code: 10,
                                msg: '查询成功',
                                result: {
                                    service_no: 'sn277399421',// 服务单号

                                    order_status_name: '已报价',// 服务单状态名称

                                    order_status: 50,// 服务单状态

                                    remark: '服务单演示',// 备注

                                    trade_terms: 'FOB',// 贸易条款

                                    country_name: '中国',// 起运国

                                    destination_name: '澳大利亚',// 目的国

                                    logistics_status_name: '已接单',// 物流状态名称

                                    time_name: '2017-01-31 22:00',// 接单时间


                                    import_clearance: 0,// 进口清关,0否，1是

                                    international_logistics: 1,// 国际物流,0否，1是

                                    export_country_land: 1,// 出口国陆运,0否，1是

                                    booking_service_name: 0,// 订舱服务,0海运，1空运

                                    domestic_logistics: 1,// 国内物流,0否，1是

                                    credit_letter: 1,// 信用证0否，1是

                                    client_name: '张先生',// 委托人

                                    client_phone: '13822988732',// 联系电话

                                    commission_content: '易碎,小心搬运',// 委托内容

                                    ship_company_code: 'UASC',// 船公司代码

                                    ship_company_name: '阿拉伯船公司',// 船公司名称
                                    pot_cd: '宁波',// 申报口岸

                                    ship_name_english: 'UASC NINGBO',// 英文船名

                                    voyage: '062W',// 航次

                                    bill_num: 'GNNBO0343225',// 提单号

                                    destination_port_name: 'AUSXN',// 目的港

                                    box_quantity_information: '45GP*2',// 箱型数量信息

                                    suitcase_yard: '兴合货柜',// 提箱堆场

                                    packing_place: '周口码头',// 装箱地点

                                    number: 10,// 件数

                                    weight: 10234,// 毛重

                                    volume: 234,// 体积

                                    contract_number: 'GN88376221',// 合同号

                                    billing_number: '9872266351',// 发票号

                                    consignee_name: 'YGS',// 收货人

                                    consignor_name: 'FSQ',// 发货人


                                },
                            }

                        } else {
                            result = {
                                code: -10,
                                msg: '系统错误',
                                result: {},
                            }
                        }
                        break;
                    //物流状态
                    case 334:
                        if (requestData.data.id) {
                            result = {
                                code: 10,
                                msg: '查询成功',
                                result: [{
                                    status_name: '已订舱',// 物流状态名称

                                    time_name: '订舱时间',//  时间名称

                                    create_time_str: '2017-01-12 00:22:21',//  时间

                                    box_no: 'status_name',// 箱号

                                    //seal_no 铅封号

                                }, {
                                    status_name: '国外已进港',// 物流状态名称

                                    time_name: '进港时间',//  时间名称

                                    create_time_str: '2017-01-13 07:22:21',//  时间

                                    //box_no: 'status_name',// 箱号

                                    seal_no: 'seal_no' //铅封号

                                }, {
                                    status_name: '国外已装船',// 物流状态名称

                                    time_name: '装船时间',//  时间名称

                                    create_time_str: '2017-01-22 00:22:21',//  时间

                                    //box_no: 'status_name',// 箱号

                                    //seal_no:'seal_no' //铅封号

                                }, {
                                    status_name: '预计开船时间',// 物流状态名称

                                    time_name: '开船时间',//  时间名称

                                    create_time_str: '2017-01-22 00:22:21',//  时间

                                    //box_no: 'status_name',// 箱号

                                    //seal_no:'seal_no' //铅封号

                                }],
                            }

                        } else {
                            result = {
                                code: -10,
                                msg: '系统错误',
                                result: {},
                            }
                        }
                        break;
                    case 335:
                        if (requestData.data.id) {
                            result = {
                                code: 10,
                                msg: '取消成功',
                                result: {

                                },
                            }
                        } else {
                            result = {code: -10, msg: '系统异常'}
                        }
                        break;
                    //账单
                    case 333:
                        if (requestData.data.id) {
                            result = {
                                code: 10,
                                msg: '查询成功',
                                result: [ { first_cost_name: '海运费',
                                    cost_name: '海运费',
                                    estimate_cost: 2,
                                    cost: 0,
                                    id: '402881665986f1fe015986f57908001b',
                                    is_cal: 0,
                                    is_pay: 1 },
                                    { first_cost_name: '国外清关费',
                                        cost_name: '国外清关费',
                                        estimate_cost: 1,
                                        cost: 1,
                                        id: '402881665986f1fe015986f5790a001c',
                                        is_cal: 0,
                                        is_pay: 0 },
                                    { first_cost_name: '国外单证费',
                                        cost_name: '国外单证费',
                                        estimate_cost: 1,
                                        cost: 0,
                                        id: '402881665986f1fe015986f5790d001d',
                                        is_cal: 0,
                                        is_pay: 1 },
                                    { first_cost_name: '安保费',
                                        cost_name: '安保费',
                                        estimate_cost: 1,
                                        cost: 1,
                                        id: '402881665986f1fe015986f5790f001e',
                                        is_cal: 0,
                                        is_pay: 0 },
                                    { first_cost_name: '国外杂费',
                                        cost_name: '国外杂费',
                                        estimate_cost: 1,
                                        cost: 0,
                                        id: '402881665986f1fe015986f57911001f',
                                        is_cal: 0,
                                        is_pay: 1 },
                                    { first_cost_name: '代理',
                                        cost_name: '进口代理费（买方没购买资质，可用我司资质来报关）',
                                        estimate_cost: 1,
                                        cost: 0,
                                        id: '402881665986f1fe015986f579130020',
                                        is_cal: 0,
                                        is_pay: 1 },
                                    { first_cost_name: '备案',
                                        cost_name: '收货人备案',
                                        estimate_cost: 1,
                                        cost: 1,
                                        id: '402881665986f1fe015986f579150021',
                                        is_cal: 0,
                                        is_pay: 0 },
                                    { first_cost_name: '换单',
                                        cost_name: '换单费',
                                        estimate_cost: 11,
                                        cost: 1,
                                        id: '402881665986f1fe015986f579180022',
                                        is_cal: 0,
                                        is_pay: 0 },
                                    { first_cost_name: '报关',
                                        cost_name: '报关费',
                                        estimate_cost: 1,
                                        cost: 0,
                                        id: '402881665986f1fe015986f5791b0023',
                                        is_cal: 0,
                                        is_pay: 1 },
                                    { first_cost_name: '报关',
                                        cost_name: '报关品名联单费',
                                        estimate_cost: 1,
                                        cost: 0,
                                        id: '402881665986f1fe015986f5791d0024',
                                        is_cal: 0,
                                        is_pay: 1 },
                                    { first_cost_name: '报关',
                                        cost_name: '报检费',
                                        estimate_cost: 11,
                                        cost: 0,
                                        id: '402881665986f1fe015986f5791f0025',
                                        is_cal: 0,
                                        is_pay: 1 },
                                    { first_cost_name: '查验',
                                        cost_name: '海关查验费',
                                        estimate_cost: 1,
                                        cost: 1,
                                        id: '402881665986f1fe015986f579220026',
                                        is_cal: 0,
                                        is_pay: 0 },
                                    { first_cost_name: '查验',
                                        cost_name: '商检查验费',
                                        estimate_cost: 1,
                                        cost: 1,
                                        id: '402881665986f1fe015986f579240027',
                                        is_cal: 0,
                                        is_pay: 1 },
                                    { first_cost_name: '查验',
                                        cost_name: '检验检疫费',
                                        estimate_cost: 1,
                                        cost: 1,
                                        id: '402881665986f1fe015986f579260028',
                                        is_cal: 0,
                                        is_pay: 0 },
                                    { first_cost_name: '税费',
                                        cost_name: '关税',
                                        estimate_cost: 1,
                                        cost: 0,
                                        id: '402881665986f1fe015986f579280029',
                                        is_cal: 0,
                                        is_pay: 1 },
                                    { first_cost_name: '税费',
                                        cost_name: '增值税',
                                        estimate_cost: 11,
                                        cost: 0,
                                        id: '402881665986f1fe015986f5792a002a',
                                        is_cal: 0,
                                        is_pay: 1 },
                                    { first_cost_name: '税费',
                                        cost_name: '电子自付费',
                                        estimate_cost: 1,
                                        cost: 0,
                                        id: '402881665986f1fe015986f5792c002b',
                                        is_cal: 0,
                                        is_pay: 1 },
                                    { first_cost_name: '仓储',
                                        cost_name: '整改仓储费',
                                        estimate_cost: 1,
                                        cost: 0,
                                        id: '402881665986f1fe015986f5792f002c',
                                        is_cal: 0,
                                        is_pay: 0 },
                                    { first_cost_name: '仓储',
                                        cost_name: '海关仓库仓储费（散货）',
                                        estimate_cost: 0,
                                        cost: 0,
                                        id: '402881665986f1fe015986f57931002d',
                                        is_cal: 0,
                                        is_pay: 0 },
                                    { first_cost_name: '服务费总金额',
                                        cost_name: '服务费总金额',
                                        estimate_cost: 6,
                                        cost: 6,
                                        id: '402881665986f1fe015986f579311999',
                                        is_cal: 0,
                                        is_pay: 0 },{ first_cost_name: '服务费总金额',
                                        cost_name: '服务费总金额',
                                        estimate_cost: 6,
                                        cost: 6,
                                        id: '402881665986f1fe015986f579311999',
                                        is_cal: 0,
                                        is_pay: 0 },
                                    { first_cost_name: '服务费税额',
                                        cost_name: '服务费税额',
                                        estimate_cost: 0.6,
                                        cost: 0.6,
                                        id: '402881665986f1fe015986f579311999',
                                        is_cal: 0,
                                        is_pay: 0 },
                                    { first_cost_name: '服务费价税合计',
                                        cost_name: '服务费价税合计',
                                        estimate_cost: 6.6,
                                        cost: 6.6,
                                        id: '402881665986f1fe015986f579311999',
                                        is_cal: 0,
                                        is_pay: 0 },]
                            }

                        } else {
                            result = {
                                code: -10,
                                msg: '系统错误',
                                result: {},
                            }
                        }
                        break;
                    //注册 忘记密码  发送验证码
                    case 101:
                    case 104:
                        if (requestData.data.phone) {
                            result = {
                                code: 10,
                                msg: '发送成功,验证码为:2345',
                                result: {},
                            }

                        } else {
                            result = {
                                code: -10,
                                msg: '系统错误',
                                result: {},
                            }
                        }
                        break;
                    //注册 忘记密码  下一步
                    case 105:
                    case 102:
                        if (requestData.data.phone && requestData.data.code == 2345) {
                            result = {
                                code: 10,
                                msg: '认证成功',
                                result: {},
                            }

                        } else {
                            result = {
                                code: -10,
                                msg: '系统错误',
                                result: {},
                            }
                        }
                        break;
                    //忘记密码
                    case 106:
                        if(requestData.data.pwd==requestData.data.surePwd){
                            result = {
                                code: 10,
                                msg: '设置密码成功',
                                result: {},
                            }
                        }else{
                            result = {
                                code: -10,
                                msg: '系统错误',
                                result: {},
                            }
                        }
                        break;
                    //修改密码
                    case 131:
                        if(requestData.data.old_pwd==`e10adc3949ba59abbe56e057f20f883e`&&requestData.data.pwd==requestData.data.surePwd){
                            result = {
                                code: 10,
                                msg: '修改密码成功',
                                result: {},
                            }
                        }else if(requestData.data.old_pwd!=`e10adc3949ba59abbe56e057f20f883e`){
                            result = {
                                code: -15,
                                msg: '原密码错误',
                                result: {},
                            }
                        }else{
                            result = {
                                code: -10,
                                msg: '系统错误',
                                result: {},
                            }
                        }
                        break;
                    //加载用户信息
                    case 132:
                            result = {
                                code: 10,
                                msg: '修改密码成功',
                                result: {
                                    account: 'shi',
                                    email: 'shiyunjie@defan-net.com',
                                    qq: '2877365423',
                                    phone: '13818667266',
                                    real_name: '测试用户',
                                    contact_time: '任意',
                                    company_name: '报关公司',
                                    company_address: '上海市长寿路652号10号楼',
                                    company_introduction: '软件开发,IT解决方案',},
                            }

                        break;
                    //修改用户信息
                    case 133:
                        if(requestData.data.qq){
                            result = {
                                code: 10,
                                msg: '修改信息成功',
                                result: {}
                            }
                        }else{
                            result = {
                                code: -10,
                                msg: '系统错误',
                                result: {},
                            }
                        }

                        break;
                    //注册用户
                    case 103:
                        if(requestData.data.pwd&&requestData.data.real_name&&requestData.data.email
                        &&requestData.data.sure_pwd==requestData.data.pwd) {
                            result = {
                                code: 10,
                                msg: '注册用户成功',
                                result: `tokensjjncmkasllpdijosmmxdxsnnakijsammzlospkd`
                            }
                        }else if(requestData.data.sure_pwd!=requestData.data.pwd){
                            result = {
                                code: -17,
                                msg: '两次密码不一致',
                                result: {}
                            }
                        }else{
                            result = {
                                code: -10,
                                msg: '系统错误',
                                result: {},
                            }
                        }
                        break;
                    //用户反馈
                    case 431:
                        if(requestData.data.content) {
                            result = {
                                code: 10,
                                msg: '修改密码成功',
                                result:{}
                            }
                        }else{
                            result = {
                                code: -10,
                                msg: '系统错误',
                                result: {},
                            }
                        }
                        break;
                    //消息列表
                    case 531:
                        if (requestData.data.current_page == 1) {
                            result = {
                                code: 10,
                                msg: '查询消息列表',
                                result: [
                                    {   id:'fshvv8889276551111',
                                        title: '测试消息',
                                        send_time: '2017-1-11',
                                        content: '欢迎使用本系统',
                                        do_ret:true,
                                    }, {   id:'fshvv8889276551112',
                                        title: '用户确认消息',
                                        send_time: '2017-1-11',
                                        content: '用户确认消息',
                                        do_ret:true,
                                    },{   id:'fshvv8889276551113',
                                        title: '服务单确认信息',
                                        send_time: '2017-1-11',
                                        content: '你已经确认报价',
                                        do_ret:false,
                                    },{   id:'fshvv8889276551114',
                                        title: '委托单通知',
                                        send_time: '2017-1-12',
                                        content: '您有一份新报价待查看',
                                        do_ret:false,
                                    },{   id:'fshvv8889276551115',
                                        title: '服务单进度通知',
                                        send_time: '2017-1-15',
                                        content: '服务单进度通知,货物已到港查收',
                                        do_ret:false,
                                    },{   id:'fshvv8889276551116',
                                        title: '付款确认',
                                        send_time: '2017-1-16',
                                        content: '付款确认',
                                        do_ret:false,
                                    },{   id:'fshvv8889276551117',
                                        title: '付款确认',
                                        send_time: '2017-1-18',
                                        content: '付款确认',
                                        do_ret:false,
                                    },{   id:'fshvv8889276551118',
                                        title: '付款确认',
                                        send_time: '2017-1-18',
                                        content: '付款确认',
                                        do_ret:false,
                                    },{   id:'fshvv8889276551119',
                                        title: '付款确认',
                                        send_time: '2017-1-18',
                                        content: '付款确认',
                                        do_ret:false,
                                    },{   id:'fshvv8889276551120',
                                        title: '付款确认',
                                        send_time: '2017-1-18',
                                        content: '付款确认',
                                        do_ret:false,
                                    },{   id:'fshvv8889276551128',
                                        title: '付款确认',
                                        send_time: '2017-1-18',
                                        content: '付款确认',
                                        do_ret:false,
                                    },{   id:'fshvv8889276551929',
                                        title: '付款确认',
                                        send_time: '2017-1-18',
                                        content: '付款确认',
                                        do_ret:false,
                                    },{   id:'fshvv8889276551828',
                                        title: '付款确认',
                                        send_time: '2017-1-18',
                                        content: '付款确认',
                                        do_ret:false,
                                    },{   id:'fshvv8889276551729',
                                        title: '付款确认',
                                        send_time: '2017-1-18',
                                        content: '付款确认',
                                        do_ret:false,
                                    },
                                ],
                            }
                        } else if (requestData.data.current_page == 2) {
                            result = {
                                code: 10,
                                msg: '查询消息列表',
                                result: [{   id:'fshvv8889276551121',
                                    title: '测试消息',
                                    send_time: '2017-1-11',
                                    content: '欢迎使用本系统1',
                                    do_ret:true,
                                }, {   id:'fshvv8889276551122',
                                    title: '用户确认消息',
                                    send_time: '2017-1-11',
                                    content: '用户确认消息1',
                                    do_ret:true,
                                },{   id:'fshvv8889276551123',
                                    title: '服务单确认信息',
                                    send_time: '2017-1-11',
                                    content: '你已经确认报价1',
                                    do_ret:false,
                                },{   id:'fshvv8889276551124',
                                    title: '委托单通知',
                                    send_time: '2017-1-12',
                                    content: '您有一份新报价待查看1',
                                    do_ret:false,
                                },{   id:'fshvv8889276551125',
                                    title: '服务单进度通知',
                                    send_time: '2017-1-15',
                                    content: '服务单进度通知,货物已到港查收1',
                                    do_ret:false,
                                },{   id:'fshvv8889276551126',
                                    title: '付款确认',
                                    send_time: '2017-1-16',
                                    content: '付款确认1',
                                    do_ret:false,
                                },{   id:'fshvv8889276551127',
                                    title: '付款确认',
                                    send_time: '2017-1-18',
                                    content: '付款确认1',
                                    do_ret:false,
                                },{   id:'fshvv8889276551130',
                                    title: '付款确认',
                                    send_time: '2017-1-18',
                                    content: '付款确认1',
                                    do_ret:false,
                                },{   id:'fshvv8889276551131',
                                    title: '付款确认',
                                    send_time: '2017-1-18',
                                    content: '付款确认1',
                                    do_ret:false,
                                },{   id:'fshvv8889276551132',
                                    title: '付款确认',
                                    send_time: '2017-1-18',
                                    content: '付款确认1',
                                    do_ret:false,
                                },],
                            }
                        } else {
                            result = {
                                code: 10,
                                msg: '查询服务单单列表',
                                result: [],
                            }
                        }

                        break;
                    //删除消息
                    case 532:
                        if(requestData.data.id) {
                            result = {
                                code: 10,
                                msg: '删除成功',
                                result:{}
                            }
                        }else{
                            result = {
                                code: -10,
                                msg: '系统错误',
                                result: {},
                            }
                        }
                        break;
                    //已读消息
                    case 533:
                        if(requestData.data.id) {
                            result = {
                                code: 10,
                                msg: '删除成功',
                                result:{}
                            }
                        }else{
                            result = {
                                code: -10,
                                msg: '系统错误',
                                result: {},
                            }
                        }
                        break;
                    //发起委托
                    case 231:
                        //console.log(`requestData.data:`,requestData.data)
                        if(requestData.data.commissionOrder.import_clearance
                            &&requestData.data.commissionOrder.trade_terms
                            &&requestData.data.commissionOrder.departure_id
                            &&requestData.data.commissionOrder.departure_name
                            &&requestData.data.commissionOrder.destination_id
                            &&requestData.data.commissionOrder.destination_name
                            &&requestData.data.commissionOrder.client_name
                            &&requestData.data.commissionOrder.client_phone
                            &&requestData.data.file_ids) {
                            result = {
                                code: 10,
                                msg: '提交成功',
                                result:{}
                            }
                        }else{
                            result = {
                                code: -10,
                                msg: '系统错误',
                                result: {},
                            }
                        }
                    break;
                    //修改委托单
                    case 237:
                        //console.log(`requestData.data:`,requestData.data)
                        if(requestData.data.commissionOrder.import_clearance
                            &&requestData.data.commissionOrder.trade_terms
                            &&requestData.data.commissionOrder.departure_id
                            &&requestData.data.commissionOrder.departure_name
                            &&requestData.data.commissionOrder.destination_id
                            &&requestData.data.commissionOrder.destination_name
                            &&requestData.data.commissionOrder.client_name
                            &&requestData.data.commissionOrder.client_phone
                            &&requestData.data.file_ids){
                            result = {
                                code: 10,
                                msg: '修改成功',
                                result:{}
                            }
                        }else{
                            result = {
                                code: -10,
                                msg: '系统错误',
                                result: {},
                            }
                        }
                        break;
                    //服务单查询已上传图片
                    case 632:
                        //console.log(`requestData.data:`,requestData.data)
                        if(requestData.data.id) {
                            result = {
                                code: 10,
                                msg: '查询成功',
                                result:[{
                                    file_url:'http://o2o.doorto.cn/upload/yun-o2o/ff8080814f2ab654014f2b9ad24b063a.jpg',
                                    id: '1998276354421',
                                    filename:'Imagedemo',
                                    height: 400,
                                    big_url: 'http://o2o.doorto.cn/upload/yun-o2o/ff8080814f2ab654014f2b9ad24b063a.jpg',
                                    width: 400,}]
                            }
                        }else{
                            result = {
                                code: -10,
                                msg: '系统错误',
                                result: {},
                            }
                        }
                        break;
                    //服务单保存上传图片
                    case 338:
                        //console.log(`requestData.data:`,requestData.data)
                        if(requestData.data.id&&requestData.data.file_ids){
                            result = {
                                code: 10,
                                msg: '保存成功',
                                result:{}
                            }
                        }else{
                            result = {
                                code: -10,
                                msg: '系统错误',
                                result: {},
                            }
                        }
                        break;
                    //委托单保存上传图片
                    case 239:
                        //console.log(`requestData.data:`,requestData.data)
                        if(requestData.data.list){
                            result = {
                                code: 10,
                                msg: '保存成功',
                                result:{}
                            }
                        }else{
                            result = {
                                code: -10,
                                msg: '系统错误',
                                result: {},
                            }
                        }
                        break;
                    //委托单重新委托
                    case 240:
                        //console.log(`requestData.data:`,requestData.data)
                        if(requestData.data.commission_id){
                            result = {
                                code: 10,
                                msg: '保存成功',
                                result:{}
                            }
                        }else{
                            result = {
                                code: -10,
                                msg: '系统错误',
                                result: {},
                            }
                        }
                        break;
                    //委托单查询上传图片
                    case 238:
                        //console.log(`requestData.data:`,requestData.data)
                        if(requestData.data.id){
                            result = {
                                code: 10,
                                msg: '保存成功',
                                result:[
                                    {
                                    file_url:'http://o2o.doorto.cn/upload/yun-o2o/ff8080814f2ab654014f2b9ad24b063a.jpg' ,//附件路径

                                    big_url:'http://o2o.doorto.cn/upload/yun-o2o/ff8080814f2ab654014f2b9ad24b063a.jpg' ,//大图路径 类型为jpg的数据该字段有值

                                    id:'88732666255211' ,//文件id

                                    file_mime:'image/jpg' ,//文件类型

                                    file_name:'88732666255211.jpg' ,//文件名称

                                    file_type_name:'补充资料货物' ,//文件类型名称

                                    file_type_id:'1001' ,//文件类型ID
                                    }, {
                                    file_url:'http://o2o.doorto.cn/upload/yun-o2o/ff8080814f2ab654014f2b992cd70626.jpg' ,//附件路径

                                    big_url:'http://o2o.doorto.cn/upload/yun-o2o/ff8080814f2ab654014f2b992cd70626.jpg' ,//大图路径 类型为jpg的数据该字段有值

                                    id:'88732666255212' ,//文件id

                                    file_mime:'image/jpg' ,//文件类型

                                    file_name:'88732666255212.jpg' ,//文件名称

                                    file_type_name:'资格证明' ,//文件类型名称

                                    file_type_id:'1002' ,//文件类型ID
                                    }, {
                                    file_url:'http://o2o.doorto.cn/upload/yun-o2o/ff8080814f2ab654014f2b989d520622.jpg' ,//附件路径

                                    big_url:'http://o2o.doorto.cn/upload/yun-o2o/ff8080814f2ab654014f2b989d520622.jpg' ,//大图路径 类型为jpg的数据该字段有值

                                    id:'88732666255213' ,//文件id

                                    file_mime:'image/jpg' ,//文件类型

                                    file_name:'88732666255213.jpg' ,//文件名称

                                    file_type_name:'资格证明' ,//文件类型名称

                                    file_type_id:'1002' ,//文件类型ID
                                    }, {
                                    file_url:'http://o2o.doorto.cn/upload/yun-o2o/ff8080814f2ab654014f2b976df5061a.jpg' ,//附件路径

                                    big_url:'http://o2o.doorto.cn/upload/yun-o2o/ff8080814f2ab654014f2b976df5061a.jpg' ,//大图路径 类型为jpg的数据该字段有值

                                    id:'88732666255214' ,//文件id

                                    file_mime:'image/jpg' ,//文件类型

                                    file_name:'88732666255214.jpg' ,//文件名称

                                    file_type_name:'资格证明' ,//文件类型名称

                                    file_type_id:'1002' ,//文件类型ID
                                    }, {
                                    file_url:'http://o2o.doorto.cn/upload/yun-o2o/ff8080814f2ab654014f2b9576600612.jpg' ,//附件路径

                                    big_url:'http://o2o.doorto.cn/upload/yun-o2o/ff8080814f2ab654014f2b9576600612.jpg' ,//大图路径 类型为jpg的数据该字段有值

                                    id:'88732666255215' ,//文件id

                                    file_mime:'image/jpg' ,//文件类型

                                    file_name:'88732666255215.jpg' ,//文件名称

                                    file_type_name:'补充资料货物' ,//文件类型名称

                                    file_type_id:'1002' ,//文件类型ID
                                    }, {
                                    file_url:'http://o2o.doorto.cn/upload/yun-o2o/ff8080814f2ab654014f2b952dbd060a.jpg' ,//附件路径

                                    big_url:'http://o2o.doorto.cn/upload/yun-o2o/ff8080814f2ab654014f2b952dbd060a.jpg' ,//大图路径 类型为jpg的数据该字段有值

                                    id:'88732666255216' ,//文件id

                                    file_mime:'image/jpg' ,//文件类型

                                    file_name:'88732666255216.jpg' ,//文件名称

                                    file_type_name:'报关单证' ,//文件类型名称

                                    file_type_id:'1003' ,//文件类型ID
                                    }, {
                                    file_url:'http://o2o.doorto.cn/upload/yun-o2o/ff8080814f2ab654014f2b94059005e8.jpg' ,//附件路径

                                    big_url:'http://o2o.doorto.cn/upload/yun-o2o/ff8080814f2ab654014f2b94059005e8.jpg' ,//大图路径 类型为jpg的数据该字段有值

                                    id:'88732666255217' ,//文件id

                                    file_mime:'image/jpg' ,//文件类型

                                    file_name:'88732666255217.jpg' ,//文件名称

                                    file_type_name:'报关单证' ,//文件类型名称

                                    file_type_id:'1003' ,//文件类型ID
                                    },
                                    {
                                        file_url:'http://o2o.doorto.cn/upload/yun-o2o/doc' ,//附件路径

                                        big_url:'' ,//大图路径 类型为jpg的数据该字段有值

                                        id:'88732666255221' ,//文件id

                                        file_mime:'doc' ,//文件类型

                                        file_name:'88732666255217.doc' ,//文件名称

                                        file_type_name:'文本资料' ,//文件类型名称

                                        file_type_id:'1004' ,//文件类型ID
                                    },{
                                        file_url:'http://o2o.doorto.cn/upload/yun-o2o/pdf' ,//附件路径

                                        big_url:'' ,//大图路径 类型为jpg的数据该字段有值

                                        id:'88732666255222' ,//文件id

                                        file_mime:'pdf' ,//文件类型

                                        file_name:'88732666255217.pdf' ,//文件名称

                                        file_type_name:'文本资料' ,//文件类型名称

                                        file_type_id:'1004' ,//文件类型ID
                                    },{
                                        file_url:'http://o2o.doorto.cn/upload/yun-o2o/excel' ,//附件路径

                                        big_url:'' ,//大图路径 类型为jpg的数据该字段有值

                                        id:'88732666255223' ,//文件id

                                        file_mime:'excel' ,//文件类型

                                        file_name:'88732666255217.excel' ,//文件名称

                                        file_type_name:'文本资料' ,//文件类型名称

                                        file_type_id:'1004' ,//文件类型ID
                                    },
                                    {
                                        file_url:'http://o2o.doorto.cn/upload/yun-o2o/zip' ,//附件路径

                                        big_url:'' ,//大图路径 类型为jpg的数据该字段有值

                                        id:'88732666255228' ,//文件id

                                        file_mime:'zip' ,//文件类型

                                        file_name:'88732666255218.zip' ,//文件名称

                                        file_type_name:'文本资料' ,//文件类型名称

                                        file_type_id:'1004' ,//文件类型ID
                                    },
                                ]
                            }
                        }else{
                            result = {
                                code: -10,
                                msg: '系统错误',
                                result: {},
                            }
                        }
                        break;
                }

                resolve(JSON.stringify(JSON.stringify(result)))
            })
    })
});


gunZip = async (data) => {

    let responseData = await HttpRSAModule.gunzipRSA(data)
    return responseData

}


