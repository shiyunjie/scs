/**
 * Created by shiyunjie on 16/12/6.
 */
import React, {
    PropTypes,
    Component } from 'react';
import {
    StyleSheet,
    Text,
    View,
    PixelRatio,
    TouchableOpacity,


} from 'react-native';
//import Icon from 'react-native-vector-icons/FontAwesome';
import Icon from 'react-native-vector-icons/Ionicons';
import constants from  '../constants/constant';

export default class HelpItem extends Component {
    // 构造
    constructor(props) {
        super(props);
        // 初始状态
        this.state = {
            show: this.props.show

        };
    }

    static propTypes = {
        ...View.propTypes, // 包含默认的View的属性
        show: PropTypes.bool,
        data: PropTypes.object,
        index: PropTypes.number,

    }
    static defaultProps = {
        show: false,
        data: null,
    }

    /**
     * 自适应高度 最外层view一定要加flex:1
     * @returns {XML}
     */
    render() {
        return (
            <View style={styles.tabView}>
                <TouchableOpacity
                    style={styles.tabTitle}
                    onPress={() => {
                        this.setState({show:!this.state.show})
                        }}>
                    <Text
                        style={[styles.labelText,{marginLeft:constants.MarginLeftRight,},]}>{this.props.data.name}</Text>
                    <View
                        style={{flex:1,
                        flexDirection: 'row',
                        justifyContent:'flex-end',
                        marginRight:constants.MarginLeftRight}}>
                        <Icon
                            name={this.state.show?'ios-arrow-up':'ios-arrow-down'}  // 图标
                            size={constants.IconSize}
                            color={constants.UIInActiveColor}/>
                    </View>
                </TouchableOpacity>
                <View style={[this.state.show?{flex:1}:{height:0,width:0},{
                        borderBottomWidth: StyleSheet.hairlineWidth,
                        borderColor: constants.UIInActiveColor,}]}>
                    {this.props.data.child.map((item, index) => {
                        return (
                            <View
                                key={`keyItem=${index}`}
                                style={[{flexDirection: 'column',
                                justifyContent: 'flex-start',
                                alignItems: 'stretch',
                                marginLeft:constants.MarginLeftRight*2,
                               },this.state.show?{flex:1}:{height:0}]}>
                                <Text style={[styles.labelText,{color:constants.PointColor}]}>{item.detail}</Text>
                            </View>
                        )
                    })}
                </View>
            </View>

        )
    }


}

var styles = StyleSheet.create({
    labelText: {
        fontSize: 14,
        color: constants.LabelColor,
    },
    tabText: {
        flex: 1,
        margin: 0,
        color: constants.UIInActiveColor,
        fontSize: 13
    },
    selectedTabText: {
        margin: 0,
        color: constants.UIActiveColor,
        fontSize: 13
    },
    tabView: {
        flex: 1,
        flexDirection: 'column',
        justifyContent: 'flex-start',
        alignItems: 'center',
        paddingLeft: constants.MarginLeftRight,
    },
    tabTitle: {
        height: 40,
        margin: 0,
        flexDirection: 'row',
        justifyContent: 'flex-start',
        alignItems: 'center',
        borderColor: constants.UIInActiveColor,
        borderBottomWidth: StyleSheet.hairlineWidth,
    },
    tabItem: {
        height: 40,
        margin: 0,
        flexDirection: 'row',
        justifyContent: 'flex-start',
        alignItems: 'center',

    },

});