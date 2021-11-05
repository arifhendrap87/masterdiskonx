import React, { Component } from "react";
import { View, FlatList, Switch, ScrollView,TouchableOpacity,TextInput } from "react-native";
import { BaseStyle, BaseColor } from "@config";
import {
    Header,
    SafeAreaView,
    Icon,
    Text,
    BookingTime,
    Tag,
    StarRating
} from "@components";
import RangeSlider from "rn-range-slider";
import * as Utils from "@utils";
import { StyleSheet } from "react-native";
import {DataLoading,DataConfig,DataHotelLinx,DataTrip} from "@data";
const styles = StyleSheet.create({
    contain: {
        paddingVertical: 10,
        width: "100%"
    },
    roundLine: {
        flexDirection: "row",
        justifyContent: "space-between",
        alignItems: "center",
        marginTop: 20,
        marginHorizontal: 20
    },
    contentRange: {
        flexDirection: "row",
        justifyContent: "space-between",
        marginVertical: 5
    },
    contentResultRange: {
        flexDirection: "row",
        justifyContent: "space-between",
        marginTop: 10
    },
    rowCenter: {
        flexDirection: "row",
        alignItems: "center"
    },
    lineCategory: {
        flexDirection: "row",
        alignItems: "center",
        marginBottom: 20
    }
});


export default class HotelLinxFilter extends Component {
    constructor(props) {
        super(props);
        this.state = {
            listdata:DataHotelLinx,
            scrollEnabled: true,
            priceBegin: 40000,
            priceEnd: 15000000,
           
            

            
            rate: [
                // { id: "ALL", selected: true, title: "All" },
                { id: 5, selected: false},
                { id: 4, selected: false},
                { id: 3, selected: false},
                { id: 2, selected: false},
                { id: 1, selected: false},
            ],


            recommendFilter:false,
            filterRecommended:'',
            filterRate:[],
            filterName:''


        };
    }


    


    

    
   

    

    toggleSwitchRecommend = value => {
        this.setState({ recommendFilter: value });
        if(value==true){
           this.setState({filterRecommended:'Recommended'});
        }else{
            this.setState({filterRecommended:''});
        }
    };


    onSelectRate(selected) {
        this.setState({
            rate: this.state.rate.map(item => {
                return {
                    ...item,
                    selected:
                        selected.id == item.id ? !item.selected : item.selected
                };
            })
        });
        
        setTimeout(() => {
            var filterRate=[];
            var rate=this.state.rate;
            for (const item of rate) {
                if(item.selected==true){
                    filterRate.push(item.id);
                }
            }
            this.setState({filterRate:filterRate});
        }, 50);

    }

    submitFilter(){
        const { navigation } = this.props;
        const {priceBegin,priceEnd,filterRate,filterRecommended,filterName}=this.state;

        const filter = {
            //filter_airline_code: filter_airline_code => filterAirline.includes(filter_airline_code.toUpperCase()),
            filter_rating: filterRate,

            //filter_transit: filter_transit => filterTransits.includes(filter_transit),
            filter_recommended: filterRecommended,

            filter_price: [priceBegin,priceEnd],
            filter_name:filterName

          };
          
          //console.log('filter',JSON.stringify(filter));

        //   var filtersParam={}

        //   if(filterRate.length != 0)
        //   {
        //   filtersParam.filter_rating=filter_rating => filterRate.includes(filter_rating);
        //   }
          
        //   if (filterRecommended==='Recommended'){
        //   filtersParam.filter_recommended=filter_recommended => filter_recommended === filterRecommended;
        //   }
  
        //   filtersParam.filter_price=filter_price => filter_price <= priceEnd && filter_price >= priceBegin;       
        //   const filters = filtersParam;

        //   console.log('filters',JSON.stringify(filters))

       // this.props.navigation.state.params.filterProcess(filter);
       var param=this.props.navigation.state.params.param;
       if(filter.filter_rating.length != 0){
            param.ratingH=filter.filter_rating.toString();
        }else{
            param.ratingH="";
        }

        if(filter.filter_recommended == "Recommended"){
            param.rHotel="true";
        }else{
            param.rHotel="";
        }

        if(filter.filter_name != ""){
            param.srcdata=filter.filter_name;
        }else{
            param.srcdata="";
        }
        param.startkotak="0";
        
        param.minimbudget=filter.filter_price[0].toString();
        param.maximbudget=filter.filter_price[1].toString();
        //navigation.goBack();

       
        console.log('parammmmm',JSON.stringify(param));
        this.props.navigation.state.params.filterProcess(param);
        navigation.goBack();
        
    }

    filterProcess(filters)
    {       
            var products=this.state.listdata;
            const filtered=this.filterArray(products, filters);
            console.log('filtered',JSON.stringify(filtered));
          
    }

