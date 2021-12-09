import React, { Component, useEffect, useState } from "react";
import { View, ScrollView, Animated, Dimensions, ActivityIndicator, TouchableOpacity, StyleSheet, AsyncStorage, Alert, Clipboard } from "react-native";
import { BaseStyle, BaseColor, Images } from "@config";
import {
    Header,
    SafeAreaView,
    Icon,
    Text,
    ProfileAuthor,
    ProfileGroup,
    Card,
    PostListItem,
    Button
} from "@components";
import * as Utils from "@utils";
// import styles from "./styles";
import { DataPayment, DataBooking, DataConfig } from "@data";
import HTML from 'react-native-render-html';
import { WebView } from 'react-native-webview';
import { PostData } from '../../services/PostData';
import AnimatedLoader from "react-native-animated-loader";
import CountDown from 'react-native-countdown-component';
import moment from 'moment';
import { PostDataNew } from '../../services/PostDataNew';

// import {fcmService} from '../../src/FCMService';
// import {localNotificationService} from '../../src/LocalNotificationService';
import { DataMasterDiskon } from "@data";
// import Clipboard from "@react-native-community/clipboard";
import { Form, TextValidator } from 'react-native-validator-form';
import { Base64 } from 'js-base64';
import Modal from "react-native-modal";


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
    contentButtonBottom: {
        // borderTopColor: BaseColor.textSecondaryColor,
        // borderTopWidth: 1,
        //paddingVertical: 10,
        // paddingHorizontal: 20,
        flexDirection: "row",
        justifyContent: "space-between",
        alignItems: "center"
    },
    contentProfile: {
        // marginTop: 15,
        flexDirection: "row",
        // backgroundColor: BaseColor.fieldColor,
        marginBottom: 15,
        width: '100%',
    },
});


