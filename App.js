import "react-native-gesture-handler";
import { StatusBar } from "expo-status-bar";
import React, { useState, useEffect } from "react";
import {
    StyleSheet,
    Text,
    View,
    I18nManager,
    TouchableOpacity,
    FlatList,
    SafeAreaView,
    modal
} from "react-native";

import * as Font from "expo-font";
import { useFonts } from "expo-font";

import { Ionicons } from "@expo/vector-icons";
import { MaterialCommunityIcons } from "@expo/vector-icons";
import { FontAwesome } from "@expo/vector-icons";
import { Feather } from "@expo/vector-icons";

import { NavigationContainer } from "@react-navigation/native";

import AsyncStorage from "@react-native-async-storage/async-storage";

const App = () => {
    const [dailyData, setDailyData] = useState([
        { id: 1, title: "سیب", calorie: 111 },
        { id: 2, title: "موز", calorie: 222 },
        { id: 3, title: "خیار", calorie: 333 },
        { id: 4, title: "سیب", calorie: 111 },
        { id: 5, title: "موز", calorie: 222 },
        { id: 6, title: "خیار", calorie: 333 },
        { id: 7, title: "سیب", calorie: 111 },
        { id: 8, title: "موز", calorie: 222 },
        { id: 9, title: "خیار", calorie: 333 },
        { id: 10, title: "سیب", calorie: 111 },
        { id: 11, title: "موز", calorie: 222 },
        { id: 12, title: "خیار", calorie: 333 },
        { id: 13, title: "سیب", calorie: 111 },
        { id: 14, title: "موز", calorie: 222 },
        { id: 15, title: "خیار", calorie: 333 },
        { id: 16, title: "سیب", calorie: 111 },
        { id: 17, title: "موز", calorie: 222 },
    ]);
    const [calorieData, setCalorieData] = useState();

    const [doGetDailyCalories, setDoGetDailyCalories] = useState(false);

    I18nManager.forceRTL(false);

    const [loaded] = useFonts({
        IRANSans: require("./assets/fonts/IRANSans.ttf"),
    });

    // consoledebug(1);

    //  daily data key -> @daily_data
    //  calorie data key -> @calorie_data
    const storeData = async (key, value) => {
        try {
            const jsonValue = JSON.stringify(value);
            await AsyncStorage.setItem(key, jsonValue);
            setCalorieData(jsonValue);
        } catch (e) {
            console.debug(e);
        }
    };

    const getDailyData = async () => {
        try {
            var jsonValue = await AsyncStorage.getItem("@daily_data");
            var result = [];
            jsonValue = jsonValue ? JSON.parse(jsonValue) : [];
            var id = 0;
            for (let k in jsonValue) {
                result.push({ id: id, title: k, calorie: jsonValue[k] });
                id++;
            }
            console.debug(result);
            setDailyData(result);
        } catch (e) {
            console.error(e);
        }
    };
    useEffect(() => {
        console.debug(1);
        getDailyData();
    }, [doGetDailyCalories]);

    const renderItem = ({ item }) => (
        <TouchableOpacity>
            <View style={styles.listItem}>
                <Text style={styles.txt}>{item.title}</Text>
                <Text style={styles.br}>..................</Text>
                <Text style={styles.txt}>{item.calorie}</Text>
            </View>
        </TouchableOpacity>
    );
    if (!loaded) {
        return null;
    }

    return (
        <SafeAreaView>
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
                </View>
                <View style={styles.buttonsContainer}>
                    <TouchableOpacity style={[styles.btnTop]}>
                        <Ionicons
                            style={styles.positiveButton}
                            name="add-outline"
                            size={45}
                            color="#9c2d21"
                        />
                    </TouchableOpacity>

                    <TouchableOpacity style={[styles.btnTop]}>
                        <FontAwesome
                            style={styles.positiveButton}
                            name="rotate-left"
                            size={30}
                            color="#949995"
                        />
                    </TouchableOpacity>
                    <TouchableOpacity style={[styles.btnTop]}>
                        <Ionicons
                            style={styles.positiveButton}
                            name="ios-remove-outline"
                            size={45}
                            color="#14b827"
                        />
                    </TouchableOpacity>
                </View>
                <Text>{calorieData}</Text>
                <FlatList
                    style={styles.listContainer}
                    data={dailyData}
                    renderItem={renderItem}
                    keyExtractor={(item) => item.id.toString()}
                />
            </View>
        </SafeAreaView>
    );
};

export default App;

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
        flexDirection: "row-reverse",
        alignItems: "center",
        justifyContent: "center",
    },
    btnTop: {
        flex: 1,
        height: "100%",
        margin: 6,
        justifyContent: "center",
        alignItems: "center",
    },
    negativeButton: {
        backgroundColor: "#73f081",
    },
    resetButton: {
        backgroundColor: "#949995",
    },
    positiveButton: {
        // backgroundColor: "#9c2d21",
        // flex: 10,
    },
    addIcon: {
        color: "#fff",
        fontSize: 40,
    },
    listContainer: {
        borderRadius: 10,
        width: "90%",
        // height: "50%",
        marginTop: 20,
        backgroundColor: "#e6e6e6",
        marginBottom: 70,
    },
    listItem: {
        padding: 10,
        flexDirection: "row-reverse",
        justifyContent: "space-between",
        // alignItems: "center",
        marginTop: 15,
        borderBottomWidth: 0.5,
        borderBottomColor: "#999",
    },
    br: {
        flex: 3,
        textAlign: "center",
    },
    txt: {
        textAlign: "center",
        flex: 1,
        fontSize: 22,
        fontFamily: "IRANSans",
    },
});
