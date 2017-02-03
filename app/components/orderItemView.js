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
    // 构造



    static propTypes = {

        ...View.propTypes, // 包含默认的View的属性
        name:PropTypes.string,
        title: PropTypes.string.isRequired,
        rightText: PropTypes.string,
        show: PropTypes.bool,
        hasCheckBox: PropTypes.bool,
        hasLine: PropTypes.bool,


    }

    static defaultProps = {
        rightText: '',
        show: true,
        hasCheckBox: false,
        size:constants.IconSize,
        color:constants.UIInActiveColor,
        hasLine:true,
    }


    render() {
        if (this.props.show) {
            return (
                <View style={styles.itemView}>
                    <View style={styles.itemIcon}/>
                    <View style={[styles.itemText,this.props.hasLine?{borderBottomWidth:StyleSheet.hairlineWidth}:{borderBottomWidth:0}]}>
                        <Text style={styles.TabText}>{this.props.title}</Text>
                    </View>
                    <View style={[styles.itemButton,this.props.hasLine?{borderBottomWidth:StyleSheet.hairlineWidth}:{borderBottomWidth:0}]}>
                        <Text style={styles.TabText}>{this.props.rightText}</Text>
                        <Icon
                            name={this.props.name}  // 图标
                            size={this.props.size}
                            color={this.props.color}/>
                    </View>

                </View>

            )
        } else {
            return (
                <View style={styles.itemView}>
                    <View style={styles.itemIcon}/>
                    <View style={styles.itemText}>
                        <Text style={styles.TabText}>{this.props.title}</Text>
                    </View>
                    <View style={styles.itemButton}>
                        <Text style={[styles.TabText,{textAlign:'right'},]}>{this.props.rightText}</Text>

                    </View>

                </View>

            )
        }
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
        width: constants.MarginLeftRight,
        justifyContent: 'center',
        alignItems: 'center',
    },
    itemText: {
        flex: 2,
        flexDirection: 'row',
        alignItems: 'center',
        borderBottomWidth:StyleSheet.hairlineWidth,
        borderColor: constants.UIInActiveColor,
    },
    itemButton: {
        flex: 4,
        flexDirection: 'row',
        justifyContent: 'flex-end',
        alignItems: 'center',
        borderBottomWidth:StyleSheet.hairlineWidth,
        borderColor: constants.UIInActiveColor,
        paddingRight:10,
    },
    TabText: {
        flex:1,
        margin: 0,
        fontSize: 15,
        marginRight:10,
    },

});