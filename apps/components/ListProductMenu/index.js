import React, { Component } from "react";
import { View, TouchableOpacity,StyleSheet,FlatList,AsyncStorage } from "react-native";
import {  Text,
    SafeAreaView,
    Header,
    Image,
    Icon,
    Tag,
    FormOption,
    Button} from "@components";
import PropTypes from "prop-types";
// import styles from "./styles";
import { BaseStyle, BaseColor} from "@config";
import {
    DataMenu,DataMasterDiskon
} from "@data";
// import FastImage from 'react-native-fast-image';




const styles = StyleSheet.create({
    itemService: {
        alignItems: "center",
        //justifyContent: "center",
        flex: 1,
        paddingTop: 10
      },

      iconContentColor: {
        justifyContent: "center",
        alignItems: "center",
        width: 50,
        height: 50,
        borderRadius: 5,
        marginBottom: 5,
        backgroundColor: BaseColor.whiteColor,
      },
});

import FastImage from 'react-native-fast-image';
//import SvgUri from 'react-native-svg-uri';


export default class ListProductMenu extends Component {

    constructor(props) {
        super(props)
        this.state = {
            icons: DataMenu,
            loading:true
        }

        this.getConfigApi();
        this.getConfig();
        this.getSession();

      }


    //memanggil config
    getConfigApi(){
        AsyncStorage.getItem('configApi', (error, result) => {
            if (result) {    
                let config = JSON.parse(result);
                this.setState({configApi:config});
            }
        });
    }

    getConfig(){
            AsyncStorage.getItem('config', (error, result) => {
                if (result) {    
                    let config = JSON.parse(result);
                    this.setState({config:config});
                }
            });
    }

    //memanggil session
    getSession(){    
        AsyncStorage.getItem('userSession', (error, result) => {
            if (result) {    
                let userSession = JSON.parse(result);
                console.log('userSessions',JSON.stringify(userSession));

                var id_user=userSession.id_user;
                this.setState({id_user:id_user});
                this.setState({userSession:userSession});
                this.setState({login:true});
            }
        });
    }
    
    getData()
    {
                let config=this.state.configApi;
                let baseUrl=config.apiBaseUrl;
                let url=baseUrl+"product/category";
                console.log('configApi',JSON.stringify(config));
                console.log('urlss',url);



                // let config = JSON.parse(result);
                // var url=config.apiBaseUrlDev+"product/category";

                var myHeaders = new Headers();
                myHeaders.append("Authorization", "Bearer "+config.apiToken);

                var requestOptions = {
                method: 'GET',
                headers: myHeaders,
                redirect: 'follow'
                };

                fetch(url, requestOptions)
                 .then(response => response.json())
                .then(result => {
                    console.log('icons',JSON.stringify(result.data));
                    //this.setState({icons:result.data});

                    var category=this.rebuild(result.data);
                    console.log('category',JSON.stringify(category));
                    this.setState({icons:category});
                    this.setState({loading:false});
                })
                .catch(error => {alert('Kegagalan Respon Server Comp List Product Menu')});

    }

      componentDidMount(){
          setTimeout(() => {
              this.getData();
          }, 20);
          

                
            
    }

    filterValue(obj, key, value) {
        return obj.find(function(v){ return v[key] === value});
    }

