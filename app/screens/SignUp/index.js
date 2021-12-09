import React, { Component } from "react";
import { View, ScrollView, StyleSheet, TextInput, TouchableOpacity, AsyncStorage, BackHandler, Platform } from "react-native";
import { BaseStyle, BaseColor } from "@config";
import { Header, SafeAreaView, Icon, Button, Text } from "@components";
// import styles from "./styles";
import DropdownAlert from 'react-native-dropdownalert';
import ValidationComponent from 'react-native-form-validator';
import InputText from "../../components/InputText";
import { Form, TextValidator } from 'react-native-validator-form';


const styles = StyleSheet.create({
    contain: {
        //alignItems: "center",
        paddingVertical: 50,
        paddingHorizontal: 20,
        width: "100%"
    },
    textInput: {
        height: 46,
        backgroundColor: BaseColor.fieldColor,
        borderRadius: 5,
        marginTop: 10,
        padding: 10,
        width: "100%"
    },



    tabBar: {
        borderTopWidth: 1
    },
    bodyPaddingDefault: {
        paddingHorizontal: 20
    },
    bodyMarginDefault: {
        marginHorizontal: 20
    },
    textInput: {
        height: 46,
        backgroundColor: BaseColor.fieldColor,
        borderRadius: 5,
        padding: 10,
        width: "100%",
        justifyContent: "center"
    },
    safeAreaView: {
        flex: 1,
        backgroundColor: BaseColor.whiteColor
    },
    contentProfile: {
        paddingVertical: 5

    }
});



