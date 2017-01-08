/**
 * @fileoverview
 * @since 17/1/8 10:40
 * @author chenyiqin
 */

import {
    AsyncStorage,
}  from 'react-native'

export const checkLogin = async () => {
    return await AsyncStorage.getItem('useID')
}