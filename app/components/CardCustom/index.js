import React, { Component } from "react";
import { View, TouchableOpacity,StyleSheet,ImageBackground,TouchableWithoutFeedback,Dimensions,Clipboard} from "react-native";
import { Image, Text,StarRating,Icon} from "@components";
import { BaseColor,Images } from "@config";
import PropTypes from "prop-types";
import * as Utils from "@utils";
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
import FastImage from 'react-native-fast-image';
import ImageSize from 'react-native-image-size';
import DropdownAlert from 'react-native-dropdownalert';
const {height, width} = Dimensions.get('window');
const itemWidth = (width - 30) / 2;

const styles = StyleSheet.create({
});

import {
  BallIndicator,
  BarIndicator,
  DotIndicator,
  MaterialIndicator,
  PacmanIndicator,
  PulseIndicator,
  SkypeIndicator,
  UIActivityIndicator,
  WaveIndicator,
} from 'react-native-indicators';

export default class CardCustom extends Component {
    constructor(props) {
        super(props);
        this.state = {
          img:Images.doodle
        }
      
    }

 capitalize(string) {
      return string.charAt(0).toUpperCase() + string.slice(1).toLowerCase();
  }

  getMeta(url){   
    var img = new Image();
    img.onload = function(){
        //alert( this.width+' '+ this.height );
        console.log('getMeta',this.width);
    };
    img.src = url;
}
  
isEmpty(obj) {
  for(var key in obj) {
      if(obj.hasOwnProperty(key))
          return false;
  }
  return true;
}



