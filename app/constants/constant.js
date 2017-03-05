/**
 * Created by shiyunjie on 16/12/6.
 */
export const constant = {
    //UIActiveColor:'#000000',
    UIActiveColor:'#FB687D',
    UIInActiveColor:'#ADADAD',
    UIBackgroundColor:'#F1F2F4',
    UIInputErrorColor:'#ffb5b5',
    LabelColor:'#696969',
    LineColor:'#bebebe',
    PointColor:'#999999',
    DefaultFontSize:14,
    IconSize:25,
    MarginLeftRight:15,
    Tel:'tel:021-52990900',
    pullDownStayDistance:50,  //下拉刷新后停留的高度

    CompName:'润码网络科技',
    CompTel:'021-52990900',
    CompFax:'021-62608981-8030',
    CompEmail:'mail@example.com',
    CompAddress:'长寿路652号10号楼',



    development:true,//开发模式mock

    requestTimeout: 30000,  //默认请求超时30秒
    requestMethod: 'GET',   //默认请求方法为GET


    api: {
        //service:'http://192.168.1.200:8080/app/gateway/',
        //service:'http://192.168.1.248:8080/spboot/upload',
        service:'http://192.168.1.246:8084/app/gateway/',
        //service:'http://posttestserver.com/post.php',
        //service:'http://f154876m19.imwork.net:16374/app/gateway',
            /*indexShowPicture: '/index/showPicture',
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
            register_secondStep:'/register/secondStep'*/
    },

    iType: {
        upload:95,
        login:100,
        register_firstStep:101,
        checkMsgCode:102,
        register_secondStep:103,
        forgetPwdCode:104,
        checkForgetCode:105,
        SavePwd:106,


        indexShowPicture: 111,

        changePwd:131,
        changeInfoShow:132,
        changeInfo:133,
        member_changePwd:130,

        commissionOrderStart:231,
        commissionOrderList: 232,
        cancelCommissionOrder:233,
        showCommissionOrderDetail:234,

        commissionOrder_commissionOrderEditSave:237,

        serviceOrderList: 331,
        serviceOrderDetail:332,
        serviceCost_findServiceCost:333,
        serviceOrder_cancelServiceOrder:335,
        LogisticsLog:334,
        serviceOrder_confirmServiceOrder:336,
        serviceCost_payCost:337,
        uploadFinish:338,

        uploadImageList:632,

        feedBack:431,

        sysInfo_helpCenter:432,

        findSysInfoShow:531,
        delSysInfo:532,
        infoDetail:533,




    },
}

export default constant;