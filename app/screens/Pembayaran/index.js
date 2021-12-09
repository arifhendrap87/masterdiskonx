import React, { Component } from "react";
import { View, ScrollView, TouchableOpacity, StyleSheet, AsyncStorage, BackHandler, FlatList, Alert, Clipboard, TextInput, Linking } from "react-native";
import { BaseStyle, BaseColor, Images } from "@config";
import {
    Header,
    SafeAreaView,
    Icon,
    Text,
    Button
} from "@components";
import * as Utils from "@utils";
import CountDown from 'react-native-countdown-component';
import AnimatedLoader from "react-native-animated-loader";
import moment from 'moment';
import CardCustomProfile from "../../components/CardCustomProfile";
import DataImage from "../../components/DataImage";
import CardCustom from "../../components/CardCustom";
import CardCustomTitle from "../../components/CardCustomTitle";
import PreviewBooking from "../../components/PreviewBooking";

import {
    DataLoading,
    DataConfig,
    DataTrip,
    DataHotelPackage,
    DataHotelPackageCity,
    DataActivities,
    DataDashboard,
    DataSlider,
    DataBooking
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
import DropdownAlert from 'react-native-dropdownalert';
import Modal from "react-native-modal";
import { PostDataNew } from '../../services/PostDataNew';

import Dialog from "react-native-dialog";
export default class Pembayaran extends Component {
    constructor(props) {
        var param = props.navigation.state.params.param;
        var id_order = param.id_order;
        var back = param.back;

        super(props);
        this.state = {
            statusMidtrans: { "status_code": "404", "status_message": "Transaction doesn't exist.", "id": "2c556a40-a909-44c7-b1ab-192f4844c2d1" },
            id_order: id_order,
            back: back,
            pnrDeparture: '-',
            pnrReturns: '-',
            order_id_aero: '',//untuk chek booking aero,
            dataDeparture: {
                "item_id": "3806ad46-bd0d-4cd1-bf3a-c3158e731782",
                "origin": "CGK",
                "origin_name": "Soekarno-Hatta International Airport",
                "destination": "DPS",
                "destination_name": "Ngurah Rai (Bali) International Airport",
                "url_logo": "https://megaelectra-dev-new.oss-ap-southeast-5.aliyuncs.com/83493b9f-84ee-4c46-9408-7ef9aca29442.logo",
                "airline": "CITILINK INDONESIA",
                "airline_code": "QG",
                "pnr": "C6Q3NI",
                "gmt_departure": "2020-08-04T21:55:00",
                "gmt_arrival": "2020-08-04T23:55:00",
                "departure_time": "04:55:00",
                "arrival_time": "07:55:00",
                "flight_segment": null,
                "price_pax": [
                    {
                        "pax_type": "ADT",
                        "count": 1,
                        "price": 740800.0
                    },
                    {
                        "pax_type": "ADT",
                        "count": 1,
                        "price": 795800.0
                    }
                ],
                "trans_information_details": [
                    {
                        "cabinClass": "Economy",
                        "subClass": "N",
                        "paxName": "NdaruKurniawan",
                        "paxType": "Adult",
                        "ticketNumber": "N/A",
                        "picEmail": "kurniandaru@gmail.com",
                        "baggage": "20",
                        "requestStatus": false,
                        "insurance": false
                    }
                ]
            },
            dataReturns: null,
            dataBooking: DataBooking,
            bookingDoc: {
                pjd: null,
                eticket: "https://cdn.masterdiskon.com/masterdiskon/order/flight/dev/2021/MD2112040018.pdf"
            },
            dataBookingAero: {},
            payment: [
                {
                    payment_type: "credit_card",
                    payment_type_label: "Kartu Kredit (Visa,mastercard,JCB)",
                    option: false,
                    subPayment: [
                        {
                            payment_sub: "credit_card",
                            payment_sub_label: "Kartu Kredit",
                            icon: "",
                            fee: 5000,
                            payment_type: "credit_card",
                            qris: false,
                            payment_form: "screenOther"
                        }
                    ]
                },

                {
                    payment_type: "eWallet",
                    payment_type_label: "eWallet",
                    option: true,
                    subPayment: [
                        // {
                        //     payment_sub:"gopay",
                        //     payment_sub_label:"Gopay",
                        //     icon:"",
                        //     fee:5000,
                        //     payment_type:"gopay",
                        //     qris:false,
                        //     payment_form:"screenLink"
                        // },
                        {
                            payment_sub: "gopay",
                            payment_sub_label: "QRIS",
                            icon: "",
                            fee: 5000,
                            payment_type: "gopay",
                            qris: true,
                            payment_form: "screenOther"
                        }
                    ]
                },


                {
                    payment_type: "bank_transfer",
                    payment_type_label: "ATM / Bank Transfer (Fee Rp 5.000,-)",
                    option: true,
                    subPayment: [

                        {
                            payment_sub: "bni",
                            payment_sub_label: "BNI",
                            icon: "",
                            fee: 5000,
                            payment_type: "bank_transfer",
                            qris: false,
                            payment_form: "screenSelf"
                        },
                        {
                            payment_sub: "permata",
                            payment_sub_label: "PERMATA",
                            icon: "",
                            fee: 5000,
                            payment_type: "bank_transfer",
                            qris: false,
                            payment_form: "screenSelf"
                        },
                        {
                            payment_sub: "echannel",
                            payment_sub_label: "Mandiri",
                            icon: "",
                            fee: 5000,
                            payment_type: "echannel",
                            qris: false,
                            payment_form: "screenSelf"
                        },
                        {
                            payment_sub: "other_va",
                            payment_sub_label: "BCA",
                            icon: "",
                            fee: 5000,
                            payment_type: "bank_transfer",
                            qris: false,
                            payment_form: "screenOther"
                        },

                    ]
                },
            ],
            modalVisible: false,
            modalVisibleCancel: false,
            option: [
                {
                    payment_sub: "bca",
                    payment_sub_label: "BCA",
                    icon: "",
                    payment_type: "bank_transfer",
                },
                {
                    payment_sub: "bni",
                    payment_sub_label: "BNI",
                    icon: "",
                    payment_type: "bank_transfer",
                },
                {
                    payment_sub: "permata",
                    payment_sub_label: "PERMATA",
                    icon: "",
                    payment_type: "bank_transfer",
                },
                {
                    payment_sub: "mandiri",
                    payment_sub_label: "PERMATA",
                    icon: "",
                    payment_type: "echannel",
                },

            ],
            paymentChooseTemp: {},
            config: DataConfig,

            listdata_promo: DataLoading,
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
            listdata_slider: DataSlider,
            listdata_dashboard: DataDashboard,

            loadingButton: false,
            reason: '',
            loadCancel: true,
            enableCancel: false,
            loadingPaymantMethod: true
        };

        this.getConfigApi();
        this.getConfig();
        this.getSession();
        this.handleBackButtonClick = this.handleBackButtonClick.bind(this);
        this.processCancel = this.processCancel.bind(this);
    }

    componentWillMount() {
        BackHandler.addEventListener('hardwareBackPress', this.handleBackButtonClick);
    }

    componentWillUnmount() {
        BackHandler.removeEventListener('hardwareBackPress', this.handleBackButtonClick);
    }

    handleBackButtonClick() {
        this.props.navigation.navigate('Booking');
        return true;
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


    getSession() {
        AsyncStorage.getItem('userSession', (error, result) => {
            if (result) {
                let userSession = JSON.parse(result);
                var id_user = userSession.id_user;
                this.setState({ id_user: id_user });
                this.setState({ userSession: userSession });
                this.setState({ login: true });
            }
        });
    }


    duration(expirydate) {

        var date = moment()
        var diffr = moment.duration(moment(expirydate).diff(moment(date)));
        var hours = parseInt(diffr.asHours());
        var minutes = parseInt(diffr.minutes());
        var seconds = parseInt(diffr.seconds());
        var d = hours * 60 * 60 + minutes * 60 + seconds;
        return d;

    }

    getPaymentMethod(total) {
        var type = '';
        if (total == 0) {
            type = 'statis';
        }
        let config = this.state.configApi;
        let baseUrl = config.baseUrl;
        let url = baseUrl + 'front/api_new/common/methodPayment/' + total + '/' + type;
        console.log('configApi', JSON.stringify(config));
        console.log('urlss', url);

        console.log('total', total);

        var type = '';
        if (total == 0) {
            type = 'statis';
        }
        console.log('urlgetPaymentMethod', url);
        var myHeaders = new Headers();
        myHeaders.append("Cookie", "ci_session=naquthon3ikgs94iun6c7g7cj4v9ukok");

        var requestOptions = {
            method: 'POST',
            headers: myHeaders,
            redirect: 'follow'
        };

        fetch(url, requestOptions)
            .then(response => response.json())
            .then(result => {
                this.setState({ loadingPaymantMethod: false });
                console.log('getPaymentMethod', JSON.stringify(result));
                this.setState({ payment: result })

            })
            .catch(error => console.log('error', error));


    }

    content_countdown() {
        var item = this.state.dataBooking[0];
        var order_payment_recent = item.order_payment_recent;
        var countDown = <View></View>;


        if (order_payment_recent != null) {
            var expiredTime = this.duration(order_payment_recent.expired);
            if (expiredTime > 0) {
                countDown = <View style={{
                    borderWidth: 1,
                    borderColor: BaseColor.textSecondaryColor,
                    borderRadius: 10,
                    marginBottom: 10,
                    padding: 10
                }}>

                    <View style={{ flexDirection: 'row', paddingTop: 5, paddingBottom: 5 }} >
                        <View style={{ flexDirection: 'row', flex: 10, justifyContent: "flex-start", alignItems: "center" }}>
                            <View style={{ flex: 8, flexDirection: "row", justifyContent: "flex-start", alignItems: "center" }}>
                                <View>
                                    <Text>
                                        Batas Waktu Pembayaran
                                                        </Text>
                                </View>
                            </View>
                            <View style={{ flex: 4, justifyContent: "center", alignItems: "flex-end" }}>
                                <CountDown
                                    size={12}
                                    until={expiredTime}
                                    // onFinish={() => alert('Finished')}
                                    style={{ float: 'left' }}
                                    digitStyle={{ backgroundColor: '#FFF', borderWidth: 2, borderColor: BaseColor.primaryColor }}
                                    digitTxtStyle={{ color: BaseColor.primaryColor }}
                                    timeLabelStyle={{ color: BaseColor.primaryColor, fontWeight: 'bold' }}
                                    separatorStyle={{ color: BaseColor.primaryColor }}
                                    timeToShow={['H', 'M', 'S']}
                                    timeLabels={{ m: null, s: null }}
                                    showSeparator
                                />
                            </View>
                        </View>
                    </View>
                </View>
            }
        }

        return (
            <View>
                {countDown}
            </View>
        )
    }



    content_payment() {

        var item = this.state.dataBooking[0];
        var order_payment_recent = item.order_payment_recent;
        var order_payment = item.order_payment;
        var order_expired = item.order_expired;
        var expiredTime = this.duration(order_expired);
        const priceSplitter = (number) => (number && number.toString().replace(/\B(?=(\d{3})+(?!\d))/g, '.'));

        var content = '';
        var content_tagihan = <View></View>;
        var content_invoice = <View></View>;
        var content_countdown = <View></View>;
        var content_get_code_hotelLinx = <View></View>;






        content_order = <View style={{ flexDirection: 'row', paddingTop: 5, paddingBottom: 5, borderBottomWidth: 1, borderBottomColor: BaseColor.textSecondaryColor, borderBottomStyle: 'solid', paddingBottom: 10 }} >
            <View style={{ flexDirection: 'row', flex: 11, justifyContent: "flex-start", alignItems: "center" }}>
                <View style={{ flex: 5, flexDirection: "row", justifyContent: "flex-start", alignItems: "center" }}>
                    <View>
                        <Text caption1 bold>
                            Data Order
                                                </Text>
                    </View>
                </View>
                <View style={{ flex: 5, justifyContent: "center", alignItems: "flex-end" }}>
                    <Text caption1 semibold numberOfLines={1}>
                        {this.state.dataBooking[0].order_code}
                    </Text>
                </View>
            </View>
            <TouchableOpacity
                style={{ flex: 1 }}
                onPress={() => {

                    var type = '';
                    if (this.state.dataBooking[0].product == 'Trip') {
                        type = 'trip';
                    } else if (this.state.dataBooking[0].product == 'Flight') {
                        type = 'flight';
                    } else if (this.state.dataBooking[0].product == 'Hotel') {
                        type = 'hotelLinx';
                    } else if (this.state.dataBooking[0].product == 'Hotelpackage') {
                        type = 'hotelpackage';
                    } else if (this.state.dataBooking[0].product == 'Activities') {
                        type = 'activities';
                    }
                    var param = {
                        type: type
                    }



                    // this.props.navigation.navigate("PreviewBooking",{
                    //     dataDetail:this.state.dataBooking[0],
                    //     param:param,
                    //     config:this.state.config
                    // });

                }
                }
            >


                <Icon
                    name="chevron-forward-outline"
                    size={18}
                    color={BaseColor.primaryColor}
                    style={{ textAlign: "center" }}
                />
            </TouchableOpacity>
        </View>


        //if (item.product != 'Trip'){
        var expiredTime = this.duration(order_payment_recent.expired);
        if (item.order_status.order_status_slug == 'paid') {
            countDown = <View style={{ backgroundColor: BaseColor.primaryColor, padding: 5, borderRadius: 5 }}><Text caption2 whiteColor>{item.order_status.order_status_desc}</Text></View>
        } else if (item.order_status.order_status_slug == 'booked') {
            countDown = <View style={{ backgroundColor: BaseColor.primaryColor, padding: 5, borderRadius: 5 }}><Text caption2 whiteColor>{item.order_status.order_status_desc}</Text></View>
        } else if (item.order_status.order_status_slug == 'complete') {
            countDown = <View style={{ backgroundColor: 'green', padding: 5, borderRadius: 5 }}><Text caption2 whiteColor>{item.order_status.order_status_desc}</Text></View>
        } else {

            if (expiredTime > 0) {
                if (item.order_status.order_status_slug == 'process' || item.order_status.order_status_slug == 'new') {


                    content_countdown = <View style={{ flexDirection: 'row', paddingTop: 5, paddingBottom: 5 }} >
                        <View style={{ flexDirection: 'row', flex: 10, justifyContent: "flex-start", alignItems: "center" }}>
                            <View style={{ flex: 5, flexDirection: "row", justifyContent: "flex-start", alignItems: "center" }}>
                                <View>
                                    <Text>
                                        Batas Pembayaran
                                                </Text>
                                </View>
                            </View>
                            <View style={{ flex: 5, justifyContent: "center", alignItems: "flex-end" }}>
                                <CountDown
                                    size={10}
                                    until={expiredTime}
                                    onFinish={() => {
                                        //alert('Finished')}
                                        var redirect = 'Pembayaran';
                                        var param = {
                                            id_order: this.state.id_order,
                                            dataPayment: {},
                                        }
                                        this.props.navigation.navigate("Loading", { redirect: redirect, param: param });
                                    }}
                                    style={{ float: 'left' }}
                                    digitStyle={{ backgroundColor: expiredTime < 300 ? BaseColor.thirdColor : BaseColor.secondColor }}
                                    digitTxtStyle={{ color: expiredTime < 300 ? BaseColor.whiteColor : BaseColor.blackColor }}
                                    timeLabelStyle={{ color: BaseColor.primaryColor, fontWeight: 'bold' }}
                                    separatorStyle={{ color: BaseColor.primaryColor }}
                                    timeToShow={['H', 'M', 'S']}
                                    timeLabels={{ m: null, s: null }}
                                    showSeparator
                                />
                            </View>
                        </View>
                    </View>

                    if (item.product == 'Hotel') {
                        if (item.product_detail.referenceno == "") {
                            content_get_code_hotelLinx = <View style={{ flexDirection: 'row' }}>
                                {/* <Button
                                            style={{ width:'100%',height: 40,backgroundColor:BaseColor.primaryColor  }}
                                            onPress={() => {  
                                                alert('Masih dalam pengembangan');
                                            }}
                                            full
                                            >
                                                <Text style={{color:BaseColor.whiteColor}}>Get Code</Text>
                                            
                                        </Button> */}

                            </View>
                        } else {
                            content_get_code_hotelLinx = <View style={{ flexDirection: 'row', paddingTop: 5, paddingBottom: 5 }} >
                                <View style={{ flexDirection: 'row', flex: 10, justifyContent: "flex-start", alignItems: "center" }}>
                                    <View style={{ flex: 5, flexDirection: "row", justifyContent: "flex-start", alignItems: "center" }}>
                                        <View>
                                            <Text>
                                                Voucher Code
                                                    </Text>
                                        </View>
                                    </View>
                                    <View style={{ flex: 5, justifyContent: "center", alignItems: "flex-end" }}>
                                        <Text semibold numberOfLines={1}>
                                            {item.product_detail.referenceno}
                                        </Text>
                                    </View>
                                </View>
                            </View>

                        }

                    }

                } else {
                    if (item.order_status.order_status_slug == 'new') {

                        content_invoice = <View style={{ flexDirection: 'row', paddingTop: 5, paddingBottom: 5 }} >
                            <View style={{ flexDirection: 'row', flex: 10, justifyContent: "flex-start", alignItems: "center" }}>
                                <View style={{ flex: 5, flexDirection: "row", justifyContent: "flex-start", alignItems: "center" }}>
                                    <View>
                                        <Text>
                                            No. Tagihan
                                            </Text>
                                    </View>
                                </View>
                                <View style={{ flex: 5, justifyContent: "center", alignItems: "flex-end" }}>
                                    <Text semibold numberOfLines={1}>
                                        {order_payment_recent.id_invoice}
                                    </Text>
                                </View>
                            </View>
                        </View>

                        content_tagihan = <View style={{ flexDirection: 'row', paddingTop: 5, paddingBottom: 5 }} >
                            <View style={{ flexDirection: 'row', flex: 10, justifyContent: "flex-start", alignItems: "center" }}>
                                <View style={{ flex: 5, flexDirection: "row", justifyContent: "flex-start", alignItems: "center" }}>
                                    <View>
                                        <Text>
                                            Tagihan
                                                    </Text>
                                    </View>
                                </View>
                                <View style={{ flex: 5, justifyContent: "center", alignItems: "flex-end" }}>
                                    <Text semibold numberOfLines={1}>
                                        Rp {priceSplitter(order_payment_recent.iv_total_amount)}
                                    </Text>
                                </View>
                            </View>
                        </View>
                    } else {
                        content_invoice = <View style={{ flexDirection: 'row', paddingTop: 5, paddingBottom: 5 }} >
                            <View style={{ flexDirection: 'row', flex: 10, justifyContent: "flex-start", alignItems: "center" }}>
                                <View style={{ flex: 5, flexDirection: "row", justifyContent: "flex-start", alignItems: "center" }}>
                                    <View>
                                        <Text>
                                            No. Tagihan
                                                    </Text>
                                    </View>
                                </View>
                                <View style={{ flex: 5, justifyContent: "center", alignItems: "flex-end" }}>
                                    <Text semibold numberOfLines={1}>
                                        -
                                                    </Text>
                                </View>
                            </View>
                        </View>
                        content_tagihan = <View style={{ flexDirection: 'row', paddingTop: 5, paddingBottom: 5 }} >
                            <View style={{ flexDirection: 'row', flex: 10, justifyContent: "flex-start", alignItems: "center" }}>
                                <View style={{ flex: 5, flexDirection: "row", justifyContent: "flex-start", alignItems: "center" }}>
                                    <View>
                                        <Text>
                                            Tagihan
                                                    </Text>
                                    </View>
                                </View>
                                <View style={{ flex: 5, justifyContent: "center", alignItems: "flex-end" }}>
                                    <Text semibold numberOfLines={1}>
                                        -
                                                    </Text>
                                </View>
                            </View>
                        </View>

                    }
                }
            }

        }

        var content = <View></View>
        //if(item.product != 'Trip'){
        content = <View style={{
            //borderBottomWidth: 1,
            backgroundColor: "#fff",
            //borderRadius: 18,
            shadowColor: "#000",
            shadowOffset: {
                width: 0,
                height: 2,
            },
            shadowOpacity: 0.25,
            shadowRadius: 3.84,
            //elevation: 5,
            paddingHorizontal: 20,
        }}>

            {/* {content_order}
                        {content_invoice}
                        {content_tagihan} */}
            {content_countdown}
            {content_get_code_hotelLinx}

        </View>
        // }
        // else
        // {
        //     content=<View style={{
        //                 borderBottomWidth: 1,
        //                 backgroundColor: "#fff",
        //                 //borderRadius: 18,
        //                 shadowColor: "#000",
        //                 shadowOffset: {
        //                         width: 0,
        //                         height: 2,
        //                 },
        //                 shadowOpacity: 0.25,
        //                 shadowRadius: 3.84,
        //                 paddingHorizontal:20,

        //                 //elevation: 5,
        //                 }}>

        //                 {content_order}
        //                 {payArray}
        //             </View>
        // }


        return (
            <View style={{
                borderBottomColor: BaseColor.textSecondaryColor,
                borderBottomWidth: 1,
                backgroundColor: "#fff",
                shadowColor: "#000",
                shadowOffset: {
                    width: 0,
                    height: 2,
                },
                shadowOpacity: 0.25,
                shadowRadius: 3.84,
                // padding:20,
                marginBottom: 10
            }}>
                {content}
            </View>
        )
    }

    modalShow(status, item) {
        this.setState({ modalVisible: status });
        this.setState({ option: item.subPayment });
        this.setState({ paymentChooseTemp: item });
    }

    gotoPaymentDetailSub(item) {
        this.setState({ modalVisible: false });
        const { navigation } = this.props;
        const { id_order, paymentChooseTemp, config } = this.state;
        console.log(config.midtransMethod);

        var dataPayment = {
            payment_type: item.payment_type,
            param_qris: item.qris,
            payment_type_label: paymentChooseTemp.payment_type_label,
            payment_sub: item.payment_sub,
            payment_sub_label: item.payment_sub_label,
            payment_fee: item.fee,
            payment_form: item.payment_form
        }
        console.log('dataPayment', JSON.stringify(dataPayment));

        var param = {
            id_order: id_order,
            dataPayment: dataPayment
        }


        if (dataPayment.payment_form == "screenOther") {
            if (dataPayment.payment_type == "gopay") {
                this.tokenMidtransUpdateCore(param);
            } else {
                this.tokenMidtransUpdate(param);
            }

        } else {
            this.tokenMidtransUpdateCore(param);
        }







    }


    gotoPaymentDetail(item) {
        const { navigation } = this.props;
        const { id_order, config } = this.state;

        console.log(config.midtransMethod);
        var dataPayment = {
            payment_type: item.payment_type,
            payment_qris: item.qris,

            payment_type_label: item.payment_type_label,
            payment_sub: item.subPayment[0].payment_sub,
            payment_sub_label: item.subPayment[0].payment_sub_label,
            payment_fee: item.subPayment[0].fee,
            payment_form: item.subPayment[0].payment_form,
        }

        var param = {
            id_order: id_order,
            dataPayment: dataPayment
        }
        console.log('paramNosSub', JSON.stringify(param));


        if (dataPayment.payment_form == "screenOther") {
            if (dataPayment.payment_type == "gopay") {
                this.tokenMidtransUpdateCore(param);
            } else {
                this.tokenMidtransUpdate(param);
            }

        } else {
            this.tokenMidtransUpdateCore(param);
        }



        //this.tokenMidtransUpdate(param);
        // navigation.navigate("PembayaranDetail",{
        //     param:param,
        // });
    }


    tokenMidtransUpdate(param) {
        this.setState({ loading_spinner: true });
        var dataPayment = param.dataPayment;



        var idOrder = param.id_order;

        var item = this.state.dataBooking[0];
        var order_payment_recent = item.order_payment_recent;

        var fee = dataPayment.payment_fee;
        var totalPembayaran = parseInt(order_payment_recent.iv_total_amount) + parseInt(fee);





        const { dataBooking } = this.state;
        let config = this.state.configApi;
        var authBasicHeader = config.midtransKey.authBasicHeader;

        var payment_type = dataPayment.payment_type;
        var payment_sub = dataPayment.payment_sub;

        var transaction_details = {
            gross_amount: totalPembayaran,
            order_id: dataBooking[0].order_payment_recent.id_invoice
        }
        var customer_details = {
            email: dataBooking[0].contact.contact_email,
            first_name: dataBooking[0].contact.contact_first,
            last_name: dataBooking[0].contact.contact_last,
            phone: dataBooking[0].contact.contact_phone,
        }

        var enabled_payments = [payment_sub];

        var credit_card = "";


        if (dataPayment.payment_type == "credit_card") {
            credit_card = {
                "secure": true,
                "save_card": true
            };
        }


        var item_details = [
            {
                "id": "1",
                "price": order_payment_recent.iv_total_amount,
                "quantity": 1,
                "name": dataBooking[0].product_name
            },
            {
                "id": "2",
                "price": fee,
                "quantity": 1,
                "name": "Fee"
            }

        ];

        var paramPay = {
            transaction_details: transaction_details,
            item_details,
            customer_details: customer_details,
            enabled_payments,
            credit_card
        }


        var url = config.midtransUrlToken;
        console.log('url', url);
        console.log('paramPay', JSON.stringify(paramPay));
        console.log('dataPayment', JSON.stringify(dataPayment));



        var myHeaders = new Headers();
        myHeaders.append("Authorization", "Basic " + authBasicHeader);
        myHeaders.append("Content-Type", "application/json");
        myHeaders.append("Cookie", "ci_session=6mmg253sca0no2e0gqas59up68f6ljlo");

        var raw = JSON.stringify(paramPay);

        var requestOptions = {
            method: 'POST',
            headers: myHeaders,
            body: raw,
            redirect: 'follow'
        };

        fetch(url, requestOptions)
            .then(response => response.json())
            .then(result => {
                console.log('dataToken', JSON.stringify(result));

                var paramPayMD = {
                    "total_pembayaran": totalPembayaran,
                    "fee": fee,
                    "id_invoice": dataBooking[0].order_payment_recent.id_invoice,
                    "dataPayment": dataPayment,
                    "token": result.token,
                    "order_code": dataBooking[0].order_code,
                    "id_order": idOrder,
                    "va_or_code_or_link": result.redirect_url
                }
                if (dataPayment.payment_type == "gopay") {
                    var qr_code_url = this.snapCharge(result.token);
                    param.qr_code_url = qr_code_url;
                    this.snapTokenUpdate(paramPayMD, param);
                } else {
                    this.snapTokenUpdate(paramPayMD, param);
                }


            })
            .catch(error => { alert('Kegagalan Respon Server tokenMidtransUpdate tokenMidtransUpdate'); });


    }

    snapCharge(token) {
        let config = this.state.configApi;
        let baseUrl = config.apiBaseUrl;
        let url = config.midtransUrlToken + token + "/charge";
        console.log('configApi', JSON.stringify(config));
        console.log('urlss', url);

        var myHeaders = new Headers();
        myHeaders.append("Authorization", "Basic U0ItTWlkLXNlcnZlci1rYUg3VlctakNpVjAyOGtWcmJmbjZITGY6");
        myHeaders.append("Content-Type", "application/json");

        var raw = JSON.stringify({ "payment_type": "gopay" });

        var requestOptions = {
            method: 'POST',
            headers: myHeaders,
            body: raw,
            redirect: 'follow'
        };

        fetch(url, requestOptions)
            .then(response => response.json())
            .then(result => {
                return result.qr_code_url;

            })
            .catch(error => { alert('Kegagalan Respon Server snapCharge'); });
    }


    snapTokenUpdate(paramPayMD, params) {
        const { navigation } = this.props;
        const { dataBooking } = this.state;
        let config = this.state.configApi;
        var url = config.baseUrl + 'front/api_new/OrderSubmit/snap_token_update';


        console.log('urlss', url, JSON.stringify(paramPayMD));
        var myHeaders = new Headers();
        myHeaders.append("Content-Type", "application/json");
        myHeaders.append("Cookie", "ci_session=6mmg253sca0no2e0gqas59up68f6ljlo");

        var raw = JSON.stringify(paramPayMD);

        var requestOptions = {
            method: 'POST',
            headers: myHeaders,
            body: raw,
            redirect: 'follow'
        };

        fetch(url, requestOptions)
            .then(response => response.json())
            .then(result => {
                this.setState({ loading_spinner: false });
                console.log('snapTokenUpdate', JSON.stringify(result));
                var id_invoice = result.id_invoice;
                var token = result.token;
                var dataSendMidTrans = {
                    id_invoice: id_invoice,
                    token: token
                }


                if (paramPayMD.dataPayment.payment_form == "screenOther") {
                    navigation.navigate("PembayaranDetail", {
                        param: params,
                    });

                } else if (paramPayMD.dataPayment.payment_form == "screenSelf") {
                    var param = {
                        id_order: dataBooking[0].id_order,
                        dataPayment: {},
                    }
                    navigation.navigate("Loading", { redirect: 'Pembayaran', param: param });
                } else if (paramPayMD.dataPayment.payment_form == "screenLink") {

                    var param = {
                        id_order: dataBooking[0].id_order,
                        dataPayment: {},
                    }
                    navigation.navigate("Loading", { redirect: 'Pembayaran', param: param });

                    var link = paramPayMD.va_or_code_or_link;
                    // console.log('link',JSON.stringify(link));
                    // console.log('paramPayMD',JSON.stringify(paramPayMD));
                    Linking.openURL(link);
                }


                // navigation.navigate("PembayaranDetail",{
                //     param:param,
                // });


            })
            .catch(error => { alert('Kegagalan Respon Server snapTokenUpdate'); });




    }




    //buat core
    tokenMidtransUpdateCore(params) {
        this.setState({ loading_spinner: true });
        var dataPayment = params.dataPayment;
        console.log('dataPayment', JSON.stringify(dataPayment));
        var fee = dataPayment.payment_fee;
        var idOrder = params.id_order;

        var item = this.state.dataBooking[0];
        var order_payment_recent = item.order_payment_recent;
        var totalPembayaran = parseInt(order_payment_recent.iv_total_amount) + parseInt(fee);




        const { dataBooking } = this.state;
        const { navigation } = this.props;
        let config = this.state.configApi;
        var authBasicHeader = config.midtransKey.authBasicHeader;

        var payment_type = dataPayment.payment_type;
        var payment_sub = dataPayment.payment_sub;

        var transaction_details = {
            gross_amount: totalPembayaran,
            order_id: dataBooking[0].order_payment_recent.id_invoice
        }
        var customer_details = {
            email: dataBooking[0].contact.contact_email,
            first_name: dataBooking[0].contact.contact_first,
            last_name: dataBooking[0].contact.contact_last,
            phone: dataBooking[0].contact.contact_phone,
        }

        var enabled_payments = [payment_sub];
        var item_details = [{
            "id": "ID-ORDER" + dataBooking[0].id_order,
            "price": dataBooking[0].total_price,
            "quantity": 1,
            "name": dataBooking[0].product_name
        }];

        var bank_transfer = {
            "bank": dataPayment.payment_sub,
            "va_number": "1234567890"
        }

        var item_details = [
            {
                "id": "1",
                "price": order_payment_recent.iv_total_amount,
                "quantity": 1,
                "name": dataBooking[0].product_name
            },
            {
                "id": "2",
                "price": fee,
                "quantity": 1,
                "name": "Fee"
            }

        ];

        //console.log('params',JSON.stringify(params));
        if (dataPayment.payment_type == "gopay") {
            var gopay = {
                "secure": true,
                "save_card": true
            };

            var paramPay = {
                payment_type: dataPayment.payment_type,
                transaction_details: transaction_details,
                gopay,
                item_details,
                customer_details: customer_details,

            }

        } else {
            var paramPay = {
                payment_type: dataPayment.payment_type,
                transaction_details: transaction_details,
                item_details,
                customer_details: customer_details,

            }

        }





        if (dataPayment.payment_type == "bank_transfer") {
            paramPay.bank_transfer = bank_transfer;
        } else if (dataPayment.payment_type == "echannel") {
            paramPay.echannel = {
                "bill_info1": "Payment For:",
                "bill_info2": "Masterdiskon"
            }
        }
        console.log('parampay', JSON.stringify(paramPay));


        var url = config.midtransUrl + "v2/charge";

        var myHeaders = new Headers();
        myHeaders.append("Accept", "application/json");
        myHeaders.append("Content-Type", "application/json");
        myHeaders.append("Authorization", "Basic " + authBasicHeader);
        myHeaders.append("Cookie", "__cfduid=d4ff313b0fa4bdbbb74a64dd1f5a4ccb51616649753");

        var raw = JSON.stringify(paramPay);

        var requestOptions = {
            method: 'POST',
            headers: myHeaders,
            body: raw,
            redirect: 'follow'
        };

        fetch(url, requestOptions)
            .then(response => response.json())
            .then(result => {

                console.log('charge', JSON.stringify(result));

                console.log('dataToken', JSON.stringify(result));
                console.log('dataPayment', JSON.stringify(dataPayment));

                var va_or_code_or_link = "";
                if (dataPayment.payment_type == "bank_transfer") {
                    if (dataPayment.payment_sub == "bni") {
                        va_or_code_or_link = result.va_numbers[0].va_number;
                    } else if (dataPayment.payment_sub == "permata") {
                        va_or_code_or_link = result.permata_va_number;
                    }
                } else if (dataPayment.payment_type == "echannel") {
                    if (dataPayment.payment_sub == "echannel") {
                        va_or_code_or_link = result.bill_key;
                    }
                } else if (dataPayment.payment_type == "gopay") {
                    va_or_code_or_link = result.actions[0].url;
                    // if(dataPayment.qris==false){
                    //     va_or_code_or_link=result.actions[1].url;
                    // }else{
                    //     va_or_code_or_link=result.actions[0].url;
                    // }


                    // if(dataPayment.payment_sub=="gopay"){
                    //     va_or_code_or_link=result.actions[1].url;
                    // }
                }

                var paramPayMD = {
                    "total_pembayaran": totalPembayaran,
                    "fee": fee,
                    "id_invoice": dataBooking[0].order_payment_recent.id_invoice,
                    "dataPayment": dataPayment,
                    "token": "",
                    "order_code": dataBooking[0].order_code,
                    "id_order": idOrder,
                    "va_or_code_or_link": va_or_code_or_link,
                }
                console.log('paramPayMD', JSON.stringify(paramPayMD));

                this.snapTokenUpdate(paramPayMD, params);

            })
            .catch(error => { alert('Kegagalan Respon Server tokenMidtransUpdateCore'); });

    }


    cekStatusMidtrans(id_invoice, button) {
        const { navigation } = this.props;


        const { dataBooking } = this.state;
        let config = this.state.configApi;
        var url = config.midtransUrl + "v2/" + id_invoice + "/status";
        console.log('urlcekStatusMidtrans', url);


        var myHeaders = new Headers();
        myHeaders.append("Accept", "application/json");
        myHeaders.append("Content-Type", "application/json");
        myHeaders.append("Authorization", "Basic " + config.midtransKey.authBasicHeader);
        //myHeaders.append("Cookie", "__cfduid=d4ff313b0fa4bdbbb74a64dd1f5a4ccb51616649753");

        var requestOptions = {
            method: 'GET',
            headers: myHeaders,
            redirect: 'follow'
        };


        fetch(url, requestOptions)
            .then(response => response.json())
            .then(result => {
                var status = result;
                console.log('statusMidtrans', JSON.stringify(result));
                if (button == false) {
                    this.setState({ statusMidtrans: status });
                } else if (button == true) {
                    if (status.status_code == '404') {
                        this.dropdown.alertWithType('error', 'Pembayaran #' + id_invoice, 'Pembayaran belum dilakukan');
                    } else {
                        if (status.transaction_status == 'settlement') {
                            this.dropdown.alertWithType('success', 'Pembayaran #' + id_invoice, 'Pembayaran berhasil dilakukan');

                            setTimeout(() => {
                                var param = {
                                    id_order: dataBooking[0].id_order,
                                    dataPayment: {},
                                }
                                navigation.navigate("Loading", { redirect: 'Pembayaran', param: param });
                            }, 50);



                        } else if (status.transaction_status == 'pending') {
                            this.dropdown.alertWithType('warn', 'Pembayaran #' + id_invoice, 'Menunggu pembayaran');
                        }
                    }
                }
            })
            .catch(error => {
                alert('Kegagalan Respon Server cekStatusMidtrans');
            });
    }

    submitChange() {
        this.setState({ loading_spinner: true });
        const { dataBooking } = this.state;
        const { navigation } = this.props;
        let config = this.state.configApi;
        var paramPayMD = {
            "id_invoice": dataBooking[0].order_payment_recent.id_invoice,
            "id_order": dataBooking[0].id_order,
            "id_order_payment": dataBooking[0].order_payment_recent.id_order_payment,
        }
        var param = {
            method: 'POST',
            headers: {
                Accept: 'application/json',
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(paramPayMD),
        }

        var url = config.baseUrl;
        console.log('snapTokenNew', url + 'front/api_new/OrderSubmit/new_invoice', paramPayMD);

        PostDataNew(url, 'front/api_new/OrderSubmit/new_invoice', param)
            .then((result) => {
                this.setState({ loading_spinner: false });
                console.log('new_invoice', JSON.stringify(result));
                var id_invoice = result.id_invoice;
                var param = {
                    id_order: dataBooking[0].id_order,
                    dataPayment: {},
                }
                //navigation.navigate("Pembayaran",{param:param});
                //navigation.navigate("Pembayaran",{param:param});
                navigation.navigate("Loading", { redirect: 'Pembayaran', param: param });

            })
            .catch((error) => {
                console.log(JSON.stringify(error));
                alert('Kegagalan Respon Server submitChange');
            });


    }


    gotoFormPayment() {
        const { navigation } = this.props;
        var item = this.state.dataBooking[0];
        var order_payment_recent = item.order_payment_recent;
        var dataPayment = {
            payment_type: order_payment_recent.payment_type,
            payment_type_label: order_payment_recent.payment_type_label,
            payment_sub: order_payment_recent.payment_sub,
            payment_sub_label: order_payment_recent.payment_sub_label,
        };

        var param = {
            id_order: item.id_order,
            dataPayment: dataPayment, back: ''
        }

        console.log('order_payment_recent', JSON.stringify(order_payment_recent));

        if (order_payment_recent.payment_form == "screenOther") {
            navigation.navigate("PembayaranDetail", {
                param: param,
            });
        } else {
            var link = order_payment_recent.payment_va_or_code_or_link;
            Linking.openURL(link);
        }

    }



    content_bank() {
        const { option, id_order } = this.state;
        let config = this.state.configApi;
        var item = this.state.dataBooking[0];
        var order_payment_recent = item.order_payment_recent;
        var order_expired = item.order_expired;
        var expiredTime = this.duration(order_expired);
        var status_name = '';
        var img = '';
        const { navigation } = this.props;
        const priceSplitter = (number) => (number && number.toString().replace(/\B(?=(\d{3})+(?!\d))/g, '.'));
        var content_bank = [];

        var content = <View></View>
        var content_modal = <Modal
            isVisible={this.state.modalVisible}
            onBackdropPress={() => {
                this.setState({ modalVisible: false });
            }}
            onSwipeComplete={() => {
                this.setState({ modalVisible: false });
            }}
            swipeDirection={["down"]}
            style={styles.bottomModal}
        >
            <View style={styles.contentFilterBottom}>

                <View style={styles.contentSwipeDown}>
                    <View style={styles.lineSwipeDown} />
                </View>
                {option.map((item, index) => (
                    <TouchableOpacity
                        style={styles.contentActionModalBottom}
                        key={item.value}
                        onPress={() => {
                            //this.onSelect(item)
                            this.gotoPaymentDetailSub(item);
                            // alert('asd');
                        }}
                    >
                        <Text
                            body2
                            semibold
                            primaryColor={item.checked}
                        >
                            {item.payment_sub_label}
                        </Text>
                    </TouchableOpacity>
                ))}

            </View>
        </Modal>



        this.state.payment.map((item, index) => (



            content_bank.push(
                <TouchableOpacity
                    style={styles.profileItem}
                    onPress={() => {
                        //console.log('itemoption',item.option);
                        if (this.state.loadingPaymantMethod == false) {
                            if (item.option == true) {
                                this.modalShow(true, item);
                            } else {
                                this.gotoPaymentDetail(item);
                            }
                        }


                    }}
                >

                    {this.state.loadingPaymantMethod == true ? <PlaceholderLine width={100} /> : <Text caption2 bold>{item.payment_type_label}</Text>}
                    {
                        this.state.loadingPaymantMethod == true ?
                            <View />
                            :
                            <View
                                style={{
                                    flexDirection: "row",
                                    alignItems: "center"
                                }}
                            >
                                <Icon
                                    name="chevron-forward-outline"
                                    color={BaseColor.primaryColor}
                                    style={{ marginLeft: 5 }}
                                />
                            </View>
                    }



                </TouchableOpacity>
            )


        ))



        if (order_payment_recent != null) {
            var expiredTime = this.duration(order_payment_recent.expired);
            if (item.aero_status == 'BLOCKINGINPROGRESS') {
                status_name = 'Menunggu Konfirmasi';
                content = <DataImage img={Images.waiting} text={status_name} />
            } else {
                if (this.state.loading_spinner == false) {
                    if (order_payment_recent.payment_type == "" || order_payment_recent.payment_type == "user") {
                        var title = <Text>Metode Pembayaran</Text>
                    } else {
                        var title = <Text>Metode Pembayaran Terpilih</Text>
                    }

                }




                if (item.order_status.order_status_slug == 'paid') {
                    title = <View />;
                    content = <View />
                } else if (item.order_status.order_status_slug == 'booked') {
                    title = <View />;
                    content = <View />
                } else if (item.order_status.order_status_slug == 'complete') {
                    title = <View />;
                    content = <View />
                } else {

                    if (expiredTime > 0) {
                        if (order_payment_recent.payment_type == "" || order_payment_recent.payment_type == "user") {
                            if (item.order_status.order_status_slug == 'process' || item.order_status.order_status_slug == 'new') {
                                status_name = item.order_status.order_status_name;
                                content = content_bank;
                            } else {
                                status_name = item.order_status.order_status_name;
                                content = <DataImage img={Images.timeout} text={status_name} />
                            }
                        } else {
                            content = <View style={{ flexDirection: 'column' }}>
                                <View style={{ flex: 1 }}>
                                    <View
                                        style={{ flexDirection: "row", marginTop: 10 }}
                                    >
                                        <View style={{ flex: 1 }}>
                                            <Text caption1 bold>Pembayaran via</Text>
                                        </View>
                                        <View
                                            style={{ flex: 1, alignItems: "flex-end" }}
                                        >
                                            <Text caption2 bold primaryColor>
                                                {order_payment_recent.payment_sub_label}
                                            </Text>
                                        </View>
                                    </View>
                                    {
                                        order_payment_recent.payment_form == "screenSelf" ?
                                            <View>
                                                <View
                                                    style={{ flexDirection: "row", marginTop: 10 }}
                                                >
                                                    <View style={{ flex: 1 }}>
                                                        <Text caption1 bold>Virtual Account</Text>
                                                    </View>
                                                    <View style={{ flex: 1, alignItems: "flex-end" }}>
                                                        <View
                                                            style={{ flexDirection: 'row' }}
                                                        >
                                                            <Text caption2 bold primaryColor>
                                                                {order_payment_recent.payment_va_or_code_or_link}
                                                            </Text>

                                                            <TouchableOpacity onPress={() => {

                                                                Clipboard.setString(order_payment_recent.payment_va_or_code_or_link);
                                                                this.dropdown.alertWithType('success', 'Copy Text Invoice', order_payment_recent.payment_va_or_code_or_link);

                                                            }}>
                                                                <Icon
                                                                    name="copy"
                                                                    size={14}
                                                                    style={{ marginLeft: 10 }}

                                                                />
                                                            </TouchableOpacity>
                                                        </View>
                                                    </View>
                                                </View>
                                                {

                                                    order_payment_recent.payment_sub_label == 'Mandiri' ?
                                                        <View
                                                            style={{ flexDirection: "row", marginTop: 10 }}
                                                        >
                                                            <View style={{ flex: 1 }}>
                                                                <Text caption1 bold>Penyedia Jasa</Text>
                                                            </View>
                                                            <View style={{ flex: 1, alignItems: "flex-end" }}>
                                                                <View
                                                                    style={{ flexDirection: 'row' }}
                                                                >
                                                                    <Text caption2 bold primaryColor>
                                                                        Midtrans (70012)
                                                        </Text>


                                                                </View>
                                                            </View>
                                                        </View>
                                                        :
                                                        <View />
                                                }
                                            </View>
                                            : <View />
                                    }

                                </View>
                                <View style={{ flexDirection: "row", marginTop: 10 }}>
                                    {
                                        order_payment_recent.payment_form != "screenSelf" ?
                                            <View style={{ flex: 1, justifyContent: "center", alignItems: "flex-start", width: '30%' }}>
                                                <Button
                                                    style={{ borderRadius: 0, marginVertical: 0, height: 30, backgroundColor: BaseColor.fourthColor }}
                                                    full
                                                    //loading={loading}
                                                    onPress={() => {

                                                        this.gotoFormPayment();

                                                    }}
                                                >
                                                    Lanjut Bayar
                                                </Button>
                                            </View>
                                            :
                                            <View />

                                    }
                                    <View style={{ flex: 1, justifyContent: "center", alignItems: "flex-start", width: '30%' }}>
                                        <Button
                                            style={{ borderRadius: 0, marginVertical: 0, height: 30 }}
                                            full
                                            //loading={loading}
                                            onPress={() => {
                                                Alert.alert(
                                                    'Confirm',
                                                    'Ingin mengganti metode pembayaran ?',
                                                    [
                                                        { text: 'NO', onPress: () => console.warn('NO Pressed'), style: 'cancel' },
                                                        { text: 'YES', onPress: () => this.submitChange() },
                                                    ]
                                                );

                                            }}
                                        >
                                            Ganti
                                            </Button>
                                    </View>
                                    <View style={{ flex: 1, justifyContent: "center", alignItems: "flex-start", width: '30%' }}>
                                        <Button
                                            style={{ borderRadius: 0, marginVertical: 0, height: 30, backgroundColor: BaseColor.primaryColor }}
                                            full
                                            //loading={loading}
                                            onPress={() => {
                                                this.cekStatusMidtrans(this.state.dataBooking[0].order_payment_recent.id_invoice, true);
                                                // var param={
                                                //     id_order:idOrder,
                                                //     dataPayment:{},
                                                // }
                                                // navigation.navigate("Pembayaran",{param:param});

                                            }}
                                        >

                                            <Text style={{ color: BaseColor.whiteColor }}>Cek Bayar</Text>
                                        </Button>
                                    </View>
                                </View>
                            </View>

                        }

                    } else {
                        if (item.order_status.order_status_slug == 'new') {
                            if (order_payment_recent.expired == "") {
                                status_name = 'Menunggu Konfirmasi';
                                content = <DataImage img={Images.waiting} text={status_name} />
                            } else {
                                status_name = 'Expireds';
                                content = <DataImage img={Images.timeout} text={status_name} />
                            }
                        } else if (item.order_status.order_status_slug == 'process') {
                            status_name = 'Menunggu Payment';
                            content = <View />
                        } else if (item.order_status.order_status_slug == 'paid') {
                            status_name = 'Paid';
                            content = <DataImage img={Images.paid} text={status_name} />
                        } else if (item.order_status.order_status_slug == 'booked') {
                            status_name = 'Booked';
                            content = <DataImage img={Images.timeout} text={status_name} />
                        } else if (item.order_status.order_status_slug == 'complete') {
                            status_name = 'Complete';
                            content = <DataImage img={Images.timeout} text={status_name} />
                        } else if (item.order_status.order_status_slug == 'cancel') {
                            status_name = 'Cancel';
                            content = <DataImage img={Images.timeout} text={status_name} />
                        } else if (item.order_status.order_status_slug == 'expired') {
                            status_name = 'Expired';
                            content = <DataImage img={Images.timeout} text={status_name} />
                        } else if (item.order_status.order_status_slug == 'billed') {
                            status_name = 'Billed';
                            content = <DataImage img={Images.timeout} text={status_name} />
                        } else if (item.order_status.order_status_slug == 'deny') {
                            status_name = 'Deny';
                            content = <DataImage img={Images.timeout} text={status_name} />
                        } else if (item.order_status.order_status_slug == 'error') {
                            status_name = 'Error';
                            content = <DataImage img={Images.timeout} text={status_name} />
                        } else if (item.order_status.order_status_slug == 'dropped') {
                            status_name = 'Dropped';
                            content = <DataImage img={Images.timeout} text={status_name} />
                        } else if (item.order_status.order_status_slug == 'refunded') {
                            status_name = 'Refunded';
                            content = <DataImage img={Images.timeout} text={status_name} />
                        }
                    }
                }
            }

        } else {
            status_name = item.order_status.order_status_name;
            content = <View
                style={{
                    borderWidth: 1,
                    borderColor: BaseColor.textSecondaryColor,
                    borderRadius: 10,
                    marginBottom: 10,
                    padding: 10,
                    justifyContent: 'center', alignItems: 'center'
                }}
            >
                <Icon
                    name="check-circle"
                    size={50}
                    color={'green'}
                    solid
                />
                <Text caption2>
                    {status_name}
                </Text>
            </View>

        }
        return (



            <View style={this.state.loading_spinner == false ? styles.blockView : ''}>
                {title}
                {content}
                {content_modal}
            </View>


        )
    }

    checkHL(idOrder, idInvoice) {
        let config = this.state.configApi;
        let baseUrl = config.baseUrl;
        let url = baseUrl + "front/api_new/order/check_code_hl/" + idOrder;
        console.log('configApi', JSON.stringify(config));
        console.log('urlss', url);


        const { navigation } = this.props;
        var type = '';
        if (this.state.dataBooking[0].product == 'Trip') {
            type = 'trip';
        } else if (this.state.dataBooking[0].product == 'Flight') {
            type = 'flight';
        } else if (this.state.dataBooking[0].product == 'Hotel') {
            type = 'hotelLinx';
        } else if (this.state.dataBooking[0].product == 'Hotelpackage') {
            type = 'hotelpackage';
        } else if (this.state.dataBooking[0].product == 'Activities') {
            type = 'activities';
        }
        var param = {
            type: type
        }

        var myHeaders = new Headers();
        myHeaders.append("Cookie", "ci_session=2p49a9qkonj20udtaeses9s3sp3fdb2f");

        var requestOptions = {
            method: 'POST',
            headers: myHeaders,
            redirect: 'follow'
        };
        console.log('checkHL', url);
        fetch(url, requestOptions)
            .then(response => response.json())
            .then(result => {
                console.log('checkHL', JSON.stringify(result));
                if (result.status == "empty") {
                    //this.getCodeHL(idInvoice);
                    alert('Terjadi kegagalan input data hotel');

                } else {


                    param.codeHL = result.codeHL;
                    this.props.navigation.navigate("Evoucher",
                        {
                            dataDetail: this.state.dataBooking[0],
                            param: param,
                            config: this.state.config
                        });

                }
            })
            .catch(error => { alert('Kegagalan Respon Server checkHL') });
    }


    getCodeHL(idInvoice) {
        let config = this.state.configApi;
        let baseUrl = config.apiBaseUrl;
        let url = baseUrl + "front/product/hotel/byPassCodeHl/" + idInvoice;
        console.log('configApi', JSON.stringify(config));
        console.log('urlss', url);

        var type = '';
        if (this.state.dataBooking[0].product == 'Trip') {
            type = 'trip';
        } else if (this.state.dataBooking[0].product == 'Flight') {
            type = 'flight';
        } else if (this.state.dataBooking[0].product == 'Hotel') {
            type = 'hotelLinx';
        } else if (this.state.dataBooking[0].product == 'Hotelpackage') {
            type = 'hotelpackage';
        } else if (this.state.dataBooking[0].product == 'Activities') {
            type = 'activities';
        }
        var param = {
            type: type
        }

        console.log('idInvoice', idInvoice);
        var myHeaders = new Headers();
        myHeaders.append("Cookie", "ci_session=3vkrld7j5d2unodr92hperkdrepd4v6j");

        var requestOptions = {
            method: 'GET',
            headers: myHeaders,
            redirect: 'follow'
        };

        fetch(url, requestOptions)
            .then(response => response.json())
            .then(result => {
                console.log('getCodeHL', JSON.stringify(result));
                this.props.navigation.navigate("Evoucher",
                    {
                        dataDetail: this.state.dataBooking[0],
                        param: param,
                        config: this.state.config,
                        ReferenceNo: result.ReferenceNo

                    });


            })
            .catch(error => { alert('Kegagalan Respon Server') });

    }

    showFormCancel() {
        let config = this.state.configApi;
        let baseUrl = config.baseUrl;
        let url = baseUrl + "api/hotel/Hotelinx/getCheckHotelCancellationCharges/app";
        console.log('configApi', JSON.stringify(config));
        console.log('urlss', url);

        var id_order = this.state.id_order;
        var myHeaders = new Headers();
        myHeaders.append("Cookie", "ci_session=f16dtrsomtfqmusdvjgqs79f4u07f8u5");

        var formdata = new FormData();
        formdata.append("param", id_order);

        var requestOptions = {
            method: 'POST',
            headers: myHeaders,
            body: formdata,
            redirect: 'follow'
        };

        fetch(url, requestOptions)
            .then(response => response.json())
            .then(result => {
                console.log('keyCancel', JSON.stringify(result));
                if (result.success == true) {
                    this.setState({ modalVisibleCancel: true });
                } else {
                    alert('Kegagalan Respon Server');
                }

            })
            .catch(error => {
                alert('Kegagalan Respon Server');
            });



    }

    processCancel() {
        const { navigation } = this.props;
        var id_order = this.state.id_order;
        var reason = this.state.reason;

        let config = this.state.configApi;
        let baseUrl = config.baseUrl;
        let url = baseUrl + "api/hotel/Hotelinx/getCancelBooking/app";
        console.log('configApi', JSON.stringify(config));
        console.log('urlss', url);


        console.log('id_order', id_order);
        console.log('reason', reason);
        var myHeaders = new Headers();
        myHeaders.append("Cookie", "ci_session=f16dtrsomtfqmusdvjgqs79f4u07f8u5");

        var formdata = new FormData();
        formdata.append("id_booking", id_order);
        formdata.append("reason", reason);

        var requestOptions = {
            method: 'POST',
            headers: myHeaders,
            body: formdata,
            redirect: 'follow'
        };

        fetch(url, requestOptions)
            .then(response => response.json())
            .then(result => {
                console.log('processCancel', JSON.stringify(result));
                if (result.status == 1) {
                    this.setState({ modalVisibleCancel: false });
                    this.dropdown.alertWithType('success', 'Info Pembatalan', 'Pembatalan berhasil dilakukan');
                    setTimeout(() => {
                        navigation.navigate('Booking');
                    }, 50);


                } else {
                    alert('Kegagalan Respon Server');
                }
                // {"status":1,"msg":"Order berhasil di cancel"}

            })
            .catch(error => {
                alert('Kegagalan Respon Server');
            });
    }


    content_eticket() {

        var item = this.state.dataBooking[0];
        var dataDeparture = this.state.dataDeparture;
        var dataReturns = this.state.dataReturns;
        var order_id_aero = this.state.order_id_aero;

        var type = '';
        if (this.state.dataBooking[0].product == 'Trip') {
            type = 'trip';
        } else if (this.state.dataBooking[0].product == 'Flight') {
            type = 'flight';
        } else if (this.state.dataBooking[0].product == 'Hotel') {
            type = 'hotelLinx';
        } else if (this.state.dataBooking[0].product == 'Hotelpackage') {
            type = 'hotelpackage';
        } else if (this.state.dataBooking[0].product == 'Activities') {
            type = 'activities';
        }
        var param = {
            type: type
        }


        if (item.product == 'Flight') {
            if (dataReturns != null) {
                var content_returns = <CardCustomProfile
                    title={'E-Ticket Returns'}
                    subtitle={'Check tiket kepulangan Anda'}
                    icon={'bookmark-outline'}
                    onPress={() => {
                        this.props.navigation.navigate("Eticket",
                            {
                                order_id_aero: order_id_aero,
                                dataFlight: dataReturns,
                                type: 'Return',

                                dataDetail: this.state.dataBooking[0],
                                param: param,
                                config: this.state.config

                            });
                    }}

                />
            }
        }

        var content = <View></View>
        if (item.product == 'Flight') {
            if (item.order_status.order_status_slug == 'complete') {
                var order_detail = item.detail[0].order_detail[0];
                var bookingDoc = this.state.bookingDoc;

                if (this.state.loading_evoucher == true) {
                    content = <View>
                        <Text>Check Eticket..</Text>
                        <PlaceholderLine style={{
                            height: 50, borderWidth: 1,
                            borderColor: BaseColor.textSecondaryColor,
                            borderRadius: 10,
                            marginBottom: 10,
                        }} width={100} />
                    </View>
                } else {
                    content = <View
                    >

                        <CardCustomProfile
                            title={'E-Ticket Departures'}
                            subtitle={'Check tiket keberangkatan Anda'}
                            icon={'bookmark-outline'}
                            onPress={() => {

                                // var param = {
                                //     url: bookingDoc.eticket,
                                //     title: 'Evoucher',
                                //     subTitle: ''
                                // }

                                // console.log('paramBlog', JSON.stringify(param));
                                // this.props.navigation.navigate("WebViewPage", { param: param })

                                this.props.navigation.navigate("Eticket",
                                    {
                                        order_id_aero: order_id_aero,
                                        dataFlight: dataDeparture, type: 'Departure',
                                        dataDetail: this.state.dataBooking[0],
                                        param: param,
                                        config: this.state.config
                                    });
                            }}

                        />

                        {/* {content_returns} */}
                    </View>
                }
            }
        } else if (item.product == 'Hotelpackage' || item.product == 'Trip' || item.product == 'Activities' || item.product == 'Hotel') {
            if (item.order_status.order_status_slug == 'complete') {

                if (item.product == "Hotel") {
                    var order_detail = item.detail[0].order;
                    content = <View
                    >
                        <CardCustomProfile
                            title={'Voucher Code'}
                            subtitle={'Check Evoucher pesanan Anda'}
                            icon={'pricetag-outline'}
                            onPress={() => {
                                console.log('hotel', JSON.stringify(item));
                                this.checkHL(item.id_order, item.order_payment_recent.id_invoice);
                                //this.getCodeHL(item.order_payment_recent.id_invoice);
                                // this.props.navigation.navigate("Evoucher",
                                // {
                                //     dataDetail:this.state.dataBooking[0],
                                //     param:param,
                                //     config:this.state.config
                                // });
                            }}

                        />


                        <View>
                            {
                                this.state.enableCancel == true ?
                                    <Button
                                        full
                                        style={{ borderRadius: 0, backgroundColor: BaseColor.thirdColor }}
                                        loading={this.state.loadingButton}
                                        onPress={() => {
                                            this.showFormCancel();
                                            // var redirect='PembayaranDetail';
                                            // var param={
                                            //     id_order:idOrder,
                                            //     dataPayment:{}
                                            // }
                                            // navigation.navigate("Redirect",{redirect:redirect,param:param});
                                        }}
                                    >
                                        <Text whiteColor>Batalkan Pesanan</Text>

                                    </Button>
                                    :
                                    <View />
                            }

                        </View>



                    </View>
                } else {
                    var order_detail = item.detail[0].order;
                    content = <View
                    >
                        <CardCustomProfile
                            title={'Voucher Code'}
                            subtitle={'Check Evoucher pesanan Anda'}
                            icon={'tag'}
                            onPress={() => {
                                this.props.navigation.navigate("Evoucher",
                                    {
                                        dataDetail: this.state.dataBooking[0],
                                        param: param,
                                        config: this.state.config
                                    });
                            }}

                        />



                    </View>
                }

            } else if (item.order_status.order_status_slug == 'paid') {
                var order_detail = item.detail[0].order;
                content = <View
                >
                    <CardCustomProfile
                        title={item.order_status.order_status_desc}
                        subtitle={'Kami akan memproses pembayaran Anda'}
                        icon={'info-circle'}
                        nav={false}
                        onPress={() => {
                            this.props.navigation.navigate("Evoucher",
                                {
                                    dataDetail: this.state.dataBooking[0],
                                    param: param,
                                    config: this.state.config
                                });
                        }}

                    />



                </View>

            } else if (item.order_status.order_status_slug == 'booked') {
                var order_detail = item.detail[0].order;
                content = <View
                >
                    <CardCustomProfile
                        title={item.order_status.order_status_name}
                        subtitle={item.order_status.order_status_desc}
                        icon={'info-circle'}
                        nav={false}
                        onPress={() => {
                            this.props.navigation.navigate("Evoucher",
                                {
                                    dataDetail: this.state.dataBooking[0],
                                    param: param,
                                    config: this.state.config
                                });
                        }}

                    />



                </View>

            }
        }

        return (
            <View>
                {content}
            </View>
        )


    }


    // content_booking_code(){
    //     var item=this.state.dataBooking[0];
    //     var dataDeparture=this.state.dataDeparture;
    //     var dataReturns=this.state.dataReturns;
    //     var order_id_aero=this.state.order_id_aero;



    //     if(dataReturns != null){


    //     var content_returns=<CardCustomProfile 
    //                                 title={'E-Ticket Returns'}
    //                                 subtitle={'Check tiket kepulangan Anda'}
    //                                 icon={'tag'}
    //                                 onPress={() => {
    //                                     this.props.navigation.navigate("Eticket",
    //                                     {order_id_aero:order_id_aero,dataFlight:dataReturns,type:'Returns'});
    //                                 }}

    //                             />
    //                         }

    //     var content=<View></View>
    //     if(item.product=='Flight' && item.order_status.order_status_slug=='complete'){
    //         var order_detail=item.detail[0].order_detail[0];
    //         content=<View
    //                     style={{
    //                         borderWidth: 1, 
    //                         borderColor: BaseColor.textSecondaryColor,
    //                         borderRadius: 10,
    //                         marginBottom:10,
    //                         }}
    //                     >
    //                             <CardCustomProfile 
    //                                 title={'E-Ticket Departure'}
    //                                 subtitle={'Check tiket keberangkatan Anda'}
    //                                 icon={'tag'}
    //                                 onPress={() => {
    //                                     this.props.navigation.navigate("Eticket",{order_id_aero:order_id_aero,dataFlight:dataDeparture,type:'Departure'});
    //                                 }}

    //                             />
    //                         {content_returns}
    //                     </View>
    //     }

    //     return(
    //         <View>
    //                 {content}
    //         </View>
    //     )
    // }





    renderItemFeaturedDestination(item) {
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
                    navigation.navigate("Hotel", { id_city: item.id_city })
                }
                loading={this.state.loading_dashboard}
                propOther={{ inFrame: false, horizontal: true, width: wp("40%") }}
            />
        );
    }



    renderItemRoomPromo(item) {
        const { navigation } = this.props;
        const priceSplitter = (number) => (number && number.toString().replace(/\B(?=(\d{3})+(?!\d))/g, '.'));
        return (
            <CardCustom
                propImage={{ height: wp("40%"), url: item.img_featured_url }}
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
            />
        );
    }



    renderItemBuyNowStayLater(item) {
        const { navigation } = this.props;
        const priceSplitter = (number) => (number && number.toString().replace(/\B(?=(\d{3})+(?!\d))/g, '.'));
        return (
            <CardCustom
                propImage={{ height: wp("40%"), url: item.img_featured_url }}
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
            />
        );
    }

    renderItemEvent(item) {
        const { navigation } = this.props;
        const priceSplitter = (number) => (number && number.toString().replace(/\B(?=(\d{3})+(?!\d))/g, '.'));
        return (
            <CardCustom
                propImage={{ height: wp("40%"), url: item.img_featured_url }}
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
            />
        );

    }

    renderItemPaketTrip(item) {
        const { navigation } = this.props;
        const priceSplitter = (number) => (number && number.toString().replace(/\B(?=(\d{3})+(?!\d))/g, '.'));
        return (
            <CardCustom
                propImage={{ height: hp("20%"), url: item.img_featured_url }}
                propInframe={{ top: item.product_place, bottom: item.product_time }}
                propTitle={{ text: item.product_name }}
                propDesc={{ text: '' }}
                propPrice={{ price: priceSplitter(item.product_price), startFrom: true }}
                propPriceCoret={{ price: '', discount: priceSplitter(item.product_discount), discountView: true }}

                propStar={{ rating: 10, enabled: false }}
                propLeftRight={{ left: '', right: '' }}
                onPress={() =>
                    navigation.navigate("TourDetailCustom", { product: item })
                }
                loading={this.state.loading_dashboard}
                propOther={{ inFrame: true, horizontal: true, width: wp("40%") }}
                propIsCampaign={item.product_is_campaign}
                propPoint={item.product_point}
            />
        );

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

    componentDidMount() {
        const { navigation } = this.props;
        //this.setState({ loading_spinner: true });
        navigation.addListener('willFocus', () => {
            // this.setState({ loading_spinner: true });
            // this.setState({ loading_evoucher: true });
            setTimeout(() => {
                this.getData();
                //this.getCheckCancel();
            }, 50);
        });
    }

    getCheckCancel() {
        const { id_order, id_user } = this.state;
        let config = this.state.configApi;
        let baseUrl = config.baseUrl;
        let url = baseUrl + 'api/hotel/Hotelinx/getBookingDetail/app';
        console.log('configApi', JSON.stringify(config));
        console.log('urlssgetCheckCancel', url, id_order);

        this.setState({ loadCancel: true }, () => {

            var myHeaders = new Headers();
            myHeaders.append("Cookie", "ci_session=n8pbg26jcb13lnqi40e99gek5sujs8he");

            var formdata = new FormData();
            formdata.append("param", id_order);

            var requestOptions = {
                method: 'POST',
                headers: myHeaders,
                body: formdata,
                redirect: 'follow'
            };

            fetch(url, requestOptions)
                .then(response => response.json())
                .then(result => {
                    console.log('resultgetCheckCancel', JSON.stringify(result));
                    var cancelPrice = result.informasiPembatalan[0].CancellationPrice;
                    if (cancelPrice != 0) {
                        var enableCancel = false;

                    } else {
                        var enableCancel = true;
                        this.setState({ loadCancel: false });
                        this.setState({ enableCancel: true })

                    }
                    console.log('getCheckCancel', JSON.stringify(result));
                    console.log('enableCancel', JSON.stringify(enableCancel));
                })
                .catch(error => {
                    console.log(JSON.stringify(error));
                    //alert('Kegagalan Respon Server getCheckCancel');
                });
        });
    }

    getCodeHotelLinx(id) {

        let config = this.state.configApi;
        let baseUrl = config.baseUrl;
        let url = baseUrl + 'front/product/hotel/getCodeHL';
        console.log('configApi', JSON.stringify(config));
        console.log('urlss', url);


        var myHeaders = new Headers();
        myHeaders.append("Cookie", "ci_session=ilba585ua0c2rl442pmjs1osqdpmm5re");

        var formdata = new FormData();
        formdata.append("id", id);

        var requestOptions = {
            method: 'POST',
            headers: myHeaders,
            body: formdata,
            redirect: 'follow'
        };

        fetch(url, requestOptions)
            .then(response => response.json())
            .then(result => {
                console.log('resultCodeHotelLinx', JSON.stringify(result));

            })
            .catch(error => {
                console.log(JSON.stringify(error));
                alert('Kegagalan Respon Server getCodeHotelLinx');
            });

    }



    getData() {
        const { id_order, id_user } = this.state;

        let config = this.state.configApi;
        let baseUrl = config.baseUrl;
        let url = baseUrl + "front/api_new/order/get_booking_history";
        console.log('configApi', JSON.stringify(config));
        console.log('urlss', url);


        //var url=config.baseUrl;
        // path=config.user_order.dir;

        var data = { "id": id_user, "id_order": id_order, "id_order_status": "", "product": "" }
        var parameter = { "param": data }

        var body = parameter;
        console.log("paramgetbook", JSON.stringify(body));
        this.setState({ loading_spinner: true }, () => {
            var param = {
                method: 'POST',
                headers: {
                    Accept: 'application/json',
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(body),
            }


            fetch(url, param)
                .then(response => response.json())
                .then(result => {
                    console.log('resultPembayaran', JSON.stringify(result));
                    var dataBooking = result;



                    this.setState({ dataBooking: dataBooking });
                    //this.cekStatusMidtrans(dataBooking[0].order_payment_recent.id_invoice,false);
                    var order_status = dataBooking[0].order_status.order_status_slug;
                    var product = dataBooking[0].product;
                    //alert(dataBooking[0]['total_price']);
                    this.setState({ loading_spinner: false });
                    this.getPaymentMethod(dataBooking[0]['total_price']);
                    if (product == 'Flight') {

                        if (order_status == 'complete') {
                            var order_code = dataBooking[0].aero_orderid;
                            this.bookingDoc(product.toLowerCase(), id_order);
                        }

                        //this.checkBooking(order_code);
                    } else {

                        this.setState({ loading_evoucher: false });
                    }

                })
                .catch(error => {
                    console.log(JSON.stringify(error));
                    alert('Kegagalan Respon Server fetch');
                });


        });
    }

    bookingDoc(product, id_order) {
        let dataBooking = this.state.dataBooking;
        console.log('dataBooking', JSON.stringify(dataBooking));
        let config = this.state.configApi;
        let baseUrl = config.apiBaseUrl;
        let url = baseUrl + 'booking/detail';
        console.log('configApi', JSON.stringify(config));
        console.log('urlss', url);


        var myHeaders = new Headers();
        myHeaders.append("Content-Type", "application/json");
        myHeaders.append("Cookie", "access_token=" + config.apiToken);

        var raw = JSON.stringify({
            "product": product,
            "key": id_order
        });

        var requestOptions = {
            method: 'POST',
            headers: myHeaders,
            body: raw,
            redirect: 'follow'
        };

        fetch(url, requestOptions)
            .then(response => response.json())
            .then(result => {
                console.log('createPdf', JSON.stringify(result));
                this.setState({ bookingDoc: result.data.doc });

            })
            .catch(error => console.log('error', error));
    }




    render() {
        const { navigation } = this.props;
        const { id_order, loading_spinner } = this.state;
        const priceSplitter = (number) => (number && number.toString().replace(/\B(?=(\d{3})+(?!\d))/g, '.'));


        var type = '';
        if (this.state.dataBooking[0].product == 'Trip') {
            type = 'trip';
        } else if (this.state.dataBooking[0].product == 'Flight') {
            type = 'flight';
        } else if (this.state.dataBooking[0].product == 'Hotel') {
            type = 'hotelLinx';
        } else if (this.state.dataBooking[0].product == 'Hotelpackage') {
            type = 'hotelpackage';
        } else if (this.state.dataBooking[0].product == 'Activities') {
            type = 'activities';
        }
        var param = {
            type: type
        }

        return (
            <SafeAreaView
                style={[BaseStyle.safeAreaView, { backgroundColor: BaseColor.bgColor }]}
                forceInset={{ top: "always" }}
            >
                <Header
                    title="Pembayaran"
                    subTitle={'No.Order :' + this.state.dataBooking[0].order_code}
                    renderLeft={() => {
                        return (
                            <Icon
                                name="md-arrow-back"
                                size={20}
                                color={BaseColor.whiteColor}
                            />
                        );
                    }}
                    renderRight={() => {
                        return (
                            <Icon
                                name="reload-outline"
                                size={20}
                                color={BaseColor.whiteColor}
                            />

                        );
                    }}

                    renderRightSecond={() => {
                        return (
                            <Icon
                                name="home"
                                size={20}
                                color={BaseColor.whiteColor}
                            />

                        );
                    }}

                    onPressLeft={() => {
                        navigation.navigate('Booking');
                    }}

                    onPressRight={() => {
                        var redirect = 'Pembayaran';
                        var param = {
                            id_order: this.state.id_order,
                            dataPayment: {},
                        }
                        navigation.navigate("Loading", { redirect: redirect, param: param });
                    }}

                    onPressRightSecond={() => {
                        var redirect = 'Home';
                        var param = {};
                        navigation.navigate("Loading", { redirect: redirect, param: param });
                    }}
                />
                {
                    loading_spinner ?

                        <View style={{ flex: 1, backgroundColor: "#FFFFFF", justifyContent: "center", alignItems: "center" }}>
                            <View
                                style={{
                                    position: "absolute",
                                    top: 220,
                                    left: 0,
                                    right: 0,
                                    bottom: 0,
                                    justifyContent: "center",
                                    alignItems: "center"
                                }}
                            >

                                <AnimatedLoader
                                    visible={true}
                                    overlayColor="rgba(255,255,255,0.1)"
                                    source={require("app/assets/loader_payment.json")}
                                    animationStyle={{ width: 250, height: 250 }}
                                    speed={1}
                                />
                                <Text>
                                    Prepare Payment
                                    </Text>
                            </View>
                        </View>
                        :

                        <ScrollView>
                            <View style={{}}>
                                {this.content_payment()}
                                {this.content_eticket()}
                                {/* {this.content_booking_code()} */}

                                {
                                    this.state.loading_spinner == false ?

                                        <PreviewBooking
                                            dataDetail={this.state.dataBooking[0]}
                                            param={param}
                                            config={this.state.config}
                                            dataBookingAero={this.state.dataBookingAero}
                                        />
                                        :
                                        <View />
                                }


                                {this.content_bank()}

                            </View>

                        </ScrollView>
                }
                <View>
                    {/* <Dialog.Container>
                <Dialog.Title>Account delete</Dialog.Title>
                <Dialog.Description>
                    Do you want to delete this account? You cannot undo this action.
                </Dialog.Description>
                <Dialog.Button label="Cancel" onPress={this.processCancel(this.state.id_order)} />
                <Dialog.Button label="Delete" onPress={this.setState({modalVisibleCancel:false})} />
                </Dialog.Container> */}
                    <Modal
                        isVisible={this.state.modalVisibleCancel}
                        onBackdropPress={() => {
                            this.setState({ modalVisibleCancel: false });
                        }}
                        onSwipeComplete={() => {
                            this.setState({ modalVisibleCancel: false });
                        }}
                        swipeDirection={["down"]}
                        style={styles.bottomModal}
                    >
                        <View style={[styles.contentFilterBottom, { paddingBottom: 20 }]}>

                            <View style={styles.contentSwipeDown}>
                                <View style={styles.lineSwipeDown} />
                            </View>
                            <TextInput
                                style={[BaseStyle.textInput, { height: 100 }]}
                                onChangeText={text => {
                                    this.setState({ reason: text });
                                }}
                                autoCorrect={false}
                                multiline={true}
                                numberOfLines={5}
                                placeholder="Ketikkan Alasan Pembatalan"
                                placeholderTextColor={BaseColor.grayColor}
                                selectionColor={BaseColor.primaryColor}
                            />
                            <View style={{ flexDirection: "row", paddingTop: 5 }}>

                                <View style={{ flex: 5, justifyContent: "center", alignItems: "flex-start" }}>
                                    <Button
                                        style={{ borderRadius: 0, marginVertical: 0 }}
                                        full
                                        //loading={loading}
                                        onPress={() => {
                                            Alert.alert(
                                                'Confirm',
                                                'Yakin ingin dibatalkan ?',
                                                [
                                                    { text: 'NO', onPress: () => console.warn('NO Pressed'), style: 'cancel' },
                                                    { text: 'YES', onPress: () => { this.processCancel() } },
                                                ]
                                            );

                                        }}
                                    >
                                        Lanjut Batalkan
                                        </Button>
                                </View>
                                <View style={{ flex: 5, justifyContent: "center", alignItems: "flex-start" }}>
                                    <Button
                                        style={{ borderRadius: 0, marginVertical: 0, backgroundColor: BaseColor.primaryColor }}
                                        full
                                        //loading={loading}
                                        onPress={() => {


                                        }}
                                    >

                                        <Text style={{ color: BaseColor.whiteColor }}>Tutup</Text>
                                    </Button>
                                </View>
                            </View>



                        </View>
                    </Modal>
                </View>
                <DropdownAlert ref={ref => this.dropdown = ref} messageNumOfLines={10} closeInterval={1000} />

            </SafeAreaView>
        );
    }
}




const styles = StyleSheet.create({
    containField: {
        margin: 20,
        marginTop: 90,
        flexDirection: "row",
        height: 140,
        backgroundColor: BaseColor.fieldColor,
        borderRadius: 10
    },
    contentLeftItem: {
        flex: 1,
        padding: 20,
        alignItems: "center"
    },
    tagFollow: { width: 150, margin: 10 },
    tabbar: {
        backgroundColor: "white",
        height: 40
    },
    tab: {
        width: Utils.getWidthDevice() / 3
    },
    indicator: {
        backgroundColor: BaseColor.primaryColor,
        height: 1
    },
    label: {
        fontWeight: "400"
    },
    containProfileItem: {
        paddingLeft: 20,
        paddingRight: 20
    },
    profileItem: {
        flexDirection: "row",
        justifyContent: "space-between",
        alignItems: "center",
        borderBottomColor: BaseColor.textSecondaryColor,
        borderBottomWidth: 1,
        paddingBottom: 20,
        paddingTop: 20
    },


    contentForm: {
        padding: 10,
        borderRadius: 8,
        width: "100%",
        //backgroundColor: BaseColor.fieldColor
        borderRadius: 8,
        borderWidth: 3,
        borderColor: BaseColor.fieldColor,
    },
    bottomModal: {
        justifyContent: "flex-end",
        margin: 0
    },
    contentFilterBottom: {
        width: "100%",
        borderTopLeftRadius: 8,
        borderTopRightRadius: 8,
        paddingHorizontal: 20,
        backgroundColor: BaseColor.whiteColor
    },
    contentSwipeDown: {
        paddingTop: 10,
        alignItems: "center"
    },
    lineSwipeDown: {
        width: 30,
        height: 2.5,
        backgroundColor: BaseColor.dividerColor
    },
    contentActionModalBottom: {
        flexDirection: "row",
        paddingVertical: 10,
        marginBottom: 10,
        justifyContent: "space-between",
        borderBottomColor: BaseColor.textSecondaryColor,
        borderBottomWidth: 1
    },
    blockView: {
        paddingVertical: 10,
        paddingHorizontal: 20,
        borderBottomColor: BaseColor.textSecondaryColor,
        borderBottomWidth: 1,
        backgroundColor: BaseColor.whiteColor,

        borderBottomColor: BaseColor.textSecondaryColor,
        borderBottomWidth: 1,
        backgroundColor: "#fff",
        shadowColor: "#000",
        shadowOffset: {
            width: 0,
            height: 2,
        },
        shadowOpacity: 0.25,
        shadowRadius: 3.84,
        // padding:20,
        marginBottom: 10
    }
});
