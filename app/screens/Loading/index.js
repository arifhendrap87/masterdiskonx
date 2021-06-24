import React, { Component } from "react";
import { connect } from "react-redux";
import { AuthActions,ApplicationActions } from "@actions";
import { ActivityIndicator, View } from "react-native";
import { bindActionCreators } from "redux";
import { Images, BaseColor } from "@config";
import SplashScreen from "react-native-splash-screen";
import {Text } from "@components";
import {DataMasterDiskon} from "@data";
import {AsyncStorage} from 'react-native';
import AnimatedLoader from "react-native-animated-loader";

class Loading extends Component {
    constructor(props) {
        super(props);
        this.state={
            DataMasterDiskon:DataMasterDiskon[0],
            error:false,
            //loaderJson:'app/assets/loader_paperline.json'
        }
    }

    getConfig(){
        this.setState({ loading_spinner: true }, () => {

        let { navigation, auth } = this.props;
        const {DataMasterDiskon} =this.state;
        var url=DataMasterDiskon.baseUrl;
        var dir='front/api/common/config';
     
        var params={"param":{"username":DataMasterDiskon.username,"password":DataMasterDiskon.password}};
        console.log('getConfigsss',url+dir,JSON.stringify(params));
        var param={
            method: 'POST',
            headers: {
              Accept: 'application/json',
              'Content-Type': 'application/json',
            },
            body: JSON.stringify(params),
          }

            fetch(url+dir,param)
                .then(response => response.json())
                .then(result => {
                    //console.log('config',JSON.stringify(result));
                    //this.props.actions.changeConfig(result);
                    var config=result;
                    this.setState({config:config});
                    this.setState({loading_spinner:false});
                    AsyncStorage.setItem('config', JSON.stringify(config));
                    navigation.navigate('Home');
                })
                .catch(error => {
                    this.setState({error:true});
                    //this.setState({loaderJson:'app/assets/lostconnection.json'})
                    //alert('Kegagalan Respon Server')
                });

    });
    }


    onProcess() {
        let { navigation, auth } = this.props;
        let status = auth.login.success;

        
        if(this.props.navigation.state.params && this.props.navigation.state.params.redirect){
            var redirect=this.props.navigation.state.params.redirect;
        }else{
            var redirect='';
        }
        
        if(this.props.navigation.state.params && this.props.navigation.state.params.param){
            var param=this.props.navigation.state.params.param;
        }else{
            var param='';
        }
        
        if(redirect != ''){
                navigation.navigate(redirect,{param:param});
        }else{
            this.getConfig();
        }
    }





    // componentWillMount() {
    //     this.props.actions.authentication(false, response => {});
    // }

    componentDidMount() {
        SplashScreen.hide();
        this.onProcess();
    }

    render() {
        const {loaderJson}=this.state;
        return (
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
                        source={this.state.error==false ? require('app/assets/loader_paperline.json') : require('app/assets/lostconnection.json')}
                        animationStyle={{width: 300,height: 300}}
                        speed={1}
                      />
                    <Text>
                        {this.state.error==false ?  'Connecting..Masterdiskon' : 'Terjadi kesalahan'}
                    </Text>
                </View>
            </View>
        );
    }
}

const mapStateToProps = state => {
    return {
        auth: state.auth
    };
};

const mapDispatchToProps = dispatch => {
    return {
        actions: bindActionCreators({AuthActions,ApplicationActions}, dispatch)

    };
};

export default connect(
    mapStateToProps,
    mapDispatchToProps
)(Loading);