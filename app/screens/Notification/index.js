import React, { Component } from "react";
import { RefreshControl, FlatList,AsyncStorage,Image } from "react-native";
import { BaseStyle, BaseColor,Images } from "@config";
import { Header, SafeAreaView, Icon,Text,Tag} from "@components";
import styles from "./styles";
// Load sample data
import { DataNotif } from "@data";
import { View } from "react-native-animatable";
import CardCustomNotif from "../../components/CardCustomNotif";
import NotYetLogin from "../../components/NotYetLogin";
import DataEmpty from "../../components/DataEmpty";


export default class Notification extends Component {
    constructor(props) {
        super(props);
        this.state = {
            refreshing: false,
            login:true,
            notification:DataNotif,
            statuses: [
                { id: "0", name: "Belum Dilihat", checked: true },
                { id: "1", name: "Sudah Dilihat" },
            ],
            idParam:"0",
            status:"belum_dilihat",

        };
        this.getConfig();
        this.getSession();
    }
    
    getConfig(){    
        AsyncStorage.getItem('config', (error, result) => {
            if (result) {    
                let config = JSON.parse(result);
                this.setState({config:config});
            }
        });
    }
    
    
    getSession(){    
        AsyncStorage.getItem('userSession', (error, result) => {
            if (result) {    
                let userSession = JSON.parse(result);
                var id_user=userSession.id_user;
                this.setState({id_user:id_user});
                this.setState({userSession:userSession});
                this.setState({login:true});
            }
        });
    }
    
    onSelectStatus(select) {
        this.setState({
            statuses: this.state.statuses.map(item => {
                if (item.id == select.id) {
                    return {
                        ...item,
                        checked: true
                    };
                } else {
                    return {
                        ...item,
                        checked: false
                    };
                }
            })
        });
        this.setState({idParam:select.id});
        if(select.id=="0"){
            this.setState({status:"belum_dilihat"});
        }else{
            this.setState({status:"dilihat"});
        }
        setTimeout(() => {
            this.fetchs();
        }, 50);
        
        
    }
    
    fetchs(){
        const {config,idParam,id_user,login} =this.state;
        var url=config.baseUrl;
        var path=config.user_notif.dir;
        this.setState({ loading_spinner: true }, () => {
            var myHeaders = new Headers();
            myHeaders.append("Content-Type", "application/json");
            
            if(login==true){
                var param={"param":{"id_user":id_user,"seen":idParam}};            
                var raw = JSON.stringify(param);
            }else{
                var param={"param":{"id_user":"1","seen":"1"}};            
                var raw = JSON.stringify(param);
            }

            //var raw = JSON.stringify({"param":{"id_user":id_user,"seen":idParam}});
            
            var requestOptions = {
              method: 'POST',
              headers: myHeaders,
              body: raw,
              redirect: 'follow'
            };
            
            fetch(url+path, requestOptions)
                .then(response => response.json())
              .then(result => {
                this.setState({loading_spinner: false });
                this.setState({notification:result});
              })
              .catch(error => {
                alert('Kegagalan Respon Server');
              });
        });
    }

    notif_update(id){
        const {config,idParam,id_user} =this.state;
        var url=config.baseUrl;
        var path='front/api/user/notif_update';
            var myHeaders = new Headers();
            myHeaders.append("Content-Type", "application/json");
            var raw = JSON.stringify({"param":{"id":id}});
            var requestOptions = {
              method: 'POST',
              headers: myHeaders,
              body: raw,
              redirect: 'follow'
            };
            
            fetch(url+path, requestOptions)
                .then(response => response.json())
                .then(result => {
                    
                })
              .catch(error => {
                alert('Kegagalan Respon Server');
              });
    }
    
    componentWillMount() {
    
    

        let { navigation, auth } = this.props;
        AsyncStorage.getItem('userSession', (error, result) => {
            if (result) {    
               
                this.setState({login:true});
              
            }else{
    
                this.setState({login:false});
            }
        });
    
    }

    componentDidMount() {
        let {} = this.state;
        const {navigation} = this.props;
            navigation.addListener ('willFocus', () =>{
                this.setState({idParam:"0"});
                this.setState({ loading_spinner: true });
                setTimeout(() => {
                    this.setState({notification:[]})
                    //this.fetchs();
                }, 50);
            });
    }

        
    render() {
        const { navigation } = this.props;
        let { notification,statuses,login } = this.state;
        var contents=<View />
        var content=<View></View>
        if (notification.length == 0) {
            content=<DataEmpty />
        }else{
            content=<FlatList
                        refreshControl={
                            <RefreshControl
                                colors={[BaseColor.primaryColor]}
                                tintColor={BaseColor.primaryColor}
                                refreshing={this.state.refreshing}
                                onRefresh={() => { }}
                            />
                        }
                        data={notification}
                        keyExtractor={(item, index) => item.id_notification}
                        renderItem={({ item, index }) => (
                            <CardCustomNotif
                                image={item.image}
                                txtLeftTitle={item.title}
                                txtContent={item.content}
                                txtRight={item.id_user}
                                loading={this.state.loading_spinner}
                                onPress={() => {
                                    var param={
                                        url:item.tautan+'?access=app',
                                        title:'Order Detail',
                                        subTitle:''
                                    }
                                    
                                    var redirect='Pembayaran';
                                    var id_order=item.tautan.match(/\d+$/)[0];
                                    
                                    var param={
                                        id_order:id_order,
                                        dataPayment:{},
                                        back:'Notification'
                                    }
                                    var id=item.id_notification;
                                    this.notif_update(id);
                                    this.props.navigation.navigate("Pembayaran",{redirect:redirect,param:param});
                           
                                }}
                            />
                        )}
                    /> 
        }

        if(login==true){ 
            contents=<View style={{}}>
                        {/* <View style={[{flexDirection: "row",
                                    paddingVertical:5,
                                    backgroundColor:BaseColor.secondColor}]}>
                            <View style={{marginLeft:20}}>
                            <FlatList
                                horizontal={true}
                                showsHorizontalScrollIndicator={false}
                                data={statuses}
                                keyExtractor={(item, index) => item.id}
                                renderItem={({ item, index }) => (
                                    <Tag
                                        primary={item.checked}
                                        style={{ marginRight: 10, width: 100,borderRadius:5 }}
                                        outline={!item.checked}
                                        onPress={() =>
                                            this.onSelectStatus(item)
                                        }
                                    >
                                        {item.name}
                                    </Tag>
                                )}
                            />
                            </View>
                        </View> */}
                        {content}
                    </View>
        }else{

           contents=<NotYetLogin redirect={'Home'} navigation={navigation} />
        }

        return (
            <SafeAreaView
            style={[BaseStyle.safeAreaView,{backgroundColor:BaseColor.bgColor}]}
                forceInset={{ top: "always" }}
            >
                <Header
                    title="Notification"
                    renderLeft={() => {
                        return (
                            <Icon
                                name="arrow-left"
                                size={20}
                                color={BaseColor.whiteColor}
                            />
                        );
                    }}
                    onPressLeft={() => {
                        navigation.goBack();
                    }}
                />
                    {contents}
               
                
            </SafeAreaView>
        );
    }
}
