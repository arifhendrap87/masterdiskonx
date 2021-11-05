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
    AsyncStorage,
    ActivityIndicator,
    ProgressBarAndroid, ProgressViewIOS,
    BackHandler
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


import SetDate from "../../components/SetDate";
import SetPenumpang from "../../components/SetPenumpang";
import FormOptionQty from "../../components/FormOptionQty";
import PreviewImage from "../../components/PreviewImage";
import PreviewHotel from "../../components/PreviewHotel";


// Load sample data
import HTML from "react-native-render-html";
import {
    DataConfig,
} from "@data";

import AnimatedLoader from "react-native-animated-loader";
import FastImage from 'react-native-fast-image';
import Modal from "react-native-modal";
import { Touchable } from "react-native";
import MapView from "react-native-maps";



export default class ProductDetail extends Component {
    constructor(props) {
        super(props);
        
        var product={};
        if(this.props.navigation.state.params && this.props.navigation.state.params.product){
            product=this.props.navigation.state.params.product;
            console.log('productss',JSON.stringify(product));
        }else{
            product='';
        }


        var product_type='';
        if(this.props.navigation.state.params && this.props.navigation.state.params.product_type){
            product_type=this.props.navigation.state.params.product_type;
        }else{
            product_type='';
        }

        var param={};
        if(this.props.navigation.state.params && this.props.navigation.state.params.param){
            param=this.props.navigation.state.params.param;
        }else{
            param={};
           
        }
        console.log('paramsxx',JSON.stringify(param));

        var paramOriginal={};
        if(this.props.navigation.state.params && this.props.navigation.state.params.paramOriginal){
            paramOriginal=this.props.navigation.state.params.paramOriginal;
        }else{
            paramOriginal={};
           
        }
        console.log('paramxxxx',JSON.stringify(param));
        var minDate = new Date(); // Today
        minDate.setDate(minDate.getDate() + 0);
        var tglAwal=this.convertDate(minDate);

        this.state = {
            heightHeader: Utils.heightHeader(),
            
            product_type:product_type,
            product_id:product.id,
            product: product,
            product_option:product.product_option,
            product_detail:product.product_detail,
            param:param,
            paramOriginal:paramOriginal,
            minPerson:1,
            minRoom:1,
            minVoucher:1,
            minPrice:0,
            maksPersonRoom:0,
            sisaPersonRoom:0,
            totalPrice:0,
            modalVisiblePerson: false,
            modalVisibleDate: false,
            
            dewasa:"2",
            anak:"0",
            bayi:"0",
            selectedStartDate: null,
            tglAwal:tglAwal,
            tglAkhir:'',
            tglAwalNumber:0,
            tglAkhirNumber:0,
            
            listdataPerson:[
                {
                value: 1,
                text: "1 Voucher"
                },
                {
                value: 2,
                text: "2 Voucher"
                },
                {
                value: 3,
                text: "3 Voucher"
                }
            ],
            listdataRoom:[
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
            
            
            login:true,
            loading_product:true,
            loading_option:true,
            loading_pilih:true,
            option_empty:false,
            config:DataConfig,
            img_featured:Images.doodle,
            info_hotelpackage:[
                {
                    "title": "Informasi Penting",
                    "content": "<p>Biaya penambahan orang dalam kamar mungkin berlaku dan berbeda-beda menurut kebijakan properti.\r\n                                  Tanda pengenal berfoto yang dikeluarkan oleh pemerintah, kartu kredit, kartu debit, dan deposit uang tunai diperlukan saat check-in untuk biaya tidak terduga.\r\n                                  Pemenuhan permintaan khusus bergantung pada ketersediaan sewaktu check-in dan mungkin menimbulkan biaya tambahan. Permintaan khusus tidak dijamin akan terpenuhi.</p>"
                },
                {
                    "title": "Syarat dan Ketentuan",
                    "content": "\r\n                                        1.Periode pembelian voucher sampai dengan 31 March 2021 (sesuai ketersediaan)<br>\r\n                                        2.Voucher berlaku untuk periode menginap : sampai dengan 15 December 2021<br>\r\n                                        3.Voucher berlaku untuk 2 orang per room&nbsp;<br>\r\n                                        4.Voucher berlaku setiap hari, termasuk hari libur nasional dan long weekend<br>\r\n                                        5.Pembayaran penuh di muka diperlukan pada saat pembelian dan bersifat non-refundable<br>\r\n                                        6.Upgrade ke type kamar lainnya tersedia dengan biaya tambahan<br>\r\n                                        7.Voucher dapat dipindah tangankan sebagai hadiah kepada teman maupun keluarga"
                }
            ],
            info_activities:[
                {
                    "title": "Syarat dan ketentuan",
                    "content": "<ul>\r\n           <li>Reservasi dibutuhkan min 3&nbsp;hari sebelum kunjungan</li>\r\n           <li>Cancellation &amp; refund policy subject to confirmation</li>\r\n       </ul>"
                }
            ],
            indexSelected:0,
            cancelRoom:[],
            loop:1,
            abort:false,

        };
        this._deltaY = new Animated.Value(0);
        this.setPrice = this.setPrice.bind(this);
        this.setJumlahDewasa = this.setJumlahDewasa.bind(this);
        this.setJumlahAnak = this.setJumlahAnak.bind(this);
        this.setJumlahBayi = this.setJumlahBayi.bind(this);
        this.setMinPerson = this.setMinPerson.bind(this);
        this.setVoucher = this.setVoucher.bind(this);
        this.setRoom = this.setRoom.bind(this);
        this.setTglAwal = this.setTglAwal.bind(this);
        this.setTglAkhir = this.setTglAkhir.bind(this);
        this.setBookingTime = this.setBookingTime.bind(this);
        this.setLoadingSpinner = this.setLoadingSpinner.bind(this);
        this.selectImage = this.selectImage.bind(this);

        this.getConfig();
        this.getSession();
        this.getInfoProduct();
        this.handleBackButtonClick = this.handleBackButtonClick.bind(this);


    }

    componentWillMount() {
        BackHandler.addEventListener('hardwareBackPress', this.handleBackButtonClick);
    }
    
    componentWillUnmount() {
        BackHandler.removeEventListener('hardwareBackPress', this.handleBackButtonClick);
    }
    
    handleBackButtonClick() {
        //this.props.navigation.navigate('Booking');
        this.props.navigation.goBack(null);
        return true;

        // if(this.state.product_type=='hotelLinx'){
        //     this.setState({abort:true});
        //     var link='HotelLinx';
        //     this.props.navigation.navigate(link,
        //         {
        //             param:this.state.param,
        //             paramOriginal:this.state.paramOriginal
        //         });
        //         return true;
        // }else{
        //     this.props.navigation.goBack();
        //     return true;

        // }
    }



    //memanggil config
    getConfig(){
            AsyncStorage.getItem('config', (error, result) => {
                if (result) {    
                    let config = JSON.parse(result);
                    this.setState({config:config});
                }
            });
    }

    getInfoProduct(){
        AsyncStorage.getItem('info_activities', (error, result) => {
            if (result) {    
                let config = JSON.parse(result);
                this.setState({info_activities:result});
            }
        });

        AsyncStorage.getItem('info_hotelpackage', (error, result) => {
            if (result) {    
                let config = JSON.parse(result);
                this.setState({info_hotelpackage:result});
            }
        });

        AsyncStorage.getItem('info_trip', (error, result) => {
            if (result) {    
                let config = JSON.parse(result);
                this.setState({info_trip:result});
            }
        });
}

    //memanggil session
    getSession(){    
        AsyncStorage.getItem('userSession', (error, result) => {
            if (result) {    
                let userSession = JSON.parse(result);
                var id_user=userSession.id_user;
                this.setState({id_user:id_user});
                this.setState({userSession:userSession});
                this.setState({login:true});
            }
        });
    }

    setBookingTime(tglAwal, tglAkhir,round) {
            this.setState({tglAwal:tglAwal});
    }
    
    setTglAwal(dateConversion,dateNumber){
        this.setState({tglAwal:dateConversion});
        this.setState({tglAwalNumber:dateNumber});
    }

    setTglAkhir(dateConversion,dateNumber){
        this.setState({tglAkhir:dateConversion});
        this.setState({tglAkhirNumber:dateNumber});
    }

    setPrice(select){
        var minPerson=this.state.minPerson;
        var maksPersonRoom=parseInt(minPerson)*parseInt(select.guest_per_room);
        var jmlPerson=parseInt(this.state.dewasa)+parseInt(this.state.anak)+parseInt(this.state.bayi);
        var sisaPersonRoom=parseInt(maksPersonRoom)-parseInt(jmlPerson);

        this.setState({maksPersonRoom:maksPersonRoom});
        this.setState({sisaPersonRoom:sisaPersonRoom});

        this.setState({minPersonDef:minPerson});
        this.setState({minPerson:minPerson});
        this.setState({select:select});
    }

    setJumlahDewasa(jml){
            var maksPersonRoom=this.state.maksPersonRoom;
            var jmlPerson=parseInt(jml)+parseInt(this.state.anak)+parseInt(this.state.bayi);
            var sisaPersonRoom=parseInt(maksPersonRoom)-parseInt(jmlPerson);

            this.setState({maksPersonRoom:maksPersonRoom});
            this.setState({jmlPerson:jmlPerson});
            this.setState({sisaPersonRoom:sisaPersonRoom});
            this.setState({dewasa:jml});
    }

    setJumlahAnak(jml){
            var maksPersonRoom=this.state.maksPersonRoom;
            var jmlPerson=parseInt(this.state.dewasa)+parseInt(jml)+parseInt(this.state.bayi);
            var sisaPersonRoom=parseInt(maksPersonRoom)-parseInt(jmlPerson);

            this.setState({maksPersonRoom:maksPersonRoom});
            this.setState({jmlPerson:jmlPerson});
            this.setState({sisaPersonRoom:sisaPersonRoom});
            this.setState({anak:jml});
    }

    setJumlahBayi(jml){
            var maksPersonRoom=this.state.maksPersonRoom;
            var jmlPerson=parseInt(this.state.dewasa)+parseInt(this.state.anak)+parseInt(jml);
            var sisaPersonRoom=parseInt(maksPersonRoom)-parseInt(jmlPerson);
    
            this.setState({maksPersonRoom:maksPersonRoom});
            this.setState({jmlPerson:jmlPerson});
            this.setState({sisaPersonRoom:sisaPersonRoom});
            this.setState({bayi:jml});
    }

    setMinPerson(jml){
        this.setState({minPerson:jml});
    }

    setVoucher(jml){
        this.setState({minVoucher:jml});
        this.setState({dewasa:jml.toString()});
    }

    setRoom(jml){
        this.setState({dewasa:this.state.select.guest_per_room});
        this.setState({anak:"0"});
        this.setState({bayi:"0"});
        setTimeout(() => {
            var maksPersonRoom=parseInt(jml)*parseInt(this.state.select.guest_per_room);
            var jmlPerson=parseInt(this.state.dewasa)+parseInt(this.state.anak)+parseInt(this.state.bayi);
            var sisaPersonRoom=parseInt(maksPersonRoom)-parseInt(jmlPerson);

            this.setState({maksPersonRoom:maksPersonRoom});
            this.setState({sisaPersonRoom:sisaPersonRoom});

            this.setState({minRoom:jml});
        }, 50);
    }

    fetch(){
        const {config,product_id} =this.state;
        var url=config.baseUrl;
        var path=config.product_hotel_package.dir_detail;
        var paramUrl={"param": {"detail_category": "", "id_city": "", "id_country": "", "id_hotelpackage": product_id, "limit": "", "search": ""}}
        this.setState({ loading_product: true }, () => {
            var param={
                method: 'POST',
                headers: {
                  Accept: 'application/json',
                  'Content-Type': 'application/json',
                },
                body: JSON.stringify(),
              }
              console.log('getProductHotelPackage',url+path,JSON.stringify(paramUrl));
            

                fetch(url+path,param)
                .then(response => response.json())
                .then(result => {
                    
                    var product=result[0];
                    this.setState({loading_product: false });
                    this.setState({product: product});

                })
                .catch(error => {
                    alert('Kegagalan Respon Server')
                });

            
        });
    }



    getOption(){
        const {config,product_type,param,product}=this.state;
        const { navigation } = this.props;
        // this.setState({ loading_option: true }, () => {
        //     if(product_type != 'hotelLinx'){
        //         this.setState({loading_option:false});
        //     }
        // });
        
    }


    getAvailability(){
        const {config,product_type,param,product}=this.state;
        this.setState({ loading_pilih: true }, () => {
            if(product_type=='hotelLinx'){
                var url=config.baseUrl;
                var path="front/api/product/getAvailability";

                var myHeaders = new Headers();
                myHeaders.append("Content-Type", "application/json");
                // myHeaders.append("Cookie", "ci_session=cbf7qbtafqbmobrhbglbg45061kcftt6");

                var paramGetAvailability={"param":param};
                //var raw = JSON.stringify({"param":param});
                console.log('getAvail',url+path,JSON.stringify(paramGetAvailability));

                var requestOptions = {
                method: 'POST',
                headers: myHeaders,
                body: JSON.stringify(paramGetAvailability),
                redirect: 'follow'
                };

                fetch(url+path, requestOptions)
                .then(response => response.json())
                .then(result => {
                    var dataRoom=result.DataRoom;
                    var searchKey=result.SearchKey;
                    console.log(searchKey,JSON.stringify(dataRoom));

                 
                    var nObj=[];
                    dataRoom.map(item => {
                        nObj = this.state.product_option.filter(ele => {
                            ele.searchkey = searchKey;
                            ele.RoomToken=item.RoomToken;
                            return ele;
                        });
                        
                    });
                    //console.log('nObj',JSON.stringify(nObj));
                    
                    this.setState({product_option:nObj});
                    this.setState({loading_pilih:false});
                    //console.log('getAvaibility',JSON.stringify(result));

                })
                .catch(error => {
                    this.setState({option_empty:true});
                });

            }else{
                this.setState({loading_option:false});
            }
        });
        
    }
    
    updateOption(searchKey,roomToken){

        let nObj = this.state.product_option.filter(ele => {
            ele.searchkey = searchKey;
            return ele;
        });
    }
    
    componentDidMount(){
        
        
        this.setState({loading_option:true});
        this.setState({loading_pilih:true});


        const {navigation} = this.props;
            navigation.addListener ('didFocus', () =>{
                setTimeout(() => {
                    this.getOption();
                }, 20);
            });


    }

    renderItemImages(item) {
        const { navigation } = this.props;
        const priceSplitter = (number) => (number && number.toString().replace(/\B(?=(\d{3})+(?!\d))/g, '.'));

        return (
            <CardCustom
                                                propImage={{height:wp("30%"),url:item.img_featured_url}}
                                                propInframe={{top:'',bottom:item.city_name}}
                                                propTitle={{text:''}}
                                                propDesc={{text:''}}
                                                propPrice={{price:'',startFrom:true}}
                                                propStar={{rating:''.stars,enabled:false}}
                                                propLeftRight={{left:'',right:''}}
                                                onPress={() =>
                                                    navigation.navigate("Hotel",{id_city:item.id_city})
                                                }
                                                loading={this.state.loading_dashboard}
                                                propOther={{inFrame:false,horizontal:true,width:wp("40%")}}
                                            />
        );
    }


    
    convertDate(date){

        var dd = String(date.getDate()).padStart(2, '0');
        var mm = String(date.getMonth() + 1).padStart(2, '0'); //January is 0!
        var yyyy = date.getFullYear();

        date = yyyy + '-' + mm + '-' + dd;
        return date;
    }
    
    setDate(date) {
    
        var date = new Date(date);
        var tempoMonth = (date.getMonth()+1);
        var tempoDate = (date.getDate());
        var finaldate="";
        if (tempoMonth < 10) tempoMonth = '0' + tempoMonth;
        if (tempoDate < 10) tempoDate = '0' + tempoDate;
    
        return finaldate = date.getFullYear()  + '-' +  tempoMonth  + '-' +  tempoDate;
    };
    
    onSubmit() {
    
        const {type,product,select,product_type} =this.state;
        var tgl_akhir='';

 
          var param = {
            DepartureDate:this.state.tglAwal,
            ReturnDate:tgl_akhir,
            Adults:this.state.dewasa,
            Children:this.state.anak,
            Infants:this.state.bayi,
            }
        
        var productPart={}
        var link='';
        var qty='';
        if(product.product_cat=='buy_now_stay_later' || product_type=='activities'){
            qty=this.state.minVoucher;
        }else{
            qty=this.state.minRoom;

        } 
            link='Summary';
            param.type=this.state.product_type;
            param.cityId=this.state.cityId;
            param.cityText=this.state.cityText;
            param.cityProvince=this.state.cityProvince;
            param.Qty=parseInt(qty);
            param.totalPrice=parseInt(qty)*parseInt(select.price);
            param.participant=false;

            var param={
                    param:param,
                    product:product,
                    productPart:select
            }

            console.log('dataSummary',JSON.stringify(param));
            
            this.props.navigation.navigate(link,
                {
                    param:param,
                });
                
    }


    
    content_button(){
        const {product,product_type}=this.state;
        const { navigation } = this.props;
        var content=<View></View>
        
        if(product_type=='hotelpackage'){
            if(product.product_cat=='buy_now_stay_later'){
                content=<View style={[styles.contentButtonBottom]}>
                                <FormOptionQty
                                        title={'Quantity'}
                                        titleSub={'Anda dapat mengambil 3 voucher dalam sekali transaksi'}
                                        listdata={this.state.listdataPerson}
                                        setMinPerson={this.setVoucher}
                                        selectedText={this.state.minVoucher + ' Voucher'}
                                        icon={'user'}
                                />
                                
                                <Button
                                    style={{ height: 40,width:'80%'}}
                                    onPress={() => {  
                                        this.onSubmit();
                                       
                                    }}
                                >
                                    Next
                                </Button>
                            </View>
                }else{
                
                    content=<View style={styles.contentButtonBottom}>
                                <View>
                                    <SetDate
                                        labelTglAwal={this.state.tglAwal}
                                        labelTglAkhir={this.state.tglAwal}
                                        setBookingTime={this.setBookingTime}
                                        tglAwal={this.state.tglAwal}
                                        tglAkhir={this.state.tglAkhir}
                                        round={false}
                                    />
                                </View>
                                
                                <View>
                                    <FormOptionQty
                                            title={'Room'}
                                            titleSub={'Maximum 2 tamu/room'}
                                            listdata={this.state.listdataRoom}
                                            setMinPerson={this.setRoom}
                                            selectedText={this.state.minRoom + ' Room'}
                                            icon={'bed'}
                                    />
                                </View>
        
                                <View>
                                    <SetPenumpang
                                        label={parseInt(this.state.dewasa)+parseInt(this.state.anak)+parseInt(this.state.bayi)}
                                        dewasa={this.state.dewasa}
                                        anak={this.state.anak}
                                        bayi={this.state.bayi}
                                        setJumlahDewasa={this.setJumlahDewasa}
                                        setJumlahAnak={this.setJumlahAnak}
                                        setJumlahBayi={this.setJumlahBayi}
                                        minPersonDef={this.state.minPersonDef}
                                        minPerson={this.state.minPerson}
                                        minPrice={this.state.minPrice}
                                        totalPrice={this.state.totalPrice}
                                        setMinPerson={this.setMinPerson}
                                        maksPersonRoom={this.state.maksPersonRoom}
                                        sisaPersonRoom={this.state.sisaPersonRoom}
                                        includeBayi={false}
                                        type={'hotel_package_room'}
        
                                    />
                                </View>
                                
                                <Button
                                    style={{ height: 40}}
                                    onPress={() => {  
                                        this.onSubmit();
                                       
                                    }}
                                >
                                    Next
                                </Button>
                            </View>
                
                }

        }else if(product_type=='activities'){

            content=<View style={[styles.contentButtonBottom]}>
                                <FormOptionQty
                                        title={'Quantity'}
                                        titleSub={'Anda dapat mengambil 3 voucher dalam sekali transaksi'}
                                        listdata={this.state.listdataPerson}
                                        setMinPerson={this.setVoucher}
                                        selectedText={this.state.minVoucher + ' Voucher'}
                                        icon={'user'}
                                />
                                
                                <Button
                                    style={{ height: 40,width:'80%'}}
                                    onPress={() => {  
                                        this.onSubmit();
                                       
                                    }}
                                >
                                    Next
                                </Button>
                            </View>
        }
        
        return(
            <View>
                {content}
            </View>
            
        )
    }
   
    convertDateDDMY(date){
        var d = new Date(date);
        var days = ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"];
        var months = ["Jan","Feb","Mar","Apr","May","Jun","Jul","Aug","Sep","Oct","Nov","Dec"];
        return days[d.getDay()]+", "+d.getDate()+" "+months[d.getMonth()]+" "+d.getFullYear();
    }

    convertDateDMY(date){
        var d = new Date(date);
        var days = ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"];
        var months = ["Jan","Feb","Mar","Apr","May","Jun","Jul","Aug","Sep","Oct","Nov","Dec"];
        return d.getDate()+" "+months[d.getMonth()]+" "+d.getFullYear();
    }

    convertDateDM(date){
        var d = new Date(date);
        var days = ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"];
        var months = ["Jan","Feb","Mar","Apr","May","Jun","Jul","Aug","Sep","Oct","Nov","Dec"];
        return d.getDate()+" "+months[d.getMonth()];
    }

    setLoadingSpinner(status){
        this.setState({loading_spinner:status})
    }

    selectImage(index){
        const { navigation } = this.props;
        console.log('index',index);
        console.log('PreviewImage',JSON.stringify(this.state.product.product_image));
        navigation.navigate("PreviewImage",{images:this.state.product.product_image,indexSelected:index});

    }

    render() {
        const { navigation } = this.props;
        const { indexSelected,title, heightHeader, service, product,product_type,minPerson,minPrice,totalPrice,login} = this.state;
        const heightImageBanner = Utils.scaleWithPixel(250, 1);
        // var marginTopBanner=0;
        // if(product.product_image.length != 0){
        //     marginTopBanner = heightImageBanner - heightHeader - 190;
        // }else{
        //     marginTopBanner = heightImageBanner - heightHeader + 50;            
        // }
        const marginTopBanner = heightImageBanner - heightHeader;
        const priceSplitter = (number) => (number && number.toString().replace(/\B(?=(\d{3})+(?!\d))/g, '.'));

        const { modalVisiblePerson,modalVisibleDate} = this.state;

        var content=<View></View>
        if(product_type=='hotelpackage'){
            content=<View>
                        <View
                            style={[
                                {
                                    flexDirection: "row",
                                    paddingHorizontal: 20,
                                    marginBottom: 10,
                                    paddingTop: 10
                                },
                                // { marginTop: marginTopBanner }
                            ]}
                        >
                            <Tag
                                primary
                                style={{ marginRight: 15 }}
                            >
                                 {/* {product.product_cat} */}
                                 {(product.product_cat.replace(/_/gi, ' ')).toUpperCase()}
                            </Tag>
                        </View>

                        
                        <View
                            style={[
                                { paddingHorizontal: 20, paddingTop: 0 },
                            ]}
                        >
                            <Text
                                body1
                                bold
                            >
                                {product.product_name}
                            </Text>
                        </View>
                        

                        <View style={{ flexDirection: "row", alignItems: "center", paddingHorizontal: 20 }}>
                            <StarRating
                                    disabled={true}
                                    starSize={14}
                                    maxStars={5}
                                    rating={5}
                                    selectedStar={rating => {}}
                                    fullStarColor={BaseColor.yellowColor}
                                />
                        </View>

                        <View style={{ flexDirection: "row", alignItems: "center", paddingHorizontal: 20, paddingBottom: 20 }}>
                            <Icon
                                name="map-marker-alt"
                                color={BaseColor.lightPrimaryColor}
                                size={10}
                            />
                            <Text
                                caption1
                                style={{ marginLeft: 10 }}
                                numberOfLines={5}
                            >
                                {/* {product.img_featured_url} */}
                                {product.product_detail.address}, {product.product_detail.capital}
                            </Text>
                        </View>
                        
                        <View style={{ flexDirection: "row", alignItems: "center", paddingHorizontal: 20,marginTop:10}}>
                            <Text body1 bold style={{color:BaseColor.thirdColor}}>Pilihan Produk</Text>
                            <Icon
                                name="angle-down"
                                color={BaseColor.thirdColor}
                                size={20}
                                style={{marginLeft:5}}
                            />
                        </View>
                        
                        <Paket
                            product={this.state.product}
                            setMinPerson={this.setMinPerson}
                            setPrice={this.setPrice}
                            setLoadingSpinner={this.setLoadingSpinner}
                            param={this.state.param}
                            product_type={this.state.product_type}
                            product_option={this.state.product_option}
                            loading_option={this.state.loading_option}
                            loading_pilih={this.state.loading_pilih}
                            option_empty={this.state.option_empty}
                            config={this.state.config}
                            navigation={this.props.navigation}

                            
                        />
                        <Informasi
                            data={this.state.info_hotelpackage[0].content}
                            title={this.state.info_hotelpackage[0].title}
                        />


                        <Informasi
                            data={this.state.info_hotelpackage[1].content}
                            title={this.state.info_hotelpackage[1].title}
                        />

                        
                    </View>

        }else if(product_type=='hotelLinx'){

            

            content=<View>
                        <View style={{backgroundColor:BaseColor.whiteColor,marginTop:10,flex:1}}>
                                                <View style={{marginHorizontal:20,paddingVertical:10,flex:1}}>
                                                        <View style={{
                                                            flexDirection:'row',
                                                            justifyContent:'space-between',
                                                            }}>
                                                            <Text body2 bold>{product.product_name}</Text>
                                                            
                                                        </View>
                                                </View>

                                            
                                                <View
                                                    style={{
                                                        borderBottomColor: BaseColor.dividerColor,
                                                        borderBottomWidth: 0.5,
                                                    }}
                                                />
                                            

                                                
                                            
                                                <View style={{marginHorizontal:20,paddingVertical:10,flex:1}}>
                                                    <View 
                                                    style={{ flexDirection: "row", alignItems: "center" }}
                                                    >
                                                        <StarRating
                                                                disabled={true}
                                                                starSize={14}
                                                                maxStars={5}
                                                                rating={5}
                                                                selectedStar={rating => {}}
                                                                fullStarColor={BaseColor.yellowColor}
                                                            />
                                                    </View>

                                                    <View style={{ flexDirection: "row", alignItems: "center", paddingHorizontal: 0}}>
                                                        <Icon
                                                            name="map-marker-alt"
                                                            color={BaseColor.lightPrimaryColor}
                                                            size={10}
                                                        />
                                                        <Text
                                                            caption1
                                                            style={{ marginLeft: 10 }}
                                                            numberOfLines={5}
                                                        >
                                                            {product.product_place},{product.product_place_2},{product.product_address}
                                                        </Text>
                                                    </View>
                                                    <View style={{ flexDirection: "row", alignItems: "center", paddingHorizontal: 0}}>
                                                        <Icon
                                                            name="map-marker-alt"
                                                            color={BaseColor.whiteColor}
                                                            size={10}
                                                        />
                                                        <Text
                                                            caption1
                                                            style={{ marginLeft: 10 }}
                                                            numberOfLines={5}
                                                        >
                                                            {product.product_address}
                                                        </Text>
                                                    </View>
                                                </View>
                                            
                        </View>

                        <View style={{backgroundColor:BaseColor.whiteColor,marginTop:10,flex:1}}>
                                                <View style={{marginHorizontal:20,paddingVertical:10,flex:1}}>
                                                        <View style={{
                                                            flexDirection:'row',
                                                            justifyContent:'space-between',
                                                            }}>
                                                            <Text body2 bold>Description</Text>
                                                            
                                                        </View>
                                                </View>

                                            
                                                <View
                                                    style={{
                                                        borderBottomColor: BaseColor.dividerColor,
                                                        borderBottomWidth: 0.5,
                                                    }}
                                                />
                                            

                                                
                                            
                                                <View style={{marginHorizontal:20,paddingVertical:10,flex:1}}>
                                                    <Text
                                                            caption1
                                                            numberOfLines={5}
                                                        >
                                                            {product.product_desc}
                                                        </Text>
                                                </View>
                                            
                        </View>

                        <View style={{backgroundColor:BaseColor.whiteColor,marginTop:10,flex:1}}>
                                                <View style={{marginHorizontal:20,paddingVertical:10,flex:1}}>
                                                        <View style={{
                                                            flexDirection:'row',
                                                            justifyContent:'space-between',
                                                            }}>
                                                            <Text body2 bold>Fasilitas</Text>
                                                            
                                                        </View>
                                                </View>

                                            
                                                <View
                                                    style={{
                                                        borderBottomColor: BaseColor.dividerColor,
                                                        borderBottomWidth: 0.5,
                                                    }}
                                                />
                                            
                                                <View style={{marginHorizontal:20,paddingVertical:10,flex:1}}>
                                                    {product.product_facilities.map((item, index) => (
                                                    <View style={{ flexDirection: "row", alignItems: "center"}}>
                                                        <Icon
                                                            name="checkmark-outline"
                                                            color={BaseColor.lightPrimaryColor}
                                                            size={10}
                                                        />
                                                        <Text
                                                            caption1
                                                            style={{ marginLeft: 10 }}
                                                        >
                                                            {item.facilities_name}
                                                        </Text>
                                                    </View>
                                                    ))}
                                                </View>
                        </View>

                        <View style={{backgroundColor:BaseColor.whiteColor,marginTop:10,flex:1}}>
                                                <View style={{marginHorizontal:20,paddingVertical:10,flex:1}}>
                                                        <View style={{
                                                            flexDirection:'row',
                                                            justifyContent:'space-between',
                                                            }}>
                                                            <Text body2 bold>Kamar</Text>
                                                            
                                                        </View>
                                                </View>

                                            
                                                <View
                                                    style={{
                                                        borderBottomColor: BaseColor.dividerColor,
                                                        borderBottomWidth: 0.5,
                                                    }}
                                                />
                                            
                                                <View style={{marginHorizontal:20,paddingVertical:10,flex:1}}>
                                                    <Paket
                                                            product={this.state.product}
                                                            setMinPerson={this.setMinPerson}
                                                            setPrice={this.setPrice}
                                                            setLoadingSpinner={this.setLoadingSpinner}
                                                            param={this.state.param}
                                                            product_type={this.state.product_type}
                                                            product_option={this.state.product_option}
                                                            loading_option={this.state.loading_option}
                                                            loading_pilih={this.state.loading_pilih}
                                                            option_empty={this.state.option_empty}
                                                            config={this.state.config}
                                                            navigation={this.props.navigation}
                                                        />
                                                </View>
                        </View>
                        

                        
                        
                        

                        
                        


                        



                        
                        
                        
                        

                        
                        
                    </View>
                
                            
        }else if(product_type=='activities'){
            content=<View>
                        <View
                            style={[
                                {
                                    flexDirection: "row",
                                    paddingHorizontal: 20,
                                    marginBottom: 10,
                                    paddingTop: 10
                                },
                                // { marginTop: marginTopBanner }
                            ]}
                        >
                            <Tag
                                primary
                                style={{ marginRight: 15 }}
                            >
                                {(product.product_cat.replace(/_/gi, ' ')).toUpperCase()}

                            </Tag>
                        </View>

                        
                        <View
                            style={[
                                { paddingHorizontal: 20, paddingTop: 0 },
                            ]}
                        >
                            <Text
                                body1
                                bold
                            >
                                {product.product_name}
                            </Text>
                        </View>
                        

                        <View style={{ flexDirection: "row", alignItems: "center", paddingHorizontal: 20 }}>
                            <StarRating
                                    disabled={true}
                                    starSize={14}
                                    maxStars={5}
                                    rating={5}
                                    selectedStar={rating => {}}
                                    fullStarColor={BaseColor.yellowColor}
                                />
                        </View>

                        <View style={{ flexDirection: "row", alignItems: "center", paddingHorizontal: 20, paddingBottom: 0 }}>
                            <Icon
                                name="map-marker-alt"
                                color={BaseColor.lightPrimaryColor}
                                size={10}
                            />
                            <Text
                                caption1
                                style={{ marginLeft: 10 }}
                                numberOfLines={1}
                            >
                                {product.product_detail.address}, {product.product_detail.capital}
                            </Text>
                        </View>

                        <View style={{ flexDirection: "row", alignItems: "center", paddingHorizontal: 20, paddingBottom: 0 }}>
                            <Icon
                                name="clock"
                                color={BaseColor.lightPrimaryColor}
                                size={10}
                            />
                            <Text
                                caption1
                                style={{ marginLeft: 10 }}
                                numberOfLines={1}
                            >
                                Periode Pemesanan s/d {this.convertDateDMY(product.product_detail.end_date)}
                            </Text>
                        </View>

                        <View style={{ flexDirection: "row", alignItems: "center", paddingHorizontal: 20, paddingBottom: 0 }}>
                            <Icon
                                name="clock"
                                color={BaseColor.lightPrimaryColor}
                                size={10}
                            />
                            <Text
                                caption1
                                style={{ marginLeft: 10 }}
                                numberOfLines={1}
                            >
                                Live {this.convertDateDMY(product.product_detail.valid_start)}
                            </Text>
                        </View>

                        <View style={{ flexDirection: "row", alignItems: "center", paddingHorizontal: 20,marginTop:10}}>
                            <Text body1 bold style={{color:BaseColor.thirdColor}}>Pilihan Produk</Text>
                            <Icon
                                name="angle-down"
                                color={BaseColor.thirdColor}
                                size={20}
                                style={{marginLeft:5}}
                            />
                        </View>

                        <Paket
                            product={this.state.product}
                            setMinPerson={this.setMinPerson}
                            setPrice={this.setPrice}
                            setLoadingSpinner={this.setLoadingSpinner}
                            param={this.state.param}
                            product_type={this.state.product_type}
                            product_option={this.state.product_option}
                            loading_option={this.state.loading_option}
                            loading_pilih={this.state.loading_pilih}
                            option_empty={this.state.option_empty}
                            config={this.state.config}
                            navigation={this.props.navigation}
                        />
                        <Informasi
                            data={this.state.info_activities[0].content}
                            title={this.state.info_activities[0].title}
                        />


                       
                    </View>

        }
        

        
        var content_modal=<Modal
                                isVisible={this.state.modalVisible}
                                onBackdropPress={() => {
                                    this.setState({modalVisible:false});
                                }}
                                onSwipeComplete={() => {
                                    this.setState({modalVisible:false});
                                }}
                                swipeDirection={["down"]}
                                style={styles.bottomModal}
                            >
                                
                                    
                                    
                                    <View style={styles.contentActionModalBottom}>
                                        <View style={{flexDirection:'column',flex:1}}>
                                                    <Text style={{color:BaseColor.primaryColor}}>asdas</Text>

                                        </View>
                                        <View style={{flexDirection:'column',flex:1}}>
                                                    <Text style={{color:BaseColor.primaryColor}}>asdas</Text>

                                        </View>
                                        
                                    </View>
                                  
                                
                            </Modal>

        return (
            this.state.loading_spinner 
            ?            
            <View style={{flex: 1,backgroundColor:  "#FFFFFF",justifyContent: "center",alignItems: "center"}}>
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
                            //source={require("app/assets/loader_paperline.json")}
                            source={require("app/assets/loader_wait.json")}
                            animationStyle={{width: 250,height: 250}}
                            speed={1}
                          />
                        <Text>
                            Request to Hotel
                        </Text>
                    </View>
                </View>
            :
            <View style={{ flex: 1,backgroundColor:BaseColor.bgColor}}>
                <Animated.View
                    style={[
                        styles.imgBanner,
                        {
                            height: this._deltaY.interpolate({
                                inputRange: [
                                    0,
                                    Utils.scaleWithPixel(150),
                                    Utils.scaleWithPixel(150)
                                ],
                                outputRange: [
                                    heightImageBanner,
                                    heightHeader,
                                    heightHeader
                                ]
                            })
                        }
                    ]}
                >
                   
                    <TouchableOpacity style={{ width: "100%", height: "100%" }}
                    onPress={()=>{
                        ///alert('asd')
                    }}
                    >
                    <FastImage
                    style={{ width: "100%", height: "100%" }}
                    source={this.state.img_featured}
                    resizeMode={FastImage.resizeMode.stretch}
                    cacheControl={FastImage.cacheControl.cacheOnly}
                    resizeMethod={'scale'}
                    onLoad={evt =>{
                        this.setState({img_featured:{
                            uri:this.state.product.img_featured_url,
                          headers:{ Authorization: 'someAuthToken' },
                          priority: FastImage.priority.normal,
                        }
                      
        
                        })
                      }
                    }
                    
                    >
                    </FastImage>
                    </TouchableOpacity>
                    
                </Animated.View>
                <SafeAreaView
                    //style={BaseStyle.safeAreaView}
                    forceInset={{ top: "always" }}
                >
                    <Header
                        title=""
                        transparent={true}
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
                            // if(this.state.product_type=='hotelLinx'){
                            //     this.setState({abort:true});
                            //     var link='HotelLinx';
                            //     navigation.navigate(link,
                            //         {
                            //             param:this.state.param,
                            //             paramOriginal:this.state.paramOriginal
                            //         });
                            // }else{
                            //     navigation.goBack();
                            // }
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
                    >


                       

                        {
                            product.product_image.length != 0 ?
                        
                        <View style={{marginTop:marginTopBanner+10}}>
                        <PreviewImage 
                            images={this.state.product.product_image}
                            selectImage={this.selectImage}
                            indexSelected={0}
                        />
                       </View>
                       :
                       <View />
                        }
                        {content}

                        
                    </ScrollView>
                    {content_modal}
                   {this.content_button()}
                    
                </SafeAreaView>
            </View>
        );
    }
}

class Paket extends Component {
    constructor(props) {
        super(props);
        this.state = {
            param:props.param,
            product:props.product,
            product_option:props.product_option,
            product_type:props.product_type,
            loading_option:props.loading_option,
            loading_spinner:false,
            loading_pilih:props.loading_pilih,
            option_empty:false,
            detailOption:{"Error":[],"Currency":"IDR","CancellationRS":[{"RoomNo":"1","RoomTypeName":"Double room Queen bed","MealName":"Room Only","EssentialInformation":"","CancellationPolicy":[{"FromDate":"04-19-2021","ToDate":"04-19-2021","CancellationPrice":314883.75}],"RoomToken":"MHwwfDB8MA=="}]},
            loading_cancel:true,
            loading_modal:true,
            loop:1,
            progressBarProgress: 0.0
            //dataCancelPolicy:{"Error":[],"Currency":"IDR","CancellationRS":[{"RoomNo":"1","RoomTypeName":" [1]Superior Room,1 Queen Bed(Free Breakfast,Free WiFi )","MealName":"Free Breakfast,Free WiFi ","EssentialInformation":"Inclusion: ,Superior Room,1 Queen Bed(Free Breakfast,Free WiFi )Smoking and Non-Smoking|Premium bedding|Electric kettle|Soundproofed rooms|Blackout drapes/curtains|Coffee/tea maker|Wardrobe or closet|Daily housekeeping|Free WiFi|Phone|Desk|Towels provided|Bed sheets provided|Soap|Shower only|Toilet paper|Toothbrush and toothpaste available|Shampoo|Slippers|Private bathroom|Free toiletries|Air conditioning|Hair dryer|In-room safe|Free bottled water|Separate bedroom<br />CheckIn Time-Begin: 2:00 PM  CheckIn Time-End: anytimeCheckOut Time: 12:00 PMCheckIn Instructions: &lt;ul&gt;  &lt;li&gt;Extra-person charges may apply and vary depending on property policy&lt;/li&gt;&lt;li&gt;Government-issued photo identification and a credit card, debit card, or cash deposit may be required at check-in for incidental charges&lt;/li&gt;&lt;li&gt;Special requests are subject to availability upon check-in and may incur additional charges; special requests cannot be guaranteed&lt;/li&gt;&lt;li&gt;This property accepts credit cards, debit cards, and cash&lt;/li&gt;&lt;li&gt;Safety features at this property include a fire extinguisher, a smoke detector, and a security system&lt;/li&gt;  &lt;/ul&gt;  Special Instructions : Front desk staff will greet guests on arrival.Minimum CheckIn Age : 17 Optional Fees: &lt;p&gt;The following fees and deposits are charged by the property at time of service, check-in, or check-out. &lt;/p&gt; &lt;ul&gt; &lt;li&gt;Fee for buffet breakfast: IDR 90000 per person (approximately)&lt;/li&gt;     &lt;li&gt;Airport shuttle fee: IDR 259997 per vehicle (one-way, maximum occupancy 3)&lt;/li&gt;          &lt;li&gt;Late check-out is available for a fee (subject to availability, amount varies)&lt;/li&gt;               &lt;/ul&gt; &lt;p&gt;The above list may not be comprehensive. Fees and deposits may not include tax and are subject to change. &lt;/p&gt;Cards Accepted: Visa,Debit cards,Cash,Mastercard&lt;ul&gt;  &lt;li&gt;This property offers transfers from the airport (surcharges may apply). Guests must contact the property with arrival details before travel, using the contact information on the booking confirmation. &lt;/li&gt; &lt;li&gt;This property advises that enhanced cleaning and guest safety measures are currently in place.&lt;/li&gt;&lt;li&gt;Disinfectant is used to clean the property; commonly-touched surfaces are cleaned with disinfectant between stays; bed sheets and towels are laundered at a temperature of at least 60°C/140°F; guestroom doors are sealed after cleaning; the property is cleaned and disinfected with electrostatic spray.&lt;/li&gt;&lt;li&gt;Social distancing measures are in place; staff at the property wear personal protective equipment; a shield is in place between staff and guests in main contact areas; periodic temperature checks are conducted on staff; temperature checks are available to guests; guests are provided with hand sanitizer; cashless payment methods are available for all transactions; masks are required in public areas.&lt;/li&gt;&lt;li&gt;Individually-wrapped food options are available for breakfast.&lt;/li&gt;&lt;li&gt;This property affirms that it adheres to the cleaning and disinfection practices of Safe Travels (WTTC - Global).&lt;/li&gt; &lt;/ul&gt;,Pets not allowed,Shield between guests and staff in main contact areas,Property follows sanitization practices of Safe Travels (WTTC - Global),Property confirms they are implementing guest safety measures,Temperature checks are available to guests,Social distancing measures are in place,Individually-wrapped food options are available,Guest accommodation is sealed after cleaning,Staff temperature checks are conducted regularly,Property is cleaned with disinfectant,Guests are provided with free hand sanitizer,Property confirms they are implementing enhanced cleaning measures,Staff wears personal protective equipment,Cashless transactions are available,Individually-wrapped food options are available for breakfast,Bed sheets and towels are washed at a temperature of at least 60°C/140°F,Electrostatic spray is used for disinfection,Masks are compulsory at the property,No cribs (infant beds) available,No rollaway/extra beds available,Commonly-touched surfaces are cleaned with disinfectantPlease refer to the following Terms of Use - http://mytravelagent.online/termsofuse.pdf","CancellationPolicy":[{"FromDate":"04-18-2021","ToDate":"04-18-2021","CancellationPrice":466488.1}],"RoomToken":"MHwwfDF8MA=="}]},
       };
    }