    filterArray(array, filters) {
        const filterKeys = Object.keys(filters);
        return array.filter(item => {
          // validates all filter criteria
          return filterKeys.every(key => {
            // ignores non-function predicates
            if (typeof filters[key] !== 'function') return true;
            return filters[key](item[key]);
          });
        });
    }

    render() {
        const { navigation } = this.props;
        const {
            round,
            scrollEnabled,
            priceBegin,
            priceEnd,
            rate
        } = this.state;
        const priceSplitter = (number) => (number && number.toString().replace(/\B(?=(\d{3})+(?!\d))/g, '.'));
        return (
            <SafeAreaView
                style={BaseStyle.safeAreaView}
                forceInset={{ top: "always" }}
            >
                <Header
                    title="Filter"
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
                            <Text caption1 whiteColor numberOfLines={1}>
                                Apply
                            </Text>
                        );
                    }}
                    onPressLeft={() => navigation.goBack()}
                    onPressRight={() => this.submitFilter()}
                />
                <ScrollView
                    scrollEnabled={scrollEnabled}
                    onContentSizeChange={(contentWidth, contentHeight) =>
                        this.setState({
                            scrollEnabled: Utils.scrollEnabled(
                                contentWidth,
                                contentHeight
                            )
                        })
                    }
                >
                    <View style={styles.contain}>
                        <View style={{flexDirection:'row',marginHorizontal:20,marginBottom:10}} >
                            <TextInput
                                style={BaseStyle.textInput}
                                onChangeText={text => {this.setState({filterName:text})}}
                                autoCorrect={false}
                                placeholder="Cari berdasarkan nama"
                                placeholderTextColor={BaseColor.grayColor}
                                selectionColor={BaseColor.primaryColor}
                            />
                        </View>
                        

                        <View style={{flexDirection:'row',marginHorizontal:20}} >
                            <View style={{flexDirection:'row',flex: 10,justifyContent: "flex-start",alignItems: "center"}}>
                                    <View>
                                        <Text caption1 semibold>
                                            Rekomendasi
                                        </Text>
                                    
                                    </View>
                            </View>
                            <View
                                style={{flex: 2,justifyContent: "center",alignItems: "flex-end"}}
                            >
                                        <Switch name="angle-right" 
                                        size={18} 
                                        onValueChange={this.toggleSwitchRecommend}
                                        value={this.state.recommendFilter}
                                    />
                            </View>
                        </View>

                        <View style={styles.roundLine}>
                            <Text caption1 semibold>
                                Rating
                            </Text>
                        </View>

                        <View style={{ marginLeft: 20, marginTop: 20 }}>
                        {rate.map((item, index) => {
                            return (
                                <TouchableOpacity
                                    key={index.toString()}
                                    style={styles.lineCategory}
                                    onPress={() => this.onSelectRate(item)}
                                >
                                    <Icon
                                        name={
                                            item.selected
                                                ? "checkmark-circle-outline"
                                                : "ellipse-outline"
                                        }
                                        size={24}
                                        color={BaseColor.primaryColor}
                                    />
                                    <StarRating
                                        disabled={true}
                                        starSize={20}
                                        maxStars={5}
                                        rating={item.id}
                                        //selectedStar={rating => {}}
                                        fullStarColor={BaseColor.yellowColor}
                                        style={{marginLeft:20}}
                                    />
                                </TouchableOpacity>
                            );
                        })}
                        </View>


                        



                        <View style={{ marginTop: 20, marginHorizontal: 20 }}>
                            <Text caption1 semibold>
                                BUDGET
                            </Text>
                            <View style={styles.contentRange}>
                                <Text caption1 grayColor>
                                    Rp 40.000
                                </Text>
                                <Text caption1 grayColor>
                                    Rp 15.000.000
                                </Text>
                            </View>
                            <RangeSlider
                                style={{
                                    width: "100%",
                                    height: 40
                                }}
                                thumbRadius={12}
                                lineWidth={5}
                                gravity={"center"}
                                labelStyle="none"
                                min={100000}
                                max={10000000}
                                step={1}
                                selectionColor={BaseColor.primaryColor}
                                blankColor={BaseColor.textSecondaryColor}
                                onValueChanged={(low, high, fromUser) => {
                                    this.setState({
                                        priceBegin: low,
                                        priceEnd: high
                                    });
                                }}
                                onTouchStart={() => {
                                    this.setState({
                                        scrollEnabled: false
                                    });
                                }}
                                onTouchEnd={() => {
                                    this.setState({
                                        scrollEnabled: true
                                    });
                                }}
                            />
                            <View style={styles.contentResultRange}>
                                <Text caption1>Range Price</Text>
                                <Text caption1>
                                    IDR {priceSplitter(priceBegin)} - IDR {priceSplitter(priceEnd)}
                                </Text>
                            </View>
                        </View>

                    </View>
                </ScrollView>
            </SafeAreaView>
        );
    }
}
