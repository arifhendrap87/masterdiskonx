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



export default class HowExchange extends Component {
    constructor(props) {
        super(props);
        var data=props.data;
        this.state = {
            img_featured:Images.doodle,
            expanded:true,
            item:data
        };
    }

    toggleExpand=()=>{
        this.setState({expanded : !this.state.expanded})
    }

    

    render() {
        const { navigation,data} = this.props;
        const {item} = this.state;
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
                            <Text body1>Cara penukaran</Text>
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
                    <View style={{marginHorizontal:20,paddingVertical:20,flex:1}}>
                        <HTML
                            html={item.how_to_redeem}
                            imagesMaxWidth={Dimensions.get("window").width}
                        />
                    </View>
                }
                
            </View>


            
        );
    }
}
