import React from "react";
import { StyleSheet } from "react-native";
import { BaseColor, BaseStyle } from "@config";

export default StyleSheet.create({
    contentButtonBottom: {
        borderTopColor: BaseColor.textSecondaryColor,
        borderTopWidth: 1,
        paddingVertical: 10,
        paddingHorizontal: 20,
        flexDirection: "row",
        justifyContent: "space-between",
        alignItems: "center"
    },
    blockView: {
        paddingVertical: 10,
        paddingHorizontal: 20,
        borderBottomColor: BaseColor.textSecondaryColor,
        borderBottomWidth: 1,
        backgroundColor:BaseColor.whiteColor,

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
                                            marginBottom:10
    }
});