export default function PembayaranDetail(props) {

    var param = props.navigation.state.params.param;
    // var id_order=param.id_order;
    // var dataPayment=param.dataPayment;

    const { navigation } = props;
    const [params, setParam] = useState(param);
    const [dataPayment, setDataPayment] = useState(param.dataPayment);
    const [idOrder, setIdOrder] = useState(param.id_order);
    const [count, setCount] = useState(0);
    //const [tokenFirebase, setTokenFirebase]= useState(0);
    const [loading, setLoading] = useState(true);
    const [dataBooking, setDataBooking] = useState(DataBooking);
    const [statusMidtrans, setStatusMidtrans] = useState({ "va_numbers": [{ "bank": "bca", "va_number": "81174157163" }], "payment_amounts": [], "transaction_time": "2020-07-06 16:33:07", "gross_amount": "740800.00", "currency": "IDR", "order_id": "MD2007060026", "payment_type": "bank_transfer", "signature_key": "7eb271c8362f64dd96c7519a7067ccb5d8f563ee45e7c64e4606773332aad32841e522fcdfb30dae96c183d57a044db425f07a3772a3e4d848ccbb1d65765884", "status_code": "201", "transaction_id": "1df337f3-5dc2-4cc7-a445-ae8c46eabefa", "transaction_status": "pending", "fraud_status": "accept", "status_message": "Success, transaction is found", "merchant_id": "G042781174" });
    const [fee, setFee] = useState(0);
    const [totalPembayaran, setTotalPembayaran] = useState(0);

    const [cardNumber, setCardNumber] = useState('4811 1111 1111 1114');
    const [cardExpMonth, setCardExpMonth] = useState('01');
    const [cardExpYear, setCardExpYear] = useState('2025');
    const [cardCVV, setCardCVV] = useState('123');
    const [cardToken, setCardToken] = useState(0);


    const [colorButton, setColorButton] = useState(BaseColor.greyColor);
    const [colorButtonText, setColorButtonText] = useState(BaseColor.whiteColor);
    const [disabledButton, setDisabledButton] = useState(true);
    const [dataMasterDiskon, setDataMasterDiskon] = useState(DataMasterDiskon[0]);

    const [modalVisible, setModalVisible] = useState(false);
    const [modalTitle, setModalTitle] = useState('');
    const [modalTitleSub, setModalTitleSub] = useState('');
    const [modalStatus, setModalStatus] = useState('none');
    const [statusPembayaran, setStatusPembayaran] = useState('');



    //console.log('dataBookingBro',JSON.stringify(dataBooking));

    const [config, setConfig] = useState(DataConfig);


    function validation() {
        if (
            cardNumber != '' &&
            cardExpMonth != '' &&
            cardExpYear != '' &&
            cardCVV != ''
        ) {
            ////console.log('perfect');
            setColorButton(BaseColor.secondColor);
            setColorButtonText(BaseColor.primaryColor);
            setDisabledButton(false);
        } else {
            ////console.log('not yet');
            setColorButton(BaseColor.greyColor);
            setColorButtonText(BaseColor.whiteColor);
            setDisabledButton(true);
        }
    }

    function getConfig() {
        AsyncStorage.getItem('config', (error, result) => {
            if (result) {
                let config = JSON.parse(result);
                //console.log('getConfigDetailPayment',JSON.stringify(config));
                setConfig(config);
            }
        });

    }

    function submitBayar() {
        var payment_type = dataPayment.payment_type;
        setLoading(true);
        tokenMidtransUpdate();
    }



    function tokenMidtransUpdate() {
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

        var paramPay = {
            transaction_details: transaction_details,
            customer_details: customer_details,
            enabled_payments
        }

        var param = {
            method: 'POST',
            headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/json',
                'Authorization': 'Basic ' + authBasicHeader,
            },
            body: JSON.stringify(paramPay),
        }
        console.log('param', JSON.stringify(param));
        console.log('paramPay', JSON.stringify(paramPay));

        var url = config.midtransUrlToken;
        console.log('url', url);

        return PostDataNew(url, '', param)
            .then((result) => {
                console.log(JSON.stringify(result));
                var paramPayMD = {
                    "total_pembayaran": totalPembayaran,
                    "fee": fee,
                    "id_invoice": dataBooking[0].order_payment_recent.id_invoice,
                    "dataPayment": dataPayment,
                    "token": result.token,
                    "order_code": dataBooking[0].order_code,
                    "id_order": idOrder
                }

                console.log('snapTokenUpdate', JSON.stringify(paramPayMD));

                snapTokenUpdate(paramPayMD);
            })
            .catch((error) => {
                console.log(JSON.stringify(error));
                alert('Kegagalan Respon Server');
            });
    }


    function snapTokenUpdate(paramPayMD) {
        var param = {
            method: 'POST',
            headers: {
                Accept: 'application/json',
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(paramPayMD),
        }



        var url = config.baseUrl;

        return PostDataNew(url, 'front/api_new/OrderSubmit/snap_token_update', param)
            .then((result) => {
                console.log('snapTokenUpdate', JSON.stringify(result));
                var id_invoice = result.id_invoice;
                var token = result.token;
                var dataSendMidTrans = {
                    id_invoice: id_invoice,
                    token: token
                }

                setTimeout(() => {
                    fetch();

                }, 50);
                setLoading(false);
            },
                (error) => {
                    console.log(JSON.stringify(error));
                    alert('Kegagalan Respon Server');
                }
            );
    }



    function submitChange() {

        setLoading(true);
        new_invoice();
        //tokenMidtransNew();
    }

    // function tokenMidtransNew(){
    //     var authBasicHeader=config.midtransKey.authBasicHeader;

    //     var payment_type=dataPayment.payment_type;
    //     var payment_sub=dataPayment.payment_sub;

    //     var transaction_details={
    //         gross_amount: totalPembayaran,
    //         order_id: dataBooking[0].order_payment_recent.id_invoice
    //     }
    //     var customer_details={
    //         email: dataBooking[0].contact.contact_email,
    //         first_name: dataBooking[0].contact.contact_first,
    //         last_name: dataBooking[0].contact.contact_last,
    //         phone: dataBooking[0].contact.contact_phone,
    //     }

    //     var enabled_payments=[payment_sub];

    //     var paramPay={
    //         transaction_details: transaction_details,
    //         customer_details: customer_details,
    //         enabled_payments
    //     }

    //     var param={
    //         method: 'POST',
    //         headers: {
    //           'Accept': 'application/json',
    //           'Content-Type': 'application/json',
    //           'Authorization': 'Basic '+authBasicHeader,
    //         },
    //         body: JSON.stringify(paramPay),
    //       }
    //       console.log('param',JSON.stringify(param));
    //       console.log('paramPay',JSON.stringify(paramPay));

    //      var url=config.midtransUrlToken;
    //      console.log('url',url);

    //      return PostDataNew(url,'',param)
    //          .then((result) => {
    //             console.log('change_payment',JSON.stringify(result));
    //             var paramPayMD={
    //                 "total_pembayaran":totalPembayaran,
    //                 "fee":fee,
    //                 "id_invoice":dataBooking[0].order_payment_recent.id_invoice,
    //                 "dataPayment":dataPayment,
    //                 "token":result.token,
    //                 "order_code":dataBooking[0].order_code,
    //                 "id_order":idOrder
    //                 }

    //             snapTokenNew(paramPayMD);
    //             },
    //          (error) => {
    //             console.log(JSON.stringify(error));
    //             alert('Kegagalan Respon Server');
    //          }
    //         ); 

    // }

    function new_invoice() {
        setLoading(true);

        var paramPayMD = {
            "id_invoice": dataBooking[0].order_payment_recent.id_invoice,
            "id_order": idOrder,
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

        return PostDataNew(url, 'front/api_new/OrderSubmit/new_invoice', param)
            .then((result) => {
                setLoading(false);
                console.log('new_invoice', JSON.stringify(result));
                var id_invoice = result.id_invoice;
                var param = {
                    id_order: idOrder,
                    dataPayment: {},
                }
                //navigation.navigate("Pembayaran",{param:param});
                //navigation.navigate("Pembayaran",{param:param});
                navigation.navigate("Loading", { redirect: 'Pembayaran', param: param });

            })
            .catch((error) => {
                console.log(JSON.stringify(error));
                alert('Kegagalan Respon Server');
            });


    }


    // function changePayment(){
    //     var item=dataBooking[0];
    //     var order_payment_recent=item.order_payment_recent;
    //     var totalPembayaran=parseInt(order_payment_recent.iv_total_amount)-parseInt(fee);


    //     var paramPayMD={
    //         "total_pembayaran":totalPembayaran,
    //         "fee":0,
    //         "id_invoice":dataBooking[0].order_payment_recent.id_invoice,
    //         "dataPayment": {
    //             "payment_type": "",
    //             "payment_type_label": "",
    //             "payment_sub": "",
    //             "payment_sub_label": ""
    //         },
    //         "token":"",
    //         "order_code":dataBooking[0].order_code
    //         }


    //     setLoading(true);
    //         var param={
    //             method: 'POST',
    //             headers: {
    //               Accept: 'application/json',
    //               'Content-Type': 'application/json',
    //             },
    //             body: JSON.stringify(paramPayMD),
    //           }

    //          var url=config.baseUrl;

    //          return PostDataNew(url,'front/api_new/OrderSubmit/snap_token_update',param)
    //              .then((result) => {
    //                     var id_invoice=result.id_invoice;
    //                     cancelMidtrans(id_invoice);
    //              },
    //              (error) => {
    //                  this.setState({ error });
    //              }
    //         ); 
    // }

    function cancelMidtrans(id_invoice) {
        var order_code = id_invoice;

        var param = {
            method: 'POST',
            headers: {
                Accept: 'application/json',
                'Content-Type': 'application/json',
                'Authorization': 'Basic ' + config.midtransKey.authBasicHeader,
            },
            redirect: 'follow'
        }

        var url = config.midtransUrl;

        return PostDataNew(url, "v2/" + order_code + "/cancel", param)
            .then((result) => {
                //console.log('cancelMidtrans',JSON.stringify(result));
                setLoading(false);
                var redirect = 'Pembayaran';
                var param = {
                    id_order: idOrder,
                    dataPayment: {}
                }
                //setLoading(false);
                navigation.navigate("Pembayaran", { redirect: redirect, param: param });
                //navigation.navigate("Redirect",{redirect:redirect,param:param});
            })
            .catch((error) => {
                console.log(JSON.stringify(error));
                alert('Kegagalan Respon Server');
            });



    }


    function fetch() {
        AsyncStorage.getItem('userSession', (error, result) => {
            if (result) {
                AsyncStorage.getItem('config', (error, resultx) => {
                    if (resultx) {
                        let userSession = JSON.parse(result);
                        let config = JSON.parse(resultx);

                        var id_user = userSession.id_user;
                        var url = config.baseUrl;
                        var path = config.user_order.dir;

                        var data = { "id": id_user, "id_order": idOrder, "id_order_status": "", "product": "" }
                        var parameter = { "param": data }

                        var body = parameter;
                        //console.log('bodyparamter',JSON.stringify(body));

                        var param = {
                            method: 'POST',
                            headers: {
                                Accept: 'application/json',
                                'Content-Type': 'application/json',
                            },
                            body: JSON.stringify(body),
                        }
                        console.log('url,path,param', url, path, JSON.stringify(param))
                        return PostDataNew(url, path, param)
                            .then((result) => {
                                var dataBooking = result;
                                console.log("---------------get_booking_detail ------------");
                                console.log(JSON.stringify(result));
                                setLoading(false);
                                setDataBooking(dataBooking);
                                var order_payment_recent = dataBooking[0].order_payment_recent;
                                var order_payment_num = dataBooking[0].order_payment_num;
                                if (order_payment_recent != null) {
                                    var id_invoice = order_payment_recent.id_invoice;
                                    if (order_payment_recent.payment_type == "" || order_payment_recent.payment_type == "user") {
                                        var payment_type = dataPayment.payment_type;
                                        var payment_sub = dataPayment.payment_sub;
                                    } else {
                                        var payment_type = order_payment_recent.payment_type;
                                        var payment_sub = order_payment_recent.payment_sub;
                                    }

                                    var fee = config.transaction_fee;
                                    var totalPembayaran = parseInt(order_payment_recent.iv_amount) + parseInt(fee);
                                    setFee(fee);
                                    setTotalPembayaran(totalPembayaran);

                                    // setTimeout(() => {
                                    //     tokenMidtransUpdate();
                                    // }, 50);

                                }

                            })
                            .catch((error) => {
                                console.log(JSON.stringify(error));
                                alert('Kegagalan Respon Server');
                            });



                    }
                });
            }
        });


    }

    function cekStatusMidtrans() {
        var id_invoice = dataBooking[0].order_payment_recent.id_invoice;

        var param = {
            method: 'GET',
            headers: {
                Accept: 'application/json',
                'Content-Type': 'application/json',
                'Authorization': 'Basic ' + config.midtransKey.authBasicHeader,
            },
            redirect: 'follow'
        }

        var url = config.midtransUrl;

        return PostDataNew(url, "v2/" + id_invoice + "/status", param)
            .then((result) => {
                var status = result;

                if (status.status_code == '404') {
                    setModalVisible(true);
                    setModalTitle('Status Pembayaran');
                    setModalTitleSub('Pembayaran belum dilakukan');
                    setModalStatus('none');
                    setStatusPembayaran('none');

                } else {
                    if (status.transaction_status == 'settlement') {
                        setModalVisible(true);
                        setModalTitle('Status Pembayaran');
                        setModalTitleSub('Pembayaran berhasil dilakukan');
                        setModalStatus(status.transaction_status);
                        setStatusPembayaran(status.transaction_status);

                    } else if (status.transaction_status == 'pending') {
                        setModalVisible(true);
                        setModalTitle('Status Pembayaran');
                        setModalTitleSub('Menunggu pembayaran');
                        setModalStatus(status.transaction_status);
                        setStatusPembayaran(status.transaction_status);


                    }


                }
                console.log('status_midtransasd', JSON.stringify(result));
                //setStatusMidtrans(statusMidtrans);

            },
                (error) => {
                    console.log(JSON.stringify(error));
                    alert('Kegagalan Respon Server');
                }
            );


    }

    function duration(expirydate) {

        var date = moment()
        var diffr = moment.duration(moment(expirydate).diff(moment(date)));
        var hours = parseInt(diffr.asHours());
        var minutes = parseInt(diffr.minutes());
        var seconds = parseInt(diffr.seconds());
        var d = hours * 60 * 60 + minutes * 60 + seconds;
        return d;

    }

    function content_countdown() {
        var item = dataBooking[0];
        var order_payment_recent = item.order_payment_recent;
        var countDown = <View></View>;

        if (order_payment_recent != null) {
            var expiredTime = duration(order_payment_recent.expired);
            if (expiredTime > 0) {
                countDown = <View style={{
                    borderWidth: 1,
                    borderColor: BaseColor.textSecondaryColor,
                    borderRadius: 10,
                    marginBottom: 10,
                    padding: 10
                }}>

                    <View style={{ flexDirection: 'row', paddingLeft: 20, paddingRight: 20, paddingTop: 5, paddingBottom: 5 }} >
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

    function content_payment() {
        const priceSplitter = (number) => (number && number.toString().replace(/\B(?=(\d{3})+(?!\d))/g, '.'));
        var order_payment_num = dataBooking[0].order_payment_num;
        var order_payment_recent = dataBooking[0].order_payment_recent;
        var content = <View></View>;
        var virtual_account = '';

        if (order_payment_recent != null) {
            content = <View>
                <View style={{
                    borderWidth: 1,
                    borderColor: BaseColor.textSecondaryColor,
                    borderRadius: 10,
                    marginBottom: 10,
                    padding: 10
                }}>

                    <View style={{ flexDirection: 'row', paddingLeft: 20, paddingRight: 20, paddingTop: 5, paddingBottom: 5 }} >
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
                    <View style={{ flexDirection: 'row', paddingLeft: 20, paddingRight: 20, paddingTop: 5, paddingBottom: 5 }} >
                        <View style={{ flexDirection: 'row', flex: 10, justifyContent: "flex-start", alignItems: "center" }}>
                            <View style={{ flex: 5, flexDirection: "row", justifyContent: "flex-start", alignItems: "center" }}>
                                <View>
                                    <Text>
                                        Sub Total
                                                            </Text>

                                </View>
                            </View>
                            <View style={{ flex: 5, justifyContent: "center", alignItems: "flex-end" }}>
                                <Text semibold numberOfLines={1}>
                                    {'IDR ' + priceSplitter(order_payment_recent.iv_amount)}
                                </Text>
                            </View>
                        </View>
                    </View>

                    <View style={{ flexDirection: 'row', paddingLeft: 20, paddingRight: 20, paddingTop: 5, paddingBottom: 5 }} >
                        <View style={{ flexDirection: 'row', flex: 10, justifyContent: "flex-start", alignItems: "center", borderBottomWidth: 1, borderBottomColor: BaseColor.textSecondaryColor, borderBottomStyle: 'solid', paddingBottom: 10 }}>
                            <View style={{ flex: 5, flexDirection: "row", justifyContent: "flex-start", alignItems: "center" }}>
                                <View>
                                    <Text>
                                        Fee
                                                            </Text>

                                </View>
                            </View>
                            <View style={{ flex: 5, justifyContent: "center", alignItems: "flex-end" }}>
                                <Text semibold numberOfLines={1}>
                                    {'IDR ' + priceSplitter(fee)}
                                </Text>
                            </View>
                        </View>
                    </View>

                    <View style={{ flexDirection: 'row', paddingLeft: 20, paddingRight: 20, paddingTop: 5, paddingBottom: 5 }} >
                        <View style={{ flexDirection: 'row', flex: 10, justifyContent: "flex-start", alignItems: "center" }}>
                            <View style={{ flex: 5, flexDirection: "row", justifyContent: "flex-start", alignItems: "center" }}>
                                <View>
                                    <Text>
                                        Total Pembayaran
                                                            </Text>

                                </View>
                            </View>
                            <View style={{ flex: 5, justifyContent: "center", alignItems: "flex-end" }}>
                                <Text semibold numberOfLines={1}>
                                    {'IDR ' + priceSplitter(totalPembayaran)}
                                </Text>
                            </View>
                        </View>
                    </View>
                </View>
            </View>


        }



        return (
            <View>
                {content}
            </View>
        )
    }

    function content_payment_form() {
        const priceSplitter = (number) => (number && number.toString().replace(/\B(?=(\d{3})+(?!\d))/g, '.'));

        var order_payment_recent = dataBooking[0].order_payment_recent;
        var content = <View></View>;

        if (order_payment_recent != null) {
            var cardNumberForm = <View style={{ marginBottom: 10 }}>
                <TouchableOpacity
                    style={{ width: '100%' }}
                >
                    <View style={styles.contentProfile}>
                        <View style={{ flex: 6 }}>
                            <TextValidator
                                name="cardNumber"
                                label="cardNumber"
                                validators={['required']}
                                errorMessages={['This field is required']}
                                placeholder="e.g., 4811 1111 1111 1114"
                                type="text"
                                // keyboardType="email-address"
                                value={cardNumber}
                                onChangeText={(cardNumber) => {
                                    setCardNumber(cardNumber);
                                    setTimeout(() => {
                                        validation();
                                    }, 50);
                                }}


                            />
                        </View>

                    </View>
                </TouchableOpacity>

                <Text caption2 style={{ marginTop: -15, color: BaseColor.primaryColor }}>
                    Card Number
                                        </Text>

            </View>


            var cardExpired = <View style={{ marginBottom: 10 }}>
                <View style={{ flexDirection: "row" }}>
                    <View style={{ flex: 6, marginRight: 15 }}>
                        <TouchableOpacity
                            style={{ width: '100%', flexDirection: "row" }}
                        >
                            <View style={styles.contentProfile}>
                                <View style={{ flex: 6 }}>
                                    <TextValidator
                                        name="firstname"
                                        label="lastname"
                                        validators={['required']}
                                        errorMessages={['This field is required']}
                                        placeholder="e.g., 01"
                                        type="text"
                                        value={cardExpMonth}
                                        onChangeText={(cardExpMonth) => {
                                            setCardExpMonth(cardExpMonth);
                                            setTimeout(() => {
                                                validation();
                                            }, 50);

                                        }}
                                    />
                                </View>
                            </View>
                        </TouchableOpacity>
                        <Text caption2 style={{ marginTop: -20, color: BaseColor.primaryColor }}>
                            Month Expired
                                    </Text>
                    </View>

                    <View style={{ flex: 6 }}>

                        <TouchableOpacity
                            style={{ width: '100%', flexDirection: "row" }}
                        >
                            <View style={styles.contentProfile}>
                                <View style={{ flex: 6 }}>
                                    <TextValidator
                                        name="lastname"
                                        label="lastname"
                                        validators={['required']}
                                        errorMessages={['This field is required']}
                                        placeholder="e.g., 2025"
                                        type="text"
                                        value={cardExpYear}
                                        onChangeText={(cardExpYear) => {
                                            setCardExpYear(cardExpYear);
                                            setTimeout(() => {
                                                validation();
                                            }, 50);
                                        }}
                                    />
                                </View>
                            </View>
                        </TouchableOpacity>
                        <Text caption2 style={{ marginTop: -20, color: BaseColor.primaryColor }}>
                            Year Expired
                                                    </Text>
                    </View>
                </View>

            </View>



            var ccv = <View style={{ marginBottom: 10 }}>
                <TouchableOpacity
                    style={{ width: '100%' }}
                >
                    <View style={styles.contentProfile}>
                        <View style={{ flex: 6 }}>
                            <TextValidator
                                name="cardNumber"
                                label="cardNumber"
                                validators={['required']}
                                errorMessages={['This field is required']}
                                placeholder="e.g., 123"
                                type="text"
                                // keyboardType="email-address"
                                value={cardCVV}
                                onChangeText={(cardCVV) => {
                                    setCardCVV(cardCVV);
                                    setTimeout(() => {
                                        validation();
                                    }, 50);
                                }}


                            />
                        </View>

                    </View>
                </TouchableOpacity>

                <Text caption2 style={{ marginTop: -15, color: BaseColor.primaryColor }}>
                    CCV
                                        </Text>

            </View>

            if (order_payment_recent.payment_type == "" || order_payment_recent.payment_type == "user") {
                var payment_type = dataPayment.payment_type;
                var payment_sub = dataPayment.payment_sub;
                virtual_account = '';
            }


            if (payment_type == 'credit_card') {
                content = <View style={{
                    borderWidth: 1,
                    borderColor: BaseColor.textSecondaryColor,
                    borderRadius: 10,
                    marginBottom: 10,
                    padding: 10
                }}>
                    <Form
                        onSubmit={this.submit}
                    >
                        {cardNumberForm}
                        {cardExpired}
                        {ccv}
                    </Form>
                </View>
            }



        }

        return content;



    }

    function content_button() {
        const priceSplitter = (number) => (number && number.toString().replace(/\B(?=(\d{3})+(?!\d))/g, '.'));

        var order_payment_num = dataBooking[0].order_payment_num;
        var order_payment_recent = dataBooking[0].order_payment_recent;
        var content = <View></View>;

        if (order_payment_recent != null) {
            if (order_payment_recent.payment_type == "") {
                var payment_type = dataPayment.payment_type;
                var payment_sub = dataPayment.payment_sub;

                content = <View style={styles.contentButtonBottom}>
                    <Button
                        full
                        loading={loading}
                        onPress={() => {
                            Alert.alert(
                                'Confirm',
                                'Yakin ingin membayar tagihan ini ?',
                                [
                                    { text: 'NO', onPress: () => console.warn('NO Pressed'), style: 'cancel' },
                                    { text: 'YES', onPress: () => submitBayar() },
                                ]
                            );
                        }}
                    >
                        Bayar
                            </Button>
                </View>

            } else {
                content = <View>
                    <View style={styles.contentButtonBottom}>
                        <Button
                            full
                            loading={loading}
                            onPress={() => {
                                cekStatusMidtrans();
                                // var redirect='PembayaranDetail';
                                // var param={
                                //     id_order:idOrder,
                                //     dataPayment:{}
                                // }
                                // navigation.navigate("Redirect",{redirect:redirect,param:param});
                            }}
                        >
                            Sudah Membayar
                                </Button>
                    </View>
                    <View style={styles.contentButtonBottom}>
                        <Button
                            full
                            loading={loading}
                            // onPress={() => { 
                            //         Alert.alert(
                            //           'Confirm',
                            //           'Ingin mengganti metode pembayaran ?',
                            //           [
                            //             {text: 'NO', onPress: () => console.warn('NO Pressed'), style: 'cancel'},
                            //             {text: 'YES', onPress: () => changePayment()},
                            //           ]
                            //         );
                            // }}
                            style={{ backgroundColor: BaseColor.grayColor }}
                        >
                            <Text style={{ color: BaseColor.whiteColor }}>Ganti Metode Pembayaran</Text>
                        </Button>
                    </View>
                </View>

            }
        }

        return (

            <View>
                {content}
            </View>
        )

    }









    function onNavigationStateChange(navState) {
        var event = navState.url.split('#')[1]
        var data = navState.title

        console.log(event, data);
        //alert(event);

        // if (event == undefined) {
        //     if (event == '/order-summary') {

        //     }else{
        //         navigation.goBack();
        //     }
        //   //this.setState({ height: data });
        //   //navigation.goBack();
        // }
        if (data == 'Login - Master Diskon') {

            navigation.navigate("Loading", { redirect: 'Booking' });
        }
    }





    useEffect(() => {
        getConfig();
        fetch();
        // setTimeout(() => {
        //     fetch();  
        // }, 50);





        return () => {
            //console.log("[App] unRegister")
            //fcmService.unRegister()
            //localNotificationService.unregister()

        }

    }, []);





    var payment_type = dataPayment.payment_type;
    var title = '';
    if (payment_type == 'bank_transfer') {
        title = dataPayment.payment_type_label + ' - ' + dataPayment.payment_sub_label;
    } else if (payment_type == 'snap') {
        title = 'Snap Payment';
    } else {
        title = dataPayment.payment_type_label;
    }

    const jsCode = "var els = document.getElementsByClassName('button-main show'); while (els[0]) { els[0].classList.remove('show')}";
    //const jsCode = "document.querySelector('.form-signin').style.display = 'none'";
    var item = dataBooking[0];
    var order_payment_recent = item.order_payment_recent;

    var content = <View></View>
    // if(order_payment_recent.snaptoken=='' || order_payment_recent.snaptoken==null || order_payment_recent.payment_type==''){
    // content=<ScrollView>
    //         <View  style={{ padding: 20 }}>
    //             {content_countdown()}
    //             {content_payment()}
    //             {/* {content_payment_form()} */}
    //             {content_button()}
    //         </View>
    //         </ScrollView>
    // }else{
    // if(order_payment_recent.payment_type=="gojek"){
    //     var urlSnap=config.midtransUrlSnap+order_payment_recent.snaptoken;
    // }else{
    var urlSnap = order_payment_recent.payment_va_or_code_or_link;

    //}


    console.log('urlSnap', urlSnap);
    contentModalIcon = <View></View>
    contentModalButton = <View />

    if (statusPembayaran == 'none') {

        contentModalIcon = <View
            style={{
                padding: 10,
                justifyContent: 'center', alignItems: 'center'
            }}
        >
            <Icon
                name="times-circle"
                size={30}
                color={BaseColor.thirdColor}
                solid
            />
            <Text style={{ fontSize: 30 }}>
                Belum Bayar
                                    </Text>
        </View>
    } else if (statusPembayaran == 'settlement') {
        contentModalIcon = <View
            style={{
                padding: 10,
                justifyContent: 'center', alignItems: 'center'
            }}
        >
            <Icon
                name="check-circle"
                size={30}
                color={'green'}
                solid
            />
            <Text style={{ fontSize: 30 }}>
                {modalStatus}
            </Text>
        </View>

    } else if (statusPembayaran == 'pending') {
        contentModalIcon = <View
            style={{
                padding: 10,
                justifyContent: 'center', alignItems: 'center'
            }}
        >
            <Icon
                name="times-circle"
                size={30}
                color={BaseColor.thirdColor}
                solid
            />
            <Text style={{ fontSize: 30 }}>
                {modalStatus}
            </Text>
        </View>

    }


    if (statusPembayaran == 'none') {

        contentModalButton = <View
            style={{
                padding: 10,
                justifyContent: 'center', alignItems: 'center'
            }}
        >
            <Button
                style={{ width: '100%' }}
                full
                onPress={() => {
                    setModalVisible(false);
                }}
                title="Close"
            >
                Close
                                    </Button>
        </View>
    } else if (statusPembayaran == 'settlement') {
        contentModalButton = <View
            style={{
                padding: 10,
                justifyContent: 'center', alignItems: 'center'
            }}
        >
            <Button
                style={{ width: '100%' }}
                full
                onPress={() => {
                    var param = {
                        id_order: idOrder,
                        dataPayment: {},
                    }
                    navigation.navigate("Pembayaran", { param: param });
                }}
                title="Kembali ke pesanan"
            >
                Kembali ke pesanan
                                        </Button>
        </View>

    } else if (statusPembayaran == 'pending') {
        contentModalButton = <View
            style={{
                padding: 10,
                justifyContent: 'center', alignItems: 'center'
            }}
        >
            <Button
                style={{ width: '100%' }}
                full
                onPress={() => {
                    setModalVisible(false);
                }}
                title="Close"
            >
                Close
                                        </Button>
        </View>

    }
    content = <View style={{ flex: 1 }}>
        <WebView
            style={{ height: '70%' }}
            source={{ uri: urlSnap }}
            ref={ref => {
                this.webview = ref;
            }}
            originWhitelist={['*']}
            javaScriptEnabledAndroid={true}
            automaticallyAdjustContentInsets={false}
            //injectedJavaScript={'alert("hello")'}
            onNavigationStateChange={onNavigationStateChange.bind(this)}
        />
        <View style={{ flexDirection: "row" }}>
            <View style={{ flex: 5, justifyContent: "center", alignItems: "flex-start" }}>
                <Button
                    style={{ borderRadius: 0, marginVertical: 0 }}
                    full
                    loading={loading}
                    onPress={() => {
                        Alert.alert(
                            'Konfirmasi',
                            'Ingin mengganti metode pembayaran ?',
                            [
                                { text: 'NO', onPress: () => console.warn('NO Pressed'), style: 'cancel' },
                                { text: 'YES', onPress: () => submitChange() },
                            ]
                        );

                    }}
                >
                    Ganti Pembayaran
                                    </Button>
            </View>
            <View style={{ flex: 5, justifyContent: "center", alignItems: "flex-start" }}>
                <Button
                    style={{ borderRadius: 0, marginVertical: 0, backgroundColor: BaseColor.primaryColor }}
                    full
                    loading={loading}
                    onPress={() => {
                        cekStatusMidtrans();
                        // var param={
                        //     id_order:idOrder,
                        //     dataPayment:{},
                        // }
                        // navigation.navigate("Pembayaran",{param:param});

                    }}
                >

                    <Text style={{ color: BaseColor.whiteColor }}>Sudah Membayar</Text>
                </Button>
            </View>
        </View>

        <Modal
            isVisible={modalVisible}

            onBackdropPress={() => {
                setModalVisible(false);
            }}
            onSwipeComplete={() => {
                setModalVisible(false);
            }}


            swipeDirection={["down"]}
            style={{ justifyContent: "flex-end", margin: 0 }}
        >
            <View style={{
                width: "100%",
                borderTopLeftRadius: 8,
                borderTopRightRadius: 8,

                paddingHorizontal: 20,
                backgroundColor: BaseColor.whiteColor,
                paddingVertical: 20,
                // flexDirection: "row",

                flex: 1,
                flexDirection: 'column',
                justifyContent: 'center',
                alignItems: 'center'
            }}>

                <View style={{ marginTop: 10, flexDirection: "row" }}>
                    <View>
                        <View style={{
                            justifyContent: 'center', alignItems: 'center'
                        }}
                        >
                            <Text
                                style={{ fontSize: 14, textAlign: 'center' }}                                                              >
                                {modalTitle}
                            </Text>
                        </View>

                        {contentModalIcon}
                        <View style={{
                            justifyContent: 'center', alignItems: 'center'
                        }}
                        >
                            <Text
                                style={{ fontSize: 14, textAlign: 'center' }}
                            >
                                {modalTitleSub}
                            </Text>
                        </View>

                        {contentModalButton}
                    </View>
                </View>


            </View>
        </Modal>

    </View>
    //}



    return (
        <SafeAreaView
            style={BaseStyle.safeAreaView}
            forceInset={{ top: "always" }}
        >
            <Header
                title={title}
                subTitle={'No.Order :' + dataBooking[0].order_code}
                renderLeft={() => {
                    return (
                        <Icon
                            name="md-arrow-back"
                            size={20}
                            color={BaseColor.whiteColor}
                        />
                    );
                }}
                onPressLeft={() => {
                    navigation.goBack();

                    //navigation.navigate("Booking");
                }}
            />

            {
                loading ?

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
                                source={require("app/assets/loader_paperline.json")}
                                animationStyle={{ width: 300, height: 300 }}
                                speed={1}
                            />
                            <Text>
                                Load Detail Pembayaran
                                </Text>
                        </View>
                    </View>
                    :

                    content

            }

        </SafeAreaView>
    );
}