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
                                id: '2',
                            },
                                {
                                    file_url: 'http://www.doorto.cn/images/banner-01.jpg',
                                    big_url: 'http://www.doorto.cn/images/banner-01.jpg',
                                    id: '1',
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
                            result = {code: -10, msg: '用户名火密码错误'}
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
                                        total_cost: '20000',
                                        departure_name: '澳大利亚',
                                        destination_name: '中国',
                                    },
                                    {
                                        id: '1234567892',
                                        commission_order_no: 'no2255362',
                                        create_time_str: '2017-01-31 19:00',
                                        order_status_name: '已失效',
                                        logistics_status_str: '待报关',
                                        total_cost: '10000',
                                        departure_name: '澳大利亚',
                                        destination_name: '中国',
                                    },
                                    {
                                        id: '1234567893',
                                        commission_order_no: 'no2255363',
                                        create_time_str: '2017-01-31 19:00',
                                        order_status_name: '待报价',
                                        logistics_status_str: '',
                                        total_cost: '30000',
                                        departure_name: '中国',
                                        destination_name: '日本',
                                    },
                                    {
                                        id: '1234567894',
                                        commission_order_no: 'no2255364',
                                        create_time_str: '2017-01-31 19:00',
                                        order_status_name: '待报价',
                                        logistics_status_str: '',
                                        total_cost: '1000',
                                        departure_name: '澳大利亚',
                                        destination_name: '中国',
                                    },
                                    {
                                        id: '1234567895',
                                        commission_order_no: 'no2255365',
                                        create_time_str: '2017-01-31 19:00',
                                        order_status_name: '已下发',
                                        logistics_status_str: '已抵达',
                                        total_cost: '3000',
                                        departure_name: '澳大利亚',
                                        destination_name: '中国',
                                    },
                                    {
                                        id: '1234567901',
                                        commission_order_no: 'no2255373',
                                        create_time_str: '2017-01-31 19:50',
                                        order_status_name: '待报价',
                                        logistics_status_str: '',
                                        total_cost: '13000',
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
                                        total_cost: '3000',
                                        departure_name: '澳大利亚',
                                        destination_name: '中国',
                                    },
                                    {
                                        id: '1234567897',
                                        commission_order_no: 'no2255367',
                                        create_time_str: '2017-01-31 19:00',
                                        order_status_name: '已失效',
                                        logistics_status_str: '已抵达',
                                        total_cost: '3000',
                                        departure_name: '中国',
                                        destination_name: '香港',
                                    },
                                    {
                                        id: '1234567898',
                                        commission_order_no: 'no2255368',
                                        create_time_str: '2017-01-31 20:00',
                                        order_status_name: '已报价',
                                        logistics_status_str: '',
                                        total_cost: '6000',
                                        departure_name: '中国',
                                        destination_name: '日本',
                                    },
                                    {
                                        id: '1234567899',
                                        commission_order_no: 'no2255369',
                                        create_time_str: '2017-01-31 21:00',
                                        order_status_name: '待报价',
                                        logistics_status_str: '',
                                        total_cost: '4000',
                                        departure_name: '澳大利亚',
                                        destination_name: '中国',
                                    },
                                    {
                                        id: '1234567900',
                                        commission_order_no: 'no2255370',
                                        create_time_str: '2017-01-31 22:00',
                                        order_status_name: '已下发',
                                        logistics_status_str: '已抵达',
                                        total_cost: '3000',
                                        departure_name: '澳大利亚',
                                        destination_name: '中国',
                                    },
                                    {
                                        id: '1234567902',
                                        commission_order_no: 'no2255372',
                                        create_time_str: '2017-01-31 22:50',
                                        order_status_name: '待报价',
                                        logistics_status_str: '',
                                        total_cost: '3000',
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
                    //询价单详情
                    case 234:
                        if (requestData.data.id) {

                            result = {
                                code: 10,
                                msg: '查询成功',
                                result: {
                                    service_no: 'no778299381',// 委托单号

                                    order_status_name: '已下单',// 订单状态

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

                                    order_status: 30,// 订单状态 值
                                    commission_content: '小心轻放,易碎物品',//委托内容
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
                                    potcd: '宁波',// 申报口岸

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
                        if (requestData.data.service_id) {
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
                                        cost: 1,
                                        id: '402881665986f1fe015986f5792f002c',
                                        is_cal: 0,
                                        is_pay: 0 },
                                    { first_cost_name: '仓储',
                                        cost_name: '海关仓库仓储费（散货）',
                                        estimate_cost: 11,
                                        cost: 1,
                                        id: '402881665986f1fe015986f57931002d',
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
                        if(requestData.data.qq) {
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
                                    },{   id:'fshvv8889276551129',
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
                        if(requestData.data.import_clearance
                            &&requestData.data.international_logistics
                            &&requestData.data.export_country_land
                            &&!requestData.data.booking_service
                            &&requestData.data.domestic_logistics
                            &&requestData.data.credit_letter
                            &&requestData.data.trade_terms
                            &&requestData.data.departure_id
                            &&requestData.data.departure_name
                            &&requestData.data.destination_id
                            &&requestData.data.destination_name
                            &&requestData.data.client_name
                            &&requestData.data.client_phone) {
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

                }

                resolve(JSON.stringify(JSON.stringify(result)))
            })
    })
});


gunZip = async (data) => {

    let responseData = await HttpRSAModule.gunzipRSA(data)
    return responseData

}


