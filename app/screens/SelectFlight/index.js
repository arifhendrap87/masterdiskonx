import React, { Component } from "react";
import {
    View,
    FlatList,
    TextInput,
    TouchableOpacity
} from "react-native";
import { BaseStyle, BaseColor } from "@config";
import { Header, SafeAreaView, Icon, Text, Image } from "@components";
import styles from "./styles";

// Load sample flight data list
import {AsyncStorage} from 'react-native';
import {
    Placeholder,
    PlaceholderMedia,
    PlaceholderLine,
    Fade
  } from "rn-placeholder";
export default class SelectFlight extends Component {
    constructor(props) {
        super(props);
        // Temp data define
        this.state = {
            airplane: "",
            flight: [],
            loading: false,
        };
    }

    componentDidMount() {

        this.setState({ loading_spinner: true }, () => {
            AsyncStorage.getItem('config', (error, result) => {
                if (result) {   
                    let config = JSON.parse(result);
                    var access_token=config.token;
                    var path=config.common_airport_default.dir;
                    var url=config.baseUrl;

                    

                    
                    console.log(url+path,{"param":""});
                   fetch(url+path,{"param":""})
                    .then(response => response.json())
                    .then(result => {
                        this.setState({ loading_spinner: false });
                        this.setState({flight:result});
                        const { navigation } = this.props;
                        const selected = navigation.getParam("selected");
            
                        if (selected) {
                            this.setState({
                                flight: this.state.flight.map(item => {
                                    return {
                                        ...item,
                                        checked: item.code == selected
                                    };
                                })
                            });
                        }

                    })
                    .catch(error => {

                        alert('Kegagalan Respon Server')
                    });

            
                }
            });             

        });
    }