    renderDefault() {
      const priceSplitter = (number) => (number && number.toString().replace(/\B(?=(\d{3})+(?!\d))/g, '.'));

        const {
         
            style,
            propImage,
            propInframe,
            propTitle,
            propDesc,
            propPrice,
            propPriceCoret,
            propStar,
            propLeftRight,
            propPoint,
            propIsCampaign,
            propDarkMode,
            onPress,
            propOther,
            loading,
            sideway,
            propCopyPaste
        } = this.props;


        
        var contentImage=<View></View>
        var contentStar=<View></View>
        var contentText=<View></View>
        
        var contenInframeBottom=<View></View>
        var contenInframeTop=<View></View>
        
        var contentTextTitle=<View></View>
        var contentTextTitleDesc=<View></View>
        var contentTextTitlePrice=<View></View>
        var contentStartFrom=<View></View>
        var contentPrice=<View></View>
        var contentPriceCoret=<View></View>
        
        var contentTextTitleLeftRight=<View></View>
        var contentLeft=<View></View>
        var contentRight=<View></View>
        var contentStar=<View></View>
        var contentPoint=<View></View>
        var contentCampaingn=<View />

        var colorText={}
        var colorTextYellow={}
        var discount=<View />
        
        if(propDarkMode==true){
          colorText={color:BaseColor.whiteColor}
        }

        if(propDarkMode==true){
          colorTextYellow={color:BaseColor.secondColor}
        }
      
        //--------contentCampaign---------//
        if(propIsCampaign.active=="1"){
          contentCampaingn=<View style={{
            backgroundColor:BaseColor.primaryColor,
          paddingHorizontal:5,borderRadius:5,marginRight:10,width:'auto'}}>
          <Text caption2 style={[{color:BaseColor.whiteColor}]}>
             {propIsCampaign.name_campaign}
          </Text>
          </View>

        }

        if(propPoint != 0){
          contentPoint=<View style={{flexDirection:'row',paddingVertical:5}}>
            
            {/* <Icon
                                name="user"
                                size={10}
                                color={BaseColor.primaryColor}
                                style={{marginRight:10}}
                            /> */}
                            <Text overline style={[colorText]}>
             Dapatkan point diskon {propPoint} poin
          </Text>
          </View>

        }
          
      //---------content untuk inframe---------//
      if(propInframe.top != ""){
        contenInframeTop=<View style={{
          margin:10,
          position: "absolute",
          top: 0,
          padding: 2,
          zIndex:2,
          // backgroundColor:BaseColor.primaryColor,
          width:'auto',
          borderRadius:5,
          flexDirection: 'row', 
          justifyContent: 'flex-end'}}
                                      
                                >
                                <Text
                                    caption1
                                    bold
                                    style={{color:BaseColor.whiteColor}}
                                >
                              {propInframe.top}
                          </Text>
                        </View>
        }
        
        
        if(propInframe.bottom != ""){
          contenInframeBottom=<View style={{
            margin:10,
            position: "absolute",
            bottom: 0,
            padding: 2,
            zIndex:2,
            //backgroundColor:'yellow',
            width:'auto',
            borderRadius:5
            }}>
                                  <Text
                                      caption2
                                      bold
                                      style={{color:BaseColor.whiteColor}}
                                  >
                                {propInframe.bottom}
                                {/* {(this.capitalize(propInframe.bottom.replace(/_/gi, ' ')))} */}
                            </Text>
                          </View>
          }
          
        //---------content untuk inframe---------//
        
        
        //---------content untuk image-----------//
        if(loading==true){
          contentImage=<Placeholder
                  Animation={Fade}
                  style={{marginTop: 5}}
                >
                    <PlaceholderLine width={100} height={propOther.hasOwnProperty('height') ? propOther.height : height/7} style={{marginTop: 2,marginBottom:0,borderRadius: 5}} />
                </Placeholder>
        }else{
          if(propOther.inCard==false){
            var styleCustomImage={
              borderTopLeftRadius: 0,
              borderTopRightRadius: 0,
              borderBottomLeftRadius:0,
              borderBottomRightRadius:0,
         
              }
            
          }else{
            if(propOther.horizontal==false){
              var styleCustomImage={
                // borderTopLeftRadius: 10,
                // borderTopRightRadius: 0,
                // borderBottomLeftRadius:10,
                // borderBottomRightRadius:0,

                borderTopLeftRadius: 0,
                borderTopRightRadius: 0,
                borderBottomLeftRadius:0,
                borderBottomRightRadius:0,
           
                }
            }else{
              var styleCustomImage={
                borderTopLeftRadius: 0,
                borderTopRightRadius: 0,
                // borderTopLeftRadius: 10,
                // borderTopRightRadius: 10,

                borderBottomLeftRadius:propOther.inFrame==true ? 0 : 0,
                borderBottomRightRadius:propOther.inFrame==true ? 0 : 0,

                // borderBottomLeftRadius:propOther.inFrame==true ? 0 : 10,
                // borderBottomRightRadius:propOther.inFrame==true ? 0 : 10,
               
              }
            }
          }
         


          
       
          if(sideway==true){
          styleCustomImage.width=(width - 30) / 3;
          }
          
         
        
          contentImage=<FastImage
              style={[
                styleCustomImage,
                {
                  height:propOther.hasOwnProperty('height') ? propOther.height : height/7,
                  //height: Utils.scaleWithPixel(propImage.height),
                  //width: "100%",
                  backgroundColor:BaseColor.lightPrimaryColor,
                }
              ]}
              source={this.state.img}
              // source={{
              //   uri:propImage.url,
              //   headers:{ Authorization: 'someAuthToken' },
              //   priority: FastImage.priority.normal,
              // }}
              resizeMode={FastImage.resizeMode.cover}
              cacheControl={FastImage.cacheControl.cacheOnly}
              resizeMethod={'scale'}
              onLoad={evt =>{
                this.setState({img:{
                  uri:propImage.url,
                  headers:{ Authorization: 'someAuthToken' },
                  priority: FastImage.priority.normal,
                }
                })
              }
            }
            >
               {contenInframeTop}
              
              <View style={{
                position: 'absolute',
                top: 0,
                right: 0,
                bottom: 0,
                left: 0,
                backgroundColor: 'black',
                opacity: 0.4,
                zIndex:0
              }}/>
              {contenInframeBottom}
             
            </FastImage>
             
           
        }
        
        
        //---------content untuk image-----------//
        
        
        
        //---------content untuk text-----------//
        if(loading==true){
          contentText=<Placeholder
                        Animation={Fade}
                        style={{marginTop: 5}}
                      >
                          {/* <PlaceholderLine width={50} style={{marginTop: 2,marginBottom:0,borderRadius: 10}} />
                          <PlaceholderLine width={100} style={{marginTop: 2,marginBottom:0}} />
                          <PlaceholderLine width={50} style={{marginTop: 2,marginBottom:0}} /> */}
                      </Placeholder>
        }else{
          
          if(propTitle.text != ""){
            contentTextTitle=<View style={{marginTop: 10}}>
                            <Text
                                caption1
                                bold
                                numberOfLines={2}
                                style={colorText}
                            >
                                {propTitle.text}
                            </Text>
                          </View>
          }
          if(propDesc.text != ""){
            contentTextTitleDesc=<View style={{marginTop: 0}}>
                            <Text
                                caption2 grayColor
                                numberOfLines={2}
                            >
                                {propDesc.text}
                            </Text>
                          </View>
          }
          

          if(propPriceCoret.price != 0){
            if(propPriceCoret.discount !=0){
            var discount=<View style={{backgroundColor:BaseColor.secondColor,paddingHorizontal:5,borderRadius:5,marginRight:10}}>
                            <Text caption2 style={[{color:'black'}]}>
                              {propPriceCoret.discount} %
                            </Text>
                          </View>

            }
            contentPriceCoret=<View style={{flex:1,flexDirection:'row'}}>
                              {
                                propPriceCoret.discountView==true ?
                                discount : <View />
                              }
                                                  
            
            <Text caption1 bold
            style={[{textDecorationLine: 'line-through', textDecorationStyle: 'solid',marginRight:5},colorText]}
                            >
                                Rp {propPriceCoret.price}
            </Text>
            {
              propPriceCoret.discountView==false ?
              <Text caption1 bold
              style={[{color:'green'},colorText]}
                              >
                                  Rp {propPriceCoret.priceDisc}
              </Text> : <View />
            }
            
                            
                            </View>
          }
         
          
          
         
          if(propPrice.startFrom == true){
            

            if(propPrice.price != 0){
              contentStartFrom=<Text
                                overline
                                style={[{marginTop:2},colorText]}
                            >
                                Start From
                            </Text>
            }
                          
          }
          
          
          //if(propPrice.price != ""){
            var styles={}
            if(propPrice.startFrom == true){

              if(propPrice.price != 0){
                styles={marginLeft:10,color:BaseColor.primaryColor}
              }else{
                styles={marginLeft:0,color:BaseColor.thirdColor}
              }
              
            }else{
              styles={marginLeft:0,color:BaseColor.thirdColor}
            }

            // if(propPrice.price=='Kamar Penuh'){
            // contentPrice=<Text
            //   footnote
            //                     bold
            //                     style={[styles,colorText]}
            //                 >
            //                    Kamar Penuh
            //                 </Text>
            // }else if(propPrice.price=='loading'){
            //   contentPrice=<View style={{flexDirection:'row'}}>
            //                 <Text
            //                     footnote
            //                     bold
            //                     style={[styles,colorTextYellow,{marginRight:20}]}
            //                 >
            //                     Rp
            //                 </Text>
            //                 <DotIndicator color={BaseColor.primaryColor} size={5} />
            //     </View>
            
            // }else{
            //   contentPrice=<Text
            //   footnote
            //                     bold
            //                     style={[styles,colorTextYellow]}
            //                 >
            //                     Rp {propPrice.price}
            //                 </Text>

            // }
            
          
            
          //}

          if(propPrice.price==0){
            contentPrice=<Text
              footnote
                                bold
                                style={[styles,colorTextYellow]}
                            >
                                Kamar Penuh
                            </Text>
          }else if(propPrice.price=='loading'){
            contentPrice=<Text
              footnote
                                bold
                                style={[styles,colorTextYellow]}
                            >
                                Loading ...
                            </Text>
          }else if(propPrice.price=='empty'){
            contentPrice=<View />
          }else{
            contentPrice=<Text
              footnote
                                bold
                                style={[styles,colorTextYellow]}
                            >
                                Rp {priceSplitter(propPrice.price)}
                            </Text>
          }
          
          
        contentTextTitlePrice=<View style={{flex: 1,flexDirection: "row"}}>{contentStartFrom}{contentPrice}</View>
          
          if(propLeftRight.left != ""){
            contentLeft=<View style={{flex: 5,
                                        alignItems: "flex-start",
                                        justifyContent: "center",}}
                                        
                                  >
                                  <Text
                                      caption1
                                      bold
                                  >
                                {propLeftRight.left}
                            </Text>
                          </View>
          }
          
          
          if(propLeftRight.right != ""){
            contentRight=<View style={{flex: 5,
                                        alignItems: "flex-end",
                                        justifyContent: "center",}}
                                        
                                  >
                                  <Text
                                      caption1
                                      bold
                                  >
                                {propLeftRight.right}
                            </Text>
                          </View>
          }


          var contentCopyPaste=<View />
          if(propCopyPaste.enabled == true){
            contentCopyPaste=<View style={{flexDirection:'row'}}>
                        
                        <View style={{
                          flex: 1,
                          alignItems: "center",
                          justifyContent: "center",
                        }}
                          
                                >

                                                    <TouchableOpacity 
                                                    style={{flexDirection:'row',
                                                    backgroundColor:BaseColor.thirdColor,
                                                    width:'100%',alignItems:'center',justifyContent: "center",
                                                    paddingVertical:0,
                                                    borderRadius:5}}
                                                    onPress={() => 
                                                        {

                                                            Clipboard.setString(propCopyPaste.left);
                                                            //  this.dropdown.alertWithType('success', 'Copy Text Invoice', propCopyPaste.left);

                                                        }}>
                                                    <View style={{flexDirection:'row'}}>
                                                    <Text whiteColor>{propCopyPaste.left}</Text>
                                                    <Icon
                                                        name="copy"
                                                        size={16}
                                                        style={{marginLeft:10,color:BaseColor.whiteColor}}
                                                        
                                                    />
                                                    </View>
                                                    </TouchableOpacity>


                                                    {/* <DropdownAlert ref={ref => this.dropdown = ref} messageNumOfLines={10} closeInterval={200} /> */}

                        
                        </View>
                        </View>
          }
          
          
        contentTextTitleLeftRight=<View style={{flex: 1,flexDirection: "row"}}>{contentLeft}{contentRight}</View>
        
        if(propStar.enabled==true){
        contentStar=<View style={{flexDirection: "row",
                                justifyContent: "space-between"}}>
                      <StarRating
                          disabled={true}
                          starSize={12}
                          maxStars={5}
                          rating={propStar.rating}
                          //selectedStar={rating => {}}
                          fullStarColor={BaseColor.yellowColor}
                      />
                  </View>
        }
        
        var styleCustomText={flex:1,marginTop:propOther.horizontal==false ? 0 : -5}
        if(propOther.inFrame==true){
          
          if(propOther.horizontal==false){
            styleCustomText.paddingHorizontal=10;
          styleCustomText.borderTopWidth=0;
          styleCustomText.paddingBottom=20;
          styleCustomText.backgroundColor=BaseColor.whiteColor;
          // styleCustomText.borderBottomRightRadius=10;
          // styleCustomText.borderBottomLeftRadius=0;
          // styleCustomText.borderTopRightRadius=10;
          // styleCustomText.borderTopLeftRadius=0;

          styleCustomText.borderBottomRightRadius=0;
          styleCustomText.borderBottomLeftRadius=0;
          styleCustomText.borderTopRightRadius=0;
          styleCustomText.borderTopLeftRadius=0;
          
          }else{
            styleCustomText.paddingHorizontal=10;
          styleCustomText.borderTopWidth=0;
          styleCustomText.paddingBottom=20;
          styleCustomText.backgroundColor=BaseColor.whiteColor;
          // styleCustomText.borderBottomRightRadius=10;
          // styleCustomText.borderBottomLeftRadius=10;

          styleCustomText.borderBottomRightRadius=0;
          styleCustomText.borderBottomLeftRadius=0;
            
          }
        }

       

        if(propOther.inCard==false){
          styleCustomText.paddingHorizontal=0;
          styleCustomText.borderTopWidth=0;
          styleCustomText.paddingBottom=0;
          //styleCustomText.backgroundColor=BaseColor.whiteColor;
        }
        contentText=<View style={[styleCustomText,{flex:1}]}>
                    {contentTextTitle}
                    {contentTextTitleDesc}
                    {contentPriceCoret}
                    {contentTextTitlePrice}
                    {contentStar}
                    {contentTextTitleLeftRight}
                    {contentCopyPaste}
                    {contentPoint}
                    {contentCampaingn}
                    
                    </View>
        
        }
        
        //---------content untuk text-----------//
        var marginBottom=0;
        var styleCustom={};
       styleCustom.width=propOther.width;
        var card=<View />

        if(propOther.sideway==true){
          card=<View />
        }else{
          card
        }
        var flex='column';
        if(sideway==true){
          flex='row';
        }
        return (
                <TouchableOpacity 
                //activeOpacity={0.7} 
                style={[styleCustom,{
                  flex:1,
                  flexDirection:flex,
                  borderRadius: 0,
                  // shadowColor: "#000",
                  // shadowOffset: {
                  //   width: 0,
                  //   height: 2
                  // },
                  // shadowOpacity: 0.25,
                  // shadowRadius: 4,
                  // elevation: 5,
                  borderWidth:1,
                  borderColor:BaseColor.greyColor
                  },style]} onPress={onPress}>
                    
                      {contentImage}
                  
                      {
                      propOther.inFrame==true ?
                      contentText
                      :
                      <View />
                      }
                   
                    
                </TouchableOpacity>                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                 
            
        );
    }
    

