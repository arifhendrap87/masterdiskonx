import React, { Component } from "react";
import {
    View,
    FlatList,
    TextInput,
    TouchableOpacity,
    ScrollView
} from "react-native";
import { BaseStyle, BaseColor } from "@config";
import { Header, SafeAreaView, Icon, Text, Image,Coupon } from "@components";
import styles from "./styles";
import DataEmpty from "../../components/DataEmpty";

import { UserData, HotelData, TourData,CouponsData} from "@data";
// Load sample flight data list
import {AsyncStorage} from 'react-native';
import {
    Placeholder,
    PlaceholderMedia,
    PlaceholderLine,
    Fade
  } from "rn-placeholder";
export default class SelectCoupon extends Component {
    constructor(props) {
        super(props);
        // Temp data define
        this.state = {
            loading_dashboard:true,
            airplane: "",
            flight: [],
            loading: false,
            userSession:this.props.navigation.state.params.userSession,
            param:this.props.navigation.state.params.param,
            listdata_promo:[],
            coupons: [{"id_coupon_history":136,"id_coupon":33,"id_order":null,"id_user":2022,"contact_title":"Mr","contact_first":"arif","contact_last":"hendra87","coupon_code":"baro","amount":null,"product":"potongan","date_claim":"2021-03-04T06:23:01.000Z","date_used":null,"expired":"2021-03-11","detail_coupon":{"coupon_name":"Baro","type":"potongan","amount":4000,"percent":"tetap","max_reward":12000,"minimum":100000,"coupon_code":"baro","platform":"web,app","product":"","quantity":5,"term":"sk","payment_method":"semua","extra_term":null,"start_date":"2021-03-01","end_date":"2021-03-11","expired_day":0,"category":"total","coupon_type":"unik","status":1,"action":null,"date_added":"2021-02-25T09:39:14.000Z","date_modified":null},"available":true}]
            
        };
    }


    convertDateText(date){
        var d = new Date(date);
        var days = ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"];
        // var months = ["January","February","March","April","May","June","July","August","September","October","November","December"];
        var months = ["Jan","Feb","Mar","Apr","May","Jun","Jul","Aug","Sep","Oct","Nov","Dec"];

        return d.getDate()+" "+months[d.getMonth()]+" "+d.getFullYear();
    }

    useCoupon(item){
        const { navigation } = this.props;
        //console.log('coupon',JSON.stringify());
        this.props.navigation.state.params.setCoupon(item);
        navigation.goBack();
    }

    useCoupon2(item){
        //const {login,userSession}=this.state;
        const {login,userSession,param}=this.state;
        var myHeaders = new Headers();
        myHeaders.append("Accept", "application/json");
        myHeaders.append("Content-Type", "application/json");
        myHeaders.append("Cookie", "ci_session=gur1sg8tu7micu8i028lqn1sa4tcaa5k");

        
        var params={"param":{
            id_user:userSession.id_user,
            id_coupon:item.id_coupon,
            id_coupon_history:item.id_coupon_history,
            total:param.totalPrice,
            platform:'app',
            product:param.type,
            payment_method:'semua',
            }
            };
            console.log('params',JSON.stringify(params));

        var raw = JSON.stringify(params);

        var url="https://masterdiskon.com/front/api/product/couponUse";
        console.log('urlCoupon',url,JSON.stringify(params));
        
        var requestOptions = {
        method: 'POST',
        headers: myHeaders,
        body: raw,
        redirect: 'follow'
        };

        fetch(url, requestOptions)
        .then(response => response.json())
        .then(result => {
           //console.log('useCoupon',JSON.stringify(result));
            this.props.navigation.state.params.useCoupon(result.data);
          
            this.props.navigation.navigate('Summary');

        })
        .catch(error => {
            alert('Kegagalan Respon Server');
          });
    }


    renderItem(item) {
        const priceSplitter = (number) => (number && number.toString().replace(/\B(?=(\d{3})+(?!\d))/g, '.'));

        return (
            <Coupon
                style={{
                    marginVertical: 0,
                    marginRight: 10,
                    width:'100%'
                }}
                name={item.product_name}
                code={item.product_discount}
                description={item.product_name}
                valid={this.convertDateText(item.product_time2)}
                remain={priceSplitter('Rp '+parseInt(item.product_price_minumum))}
                onPress={() => {
                    //alert(item.id_coupon);
                    this.useCoupon(item);
                    //this.props.navigation.navigate("HotelDetail");
                }}
                // quantity={item.quantity}
                // claimed={item.claimed}
                // usedKuota={item.usedKuota}
                // claimable={item.claimed}
                usedCoupon={true}
            />
        );
    }

