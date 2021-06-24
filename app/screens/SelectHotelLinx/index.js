import React, { Component } from "react";
import {
    View,
    FlatList,
    TextInput,
    TouchableOpacity,
    StyleSheet,
    ScrollView
} from "react-native";
import { BaseStyle, BaseColor } from "@config";
import { Header, SafeAreaView, Icon, Text, Image } from "@components";
// import styles from "./styles";

// Load sample flight data list
import {AsyncStorage} from 'react-native';
import {
    Placeholder,
    PlaceholderMedia,
    PlaceholderLine,
    Fade
  } from "rn-placeholder";



  const styles = StyleSheet.create({
    textInput: {
        height: 46,
        backgroundColor: BaseColor.fieldColor,
        borderRadius: 5,
        padding: 10,
        width: "100%"
    },
    contain: {
        alignItems: "center",
        padding: 20,
        width: "100%"
    },
    item: {
        paddingTop: 15,
        paddingBottom: 15,
        flexDirection: "row",
        justifyContent: "space-between",
        alignItems: "center",
        borderBottomWidth: 1,
        borderBottomColor: BaseColor.fieldColor
    },
    imageBrand: {
        width: 32,
        height: 32,
        marginRight: 10
    }
  });


export default class SelectHotelLinx extends Component {
    constructor(props) {
        super(props);
        // Temp data define
        this.state = {
            airplane: "",
            flight: [],
            loading: false,
            listdata_kota:[],
            listdata_hotel:[],
            listdata_area:[],
            listdata_bestTenCity:[],
            loading_spinner:true
        };
    }

    componentDidMount() {
        this.setState({loading_spinner:true});
        setTimeout(() => {
            this.bestTenCity();
        }, 50);
        
    }

    onChange(select) {
        const { navigation } = this.props;
        console.log('select',JSON.stringify(select));
        this.props.navigation.state.params.setHotelLinxDestination(
            select
            );
        navigation.goBack();
        
    }

    bestTenCity(){
        this.setState({ loading_spinner: true }, () => {

            AsyncStorage.getItem('config', (error, result) => {
                if (result) {   
                    let config = JSON.parse(result);
                    var url=config.baseUrl;
                    var path='front/api/product/bestTenCity';

                    var myHeaders = new Headers();

                    var raw = "";

                    var requestOptions = {
                    method: 'POST',
                    headers: myHeaders,
                    body: raw,
                    redirect: 'follow'
                    };
                    console.log('bestTenCity',url+path);

                    fetch(url+path, requestOptions)
                    .then(response => response.json())
                    .then(result => {
                        this.setState({loading_spinner:false})
                        // var bestTenCity=result.bestTenCity;
                        console.log('bestTenCity',JSON.stringify(result));
                        this.setState({listdata_bestTenCity:this.rebuild_bestTenCity(result)});
                    })
                    .catch(error => {

                        alert('Kegagalan Respon Server')
                    });

                }
            }); 
        }); 

    }

    searchHotel(value){
        this.setState({loading_spinner:true});
        AsyncStorage.getItem('config', (error, result) => {
            if (result) {   
                let config = JSON.parse(result);
                var url=config.baseUrl;
                //var path=config.product_hotel_package.dir;
                var path='front/api/product/searchKotaHotelorLokasi';
                
                var myHeaders = new Headers();
                
                var formdata = new FormData();
                formdata.append("ketikData", value);
                
                var requestOptions = {
                  method: 'POST',
                  headers: myHeaders,
                  body: formdata,
                  redirect: 'follow'
                };
                
                fetch(url+path, requestOptions)
                  .then(response => response.json())
                  .then(result => {
                     this.setState({loading_spinner:false});
                      console.log('search',JSON.stringify(result));
                      var arr_kota=result.arr_kota;
                      var arr_hotel=result.arr_hotel;
                      var arr_area=result.arr_area;
                        this.setState({listdata_kota:this.rebuild_kota(arr_kota)});
                        this.setState({listdata_hotel:this.rebuild_hotel(arr_hotel)});
                        this.setState({listdata_area:this.rebuild_area(arr_area)});
                      

                  })
                  .catch(error => {

                    alert('Kegagalan Respon Server')
                });
            }
        }); 

    }

    rebuild_bestTenCity(listdata){
        var listdata_new = [];
        var a=1;
        listdata.map(item => {
            var obj = {};
            
            obj['total'] = item.total;
            obj['cityid'] =  item.cityid;
            obj['cityname'] = item.cityname;
            obj['countryname'] = item.countryname;


            obj['searchType'] = "best";
            obj['searchCity'] = item.cityid;
            obj['searchHotel'] = '';
            obj['searchTitle'] = item.cityname+', '+item.countryname;
            obj['searchArea'] = '';
            obj['searchCountry'] = item.countryname;
            obj['searchProvince'] = item.province_id;

            listdata_new.push(obj);
            a++;
        });

       return listdata_new;
    }

