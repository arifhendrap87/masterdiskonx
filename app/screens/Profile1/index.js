import React, { Component } from "react";
import { View, ScrollView, AsyncStorage,TouchableOpacity,Platform,FlatList,Share} from "react-native";
import { BaseStyle, BaseColor,Images } from "@config";

import {
    Image,
    Header,
    SafeAreaView,
    Icon,
    Text,
    Tag,
    Button,
    HelpBlock,
    Coupon
} from "@components";
import styles from "./styles";
import CardCustomProfile from "../../components/CardCustomProfile";
import NotYetLogin from "../../components/NotYetLogin";
import {
    GoogleSignin,
    GoogleSigninButton,
    statusCodes,
  } from '@react-native-community/google-signin';
  import Modal from "react-native-modal";
import appleAuth, {
    AppleButton,
    AppleAuthError,
    AppleAuthRequestScope,
    AppleAuthRequestOperation,
  } from '@invertase/react-native-apple-authentication';
  import CardCustomTitle from "../../components/CardCustomTitle";
  import CouponCard from "../../components/CouponCard";
// Load sample data
import { UserData, HotelData, TourData,CouponsData} from "@data";
import ImagePicker from 'react-native-image-crop-picker';
import DropdownAlert from 'react-native-dropdownalert';

//import Share from 'react-native-share';
export default class Profile1 extends Component {
    constructor(props) {
        super(props);

        // Temp data define
        this.state = {

            tours: TourData,
            hotels: HotelData,
            userData: UserData[0],
            listdata_customer:[{"key":1,"label":"Contact","old":"adult","fullname":"Mr arif pambudi","firstname":"arif","lastname":"pambudi","birthday":"","nationality":"Indonesia","passport_number":"","passport_country":"","passport_expire":"","phone":"79879879879","title":"Mr","email":"matadesaindotcom@gmail.com","nationality_id":"ID","nationality_phone_code":"62","passport_country_id":""}],
            login:true,
            userSession:{},
            modalVisible:false,
            avatar:Images.defaultAvatar,
            avatar_real:Images.defaultAvatar,
            option:[
                {
                    option_list:"gallery",
                    option_list_label:"From Gallery",
                    icon:"",
                },
                {
                    option_list:"camera",
                    option_list_label:"From Camera",
                    icon:"",
                },
            ],
            coupons: CouponsData,
            loadingCoupon:true

        };
        this.updateParticipant = this.updateParticipant.bind(this);
        this.updateParticipantPassword = this.updateParticipantPassword.bind(this);
    
    }


    getConfig(){    
        AsyncStorage.getItem('config', (error, result) => {
            if (result) {    
                let config = JSON.parse(result);
                //console.log('getConfig',config);
                this.setState({config:config});
            }
        
        });
    }
    
    
    getSession(){    
        AsyncStorage.getItem('userSession', (error, result) => {
            if (result) {    
                let userSession = JSON.parse(result);
                console.log('getSession',userSession);
                var id_user=userSession.id_user;
                var avatar=userSession.avatar;

                if(avatar != null){
                    this.setState({avatar:{uri:avatar}});
                }


                this.setState({id_user:id_user});
                this.setState({userSession:userSession});
            }
        });
    }
    
