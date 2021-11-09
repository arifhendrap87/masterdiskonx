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
import { BaseStyle, BaseColor,Images} from "@config";
import {
    DataMenu,DataMasterDiskon
} from "@data";

import FastImage from 'react-native-fast-image';
import SvgUri from 'react-native-svg-uri';

const styles = StyleSheet.create({
    itemService: {
        alignItems: "center",
        justifyContent: "center",
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
        //backgroundColor: BaseColor.primaryColor,
      },
});
import {
    Placeholder,
    PlaceholderMedia,
    PlaceholderLine,
    Fade
  } from "rn-placeholder";

export default class ListProductTag extends Component {

    constructor(props) {
        super(props)
        this.state = {
            icons: DataMenu,
            img_featured:Images.doodle,
            configLocal:DataMasterDiskon[0],
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
    componentDidMount(){
        setTimeout(() => {
            this.getData();
        }, 20);
        
    }

    getData(){
          

                let config=this.state.configApi;
                let baseUrl=config.apiBaseUrl;
                let url=baseUrl+"product/tag";
                console.log('configApi',JSON.stringify(config));
                console.log('urlss',url);


                // let config = JSON.parse(result);
                // var url=config.apiBaseUrlDev+"product/tag";

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
                    this.setState({icons:result.data});
                    this.setState({loading:false});
                })
                .catch(error => {alert('Kegagalan Respon Server')});
           
    }
    
    convertArrayTag(arrayTag){
        var str="";
        for(a=0;a<arrayTag.length;a++){
            str+="&tag[]="+arrayTag[a];
        }
        return str;

    }
    render() {
        const {

        } = this.props;
        const {icons,loading}=this.state;

        return (
            <FlatList
                horizontal={true}
                showsHorizontalScrollIndicator={true}
                data={icons}
                
                keyExtractor={(item, index) => item.id}
                renderItem={({ item,index }) => {
                    return (
                        loading==true ?
                        <View 
                            style={[
                                index == 0
                                    ? { marginLeft: 20,marginRight:10 }
                                    : { marginRight: 10 }
                                    ,{
                                        width:100,
                                        height:20,
                                        backgroundColor:BaseColor.dividerColor,
                                        paddingHorizontal:5,
                                        paddingVertical:5,
                                        borderRadius:5
                                        }
                                ]}
                            >
                                    
                        </View>
                        :

                        <TouchableOpacity
                            style={[
                            index == 0
                                ? { marginLeft: 20,marginRight:10 }
                                : { marginRight: 10 }
                            ]}
                            activeOpacity={0.9}
                            onPress={() => {    

                                var tag=[];
                                tag.push(item.slug_product_tag);
                                var tagStr=this.convertArrayTag(tag);
                                console.log(tagStr);
                                
                                
                                this.props.navigation.navigate('ProductList',{type:'tag',slug:tagStr,title:item.name_product_tag});
                            }}
                        >   
                                <View style={{backgroundColor:BaseColor.primaryColor,paddingHorizontal:5,paddingVertical:5,borderRadius:5}}>
                                    <Text overline whiteColor style={{textAlign:"center"}}>
                                        {item.name_product_tag}
                                    </Text>
                                </View>
                        </TouchableOpacity>
                    );
                }}
            />
        );
    }
}

ListProductTag.propTypes = {
    style: PropTypes.oneOfType([PropTypes.object, PropTypes.array]),
};

ListProductTag.defaultProps = {
    style: {},
    
};
