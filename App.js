import "react-native-gesture-handler";
import { StatusBar } from "expo-status-bar";
import React, { useState, useEffect, useRef } from "react";
import {
    StyleSheet,
    Text,
    View,
    I18nManager,
    TouchableOpacity,
    FlatList,
    ScrollView,
    SafeAreaView,
    Modal,
    TextInput,
    useWindowDimensions,
} from "react-native";

import * as Font from "expo-font";
import { useFonts } from "expo-font";

import { Ionicons } from "@expo/vector-icons";
import { MaterialCommunityIcons } from "@expo/vector-icons";
import { FontAwesome } from "@expo/vector-icons";
import { Feather } from "@expo/vector-icons";
import { Octicons } from "@expo/vector-icons";

import { NavigationContainer } from "@react-navigation/native";

import AsyncStorage from "@react-native-async-storage/async-storage";
import { set } from "react-native-reanimated";

const App = () => {
    const [dailyLimitCalorie, setDailyLimitCalorie] = useState(1000);
    const [takenCalorie, setTakenCalorie] = useState(0);

    const [dailyData, setDailyData] = useState([]);
    const [doGetDailyCalories, setDoGetDailyCalories] = useState(false);

    const [modalVisible, setModalVisible] = useState(false);
    const [modalPoN, setModalPoN] = useState("/");
    const [modalTitle, setModalTitle] = useState("");
    const [modalCalorie, setModalCalorie] = useState("");

    const [modalInputVisible, setModalInputVisible] = useState(false);
    const [modalInputNewCal, setModalInputNewCal] = useState(0);

    const [modalEditVisible, setModalEditVisible] = useState(false);
    const [modalEditTitle, setModalEditTitle] = useState("");
    const [modalEditCal, setModalEditCal] = useState("");
    const [recordEditID, setRecordEditID] = useState(null);

    const takenCalFlex = () => {
        return 1 - remainingFlex();
    };
    const remainingFlex = () => {
        return (
            Math.round(
                (takenCalorie / dailyLimitCalorie + Number.EPSILON) * 100
            ) / 100
        );
    };

    I18nManager.forceRTL(false);

    const [loaded] = useFonts({
        IRANSans: require("./assets/fonts/IRANSans.ttf"),
    });

    const windowHeight = useWindowDimensions().height;

    //  daily data key -> @daily_data
    //  daily calorie limit -> @calorie_limit
    const storeData = async (key, value) => {
        try {
            const jsonValue = JSON.stringify(value);
            await AsyncStorage.setItem(key, jsonValue);
        } catch (e) {
            // console.error(e);
        }
    };
    const clearAsyncStorage = async () => {
        storeData("@daily_data", "[]");
        setDoGetDailyCalories();
    };

    const getDailyData = async () => {
        try {
            var arr = await AsyncStorage.getItem("@daily_data");
            arr = arr ? JSON.parse(JSON.parse(arr) + "") : [];
            setDailyData(arr);
            var calSum = 0;
            arr.forEach((obj) => {
                calSum += obj.calorie;
            });
            setTakenCalorie(calSum);
        } catch (e) {
            console.log(e);
        }
    };
    const getFoodCal = async (key) => {
        try {
            var cal = await AsyncStorage.getItem(key);
            cal = cal ? Math.abs(parseInt(cal)).toString() : "";
            setModalCalorie(cal);
        } catch (e) {
            //
        }
    };

    const getCalorieLimit = async (key) => {
        try {
            var limitCal = await AsyncStorage.getItem("@calorie_limit");
            limitCal = limitCal ? parseInt(limitCal) : 2000;
            setDailyLimitCalorie(limitCal);
        } catch (e) {}
    };

    const modalConfirmHandler = () => {
        if (modalTitle !== "" && modalCalorie !== "") {
            var title = modalTitle.toString();
            var calorie =
                modalPoN === "+"
                    ? Math.abs(parseInt(modalCalorie))
                    : -Math.abs(parseInt(modalCalorie));
            var key = title.split(/\s/).join("");
            key = `@${key}`;
            var id = dailyData.length;
            storeData(key, calorie);

            var newDailyData = [...dailyData];
            newDailyData.push({ id: id, title: title, calorie: calorie });
            storeData("@daily_data", JSON.stringify(newDailyData));
            setModalTitle("");
            setModalCalorie("");
            setModalPoN("/");
            setDoGetDailyCalories(!doGetDailyCalories);
            setModalVisible(false);
        }
    };

    const modalEditInit = (id) => {
        var cal = dailyData[id].calorie;
        if (cal > 0) setModalPoN("+");
        else setModalPoN("-");
        setModalEditTitle(dailyData[id].title);
        setModalEditCal(Math.abs(cal).toString());
    };
    const modalEditDeleteHandler = () => {
        var newDailyData = [...dailyData];
        newDailyData[recordEditID].title = "";
        newDailyData[recordEditID].calorie = 0;
        storeData("@daily_data", JSON.stringify(newDailyData));
        setModalEditTitle("");
        setModalEditCal("");
        setModalTitle("");
        setModalCalorie("");
        setModalPoN("/");
        setDoGetDailyCalories(!doGetDailyCalories);
        setModalEditVisible(false);
    };
    const modalEditUpateHandler = () => {
        var newDailyData = [...dailyData];
        var newTitle = modalEditTitle;
        var newCal = modalEditCal;

        var key = newTitle.split(/\s/).join("");
        key = `@${key}`;
        storeData(
            key,
            modalPoN === "+"
                ? Math.abs(parseInt(newCal))
                : -Math.abs(parseInt(newCal))
        );

        newDailyData[recordEditID].title = newTitle;
        newDailyData[recordEditID].calorie =
            modalPoN === "+"
                ? Math.abs(parseInt(newCal))
                : -Math.abs(parseInt(newCal));

        storeData("@daily_data", JSON.stringify(newDailyData));
        setModalEditTitle("");
        setModalEditCal("");
        setModalTitle("");
        setModalCalorie("");
        setModalPoN("/");
        setDoGetDailyCalories(!doGetDailyCalories);
        setModalEditVisible(false);
    };

    useEffect(() => {
        // clearAsyncStorage();
    }, []);
    useEffect(() => {
        getDailyData();
        getCalorieLimit();
    }, [doGetDailyCalories]);

    const renderItem = ({ item }) => (
        <>
            {item.title !== "" && item.calorie !== 0 && (
                <TouchableOpacity
                    onLongPress={() => {
                        setRecordEditID(item.id);
                        modalEditInit(item.id);
                        setModalEditVisible(true);
                    }}
                >
                    <View style={styles.listItem}>
                        <Text style={styles.txt1}>{item.title}</Text>
                        {/* <Text style={styles.br}>..................</Text> */}
                        <Text style={styles.txt2}>{item.calorie}</Text>
                    </View>
                </TouchableOpacity>
            )}
        </>
    );
    if (!loaded) {
        return null;
    }

    return (
        <SafeAreaView style={[{ minHeight: Math.round(windowHeight) }]}>
            <View style={styles.mainContainer}>
                <View style={styles.calorieStatusContainer}>
                    <TouchableOpacity
                        style={{ alignItems: "center" }}
                        onPress={() => {
                            setModalInputVisible(true);
                        }}
                    >
                        <View style={styles.percentContainer}>
                            <View
                                style={[
                                    styles.eatenPart,
                                    {
                                        flex: takenCalFlex(),
                                    },
                                ]}
                            ></View>
                            <View
                                style={[
                                    styles.remainingPart,
                                    {
                                        flex: remainingFlex(),
                                    },
                                ]}
                            ></View>
                        </View>
                        <Text style={styles.calorieRemaining}>
                            {dailyLimitCalorie - takenCalorie} کالری باقی‌مانده
                        </Text>
                    </TouchableOpacity>
                </View>
                <View style={styles.buttonsContainer}>
                    <TouchableOpacity
                        style={[styles.btnTop]}
                        onPress={() => {
                            setModalPoN("+");
                            setModalVisible(true);
                        }}
                    >
                        <Ionicons
                            style={styles.positiveButton}
                            name="add-outline"
                            size={45}
                            color="#9c2d21"
                        />
                    </TouchableOpacity>

                    <TouchableOpacity
                        style={[styles.btnTop]}
                        onPress={clearAsyncStorage}
                    >
                        <FontAwesome
                            style={styles.positiveButton}
                            name="rotate-left"
                            size={30}
                            color="#949995"
                        />
                    </TouchableOpacity>
                    <TouchableOpacity
                        style={[styles.btnTop]}
                        onPress={() => {
                            setModalPoN("-");
                            setModalVisible(true);
                        }}
                    >
                        <Ionicons
                            style={styles.positiveButton}
                            name="ios-remove-outline"
                            size={45}
                            color="#14b827"
                        />
                    </TouchableOpacity>
                </View>
                <FlatList
                    style={styles.listContainer}
                    data={dailyData}
                    renderItem={renderItem}
                    keyExtractor={
                        (item) => (item.id ? item["id"].toString() : "")
                        // item[id].toString()
                    }
                />

                <Modal //  Add new record Modal
                    animationType="none"
                    transparent={true}
                    visible={modalVisible}
                    onRequestClose={() => {
                        setModalEditTitle("");
                        setModalEditCal("");
                        setModalTitle("");
                        setModalCalorie("");
                        setModalPoN("/");
                        setModalVisible(false);
                    }}
                    backdrop={false}
                >
                    <View
                        style={[
                            styles.modalMainContainer,
                            {
                                minHeight:
                                    (Math.round(windowHeight) * 55) / 100,
                            },
                        ]}
                    >
                        <View style={styles.ModalTemp}>
                            <View style={styles.modalInputsContainer}>
                                {modalPoN === "+" && (
                                    <Text style={styles.modalText}>
                                        نام غذا:
                                    </Text>
                                )}
                                {modalPoN === "-" && (
                                    <Text style={styles.modalText}>
                                        نام فعالیت:
                                    </Text>
                                )}
                                <TextInput
                                    onChangeText={(value) => {
                                        setModalTitle(value);
                                    }}
                                    style={styles.modalTextInput1}
                                ></TextInput>
                            </View>
                            <View style={styles.modalInputsContainer}>
                                <Text style={styles.modalText}>
                                    مقدار کالری:
                                </Text>
                                <View style={styles.ModalCalorieInputContainer}>
                                    <TextInput
                                        onChangeText={(value) => {
                                            setModalCalorie(value);
                                        }}
                                        keyboardType="numeric"
                                        style={styles.modalTextInput2}
                                        value={modalCalorie}
                                    ></TextInput>
                                    <Octicons
                                        name="search"
                                        size={25}
                                        color="black"
                                        style={styles.magnifier}
                                        onPress={() => {
                                            var title = modalTitle.toString();
                                            var key = title
                                                .split(/\s/)
                                                .join("");
                                            key = `@${key}`;
                                            getFoodCal(key);
                                        }}
                                    />
                                </View>
                            </View>
                        </View>
                        <TouchableOpacity
                            style={styles.modalConfirm}
                            onPress={modalConfirmHandler}
                        >
                            <Text style={styles.modalConfirmText}>تایید</Text>
                        </TouchableOpacity>
                        <TouchableOpacity
                            style={styles.modalCancel}
                            onPress={() => {
                                setModalTitle("");
                                setModalCalorie("");
                                setModalPoN("/");
                                setModalVisible(false);
                            }}
                        >
                            <Text style={styles.modalCancelText}>لغو</Text>
                        </TouchableOpacity>
                    </View>
                </Modal>
                <Modal //  Edit a record modal
                    animationType="none"
                    transparent={true}
                    visible={modalEditVisible}
                    onRequestClose={() => {
                        setModalEditTitle("");
                        setModalEditCal("");
                        setModalTitle("");
                        setModalCalorie("");
                        setModalPoN("/");
                        setModalEditVisible(false);
                    }}
                >
                    <View
                        style={[
                            styles.modalMainContainer,
                            {
                                minHeight:
                                    (Math.round(windowHeight) * 55) / 100,
                            },
                        ]}
                    >
                        <View style={styles.ModalTemp}>
                            <View style={styles.modalInputsContainer}>
                                {modalPoN === "+" && (
                                    <Text style={styles.modalText}>
                                        نام غذا :
                                    </Text>
                                )}
                                {modalPoN === "-" && (
                                    <Text style={styles.modalText}>
                                        نام فعالیت:
                                    </Text>
                                )}

                                <TextInput
                                    onChangeText={(value) => {
                                        setModalEditTitle(value);
                                    }}
                                    value={modalEditTitle}
                                    style={styles.modalTextInput1}
                                ></TextInput>
                            </View>
                            <View style={styles.modalInputsContainer}>
                                <Text style={styles.modalText}>
                                    مقدار کالری:
                                </Text>
                                <View style={styles.ModalCalorieInputContainer}>
                                    <TextInput
                                        onChangeText={(value) => {
                                            setModalEditCal(value);
                                        }}
                                        keyboardType="numeric"
                                        value={modalEditCal}
                                        style={styles.modalTextInput2}
                                    ></TextInput>
                                    <Octicons
                                        name="search"
                                        size={25}
                                        color="black"
                                        style={styles.magnifier}
                                        onPress={() => {
                                            var title = modalTitle.toString();
                                            var key = title
                                                .split(/\s/)
                                                .join("");
                                            key = `@${key}`;
                                            getFoodCal(key);
                                        }}
                                    />
                                </View>
                            </View>
                        </View>
                        <TouchableOpacity
                            style={styles.modalConfirm}
                            onPress={modalEditUpateHandler}
                        >
                            <Text style={styles.modalConfirmText}>تایید</Text>
                        </TouchableOpacity>
                        <TouchableOpacity
                            style={styles.modalCancel}
                            onPress={modalEditDeleteHandler}
                        >
                            <Text style={styles.modalCancelText}>حذف</Text>
                        </TouchableOpacity>
                    </View>
                </Modal>
                <Modal //  Set daily calorie limit modal
                    animationType="none"
                    transparent={true}
                    visible={modalInputVisible}
                    onRequestClose={() => {
                        setModalInputVisible(false);
                    }}
                    backdrop={false}
                >
                    <View
                        style={[
                            styles.secondModalMainContainer,
                            {
                                minHeight:
                                    (Math.round(windowHeight) * 32) / 100,
                            },
                        ]}
                    >
                        <Text style={styles.modalInputTitleText}>
                            حداکثر کالری روزانه:
                        </Text>
                        <TextInput
                            style={styles.modalTextInput1}
                            onChangeText={(value) => {
                                setModalInputNewCal(value);
                            }}
                            keyboardType="numeric"
                            style={styles.modalInputInput}
                        ></TextInput>
                        <TouchableOpacity
                            style={styles.modalInputButton}
                            onPress={() => {
                                if (modalInputNewCal > 1) {
                                    storeData(
                                        "@calorie_limit",
                                        parseInt(modalInputNewCal)
                                    );
                                    setDoGetDailyCalories(!doGetDailyCalories);
                                    setModalInputVisible(false);
                                }
                            }}
                        >
                            <Text style={styles.modalInputButtonText}>
                                تایید
                            </Text>
                        </TouchableOpacity>
                    </View>
                </Modal>
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
        // flex: 0.9,
        width: "100%",
        height: "100%",
        backgroundColor: "#14b827",
    },
    remainingPart: {
        // flex: 0.1,
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
        alignItems: "flex-start",
        marginTop: 15,
        borderBottomWidth: 0.5,
        borderBottomColor: "#999",
    },
    br: {
        flex: 1,
        textAlign: "center",
        // backgroundColor: "#f00",
    },
    txt1: {
        marginRight: 5,
        textAlign: "right",
        flex: 2,
        fontSize: 22,
        fontFamily: "IRANSans",
    },
    txt2: {
        marginLeft: 5,
        textAlign: "left",
        flex: 1,
        fontSize: 22,
        fontFamily: "IRANSans",
    },

    modalMainContainer: {
        width: "80%",
        height: "55%",
        backgroundColor: "#FFF",
        alignSelf: "center",
        marginTop: "35%",
        borderWidth: 0.3,
        borderRadius: 5,
        justifyContent: "flex-start",
        alignItems: "center",
    },
    ModalTemp: {
        flexDirection: "column",
        justifyContent: "center",
        alignItems: "center",
        width: "100%",
    },
    modalInputsContainer: {
        marginTop: "20%",
        justifyContent: "center",
        alignItems: "center",
        width: "100%",
    },
    modalText: {
        fontSize: 20,
    },
    modalTextInput1: {
        fontSize: 17,
        marginTop: 5,
        width: "70%",
        backgroundColor: "#eee",
        height: 40,
        padding: 10,
        textAlign: "center",
        borderRadius: 5,
    },
    modalTextInput2: {
        fontSize: 17,
        marginTop: 5,
        width: "100%",
        backgroundColor: "#eee",
        height: 40,
        padding: 10,
        textAlign: "center",
        borderRadius: 5,
    },
    ModalCalorieInputContainer: {
        position: "relative",
        flexDirection: "row",
        justifyContent: "center",
        alignItems: "center",
        width: "70%",
        // backgroundColor: "#000",
        height: 40,
    },
    magnifier: {
        position: "absolute",
        right: 0,
        padding: 5,
    },
    modalConfirm: {
        marginTop: "15%",
        width: "35%",
        justifyContent: "center",
        alignItems: "center",
        backgroundColor: "#efe",
        borderWidth: 0.5,
        borderRadius: 5,
        height: 40,
        borderColor: "#091",
    },
    modalCancel: {
        marginTop: 10,
        width: "35%",
        justifyContent: "center",
        alignItems: "center",
        backgroundColor: "#fef",
        borderWidth: 0.5,
        borderRadius: 5,
        height: 40,
        borderColor: "#901",
    },
    modalConfirmText: {
        fontSize: 18,
        color: "#091",
    },
    modalCancelText: {
        fontSize: 18,
        color: "#901",
    },
    secondModalMainContainer: {
        width: "70%",
        height: "30%",
        backgroundColor: "#FFF",
        alignSelf: "center",
        marginTop: "35%",
        borderWidth: 0.3,
        borderRadius: 5,
        justifyContent: "flex-start",
        alignItems: "center",
    },
    modalInputButton: {
        marginTop: "10%",
        width: "35%",
        justifyContent: "center",
        alignItems: "center",
        backgroundColor: "#ffffff",
        borderWidth: 0.5,
        borderRadius: 5,
        height: 40,
        borderColor: "#444",
    },
    modalInputButtonText: {
        fontSize: 18,
        color: "#444",
    },
    modalInputTitleText: {
        marginTop: "20%",
        fontSize: 22,
        fontFamily: "IRANSans",
    },
    modalInputInput: {
        fontSize: 17,
        marginTop: 5,
        width: "60%",
        backgroundColor: "#eee",
        height: 40,
        padding: 10,
        textAlign: "center",
        borderRadius: 5,
    },
});
