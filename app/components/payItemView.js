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
    NativeAppEventEmitter,


} from 'react-native';
import Icon from 'react-native-vector-icons/Ionicons';
import constants from  '../constants/constant';

export default class PayTabView extends Component {
    // 构造
    constructor(props) {
        super(props);
        // 初始状态
        this.state = {
            //showIcon: this.props.showIcon,
            showChild: this.props.showChild,
            showCost_2: this.props.showCost_2,
            selected: this.props.selected,
            payList: this.props.payList,
            selectedAll: this.props.selectedAll,
            pageType: this.props.pageType,

        };
    }


    componentWillReceiveProps(nextProps) {

        let selectedAll = nextProps.selectedAll
        if (selectedAll) {
            console.log(`_selectTab:` + selectedAll)
            this.setState({
                selected: true,
            })
        }
    }


    static propTypes = {
        child: PropTypes.array.isRequired,
        cost_1_title: PropTypes.string,
        cost_2_title: PropTypes.string,
        payList: PropTypes.array,
        //showIcon: PropTypes.bool,
        showCost_2: PropTypes.bool,
        showChild: PropTypes.bool,
        pageType: PropTypes.string.isRequired,
        selectedAll: PropTypes.bool,
    }

    static defaultProps = {
        cost_1_title: '预估',
        cost_2_title: '实际',
        //showIcon: false,
        showCost_2: false,
        showChild: false,
        selectedAll: false,
    }


    /**
     *
     first_cost_name 一级费用名称

     cost_name 二级费用名称

     estimate_cost 预估费用

     cost 实际费用

     id id

     is_cal 是否计算，0否，1是`

     is_pay 是否支付，0否，1是`
     * @returns {XML}
     */