    rebuild_kota(listdata){
        var listdata_new = [];
        var a=1;
        listdata.map(item => {
            var obj = {};
          
            obj['kota'] = item.kota;
            obj['id_hotel'] =  item.id_hotel;
            obj['hotelid'] = item.hotelid;
            obj['cityid'] = item.cityid;
            obj['cityname'] = item.cityname;
            obj['countryname'] = item.countryname;

            
            obj['searchType'] = "kota";
            obj['searchCity'] = item.cityid;
            obj['searchHotel'] = item.hotelid;
            obj['searchTitle'] = item.cityname+', '+item.countryname;
            obj['searchArea'] = '';
            obj['searchCountry'] = item.countryname;
            
            
            listdata_new.push(obj);
            a++;
        });

       return listdata_new;
    }

    rebuild_hotel(listdata){
        var listdata_new = [];
        var a=1;
        listdata.map(item => {
            var obj = {};
          
            obj['id_hotel'] =  item.id_hotel;
            obj['hotelid'] = item.hotelid;
            obj['cityid'] = item.cityid;
            obj['cityname'] = item.cityname;
            obj['hotelname'] = item.hotelname;
            obj['countryname'] = item.countryname;
            obj['address'] = item.address;

         
            

            obj['searchType'] = "hotel";
            obj['searchCity'] = item.cityid;
            obj['searchHotel'] = item.hotelid;
            obj['searchTitle'] = item.hotelname+', '+item.address+', '+item.countryname;
            obj['searchArea'] = '';
            obj['searchCountry'] = item.countryname;
            
            listdata_new.push(obj);
            a++;
        });

       return listdata_new;
    }



    rebuild_area(listdata){
        var listdata_new = [];
        var a=1;
        listdata.map(item => {
            var obj = {};
          
            obj['countryname'] = item.countryname;
            obj['area'] = item.area;


            obj['searchType'] = "area";
            obj['searchCity'] = '';
            obj['searchHotel'] = '';
            obj['searchTitle'] = item.area+', '+item.countryname;
            obj['searchArea'] = item.area;
            obj['searchCountry'] = item.countryname;

            
            
            listdata_new.push(obj);
            a++;
        });

       return listdata_new;
    }

    search(value){
        if(value.length >= 3){
            this.setState({listdata_bestTenCity:[]});
            this.searchHotel(value);
            
        }else{
            this.setState({listdata_kota:[]});
            this.setState({listdata_hotel:[]});
            this.setState({listdata_area:[]});
            this.bestTenCity();
            
        }
     }

    
    
    

