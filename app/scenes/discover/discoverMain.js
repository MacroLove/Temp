import React from "react";
import {View, Text, StyleSheet, Dimensions, KeyboardAvoidingView, ScrollView, TextInput, Image,
    TouchableOpacity
} from "react-native";
import {Button, TeaNavigator, NavigationBar, Label, ListRow, NavigationPage} from "teaset";
import Icon from "react-native-vector-icons/EvilIcons";
import * as Apis from '../../actions/apis';
import {bindActionCreators} from 'redux';
import {connect} from 'react-redux';
import {Actions} from "react-native-router-flux";
import * as Colors from "../../constants/Colors";
import {COLOR_NAV_BG} from "../../constants/Colors";
import HttpApi from "../../network/HttpApi";
import PTRListView, {RefreshState} from '../../widgets/PTRListView';
import Details from './article/details';
import Favors from './article/favors';
import {VIEW_ARTICLE_DETAILS} from "../../constants/ViewKeys";

let ScreenHeight = Dimensions.get('window').height;
let ScreenWidth = Dimensions.get('window').width;

/**
 * List cell item.
 * */
class MyListItem extends React.PureComponent {
    _onPress = () => {
        this.props.onPress && this.props.onPress(this.props.item);
    };

    render() {
        let cellH = 90;
        let padding = 14;
        let innerH = cellH - padding * 2;
        return (
            <TouchableOpacity style={{height:cellH, backgroundColor:'#fff', borderColor:'#eee', borderTopWidth:1, borderBottomWidth:1}} onPress={this._onPress()}>
                <View style={{flex:1, flexDirection:'row', padding:padding}}>
                    <Image
                        style={{width:innerH, height:innerH}}
                        resizeMode="contain"
                        source={{uri:'https://ss0.baidu.com/6ONWsjip0QIZ8tyhnq/it/u=3317564046,1989712836&fm=173&s=3A91A14CC323310D33E85811030080CA&w=218&h=146&img.JPEG'}}
                    />
                    <View style={{flex:1, justifyContent:'space-between', marginLeft:10}}>
                        <Text style={{color:'black', fontSize:14}} numberOfLines={2}>{this.props.item.title}</Text>
                        <View style={{flexDirection:'row', alignItems:'center'}}>
                            <Icon name="eye" color="gray" size={20}>
                            </Icon>
                            <Text style={styles.itemIconTitle}>{""+this.props.item.show}</Text>
                            <Icon name="like" color="gray" size={20} style={{marginLeft:10}}>
                            </Icon>
                            <Text style={styles.itemIconTitle}>{""+this.props.item.upvote}</Text>
                            <Icon name="comment" color="gray" size={20} style={{marginLeft:10}}>
                            </Icon>
                            <Text style={styles.itemIconTitle}>{""+this.props.item.comment}</Text>
                        </View>
                    </View>

                    <Text style={[styles.itemIconTitle, {width:80, textAlign:'right'}]}>{""+this.props.item.time}</Text>
                </View>
            </TouchableOpacity>
        )
    }
}

/**
 * Main list page
 * */
class MainView extends NavigationPage {

    static defaultProps = {
        ...NavigationPage.defaultProps,
        title: "发现",
        //scene: Navigator.SceneConfigs.FloatFromBottom,
        showBackButton: false,
    };

    constructor(props) {
        super(props);
        this.state = {
            page: 1,
            refreshState: RefreshState.Idle,
            data: [],
        };
    }

    componentDidMount() {
        this.onHeaderRefresh();
    }

    componentWillUnmount() {

    }

    renderNavigationRightView() {
        return <NavigationBar.LinkButton
            title="收藏"
            onPress={()=>{
                this.navigator.push({view: <Favors userInfo={this.props.userInfo} />});
            }}
        />
    }

    renderPage() {
        return (
            <View style={{flex: 1}}>
                {/*<ListRow title={'往期文章'} detail={'更多好文'} detailStyle={{color:COLOR_NAV_BG}}*/}
                         {/*accessory={<Icon name="chevron-right" color={COLOR_NAV_BG} size={40}/>}*/}
                         {/*onPress={()=>{*/}

                         {/*}}*/}
                {/*/>*/}

                <PTRListView
                    style={{flex: 1}}
                    data={this.state.data}
                    extraData={this.state}
                    keyExtractor={this._keyExtractor}
                    renderItem={this._renderItem}
                    refreshState={this.state.refreshState}
                    onHeaderRefresh={this.onHeaderRefresh}
                    onFooterRefresh={this.onFooterRefresh}
                />
            </View>
        );
    }

    _keyExtractor = (item, index) => item.id;


    onHeaderRefresh = () => {
        this.setState({refreshState: RefreshState.HeaderRefreshing})
        this.loadData(1);
    }

    onFooterRefresh = () => {
        this.setState({refreshState: RefreshState.FooterRefreshing})
        this.loadData(this.state.page+1);
    }

    loadData = (page) => {
        var thiz = this;
        HttpApi.getArticles({token:this.props.userInfo.token, p:page, type:1}, (resp, error)=>{
            let refreshState = resp && resp.length == 0 ? RefreshState.NoMoreData : RefreshState.Idle;
            if (error) {
                //PopAlert.showAlertView("错误", error+"");
            }else{
                console.log(resp);
                if (resp && resp.length > 0) {
                    if (page <= 1) {
                        thiz.state.data = resp;
                    }else{
                        thiz.state.data = thiz.state.data.concat(resp);
                    }
                }
            }
            thiz.setState({
                page:page,
                refreshState
            });
        });
    }

    _keyExtractor = (item, index) => item.id;

    _renderItem = ({item}) => (
        <MyListItem
            item={item}
            onPress={this._onPressItem}
        />
    );

    _onPressItem = (data)=>{
        Actions[VIEW_ARTICLE_DETAILS]({userInfo:this.props.userInfo, articleId:data.id});
    }
}

const styles = StyleSheet.create({
    itemIconTitle: {
        color:'gray',
        fontSize:13
    }
});

class DiscoverMain extends React.Component {
    render(){
        return (
            <TeaNavigator rootView={
                <MainView {...this.props}/>
            }/>
        );
    }
}


function mapStateToProps(state, ownProps) {
    return {
        userInfo: state.login
    };
}

function mapDispatchToProps(dispatch) {
    return {
        actions : bindActionCreators(Apis, dispatch),
        dispatch: dispatch
    };
}
export default connect(mapStateToProps, mapDispatchToProps)(DiscoverMain);
