/**
 * Created by shiyunjie on 16/12/28.
 */
import React, {
    PropTypes,
    Component } from 'react';
import {
    StyleSheet,
    Text,
    View,
    PixelRatio,



} from 'react-native';

import constants from  '../constants/constant';
import Icon from 'react-native-vector-icons/Ionicons';


export default class ListItemView extends Component {

    static propTypes = {

        ...View.propTypes, // 包含默认的View的属性

        size: PropTypes.number.isRequired,
        color: PropTypes.string,
        title: PropTypes.string.isRequired,
        show: PropTypes.bool,

        time:PropTypes.string,
        content:PropTypes.string,


    }

    static defaultProps = {
        show: false,
        size:constants.IconSize,
        color: constants.UIInActiveColor,
        time:'',
        content:'',

    }


    render() {

        return (
            <View style={styles.itemView}>
                <View style={styles.itemIcon}/>

                <View style={styles.itemText}>
                    <View style={styles.TextView}>
                        <Text style={styles.TabText}>{this.props.title}</Text>
                        <Text style={[styles.TabText,{color:constants.UIInActiveColor,marginLeft:10}]}>{this.props.time}</Text>
                    </View>
                    <View style={styles.TextView}>
                        <Text style={[styles.TabText,{color:constants.UIInActiveColor}]}>{this.props.content}</Text>
                    </View>


                </View>
                <View style={styles.itemButton}>
                    <Icon
                        name='ios-arrow-forward'  // 图标
                        size={this.props.size}
                        color={this.props.color}/>
                </View>

            </View>

        )

    }

}
var styles = StyleSheet.create({
    itemView: {
        flex: 1,
        flexDirection: 'row',
        justifyContent: 'flex-start',
        alignItems: 'stretch',
        padding: 0,
        backgroundColor: 'white',


    },
    itemIcon: {
        marginLeft: constants.MarginLeftRight,
    },
    TextView: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'flex-start',

    },
    itemText: {
        flex: 8,
        flexDirection: 'column',
        alignItems: 'flex-start',
        borderBottomWidth: StyleSheet.hairlineWidth,
        borderColor: constants.UIInActiveColor,
    },
    itemButton: {
        flex: 1,

        justifyContent: 'center',
        alignItems: 'center',
        borderBottomWidth: StyleSheet.hairlineWidth,
        borderColor: constants.UIInActiveColor,
    },
    TabText: {
        margin: 0,
        fontSize: 15,
        marginLeft: 10,

    },

});