    onLogOut() {
        var loginVia=this.state.userSession.loginVia;
      
        if(loginVia=='form'){

            AsyncStorage.removeItem('userSession');
            this.setState({ loading: true }, () => {
                this.setState({ loading: false });
                setTimeout(() => {
                    //this.authentication('Profile');
                    this.props.navigation.navigate("Loading",{redirect:'Home'});
                }, 50);

            });    
        }else if(loginVia=='google'){
            this._signOut();
            AsyncStorage.removeItem('userSession');
            this.setState({ loading: true }, () => {
                this.setState({ loading: false });
                setTimeout(() => {
                    //this.authentication('Profile');
                    this.props.navigation.navigate("Loading",{redirect:'Home'});
                }, 50);

            });        


        }else if(loginVia=='apple'){
            //this._signOut();
            
            // const appleAuthRequestResponse = await appleAuth.performRequest({
            //     requestedOperation: AppleAuthRequestOperation.LOGOUT
            //   })
            //   .catch((error) => {
            //     console.log("Caught logout error..", error)
            //   })
            // 



            this.setState({ loading: true }, () => {
                this.setState({ loading: false });
                setTimeout(() => {
                    //this.authentication('Profile');
                    this._signOutApple();
                    AsyncStorage.removeItem('userSession');
                    this.props.navigation.navigate("Loading",{redirect:'Home'});
                }, 50);

            });   
            
            


        }
    }

    _signOutApple = async () => {
        try {
            const appleAuthRequestResponse = await appleAuth.performRequest({
                requestedOperation: AppleAuthRequestOperation.LOGOUT
            });
            const credentialState = await appleAuth.getCredentialStateForUser(
                appleAuthRequestResponse.user
            );
            console.log("Credential state ", credentialState);
            if (credentialState === AppleAuthCredentialState.REVOKED) {
                console.log("User is unauthenticated");
            }
            } catch (appleLogoutError) {
            console.warn("Apple logout error: ", appleLogoutError);
            }
      };



    _signOut = async () => {
        try {
          //await GoogleSignin.revokeAccess();
          await GoogleSignin.signOut();
          this.setState({ user: null }); // Remember to remove the user from your app's state as well
        } catch (error) {
          console.error(error);
        }
      };

      

     onShare = async () => {
   
     

        //var referral_code=this.state.userSession.refferal_code;
        try {
          const result = await Share.share({
           title: 'Refferal Code',
      message: 'Master Diskon Refferal Code : '+this.state.userSession.username, 
      //url: 'https://play.google.com/store/apps/details?id=nic.goi.aarogyasetu&hl=en'
          });
          if (result.action === Share.sharedAction) {
            if (result.activityType) {
              // shared with activity type of result.activityType
            } else {
              // shared
            }
          } else if (result.action === Share.dismissedAction) {
            // dismissed
          }
        } catch (error) {
          alert(error.message);
        }
    };


    authentication(redirect='') {
        
        this.setState(
            {
                loading: true
            },
            () => {
                this.props.actions.authentication(true, response => {
                    if (response.success) {
                        this.props.navigation.navigate("Loading",{redirect:redirect});
                    } else {
                        this.setState({
                            loading: false
                        });
                    }
                });
            }
        );
    }


    addDate(dt, amount, dateType) {
        switch (dateType) {
        case 'days':
            return dt.setDate(dt.getDate() + amount) && dt;
        case 'weeks':
            return dt.setDate(dt.getDate() + (7 * amount)) && dt;
        case 'months':
            return dt.setMonth(dt.getMonth() + amount) && dt;
        case 'years':
            return dt.setFullYear( dt.getFullYear() + amount) && dt;
        }
    }

    formatDateToString(date){
        // 01, 02, 03, ... 29, 30, 31
        var dd = (date.getDate() < 10 ? '0' : '') + date.getDate();
        // 01, 02, 03, ... 10, 11, 12
        var MM = ((date.getMonth() + 1) < 10 ? '0' : '') + (date.getMonth() + 1);
        // 1970, 1971, ... 2015, 2016, ...
        var yyyy = date.getFullYear();
     
        // create the format you want
        return (yyyy + "-" + MM + "-" + dd);
     }