export default class SignUp extends ValidationComponent {
    constructor(props) {
        super(props);
        this.state = {

            // name: "",
            firstname: "",
            lastname: "",
            username: "",
            password: "",
            passwordConfirm: "",
            email: "",
            // address: "",


            loading: false,
            success: {
                // name: true,
                firstname: true,
                lastname: true,
                username: true,
                password: true,
                passwordConfirm: true,
                email: true,
                // address: true
            },

            colorButton: BaseColor.greyColor,
            colorButtonText: BaseColor.whiteColor,
            disabledButton: true
        };
        this.getConfig();
        this.getSession();
        this.getConfigApi();

        //this.handleBackButtonClick = this.handleBackButtonClick.bind(this);
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

    // componentWillMount() {
    //     BackHandler.addEventListener('hardwareBackPress', this.handleBackButtonClick);
    // }

    // componentWillUnmount() {
    //     BackHandler.removeEventListener('hardwareBackPress', this.handleBackButtonClick);
    // }

    // handleBackButtonClick() {
    //     this.props.navigation.navigate('SignIn');
    //     //this.props.navigation.goBack(null);
    //     return true;
    // }


    getConfig() {
        AsyncStorage.getItem('config', (error, result) => {
            if (result) {
                let config = JSON.parse(result);
                ////console.log('getConfig',config);
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

    onSubmit() {
        const { navigation } = this.props;
        let { config, name, firstname, lastname, username, password, passwordConfirm, email, address, success } = this.state;




        this.setState({ loading: true });
        if (firstname == "" || lastname == "" || username == "" || password == "" || passwordConfirm == "" || email == "") {
            this.setState({
                success: {
                    ...success,
                    firstname: firstname != "" ? true : false,
                    lastname: lastname != "" ? true : false,
                    username: username != "" ? true : false,
                    password: password != "" ? true : false,
                    passwordConfirm: passwordConfirm != "" ? true : false,
                    email: email != "" ? true : false,
                }
            });
        } else {
            let config = this.state.configApi;
            let baseUrl = config.baseUrl;
            let url = baseUrl + "front/api_new/AuthRegister/registrasi_proses_app";
            console.log('configApi', JSON.stringify(config));
            console.log('urlss', url);


            //var url = config.baseUrl + "front/api_new/AuthRegister/registrasi_proses_app";
            var data = { "firstname": firstname, "lastname": lastname, "username": username, "password": password, "passwordConfirm": passwordConfirm, "email": email }
            const param = { "param": data }

            console.log("------------------data param submit register--------------");
            console.log(url, JSON.stringify(param));

            var myHeaders = new Headers();
            myHeaders.append("Content-Type", "application/json");
            var raw = JSON.stringify(param);
            var requestOptions = {
                method: 'POST',
                headers: myHeaders,
                body: raw,
                redirect: 'follow'
            };

            fetch(url, requestOptions)
                .then(response => response.json())
                .then(result => {
                    var param = result;
                    console.log(JSON.stringify(param));

                    this.setState({ loading: false });
                    console.log(JSON.stringify(result));
                    if (result.success == false) {

                        if (result.error == 'not_same') {
                            this.dropdown.alertWithType('error', 'Error', JSON.stringify(result.message));
                        } else if (result.error == 'already_register') {
                            this.dropdown.alertWithType('error', 'Error', JSON.stringify(result.message));
                        }
                    } else {
                        this.onLoginGoogle(param);
                        //var userSession=result.userSession;
                        //navigation.navigate("Verify",{user:userSession});
                    }

                })
                .catch(error => {
                    this.setState({ loading: false });
                    alert('Kegagalan Respon Server')
                });

        }
    }



    onLoginGoogle(param) {
        const { redirect, config } = this.state;
        const { navigation } = this.props;

        var url = config.baseUrl + "front/api_new/AuthLogin/login_app_google";

        // const param=param;
        // console.log('dataParamLoginGoogle',JSON.stringify(param));

        var myHeaders = new Headers();
        myHeaders.append("Content-Type", "application/json");
        var raw = JSON.stringify(param);
        var requestOptions = {
            method: 'POST',
            headers: myHeaders,
            body: raw,
            redirect: 'follow'
        };

        fetch(url, requestOptions)
            .then(response => response.json())
            .then(result => {
                console.log('onLoginGoogle', JSON.stringify(result));
                var userSession = result.userSession;
                userSession.loginVia = "google";
                this.setState({ loading: false });
                if (result.success == false) {
                    this.dropdown.alertWithType('error', 'Error', JSON.stringify(result.message));
                    if (result.error == 'not_verify') {
                        navigation.navigate("Verify", { user: userSession, redirect: this.props.navigation.state.params.redirect, param: this.props.navigation.state.params.param });
                    }
                }

            })
            .catch(error => alert('Kegagalan Respon Server'));





    }


    validationSubmit() {
        this.validate({
            passwordConfirm: { required: true },
            password: { required: true },
            email: { required: true, email: true },
            username: { required: true },
            firstname: { required: true },
            lastname: { required: true },

        });

        var errorMsg = this.getErrorMessages();
        return errorMsg;
    }


    // validation(){
    //     var passwordConfirm=this.state.passwordConfirm;
    //     var password = this.state.password;
    //     var email=this.state.email;
    //     var username=this.state.username;
    //     var firstname=this.state.firstname;
    //     var lastname=this.state.lastname;

    //     var errorMsg=this.getErrorMessages();

    //     if(passwordConfirm != '' && password !='' && email !='' && username !='' && firstname !='' && lastname !='' ){
    //             if(errorMsg !=''){
    //                 //console.log('not yet');
    //                 this.setState({colorButton:BaseColor.greyColor});
    //                 this.setState({colorButtonText:BaseColor.whiteColor});
    //                 this.setState({disabledButton:true});
    //             }else{
    //                 //console.log('perfect');
    //                 this.setState({colorButton:BaseColor.secondColor});
    //                 this.setState({colorButtonText:BaseColor.primaryColor});
    //                 this.setState({disabledButton:false});
    //             }
    //     }else{
    //             //console.log('not yet');
    //             this.setState({colorButton:BaseColor.greyColor});
    //             this.setState({colorButtonText:BaseColor.whiteColor});
    //             this.setState({disabledButton:true});

    //     }
    // }

    validation() {
        let { name, firstname, lastname, username, password, passwordConfirm, email, address, success } = this.state;

        //var errorMsg=this.getErrorMessages();
        var dataForm = {
            firstname: firstname,
            lastname: lastname,
            username: username,
            password: password,
            passwordConfirm: passwordConfirm,
            email: email,
        }

        //console.log(JSON.stringify(dataForm));

        if (firstname != "" && lastname != "" && username != "" && password != "" && passwordConfirm != "" && email != "") {
            // if(errorMsg !=''){
            //             //console.log('not yet');
            //             this.setState({colorButton:BaseColor.greyColor});
            //             this.setState({colorButtonText:BaseColor.whiteColor});
            //             this.setState({disabledButton:true});
            //         }else{
            //console.log('perfect');
            this.setState({ colorButton: BaseColor.secondColor });
            this.setState({ colorButtonText: BaseColor.primaryColor });
            this.setState({ disabledButton: false });
            //}
        } else {
            //console.log('not yet');
            this.setState({ colorButton: BaseColor.greyColor });
            this.setState({ colorButtonText: BaseColor.whiteColor });
            this.setState({ disabledButton: true });

        }
    }




    handleChange = (key, val, validate) => {
        this.setState({ [key]: val });
        // if(val != '' ){
        //     this.validate(validate);
        // }

        setTimeout(() => {
            this.validation();
        }, 50);
    }


    render() {
        const { navigation } = this.props;
        let { loading, firstname, lastname, username, password, passwordConfirm, email, success } = this.state;

        // var data={"firstname":firstname,"lastname":lastname,"username":username,"password":password,"passwordConfirm":passwordConfirm,"email":email}

        var formFirstname = <View style={{ marginBottom: 20 }}>
            <TouchableOpacity
                style={{ width: '100%' }}
            >
                <Text caption2 style={{ marginTop: -15, color: BaseColor.primaryColor }}>
                    Firstname
                                            </Text>
                <View style={styles.contentProfile}>
                    <View style={{ flex: 6 }}>
                        <TextValidator
                            name="firstname"
                            label="text"
                            validators={['required']}
                            errorMessages={['This field is required']}
                            placeholder="e.g., John"
                            type="text"
                            value={this.state.firstname}
                            onChangeText={(firstname) => {
                                this.setState({ firstname: firstname })
                                setTimeout(() => {
                                    this.validation();
                                }, 50);
                            }}
                            errorStyle={{ underlineValidColor: BaseColor.textPrimaryColor, text: { color: BaseColor.thirdColor }, underlineInvalidColor: BaseColor.thirdColor }}
                            style={
                                Platform.OS === 'ios' ?
                                    { height: 40, borderBottomWidth: 1, borderColor: 'black', marginBottom: 0 }
                                    :
                                    {}
                            }
                        />
                    </View>
                </View>
            </TouchableOpacity>
        </View>


        var formLastname = <View style={{ marginBottom: 20 }}>
            <TouchableOpacity
                style={{ width: '100%' }}
            >
                <Text caption2 style={{ marginTop: -15, color: BaseColor.primaryColor }}>
                    Lastname
                                    </Text>
                <View style={styles.contentProfile}>
                    <View style={{ flex: 6 }}>
                        <TextValidator
                            name="lastname"
                            label="text"
                            validators={['required']}
                            errorMessages={['This field is required']}
                            placeholder="e.g., Doe"
                            type="text"
                            value={this.state.lastname}
                            onChangeText={(lastname) => {
                                this.setState({ lastname: lastname })
                                setTimeout(() => {
                                    this.validation();
                                }, 50);
                            }}
                            style={
                                Platform.OS === 'ios' ?
                                    { height: 40, borderBottomWidth: 1, borderColor: 'black', marginBottom: 0 }
                                    :
                                    {}
                            }
                            errorStyle={{ underlineValidColor: BaseColor.textPrimaryColor, text: { color: BaseColor.thirdColor }, underlineInvalidColor: BaseColor.thirdColor }}
                        />
                    </View>
                </View>
            </TouchableOpacity>
        </View>


        var formUsername = <View style={{ marginBottom: 20 }}>
            <TouchableOpacity
                style={{ width: '100%' }}
            >
                <Text caption2 style={{ marginTop: -15, color: BaseColor.primaryColor }}>
                    Username
                            </Text>
                <View style={styles.contentProfile}>
                    <View style={{ flex: 6 }}>
                        <TextValidator
                            name="username"
                            label="text"
                            validators={['required']}
                            errorMessages={['This field is required']}
                            placeholder="e.g., johndoe"
                            type="text"
                            value={this.state.username}
                            onChangeText={(username) => {
                                this.setState({ username: username })
                                setTimeout(() => {
                                    this.validation();
                                }, 50);
                            }}
                            style={
                                Platform.OS === 'ios' ?
                                    { height: 40, borderBottomWidth: 1, borderColor: 'black', marginBottom: 0 }
                                    :
                                    {}
                            }
                            errorStyle={{ underlineValidColor: BaseColor.textPrimaryColor, text: { color: BaseColor.thirdColor }, underlineInvalidColor: BaseColor.thirdColor }}
                        />
                    </View>
                </View>
            </TouchableOpacity>
        </View>

        var formEmail = <View style={{ marginBottom: 20 }}>
            <TouchableOpacity
                style={{ width: '100%' }}
            >
                <Text caption2 style={{ marginTop: -15, color: BaseColor.primaryColor }}>
                    Email
                                        </Text>
                <View style={styles.contentProfile}>
                    <View style={{ flex: 6 }}>
                        <TextValidator
                            name="email"
                            label="email"
                            validators={['required', 'isEmail']}
                            errorMessages={['This field is required', 'Email invalid']}
                            placeholder="e.g., johndoe@email.com"
                            type="text"
                            value={this.state.email}
                            onChangeText={(email) => {
                                this.setState({ email: email })
                                setTimeout(() => {
                                    this.validation();
                                }, 50);
                            }}
                            style={
                                Platform.OS === 'ios' ?
                                    { height: 40, borderBottomWidth: 1, borderColor: 'black', marginBottom: 0 }
                                    :
                                    {}
                            }
                            errorStyle={{ underlineValidColor: BaseColor.textPrimaryColor, text: { color: BaseColor.thirdColor }, underlineInvalidColor: BaseColor.thirdColor }}
                        />
                    </View>
                </View>
            </TouchableOpacity>
        </View>

        var formPassword = <View style={{ marginBottom: 20 }}>
            <TouchableOpacity
                style={{ width: '100%' }}
            >
                <Text caption2 style={{ marginTop: -15, color: BaseColor.primaryColor }}>
                    Password
                                        </Text>
                <View style={styles.contentProfile}>
                    <View style={{ flex: 6 }}>
                        <TextValidator
                            name="password"
                            label="text"
                            secureTextEntry
                            validators={['required']}
                            errorMessages={['This field is required']}
                            placeholder="********"
                            type="text"
                            value={this.state.password}
                            onChangeText={(password) => {
                                this.setState({ password: password })
                                setTimeout(() => {
                                    this.validation();
                                }, 50);
                            }}
                            style={
                                Platform.OS === 'ios' ?
                                    { height: 40, borderBottomWidth: 1, borderColor: 'black', marginBottom: 0 }
                                    :
                                    {}
                            }
                            errorStyle={{ underlineValidColor: BaseColor.textPrimaryColor, text: { color: BaseColor.thirdColor }, underlineInvalidColor: BaseColor.thirdColor }}
                        />
                    </View>
                </View>
            </TouchableOpacity>
        </View>

        var formPasswordConfirm = <View style={{ marginBottom: 20 }}>
            <TouchableOpacity
                style={{ width: '100%' }}
            >
                <Text caption2 style={{ marginTop: -15, color: BaseColor.primaryColor }}>
                    Password Confirmation
                                </Text>
                <View style={styles.contentProfile}>
                    <View style={{ flex: 6 }}>
                        <TextValidator
                            name="passwordConfirm"
                            label="text"
                            secureTextEntry
                            validators={['required']}
                            errorMessages={['This field is required']}
                            placeholder="********"
                            type="text"
                            value={this.state.passwordConfirm}
                            onChangeText={(passwordConfirm) => {
                                this.setState({ passwordConfirm: passwordConfirm })
                                setTimeout(() => {
                                    this.validation();
                                }, 50);
                            }}
                            style={
                                Platform.OS === 'ios' ?
                                    { height: 40, borderBottomWidth: 1, borderColor: 'black', marginBottom: 0 }
                                    :
                                    {}
                            }
                            errorStyle={{ underlineValidColor: BaseColor.textPrimaryColor, text: { color: BaseColor.thirdColor }, underlineInvalidColor: BaseColor.thirdColor }}
                        />
                    </View>
                </View>
            </TouchableOpacity>
        </View>

        return (
            <SafeAreaView
                style={styles.safeAreaView}
                forceInset={{ top: "always" }}
            >
                <Header
                    title="Sign Up"
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
                        //navigation.navigate('SignIn');
                    }}
                />
                <ScrollView>
                    <View style={styles.contain}>

                        <Form
                            ref="form"
                        //onSubmit={this.onSubmit}
                        >
                            {formFirstname}
                            {formLastname}
                            {formUsername}
                            {formEmail}
                            {formPassword}
                            {formPasswordConfirm}
                            <TouchableOpacity disabled={this.state.disabledButton} onPress={() => this.onSubmit()} >
                                <View pointerEvents='none' style={styles.groupinput}>
                                    <Button
                                        loading={this.state.loading}
                                        style={{ backgroundColor: this.state.colorButton }}
                                        full
                                    >
                                        <Text style={{ color: this.state.colorButtonText }}>Sign Up</Text>
                                    </Button>
                                </View>
                            </TouchableOpacity>
                        </Form>






                    </View>
                </ScrollView>
                <DropdownAlert ref={ref => this.dropdown = ref} messageNumOfLines={10} closeInterval={10000} />

            </SafeAreaView>
        );
    }
}