    setModalShow(status,item){
        this.setState({modalVisible:status});
        //console.log('item',JSON.stringify(item));
        //this.setState({detailOption:item});
    }


    componentDidMount() {
        const { navigation, product } = this.props;
        const { product_option,product_type } =this.state;
        //console.log('product_option',JSON.stringify(product_option));
        if(this.props.product_type=='hotelLinx'){
            this.getOptionHotelLinx();
            //this.getOptionHotelLinx2();
        }else{
            this.setState({loading_option:false});
        }
        
                if (product_option.length != 0) {
                    var select=product.product_option[0];
                    this.props.setPrice(select);
                    const selected = select.id_product_option;
                    if (selected) {
                        this.setState({
                            product_option: this.state.product_option.map(item => {
                                return {
                                    ...item,
                                    checked: item.id_product_option == selected
                                };
                            })
                        });
                    }
                }
    }

    rebuildOption(listdata,listdataCancel){
        var listdata_new = [];
        var a=0;
        
        listdata.map(item => {
            var obj = {};
            
            obj["RoomNo"]=item.RoomNo;
            obj["RoomTypeName"]=item.RoomTypeName;
            obj["MealName"]=item.MealName;
            obj["Price"]=item.Price;
            obj["BookingStatus"]=item.BookingStatus;
            obj["RoomToken"]=item.RoomToken;
            obj["rToken"]=item.rToken;
            obj["SearchKey"]=item.SearchKey;
            obj["sKey"]=item.sKey;
            obj["HotelOptionId"]=item.HotelOptionId;
            obj["hotelOptionId"]=item.hotelOptionId;
            obj["hotelid"]=item.hotelid;
            obj["detail_name"]=item.detail_name;
            obj["price"]=item.price;
            obj["IsCombineRoom"]=item.IsCombineRoom;
            obj["images"]=item.images;
            obj["fasility"]=item.fasility;
            obj["fas"]=item.fas;
            obj["img_featured_url"]=item.img_featured_url;
            obj["id_product_option"]=item.id_product_option;
            obj["statusCancel"]=listdataCancel[0];

            listdata_new.push(obj);
            a++;
        });

        return listdata_new;
        }
    

