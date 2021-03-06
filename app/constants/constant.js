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

    CompName:'润码(上海)网络科技有限公司',
    CompTel:'021-52990900',
    CompFax:'021-62608981-8030',
    CompEmail:'supplychain@sh-defan.net',
    CompAddress:'上海市长寿路652号10号楼107室',

    maxiumUploadImagesCount:25, //最多上传图片总数
    maxiumXhrNums:4, //最多同时上传数量

    development:false,//开发模式mock

    requestTimeout: 30000,  //默认请求超时30秒
    requestMethod: 'GET',   //默认请求方法为GET


    api: {
        //service:'http://192.168.1.250:8084/app/gateway/',
        //service:'http://192.168.1.248:8080/spboot/upload',
        //service:'http://192.168.1.134:8080/app/gateway/',
        //service:'http://192.168.1.212:8080/app/gateway/',
        service:'https://mobile.winchamp.net/app/gateway/',
        //service:'http://posttestserver.com/post.php',
        //service:'http://f154876m19.imwork.net:16374/app/gateway',

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
        commissionOrder_missFileShow:238,
        commissionOrder_missFileSave:239,
        commissionOrder_reCommission:240,

        serviceOrderList: 331,
        serviceOrderDetail:332,
        serviceCost_findServiceCost:333,
        serviceOrder_cancelServiceOrder:335,
        LogisticsLog:334,
        serviceOrder_confirmServiceOrder:336,
        serviceCost_payCost:337,
        uploadFinish:338,



        feedBack:431,

        sysInfo_helpCenter:432,
        sysInfo_checkUpdate:401,

        findSysInfoShow:531,
        delSysInfo:532,
        infoDetail:533,

        uploadImageList:632,




    },
}

export default constant;