    render() {


        let total = 0
        for (data of this.props.child) {
            if (this.props.pageType == 'pay') {

                total += data.cost

            } else {
                total += data.estimate_cost
            }
        }
        let allSelected = false;
        for (data of this.props.child) {

            if (data.is_pay == 0) {
                //未支付了
                allSelected = true
                break
            }
            allSelected = false
        }
        return (
            <View
                ref={ (component) => this._TabView = component }
                style={{flex:1,flexDirection: 'column'}}>
                <View style={styles.viewItem}>
                    <TouchableOpacity
                        style={[{flexDirection:'row',justifyContent:'center'},
                            this.state.pageType=='pay'?{width:30,}:{width:0}]}
                        onPress={()=>{
                         console.log(`child.length:`+this.props.child.length)
                            if(!allSelected){
                            // 已经全选了
                            return
                            }
                            if(this.props.pageType!='pay'){
                                return
                            }

                                let flag=this.state.selected
                                let showChild=this.state.showChild
                                if(!this.state.selected){
                                //全部选中
                                    for(data of this.props.child){
                                        if(!data.is_pay&&this.props.payList.indexOf(data.id)==-1){
                                           //不包含
                                            this.props.payList.push(data.id)
                                        }

                                    }
                                    //需要显示
                                    showChild=true

                                }else{
                                //全部取消
                                    for(data of this.props.child){
                                        if(!data.is_pay&&this.props.payList.indexOf(data.id)==-1){
                                            //不包含
                                        }else if((!data.is_pay&&this.props.payList.indexOf(data.id)!=-1)){
                                         //包含
                                        this.props.payList.splice(this.props.payList.indexOf(data.id), 1)
                                        }else if(data.is_pay){
                                        //是已支付的项
                                            flag=false
                                            break
                                        }

                                    }
                                }

                                 this.setState({
                                selected:!flag,
                                showChild:showChild,
                                payList:this.props.payList
                                })
                                console.log(`payList:`,this.props.payList.length)
                                 //统计总价
                                 NativeAppEventEmitter.emit('in_payPage_need_set_total',false)
                              }}>
                        {   allSelected ?
                            <Icon
                                name={this.state.selected?'ios-radio-button-on':'ios-radio-button-off'}  // 图标
                                size={constants.IconSize-5}
                                color={this.state.selected?constants.UIActiveColor:constants.UIInActiveColor}/> : null
                        }
                    </TouchableOpacity>
                    <TouchableOpacity style={{flex:1,marginLeft:5,flexDirection:'row',alignItems:'stretch',}}
                                      onPress={()=>{
                                this.setState({
                                showChild:!this.state.showChild,})
                              }}>
                        <View style={{flexDirection:'column',justifyContent:'center'}}>
                            <Text style={{textAlign:'center',}}>{this.props.child[0].first_cost_name}</Text>
                        </View>
                        <View
                            style={{flex:1,flexDirection:'row',justifyContent:'flex-end',marginRight:5,alignItems:'center'}}>
                            <Text style={{color:constants.UIActiveColor,marginRight:5}}>￥{total}</Text>
                            <Icon
                                name={this.state.showChild?'ios-arrow-down':'ios-arrow-up'}  //上下
                                size={constants.IconSize}
                                color={constants.UIInActiveColor}/>
                        </View>
                    </TouchableOpacity>

                </View>
                <View style={[{flexDirection: 'column',},this.state.showChild?{flex:1}:{height:0}]}>
                    {  this.props.child.map((item, index) => {

                        return (
                            <TouchableOpacity style={styles.textTitle}
                                              key={`keyIndex${index}`}
                                              onPress={()=>{
                                                  if(item.is_pay==1){
                                                  //已经支付此项
                                                    return
                                                  }
                                                  if(this.props.pageType!='pay'){
                                                        return
                                                    }

                                        let flag=false
                                        if( !item.is_pay&&this.props.payList.indexOf(item.id)==-1){
                                            //不包含
                                            this.props.payList.push(item.id)

                                        }else if(!item.is_pay&&this.props.payList.indexOf(item.id)!=-1){
                                             //包含
                                            this.props.payList.splice(this.props.payList.indexOf(item.id),1)
                                            flag=true
                                        }
                                        //判断所有项是否有选中
                                         for(data of this.props.child){
                                                if(this.props.payList.indexOf(data.id)!=-1&&!data.is_pay){
                                                //包含
                                                flag=false
                                                 break
                                                }else {
                                                 //不包含
                                                flag=true
                                                }
                                              }

                                            this.setState({payList:this.props.payList,selected:!flag})
                                            console.log(`payList:`,this.props.payList.length)
                                            //统计总价
                                            NativeAppEventEmitter.emit('in_payPage_need_set_total',false)}}>

                                <View style={{flex:1,flexDirection:'column',alignItems:'stretch'}}>
                                    <Text style={{flex:1}}>{item.cost_name}</Text>
                                    <View style={styles.textDetail}>
                                        <Text>{this.props.cost_1_title}</Text>
                                        <Text>￥{item.estimate_cost}</Text>
                                        <View style={{marginLeft:15,flexDirection:'row'}}>
                                            <Text>{this.props.cost_2_title}</Text>
                                            <Text style={{color:constants.UIActiveColor}}>￥{item.cost}</Text>
                                            <Text
                                                style={{marginLeft:15,color:constants.UIActiveColor}}>
                                                {item.is_pay == 0 ? '未支付' : '已支付'}</Text>
                                        </View>
                                    </View>
                                </View>
                                <View
                                    style={[{flexDirection: 'row',justifyContent:'center',alignItems:'center',},
                                        this.state.pageType=='pay'&&item.is_pay == 0?{width:30,}:{width:0}]}>
                                    <Icon
                                        name={this.state.payList.indexOf(item.id)==-1?
                                            'ios-radio-button-off':'ios-radio-button-on'}  // 图标
                                        size={constants.IconSize-5}
                                        color={this.state.payList.indexOf(item.id)==-1?
                                            constants.UIInActiveColor:constants.UIActiveColor}/>
                                </View>
                            </TouchableOpacity>

                        )
                    })

                    }
                </View>
            </View>
        )
    }

}

var styles = StyleSheet.create({
    viewItem: {
        height: 50,
        flexDirection: 'row',
        justifyContent: 'flex-start',
        alignItems: 'center',
        paddingLeft: constants.MarginLeftRight,
        paddingRight: constants.MarginLeftRight,

        backgroundColor: 'white',
        borderBottomWidth: StyleSheet.hairlineWidth,
        borderTopWidth: StyleSheet.hairlineWidth,
        borderColor: constants.UIInActiveColor
    },
    tabItem: {
        height: 50,
        margin: 0,
        paddingRight: constants.MarginLeftRight,
        paddingLeft: constants.MarginLeftRight,

        flexDirection: 'row',
        justifyContent: 'flex-start',
        alignItems: 'center',
        backgroundColor: 'white',

    },
    textTitle: {
        flex: 1,
        paddingTop: 10,
        paddingBottom: 10,
        flexDirection: 'row',
        justifyContent: 'flex-start',
        alignItems: 'stretch',
        //borderBottomWidth: StyleSheet.hairlineWidth,
        borderColor: constants.UIInActiveColor,
        paddingLeft: constants.MarginLeftRight,
    },
    textDetail: {
        flex: 1,
        flexDirection: 'row',
        justifyContent: 'flex-start',
        alignItems: 'center',
    },


});