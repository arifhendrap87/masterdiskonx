import { StyleSheet } from "react-native";
import { BaseColor } from "@config";
import * as Utils from "@utils";

export default StyleSheet.create({
    contain: { alignItems: "center" },
    tourItem: {
        width: Utils.scaleWithPixel(135),
        height: Utils.scaleWithPixel(160)
    },
    hotelItem: { width: Utils.scaleWithPixel(160) },
    image: {
        width: 120,
        height: 120,
        borderRadius: 60
    },

    location: {
        flexDirection: "row",
        marginTop: 17
    },
    tagFollow: { width: 100, marginTop: 15 },
    description: {
        paddingTop: 10,
        paddingLeft: 15,
        paddingRight: 15,
        paddingBottom: 30,
        textAlign: "center"
    },
    contentField: {
        backgroundColor: BaseColor.fieldColor,
        paddingTop: 10,
        paddingBottom: 10
    },
    fieldItem: {
        alignItems: "center",
        flex: 1
    },
    imageBanner: {
        width: 135,
        height: 160,
        borderRadius: 10
    },
    txtBanner: {
        position: "absolute",
        left: 10,
        top: 130
    },
    bottomModal: {
        justifyContent: "flex-end",
        margin: 0
    },
    bottomModal: {
        justifyContent: "flex-end",
        margin: 0
    },
    contentFilterBottom: {
        width: "100%",
        borderTopLeftRadius: 8,
        borderTopRightRadius: 8,
        paddingHorizontal: 20,
        backgroundColor: BaseColor.whiteColor
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
        flexDirection: "row",
        paddingVertical: 10,
        marginBottom: 10,
        justifyContent: "space-between",
        borderBottomColor: BaseColor.textSecondaryColor,
        borderBottomWidth: 1
    }
});
