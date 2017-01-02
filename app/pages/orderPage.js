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
} from 'react-native';


import constants from  '../constants/constant';
import PullToRefreshListView from 'react-native-smart-pull-to-refresh-listview';
import OrderListPage from './orderListPage';
import ServiceListPage from './serviceListPage';

import ScrollableTabView  from 'react-native-scrollable-tab-view';
import MyDefaultTabBar from '../components/defaultTabBar';

export default class Order extends Component {
    // 构造
    constructor(props) {
        super(props);
        // 初始状态
        this.state = {
            tabNames: ['委托单', '服务单',],
            tabIconNames: ['委托单', '服务单',],
            tabNums:[1,0,],
        };
    }
/*<TabNavigator
tabBarStyle={styles.container}
>

<TabNavigator.Item
selected={this.state.selectedTab === '委托单'}
renderIcon={() => {return(
    <View >
        <View style={{flex:6,justifyContent:'center',alignItems:'center'}}>
            <Text style={[this.state.index==0?{color:constants.UIActiveColor}:{}]}>委托单</Text>
        </View><View style={[{flex:1,},this.state.index==0?{backgroundColor:constants.UIActiveColor}:{}]}/></View>)
}
}
onPress={() => {this.setState({
    selectedTab: '委托单',
    index:0
});

}}

>
<OrderListPage navigator={this.props.navigator}/>
</TabNavigator.Item>
<TabNavigator.Item
selected={this.state.selectedTab === '服务单'}

renderIcon={() => {return( <View >
    <View style={{flex:6,justifyContent:'center',alignItems:'center'}}>
        <Text style={[this.state.index==1?{color:constants.UIActiveColor}:{}]}>服务单</Text>
    </View><View style={[{flex:1,},this.state.index==1?{backgroundColor:constants.UIActiveColor}:{}]}/></View>)}

}
onPress={() => this.setState({
    selectedTab: '服务单',
    index:1,
})}
>
<ServiceListPage navigator={this.props.navigator}/>
</TabNavigator.Item>
</TabNavigator>*/

    render() {
        let tabNames = this.state.tabNames;
        let tabIconNames = this.state.tabIconNames;
        let tabNums=this.state.tabNums;
        return (<ScrollableTabView
            locked={true}
            renderTabBar={()=><MyDefaultTabBar tabNames={tabNames} tabIconNames={tabIconNames} tabNums={tabNums}/>}
        >
            <OrderListPage navigator={this.props.navigator} tabLabel="委托单" />
            <ServiceListPage navigator={this.props.navigator} tabLabel="服务单" /></ScrollableTabView>);
    }
}

const styles = StyleSheet.create({
    container: {
        height: 40,
        marginTop: Platform.OS == 'ios' ? 64 : 56,

        backgroundColor: constants.UIBackgroundColor,
        position: 'absolute',
        top: 0,
        justifyContent: 'center',
        alignItems: 'stretch',
    },
});