import React from "react";
import { StyleSheet } from "react-native";
import { BaseColor, Typography, FontWeight } from "@config";

export default StyleSheet.create({
    default: {
        height: 56,
        borderRadius: 8,
        backgroundColor: BaseColor.secondColor,
        flexDirection: "row",
        justifyContent: "center",
        alignItems: "center",
        paddingHorizontal: 20,

         borderRadius: 18,
                                shadowColor: "#000",
                                shadowOffset: {
                                    width: 0,
                                    height: 2,
                                },
                                shadowOpacity: 0.25,
                                shadowRadius: 3.84,
                                elevation: 5,
        marginVertical:10
    },
    textDefault: {
        ...Typography.headline,
        color: BaseColor.primaryColor,
        fontWeight: FontWeight.semibold
    },
    outline: {
        backgroundColor: BaseColor.whiteColor,
        borderWidth: 1,
        borderColor: BaseColor.primaryColor
    },
    textOuline: {
        color: BaseColor.primaryColor
    },
    full: {
        width: "100%",
        alignSelf: "auto"
    },
    round: {
        borderRadius: 28
    }
});