    getOptionHotelLinx(){
        if(this.state.loop <= 7 || this.state.abort==false){
        AsyncStorage.getItem('config', (error, result) => {
            if (result) {    
                let i = 0;

                
                
                    let config = JSON.parse(result);
            
                    var link='Summary';

                    var param=this.props.param;
                    param.tokenApp=config.apiToken;
                    console.log('≈',JSON.stringify(param));
                    var url=config.baseUrl;
                    var path="front/api/product/getAvailability4";

                    var myHeaders = new Headers();
                    myHeaders.append("Content-Type", "application/json");

                    var paramGetAvailability={"param":param};
                    console.log('getAvail',url+path,JSON.stringify(paramGetAvailability));

                    var requestOptions = {
                    method: 'POST',
                    headers: myHeaders,
                    body: JSON.stringify(paramGetAvailability),
                    redirect: 'follow'
                    };

                    fetch(url+path, requestOptions)
                    .then(response => response.json())
                    .then(result => {
                        console.log('resultgetAvailability4',JSON.stringify(result));
                        console.log('length',result.length);
                        console.log('loop:',this.state.loop);
                        if(result.length == 0){
                            this.setState({loop:this.state.loop+1});
                           this.getOptionHotelLinx();

                            // this.setState({option_empty:true});
                            // this.setState({loading_option:false});
                            // this.setState({product_option:[]});
                            
                            // console.log('hasil','null');

                        }else{
                            console.log('hasil','not null');
                            this.setState({option_empty:false});
                            this.setState({loading_option:false});
                            this.setState({product_option:result});
                            var paramOption=result;
                            //this.getOptionHotelLinxCancel(paramOption);

                        }    
                        
                    })
                    .catch(error => {
                        //alert('Kegagalan Respon Server');
                    });


               

            }
        });
        }else{
                            this.setState({option_empty:true});
                            this.setState({loading_option:false});
                            this.setState({product_option:[]});
        }

    }