    getProduct(){
        AsyncStorage.getItem('config', (error, result) => {
            if (result) {    
                let config = JSON.parse(result);
                
                this.setState({ loading_dashboard: true }, () => {


                var url=config.baseUrl;
                var path=config.dashboard.dir;


                        var myHeaders = new Headers();
                        myHeaders.append("Content-Type", "application/json");
                        var requestOptions = {
                        method: 'POST',
                        headers: myHeaders,
                        body:  JSON.stringify(),
                        redirect: 'follow'
                        };

                        fetch(url+path, requestOptions)
                        .then(response => response.json())
                        .then(result => {


                            this.setState({loading_dashboard:false});
                        
                            var listdata_promo=result.list_promo;
                            console.log('listdata_promo',JSON.stringify(listdata_promo));
                          
                            this.setState({listdata_promo:listdata_promo});
                            

                            
                            

                        })
                        .catch(error => {alert('Kegagalan Respon Server')});


                        
                });

            }
        });
    }


    getCoupon(){
        const {login,userSession,param}=this.state;
        var myHeaders = new Headers();
        myHeaders.append("Accept", "application/json");
        myHeaders.append("Content-Type", "application/json");
        myHeaders.append("Cookie", "ci_session=gur1sg8tu7micu8i028lqn1sa4tcaa5k");

      
            var params={"param":
            {
                "id_user" : userSession.id_user,
                "total":param.total,
                "platform": "app",
                "product": param.type,
            }
                };
            var raw = JSON.stringify(params);
      

        var requestOptions = {
        method: 'POST',
        headers: myHeaders,
        body: raw,
        redirect: 'follow'
        };
        var url="https://masterdiskon.com/front/api/product/myCoupon";
        console.log('couponnnss',url,JSON.stringify(params));

        fetch(url, requestOptions)
        .then(response => response.json())
        .then(result => {
            console.log('resultCoupon',JSON.stringify(result));
            this.setState({coupons:result.data});

        })
        .catch(error => { alert('Kegagalan Respon Server');});
        

    }

    componentDidMount() {
        //this.getCoupon();
        this.getProduct();
        // this.setState({ loading_spinner: true }, () => {
        //     AsyncStorage.getItem('config', (error, result) => {
        //         if (result) {   
        //             let config = JSON.parse(result);
        //             var access_token=config.token;
        //             var path=config.common_airport_default.dir;
        //             var url=config.baseUrl;

                    

                    
        //             console.log(url+path,{"param":""});
        //            fetch(url+path,{"param":""})
        //             .then(response => response.json())
        //             .then(result => {
        //                 this.setState({ loading_spinner: false });
        //                 this.setState({flight:result});
        //                 const { navigation } = this.props;
        //                 const selected = navigation.getParam("selected");
            
        //                 if (selected) {
        //                     this.setState({
        //                         flight: this.state.flight.map(item => {
        //                             return {
        //                                 ...item,
        //                                 checked: item.code == selected
        //                             };
        //                         })
        //                     });
        //                 }

        //             })
        //             .catch(error => {

        //                 alert('Kegagalan Respon Server')
        //             });

            
        //         }
        //     });             

        // });
    }

