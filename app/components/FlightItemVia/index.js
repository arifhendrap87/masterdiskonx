import React, { Component } from "react";
import { View, TouchableOpacity, Image } from "react-native";
import PropTypes from "prop-types";
import { Text, Icon } from "@components";
import { BaseColor, Images } from "@config";
import styles from "./styles";

import {
    Placeholder,
    PlaceholderMedia,
    PlaceholderLine,
    Fade
  } from "rn-placeholder";
  import Modal from "react-native-modal";
  

export default class itemDataDataVia extends Component {
    
    render() {
        const {
            style,
            loading,
            itemData,
            onPress,
            onPressDetail,
        } = this.props;


        const priceSplitter = (number) => (number && number.toString().replace(/\B(?=(\d{3})+(?!\d))/g, '.'));

        return (
            <View style={[styles.content, style]}>
                {
                    loading ? 
                    <View>
                    <View style={styles.contentTop}>
                        <View style={{ flex: 1 }}>
                            <PlaceholderLine width={50} />
                            <PlaceholderLine width={30} />
                        </View>
                        <View style={{ flex: 1.5, alignitemDatas: "center" }}>
                            <PlaceholderLine width={50} />
                            <View style={styles.contentLine}>
                                <View style={styles.line} />
                                <Icon
                                    name="plane"
                                    color={BaseColor.dividerColor}
                                    size={24}
                                    solid
                                />
                                <View style={styles.dot} />
                            </View>
                            <PlaceholderLine width={50} />
                        </View>
                        <View style={{ flex: 1, alignitemDatas: "flex-end" }}>
                            <PlaceholderLine width={50} />
                            <PlaceholderLine width={30} />
                        </View>
                    </View>
                    <View style={styles.contentBottom}>
                        <View style={styles.bottomLeft}>
                            <PlaceholderLine width={50} />
                        </View>
                        <View
                            style={styles.bottomRight}
                        >
                            <PlaceholderLine width={50} />
                        </View>
                    </View>
                </View>
                    :
                // <View />
                <View>
                    <TouchableOpacity  onPress={onPress}>
                        <View style={styles.contentTop}>
                            <View style={{ flex: 1 }}>
                                <Text title2>{itemData.detail.from.time}</Text>
                                <Text footnote light>
                                {itemData.detail.from.code}
                                </Text>
                            </View>
                            <View style={{ flex: 1.5, alignitemDatas: "center",alignItems:'center'}}>
                                <Text caption1 light>
                                   {itemData.detail.flight[0].flyTime}
                                </Text>
                                <View style={styles.contentLine}>
                                    <View style={styles.line} />
                                    <Icon
                                        name="md-airplane-outline"
                                        color={BaseColor.dividerColor}
                                        size={24}
                                        solid
                                    />
                                    <View style={styles.dot} />
                                </View>
                                <Text caption1 light>
                                    {itemData.transit==0 ? "Langsung" : itemData.transit+" Transit"}
                                </Text>
                            </View>
                            <View style={{ flex: 1, alignitemDatas: "flex-end",alignItems:'flex-end' }}>
                                <Text title2>{itemData.detail.to.time}</Text>
                                <Text footnote light>
                                    {itemData.detail.to.code}
                                </Text>
                            </View>
                        </View>
                        <View style={styles.contentBottom}>
                            <View style={styles.bottomLeft}>
                                <Image
                                    style={styles.image}
                                    resizeMode="contain"
                                    source={{uri: itemData.detail.flight[0].image}}
                                    // source={image}
                                />
                                <View>
                                    <Text caption1 semibold accentColor>
                                        {itemData.detail.flight[0].name}
                                    </Text>
                                    <Text caption2 light>
                                        {itemData.detail.flight[0].class}
                                    </Text>
                                </View>
                            </View>
                            <View
                                style={styles.bottomRight}
                            >
                                <Text caption2 light  primaryColor>
                                Rp {priceSplitter(itemData.price)}
                                </Text>
                                <Text caption1 light style={{ marginLeft: 5 }}>
                                    / Pax
                                </Text>
                            </View>
                        </View>
                       
                    </TouchableOpacity>
                 
                     <TouchableOpacity style={styles.contentBottom} onPress={onPressDetail}>
                         <View style={{ flex: 1.5, alignitemDatas: "center",alignItems:'center'}}>
                                 <Text caption1 light>
                                    Detail
                                </Text>
                                <View style={styles.contentLine}>
                                    <Icon
                                        name="ios-arrow-down-circle-outline"
                                        color={BaseColor.primaryColor}
                                        size={24}
                                        solid
                                    />
                                </View>
                         </View>
                     </TouchableOpacity>
                 </View>
                }
            </View>
        );
    }
}

itemDataDataVia.propTypes = {
    style: PropTypes.oneOfType([PropTypes.object, PropTypes.array]),
    itemData: PropTypes.object,
    loading: PropTypes.bool,
    onPress: PropTypes.func,
    onPressDetail: PropTypes.func,
};

itemDataDataVia.defaultProps = {
    style: {},
    itemData: {},
    loading: true,
    onPress: () => { },
    onPressDetail: () => { },
    
};