    getOptionHotelLinx2(){
        AsyncStorage.getItem('config', (error, result) => {
            if (result) {    
                let config = JSON.parse(result);

        var myHeaders = new Headers();
        myHeaders.append("Authorization", "Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VyIjp7ImlkIjoxNDEsInJvbGUiOiJ1c2VyIn0sImV4cCI6MTYyMzQwMjczMjE2MywiaWF0IjoxNjIzMzE2MzMyfQ.MzF-Hopn_MDIHxE68buzQ0VFdpByMI9VGDQjTfKTbB0");
        myHeaders.append("Content-Type", "application/json");

        var raw = JSON.stringify({"Rooms":[{"RoomNo":1,"NoofAdults":1,"NoOfChild":0,"ChildAge":[]}],"CityID":15533,"CheckInDate":"06-29-2021","CheckOutDate":"06-30-2021","NoofNights":"1","Nationality":"Indonesia","Filters":{"IsRecommendedOnly":"0","IsShowRooms":"1","IsOnlyAvailable":"1","StarRating":{"Min":0,"Max":5},"HotelIds":22858}});

        var requestOptions = {
        method: 'POST',
        headers: myHeaders,
        body: raw,
        redirect: 'follow'
        };

        fetch("https://api.masterdiskon.com/v1/product/hotel/availability", requestOptions)
        .then(response => response.json())
        .then(result => {
            console.log('getOptionHotelLinx2',JSON.stringify(result));
        })
        .catch(error => {

        });
            }
        });

    }