     setUser(){
        let minDatePassport = new Date();
        minDatePassport = this.formatDateToString(minDatePassport);
        minDatePassport=minDatePassport;

        let dtDefAdult = new Date();
        dtDefAdult = this.addDate(dtDefAdult, -13, 'years');
        var def_date_adult =this.formatDateToString(dtDefAdult);

        var def_passport_number="12345678";
        var def_passport_country="Indonesia";
        var def_passport_expire=minDatePassport;
        var def_passport_country_id="ID";
        var def_phone="12345678";
        var def_email="email@gmail.com";


        AsyncStorage.getItem('userSession', (error, result) => {
            if (result) {  
            let userSession = JSON.parse(result);
            var customer = [];
            for (var i=1; i<=1; i++) {
            var obj = {};
                obj['key'] = i;
                obj['label'] = "Contact";
                obj['old'] = 'adult';

                obj['fullname'] = userSession.fullname;
                obj['firstname'] = userSession.firstname;
                obj['lastname'] = userSession.lastname;
                obj['birthday'] = '';
                obj['nationality'] = userSession.nationality;
                obj['passport_number'] = '';
                obj['passport_country'] = '';
                obj['passport_expire'] = '';
                obj['phone'] = userSession.phone;
                obj['title'] = userSession.title;
                obj['email'] = userSession.email;

                obj['nationality_id'] = userSession.nationality_id;
                obj['nationality_phone_code'] = userSession.nationality_phone_code;

                obj['passport_country_id'] = '';


                customer.push(obj)
            }
            AsyncStorage.setItem('setDataCustomer',JSON.stringify(customer));
            this.setState({listdata_customer:customer});
            setTimeout(() => {
            }, 50);

            
            }
        });


     }

     claimCoupon(id){
        //const {login,userSession}=this.state;
        const {login,userSession}=this.state;
        var myHeaders = new Headers();
        myHeaders.append("Accept", "application/json");
        myHeaders.append("Content-Type", "application/json");
        myHeaders.append("Cookie", "ci_session=gur1sg8tu7micu8i028lqn1sa4tcaa5k");

        var raw="";
        if(login==true){
            var param={
                "param":{
                    "id" : id,
                    "id_user" : userSession.id_user,
                    "platform" : "app"
                }
            };
            var raw = JSON.stringify(param);

        }

        var url="https://masterdiskon.com/front/api/product/claim_coupon";
        console.log('urlCoupon',url,JSON.stringify(param));
        
        var requestOptions = {
        method: 'POST',
        headers: myHeaders,
        body: raw,
        redirect: 'follow'
        };

        fetch(url, requestOptions)
        .then(response => response.json())
        .then(result => {
            if(result.success==false){
                this.dropdown.alertWithType('error', 'Error', JSON.stringify(result.message));

            }else{

                this.dropdown.alertWithType('success', 'Success', JSON.stringify(result.message));
                this.updateClainPromo(id);
            }
   

        })
        .catch(error => {
            console.log(JSON.stringify(error));
            alert('Kegagalan Respon Server claimCoupon');
        });
    }


    updateClainPromo(id){
        const {coupons}=this.state;

        const newProjects = coupons.map(p =>
            p.id_coupon === id
            ? { ...p, 
                claimed: 1, 
                
                }
            : p
        );
        console.log('coupons',JSON.stringify(coupons));
        //this.setState({coupons:result.data});
        this.setState({coupons:newProjects});

    }

     renderItem(item) {
        const priceSplitter = (number) => (number && number.toString().replace(/\B(?=(\d{3})+(?!\d))/g, '.'));

        return (
            <Coupon
                style={{
                    marginVertical: 0,
                    marginRight: 10,
                    width:200
                }}
                name={item.coupon_code}
                code={item.coupon_code}
                description={item.coupon_code}
                valid={this.convertDateText(item.end_date)}
                remain={priceSplitter('Rp '+item.minimum)}
                onPress={() => {
                    //alert(item.id_coupon);
                    this.claimCoupon(item.id_coupon);
                    //this.props.navigation.navigate("HotelDetail");
                }}
                quantity={item.quantity}
                claimed={item.claimed}
                usedKuota={item.usedKuota}
                claimable={item.claimed}
                usedCoupon={false}
            />
        );
    }