    render() {
        return this.renderDefault();
    }
}

CardCustom.propTypes = {
    style: PropTypes.oneOfType([PropTypes.object, PropTypes.array]),
    propImage :PropTypes.oneOfType([PropTypes.object, PropTypes.array]),
    propInframe :PropTypes.oneOfType([PropTypes.object, PropTypes.array]),
    propTitle :PropTypes.oneOfType([PropTypes.object, PropTypes.array]),
    propDesc :PropTypes.oneOfType([PropTypes.object, PropTypes.array]),
    propPrice :PropTypes.oneOfType([PropTypes.object, PropTypes.array]),
    propPriceCoret :PropTypes.oneOfType([PropTypes.object, PropTypes.array]),
    propLeftRight :PropTypes.oneOfType([PropTypes.object, PropTypes.array]),
    propCopyPaste :PropTypes.oneOfType([PropTypes.object, PropTypes.array]),
    propStar :PropTypes.oneOfType([PropTypes.object, PropTypes.array]),
    propOther:PropTypes.oneOfType([PropTypes.object, PropTypes.array]),
    propIsCampaign :PropTypes.oneOfType([PropTypes.object, PropTypes.array]),
    propDarkMode:PropTypes.bool,
    propPoint:PropTypes.string,
    propIsFlashsale:PropTypes.bool,
    onPress : PropTypes.func,
    loading : PropTypes.bool,
    grid: PropTypes.bool,
    sideway: PropTypes.bool,
};

CardCustom.defaultProps = {
    style: {},
    propImage :{},
    propInframe :{},
    propTitle :{},
    propDesc :{},
    propPrice :{},
    propPriceCoret :{price:0,priceDisc:0,discount:0,discountView:true},
    propLeftRight :{},
    propCopyPaste :{},
    propStar : {},
    propOther : {},
    onPress: () => {},
    propPoint:"0",
    propIsFlashsale:false,
    propDarkMode:false,
    propIsCampaign:{
      "name_campaign": "0",
      "slug_campaign": "0",
      "valid_end": "0",
      "active": "0",
      "type": "0",
      "type_product": "0",
      "value": "0",
      "price": "235000"
  },
    loading : true,
    grid: false,
    sideway:false
};