    getCancelPolicy(item,index){
        console.log('index',index);
        //this.setState({index_cancel:index});
        this.setModalShow(true,{});
        
        AsyncStorage.getItem('config', (error, result) => {
            if (result) {    
                let config = JSON.parse(result);
                var param=this.props.param;
                var url=config.baseUrl;
                var path="api/hotel/Hotelinx/getCancelPolicy/app";

                var myHeaders = new Headers();
                myHeaders.append("Content-Type", "application/json");

                var paramGetCancelPolicy={"param":
                    {
                        "isCombine":item.IsCombineRoom,
                        "malam":param.room + " malam",
                        "kamar":param.noofnights +" kamar",
                        "rToken":item.rToken,
                        "HotelOptionIdNew":item.hotelOptionId,
                        "SKeyNew":item.sKey
                    }
                };
                
                console.log('getCancelPolicyItem',url+path,JSON.stringify(paramGetCancelPolicy));
                console.log('param',url+path,JSON.stringify(param));

                var requestOptions = {
                method: 'POST',
                headers: myHeaders,
                body: JSON.stringify(paramGetCancelPolicy),
                redirect: 'follow'
                };

                fetch(url+path, requestOptions)
                .then(response => response.json())
                .then(result => {
                    this.setState({detailOption:result});
                    console.log('resultCancelPoliycy',JSON.stringify(result));
                    //this.setState({index_cancel:false});
                    //this.setState({dataCancelPolicy:result});
                    this.setState({loading_modal:false});
                    //this.props.setModalLoading();
                  
                    
                })
                .catch(error => {
                    alert('Kegagalan Respon Server');
                });

            }
        });
    }

    getOptionHotelLinxCancel(paramOption){
        AsyncStorage.getItem('config', (error, result) => {
            if (result) {    
                let config = JSON.parse(result);
           
                // var param=this.props.param;
                // console.log('paramhotellinx',JSON.stringify(param));

                var url=config.baseUrl;
                var path="api/hotel/Hotelinx/getCancelPolicyMultyAllRoom/app";

                var myHeaders = new Headers();
                myHeaders.append("Content-Type", "application/json");

                var paramGetCancel={"param":paramOption};
                console.log('paramGetCancel',url+path,JSON.stringify(paramGetCancel));

                var requestOptions = {
                method: 'POST',
                headers: myHeaders,
                body: JSON.stringify(paramGetCancel),
                redirect: 'follow'
                };

                fetch(url+path, requestOptions)
                .then(response => response.json())
                .then(result => {
                    console.log('resultCancel',JSON.stringify(result));
                    console.log('length',result.length);
                    console.log('paramOption',JSON.stringify(paramOption));
                    var newOption=this.rebuildOption(paramOption,result);
                    console.log('newOption',JSON.stringify(newOption));
                    this.setState({loading_cancel:false});
                    this.setState({product_option:newOption});
                    
                    
                })
                .catch(error => {
                    //console.log('errorgetOptionHotelLinxCancel');
                    alert('Kegagalan Respon Serverss');
                });

            }
        });

    }

