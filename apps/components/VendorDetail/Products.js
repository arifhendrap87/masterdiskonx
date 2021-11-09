import React, { Component } from "react";
import {
    View,
    ScrollView,
    FlatList,
    Animated,
    InteractionManager,
    TouchableOpacity,
    StyleSheet,
    Dimensions,
    Image,
    AsyncStorage
} from "react-native";
import { BaseStyle, BaseColor, Images } from "@config";
import {
    Header,
    SafeAreaView,
    Icon,
    Text,
    Button,
    StarRating,
    Tag,
} from "@components";
import * as Utils from "@utils";

import {
    Placeholder,
    PlaceholderLine,
    Fade
  } from "rn-placeholder";


// Load sample data
import HTML from "react-native-render-html";


import AnimatedLoader from "react-native-animated-loader";
import FastImage from 'react-native-fast-image';
import Modal from "react-native-modal";
// import {
//     DataLoading,
//     DataConfig,
//     DataTrip,
//     DataHotelPackage,
//     DataIcon,
//     DataHotelPackageCity,
//     DataActivities,
//     DataDashboard,
//     DataSlider,
//     DataBlog,DataMenu,DataCard,DataPromo
// } from "@data";
import CardCustom from "../../components/CardCustom";
import {
    heightPercentageToDP as hp,
    widthPercentageToDP as wp
  } from "react-native-responsive-screen";
const {height, width} = Dimensions.get('window');
const itemWidth = (width - 30) / 2;

export default class Products extends Component {
    constructor(props) {
        super(props);
        var data=props.data.products;
        //console.log('productsxxxxss',JSON.stringify(data));
        this.state = {
            img_featured:Images.doodle,
            expanded:true,
            item:data,
            loading:true,
            DataCard:data,

        };
    }

    toggleExpand=()=>{
        this.setState({expanded : !this.state.expanded})
    }

    

    render() {
        const { navigation,data} = this.props;
        const {loading,item,DataCard}=this.state;
        const priceSplitter = (number) => (number && number.toString().replace(/\B(?=(\d{3})+(?!\d))/g, '.'));

        return (
            <View style={{backgroundColor:BaseColor.whiteColor,marginTop:10,flex:1}}>
                <View style={{marginHorizontal:20,paddingVertical:20,flex:1}}>
                    <TouchableOpacity
                            onPress={() => 
                            {
                                this.toggleExpand()
                            }}
                        >
                        <View style={{
                            flexDirection:'row',
                            justifyContent:'space-between',
                            }}>
                            <Text body1>Deal Partner</Text>
                            <Icon
                                        name={this.state.expanded ? 'chevron-up' : 'chevron-down'}
                                        color={BaseColor.dividedColor}
                                        size={14}
                                />
                        </View>
                    </TouchableOpacity>
                    
                    
                </View>

                {
                    this.state.expanded &&
                    <View
                    style={{
                        borderBottomColor: BaseColor.dividerColor,
                        borderBottomWidth: 0.5,
                    }}
                    />
                }

                {
                this.state.expanded &&
                <View>
                    <FlatList
                                               
                                               numColumns={2}
                                               columnWrapperStyle={{
                                                   flex: 1,
                                                   justifyContent: 'space-evenly',
                                                   marginBottom:10
                                               }}
                                               style={{marginHorizontal:20}}
                                               data={DataCard}
                                               showsHorizontalScrollIndicator={false}
                                               keyExtractor={(item, index) => item.id}
                                               getItemLayout={(item, index) => (
                                                   {length: 70, offset: 70 * index, index}
                                                 )}
                                                 removeClippedSubviews={true} // Unmount components when outside of window 
                                                 initialNumToRender={2} // Reduce initial render amount
                                                 maxToRenderPerBatch={1} // Reduce number in each render batch
                                                 maxToRenderPerBatch={100} // Increase time between renders
                                                 windowSize={7} // Reduce the window size
                                                 renderItem={({ item,index }) => (

                                                   <CardCustom
                                                       propImage={{height:wp("20%"),url:item.img_featured_url}}
                                                       propTitle={{text:item.product_name}}
                                                       propDesc={{text:''}}
                                                       propPrice={{price:0,startFrom:false}}
                                                       propPriceCoret={{price:item.product_detail.length != 0 ? priceSplitter(item.product_detail[0].normal_price) : 0,priceDisc:item.product_detail.length != 0 ? priceSplitter(item.product_detail[0].price) : 0,discount:0,discountView:false}}

                                                       propInframe={{top:item.product_discount,bottom:''}}
                                                       propTitle={{text:item.product_name}}
                                                       propDesc={{text:''}}
                                                       propStar={{rating:'',enabled:false}}
                                                       propLeftRight={{left:'',right:''}}
                                                       onPress={() =>
                                                        {
                                                            navigation.navigate("ProductDetailNew",{slug:item.slug_product})
                                                            //navigation.navigate("ProductDetailNew",{product:item,product_type:'hotelpackage'})


                                                        }
                                                       }
                                                       loading={false}
                                                       propOther={{inFrame:true,horizontal:false,width:(width - 50) / 2}}
                                                       propIsCampaign={item.product_is_campaign}
                                                       propPoint={0}

                                                       style={[
                                                           index % 2 ? { marginLeft: 10 } : {}
                                                       ]
                                                       }
                                                   />
                                               )}

                                              
                                           />
                </View>
                }


                
            </View>


            
        );
    }
}