    convertDateText(date){
        var d = new Date(date);
        var days = ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"];
        // var months = ["January","February","March","April","May","June","July","August","September","October","November","December"];
        var months = ["Jan","Feb","Mar","Apr","May","Jun","Jul","Aug","Sep","Oct","Nov","Dec"];

        return d.getDate()+" "+months[d.getMonth()]+" "+d.getFullYear();
    }


     componentWillMount() {

        let { navigation, auth } = this.props;
        AsyncStorage.getItem('userSession', (error, result) => {
            if (result) {    
               
                this.setState({login:true});
              
            }else{
    
                this.setState({login:false});
            }
        });
    
    }
    
    componentDidMount(){
        const {navigation} = this.props;
        this.getConfig();
        this.getSession();
        this.setUser();

        

            navigation.addListener ('didFocus', () =>{
                this.setState({ loading_spinner: true });
                setTimeout(() => {
                    if(this.state.login==true){
                    this.getCoupon();
                    }
                }, 50);
            });

        
    }

    getCoupon(){
        const {login,userSession}=this.state;
        
        this.setState({ loadingCoupon: true }, () => {
            var myHeaders = new Headers();
            myHeaders.append("Accept", "application/json");
            myHeaders.append("Content-Type", "application/json");
            myHeaders.append("Cookie", "ci_session=gur1sg8tu7micu8i028lqn1sa4tcaa5k");

            var raw="";
            if(login==true){
                var param={"param":{"id_user":userSession.id_user}};
                var raw = JSON.stringify(param);
                console.log('paramCoupon',JSON.stringify(param));
            

            var requestOptions = {
            method: 'POST',
            headers: myHeaders,
            body: raw,
            redirect: 'follow'
            };

            fetch("https://masterdiskon.com/front/api/product/coupon", requestOptions)
            .then(response => response.json())
            .then(result => {
                console.log('resultCoupon',JSON.stringify(result));
                this.setState({coupons:result.data});

            })
            .catch(error => {
                console.log(JSON.stringify(error));
                alert('Kegagalan Respon Server getCoupon');
            });
            }

        });

    }

    updateParticipant(
        key,
        fullname,
        firstname,
        lastname,
        birthday,
        nationality,
        passport_number,
        passport_country,
        passport_expire,
        phone,
        title,
        email,
        nationality_id,
          nationality_phone_code,
          passport_country_id,
        type
        ){
        AsyncStorage.getItem('config', (error, res) => {
            if (res) {    
                let config = JSON.parse(res);

                AsyncStorage.getItem('userSession', (error, result) => {
                    if (result) {    
                        let userSession = JSON.parse(result);
                        //console.log('getSession',userSession);
                        var id_user=userSession.id_user;

                        var userSessionUpdate={
                            address: userSession.address,
                            avatar: userSession.avatar,
                            birthday: birthday,
                            cart: userSession.cart,
                            city_name: userSession.city_name,
                            email: userSession.email,
                            firstname: firstname,
                            fullname: fullname,
                            gender: userSession.gender,
                            id_city: userSession.id_city,
                            id_user: userSession.id_user,
                            lastname: lastname,
                            loginVia: userSession.loginVia,
                            nationality: nationality,
                            nationality_id: nationality_id,
                            nationality_phone_code: nationality_phone_code,
                            passport_country: passport_country,
                            passport_country_id: passport_country_id,
                            passport_expire: passport_expire,
                            passport_number: passport_number,
                            phone: phone,
                            postal_code: userSession.postal_code,
                            status: userSession.status,
                            title: title,
                            un_nationality: userSession.un_nationality,
                            username: userSession.username,
                        }
                        // console.log('userSessionUpdate',JSON.stringify(userSessionUpdate));
                        AsyncStorage.setItem('userSession', JSON.stringify(userSessionUpdate));
                        var url=config.baseUrl;
                        var path='front/api/user/user_update';
                        var params={"param":userSessionUpdate}
                        console.log('userSessionUpdate',JSON.stringify(params));


                        var param={
                            method: 'POST',
                            headers: {
                              Accept: 'application/json',
                              'Content-Type': 'application/json',
                            },
                            body: JSON.stringify(params),
                          }
            
                        
                        fetch(url+path, param)
                        .then(response => response.json())
                        .then(result => {
                            console.log('resultuserSessionUpdate',JSON.stringify(result));
            
                        })
                        .catch(error => {
                            console.log(JSON.stringify(error));
                            alert('Kegagalan Respon Server updateParticipant');
                        });

                
                        this.getSession();
                    }
                });
            }
        });
  }