    onChange(select) {
        this.setState({
            flight: this.state.flight.map(item => {
                if (item.code == select.code) {
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

        const { navigation } = this.props;
        var type = navigation.getParam("type");
            if(type=='from'){
                            this.props.navigation.state.params.setBandaraAsal(
                                select.code,select.label
                                )
                            navigation.goBack();
            }else if(type=='to'){
           
                            this.props.navigation.state.params.setBandaraTujuan(
                                select.code,select.label
                                )
                            navigation.goBack();
            }
    }

    search(value){
        this.setState({ loading_spinner: true }, () => {

            AsyncStorage.getItem('config', (error, result) => {
                if (result) {   
                    let config = JSON.parse(result);
                    var access_token=config.token;
                    var path=config.common_airport.dir;
                    var url=config.baseUrl;

                    console.log(url,path,{"param":value});

                 


                    var myHeaders = new Headers();
                    myHeaders.append("Content-Type", "application/json");
                    // myHeaders.append("Cookie", "ci_session=htllmlmq1kc1inaabihi3lqeqv8jjm91");
                    
                    var raw = JSON.stringify({"param":value});
                    
                    var requestOptions = {
                      method: 'POST',
                      headers: myHeaders,
                      body: raw,
                      redirect: 'follow'
                    };
                    
                    fetch(config.baseUrl+"front/api/common/airport", requestOptions)
                      .then(response => response.json())
                      .then(result => {
                          
                        this.setState({ loading_spinner: false });
                            this.setState({flight:result});
                            const { navigation } = this.props;
                            const selected = navigation.getParam("selected");
                
                            if (selected) {
                                this.setState({
                                    flight: this.state.flight.map(item => {
                                        return {
                                            ...item,
                                            checked: item.code == selected
                                        };
                                    })
                                });
                            }
                    
                    })
                    .catch(error => {

                        alert('Kegagalan Respon Server')
                    }); 


                }
            }); 
        });

     }

    onSave() {
        const { navigation } = this.props;
        var selectParent = navigation.getParam("selected");
        var type = navigation.getParam("type");
        const selected = this.state.flight.filter(item => item.checked);

        if (selected.length > 0) {
            if(type=='from'){
                this.setState(
                    {
                        loading: true
                    },
                    () => {
                        setTimeout(() => {
                            this.props.navigation.state.params.setBandaraAsal(
                                selected[0].code,selected[0].label
                                )
                            navigation.goBack();
                        }, 50);
                    }
                );

            }else if(type=='to'){
              
                this.setState(
                    {
                        loading: true
                    },
                    () => {
                        setTimeout(() => {
                            this.props.navigation.state.params.setBandaraTujuan(
                                selected[0].code,selected[0].label
                                )
                            navigation.goBack();
                        }, 50);
                    }
                );
            }
        }
    }

    
  
    render() {
        const { navigation } = this.props;
        let { flight, loading, airplane,loading_spinner,coupons,loading_dashboard } = this.state;
        return (
            <SafeAreaView
                style={BaseStyle.safeAreaView}
                forceInset={{ top: "always" }}
            >
                <Header
                    title="Pilih Kupon"
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
                    onPressRight={() => {}}
                />
                
                <ScrollView>
                <View style={styles.contain}>
                    {/* <TextInput
                        style={BaseStyle.textInput}
                        onChangeText={text => this.search(text)}
                        autoCorrect={false}
                        placeholder="Cari kupon"
                        placeholderTextColor={BaseColor.grayColor}
                        selectionColor={BaseColor.primaryColor}
                    /> */}
                    <View style={{ width: "100%", height: "100%" }}>
                        {
                            loading_dashboard ? 
                            <Placeholder
                                Animation={Fade}
                                
                            >
                                <View style={{ 
                                            paddingTop: 15,
                                            paddingBottom: 15,
                                            borderBottomWidth: 1,
                                            borderBottomColor: BaseColor.fieldColor}}>
                                    <PlaceholderLine width={100} height={30} style={{marginBottom:0}} />
                                    <PlaceholderLine width={100} height={15} style={{marginTop: 5,marginBottom:0}} />
                                </View>

                                <View style={{ 
                                            paddingTop: 15,
                                            paddingBottom: 15,
                                            borderBottomWidth: 1,
                                            borderBottomColor: BaseColor.fieldColor}}>
                                    <PlaceholderLine width={100} height={30} style={{marginBottom:0}} />
                                    <PlaceholderLine width={100} height={15} style={{marginTop: 5,marginBottom:0}} />
                                </View>

                                <View style={{ 
                                            paddingTop: 15,
                                            paddingBottom: 15,
                                            borderBottomWidth: 1,
                                            borderBottomColor: BaseColor.fieldColor}}>
                                    <PlaceholderLine width={100} height={30} style={{marginBottom:0}} />
                                    <PlaceholderLine width={100} height={15} style={{marginTop: 5,marginBottom:0}} />
                                </View>

                                <View style={{ 
                                            paddingTop: 15,
                                            paddingBottom: 15,
                                            borderBottomWidth: 1,
                                            borderBottomColor: BaseColor.fieldColor}}>
                                    <PlaceholderLine width={100} height={30} style={{marginBottom:0}} />
                                    <PlaceholderLine width={100} height={15} style={{marginTop: 5,marginBottom:0}} />
                                </View>
                            </Placeholder>
                            :
                            this.state.listdata_promo.length == 0 ?
                            <DataEmpty />
                            :         
                                <View>
                                    <FlatList
                                    data={this.state.listdata_promo}
                                    keyExtractor={(item, index) => item.id_coupon}
                                    renderItem={({ item }) => this.renderItem(item)}
                                    />
                                </View>
                                // <View />
                            }
                    </View>
                </View>
                </ScrollView>
            </SafeAreaView>
        );
    }
}