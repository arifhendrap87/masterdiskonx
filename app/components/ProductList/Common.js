import React, { Component } from "react";
import { View, TouchableOpacity, StyleSheet, FlatList, AsyncStorage, Dimensions } from "react-native";
import {
    Text,
    SafeAreaView,
    Header,
    Image,
    Icon,
    Tag,
    FormOption,
    Button
} from "@components";
import PropTypes from "prop-types";
// import styles from "./styles";
import { BaseStyle, BaseColor, Images } from "@config";
import {
    DataMenu, DataMasterDiskon, DataCard
} from "@data";

import FastImage from 'react-native-fast-image';
import SvgUri from 'react-native-svg-uri';
import CardCustom from "../../components/CardCustom";
import CardCustomTitle from "../../components/CardCustomTitle";
import {
    heightPercentageToDP as hp,
    widthPercentageToDP as wp
} from "react-native-responsive-screen";
const { height, width } = Dimensions.get('window');
const itemWidth = (width - 30) / 2;


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
    cardGroup: {
        marginTop: 20,
        width: '100%',
        backgroundColor: BaseColor.whiteColor,
        paddingBottom: 20
    },
    cardGroupTransparent: {
        marginTop: 20,
        width: '100%',
        //backgroundColor:BaseColor.whiteColor,
        paddingBottom: 20
    },
});
import {
    Placeholder,
    PlaceholderMedia,
    PlaceholderLine,
    Fade
} from "rn-placeholder";

export default class Common extends Component {

    constructor(props) {
        super(props)
        this.state = {
            icons: DataMenu,
            img_featured: Images.doodle,
            configLocal: DataMasterDiskon[0],
            loading: true,
            DataCard: DataCard

        }
        this.getConfigApi();
        this.getConfig();
        this.getSession();
    }

    //memanggil config
    getConfigApi() {
        AsyncStorage.getItem('configApi', (error, result) => {
            if (result) {
                let config = JSON.parse(result);
                this.setState({ configApi: config });
            }
        });
    }

    getConfig() {
        AsyncStorage.getItem('config', (error, result) => {
            if (result) {
                let config = JSON.parse(result);
                this.setState({ config: config });
            }
        });
    }

    //memanggil session
    getSession() {
        AsyncStorage.getItem('userSession', (error, result) => {
            if (result) {
                let userSession = JSON.parse(result);
                console.log('userSessions', JSON.stringify(userSession));

                var id_user = userSession.id_user;
                this.setState({ id_user: id_user });
                this.setState({ userSession: userSession });
                this.setState({ login: true });
            }
        });
    }


    componentDidMount() {
        setTimeout(() => {
            this.getData();
        }, 20);

    }

    getData() {
        let config = this.state.configApi;
        let baseUrl = config.apiBaseUrl;
        let url = baseUrl + "product?limit=4&tag=&category=" + this.props.slug;
        console.log('configApi', JSON.stringify(config));
        console.log('urlss', url);

        // let config = JSON.parse(result);
        // var url=config.apiBaseUrlDev+"product?limit=4&tag=&category="+this.props.slug;
        // console.log('urlCommon',url);

        var myHeaders = new Headers();
        myHeaders.append("Authorization", "Bearer " + config.apiToken);

        var requestOptions = {
            method: 'GET',
            headers: myHeaders,
            redirect: 'follow'
        };

        fetch(url, requestOptions)
            .then(response => response.json())
            .then(result => {
                //console.log('productList',JSON.stringify(result.data));
                const array = [
                    'https://fave-production-main.myfave.gdn/attachments/b830f5d667f72a999671580eb58683af908d4486/store/fill/400/250/5b225df71f4f5fcd71a24bb5e7f7eb44026fa4b98005d45a979853b812c3/activity_image.jpg',
                    'https://fave-production-main.myfave.gdn/attachments/240be21ccb5ad99e3afb0f591a4c65273b0f8c16/store/fill/800/500/bd1160e0f91e468af35f6186d6fd7374868f62b1534ee5db6432399b5f48/activity_image.jpg',
                    'https://fave-production-main.myfave.gdn/attachments/ffd7160ebf8ff67cc63e22016f82803a85714754/store/fill/400/250/975eec09dd53b92faca441aa40b75a6843a0628d30a966375404f1730f0b/activity_image.jpg'
                ];



                const newProjects = result.data.map(p =>
                    p.status === 1
                        ? {
                            ...p,
                            img_featured_url: this.getRandomItem(array),
                        }
                        : p
                );
                console.log('newProjects', JSON.stringify(newProjects));

                this.setState({ DataCard: newProjects });
                this.setState({ loading: false });
            })
            .catch(error => {
                //alert('Kegagalan Respon Server Common.js')
                console.log('Kegagalan Respon Server Common.js');
            });

    }