    onChange(select) {
        this.setState({
            flight: this.state.flight.map(item => {
                if (item.code == select.code) {
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

        const { navigation } = this.props;
        var type = navigation.getParam("type");
            if(type=='from'){
                            this.props.navigation.state.params.setBandaraAsal(
                                select.code,select.label
                                )
                            navigation.goBack();
            }else if(type=='to'){
           
                            this.props.navigation.state.params.setBandaraTujuan(
                                select.code,select.label
                                )
                            navigation.goBack();
            }
    }

    search(value){
        this.setState({ loading_spinner: true }, () => {

            AsyncStorage.getItem('config', (error, result) => {
                if (result) {   
                    let config = JSON.parse(result);
                    var access_token=config.token;
                    var path=config.common_airport.dir;
                    var url=config.baseUrl;

                    console.log(url,path,{"param":value});

                 


                    var myHeaders = new Headers();
                    myHeaders.append("Content-Type", "application/json");
                    // myHeaders.append("Cookie", "ci_session=htllmlmq1kc1inaabihi3lqeqv8jjm91");
                    
                    var raw = JSON.stringify({"param":value});
                    
                    var requestOptions = {
                      method: 'POST',
                      headers: myHeaders,
                      body: raw,
                      redirect: 'follow'
                    };
                    
                    fetch(config.baseUrl+"front/api/common/airport", requestOptions)
                      .then(response => response.json())
                      .then(result => {
                          
                        this.setState({ loading_spinner: false });
                            this.setState({flight:result});
                            const { navigation } = this.props;
                            const selected = navigation.getParam("selected");
                
                            if (selected) {
                                this.setState({
                                    flight: this.state.flight.map(item => {
                                        return {
                                            ...item,
                                            checked: item.code == selected
                                        };
                                    })
                                });
                            }
                    
                    })
                    .catch(error => {

                        alert('Kegagalan Respon Server')
                    }); 


                }
            }); 
        });

     }

    onSave() {
        const { navigation } = this.props;
        var selectParent = navigation.getParam("selected");
        var type = navigation.getParam("type");
        const selected = this.state.flight.filter(item => item.checked);

        if (selected.length > 0) {
            if(type=='from'){
                this.setState(
                    {
                        loading: true
                    },
                    () => {
                        setTimeout(() => {
                            this.props.navigation.state.params.setBandaraAsal(
                                selected[0].code,selected[0].label
                                )
                            navigation.goBack();
                        }, 50);
                    }
                );

            }else if(type=='to'){
              
                this.setState(
                    {
                        loading: true
                    },
                    () => {
                        setTimeout(() => {
                            this.props.navigation.state.params.setBandaraTujuan(
                                selected[0].code,selected[0].label
                                )
                            navigation.goBack();
                        }, 50);
                    }
                );
            }
        }
    }

    
    onClick(code,label) {
        var type=this.props.navigation.state.params.type;
        if(type=='asal'){
            this.props.navigation.state.params.setBandaraAsal(code,label);
        }else if(type=='tujuan'){
            this.props.navigation.state.params.setBandaraTujuan(code,label);
        }
        this.props.navigation.navigate('PageSearchFlight');
    }

    render() {
        const { navigation } = this.props;
        let { flight, loading, airplane,loading_spinner } = this.state;
        return (
            <SafeAreaView
                style={BaseStyle.safeAreaView}
                forceInset={{ top: "always" }}
            >
                <Header
                    title="Pencarian Bandara"
                    renderLeft={() => {
                        return (
                            <Icon
                                name="arrow-left"
                                size={20}
                                color={BaseColor.whiteColor}
                            />
                        );
                    }}
                    // renderRight={() => {
                    //     if (loading) {
                    //         return (
                    //             <ActivityIndicator
                    //                 size="small"
                    //                 color={BaseColor.primaryColor}
                    //             />
                    //         );
                    //     } else {
                    //         return (
                    //             <Text caption1 primaryColor>
                    //                 Save
                    //             </Text>
                    //         );
                    //     }
                    // }}
                    onPressLeft={() => {
                        navigation.goBack();
                    }}
                    //onPressRight={() => this.onSave()}
                />
                <View style={styles.contain}>
                    <TextInput
                        style={BaseStyle.textInput}
                        onChangeText={text => this.search(text)}
                        autoCorrect={false}
                        placeholder="Search Airport"
                        placeholderTextColor={BaseColor.grayColor}
                        selectionColor={BaseColor.primaryColor}
                    />
                    <View style={{ width: "100%", height: "100%" }}>
                        {
                            loading_spinner ? 
                            <Placeholder
                                Animation={Fade}
                                
                            >
                                <View style={{ 
                                            paddingTop: 15,
                                            paddingBottom: 15,
                                            borderBottomWidth: 1,
                                            borderBottomColor: BaseColor.fieldColor}}>
                                    <PlaceholderLine width={100} height={30} style={{marginBottom:0}} />
                                    <PlaceholderLine width={100} height={15} style={{marginTop: 5,marginBottom:0}} />
                                </View>

                                <View style={{ 
                                            paddingTop: 15,
                                            paddingBottom: 15,
                                            borderBottomWidth: 1,
                                            borderBottomColor: BaseColor.fieldColor}}>
                                    <PlaceholderLine width={100} height={30} style={{marginBottom:0}} />
                                    <PlaceholderLine width={100} height={15} style={{marginTop: 5,marginBottom:0}} />
                                </View>

                                <View style={{ 
                                            paddingTop: 15,
                                            paddingBottom: 15,
                                            borderBottomWidth: 1,
                                            borderBottomColor: BaseColor.fieldColor}}>
                                    <PlaceholderLine width={100} height={30} style={{marginBottom:0}} />
                                    <PlaceholderLine width={100} height={15} style={{marginTop: 5,marginBottom:0}} />
                                </View>

                                <View style={{ 
                                            paddingTop: 15,
                                            paddingBottom: 15,
                                            borderBottomWidth: 1,
                                            borderBottomColor: BaseColor.fieldColor}}>
                                    <PlaceholderLine width={100} height={30} style={{marginBottom:0}} />
                                    <PlaceholderLine width={100} height={15} style={{marginTop: 5,marginBottom:0}} />
                                </View>
                            </Placeholder>
                            :
                            <FlatList
                            data={flight}
                            keyExtractor={(item, index) => item.code}
                            renderItem={({ item }) => (
                                <TouchableOpacity
                                    style={styles.item}
                                    onPress={() => this.onChange(item)}
                                >
                                    <View
                                        style={{
                                            flexDirection: "row",
                                            alignItems: "center"
                                        }}
                                    >
                                        <View style={styles.left}>
                                            <Text caption1 semibold>
                                            {item.label} ({item.code})
                                            </Text>
                                            <Text
                                                note
                                                numberOfLines={1}
                                                footnote
                                                grayColor
                                                style={{
                                                    paddingTop: 5
                                                }}
                                            >
                                                {item.city}, {item.country_name}
                                            </Text>
                                        </View>
                                    </View>
                                    {item.checked && (
                                        <Icon
                                            name="check"
                                            size={14}
                                            color={BaseColor.primaryColor}
                                        />
                                    )}
                                </TouchableOpacity>
                            )}
                            />
                        }
                    </View>
                </View>
            </SafeAreaView>
        );
    }
}