    render() {
        const { navigation } = this.props;
        let { flight, loading, airplane,loading_spinner,listdata_kota,listdata_hotel,listdata_area,listdata_bestTenCity } = this.state;

        var listdata_bestTenCity_content=<View></View>
        if(listdata_bestTenCity.length != 0){
            listdata_bestTenCity_content=<View style={{marginTop:10,width:'100%'}}>
                                    <View style={{flexDirection: "row",paddingVertical:5,paddingHorizontal:5,backgroundColor:BaseColor.bgColor}}>
                                        <Text caption2 bold>
                                            Populer Destination
                                        </Text>
                                    </View>
                                    <View style={{flexDirection: "row"}}>
                                    <FlatList
                                    data={listdata_bestTenCity}
                                    keyExtractor={(item, index) => item.cityid}
                                    renderItem={({ item }) => (
                                        <TouchableOpacity
                                            style={styles.item}
                                            onPress={() => {
                                                console.log('item=',JSON.stringify(item));
                                                this.onChange(item)
                                            
                                            }}
                                        >
                                            <View
                                                style={{
                                                    flexDirection: "row",
                                                    alignItems: "center"
                                                }}
                                            >
                                                <View style={styles.left}>
                                                    <Text caption1 semibold>
                                                    {item.cityname} ({item.total} hotel) 
                                                    </Text>
                                                    <Text
                                                        note
                                                        numberOfLines={1}
                                                        footnote
                                                        grayColor
                                                        style={{
                                                            paddingTop: 5
                                                        }}
                                                    >
                                                        {item.countryname}
                                                    </Text>
                                                </View>
                                            </View>
                                        </TouchableOpacity>
                                    )}
                                    />
                                    </View>
                                </View>

        }


        
        var listdata_kota_content=<View></View>
        if(listdata_kota.length != 0){
            listdata_kota_content=<View style={{marginTop:10,width:'100%'}}>
                                    <View style={{flexDirection: "row",paddingVertical:5,paddingHorizontal:5,backgroundColor:BaseColor.bgColor}}>
                                        <Text caption2 bold>
                                        Kota
                                        </Text>
                                    </View>
                                    <View style={{flexDirection: "row"}}>
                                    <FlatList
                                    data={listdata_kota}
                                    keyExtractor={(item, index) => item.cityid}
                                    renderItem={({ item }) => (
                                        <TouchableOpacity
                                            style={styles.item}
                                            onPress={() => this.onChange(item)}
                                        >
                                            <View
                                                style={{
                                                    flexDirection: "row",
                                                    alignItems: "center"
                                                }}
                                            >
                                                <View style={styles.left}>
                                                    <Text caption1 semibold>
                                                    {item.cityname}
                                                    </Text>
                                                    <Text
                                                        note
                                                        numberOfLines={1}
                                                        footnote
                                                        grayColor
                                                        style={{
                                                            paddingTop: 5
                                                        }}
                                                    >
                                                        {item.countryname}
                                                    </Text>
                                                </View>
                                            </View>
                                        </TouchableOpacity>
                                    )}
                                    />
                                    </View>
                                </View>

        }

        var listdata_hotel_content=<View></View>
        if(listdata_hotel.length != 0){
            listdata_hotel_content=<View style={{marginTop:10,width:'100%'}}>
                                    <View style={{flexDirection: "row",paddingVertical:5,paddingHorizontal:5,backgroundColor:BaseColor.bgColor}}>
                                        <Text caption2 bold>
                                        More Result Hotels by Name Hotel
                                        </Text>
                                    </View>
                                    <View style={{flexDirection: "row"}}>
                                    <FlatList
                                    data={listdata_hotel}
                                    keyExtractor={(item, index) => item.cityid}
                                    renderItem={({ item }) => (
                                        <TouchableOpacity
                                            style={styles.item}
                                            onPress={() => this.onChange(item)}
                                        >
                                            <View
                                                style={{
                                                    flexDirection: "row",
                                                    alignItems: "center"
                                                }}
                                            >
                                                <View style={styles.left}>
                                                    <Text caption1 semibold>
                                                    {item.hotelname}
                                                    </Text>
                                                    <Text
                                                        note
                                                        numberOfLines={1}
                                                        footnote
                                                        grayColor
                                                        style={{
                                                            paddingTop: 5
                                                        }}
                                                    >
                                                        {item.address}
                                                    </Text>
                                                </View>
                                            </View>
                                        </TouchableOpacity>
                                    )}
                                    />
                                    </View>
                                </View>

        }



        var listdata_area_content=<View></View>
        if(listdata_area.length != 0){
            listdata_area_content=<View style={{marginTop:10,width:'100%'}}>
                                    <View style={{flexDirection: "row",paddingVertical:5,paddingHorizontal:5,backgroundColor:BaseColor.bgColor}}>
                                        <Text caption2 bold>
                                        Area
                                        </Text>
                                    </View>
                                    <View style={{flexDirection: "row"}}>
                                    <FlatList
                                    data={listdata_area}
                                    keyExtractor={(item, index) => item.area}
                                    renderItem={({ item }) => (
                                        <TouchableOpacity
                                            style={styles.item}
                                            onPress={() => this.onChange(item)}
                                        >
                                            <View
                                                style={{
                                                    flexDirection: "row",
                                                    alignItems: "center"
                                                }}
                                            >
                                                <View style={styles.left}>
                                                    <Text caption1 semibold>
                                                    {item.area}
                                                    </Text>
                                                    <Text
                                                        note
                                                        numberOfLines={1}
                                                        footnote
                                                        grayColor
                                                        style={{
                                                            paddingTop: 5
                                                        }}
                                                    >
                                                        {item.countryname
                                                        }
                                                    </Text>
                                                </View>
                                            </View>
                                        </TouchableOpacity>
                                    )}
                                    />
                                    </View>
                                </View>

        }

        
        return (
            <SafeAreaView
                style={BaseStyle.safeAreaView}
                forceInset={{ top: "always" }}
            >
                <Header
                    title="Tujuan Hotel"
                    renderLeft={() => {
                        return (
                            <Icon
                                name="arrow-left"
                                size={20}
                                color={BaseColor.whiteColor}
                            />
                        );
                    }}
                    // renderRight={() => {
                    //     if (loading) {
                    //         return (
                    //             <ActivityIndicator
                    //                 size="small"
                    //                 color={BaseColor.primaryColor}
                    //             />
                    //         );
                    //     } else {
                    //         return (
                    //             <Text caption1 primaryColor>
                    //                 Save
                    //             </Text>
                    //         );
                    //     }
                    // }}
                    onPressLeft={() => {
                        navigation.goBack();
                    }}
                    //onPressRight={() => this.onSave()}
                />
                <View style={styles.contain}>
                    <TextInput
                        style={BaseStyle.textInput}
                        onChangeText={text => this.search(text)}
                        autoCorrect={false}
                        placeholder="Search Hotel"
                        placeholderTextColor={BaseColor.grayColor}
                        selectionColor={BaseColor.primaryColor}
                        autoFocus
                    />
                    <ScrollView>
                    <View style={{ width: "100%", height: "100%",flexDirection:'row' }}>
                        {
                            loading_spinner ? 
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
                            <View>
                            <View style={{flexDirection:'row',width: "100%"}}>{listdata_area_content}</View>
                            <View style={{flexDirection:'row',width: "100%"}}>{listdata_bestTenCity_content}</View>
                            <View style={{flexDirection:'row',width: "100%"}}>{listdata_kota_content}</View>
                            <View style={{flexDirection:'row',width: "100%"}}>{listdata_hotel_content}</View>
                            </View>
                        }
                    </View>
                    </ScrollView>
                </View>
            </SafeAreaView>
        );
    }
}
