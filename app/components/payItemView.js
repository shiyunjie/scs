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
            pageType: this.props.pageType,

        };
    }


    componentWillReceiveProps(nextProps) {

        let selectedAll = nextProps.selectedAll
        if (selectedAll) {
                //全部选中
            if(!this.props.selectedAll) {
                //console.log(`_selectTab:` + this.props.selectedAll)
                this.setState({
                    selected: true,
                })
                this.props.selectedAll=false
            }else{
                //已经全选过一次了
                //console.log(`this.props.selectedAll:` + this.props.selectedAll)
                //判断所有项是否有选中
                let flag=false
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
                this.setState({
                    selected: !flag,
                })
            }
        }else{
            //取消全选
            this.setState({
                selected: false,
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

            if (data.is_pay == 0&&data.cost!=0) {
                //未支付了
                allSelected = true
                break
            }
            allSelected = false
        }
        return (
            <View
                style={{flex:1,flexDirection: 'column'}}>
                <View style={styles.viewItem}>
                    {this.state.pageType=='pay'?
                        <TouchableOpacity
                            style={[{flexDirection:'row',justifyContent:'center'},
                            {width:30,}]}
                            onPress={()=>{
                         //console.log(`child.length:`+this.props.child.length)
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
                                        if(data.cost!=0&&!data.is_pay&&this.props.payList.indexOf(data.id)==-1){
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
                                        }/*else if(data.is_pay){
                                        //是已支付的项
                                            flag=false
                                            break
                                        }*/

                                    }
                                }

                                 this.setState({
                                selected:!flag,
                                showChild:showChild,
                                payList:this.props.payList
                                })
                                //this.props.selectedAll=!flag
                                //console.log(`payList:`,this.props.payList.length)
                                 //统计总价
                                 NativeAppEventEmitter.emit('in_payPage_need_set_total',false)
                              }}>
                            {   allSelected ?
                                <Icon
                                    name={this.state.selected?'ios-radio-button-on':'ios-radio-button-off'}  // 图标
                                    size={constants.IconSize-5}
                                    color={this.state.selected?constants.UIActiveColor:constants.UIInActiveColor}/> : null
                            }
                        </TouchableOpacity>:<View style={{width:30}}/>
                    }
                    <TouchableOpacity style={{flex:1,flexDirection:'row',alignItems:'stretch',}}
                                      onPress={()=>{
                                this.setState({
                                showChild:!this.state.showChild,})
                              }}>
                        <View style={{flexDirection:'column',justifyContent:'center'}}>
                            <Text style={[styles.labelText,{textAlign:'center',}]}>{this.props.child[0].first_cost_name}</Text>
                        </View>
                        <View
                            style={{flex:1,flexDirection:'row',justifyContent:'flex-end',marginRight:10,alignItems:'center'}}>
                            <Text style={[styles.labelText,{color:constants.UIActiveColor,marginRight:10}]}>￥{total}</Text>
                            <Icon
                                name={this.state.showChild?'ios-arrow-down':'ios-arrow-up'}  //上下
                                size={constants.IconSize-5}
                                color={constants.LineColor}/>
                        </View>
                    </TouchableOpacity>

                </View>
                {this.state.showChild?
                    <View style={[{flexDirection: 'column',},{flex:1,paddingRight:5,}]}>
                        {  this.props.child.map((item, index) => {

                            return (
                                <TouchableOpacity style={styles.textTitle}
                                                  key={`keyIndex${index}`}
                                                  onPress={()=>{
                                                  if(item.is_pay==1||item.cost==0){
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
                                            //console.log(`payList:`,this.props.payList.length)
                                            //this.props.selectedAll=!flag
                                            //统计总价

                                            NativeAppEventEmitter.emit('in_payPage_need_set_total',false)}}>

                                    <View style={{flex:1,flexDirection:'column',alignItems:'stretch'}}>
                                        <View style={{flex:1,flexDirection:'row',}}>
                                            <Text style={[styles.labelText,{flex:1,fontSize:12,}]}>{item.cost_name}</Text>
                                            <Text
                                                style={[styles.labelText,{flex:1,color:constants.UIActiveColor,fontSize:12,}]}>
                                                {item.is_pay == 0 ? '未支付' : '已支付'}</Text>
                                        </View>
                                        <View style={styles.textDetail}>
                                            <View style={{flex:1,flexDirection:'row'}}>
                                                <Text style={[styles.contentText,{fontSize:12,}]}>{this.props.cost_1_title}</Text>
                                                <Text style={[styles.contentText,{fontSize:12,}]}>￥{item.estimate_cost}</Text>
                                            </View>
                                            <View style={{flex:1,flexDirection:'row'}}>
                                                <Text style={[styles.contentText,{fontSize:12,color:constants.UIActiveColor}]}>{this.props.cost_2_title}</Text>
                                                <Text style={[styles.contentText,{fontSize:12,color:constants.UIActiveColor}]}>￥{item.cost}</Text>

                                            </View>


                                        </View>
                                    </View>
                                    {this.state.pageType=='pay'&&item.is_pay == 0&&item.cost!=0?
                                        <View
                                            style={[{flexDirection: 'row',justifyContent:'center',alignItems:'center',},
                                        {width:30,}]}>
                                            <Icon
                                                name={this.state.payList.indexOf(item.id)==-1?
                                            'ios-radio-button-off':'ios-radio-button-on'}  // 图标
                                                size={constants.IconSize-5}
                                                color={this.state.payList.indexOf(item.id)==-1?
                                            constants.UIInActiveColor:constants.UIActiveColor}/>
                                        </View>:<View style={{width:30,}}/>
                                    }
                                </TouchableOpacity>

                            )
                        })

                        }
                    </View>:null
                }
            </View>
        )
    }

}

var styles = StyleSheet.create({
    viewItem: {
        height: 40,
        flexDirection: 'row',
        justifyContent: 'flex-start',
        alignItems: 'center',
        paddingLeft: 5,
        paddingRight: constants.MarginLeftRight,
        overflow:'hidden',//极大提高显示效率,
        backgroundColor: 'white',
        borderBottomWidth: StyleSheet.hairlineWidth,
        //borderTopWidth: StyleSheet.hairlineWidth,
        borderColor: constants.LineColor
    },
    tabItem: {
        height: 40,
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
        borderBottomWidth: StyleSheet.hairlineWidth,
        borderColor: constants.LineColor,
        paddingLeft:30+constants.MarginLeftRight,
    },
    textDetail: {
        flex: 1,
        flexDirection: 'row',
        justifyContent: 'flex-start',
        alignItems: 'center',
    },
    labelText: {
        fontSize: 14,
        color: constants.LabelColor,
    },
    contentText: {
        fontSize: 12,
        color: constants.PointColor,
        paddingRight:5,
    },


});