  updateParticipantPassword(
   passwordOld,passwordNew,passwordConfirm
    ){
        var data={
            passwordOld:passwordOld,
            passwordNew:passwordNew,
            passwordConfirm:passwordConfirm,

        }
        const param={"param":data}
    }


    selectImageFromCamera(item){
        //console.log('itemss',JSON.stringify(item));
        this.setState({modalVisible:false});
        if(item.option_list=='gallery'){
            ImagePicker.openPicker({
                width: 200,
                height: 200,
                cropping: true,
                includeBase64: true,
                compressImageQuality: 1,
              }).then(image => {
                //console.log(image);
                this.setState({avatar:this.state.avatar_real});
                setTimeout(() => {
                    this._fetchImage(image);
                }, 50);
              });
        }else if(item.option_list=='camera'){
            ImagePicker.openCamera({
                width: 200,
                height: 200,
                cropping: true,
                includeBase64: true,
                compressImageQuality: 1,
              }).then(image => {
                //console.log(image);
                this.setState({avatar:this.state.avatar_real});
                setTimeout(() => {
                    this._fetchImage(image);
                }, 50);
              });

        }
      
    }

    _fetchImage(image) {
        const config=this.state.config;
        const userSession=this.state.userSession;
        var url=config.baseUrl;
        var path=config.user_order.dir;
        

        var myHeaders = new Headers();
        myHeaders.append("Content-Type", "application/json");
        myHeaders.append("Cookie", "ci_session=2nt3oj3b2ut3uaemgtnv8ht88mahgb1b");

        var param={
            "param": {
                "email": userSession.email,
                "id_user": userSession.id_user,
                "foto": image.data
            }
        };
        var raw = JSON.stringify(param);

        var requestOptions = {
        method: 'POST',
        headers: myHeaders,
        body: raw,
        redirect: 'follow'
        };

        fetch("https://masterdiskon.com/front/api/user/user_avatar_update", requestOptions)
        .then(response => response.json())
        .then(result => {
            console.log(JSON.stringify(result));
            var avatar=result.avatar;
            this.setState({avatar:{uri:avatar}});

            AsyncStorage.getItem('userSession', (error, result) => {
                if (result) {    
                    var userSession = JSON.parse(result);
                    userSession.avatar=avatar;
                    //console.log('userSession',JSON.stringify(userSession));
                    AsyncStorage.setItem('userSession', JSON.stringify(userSession));
                }
            });
        })
        .catch(error => { alert('Kegagalan Respon Server _fetchImage');});
    }

