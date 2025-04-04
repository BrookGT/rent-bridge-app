import React from "react";
import { TouchableOpacity, Text, StyleSheet } from "react-native";
import Colors from "../constants/Colors";

interface ButtonProps {
    title: string;
    onPress: () => void;
    type?: "primary" | "secondary";
}

const Button: React.FC<ButtonProps> = ({
    title,
    onPress,
    type = "primary",
}) => {
    return (
        <TouchableOpacity
            style={[
                styles.button,
                type === "primary" ? styles.primary : styles.secondary,
            ]}
            onPress={onPress}
        >
            <Text style={styles.buttonText}>{title}</Text>
        </TouchableOpacity>
    );
};

const styles = StyleSheet.create({
    button: {
        width: "80%",
        padding: 15,
        borderRadius: 8,
        alignItems: "center",
        marginVertical: 10,
    },
    primary: {
        backgroundColor: Colors.primary,
    },
    secondary: {
        backgroundColor: Colors.secondary,
    },
    buttonText: {
        fontSize: 18,
        fontWeight: "bold",
        color: Colors.white,
    },
});

export default Button;