    searchKeyx(select){
        var link='Summary';
        var param=this.props.param;
        var config=this.props.config;
       // var url=config.baseUrl;
        var product=this.props.product;
        this.props.setLoadingSpinner(true);
        console.log('selected',JSON.stringify(select));

        
        param.hargaKamar=select.Price;
        param.HotelOptionId=select.HotelOptionId;
        param.roomToken=select.RoomToken;
        param.perbedaanhari=param.noofnights;
        param.totalPrice=parseInt(select.Price)*parseInt(param.room)*parseInt(param.noofnights);
        param.subtotal=parseInt(select.Price)*parseInt(param.room)*parseInt(param.noofnights);
        param.total=parseInt(select.Price)*parseInt(param.room)*parseInt(param.noofnights);
        param.Qty=1;
        param.HotelOptionId=select.HotelOptionId;
        param.searchKY=select.SearchKey;
        param.roomTypeName=select.RoomTypeName;
        param.getIsCombineRoom=select.IsCombineRoom;

        console.log('paramGetSEARCHKEY',JSON.stringify(param));
        console.log('select',JSON.stringify(select));


        // var dataParam={param:param};
        // var url=url+"front/api/product/getSearchKey2";
        // console.log(url,JSON.stringify(dataParam));


        var myHeaders = new Headers();
        myHeaders.append("Cookie", "ci_session=2hua0p7r88ct5bkus3m85hah3sd10dqp");

        var formdata = new FormData();
      

        formdata.append("hotelid", param.hotelid);
        formdata.append("city", param.city);
        formdata.append("adults", param.adults);
        formdata.append("stringAdults", param.stringAdults);
        formdata.append("child", param.child);
        formdata.append("stringChild", param.child);
        formdata.append("room", param.room);
        formdata.append("stringRoom", param.stringRoom);
        formdata.append("hargaKamar", param.hargaKamar);
        formdata.append("HotelOptionId", select.HotelOptionId);
        formdata.append("roomToken", select.RoomToken);
        formdata.append("searchKY", select.SearchKey);
        formdata.append("realCki", param.checkin);
        formdata.append("realCko", param.checkout);
        formdata.append("roomTypeName", select.RoomTypeName);
        formdata.append("umuranak", param.umurank);
        formdata.append("stringumurank", param.stringumurank);
        formdata.append("adultnchildparam", param.adultnchildparam);
        formdata.append("getIsCombineRoom", param.getIsCombineRoom);


          console.log('hotelid:'+param.hotelid);
          console.log('city:'+param.city);
          console.log('adults:'+param.adults);
          console.log('stringAdults:'+param.stringAdults);
          console.log('child:'+param.child);
          console.log('stringChild:'+param.stringChild);
          console.log('room:'+param.room);
          console.log('stringRoom:'+param.stringRoom);
          console.log('hargaKamar:'+param.hargaKamar);
          console.log('HotelOptionId:'+param.HotelOptionId);
          console.log('roomToken:'+param.roomToken);
          console.log('searchKY:'+param.searchKY);
          console.log('realCki:'+param.checkin);
          console.log('realCko:'+param.checkout);
          console.log('roomTypeName:'+select.RoomTypeName);
          console.log('umuranak:'+param.umurank);
          console.log('stringumurank:'+param.stringumurank);
          console.log('adultnchildparam:'+param.adultnchildparam);
          console.log('getIsCombineRoom:'+param.getIsCombineRoom);



        // // var data={
        // //     "hotelid": param.hotelid,
        // //     "city": param.city,
        // //     "adults": param.adults,
        // //     "stringAdults": param.stringAdults,
        // //     "child": param.child,
        // //     "stringChild": param.child,
        // //     "room": param.room,
        // //     "stringRoom": param.stringRoom,
        // //     "hargaKamar": param.hargaKamar,
        // //     "HotelOptionId": select.HotelOptionId,
        // //     "roomToken": select.RoomToken,
        // //     "searchKY": select.SearchKey,
        // //     "realCki": "16 Feb 2021",
        // //     "realCko": "17 Feb 2021",
        // //     "roomTypeName": select.RoomTypeName,
        // //     "umuranak": param.umurank,
        // //     "stringumurank": param.stringumurank,
        // //     "noofnights": param.noofnights,
    
        // // }

        // console.log('data',JSON.stringify(data));


       
       
        var requestOptions = {
        method: 'POST',
        headers: myHeaders,
        body: formdata,
        redirect: 'follow'
        };
        console.log('getSearchKey',JSON.stringify(formdata));
        fetch("https://masterdiskon.com/front/product/hotel/getSearchKey/app", requestOptions)
        .then(response => response.json())
        .then(result => {
            console.log('result',JSON.stringify(result));

            // this.props.setLoadingSpinner(false);
            // console.log('productBooking',JSON.stringify(result));
            // var paramz={
            //     param:param,
            //     product:product,
            //     productPart:select,
            //     productBooking:result,
            // }
            // this.props.navigation.navigate(link,
            // {
            //     param:paramz
            // });
        })
        .catch(error => {
            alert('Kegagalan Respon Server');
        });
    }


    searchKey(select){
        var link='Summary';
        var param=this.props.param;
      
        var product=this.props.product;
        this.props.setLoadingSpinner(true);
        this.setState({abort:false});
       
    
    
        param.hargaKamar=select.Price;
        param.HotelOptionId=select.HotelOptionId;
        param.roomToken=select.RoomToken;
        param.perbedaanhari=param.noofnights;
        param.totalPrice=parseInt(select.Price)*parseInt(param.room)*parseInt(param.noofnights);
        param.subtotal=parseInt(select.Price)*parseInt(param.room)*parseInt(param.noofnights);
        param.total=parseInt(select.Price)*parseInt(param.room)*parseInt(param.noofnights);
        param.Qty=1;
        param.HotelOptionId=select.HotelOptionId;
        param.searchKY=select.SearchKey;
        param.roomTypeName=select.RoomTypeName;
        param.getIsCombineRoom=select.IsCombineRoom;
        param.flashsale=0;
    
    
         var dataParam={param:param};

         
     
    
        var myHeaders = new Headers();
        myHeaders.append("Content-Type", "application/json");
        myHeaders.append("Cookie", "ci_session=j7pmnlek9ci5tsui4u1kd0ln2474c6hq");
    
        var raw = JSON.stringify(dataParam);
        console.log('paramssssearchKey',JSON.stringify(dataParam));
    
        var requestOptions = {
        method: 'POST',
        headers: myHeaders,
        body: raw,
        redirect: 'follow'
        };
    
        fetch("https://masterdiskon.com/front/product/hotel/getSearchKey/app", requestOptions)
        .then(response => response.json())
        .then(result => {
    
            this.props.setLoadingSpinner(false);
            console.log('productBooking',JSON.stringify(result));
            var paramz={
                param:param,
                product:product,
                productPart:select,
                productBooking:result,
            }
            console.log('productBooking',JSON.stringify(paramz));
            this.props.navigation.navigate(link,
            {
                param:paramz
            });
        })
        .catch(error => {
            alert('Kegagalan Respon Server');
        });
    }


    onSubmitHotelLinx(select){
        var link='Summary';

        var param=this.props.param;
        var config=this.props.config;
        var url=config.baseUrl;
        var product=this.props.product;
        this.props.setLoadingSpinner(true);
        param.hargaKamar=select.Price;
        param.HotelOptionId=select.HotelOptionId;
        param.roomToken=select.RoomToken;
        param.perbedaanhari=param.noofnights;
        param.totalPrice=parseInt(select.Price)*parseInt(param.room)*parseInt(param.noofnights);
        param.subtotal=parseInt(select.Price)*parseInt(param.room)*parseInt(param.noofnights);
        param.total=parseInt(select.Price)*parseInt(param.room)*parseInt(param.noofnights);
        param.Qty=1;
        param.HotelOptionId=select.HotelOptionId;
        param.searchKY=select.SearchKey;
        param.roomTypeName=select.RoomTypeName;

        console.log('param',JSON.stringify(param));

        var dataParam={param:param};
        var url=url+"front/api/product/getSearchKey2";
        console.log(url,JSON.stringify(dataParam));
        
        var myHeaders = new Headers();
        myHeaders.append("Content-Type", "application/json");

        var raw = JSON.stringify(dataParam);

        var requestOptions = {
        method: 'POST',
        headers: myHeaders,
        body: raw,
        redirect: 'follow'
        };

        fetch(url, requestOptions)
        .then(response => response.json())
        .then(result => {
            this.props.setLoadingSpinner(false);
            console.log('productBooking',JSON.stringify(result));
         
        })
        .catch(error => {
            this.props.setLoadingSpinner(false);
            alert('Kegagalan Respon Server');
        });

    }

 
    onChange(select) {
        const { navigation, product,setMinPerson,setListdataPerson} = this.props;
        this.setState({
            product_option: this.state.product_option.map(item => {
                if (item.id_product_option == select.id_product_option) {
                    return {
                        ...item,
                        checked: true
                    };
                } else {
                    return {
                        ...item,
                        checked: false
                    };
                }
               
            })
        });
        
        this.props.setPrice(select);
    }

    onDetail(select) {
        const { navigation, product,setMinPerson,setListdataPerson} = this.props;
        this.setState({
            product_option: this.state.product_option.map(item => {
                if (item.id_product_option == select.id_product_option) {
                    return {
                        ...item,
                        checkedDetail: true
                    };
                } else {
                    return {
                        ...item,
                        checkedDetail: false
                    };
                }
               
            })
        });
        
        
    }


