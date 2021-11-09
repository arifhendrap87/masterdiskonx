import React, { Component } from "react";
import {
    View,
    ScrollView,
    Animated,
    TouchableOpacity,
    FlatList,
    AsyncStorage,
    Platform,
    StatusBar,
    Dimensions,
    Linking,
} from "react-native";
import {
    Text,
    SafeAreaView,
    Image,
    Icon,
    Tag,
    FormOption,
    Button
} from "@components";


import Swiper from 'react-native-swiper'
import { BaseStyle, BaseColor } from "@config";
import * as Utils from "@utils";
import styles from "./styles";
import FlightPlanCustom from "../../components/FlightPlanCustom";
import HeaderHome from "../../components/HeaderHome";
import CardCustom from "../../components/CardCustom";
import CardCustomTitle from "../../components/CardCustomTitle";
import SetDateLong from "../../components/SetDateLong";
import SetPenumpangLong from "../../components/SetPenumpangLong";
import FormOptionScreen from "../../components/FormOptionScreen";
import DropdownAlert from 'react-native-dropdownalert';
import { DataMasterDiskon } from "@data";
import Modal from 'react-native-modal';

import {
    DataLoading,
    DataConfig,
    DataTrip,
    DataHotelPackage,
    DataHotelPackageCity,
    DataActivities,
    DataDashboard,
    DataSlider,
    DataBlog,
    DataPromo,
    DataTopFlight,
    DataGetProvince
} from "@data";

import {
    heightPercentageToDP as hp,
    widthPercentageToDP as wp
} from "react-native-responsive-screen";

import {
    Placeholder,
    PlaceholderMedia,
    PlaceholderLine,
    Fade
} from "rn-placeholder";

const { height, width } = Dimensions.get('window');
const itemWidth = (width - 30) / 2;



export default class Home extends Component {

    constructor(props) {
        super(props);


        //Start Set Variabel Search
        var type = 'hotel';

        var tglAwal = this.getDate(0);
        var tglAkhir = this.getDate(1);

        var round = '';
        var title = '';
        if (type == 'flight') {
            round = false;
            title = 'Search Flight';
        } else if (type == 'hotel') {
            round = true;
            title = 'Search Hotel Package';
        } else if (type == 'trip') {
            round = true;
            title = 'Set Tour';
        }
        //End Set Variabel Search


        this.state = {
            DataMasterDiskon: DataMasterDiskon[0],
            login: false,
            icons: [
                {
                    icon: "airplane-outline",
                    name: "Flights",
                    route: "FlightSearch",
                    iconAnimation: "flight.json",
                    type: 'flight',
                    checked: true
                },
                {
                    icon: "bed-outline",
                    name: "Hotels",
                    route: "Hotel",
                    iconAnimation: "tour.json",
                    type: 'deal',
                    checked: true
                },
                // {
                //     icon: "bed-outline",
                //     name: "Explore",
                //     route: "Explore",
                //     iconAnimation:"tour.json",
                //     type:'other',
                // },
                {
                    icon: "bed-outline",
                    name: "New",
                    route: "HomeNew",
                    iconAnimation: "tour.json",
                    type: 'other',
                },
            ],
            heightHeader: Utils.heightHeader(),
            listdata_musium: DataLoading,
            listdata_culture: DataLoading,
            listdata_product_trip_country: DataLoading,
            listdata_product_trip: DataTrip,
            listdata_product_hotel_package: DataHotelPackage,
            listdata_product_hotel_package_room_promo: DataHotelPackage,
            listdata_product_hotel_package_buy_now_stay_later: DataHotelPackage,
            list_hotel_package_city: DataHotelPackageCity,
            listdata_product_flash: DataLoading,
            listdata_product_activities: DataActivities,
            listdata_promo: DataPromo,
            listdata_get_province: DataGetProvince,
            listdata_slider: DataSlider,
            listdata_topFlight: DataTopFlight,
            listdata_dashboard: DataDashboard,
            listdata_blog: DataBlog,
            listdata_flashsale_home: [],
            get_ada_flashsale: [],
            config: DataConfig,
            loading_dashboard: true,



            //Start Parameter Search-----------------------//
            //parameter flight//
            type: type,

            bandaraAsalCode: 'CGK',
            bandaraAsalLabel: 'Soekarno Hatta',
            bandaraTujuanCode: 'DPS',
            bandaraTujuanLabel: 'Denpasar',
            bandaraAsalIdCountry: '193',

            kelas: 'Economy Class',
            kelasId: 'E',

            listdata_kelas: [{
                value: "E",
                text: "Economy Class"
            },
            {
                value: "S",
                text: "Premium Economy"
            },
            {
                value: "B",
                text: "Business Class"
            },
            {
                value: "F",
                text: "First Class"
            }],

            //parameter hotel
            cityId: '5171',
            cityText: 'Denpasar',
            cityProvince: 'Bali',
            qty: 1,


            //parameter hotelLinx
            guest_per_room: 2,
            minRoom: 1,
            hotelLinxDestinationLabel: 'City, hotel, place to go',
            hotelLinxDestinationCity: '',
            hotelLinxDestinationHotel: '',
            hotelLinxDestinationType: '',
            hotelLinxDestinationArea: '',
            hotelLinxDestinationCountry: '',
            hotelLinxDestinationType: '',
            listdataRoom: [
                {
                    value: 1,
                    text: "1 Room"
                },
                {
                    value: 2,
                    text: "2 Room"
                },
                {
                    value: 3,
                    text: "3 Room"
                },
                {
                    value: 4,
                    text: "4 Room"
                },
                {
                    value: 5,
                    text: "5 Room"
                }
            ],

            round: round,
            dewasa: "1",
            anak: "0",
            bayi: "0",
            stringAdults: "1",
            stringChild: "0",
            stringBaby: "0",
            umurank: "0",
            stringumurank: "0",
            stringRoom: "1",
            adultnchildparam: "Adult",
            roomMultiParam: [
                {
                    id: 1,
                    dewasa: 1,
                    anak: 0,
                    bayi: 0,
                    umurAnakKe1: 0,
                    umurAnakKe2: 0,
                    umurAnak: ""

                }
            ],
            tglAwal: tglAwal,
            tglAkhir: tglAkhir,
            jumlahPerson: 1,
            //End Parameter Search-----------------------//


            userSession: null,
            visible: false,
            linkUpdate: '',
            versionInName: ''

        };
        this._deltaY = new Animated.Value(0);

        //Start Function Bind Search-----------------------//


        this.getConfigApi();
        this.getConfig();
        this.getSession();


    }