    render() {
        const { navigation } = this.props;
        let { tours, hotels, userData,userSession,login,coupons } = this.state;
        var contents=<View />
        if(login==true){ 
            contents=<ScrollView style={{ marginBottom: 20 }}>
            {/* Profile Information */}

            {
            Platform.OS=='android' ?
            
            <View style={{ alignItems: "center",backgroundColor:BaseColor.primaryColor,paddingBottom:10 }}>
                    <TouchableOpacity
                                    style={{}}
                                    onPress={() => {
                                        //this.setState({modalVisible:true});
                                        //this.selectImageFromCamera();
                                        alert('Masih Perbaikan');
                                    }}
                    >
                    <Icon
                        name="pencil-alt"
                        size={20}
                        color={BaseColor.primaryColor}
                        style={{top:20,left:100}}
                    />
                    <Image source={this.state.avatar} style={styles.image} />
                 </TouchableOpacity>
                <Text caption1 whiteColor>
                    {userSession.fullname}
                </Text>
                <Text subhead whiteColor>
                    {userSession.email}
                </Text>
                {/* <Text subhead grayColor>
                   Ref. Code : {userSession.referral_code}
                </Text> */}
                {/* <Tag primary style={styles.tagFollow}
                onPress={() => {
                    this.props.navigation.navigate("ProfileEdit",{
                        sourcePage:'profile',
                        key:1,
                        label:'',
                        fullname:userSession.fullname,
                        firstname:userSession.firstname,
                        lastname:userSession.lastname,
                        birthday:userSession.birthday,
                        nationality:userSession.nationality,
                        passport_number:userSession.passport_number,
                        passport_country:userSession.passport_country,
                        passport_expire:userSession.passport_expire,
                        phone:userSession.phone,
                        title:userSession.title,
                        email:userSession.email,

                        nationality_id:userSession.nationality_id,
                        nationality_phone_code:userSession.nationality_phone_code,
                        
                        passport_country_id:userSession.passport_country_id,

                        updateParticipant: this.updateParticipant,
                        type:'guest',
                        old:'',
                        typeProduct:''
                        
                    
                    });
                }}
                >
                    Edit
                </Tag> */}
            </View>
            :
            <View />
            }
            
            <View style={{}}>
                <View style={{ width: "100%" }}>
                    <View>
                        <CardCustomProfile 
                            title={'Profile'}
                            subtitle={'Edit Profile'}
                            icon={'user'}
                            onPress={() => {
                                this.props.navigation.navigate("ProfileEdit",{
                                    sourcePage:'profile',
                                    key:1,
                                    label:'',
                                    fullname:userSession.fullname,
                                    firstname:userSession.firstname,
                                    lastname:userSession.lastname,
                                    birthday:userSession.birthday,
                                    nationality:userSession.nationality,
                                    passport_number:userSession.passport_number,
                                    passport_country:userSession.passport_country,
                                    passport_expire:userSession.passport_expire,
                                    phone:userSession.phone,
                                    title:userSession.title,
                                    email:userSession.email,
            
                                    nationality_id:userSession.nationality_id,
                                    nationality_phone_code:userSession.nationality_phone_code,
                                    
                                    passport_country_id:userSession.passport_country_id,
            
                                    updateParticipant: this.updateParticipant,
                                    type:'guest',
                                    old:'',
                                    typeProduct:''
                                    
                                
                                });
                            }}
                        
                        />

                        {/* <CardCustomProfile 
                            title={'Promo Kupon'}
                            subtitle={'Silakan klaim kupon'}
                            icon={'gift'}
                            onPress={() => {
                                this.props.navigation.navigate("ProfileSmart",{sourcePage:'profile'});
                            }}
                        
                        /> */}
                        <CardCustomProfile 
                            title={'QuickPick'}
                            subtitle={'Isi data penumpang, dengan satu klik'}
                            icon={'users'}
                            onPress={() => {
                                this.props.navigation.navigate("ProfileSmart",{sourcePage:'profile'});
                            }}
                        
                        />
                        {
                        userSession.loginVia==="form" ?
                         
                        <CardCustomProfile 
                            title={'Ubah Kata Sandi'}
                            subtitle={'Pesenan lebih cepat, isi data penumpang, dengan satu klik'}
                            icon={'lock'}
                            onPress={() => {
                                this.props.navigation.navigate("ProfileEditPassword",{
                                    updateParticipantPassword: this.updateParticipantPassword,
                                });
                            }}
                        
                        />
                        :
                        <View></View>
                        }


                        

                        {/* <HelpBlock
                        title={'Bantuan'}
                        description={'Apa yang bisa kami bantu?'}
                        phone={'021 - 87796010'}
                        email={'cs@masterdiskon.com'}
                        style={{ margin: 20 }}
                        onPress={() => {
                            // navigation.navigate("ContactUs");
                        }}
                        /> */}
                      
                        <View style={{flex:1,flexDirection:'row',justifyContent:'space-between',marginHorizontal:20}}>
                            <View style={{flex:4}}>
                                <CouponCard
                                    style={{
                                        marginVertical: 10,
                                        marginRight: 5
                                    }}
                                    name={'Handphone'}
                                    //code={userSession.email}
                                    description={userSession.nationality_phone_code+"-"+userSession.phone}
                                    // valid={'ad'}
                                    // remain={'ad'}
                                    
                                    onPress={() => {
                                        this.props.navigation.navigate("HotelDetail");
                                    }}
                                    clickAction={false}
                    
                                />
                            </View>
                            <View style={{flex:8}}>
                                    <CouponCard
                                        style={{
                                            marginVertical: 10,
                                            marginLeft: 5
                                        }}
                                        name={'Kode Referal'}
                                        //code={'as'}
                                        description={userSession.username}
                                        // valid={'ad'}
                                        // remain={'ad'}
                                        onPress={() => {
                                            //alert(userSession.refferal_code);
                                            this.onShare(userSession.usernam);
                                            //this.props.navigation.navigate("HotelDetail");
                                        }}
                                        clickAction={true}
                        
                                    />
                            </View>
                        </View>

                        {
                            this.state.loadingCoupon== true ?
                            <View /> :
                            coupons.length != 0 ?

                            <View>
                                <CardCustomTitle 
                                    style={{marginLeft:20}} 
                                    title={'Promo'} 
                                    desc={''}  
                                    more={false}
                                    onPress={() =>
                                        navigation.navigate("HotelCity")
                                    }
                                />

                                <View style={{marginLeft:20}}>
                                    <FlatList
                                    horizontal={true}
                                    showsHorizontalScrollIndicator={false}
                                    data={coupons}
                                    keyExtractor={(item, index) => item.id_coupon}
                                    renderItem={({ item }) => this.renderItem(item)}
                                    />
                                </View>
                            </View>
                            :
                            <View />

                        }

                        

                    </View>
                </View>
            </View>
            
            <View style={{ marginHorizontal: 20}}>
                <Button
                    full
                    loading={this.state.loading}
                    onPress={() => this.onLogOut()}
                >
                    Sign Out
                </Button>
            </View>
            
            <Modal
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
                            <View style={styles.contentSwipeDown}>
                                <View style={styles.lineSwipeDown} />
                            </View>
                            {this.state.option.map((item, index) => (
                                <TouchableOpacity
                                    style={styles.contentActionModalBottom}
                                    key={item.value}
                                    onPress={() => {
                                    //this.onSelect(item)
                                    this.selectImageFromCamera(item);
                                    
                                    }}
                                >
                                    <Text
                                        body2
                                        semibold
                                        primaryColor={item.checked}
                                    >
                                        {item.option_list_label}
                                    </Text>
                                </TouchableOpacity>
                            ))}
                          
                        </View>
                    </Modal>
        </ScrollView>

        }else{

            contents=<NotYetLogin redirect={'Home'} navigation={navigation} />

        }
        return (
            <SafeAreaView
            style={[BaseStyle.safeAreaView,{backgroundColor:BaseColor.bgColor}]}
            forceInset={{ top: "always" }}
            >
                <Header
                    title="Profile"
                    renderLeft={() => {
                        return (
                            <Icon
                                name="arrow-left"
                                size={20}
                                color={BaseColor.whiteColor}
                            />
                        );
                    }}
                    onPressLeft={() => {
                        navigation.goBack();
                    }}
                />
                {contents}
                <DropdownAlert ref={ref => this.dropdown = ref} messageNumOfLines={10} closeInterval={10000} />

            </SafeAreaView>
        );
    }
}
