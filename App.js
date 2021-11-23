import {StatusBar} from 'expo-status-bar';
import React, {useEffect, useState} from 'react';
import {
    StyleSheet,
    Text,
    View,
    TouchableOpacity,
    TextInput,
    ScrollView,
    Alert,
    Platform
} from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import {theme} from './colors';
import {Fontisto} from '@expo/vector-icons';

const STORYGE_KEY = "@toDos";

export default function App() {
    const [toDos, setToDos] = useState({});
    const [working, setWorking] = useState(true); //
    const traver = () => setWorking(false); // traver 이 눌리면 setWorking은 거짓으로 나오게
    const work = () => setWorking(true);

    const [complet, setComplet] = useState(false);

    const [text, setText] = useState("");
    const onChangeText = (payload) => setText(payload);

    const saveToDos = async (toSave) => {
        await AsyncStorage.setItem(STORYGE_KEY, JSON.stringify(toSave)); // stringify는 string 형식으로 바꿔주는 함수
        
    };
    const loadToDo = async () => {
        const s = await AsyncStorage.getItem(STORYGE_KEY);
        if (s) {
            setToDos(JSON.parse(s)); //
        }
    }
    useEffect(() => {
        loadToDo();
    }, []);

    const addToDo = async () => {
        if (text === "") {
            return;
        }
        // save to do
        const newToDos = {
            ...toDos,
            [Date.now()]: {
                text,
                working,
                complet
            }
        };
        setToDos(newToDos);
        await saveToDos(newToDos);
        setText("");
    };

    const deleteToDo = (key) => {
        if (Platform.OS === "web") {
            const ok = confirm("do you want delete this To Do?");
            if (ok) {
                const newToDos = {
                    ...toDos
                };
                delete newToDos[key]
                setToDos(newToDos);
                saveToDos(newToDos);
            }
        } else {
            Alert.alert("Delete To Do", "Are you sure?", [
                {
                    text: "Cancle"
                }, {
                    text: "i'm Sure",
                    style: "destructive",
                    onPress: () => {
                        const newToDos = {
                            ...toDos
                        }
                        delete newToDos[key]
                        setToDos(newToDos);
                        saveToDos(newToDos);
                    }
                }
            ]);
        }
    };

    const completedToDo = (key) => {
        Alert.alert("completed To Do", "did you success?", [
            {
                text: "Not yet",
                onPress: () => {}
            }, {
                text: "Yes",
                onPress: () => {
                    const newToDos = {
                        ...toDos
                    };
                    newToDos[key] = {
                        text: toDos[key].text,
                        working,
                        complet: true
                    };
                    
                    setToDos(newToDos);
                    saveToDos(newToDos);
                }
            }
        ]);
    };
    

    return (
        <View style={styles.container}>
            <StatusBar style="auto"/>
            <View style={styles.header}>
                <TouchableOpacity onPress={work}>
                    <Text
                        style={{
                            color: "white",
                            fontSize: 48,
                            fontWeight: "600",
                            color: working
                                ? "white"
                                : theme.gray
                        }}>Work</Text>
                </TouchableOpacity>
                <TouchableOpacity onPress={traver}>
                    <Text
                        style={{
                            color: "white",
                            fontSize: 48,
                            fontWeight: "600",
                            color: working
                                ? theme.gray
                                : "white"
                        }}>Traver</Text>
                </TouchableOpacity>
            </View>
            <View>
                <TextInput
                    onSubmitEditing={addToDo}
                    onChangeText={onChangeText}
                    returnKeyType="done"
                    value={text}
                    placeholder={working
                        ? "Add a To Do"
                        : "Where do you want go?"}
                    style={styles.input}/>
                <ScrollView>
                    {
                        Object
                            .keys(toDos)
                            .map(
                                key => toDos[key].working === working
                                    ? (
                                        <View style={styles.toDo} key={key}>
                                            <Text style={styles.toDoText}>{toDos[key].text}</Text>
                                            <View style={styles.icons}>
                                                <TouchableOpacity style={styles.complet} onPress={() => completedToDo(key)}>
                                                    <Fontisto name="checkbox-passive" size={18} color="white"/>
                                                </TouchableOpacity>
                                                <TouchableOpacity onPress={() => deleteToDo(key)}>
                                                    <Fontisto name="trash" size={18} color="white"/>
                                                </TouchableOpacity>
                                            </View>
                                        </View>
                                    )
                                    : null
                            )
                    }
                </ScrollView>
            </View>
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: theme.background,
        paddingHorizontal: 20
    },
    header: {
        justifyContent: 'space-between',
        flexDirection: 'row',
        marginTop: 100
    },
    input: {
        backgroundColor: "white",
        paddingVertical: 15,
        paddingHorizontal: 20,
        borderRadius: 30,
        marginVertical: 10,
        fontSize: 18
    },
    toDo: {
        backgroundColor: theme.gray,
        marginBottom: 10,
        paddingVertical: 20,
        paddingHorizontal: 20,
        borderRadius: 15,
        flexDirection: "row",
        justifyContent: 'space-between'
    },
    toDoText: {
        color: "white",
        fontSize: 18,
        fontWeight: "600"
    },
    complet: {
        textDecorationLine: 'line-through',
        textDecorationStyle: 'solid',
        color: "gray",
        fontSize: 18,
        fontWeight: "600",
        marginRight: 8,
    },
    icons: {
        flexDirection: 'row',
        paddingHorizontal: 5
    }
});