    render() {
        const {detailOption, dataCancelPolicy,renderMapView, todo, helpBlock,product_option,product_type,loading_option,product,loading_spinner,loading_pilih} = this.state;
        const { navigation} = this.props;
        const priceSplitter = (number) => (number && number.toString().replace(/\B(?=(\d{3})+(?!\d))/g, '.'));

        //console.log('product_option',JSON.stringify(product_option));

        var content_modal=<Modal
                                isVisible={this.state.modalVisible}
                                onBackdropPress={() => {
                                    this.setState({modalVisible:false});
                                }}
                                onSwipeComplete={() => {
                                    this.setState({modalVisible:false});
                                }}
                                swipeDirection={["down"]}
                                style={styles.bottomModal}
                            >
                                <View style={styles.contentFilterBottom}>
                                  
                                   {
                                       this.state.loading_modal == true ?
                                            <View style={styles.contentActionModalBottom}>
                                                <Text>Loading</Text>
                                             </View>
                                             :
                                             <View>
                                                 <View style={styles.contentActionModalBottom}>
                                                 <Text bold body1>Kebijakan Pembatalan</Text>
                                              </View>

                                              <View style={styles.contentActionModalBottom}>
                                                 <Text bold body1>Room : {this.state.detailOption.CancellationRS[0].RoomTypeName}</Text>
                                              </View>
                                             <View style={styles.contentActionModalBottom}>
                                                 <Text>From Date</Text>
                                                 <Text>To Date</Text>
                                                 <Text>Price</Text>
                                              </View>
                                                {this.state.detailOption.CancellationRS[0].CancellationPolicy.map((item, index) => (
                                                    <View style={styles.contentActionModalBottom}>
                                                        <Text>{item.FromDate}</Text>
                                                        <Text>{item.ToDate}</Text>
                                                        <Text>Rp {priceSplitter(Math.ceil(item.CancellationPrice))}</Text>
                                                    </View>
        
                                                ))}
                                         </View>
                                   }
                                       
                                        
                                       
                                        
                                   
                                  
                                </View>
                            </Modal>


        var content=<View></View>
        if(this.state.loading_option===true){
            

            content=<View>
                    <Placeholder
                        Animation={Fade}
                        style={{
                            borderBottomWidth: 1,
                            borderColor: BaseColor.textSecondaryColor,
                            paddingVertical: 10,
                            paddingHorizontal: 0}}
                    >
                        <PlaceholderLine width={50} style={{marginTop: 2,marginBottom:0,height:15}} />
                        <PlaceholderLine width={100} style={{marginTop: 2,marginBottom:0,height:50}} />
                        <PlaceholderLine width={50} style={{marginTop: 2,marginBottom:0,height:40}} />
                    </Placeholder>
                    <Placeholder
                        Animation={Fade}
                        style={{
                            borderBottomWidth: 1,
                            borderColor: BaseColor.textSecondaryColor,
                            paddingVertical: 10,
                            paddingHorizontal: 0
                        
                        }}
                    >
                        <PlaceholderLine width={50} style={{marginTop: 2,marginBottom:0,height:15}} />
                        <PlaceholderLine width={100} style={{marginTop: 2,marginBottom:0,height:50}} />
                        <PlaceholderLine width={50} style={{marginTop: 2,marginBottom:0,height:40}} />
                    </Placeholder>
                    <Placeholder
                        Animation={Fade}
                        style={{
                            borderBottomWidth: 1,
                            borderColor: BaseColor.textSecondaryColor,
                            paddingVertical: 10,
                            paddingHorizontal: 0
                        }}
                    >
                        <PlaceholderLine width={50} style={{marginTop: 2,marginBottom:0,height:15}} />
                        <PlaceholderLine width={100} style={{marginTop: 2,marginBottom:0,height:50}} />
                        <PlaceholderLine width={50} style={{marginTop: 2,marginBottom:0,height:40}} />
                    </Placeholder>
                    <Placeholder
                        Animation={Fade}
                        style={{
                            borderBottomWidth: 1,
                            borderColor: BaseColor.textSecondaryColor,
                            paddingVertical: 10,
                            paddingHorizontal: 0
                        }}
                    >
                        <PlaceholderLine width={50} style={{marginTop: 2,marginBottom:0,height:15}} />
                        <PlaceholderLine width={100} style={{marginTop: 2,marginBottom:0,height:50}} />
                        <PlaceholderLine width={50} style={{marginTop: 2,marginBottom:0,height:40}} />
                    </Placeholder>
                    </View>
        }else{
            
            if (this.state.product_option.length == 0) {

                content=<View
                                    style={{
                                            flexDirection: 'column',
                                            justifyContent: 'center',
                                            alignItems: 'center',
                                            height: '30%',
                                            marginVertical: 50}}
                                    >       
                                    <Image
                                        source={Images.dataempty}
                                        style={{ 
                                            height: 150,
                                            width: 150,
                                        }}
                                        resizeMode="cover"
                                    />
                                    <View><Text>Kamar Tidak Tersedia</Text></View>
                                </View>
            }else{
                if(product_type=='hotelpackage'){
                    content=<FlatList
                    data={product_option}
                    keyExtractor={(item, index) => item.id_product_option}
                    renderItem={({ item }) => (
                        <TouchableOpacity
                            // style={styles.item}
                            onPress={() => 
                            {
                            this.onChange(item)
                            }
                            
                            }
                        >
                            <View style={[styles.itemPrice, { backgroundColor: BaseColor.secondColor == BaseColor.whiteColor ? item.checked : null}]}>
                                    <View style={styles.linePrice}>
                                        <Text body1 bold>
                                            {item.detail_name}
                                        </Text>
                                        
                                      

                                            {
                                                item.checked ?
                                                    <View style={styles.iconRight,{flexDirection:'column'}}>
                                                    
                                      
                                                    <Icon
                                                        name="check-circle"
                                                        size={30}
                                                        color={'green'}
                                                        />
                                                        <Text caption2 style={{color:'green'}}>Dipilih</Text>
                                                    </View>
                                                    :
                                                    <View style={styles.iconRight}>
                                                    <Icon
                                                        name="circle"
                                                        size={30}
                                                        color={'grey'}
                                                        />
                                                    </View>
                                            }
                                        
                                    </View>
                
                                    <View style={styles.linePriceMinMax}>
                                        <View style={{flexDirection:'row'}}>
                                            <View style={{flex:4}}>
                                                       <FastImage
                                                        style={{ width: 100,height:50 }}
                                                            source={{
                                                                uri: item.img_featured_url,
                                                                headers: { Authorization: 'someAuthToken' },
                                                                priority: FastImage.priority.normal,
                                                            }}
                                                        >
                                                        </FastImage>
                                                    
                                            </View>
                                            <View style={[styles.contentService,{flex:8}]}>
                                                {item.fasility.map((item, index) => (
                                                  
                                                    <View
                                                        style={{ alignItems: "center",width:50,marginBottom:5}}
                                                        key={"service" + index}
                                                    >
                                                        {
                                                            item.red==false ? 
                                                            <View style={{ alignItems: "center"}}>
                                                                <Icon
                                                                    name={item.name}
                                                                    size={14}
                                                                    color={BaseColor.primaryColor}
                                                                />
                                                                <Text
                                                                    overline
                                                                    grayColor
                                                                    style={{ marginTop: 4,textAlign:'center'}}
                                                                >
                                                                    {item.label}
                                                                </Text>
                                                            </View>
                                                            :
                                                            <View style={{ alignItems: "center"}}>
                                                                <Icon
                                                                    name={item.name}
                                                                    size={14}
                                                                    color={BaseColor.thirdColor}
                                                                />
                                                                <Text
                                                                    overline
                                                                    style={{ marginTop: 4,textAlign:'center',color:BaseColor.thirdColor}}
                                                                >
                                                                    {item.label}
                                                                </Text>
                                                            </View>
                                                        }
                                                       
                                                    </View>
                                                ))}
                                            </View>
                                        </View>

                                        <View style={{flex:1,flexDirection:'row',justifyContent:'space-between'}}>
                                            <View style={{ flex: 4,alignItems:'flex-start'}}>
                                                    <View style={{flex:1,flexDirection:'row'}}>
                                                        <View style={{backgroundColor:BaseColor.secondColor,paddingHorizontal:5}}>
                                                            <Text caption2 style={[{color:'black'}]}>
                                                            {item.discount} %
                                                            </Text>
                                                        </View>
                                                        <View>
                                                            <Text caption2 style={[{color:'black'},{textDecorationLine: 'line-through', textDecorationStyle: 'solid'}]}>
                                                                Rp {priceSplitter(item.normal_price)}
                                                            </Text>
                                                        </View>
                                                        
                                                        
                                                    </View>
                                                    <View style={{flex:1}}>
                                                        <Text body1 bold style={[{color:BaseColor.primaryColor}]}>
                                                            Rp {priceSplitter(item.price)}
                                                        </Text>
                                                    </View>
                                            </View>
                                            <View style={{flex:8,alignItems:'flex-end'}}>
                                                <Text caption2 style={{color:BaseColor.thirdColor,textAlign:'right'}}>Dapatkan Point Diskon {item.product_point} poin</Text>
                                            
                                                
                                            </View>


                                        </View>
                                    </View>
                                    {
                                    item.checked ?
                                    <View style={{marginTop:10}}>
                                        <View style={{flexDirection:'row'}}>
                                                <Text caption1 bold>Detail</Text>
                                            </View>
                                        <HTML
                                        html={'<div style="font-size:10;">'+item.include+'</div>'}
                                        imagesMaxWidth={Dimensions.get("window").width}
                                        />
                                        </View>
                                        :
                                        <View />
                                    }
                                </View>
                                
                        </TouchableOpacity>
                    )}
                />

                }else if(product_type=='activities'){

                    content=<FlatList
                    data={product_option}
                    keyExtractor={(item, index) => item.id_product_option}
                    renderItem={({ item }) => (
                        
                            <View style={[styles.itemPrice, { backgroundColor: BaseColor.secondColor == BaseColor.whiteColor ? item.checked : null}]}>
                                <TouchableOpacity
                                            onPress={() => 
                                            {
                                            this.onChange(item)
                                            }
                                            }

                                        >
                                    <View style={styles.linePrice}>
                                        <Text body1 bold>
                                            {item.detail_name}
                                        </Text>
                                        
                                    </View>

                                    <View style={{flex:1,flexDirection:'row',justifyContent:'space-between'}}>
                                            <View style={{ flex: 9,alignItems:'flex-start'}}>
                                                    <View style={{flex:1,flexDirection:'row'}}>
                                                        <View style={{backgroundColor:BaseColor.secondColor,paddingHorizontal:5}}>
                                                            <Text caption2 style={[{color:'black'}]}>
                                                            {item.discount} %
                                                            </Text>
                                                        </View>
                                                        <View>
                                                            <Text caption2 style={[{color:'black'},{textDecorationLine: 'line-through', textDecorationStyle: 'solid'}]}>
                                                                Rp {priceSplitter(item.normal_price)}
                                                            </Text>
                                                        </View>
                                                        
                                                        
                                                    </View>
                                                    <View style={{flex:1}}>
                                                        <Text body1 bold style={[{color:BaseColor.primaryColor}]}>
                                                            Rp {priceSplitter(item.price)}
                                                        </Text>
                                                    </View>
                                                    <View style={{flex:1}}>
                                                    <Text caption2 style={{color:BaseColor.thirdColor,textAlign:'right'}}>Dapatkan Point Diskon {item.product_point} poin</Text>
                                                    </View>
                                            </View>
                                            <View style={{flex:3,alignItems:'flex-end'}}>
                                                {
                                                    item.checked ?
                                                        <View style={styles.iconRight,{flexDirection:'column'}}>
                                                        
                                                        <Icon
                                                            name="check-circle"
                                                            size={30}
                                                            color={'green'}
                                                            />
                                                            <Text caption2 style={{color:'green'}}>Dipilih</Text>
                                                        </View>
                                                        :
                                                        <View style={styles.iconRight}>
                                                        <Icon
                                                            name="circle"
                                                            size={30}
                                                            color={'grey'}
                                                            />
                                                        </View>
                                                    }
                                            </View>                                           
                                        </View>

                                        {
                                        item.checked ?
                                        <View style={{marginTop:10}}>
                                            <View style={{flexDirection:'row'}}>
                                                    <Text caption1 bold>Detail</Text>
                                                    
                                                </View>
                                            <HTML
                                            html={'<div style="font-size:10;">'+item.description+'</div>'}
                                            imagesMaxWidth={Dimensions.get("window").width}
                                            />
                                            </View>
                                            :
                                            <View />
                                        }

                                    </TouchableOpacity>
                                </View>
                    
                    )}
                />


                }else if(product_type=='hotelLinx'){
                        console.log('this.state.option_empty',this.state.option_empty);

                        if(this.state.option_empty==false){
                            content=<View style={{marginBottom:40}}><FlatList
                            data={this.state.product_option}
                            keyExtractor={(item, index) => item.id_product_option}
                            renderItem={({ item,index }) => (
                                
                                    <View style={[styles.itemPrice, { backgroundColor: BaseColor.secondColor == BaseColor.whiteColor ? item.checked : null}]}>
                                            <View style={{flexDirection:'row',flex: 1,justifyContent: "flex-start"}}>
                                                <View style={{ flex: 3}}>
                                                <TouchableOpacity 
                                                    onPress={()=>{
                                                        navigation.navigate("PreviewImage",{images:item.images,indexSelected:1});

                                                    }}
                                                    >
                                                <FastImage
                                                    style={{ width: '100%', height: 80,borderRadius:5}}
                                                    source={{ uri: item.img_featured_url }}
                                                    resizeMode={FastImage.resizeMode.stretch}
                                                    cacheControl={FastImage.cacheControl.cacheOnly}
                                                    resizeMethod={'scale'}
                                                   
                                                    >
                                                    </FastImage>
                                                    <Text caption1 style={{color:BaseColor.primaryColor,textAlign:'center'}}>[Lihat gambar]</Text>
                                                    </TouchableOpacity>
                   
                                                </View>
                                                <View style={{flex: 9,marginLeft:10}}>

                                                        <Text body2 semibold>
                                                            {item.detail_name}
                                                        </Text>
                                                
                                                        <View style={{marginBottom:5}}>
                                                            <Text body2  bold style={{color:BaseColor.primaryColor}}>
                                                            {item.MealName}
                                                            </Text>
                                                            <Text body2  bold >
                                                                Fasilitas
                                                            </Text>
                                                            <View style={[{flexDirection: "column",marginTop:5}]}>
                                                                
                                                            <FlatList
                                                            
                                                            horizontal={true}
                                                            data={item.fasility}
                                                            renderItem={({ item, index, separators }) => ( <Tag
                                                                primary
                                                                style={{ marginRight: 15}}
                                                            >
                                                                {item.label}
                                                            </Tag>
                                                       )}
                                                            />

                                                            
                                                                {/* {item.fasility.map((item, index) => (
                                                                
                                                                    <View
                                                                        style={{ alignItems: "center",}}
                                                                        key={"service" + index}
                                                                    >
                                                                        <Tag
                                                                                primary
                                                                                style={{ marginRight: 15 }}
                                                                            >
                                                                                {item.label}
                                                                            </Tag>
                                                                      
                                                                    
                                                                    </View>
                                                                ))} */}
                                                                
                                                            </View>
                                                        </View>

                                                        
                                                        <Text body2  bold style={{color:BaseColor.thirdColor}}>
                                                            Pembatalan
                                                        </Text>

                                                        <View style={{flexDirection:'row',justifyContent:'space-between'}}>
                                                            {/* <Text caption1 style={{color:BaseColor.primaryColor}}>
                                                                {
                                                                this.state.loading_cancel == true ?
                                                                'Loading ...' : 
                                                                
                                                                item.statusCancel == "notRefundable" ? "Tidak dapat dibatalkan" : "Dapat Dibatalkan"
                                                                }
                                                            </Text> */}

                                                            <TouchableOpacity
                                                                onPress={()=>{
                                                                    this.getCancelPolicy(item,index);
                                                                }}
                                                            >
                                                            
                                                               
                                                              
                                                                <View style={{backgroundColor:BaseColor.thirdColor,paddingHorizontal:5,paddingVertical:2,borderRadius:5}}>
                                                                    <Text caption1 style={{color:BaseColor.whiteColor}}>
                                                                    Baca kebijakan
                                                                    </Text>
                                                                </View>
                                                            
                                                            </TouchableOpacity>
                                                        </View>
                                                        
                                                        {
                                                            this.state.index_cancel==index ? 
                                                            <ActivityIndicator /> : <View />
                                                        }

                                                        <View style={{flexDirection:'row',justifyContent:'space-between'}}>
                                                            <View style={{marginTop:10}}>
                                                                <Text caption2  bold style={{justifyContent:'center'}}>
                                                                    Total harga kamar
                                                                </Text>
                                                                <Text body1 bold style={{justifyContent:'center'}}>
                                                                    Rp {priceSplitter(parseInt(item.price)*parseInt(this.state.param.room)*parseInt(this.state.param.noofnights))}
                                                                </Text>
                                                            </View>
                                                            <Button
                                                                style={{ height: 30,width:'50%',borderRadius:2}}
                                                                onPress={() => {  
                                                                    this.searchKey(item)
                                                                    //this.onSubmitHotelLinx(item);
                                                                    //alert('Masih Pengembangan');
                                                                }}
                                                            >
                                                                Pesan
                                                            </Button>
                                                        </View>                                                        
                                                </View>
                                                
                                            </View>
                                    
                                            
                                        </View>
                                    )}
                                />
                                </View>
                        }else{

                            content=<View
                                        style={{
                                                flexDirection: 'column',
                                                justifyContent: 'center',
                                                alignItems: 'center',
                                                height: '30%',
                                                marginVertical: 50}}
                                        >       
                                        <Image
                                            source={Images.dataempty}
                                            style={{ 
                                                height: 150,
                                                width: 150,
                                            }}
                                            resizeMode="cover"
                                        />
                                        <View><Text>Kamar Tidak Tersedia</Text></View>
                                    </View>
                        }
            }
                



            }
        }
        return (
            <View style={{}}>
                {content}
                {content_modal}
            </View>
        );
    }
}

class Informasi extends Component {
    constructor(props) {
        super(props);
        this.state = {
            data:props.data ,
            title:props.title
        };
    }