    convertDateText(date) {
        var d = new Date(date);
        var days = ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"];
        // var months = ["January","February","March","April","May","June","July","August","September","October","November","December"];
        var months = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];

        return d.getDate() + " " + months[d.getMonth()] + " " + d.getFullYear();
    }

    convertDateDM(date) {
        var d = new Date(date);
        var days = ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"];
        var months = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];
        return d.getDate() + " " + months[d.getMonth()];
    }

    getDate(num) {
        var MyDate = new Date();
        var MyDateString = '';
        MyDate.setDate(MyDate.getDate());
        var tempoMonth = (MyDate.getMonth() + 1);
        var tempoDate = (MyDate.getDate() + num);
        if (tempoMonth < 10) tempoMonth = '0' + tempoMonth;
        if (tempoDate < 10) tempoDate = '0' + tempoDate;

        return MyDate.getFullYear() + '-' + tempoMonth + '-' + tempoDate;
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


    getProvince() {
        let config = this.state.configApi;
        let baseUrl = config.baseUrl;

        let url = baseUrl + 'front/product/hotelekstra/getProvince';
        console.log('urlgetProvince', url);

        var myHeaders = new Headers();
        myHeaders.append("Content-Type", "application/json");
        var requestOptions = {
            method: 'POST',
            headers: myHeaders,
            body: JSON.stringify(),
            redirect: 'follow'
        };

        fetch(url, requestOptions)
            .then(response => response.json())
            .then(result => {
                console.log('getProvince', JSON.stringify(result));


            })
            .catch(error => { alert('Kegagalan Respon Server') });


    }



    getDataDashboard() {
        // let config=this.state.config;
        // console.log('configApi',JSON.stringify(config));
        this.setState({ loading_dashboard: true }, () => {
            // var url=config.baseUrl;
            // var path=config.dashboard.dir;

            let config = this.state.configApi;
            let baseUrl = config.baseUrl;

            let url = baseUrl + "front/api/product/dashboard";
            //console.log('urlgetProvince',url);


            //console.log('urlGetDashboard',JSON.stringify(url+path));


            var myHeaders = new Headers();
            myHeaders.append("Content-Type", "application/json");
            var requestOptions = {
                method: 'POST',
                headers: myHeaders,
                body: JSON.stringify(),
                redirect: 'follow'
            };

            fetch(url, requestOptions)
                .then(response => response.json())
                .then(result => {

                    console.log('dataDashboard', JSON.stringify(result));
                    this.setState({ loading_dashboard: false });
                    var listdata_product_hotel_package_room_promo = result.list_product_hotel_package_room_promo;
                    var listdata_product_hotel_package_buy_now_stay_later = result.list_product_hotel_package_paynow_stay_later;
                    var listdata_product_activities = result.list_product_activities;
                    var listdata_product_trip = result.list_product_trip;
                    var listdata_promo = result.list_promo;
                    var listdata_get_province = result.list_getProvince;


                    var list_hotel_package_city = result.list_hotel_package_city;
                    var listdata_category_hotel_package = result.form_hotel_category;
                    var listdata_slider = result.slider;
                    var listdata_topFlight = result.list_getTopFlight;
                    var listdata_blog = result.blog;
                    var listdata_flashsale_home = result.flashsale_home;


                    var more_product_hotel_package_room_promo = result.more_product_hotel_package_room_promo;
                    var more_product_hotel_package_buy_now_stay_later = result.more_product_hotel_package_buy_now_stay_later;
                    var more_product_activities = result.more_product_activities;
                    var more_product_trip = result.more_product_trip;
                    var more_hotel_package_city = result.more_hotel_package_city;
                    var get_ada_flashsale = result.get_ada_flashsale;




                    this.setState({ listdata_product_hotel_package_room_promo: listdata_product_hotel_package_room_promo })
                    this.setState({ listdata_product_hotel_package_buy_now_stay_later: listdata_product_hotel_package_buy_now_stay_later })
                    this.setState({ listdata_product_activities: listdata_product_activities });
                    this.setState({ listdata_product_trip: listdata_product_trip });
                    this.setState({ listdata_promo: listdata_promo });
                    this.setState({ listdata_topFlight: listdata_topFlight });
                    this.setState({ listdata_get_province: listdata_get_province });


                    this.setState({ more_product_hotel_package_room_promo: more_product_hotel_package_room_promo })
                    this.setState({ more_product_hotel_package_buy_now_stay_later: more_product_hotel_package_buy_now_stay_later })
                    this.setState({ more_product_activities: more_product_activities });
                    this.setState({ more_product_trip: more_product_trip });
                    this.setState({ more_hotel_package_city: more_hotel_package_city });

                    this.setState({ list_hotel_package_city: list_hotel_package_city });
                    this.setState({ listdata_category_hotel_package: listdata_category_hotel_package });
                    this.setState({ listdata_slider: listdata_slider });

                    this.setState({ listdata_blog: listdata_blog });
                    this.setState({ get_ada_flashsale });
                    this.setState({ listdata_flashsale_home: listdata_flashsale_home });

                    AsyncStorage.setItem('info_activities', JSON.stringify(result.info_activities));
                    AsyncStorage.setItem('info_hotelpackage', JSON.stringify(result.info_hotelpackage));
                    AsyncStorage.setItem('info_trip', JSON.stringify(result.info_trip));



                })
                .catch(error => { alert('Kegagalan Respon Server') });



        });


    }

    checkVersion() {


        let config = this.state.configApi;
        console.log('Platform', Platform.OS);
        if (Platform.OS == "android") {
            config.from = 'android';
            AsyncStorage.setItem('config', JSON.stringify(config));
            if (parseInt(this.state.DataMasterDiskon.versionInPlayStore) < parseInt(config.versionInPlayStore)) {

                this.setState({ visible: true });
                setTimeout(() => {
                    console.log('visible', this.state.visible);
                }, 50);
                this.setState({ linkUpdate: 'http://onelink.to/9gdqsj' });
                this.setState({ versionInName: config.versionInPlayStoreName });
            }
        } else {
            config.from = 'ios';
            AsyncStorage.setItem('config', JSON.stringify(config));
            if (parseInt(this.state.DataMasterDiskon.versionInAppStore) < parseInt(config.versionInAppStore)) {
                console.log('update');
                this.setState({ visible: true });
                setTimeout(() => {
                    console.log('visible', this.state.visible);
                }, 50);
                this.setState({ linkUpdate: 'http://onelink.to/9gdqsj' });
                this.setState({ versionInName: config.versionInAppStoreName });

            }

        }



    }


    componentDidMount() {
        StatusBar.setBackgroundColor(this.props.color, true)
        setTimeout(() => {
            this.checkVersion();
            this.getDataDashboard();
            this.getProvince();
        }, 20);

    }

    //fungsi untuk menampilkan icon
    renderIconService() {
        const { navigation } = this.props;
        const { icons } = this.state;
        return (
            <FlatList
                data={icons}
                numColumns={6}
                keyExtractor={(item, index) => index.toString()}
                renderItem={({ item }) => {
                    return (
                        <TouchableOpacity
                            style={styles.itemService}
                            activeOpacity={0.9}
                            onPress={() => {
                                navigation.navigate(item.route, { type: item.type });
                                if (item.type == 'trip') {
                                    navigation.navigate(item.route, { type: item.type });
                                } else if (item.type == 'other') {
                                    navigation.navigate(item.route);

                                } else if (item.type == 'activities') {
                                    navigation.navigate(item.route, { type: item.type });
                                } else if (item.type == 'hotel') {
                                    // this.setState({round:true});
                                    // var tglAwal=this.getDate(0);
                                    // var tglAkhir=this.getDate(1);
                                    // this.setState({tglAwal});
                                    // this.setState({tglAkhir});
                                    // this.onSelectProduct(item);
                                    // this.setState({dewasa:"2"});
                                    // this.setState({bayi:"0"});
                                    // this.setState({anak:"0"});
                                    // this.setState({jmlPerson:2});
                                } else if (item.type == 'flight') {
                                    // this.setState({round:false});
                                    // var tglAwal=this.getDate(1);
                                    // var tglAkhir=this.getDate(1);
                                    // this.setState({tglAwal});
                                    // this.setState({tglAkhir});
                                    // this.onSelectProduct(item);
                                    // this.setState({dewasa:"1"});
                                    // this.setState({bayi:"0"});
                                    // this.setState({anak:"0"});
                                    // this.setState({jumlahPerson:1});
                                    navigation.navigate("Flight", { reSearch: false, reSearchParam: {} });
                                } else if (item.type == 'deal') {
                                    navigation.navigate("Hotel", { reSearch: false, reSearchParam: {} });

                                } else {
                                    this.onSelectProduct(item);
                                }



                            }}
                        >
                            {item.checked ?

                                <View>
                                    <View
                                        //style={styles.iconContentColor}
                                        style={[styles.iconContent, { backgroundColor: BaseColor.primaryColor }]}
                                    >
                                        <Icon
                                            name={item.icon}
                                            size={20}
                                            color={BaseColor.whiteColor}
                                            solid
                                        />
                                    </View>
                                    <Text overline style={{ textAlign: "center" }}>
                                        {item.name}
                                    </Text>
                                </View>
                                :
                                <View>
                                    <View
                                        style={[styles.iconContent, { backgroundColor: BaseColor.secondColor }]}
                                    //style={styles.iconContent}

                                    >
                                        <Icon
                                            name={item.icon}
                                            size={20}
                                            color={BaseColor.whiteColor}
                                            solid
                                        />
                                    </View>
                                    <Text overline style={{ textAlign: "center" }}>
                                        {item.name}
                                    </Text>
                                </View>
                            }
                        </TouchableOpacity>
                    );
                }}
            />
        );
    }

    renderItemFlashsale(item) {
        const { navigation } = this.props;
        const priceSplitter = (number) => (number && number.toString().replace(/\B(?=(\d{3})+(?!\d))/g, '.'));
        return (
            <CardCustom
                propImage={{ height: wp("30%"), url: item.img_featured_url }}
                propInframe={{ top: item.product_place, bottom: item.product_cat }}
                propTitle={{ text: item.product_name }}
                propDesc={{ text: '' }}
                propPrice={{ price: priceSplitter(item.product_price), startFrom: true }}
                propPriceCoret={{ price: priceSplitter(item.product_price_correct), discount: priceSplitter(item.product_discount), discountView: true }}
                propStar={{ rating: item.product_rate, enabled: false }}
                propLeftRight={{ left: '', right: '' }}
                onPress={() => {
                    //console.log('product',JSON.stringify(item));
                    navigation.navigate("ProductDetail", { product: item, product_type: item.product_is_campaign.type_product })

                }
                }
                loading={this.state.loading_dashboard}
                propOther={{ inFrame: true, horizontal: true, width: wp("40%") }}
                propIsCampaign={item.product_is_campaign}
                propPoint={item.product_point}
                propIsFlashsale={true}
                propDarkMode={true}
            />
        );
    }

    renderItemFeaturedDestination(item, index) {
        const { navigation } = this.props;
        const priceSplitter = (number) => (number && number.toString().replace(/\B(?=(\d{3})+(?!\d))/g, '.'));

        return (
            <CardCustom
                propImage={{ height: wp("30%"), url: item.img_featured_url }}
                propInframe={{ top: '', bottom: item.city_name }}
                propTitle={{ text: '' }}
                propDesc={{ text: '' }}
                propPrice={{ price: '', startFrom: true }}
                propStar={{ rating: ''.stars, enabled: false }}
                propLeftRight={{ left: '', right: '' }}
                onPress={() =>
                    navigation.navigate("HotelByFilter", { id_city: item.id_city })
                }
                loading={this.state.loading_dashboard}
                propOther={{ inFrame: false, horizontal: true, width: wp("40%") }}
                style={[
                    index == 0
                        ? { marginLeft: 20, marginRight: 10 }
                        : { marginRight: 10 }
                ]}
            />
        );
    }

    renderItemRoomPromo(item, index) {
        const { navigation } = this.props;
        const priceSplitter = (number) => (number && number.toString().replace(/\B(?=(\d{3})+(?!\d))/g, '.'));
        return (
            <CardCustom
                propImage={{ height: wp("30%"), url: item.img_featured_url }}
                propInframe={{ top: item.product_place, bottom: item.product_cat }}
                propTitle={{ text: item.product_name }}
                propDesc={{ text: '' }}
                propPrice={{ price: priceSplitter(item.product_price), startFrom: true }}
                propPriceCoret={{ price: priceSplitter(item.product_price_correct), discount: priceSplitter(item.product_discount), discountView: true }}
                propStar={{ rating: item.product_rate, enabled: true }}
                propLeftRight={{ left: '', right: '' }}
                onPress={() =>
                    navigation.navigate("ProductDetail", { product: item, product_type: 'hotelpackage' })
                }
                loading={this.state.loading_dashboard}
                propOther={{ inFrame: true, horizontal: true, width: wp("40%") }}
                propIsCampaign={item.product_is_campaign}
                propPoint={item.product_point}

                style={[
                    index == 0
                        ? { marginLeft: 20, marginRight: 20 }
                        : { marginRight: 20 }
                ]}
            />
        );
    }

    renderItemBuyNowStayLater(item, index) {
        const { navigation } = this.props;
        const priceSplitter = (number) => (number && number.toString().replace(/\B(?=(\d{3})+(?!\d))/g, '.'));
        return (
            <CardCustom
                propImage={{ height: wp("30%"), url: item.img_featured_url }}
                propInframe={{ top: item.product_place, bottom: item.product_cat }}
                propTitle={{ text: item.product_name }}
                propDesc={{ text: '' }}
                propPrice={{ price: priceSplitter(item.product_price), startFrom: true }}
                propPriceCoret={{ price: priceSplitter(item.product_price_correct), discount: priceSplitter(item.product_discount), discountView: true }}
                propStar={{ rating: item.product_rate, enabled: true }}
                propLeftRight={{ left: '', right: '' }}
                onPress={() =>
                    navigation.navigate("ProductDetail", { product: item, product_type: 'hotelpackage' })
                }
                loading={this.state.loading_dashboard}
                propOther={{ inFrame: true, horizontal: true, width: wp("40%") }}
                propIsCampaign={item.product_is_campaign}
                propPoint={item.product_point}
                style={[
                    index == 0
                        ? { marginLeft: 20, marginRight: 10 }
                        : { marginRight: 10 }
                ]}
            />
        );
    }

    renderItemEvent(item, index) {
        const { navigation } = this.props;
        const priceSplitter = (number) => (number && number.toString().replace(/\B(?=(\d{3})+(?!\d))/g, '.'));
        return (
            <CardCustom
                propImage={{ height: wp("30%"), url: item.img_featured_url }}
                propInframe={{ top: this.convertDateDM(item.product_time), bottom: item.product_cat }}
                propTitle={{ text: item.product_name }}
                propDesc={{ text: '' }}
                propPrice={{ price: priceSplitter(item.product_price), startFrom: true }}
                propPriceCoret={{ price: priceSplitter(item.product_price_correct), discount: priceSplitter(item.product_discount), discountView: true }}

                propInframe={{ top: this.convertDateDM(item.product_time), bottom: item.product_cat }}
                propTitle={{ text: item.product_name }}
                propDesc={{ text: '' }}
                propStar={{ rating: '', enabled: false }}
                propLeftRight={{ left: '', right: '' }}
                onPress={() => {
                    navigation.navigate("ProductDetail", { product: item, product_type: 'activities' })
                }
                }
                loading={this.state.loading_dashboard}
                propOther={{ inFrame: true, horizontal: true, width: wp("40%") }}
                propIsCampaign={item.product_is_campaign}
                propPoint={item.product_point}
                propStar={{ rating: '', enabled: false }}
                propLeftRight={{ left: '', right: '' }}
                onPress={() => {
                    navigation.navigate("ProductDetail", { product: item, product_type: 'activities' })
                }
                }
                loading={this.state.loading_dashboard}
                propOther={{ inFrame: true, horizontal: true, width: wp("40%") }}
                propIsCampaign={item.product_is_campaign}
                propPoint={item.product_point}
                style={[
                    index == 0
                        ? { marginLeft: 20, marginRight: 20 }
                        : { marginRight: 20 }
                ]}
            />
        );

    }

    getNight(startDate, endDate) {
        const diffInMs = new Date(endDate) - new Date(startDate)
        const diffInDays = diffInMs / (1000 * 60 * 60 * 24);
        return diffInDays;
        
    }


    onSubmit(type, item) {
        const { product, productPart, round, from, to, loading, login } = this.state;
        var tgl_akhir = '';
        if (this.state.round == true) {
            tgl_akhir = this.state.tglAkhir;
        }


        var param = {
            DepartureDate: this.state.tglAwal,
            ReturnDate: tgl_akhir,
            Adults: this.state.dewasa,
            Children: this.state.anak,
            Infants: this.state.bayi,
        }

        var link = '';



        param.city = item.id;
        param.hotelid = "";
        param.typeSearch = "best";
        param.area = "";
        param.country = "Indonesia";
        param.room = this.state.roomMultiCountRoom;
        param.stringAdults = this.state.stringAdults;
        param.stringChild = this.state.stringChild;
        param.stringBaby = this.state.stringBaby;
        param.umurank = this.state.umurank.replace(",0", "");
        param.stringumurank = this.state.stringumurank.replace(",0", "");
        param.stringRoom = this.state.stringRoom;
        param.adultnchildparam = this.state.adultnchildparam;
        param.checkin = this.convertDateText(param.DepartureDate);
        param.checkout = this.convertDateText(param.ReturnDate);

        param.adults = param.Adults;
        param.child = param.Children;

        param.noofnights = this.getNight(param.DepartureDate, param.ReturnDate);
        param.type = 'hotelLinx';

        param.roomMultiCountRoom = this.state.roomMultiCountRoom;
        param.roomMultiParam = this.state.roomMultiParam;
        param.roomMultiGuest = this.state.roomMultiGuest;
        param.hotelLinxDestinationLabel = this.state.hotelLinxDestinationLabel;
        param.tglAwal = this.state.tglAwal;
        param.tglAkhir = this.state.tglAkhir;
        param.hotelLinxDestination = {
            "total": "0",
            "cityid": item.product_detail.cityid,
            "cityname": item.product_detail.cityname,
            "countryname": item.product_detail.countryname,
            "searchType": "best",
            "searchCity": item.product_detail.cityid,
            "searchHotel": "",
            "searchTitle": item.product_detail.cityname + " " + item.product_detail.countryname,
            "searchArea": "",
            "searchCountry": item.product_detail.countryname,
            "searchProvince": item.product_detail.province_id,
        };


        // console.log('paramHotelLinx',JSON.stringify(param));
        // console.log('paramHotelGetprovince',JSON.stringify(item));

        param.ratingH = "";
        param.rHotel = "";
        param.srcdata = "";
        param.minimbudget = "0";
        param.maximbudget = "15000000";
        param.shortData = "";
        param.startkotak = "0";
        param.searchTitle = item.product_detail.cityname + " " + item.product_detail.countryname,
            param.jmlTamu = 2;






        console.log('param', JSON.stringify(param));
        this.setState({ loading: true }, () => {
            link = 'HotelLinx';
            this.props.navigation.navigate(link,
                {
                    param: param,
                    paramOriginal: param
                });
            this.setState({ loading: false });
        });





    }

    getProductHotelLinxDetail(item) {
        console.log('itemss', JSON.stringify(item));
        this.onSubmit('hotel', item);
    }



    renderItemGetProvince(item, index) {
        const { navigation } = this.props;
        const priceSplitter = (number) => (number && number.toString().replace(/\B(?=(\d{3})+(?!\d))/g, '.'));
        return (
            <CardCustom
                propImage={{ height: hp("15%"), url: item.img_featured_url }}
                propInframe={{ top: item.product_place_2, bottom: 'mulai dari Rp ' + priceSplitter(item.product_price) }}
                propTitle={{ text: item.product_name }}
                propDesc={{ text: '' }}
                propPrice={{ price: priceSplitter(item.product_price), startFrom: false }}
                propPriceCoret={{ price: '', discount: priceSplitter(item.product_discount), discountView: false }}

                propStar={{ rating: 10, enabled: false }}
                propLeftRight={{ left: '', right: '' }}
                onPress={() => {
                    //alert('a');
                    this.getProductHotelLinxDetail(item);
                }
                    //navigation.navigate("TourDetailCustom",{product:item})
                }
                loading={this.state.loading_dashboard}
                propOther={{ inFrame: false, horizontal: true, width: wp("40%") }}
                propIsCampaign={item.product_is_campaign}
                propPoint={item.product_point}
                style={[
                    index == 0
                        ? { marginLeft: 20, marginRight: 10 }
                        : { marginRight: 10 }
                ]}
            />
        );

    }


    renderItemEvent(item, index) {
        const { navigation } = this.props;
        const priceSplitter = (number) => (number && number.toString().replace(/\B(?=(\d{3})+(?!\d))/g, '.'));
        return (
            <CardCustom
                propImage={{ height: wp("30%"), url: item.img_featured_url }}
                propInframe={{ top: this.convertDateDM(item.product_time), bottom: item.product_cat }}
                propTitle={{ text: item.product_name }}
                propDesc={{ text: '' }}
                propPrice={{ price: priceSplitter(item.product_price), startFrom: true }}
                propPriceCoret={{ price: priceSplitter(item.product_price_correct), discount: priceSplitter(item.product_discount), discountView: true }}

                propInframe={{ top: this.convertDateDM(item.product_time), bottom: item.product_cat }}
                propTitle={{ text: item.product_name }}
                propDesc={{ text: '' }}
                propStar={{ rating: '', enabled: false }}
                propLeftRight={{ left: '', right: '' }}
                onPress={() => {
                    navigation.navigate("ProductDetail", { product: item, product_type: 'activities' })
                }
                }
                loading={this.state.loading_dashboard}
                propOther={{ inFrame: true, horizontal: true, width: wp("40%") }}
                propIsCampaign={item.product_is_campaign}
                propPoint={item.product_point}
                propStar={{ rating: '', enabled: false }}
                propLeftRight={{ left: '', right: '' }}
                onPress={() => {
                    navigation.navigate("ProductDetail", { product: item, product_type: 'activities' })
                }
                }
                loading={this.state.loading_dashboard}
                propOther={{ inFrame: true, horizontal: true, width: wp("40%") }}
                propIsCampaign={item.product_is_campaign}
                propPoint={item.product_point}
                style={[
                    index == 0
                        ? { marginLeft: 20, marginRight: 10 }
                        : { marginRight: 10 }
                ]}
            />
        );

    }

    toFlightSearch(item) {
        console.log('toFlightSearch', JSON.stringify(item));
        paramFlightSearch = {
            "DepartureDate": item.departureDate,
            "ReturnDate": item.returnDate,
            "Adults": "1",
            "Children": "0",
            "Infants": "0",
            "Origin": "CGK",
            "Destination": item.kode,
            "IsReturn": true,
            "CabinClass": [
                "E"
            ],
            "CorporateCode": "",
            "Subclasses": false,
            "Airlines": [],
            "type": "flight",
            "Qty": 1,
            "participant": true,
            "round": true,
            "bandaraAsalCode": "CGK",
            "bandaraTujuanCode": item.kode,
            "bandaraAsalLabel": "Soekarno Hatta",
            "bandaraTujuanLabel": item.name,
            "tglAwal": item.departureDate,
            "tglAkhir": item.returnDate,
            "listdata_kelas": [
                {
                    "value": "E",
                    "text": "Economy Class"
                },
                {
                    "value": "S",
                    "text": "Premium Economy"
                },
                {
                    "value": "B",
                    "text": "Business Class"
                },
                {
                    "value": "F",
                    "text": "First Class"
                }
            ],
            "kelas": "Economy Class",
            "kelasId": "E",
            "jumlahPerson": 1,
            "dewasa": "1",
            "anak": "0",
            "bayi": "0"
        };
        this.props.navigation.navigate('FlightResult',
            {
                param: paramFlightSearch,
            });

    }

    renderItemTopFlight(item, index) {
        const { navigation } = this.props;
        const priceSplitter = (number) => (number && number.toString().replace(/\B(?=(\d{3})+(?!\d))/g, '.'));
        return (
            <CardCustom
                propImage={{ height: hp("15%"), url: item.gambar }}
                propInframe={{ top: item.name, bottom: '' }}
                propTitle={{ text: '' }}
                propDesc={{ text: '' }}
                propPrice={{ price: priceSplitter(item.product_price), startFrom: false }}
                propPriceCoret={{ price: '', discount: priceSplitter(item.product_discount), discountView: false }}

                propStar={{ rating: 10, enabled: false }}
                propLeftRight={{ left: '', right: '' }}
                onPress={() => {
                    this.toFlightSearch(item);
                }
                    //navigation.navigate("TourDetailCustom",{product:item})
                }
                loading={this.state.loading_dashboard}
                propOther={{ inFrame: false, horizontal: true, width: wp("40%") }}
                propIsCampaign={item.product_is_campaign}
                propPoint={item.product_point}
                style={[
                    index == 0
                        ? { marginLeft: 20, marginRight: 10 }
                        : { marginRight: 10 }
                ]}
            />
        );




    }

    renderItemBlog(item, index) {
        const { navigation } = this.props;
        const { config, param } = this.state;

        const priceSplitter = (number) => (number && number.toString().replace(/\B(?=(\d{3})+(?!\d))/g, '.'));
        return (
            <CardCustom
                propImage={{ height: wp("40%"), url: item.img_featured_url }}
                propInframe={{ top: item.name_blog_category, bottom: item.name_blog_category }}
                propTitle={{ text: item.title }}
                propDesc={{ text: item.title }}
                propPrice={{ price: 'empty', startFrom: false }}
                propPriceCoret={{ price: '' }}

                propStar={{ rating: '', enabled: false }}
                propLeftRight={{ left: '', right: '' }}
                onPress={() => {
                    console.log('blog', JSON.stringify(item));
                    // var param={
                    //     title:'Detail Blog',
                    //     subTitle:'',
                    //     featuredImage:item.featured_image,
                    //     titleBlog:item.title,
                    //     contentBlog:item.content_blog,
                    //     slugBlog:item.title_slug
                    // }
                    // navigation.navigate("Blog",{param:param});

                    var param = {
                        url: 'https://masterdiskon.com/blog/detail/' + item.slug_blog_category + '/' + item.title_slug,
                        title: 'Blog',
                        subTitle: ''
                    }
                    console.log('paramBlog', JSON.stringify(param));
                    navigation.navigate("WebViewPage", { param: param })

                }

                }
                loading={this.state.loading_dashboard}
                propOther={{ inFrame: true, horizontal: true, width: (width - 50) / 2 }}
                style={[
                    index % 2 ? { marginLeft: 10 } : {}
                ]
                }
            />
        );

    }


    renderItemPromo(item, index, length) {
        const { navigation } = this.props;
        const { config, param } = this.state;

        const priceSplitter = (number) => (number && number.toString().replace(/\B(?=(\d{3})+(?!\d))/g, '.'));
        return (
            <CardCustom
                propImage={{ height: wp("40%"), url: item.img_featured_url }}
                propInframe={{ top: item.product_desc, bottom: this.convertDateText(item.product_time) + '-' + this.convertDateText(item.product_time2) }}
                propTitle={{ text: item.product_name }}
                propDesc={{ text: '' }}
                propPrice={{ price: 'empty', startFrom: false }}
                propPriceCoret={{ price: '' }}

                propStar={{ rating: '', enabled: false }}
                propLeftRight={{ left: '', right: '' }}
                propCopyPaste={{ left: item.product_code, right: item.product_time, enabled: false }}
                onPress={() => {
                    console.log('item', JSON.stringify(item));
                    navigation.navigate("PromoDetail", { product: item });
                }

                }

                loading={this.state.loading_dashboard}
                propOther={{ inFrame: true, horizontal: true, width: length != 1 ? (width - 0) / 2 : (width - 40) / 1 }}
                style={[
                    length != 1 ?
                        index == 0
                            ? { marginLeft: 20, marginRight: 10 }
                            : { marginRight: 10 }
                        :
                        { marginLeft: 20 }

                ]}
            />
        );

    }


    toEditContact() {
        AsyncStorage.getItem('userSession', (error, result) => {
            if (result) {
                let userSession = JSON.parse(result);
                let item = userSession;
                //console.log('userSessions',JSON.stringify(userSession));
                var id_user = userSession.id_user;


                this.props.navigation.navigate('DetailContact', {
                    key: 0,
                    label: item.label,
                    fullname: item.fullname,
                    firstname: item.firstname,
                    lastname: item.lastname,
                    birthday: item.birthday,
                    nationality: item.nationality,
                    passport_number: item.passport_number,
                    passport_country: item.passport_country,
                    passport_expire: item.passport_expire,
                    phone: item.phone,
                    title: item.title,
                    email: item.email,

                    nationality_id: item.nationality_id,
                    nationality_phone_code: item.nationality_phone_code,

                    passport_country_id: item.passport_country_id,

                    updateParticipant: this.updateParticipant,
                    type: 'customer',
                    old: 'adult',
                    typeProduct: '',

                })
            }
        });
    }



    render() {

        const { navigation } = this.props;
        const { heightHeader, login } = this.state;
        const priceSplitter = (number) => (number && number.toString().replace(/\B(?=(\d{3})+(?!\d))/g, '.'));

        const heightImageBanner = Utils.scaleWithPixel(300, 1);
        const marginTopBanner = heightImageBanner - heightHeader;



        return (



            <SafeAreaView
                style={[BaseStyle.safeAreaView, { backgroundColor: BaseColor.bgColor }]}
                forceInset={{ top: "always" }}
            >


                <HeaderHome
                    title={
                        this.state.userSession == null ?
                            'Hey, Mau Kemana ?' : this.state.userSession.fullname
                    }
                    // renderRight={() => {
                    //     return (
                    //         this.state.login ?
                    //         <Icon
                    //             name="bell"
                    //             size={20}
                    //             color={BaseColor.whiteColor}
                    //         />
                    //         :
                    //         <View />

                    //     );
                    // }}

                    onPressRight={() => {
                        var redirect = 'Notification';
                        var param = {}
                        navigation.navigate(redirect);
                    }}
                />

                <ScrollView
                    onScroll={Animated.event([
                        {
                            nativeEvent: {
                                contentOffset: { y: this._deltaY }
                            }
                        }
                    ])}
                    onContentSizeChange={() =>
                        this.setState({
                            heightHeader: Utils.heightHeader()
                        })
                    }
                    scrollEventThrottle={8}
                    style={{ marginBottom: 0 }}
                >
                    <View style={{ marginTop: 0, marginBottom: 50 }}>
                        {
                            this.state.listdata_slider.length != 0 ?
                                <View>
                                    {/* <CardCustomTitle 
                                style={{marginLeft:20}} 
                                title={'Promo'} 
                                desc={''}  
                                more={this.state.listdata_slider}
                                onPress={() =>
                                    navigation.navigate("HotelCity")
                                }
                                /> */}
                                    {
                                        this.state.loading_dashboard ?
                                            <Placeholder
                                                Animation={Fade}
                                            >
                                                <PlaceholderLine width={100} style={{
                                                    width: "100%",
                                                    height: Utils.scaleWithPixel(100),
                                                    marginLeft: 0,
                                                    marginRight: 0,
                                                    borderRadius: 0
                                                }} />
                                            </Placeholder>
                                            :

                                            <View style={styles.wrapper}>

                                                <Swiper
                                                    dotStyle={{
                                                        backgroundColor: BaseColor.textSecondaryColor
                                                    }}

                                                    activeDotColor={BaseColor.primaryColor}
                                                    paginationStyle={styles.contentPage}
                                                    removeClippedSubviews={false}
                                                >
                                                    {this.state.listdata_slider.map((item, index) => {
                                                        return (
                                                            <Image
                                                                source={{ uri: item.img_featured_url }}
                                                                style={[styles.img, {
                                                                    borderBottomLeftRadius: 40,

                                                                }]}
                                                                //resizeMode="contain"
                                                                key={index}
                                                            />
                                                        );
                                                    })}
                                                </Swiper>



                                            </View>
                                    }
                                </View>
                                :
                                <View></View>
                        }

                        <View
                            style={{
                                marginTop: 0,
                                width: '90%',
                                alignSelf: 'center',
                            }}
                        >



                            <View>

                                {this.renderIconService()}
                            </View>
                        </View>



                        {
                            this.state.listdata_flashsale_home.length != 0 ?
                                <View style={{ backgroundColor: '#dc3545' }}>
                                    <CardCustomTitle
                                        style={{ marginLeft: 20 }}
                                        title={'Flashsale'}
                                        desc={''}
                                        more={this.state.listdata_flashsale_home}
                                        onPress={() =>
                                            navigation.navigate("HotelByFilter", { detail_category: 'room_promo' })
                                        }
                                        darkMode={true}
                                    />
                                    <FlatList
                                        contentContainerStyle={{
                                            paddingRight: 20
                                        }}
                                        horizontal={true}
                                        data={this.state.listdata_flashsale_home}
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
                                        renderItem={({ item }) => this.renderItemFlashsale(item)}

                                    />
                                </View>
                                :
                                <View></View>
                        }



                        {
                            this.state.listdata_product_hotel_package_room_promo.length != 0 ?
                                <View>
                                    <CardCustomTitle
                                        style={{ marginLeft: 20 }}
                                        title={'Room Promo'}
                                        desc={''}
                                        more={this.state.more_product_hotel_package_room_promo}
                                        onPress={() =>
                                            navigation.navigate("HotelByFilter", { detail_category: 'room_promo' })
                                        }
                                    />
                                    <FlatList
                                        contentContainerStyle={{
                                            paddingRight: 20
                                        }}
                                        horizontal={true}
                                        data={this.state.listdata_product_hotel_package_room_promo}
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
                                        renderItem={({ item, index }) => this.renderItemRoomPromo(item, index)}

                                    />
                                </View>
                                :
                                <View></View>
                        }



                        {/* {   
                                    this.state.listdata_product_hotel_package_buy_now_stay_later.length != 0 ?
                                    <View>
                                        <CardCustomTitle 
                                            style={{marginLeft:20}} 
                                            title={'Buy Now Stay Later'} 
                                            desc={''}  
                                            more={this.state.more_product_hotel_package_buy_now_stay_later}
                                            onPress={() =>
                                                navigation.navigate("HotelByFilter",{detail_category:'buy_now_stay_later'})
                                            }
                                        />
                                        <FlatList
                                                contentContainerStyle={{
                                                    paddingRight: 20
                                                }}
                                                horizontal={true}
                                                data={this.state.listdata_product_hotel_package_buy_now_stay_later}
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
                                                renderItem={({ item,index}) => this.renderItemBuyNowStayLater(item,index)}
                                                
                                            />
                                    </View>
                                    :
                                    <View></View>
                                    } */}

                        {
                            this.state.listdata_product_activities.length != 0 ?
                                <View style={{ flex: 1 }}>
                                    <CardCustomTitle
                                        style={{ marginLeft: 20 }}
                                        title={'Event'}
                                        desc={''}
                                        more={this.state.more_product_activities}
                                        onPress={() =>
                                            navigation.navigate("Activities")
                                        }
                                    />
                                    <FlatList
                                        contentContainerStyle={{
                                            paddingRight: 20
                                        }}
                                        horizontal={true}
                                        data={this.state.listdata_product_activities}
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
                                        renderItem={({ item, index }) => this.renderItemEvent(item, index)}


                                    />
                                </View>
                                :
                                <View></View>
                        }



                        {/* {   
                                    this.state.listdata_topFlight.length != 0 ?
                                    <View style={{flex:1}}>
                                        <CardCustomTitle 
                                            style={{marginLeft:20}} 
                                            title={'Penerbangan Populer'} 
                                            desc={'Dari Jakarta ke'}  
                                            more={false}
                                            onPress={() =>
                                                navigation.navigate("Activities")
                                            }
                                        />
                                        <FlatList
                                                contentContainerStyle={{
                                                    paddingRight: 20
                                                }}
                                                horizontal={true}
                                                data={this.state.listdata_topFlight}
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
                                                renderItem={({ item,index }) => this.renderItemTopFlight(item,index)}

                                               
                                            />
                                    </View>
                                    :
                                    <View></View>
                                } */}

                        {
                            this.state.listdata_get_province.length != 0 ?
                                <View style={{ flex: 1 }}>
                                    <CardCustomTitle
                                        style={{ marginLeft: 20 }}
                                        title={'Sepuluh Kota Terbaik'}
                                        desc={''}
                                        more={false}
                                        onPress={() =>
                                            navigation.navigate("Activities")
                                        }
                                    />
                                    <FlatList
                                        contentContainerStyle={{
                                            paddingRight: 20
                                        }}
                                        horizontal={true}
                                        data={this.state.listdata_get_province}
                                        showsHorizontalScrollIndicator={false}
                                        keyExtractor={(item, index) => item.id}
                                        getItemLayout={(item, index) => (
                                            { length: 70, offset: 70 * index, index }
                                        )}

                                        renderItem={({ item, index }) => this.renderItemGetProvince(item, index)}


                                    />
                                </View>
                                :
                                <View></View>
                        }


                        {
                            this.state.listdata_promo.length != 0 ?
                                <View>
                                    <CardCustomTitle style={{ marginLeft: 20 }} title={'Promo'} />
                                    <FlatList
                                        contentContainerStyle={{
                                            paddingRight: 20
                                        }}
                                        horizontal={true}
                                        data={this.state.listdata_promo}
                                        showsHorizontalScrollIndicator={false}
                                        keyExtractor={(item, index) => item.id}
                                        getItemLayout={(item, index) => (
                                            { length: 70, offset: 70 * index, index }
                                        )}
                                        //removeClippedSubviews={true} // Unmount components when outside of window 
                                        //initialNumToRender={1} // Reduce initial render amount
                                        //   maxToRenderPerBatch={1} // Reduce number in each render batch
                                        //   maxToRenderPerBatch={100} // Increase time between renders
                                        //windowSize={7} // Reduce the window size
                                        renderItem={({ item, index }) => this.renderItemPromo(item, index, this.state.listdata_promo.length)}
                                    />

                                </View>
                                :
                                <View></View>
                        }







                        {/* {   
                            this.state.listdata_product_trip.length != 0 ?
                            <View>
                                <CardCustomTitle style={{marginLeft:20}} 
                                title={'Paket Perjalanan'} 
                                desc={'Jelajahi Sekarang'} 
                                more={this.state.more_product_trip}
                                            onPress={() =>
                                                navigation.navigate("Tour")
                                            }
                                />
                                <FlatList
                                        contentContainerStyle={{
                                            paddingRight: 20
                                        }}
                                        horizontal={true}
                                        data={this.state.listdata_product_trip}
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
                                          renderItem={({ item,index }) => this.renderItemPaketTrip(item,index)}
                                    />
                            </View>
                            :
                            <View></View>
                            }  */}





                        {
                            this.state.listdata_blog.length != 0 ?
                                <View>
                                    <CardCustomTitle style={{ marginLeft: 20 }} title={'Inspirasi'} desc={'Info maupun tips untuk perjalananmu'} />
                                    <FlatList
                                        numColumns={2}
                                        columnWrapperStyle={{
                                            flex: 1,
                                            justifyContent: 'space-evenly',
                                            marginBottom: 10
                                        }}
                                        style={{ marginHorizontal: 20 }}
                                        //horizontal={false}
                                        data={this.state.listdata_blog}
                                        showsHorizontalScrollIndicator={false}
                                        keyExtractor={(item, index) => item.id}

                                        removeClippedSubviews={true} // Unmount components when outside of window 
                                        initialNumToRender={2} // Reduce initial render amount
                                        maxToRenderPerBatch={1} // Reduce number in each render batch
                                        maxToRenderPerBatch={1000} // Increase time between renders
                                        windowSize={7} // Reduce the window size

                                        getItemLayout={(item, index) => (
                                            { length: 70, offset: 70 * index, index }
                                        )}
                                        onScrollEndDrag={() => console.log("end")}
                                        onScrollBeginDrag={() => console.log("start")}
                                        onScroll={(e) => console.log(e.nativeEvent.contentOffset.y)}
                                        renderItem={({ item, index }) => this.renderItemBlog(item, index)}
                                    />
                                    <View style={{ marginHorizontal: 20, marginTop: -20 }}>
                                        <Button
                                            full
                                            // loading={loading}
                                            style={{ height: 40, backgroundColor: 'white', borderRadius: 5, marginTop: 20 }}
                                            onPress={() => {
                                                var param = {
                                                    url: 'https://masterdiskon.com/blog',
                                                    title: 'Blog',
                                                    subTitle: ''
                                                }
                                                navigation.navigate("WebViewPage", { param: param })
                                                //navigation.navigate("WebVewPage",{param:});


                                            }}
                                        >
                                            Selengkapnya
                                        </Button>
                                    </View>
                                </View>
                                :
                                <View></View>
                        }

                    </View>
                </ScrollView>
                <View style={{ flex: 1 }}>
                    {/* <Button title="Show modal" onPress={toggleModal} /> */}

                    <Modal isVisible={this.state.visible}
                    //onBackdropPress={() => {this.setState({visible:false})}}
                    >
                        <View style={{ flexDirection: 'column', backgroundColor: BaseColor.whiteColor, padding: 20 }}>
                            <Text body1>Versi baru ({this.state.versionInName}) telah tersedia</Text>
                            <Text caption1 >Silakan memperbarui aplikasi masterdiskon untuk menikmati fitur baru dan pengalaman aplikasi yang lebih baik</Text>

                            {/* <Button title="Hide modal" onPress={toggleModal} /> */}
                            <View style={{ flexDirection: 'row', marginTop: 10 }}>
                                <TouchableOpacity
                                    style={{ marginRight: 20 }}
                                    activeOpacity={0.9}
                                    onPress={() => {
                                        Linking.openURL(this.state.linkUpdate);
                                    }}
                                >
                                    <Text body1 bold>Update</Text>
                                </TouchableOpacity>
                                <TouchableOpacity
                                    activeOpacity={0.9}
                                    onPress={() => {
                                        this.setState({ visible: false });
                                    }}
                                >
                                    <Text body1 bold>Cancel</Text>
                                </TouchableOpacity>
                            </View>
                        </View>
                    </Modal>
                </View>

                <DropdownAlert ref={ref => this.dropdown = ref} messageNumOfLines={10} closeInterval={10000} />
            </SafeAreaView>
        );
    }
}
