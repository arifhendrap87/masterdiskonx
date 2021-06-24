import React, { Component } from "react";
import { RefreshControl, FlatList,AsyncStorage} from "react-native";
import { BaseStyle, BaseColor} from "@config";
import { Header, SafeAreaView, Icon,Tag,Text} from "@components";
import { View } from "react-native-animatable";

import styles from "./styles";
import {DataBooking } from "@data";

import DataEmpty from "../../components/DataEmpty";
import NotYetLogin from "../../components/NotYetLogin";
import CardCustomBooking from "../../components/CardCustomBooking";
  import {
    Placeholder,
    PlaceholderMedia,
    PlaceholderLine,
    Fade
  } from "rn-placeholder";

export default class Booking extends Component {
    constructor(props) {
        super(props);
        this.state = {
            refreshing: false,
            login:true,
            dataBooking:DataBooking,
            loading_spinner:true,
            statuses: [
                { id: "1", name: "New Order", checked: true },
                { id: "3", name: "Processed" },
                { id: "5", name: "Paid" },
                { id: "7", name: "Booked" },
                { id: "9", name: "Complete" },
                { id: "11", name: "Canceled" },
                { id: "13", name: "Expired" },
                { id: "15", name: "Billed" },
                { id: "17", name: "Deny" },
                { id: "19", name: "Error" },
                { id: "21", name: "Dropped" },
                { id: "23", name: "Refunded" }
            ],
            idParam:"1",
            id_user:"1"

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
    
    
    fetch(){
            const {config,login,id_user,idParam} =this.state;

            var url=config.baseUrl;
            var path=config.user_order.dir;
            
            this.setState({ loading_spinner: true }, () => {

            var myHeaders = new Headers();
            myHeaders.append("Content-Type", "application/json");

            if(login==true){
                var param={"param":{"id":id_user,"id_order":"","id_order_status":"","product":""}};            
                var raw = JSON.stringify(param);
            }else{
                var param={"param":{"id":"","id_order":"","id_order_status":"1","product":"Trip"}};            
                var raw = JSON.stringify(param);
            }

           

       
            var requestOptions = {
              method: 'POST',
              headers: myHeaders,
              body: raw,
              redirect: 'follow'
            };
            console.log('fetchbooking',url+path,JSON.stringify(param));
            fetch(url+path, requestOptions)
              .then(response => response.json())
              .then(result => {
                  //console.log('historyBooking',JSON.stringify(result));
                this.setState({loading_spinner: false });
                this.setState({dataBooking: result});
              })
              .catch(error => {
                alert('Kegagalan Respon Server');
              });

            });
            
    }

    fetch_num(){
        const {config,login,id_user,idParam} =this.state;
    
        var url=config.baseUrl;
        var path='front/api/order/get_booking_history_num';
        
        var myHeaders = new Headers();
        myHeaders.append("Content-Type", "application/json");
        
        if(login==true){
            var param={"param":{"id":id_user,"id_order":"","id_order_status":"","product":""}};            
            var raw = JSON.stringify(param);
        }else{
            var param={"param":{"id":"1","id_order":"","id_order_status":"","product":""}};            
            var raw = JSON.stringify(param);
        }

        
        var requestOptions = {
          method: 'POST',
          headers: myHeaders,
          body: raw,
          redirect: 'follow'
        };
        fetch(url+path, requestOptions)
          .then(response => response.json())
          .then(result => {
              var arr_num=result;
              var statuses=[
                { id: "1", name: "New Order ("+arr_num._1+")", checked: true },
                { id: "3", name: "Processed ("+arr_num._3+")" },
                { id: "5", name: "Paid ("+arr_num._5+")" },
                { id: "7", name: "Booked ("+arr_num._7+")" },
                { id: "9", name: "Complete ("+arr_num._9+")" },
                { id: "11", name: "Canceled ("+arr_num._11+")" },
                { id: "13", name: "Expired ("+arr_num._13+")" },
                { id: "15", name: "Billed ("+arr_num._15+")" },
                { id: "17", name: "Deny ("+arr_num._17+")" },
                { id: "19", name: "Error ("+arr_num._19+")" },
                { id: "21", name: "Dropped ("+arr_num._21+")" },
                { id: "23", name: "Refunded ("+arr_num._23+")" }
            ];
            this.setState({statuses:statuses});
          })
          .catch(error => {
            alert('Kegagalan Respon Servers');
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
            navigation.addListener ('didFocus', () =>{
                this.setState({idParam:"1"});
                this.setState({ loading_spinner: true });
                setTimeout(() => {
                    this.fetch();
                    this.fetch_num();
                }, 50);
            });
    }

    fallData(){

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
        setTimeout(() => {
            this.fetch();
        }, 50);
        
    }

    render() {
        const { navigation } = this.props;
        let { login,dataBooking,statuses} = this.state;
        var contents=<View />
        var content=<View></View>
        if (this.state.dataBooking.length == 0) {
            content= <DataEmpty />
        }else{
            content=<FlatList
                        // horizontal={true}
                        // showsHorizontalScrollIndicator={false}
                        refreshControl={
                            <RefreshControl
                                colors={[BaseColor.primaryColor]}
                                tintColor={BaseColor.primaryColor}
                                refreshing={this.state.refreshing}
                                onRefresh={() => { }}
                            />
                        }
                        style={{}}
                        data={this.state.dataBooking}
                        keyExtractor={(item, index) => item.id}
                        renderItem={({ item, index }) => (
                           
                            item.detail.length != 0 ?
                            <CardCustomBooking
                                // style={{ marginTop: 10 }}
                                item={item}
                                loading={this.state.loading_spinner}
                                navigation={navigation}
                            
                            />
                            :
                            <View />
                        )}
                    /> 
        }

            if(login==true){ 
                contents=<View style={{}}>
                            {/* <View style={[styles.contentList]}>
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
    
               contents=<NotYetLogin redirect={'Booking'} navigation={navigation} />
            }
       
    
        return (
            <SafeAreaView
                style={[BaseStyle.safeAreaView,{backgroundColor:BaseColor.bgColor}]}
                forceInset={{ top: "always" }}
            >
                <Header
                    title="Booking"
                    subTitle={""}
                    
                    renderLeft={() => {
                        return (
                            <Icon
                                name="arrow-left"
                                size={20}
                                color={BaseColor.whiteColor}
                            />
                        );
                    }}
                    
                    renderRight={() => {
                        return (
                            this.state.login ?
                            <Icon
                                name="sync-alt"
                                size={20}
                                color={BaseColor.whiteColor}
                            />
                            :
                            <View />
                            
                        );
                    }}
                    
                    onPressLeft={() => {
                        navigation.goBack();
                    }}
                    
                    onPressRight={() => {
                        var redirect='Booking';
                        var param={}
                        navigation.navigate("Loading",{redirect:redirect,param:param});
                    }}
                />
                {contents}
                        
              
                
            </SafeAreaView>
        );
    }
}
