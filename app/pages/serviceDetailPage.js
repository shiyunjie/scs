/**
 * Created by shiyunjie on 16/12/6.
 */
import React, { Component } from 'react';
import {
    StyleSheet,
    Text,
    View,
    Platform,
    TouchableOpacity,
    ScrollView,
    TextInput,
    Linking,
} from 'react-native';


import constants from  '../constants/constant';
import UploadPage from './uploadPage';

export default class ServiceDetail extends Component {
    render() {
        return (
            <ScrollView style={styles.container}>
                <View style={styles.viewItem}>
                    <View style={{flex:3, flexDirection: 'row',justifyContent:'flex-start',}}>
                        <Text>单号:</Text>
                        <Text>{this.props.orderNum}</Text>
                    </View>
                    <View
                        style={{flex:1,justifyContent:'flex-end',paddingRight:constants.MarginLeftRight,}}>
                        <Text style={{color:constants.UIActiveColor}}>{this.props.rightText}</Text>
                    </View>
                </View>
                <View style={styles.line}/>
                <View style={styles.viewItem}>
                    <Text>发布时间:</Text>
                    <Text>{this.props.time}</Text>
                </View>
                <View style={styles.line}/>
                <View style={styles.viewItem}>
                    <Text>贸易条款:</Text>
                    <Text>{this.props.time}</Text>
                </View>
                <View style={styles.line}/>
                <View style={styles.viewItem}>
                    <Text>委托人:</Text>
                    <Text>用户名</Text>
                </View>
                <View style={styles.line}/>
                <View style={[styles.viewItem]}>
                    <TouchableOpacity style={{flex:1,justifyContent:'center',alignItems:'center',}} onPress={()=>{

                    }}>
                        <Text style={{color:constants.UIActiveColor}}>账单</Text>

                    </TouchableOpacity>
                    <TouchableOpacity style={{flex:1,justifyContent:'center',alignItems:'center',}} onPress={()=>{
                            this.props.navigator.push({
                                        title: '上传资料',
                                        component: UploadPage,
                                        passProps: {
                                            id:this.props.id,
                                        }
                                    });
                    }}>
                        <Text style={{color:constants.UIActiveColor}}>上传</Text>

                    </TouchableOpacity>
                    <TouchableOpacity style={{flex:1,justifyContent:'center',alignItems:'center',}} onPress={()=>{

                    }}>
                        <Text style={{color:constants.UIActiveColor}}>取消</Text>

                    </TouchableOpacity>
                </View>
                <View style={styles.line}/>
                <View style={styles.viewItem}>
                    <Text>联系方式:</Text>
                    <Text>13313313131</Text>
                </View>
                <View style={styles.line}/>
                <View style={styles.viewItem}>
                    <Text>出发国家:</Text>
                    <Text>日本</Text>
                </View>
                <View style={styles.line}/>
                <View style={styles.viewItem}>
                    <Text>目的国家:</Text>
                    <Text>中国</Text>
                </View>
                <View style={styles.line}/>
                <View style={[styles.viewItem,{flex:1},]}>
                    <Text>货代服务:</Text>
                    <Text >进口清关、需求国际物流、需求国内物流、出口国陆运</Text>
                </View>
                <View style={styles.line}/>
                <View style={styles.viewItem}>
                    <Text>支付方式:</Text>
                    <Text>信用证</Text>
                </View>
                <View style={styles.line}/>
                <View style={[styles.viewItem,{flex:1,}]}>
                    <Text>委托内容:</Text>
                    <Text style={{ fontStyle:'italic',}}>FOB模式,体积2立方米,5件运品,谢谢</Text>
                </View>
                <View style={[styles.line,{marginBottom:10}]}/>
                <View style={[styles.viewItem,{flex:1,}]}>
                    <Text>船公司:</Text>
                    <Text style={{ fontStyle:'italic',}}>UASC</Text>
                </View>
                <View style={[styles.line,]}/>
                <View style={[styles.viewItem,{flex:1,}]}>

                    <Text>公司名字:</Text>
                    <Text style={{ fontStyle:'italic',}}>阿拉伯轮船</Text>

                </View>
                <View style={[styles.line,]}/>
                <View style={[styles.viewItem,{flex:1,}]}>

                    <Text>英文船名:</Text>
                    <Text style={{ fontStyle:'italic',}}>UACE</Text>

                </View>
                <View style={[styles.line,]}/>
                <View style={[styles.viewItem,{flex:1,}]}>

                    <Text>航次:</Text>
                    <Text style={{ fontStyle:'italic',}}>062</Text>

                </View>
                <View style={[styles.line,]}/>
                <View style={[styles.viewItem,{flex:1,}]}>

                    <Text>提单号:</Text>
                    <Text style={{ fontStyle:'italic',}}>GNNCSY</Text>

                </View>
                <View style={[styles.line,]}/>
                <View style={[styles.viewItem,{flex:1,}]}>

                    <Text>目的港:</Text>
                    <Text style={{ fontStyle:'italic',}}>UAGN</Text>

                </View>
                <View style={[styles.line,]}/>
                <View style={[styles.viewItem,{flex:1,}]}>

                    <Text>箱型数量:</Text>
                    <Text style={{ fontStyle:'italic',}}>45GP*2</Text>

                </View>
                <View style={[styles.line,]}/>
                <View style={[styles.viewItem,{flex:1,}]}>

                    <Text>提箱堆场:</Text>
                    <Text style={{ fontStyle:'italic',}}>兴合货柜</Text>

                </View>
                <View style={[styles.line,]}/>
                <View style={[styles.viewItem,{flex:1,}]}>

                    <Text>装箱地点:</Text>
                    <Text style={{ fontStyle:'italic',}}>雅戈尔</Text>

                </View>
                <View style={[styles.line,]}/>
                <View style={[styles.viewItem,{flex:1,}]}>

                    <Text>件数:</Text>
                    <Text style={{ fontStyle:'italic',}}>10</Text>

                </View>
                <View style={[styles.line,]}/>
                <View style={[styles.viewItem,{flex:1,}]}>

                    <Text>毛重:</Text>
                    <Text style={{ fontStyle:'italic',}}>10</Text>

                </View>
                <View style={[styles.line,]}/>
                <View style={[styles.viewItem,{flex:1,}]}>

                    <Text>体积:</Text>
                    <Text style={{ fontStyle:'italic',}}>234</Text>

                </View>
                <View style={[styles.line,]}/>
                <View style={[styles.viewItem,{flex:1,}]}>

                    <Text>合同号:</Text>
                    <Text style={{ fontStyle:'italic',}}>GN234</Text>

                </View>
                <View style={[styles.line,]}/>
                <View style={[styles.viewItem,{flex:1,}]}>

                    <Text>发票号:</Text>
                    <Text style={{ fontStyle:'italic',}}>934782</Text>

                </View>
                <View style={[styles.line,]}/>
                <View style={[styles.viewItem,{flex:1,}]}>

                    <Text>收货人:</Text>
                    <Text style={{ fontStyle:'italic',}}>YGS</Text>

                </View>
                <View style={[styles.line,]}/>
                <View style={[styles.viewItem,{flex:1,}]}>

                    <Text>发货人:</Text>
                    <Text style={{ fontStyle:'italic',}}>BBQ</Text>

                </View>
                <View style={[styles.viewItem,{flex:1,}]}>

                    <Text>物流状态:</Text>
                    <Text style={{ fontStyle:'italic',color:constants.UIActiveColor}}>已接单</Text>

                </View>
                <View style={[styles.line,{marginBottom:10}]}/>

                <TextInput
                    style={{flex:1,fontSize:15,textAlignVertical:'top',

                      justifyContent:'flex-start',

                      }}
                    clearButtonMode="while-editing"
                    placeholder='拒绝原因'
                    maxLength={300}
                    underlineColorAndroid='transparent'
                    multiline={true}//多行输入
                    numberOfLines={6}
                />
                <View style={[styles.line,{marginBottom:10}]}/>
                <View style={[styles.line,{marginBottom:10}]}/>
                <View style={[styles.viewItem]}>
                    <TouchableOpacity
                        style={{flex:1,justifyContent:'center',alignItems:'center',}}
                        onPress={()=>{
        //打电话
        return Linking.openURL(constants.Tel);
                    }}><Text style={{color:constants.UIActiveColor}}>联系客服</Text></TouchableOpacity>
                    <View style={[styles.line,{marginBottom:10}]}/>
                </View>
            </ScrollView>
        );
    }
}

const styles = StyleSheet.create({
    container: {
        flex: 1,


        marginTop: Platform.OS == 'ios' ? 64 : 56,
        backgroundColor: constants.UIBackgroundColor,
    },
    viewItem: {
        height: 50,
        flexDirection: 'row',
        justifyContent: 'flex-start',
        alignItems: 'center',
        paddingLeft: constants.MarginLeftRight,
    },
    line: {
        marginLeft: constants.MarginLeftRight,
        marginRight: constants.MarginLeftRight,
        borderBottomWidth: StyleSheet.hairlineWidth,
        borderColor: constants.UIInActiveColor,
    }

});