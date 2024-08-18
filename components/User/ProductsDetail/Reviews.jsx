import { View, Text, StyleSheet, TextInput, TouchableOpacity, Modal, Animated } from 'react-native';
import React, { useState, useRef } from 'react';
import { Colors } from '../../../constants/Colors';
import { Rating } from 'react-native-ratings';
import { arrayUnion, doc, updateDoc } from 'firebase/firestore';
import { auth, db } from '../../../configs/FirebaseConfig';

export default function Reviews({ productos }) {
    const [rating, setRating] = useState(4);
    const [userInput, setUserInput] = useState('');
    const [showConfirmation, setShowConfirmation] = useState(false);
    const [currentIndex, setCurrentIndex] = useState(0);
    const currentUser = auth.currentUser;

    const slideAnim = useRef(new Animated.Value(0)).current;

    const handleAnimation = (direction) => {
        slideAnim.setValue(direction === 'next' ? 300 : -300);
        Animated.timing(slideAnim, {
            toValue: 0,
            duration: 300,
            useNativeDriver: true,
        }).start();
    };

    const onSubmit = async () => {
        const docRef = doc(db, 'product', productos?.id);
        await updateDoc(docRef, {
            reviews: arrayUnion({
                rating: rating,
                comment: userInput,
                userName: currentUser.email,
            }),
        });

        setShowConfirmation(true);
        setTimeout(() => {
            setShowConfirmation(false);
        }, 2000);

        setUserInput('');
        setRating(4);
    };

    const handleNextComment = () => {
        if (currentIndex < productos?.reviews?.length - 1) {
            handleAnimation('next');
            setCurrentIndex(currentIndex + 1);
        }
    };

    const handlePrevComment = () => {
        if (currentIndex > 0) {
            handleAnimation('prev');
            setCurrentIndex(currentIndex - 1);
        }
    };

    const currentReview = productos?.reviews?.length > 0 ? productos.reviews[currentIndex] : null;

    return (
        <View style={style.mainContainer}>
            <View style={style.separator} />

            <View style={{ width: "80%", marginLeft: "10%", paddingBottom: 30 }}>
                <Text style={{ fontFamily: "Poppins-semibold", fontSize: 16.5, color: Colors.primary }}>Reviews</Text>

                <Rating
                    type='star'
                    ratingCount={5}
                    imageSize={23}
                    showRating={false}
                    onFinishRating={(rating) => setRating(rating)}
                    style={{ padding: 9 }}
                />

                <TextInput
                    placeholder='Deja tu comentario'
                    placeholderTextColor={Colors.secondary}
                    numberOfLines={4}
                    onChangeText={(value) => setUserInput(value)}
                    value={userInput}
                    multiline={true}
                    style={{
                        borderWidth: 1,
                        padding: 10,
                        borderRadius: 10,
                        borderColor: Colors.secondary,
                        textAlignVertical: 'top',
                        fontFamily: 'Poppins2',
                        height: 100
                    }}
                />

                <TouchableOpacity
                    style={{ padding: 10, backgroundColor: Colors.rosaplateado, borderRadius: 6, marginTop: 15, marginLeft: "60%", width: "40%" }}
                    disabled={!userInput}
                    onPress={onSubmit}
                >
                    <Text style={{ fontFamily: 'Poppins-semibold', color: '#fff', textAlign: 'center', fontSize: 17 }}>Enviar</Text>
                </TouchableOpacity>
            </View>

            <View style={{ backgroundColor: "#f8f8f8" }}>
                <View style={{ width: "80%", marginLeft: "10%", paddingBottom: 30, paddingTop: 20 }}>
                    <Text style={{ fontFamily: "Poppins-bold", fontSize: 19, color: Colors.primary }}>Comentarios</Text>

                    {currentReview ? (
                        <Animated.View
                            style={{
                                marginBottom: 10,
                                display: "flex",
                                marginTop: 10,
                                width: "85%",
                                marginLeft: "5%",
                                transform: [{ translateX: slideAnim }],
                            }}
                        >
                            <Text style={{ fontFamily: "Poppins-medium", color: Colors.primary }}>{currentReview.userName}</Text>
                            <Rating
                                imageSize={19}
                                startingValue={currentReview.rating}
                                readonly={true}
                                style={{
                                    alignItems: "flex-start",
                                    paddingTop: 5,
                                    paddingBottom: 5,
                                }}
                            />
                            <Text style={{ fontFamily: "Poppins2", color: Colors.primary }}>{currentReview.comment}</Text>
                        </Animated.View>
                    ) : (
                        <Text style={{ fontFamily: "Poppins2", color: Colors.primary, marginTop: 10 }}>Aún no hay comentarios para este producto.</Text>
                    )}

                    {productos?.reviews?.length > 0 && (
                        <View style={{ flexDirection: 'row', justifyContent: 'space-between', marginTop: 5 }}>
                            <TouchableOpacity
                                onPress={handlePrevComment}
                                disabled={currentIndex === 0}
                                style={style.button}
                            >
                                <Text style={style.buttonText}>Anterior</Text>
                            </TouchableOpacity>
                            <TouchableOpacity
                                onPress={handleNextComment}
                                disabled={currentIndex === productos?.reviews?.length - 1}
                                style={style.button}
                            >
                                <Text style={style.buttonText}>Siguiente</Text>
                            </TouchableOpacity>
                        </View>
                    )}
                </View>
            </View>

            <Modal
                transparent={true}
                animationType="fade"
                visible={showConfirmation}
                onRequestClose={() => setShowConfirmation(false)}
            >
                <View style={style.modalContainer}>
                    <View style={style.modalContent}>
                        <Text style={{ fontFamily: "Poppins-semibold", color: Colors.primary }}>¡Comentario añadido!</Text>
                    </View>
                </View>
            </Modal>
        </View>
    );
}

const style = StyleSheet.create({
    separator: {
        height: 1,
        backgroundColor: Colors.grisPlateado,
        marginVertical: 20,
        width: '85%',
        marginLeft: '7%',
    },
    mainContainer: {
        backgroundColor: '#fff',
        width: '100%',
    },
    button: {
        padding: 5,
        backgroundColor: Colors.secondary,
        borderRadius: 6,
        width: "30%",
        marginLeft:"10%",
        marginRight:"10%"
    },
    buttonText: {
        fontFamily: 'Poppins-bold',
        color: '#fff',
        textAlign: 'center',
        fontSize: 15,
    },
    modalContainer: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: 'rgba(0, 0, 0, 0.5)',
    },
    modalContent: {
        backgroundColor: '#fff',
        padding: 20,
        borderRadius: 10,
        alignItems: 'center',
    }
});