    rebuild(listdata){
        var listdata_sort = [];
        this.filterValue(listdata, "slug_product_category", "hotels");

        listdata_sort.push(this.filterValue(listdata, "slug_product_category", "hotels"));
        listdata_sort.push(this.filterValue(listdata, "slug_product_category", "flight"));
        listdata_sort.push(this.filterValue(listdata, "slug_product_category", "tours"));
        listdata_sort.push(this.filterValue(listdata, "slug_product_category", "travel-deals"));
        listdata_sort.push(this.filterValue(listdata, "slug_product_category", "health-beauty"));
        listdata_sort.push(this.filterValue(listdata, "slug_product_category", "fandb"));
        listdata_sort.push(this.filterValue(listdata, "slug_product_category", "gift-vouchers"));
        listdata_sort.push(this.filterValue(listdata, "slug_product_category", "entertainment"));

        var listdata_new = [];
        var a=1;
        listdata_sort.map(item => {
            var obj = {};
            
            obj['id_product_category'] = item.id_product_category;
            obj['icon_product_category'] = item.icon_product_category;
            obj['code_product_category'] = item.code_product_category;
            obj['name_product_category'] = item.name_product_category;
            obj['slug_product_category'] = item.slug_product_category;
            obj['status'] = item.status;
            obj['img'] = 'https://masterdiskon.com/assets/icon/original/prdt/icon-apss-0'+item.id_product_category+'.png';
            
            listdata_new.push(obj);
            a++;
        });

       return listdata_new;
    }
    


    render() {
        const {

        } = this.props;
        const {icons,loading}=this.state;

        return (
            <FlatList
                data={icons}
                numColumns={4}
                keyExtractor={(item, index) => index.toString()}
                renderItem={({ item }) => {
                    return (
                        loading==true ?
                        <View style={[styles.itemService]}>
                            <View style={[styles.iconContentColor,{backgroundColor:BaseColor.whiteColor}]}></View>
                        </View>
                        :
                        <TouchableOpacity
                            style={styles.itemService}
                            activeOpacity={0.9}
                            onPress={() => {    
                                var paramCategory='&category='+item.slug_product_category;
                                var title=item.name_product_category;
                                console.log('slugCategory',item.slug_product_category);
                                if(item.slug_product_category=='hotels'){
                                    this.props.navigation.navigate('Hotel');
                                }else if(item.slug_product_category=='flight'){
                                    this.props.navigation.navigate('Flight');
                                }else{
                                    this.props.navigation.navigate('ProductList',{
                                    title:title,
                                    type:'category',

                                    paramPrice:'',
                                    paramCategory:paramCategory,
                                    paramCity:'',
                                    paramTag:'',
                                    paramOrder:'',

                                });

                                }

                                

                            }}
                        >   
                            <View>
                                <View style={styles.iconContentColor}>
                                    {/* <Icon
                                        name={item.icon}
                                        size={24}
                                        color={BaseColor.whiteColor}
                                        solid
                                    /> */}
                                    {/* <SvgUri
                                    width="50"
                                    height="50"
                                    //source={{uri:DataMasterDiskon[0].baseUrl+'assets/icon/original/product/'+item.icon_product_category}}
                                    source={{uri:'https://www.svgrepo.com/show/65195/hotel.svg'}}
                                    //source={{uri:'http://thenewcode.com/assets/images/thumbnails/homer-simpson.svg'}}
                                /> */}

                                <FastImage
                                            style={{width:50,height:50,
                                                justifyContent: "center",
                                                alignSelf: "center"
                                            }}
                                            //source={this.state.img}
                                            source={{
                                              uri:item.img,
                                              headers:{ Authorization: 'someAuthToken' },
                                              priority: FastImage.priority.normal,
                                            }}
                                            resizeMode={FastImage.resizeMode.stretch}
                                            cacheControl={FastImage.cacheControl.cacheOnly}
                                            resizeMethod={'scale'}
                                            // onLoad={evt =>{
                                            //     this.setState({img:{
                                            //     uri:propImage.url,
                                            //     headers:{ Authorization: 'someAuthToken' },
                                            //     priority: FastImage.priority.normal,
                                            //     }
                                            

                                            //     })
                                            // }
                                            // }
                                            >
                                            </FastImage>
                                </View>
                                <Text overline whiteColor style={{textAlign:"center",
                            justifyContent: "center",
                            alignSelf: "center",
                            width:50}}>
                                    {item.name_product_category}
                                </Text>
                            </View>
                           
                        </TouchableOpacity>
                    );
                }}
            />
        );
    }
}

ListProductMenu.propTypes = {
    style: PropTypes.oneOfType([PropTypes.object, PropTypes.array]),
};

ListProductMenu.defaultProps = {
    style: {},
    
};