    getRandomItem(arr) {

        // get random index value
        const randomIndex = Math.floor(Math.random() * arr.length);

        // get random item
        const item = arr[randomIndex];

        return item;
    }

    render() {
        const {

        } = this.props;
        const { icons, loading, DataCard } = this.state;
        const priceSplitter = (number) => (number && number.toString().replace(/\B(?=(\d{3})+(?!\d))/g, '.'));

        return (

            DataCard.length != 0 ?
                <View style={styles.cardGroup}>
                    <CardCustomTitle
                        style={{ marginLeft: 20 }}
                        title={this.props.title}
                        desc={''}
                        more={true}
                        onPress={() => {
                            this.props.navigation.navigate('ProductList', { type: 'category', slug: this.props.slug, title: this.props.title });
                        }
                        }
                    />
                    <FlatList
                        horizontal={true}
                        showsHorizontalScrollIndicator={true}

                        data={DataCard}
                        showsHorizontalScrollIndicator={false}
                        keyExtractor={(item, index) => item.id}
                        getItemLayout={(item, index) => (
                            { length: 70, offset: 70 * index, index }
                        )}
                        removeClippedSubviews={true} // Unmount components when outside of window 
                        initialNumToRender={2} // Reduce initial render amount
                        maxToRenderPerBatch={1} // Reduce number in each render batch
                        maxToRenderPerBatch={100} // Increase time between renders
                        windowSize={7} // Reduce the window size
                        renderItem={({ item, index }) => (

                            <CardCustom
                                propImage={{ height: wp("20%"), url: item.img_featured_url }}
                                propTitle={{ text: item.product_name }}
                                propDesc={{ text: '' }}
                                propPrice={{ price: '', startFrom: false }}
                                propPriceCoret={{ price: item.product_detail.length != 0 ? priceSplitter(item.product_detail[0].normal_price) : 0, priceDisc: item.product_detail.length != 0 ? priceSplitter(item.product_detail[0].price) : 0, discount: 0, discountView: false }}

                                propInframe={{ top: item.product_detail.length != 0 ? item.product_detail[0].discount + '%' : 0, bottom: '' }}
                                propTitle={{ text: item.product_name }}
                                propDesc={{ text: item.vendor.display_name }}
                                propStar={{ rating: '', enabled: false }}
                                propLeftRight={{ left: '', right: '' }}
                                onPress={() => {
                                    this.props.navigation.navigate("ProductDetailNew", { slug: item.slug_product })
                                }
                                }
                                loading={loading}
                                propOther={{ inFrame: true, width: (width - 60) / 2, height: height / 9, inCard: true }}
                                propIsCampaign={item.product_is_campaign}
                                propPoint={0}

                                style={[
                                    index == 0
                                        ? { marginLeft: 20, marginRight: 10 }
                                        : { marginRight: 10 }
                                ]}
                            />
                        )}
                    />
                </View>
                :
                <View></View>

        );
    }
}

Common.propTypes = {
    style: PropTypes.oneOfType([PropTypes.object, PropTypes.array]),
};

Common.defaultProps = {
    style: {},

};
