import React, { Component } from "react";
import { View, TouchableOpacity, StyleSheet } from "react-native";
import { Text} from "@components";
import { BaseColor } from "@config";
import PropTypes from "prop-types";

const styles = StyleSheet.create({
  contain: {
    flexDirection: "row",
},
  contentLeft: {
    flex: 1,
    alignItems: "flex-start",
    justifyContent: "center"
},
contentCenter: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center"
},
contentRight: {
    flex: 1,
    alignItems: "flex-end",
    justifyContent: "center"
},
    
});

export default class CardCustomTitle extends Component {
    constructor(props) {
        super(props);
        this.state = {
        }
      
    }


    render() {

      const {
            title,
            desc,
            onPress,
            more,
            darkMode
    } = this.props;
    var contentDesc=<View></View>
    if(desc != ""){
      contentDesc= <Text caption2 grayColor>
      {desc}
      </Text>
      }

      
      var contentMore=<View></View>

        if(more==true){
          contentMore= <View style={[styles.contentRight]}>
                        <TouchableOpacity onPress={onPress} activeOpacity={0.9}>
                          <View style={{
                            bottom: 0,
                            paddingVertical: 2,
                            paddingHorizontal: 5,
                            width:'auto',
                            borderRadius:5, 
                            borderWidth: 0, 
                            //borderColor: BaseColor.secondaryColor,
                            backgroundColor:BaseColor.secondColor,
                          }}>
                            <Text caption2>
                                See More
                            </Text>

                          </View>
                        </TouchableOpacity>
                      </View>

        }

        var colorText={}
        
        if(darkMode==true){
          colorText={color:BaseColor.whiteColor}
        }

    

        return (
          <View>
                                <View style={{marginTop: 10,marginLeft: 20,marginRight: 20,marginBottom: 10}}>
                                  <View style={[styles.contain]} >
                                    <View style={[styles.contentLeft]}>
                                      <Text body2 bold style={colorText}>
                                          {title}
                                      </Text>
                                    </View>
                                    {contentMore}
                                   

                                  </View>    
                                  
                                
                                   {contentDesc}
                                </View>
                                </View>
        )
    }
}

CardCustomTitle.propTypes = {
    title:PropTypes.string,
    desc:PropTypes.string,
    onPress : PropTypes.func,
    more:PropTypes.bool,
    darkMode:PropTypes.bool

};

CardCustomTitle.defaultProps = {
    title:"",
    desc:"",
    onPress: () => {},
    more:false,
    darkMode:false

};
