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
                    <Text style={{marginLeft:constants.MarginLeftRight}}>{this.props.data.name}</Text>
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
                <View style={this.state.show?{flex:1}:{height:0}}>
                    {this.props.data.child.map((item, index) => {
                        return (
                                <View
                                    key={`keyItem=${index}`}
                                    style={[{flexDirection: 'column',
                                justifyContent: 'flex-start',
                                alignItems: 'stretch',
                               },this.state.show?{flex:1}:{height:0}]}>
                                    <Text>{item.Q}</Text>
                                    <Text>{item.detail}</Text>
                                </View>
                            )
                    })}
                </View>
            </View>

        )
    }


}

var styles = StyleSheet.create({

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
        flex:1,
        flexDirection: 'column',
        justifyContent: 'flex-start',
        alignItems: 'center',
        padding: 0,
    },
    tabTitle: {
        height: 50,
        margin: 0,
        flexDirection: 'row',
        justifyContent: 'flex-start',
        alignItems: 'center',
        backgroundColor: constants.UIBackgroundColor,
        borderColor: constants.UIInActiveColor,
        borderBottomWidth: StyleSheet.hairlineWidth,
        borderTopWidth: StyleSheet.hairlineWidth,

    },
    tabItem: {
        height: 40,
        margin: 0,
        flexDirection: 'row',
        justifyContent: 'flex-start',
        alignItems: 'center',
        backgroundColor: 'white',

    },

});