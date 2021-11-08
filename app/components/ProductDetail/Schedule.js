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
import {
    DataConfig,
} from "@data";

import AnimatedLoader from "react-native-animated-loader";
import FastImage from 'react-native-fast-image';
import Modal from "react-native-modal";



export default class Schedule extends Component {
    constructor(props) {
        super(props);
        var data=props.data;
        this.state = {
            img_featured:Images.doodle,
            item:data

        };
    }

    

    render() {
        const { navigation,data} = this.props;
        const {item} =this.props;
        
        return (
            <View style={{backgroundColor:BaseColor.whiteColor,marginTop:10}}>
                <View style={{marginHorizontal:20,paddingVertical:10,}}>
                    <View style={{flexDirection:'row',alignItems: 'center',borderBottomColor:BaseColor.dividerColor,borderBottomWidth:1,paddingVertical:10}}>
                            <Icon
                                    name="time-outline"
                                    color={BaseColor.whiteColor}
                                    size={14}
                                    style={{backgroundColor:BaseColor.thirdColor,padding:5,borderRadius:5,marginRight:15}}
                            />
                            <Text caption1 style={{}}>Tukarkan penawaran pada Hari ini hingga 31 Jul 2021</Text>

                    </View>

                    <View style={{flexDirection:'row',alignItems: 'center',borderBottomColor:BaseColor.dividerColor,borderBottomWidth:1,paddingVertical:10}}>
                            <Icon
                                    name="time-outline"
                                    color={BaseColor.whiteColor}
                                    size={14}
                                    style={{backgroundColor:BaseColor.primaryColor,padding:5,borderRadius:5,marginRight:15}}
                            />
                            <Text caption1 style={{}}>Not Redeemable Now</Text>
                    </View>

                    <View style={{flexDirection:'row',alignItems: 'center',borderBottomColor:BaseColor.dividerColor,borderBottomWidth:1,paddingVertical:10}}>
                            <Icon
                                    name="time-outline"
                                    color={BaseColor.whiteColor}
                                    size={14}
                                    style={{backgroundColor:BaseColor.primaryColor,padding:5,borderRadius:5,marginRight:15}}
                            />
                            <Text caption1 style={{}}>Jadwalkan pesananmu sekarang</Text>
                    </View>

                    <View style={{flexDirection:'row',alignItems: 'center',paddingVertical:10}}>
                            <Icon
                                    name="time-outline"
                                    color={BaseColor.whiteColor}
                                    size={14}
                                    style={{backgroundColor:BaseColor.primaryColor,padding:5,borderRadius:5,marginRight:15}}
                            />
                            <Text caption1 style={{}}>Reservation required, read fine print for detail</Text>
                    </View>
                
                    

                </View>

            </View>

            
        );
    }
}
