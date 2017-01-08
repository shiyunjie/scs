/**
 * Created by shiyunjie on 16/12/6.
 */
export const constant = {
    UIActiveColor:"#FB687D",
    UIInActiveColor:"#ADADAD",
    UIBackgroundColor:"#F1F2F4",
    IconSize:25,
    MarginLeftRight:15,
    Tel:'tel:10086',
    pullDownStayDistance:40,  //下拉刷新后停留的高度

    CompName:'润码网络科技',
    CompTel:'021-52990900',
    CompFax:'021-62608981-8030',
    CompEmail:'mail@example.com',
    CompAddress:'长寿路652号10号楼',





    requestTimeout: 30000,  //默认请求超时30秒
    requestMethod: 'GET',   //默认请求方法为GET


    api: {
        //service:'http://192.168.1.200:8080/app/gateway',
        service:'http://posttestserver.com/post.php',
        indexShowPicture: '/index/showPicture',
        commissionOrder_commissionOrderList:'/commissionOrder/commissionOrderList',
        serviceOrder_serviceOrderList:'/serviceOrder/serviceOrderList',
        message_findSysInfoShow:'/message/findSysInfoShow',
        member_changeInfoShow:'/member/changeInfoShow',
        member_changeInfo:'/member/changeInfo',
        member_changePwd:'/member/changePwd',
        sysInfo_helpCenter:'/sysInfo/helpCenter',
        sysInfo_feedBack:'/sysInfo/feedBack',
        register_firstStep:'/register/firstStep',
        checkMsgCode:'/checkMsgCode',
        register_secondStep:'/register/secondStep'
    },

    iType: {
        indexShowPicture: 111,
        member_changeInfoShow:131,
        member_changeInfo:132,
        member_changePwd:130,


        commissionOrder_commissionOrderList: 232,

        serviceOrder_serviceOrderList: 331,

        sysInfo_feedBack:431,
        sysInfo_helpCenter:432,

        message_findSysInfoShow:531,
        register_firstStep:101,
        register_secondStep:103,
        checkMsgCode:102,



    }
}

export default constant;