import "react-native-gesture-handler";
import { StatusBar } from "expo-status-bar";
import React from "react";
import {
    StyleSheet,
    Text,
    View,
    I18nManager,
    TouchableOpacity,
} from "react-native";

import * as Font from "expo-font";
import { useFonts } from "expo-font";

import { NavigationContainer } from "@react-navigation/native";

export default function App() {
    I18nManager.forceRTL(false);

    const [loaded] = useFonts({
        IRANSans: require("./assets/fonts/IRANSans.ttf"),
    });

    if (!loaded) {
        return null;
    }

    return (
        // <NavigationContainer>
        //     <View style={styles.container}>
        //         <Text>Hello, World!</Text>
        //     </View>
        // </NavigationContainer>
        <View style={styles.mainContainer}>
            <View style={styles.calorieStatusContainer}>
                <TouchableOpacity style={{ alignItems: "center" }}>
                    <View style={styles.percentContainer}>
                        <View style={styles.eatenPart}></View>
                        <View style={styles.remainingPart}></View>
                    </View>
                    <Text style={styles.calorieRemaining}>
                        400 کالری باقی‌مانده
                    </Text>
                </TouchableOpacity>
                <View style={styles.buttonsContainer}>
                    <TouchableOpacity
                        style={[styles.btnTop, styles.positiveButton]}
                    ></TouchableOpacity>

                    <TouchableOpacity
                        style={[styles.btnTop, styles.resetButton]}
                    ></TouchableOpacity>
                    <TouchableOpacity
                        style={[styles.btnTop, styles.negativeButton]}
                    ></TouchableOpacity>
                </View>
            </View>
        </View>
    );
}

const styles = StyleSheet.create({
    mainContainer: {
        marginTop: 30,
        width: "100%",
        height: "100%",
        backgroundColor: "#fff",
        alignItems: "center",
        justifyContent: "flex-start",
    },
    calorieStatusContainer: {
        marginTop: 40,
        width: "88%",
        justifyContent: "flex-start",
        alignItems: "center",
    },
    percentContainer: {
        marginTop: 10,
        width: "100%",
        height: 35,
        flexDirection: "row",
        justifyContent: "center",
        alignItems: "center",
    },
    eatenPart: {
        flex: 0.33,
        width: "100%",
        height: "100%",
        backgroundColor: "#14b827",
    },
    remainingPart: {
        flex: 0.676,
        height: "100%",
        backgroundColor: "#b80d1b",
    },
    calorieRemaining: {
        marginTop: 5,
        fontSize: 19,
        fontFamily: "IRANSans",
    },
    buttonsContainer: {
        width: "70%",
        height: 60,
        marginTop: 25,
        flexDirection: "row",
        alignItems: "center",
        justifyContent: "center",
    },
    btnTop: {
        flex: 1,
        height: "100%",
        margin: 6,
    },
    negativeButton: {
        backgroundColor: "#73f081",
    },
    resetButton: {
        backgroundColor: "#949995",
    },
    positiveButton: {
        backgroundColor: "#9c2d21",
    },
});
