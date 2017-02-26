/**
 * Created by shiyunjie on 17/1/2.
 */
import {
    StyleSheet,
    Platform,

} from 'react-native';

import constants from  '../constants/constant';

const navigatorStyles = StyleSheet.create({
    navigatorBg: {
        backgroundColor: '#F4F4F4',
    },
    navBar: {
        backgroundColor: constants.UIActiveColor,
    },
    navBarText: {
        flex: 1,
        fontSize: 16,
        color: 'white',
        textAlign: 'center',
        textAlignVertical: 'center',


    },
    navBarTitleText: {
        color: 'white',
        fontWeight: '500',
        marginVertical: 9,
    },

    navBarLeftButton: {
        //paddingLeft: 10,
        marginTop: Platform.OS == 'ios' ? 0 : 4,
        height:50,
        width:60,
        flexDirection: 'column',
        justifyContent: 'center',
        alignItems: 'flex-start',

    },
    navBarRightButton: {
        paddingRight: 15,
        flexDirection: 'column',
        justifyContent: 'center',
        alignItems: 'flex-end',
    },
    navBarButtonText: {
        color: '#5890FF',
    },
    navBarTitleAndroid: {
        alignSelf: 'center',
        position: 'relative',
        left: -35,
    },
    navBarLeftButtonAndroid: {
        alignSelf: 'center',

    },
});

export default navigatorStyles;