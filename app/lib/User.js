/**
 * @fileoverview
 * @since 17/1/8 10:40
 * @author chenyiqin
 */

import {
    AsyncStorage,
}  from 'react-native'

/*export const checkLogin = async () => {
    return await AsyncStorage.getItem('useID')
}*/

export const getToken = async () => {
    let token= await AsyncStorage.getItem('token')

    return token
}

export const getPhone = async () => {

    return await AsyncStorage.getItem('phone')
}

export const getAccount = async () => {

    return await AsyncStorage.getItem('account')
}
export const getDeviceID = async () => {
    let deviceID=await AsyncStorage.getItem('deviceID')

    return deviceID;
}
export const getRealName = async () => {
    let realName=await AsyncStorage.getItem('realName')
    //console.log(`realName:`+realName)
    return realName
}
export const getVersion = async () => {
    let version=await AsyncStorage.getItem('version')
    //console.log(`version:`+version)
    return version
}
/**
 * 获得短信序列注册
 * @returns {*}
 */
export const getRegMsgSerial = async () => {
    let MsgSerial=await AsyncStorage.getItem('RegMsgSerial')
    //console.log(`RegMsgSerial:`+MsgSerial)
    return MsgSerial
}
/**
 * 获得短信序列忘记密码
 * @returns {*}
 */
export const getForMsgSerial = async () => {
    let MsgSerial=await AsyncStorage.getItem('ForMsgSerial')
    //console.log(`ForMsgSerial:`+MsgSerial)
    return MsgSerial
}