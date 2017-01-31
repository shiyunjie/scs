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
    console.log(`fetchMock url, opts = `, url, opts)

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
                console.log(`parameter:`, parameter)
                let requestData = JSON.parse(parameter)
                console.log(`parameter_itype:`, requestData.itype)

                //首页轮播
                if (requestData.itype == 111) {

                    console.log(`fetchMock indexShowPicture parameter:`, requestData)
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

                }

                //登录
                if (requestData.itype == 100) {

                    console.log(`fetchMock login parameter:`, requestData)
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
                }

                //查询询价单列表
                if (requestData.itype == 232) {

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
                            ],
                        }
                    } else {
                        result = {
                            code: 10,
                            msg: '查询询价单列表',
                            result: [],
                        }
                    }

                }
                //服务单列表
                if (requestData.itype == 331) {


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

                }

                //询价单详情
                if (requestData.itype == 234) {
                    if (requestData.data.id) {
                        result = {
                            code: 10,
                            msg: '查询成功',
                            result: {
                                service_no: 'no778299381',// 委托单号

                                order_status_name: '已下单',// 订单状态

                                create_time_str: '2017-01-31 19:00',// 发布时间

                                remark: '备注',// 备注

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

                }

                //服务单详情
                if (requestData.itype == 332) {
                    if (requestData.data.id) {
                        result = {
                            code: 10,
                            msg: '查询成功',
                            result: {
                                service_no: 'sn277399421',// 服务单号

                                order_status_name: '已报价',// 服务单状态名称

                                order_status: 30,// 服务单状态

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

                }

                //物流状态
                if (requestData.itype == 334) {
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

                }

                //账单
                if (requestData.itype == 333) {
                    if (requestData.data.id) {
                        result = {
                            code: 10,
                            msg: '查询成功',
                            result: [[{
                                first_cost_name: '代办费',

                                cost_name: '证件费用',

                                estimate_cost: 800,

                                cost: 900,

                                id: '998773',

                                is_cal: 0,

                                is_pay: 0,
                            },{
                                first_cost_name: '代办费',

                                cost_name: '申报费',

                                estimate_cost: 801,

                                cost: 902,

                                id: '998779',

                                is_cal: 0,

                                is_pay: 0,
                            }],
                                [{
                                    first_cost_name: '手续费',

                                    cost_name: '港口进场费',

                                    estimate_cost: 1600,

                                    cost: 9000,

                                    id: '998776',

                                    is_cal: 0,

                                    is_pay: 1,
                                }],],
                        }

                    } else {
                        result = {
                            code: -10,
                            msg: '系统错误',
                            result: {},
                        }
                    }

                }


                //注册 忘记密码  发送验证码
                if (requestData.itype == 101||requestData.itype == 104) {
                    if (requestData.data.phone) {
                        result = {
                            code: 10,
                            msg: '发送成功,2345',
                            result: {},
                        }

                    } else {
                        result = {
                            code: -10,
                            msg: '系统错误',
                            result: {},
                        }
                    }

                }


                //注册 忘记密码  下一步
                if (requestData.itype == 105||requestData.itype == 102) {
                    if (requestData.data.phone&&requestData.data.code==2345) {
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

                }




                resolve(JSON.stringify(JSON.stringify(result)))
            })
    })
});


gunZip = async (data) => {

    let responseData = await HttpRSAModule.gunzipRSA(data)
    return responseData

}