    componentDidMount() {
        InteractionManager.runAfterInteractions(() => {
            this.setState({ renderMapView: true });
        });
    }

    render() {
        const {data,title} = this.state;
        const { navigation,product } = this.props;
        // var informasi='Biaya penambahan orang dalam kamar mungkin berlaku dan berbeda-beda menurut kebijakan properti.Tanda pengenal berfoto yang dikeluarkan oleh pemerintah dan kartu kredit, kartu debit, dan deposit uang tunai diperlukan saat check-in untuk biaya tidak terduga.Pemenuhan permintaan khusus bergantung pada ketersediaan sewaktu check-in dan mungkin menimbulkan biaya tambahan. Permintaan khusus tidak dijamin akan terpenuhi.';
        
        return (
            // <View style={{marginHorizontal:20}}>
            //     <View style={styles.linePrice}>
            //                         <Text body1 bold>
            //                             {title}
            //                         </Text>
            //                     </View>
            //     <HTML
            //       html={'<div style="font-size:10">'+data+'</div>'}
            //       imagesMaxWidth={Dimensions.get("window").width}
            //     />
            // </View>

            <View style={{backgroundColor:BaseColor.whiteColor,marginTop:10,flex:1}}>
            <View style={{marginHorizontal:20,paddingVertical:10,flex:1}}>
                <TouchableOpacity
                        // onPress={() => 
                        // {
                        //     this.toggleExpand()
                        // }}
                    >
                    <View style={{
                        flexDirection:'row',
                        justifyContent:'space-between',
                        }}>
                        <Text body2 bold>{title}</Text>
                        
                    </View>
                </TouchableOpacity>
                
                
            </View>


                <View
                style={{
                    borderBottomColor: BaseColor.dividerColor,
                    borderBottomWidth: 0.5,
                }}
                />




                <View style={{marginHorizontal:20,paddingVertical:10,flex:1}}>
                    <HTML
                         html={'<div style="font-size:10">'+data+'</div>'}
                        imagesMaxWidth={Dimensions.get("window").width}
                    />
                </View>

            </View>
        );
    }
}





const styles = StyleSheet.create({
    imgBanner: {
        width: "100%",
        height: 250,
        position: "absolute",
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        justifyContent: "center",
        alignItems: "center"
    },
    contentButtonBottom: {
        borderTopColor: BaseColor.textSecondaryColor,
        borderTopWidth: 1,
        paddingHorizontal: 20,
        flexDirection: "row",
        justifyContent: "space-between",
        alignItems: "center"
    },
    tabbar: {
        backgroundColor: "white",
        height: 40
    },
    tab: {
        width: 130
    },
    indicator: {
        backgroundColor: BaseColor.primaryColor,
        height: 1
    },
    label: {
        fontWeight: "400"
    },
    map: {
        ...StyleSheet.absoluteFillObject
    },
    lineInfor: {
        flexDirection: "row",
        borderColor: BaseColor.textSecondaryColor,
        borderBottomWidth: 1,
        paddingVertical: 10
    },
    todoTitle: {
        flexDirection: "row",
        justifyContent: "space-between",
        marginVertical: 15,
        alignItems: "center"
    },
    itemReason: {
        paddingLeft: 10,
        marginTop: 10,
        flexDirection: "row"
    },

    itemPrice: {
        borderBottomWidth: 1,
        borderColor: BaseColor.textSecondaryColor,
        paddingVertical: 10,
        //paddingHorizontal: 20,
    },
    linePrice: {
        flexDirection: "row",
        alignItems: "center",
        justifyContent: "space-between",
        paddingVertical: 5,
    },
    linePriceMinMax: {
        backgroundColor: BaseColor.whiteColor,
        borderRadius: 10
    },
    iconRight: {
        flexDirection: "row",
        justifyContent: "space-between",
        alignItems: "center"
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
        margin: 0,
    },
    contentFilterBottom: {
        flexDirection:'column',
        width: "100%",
        borderTopLeftRadius: 8,
        borderTopRightRadius: 8,
        paddingHorizontal: 20,
        backgroundColor: BaseColor.whiteColor,
        //height:200

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
        //flexDirection:'column',
        flexDirection: "row",
        
        paddingVertical: 10,
        marginBottom: 10,
        justifyContent: "space-between",
        borderBottomColor: BaseColor.textSecondaryColor,
        borderBottomWidth: 1
    },
    contentService: {
        paddingVertical: 10,
        flexDirection: "row",
        flexWrap: "wrap",
        justifyContent: "space-between"
    },
});




