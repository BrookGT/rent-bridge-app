// screens/main-screens/ChatScreen.tsx
import React, { useState, useEffect } from "react";
import {
    View,
    Text,
    StyleSheet,
    FlatList,
    TextInput,
    TouchableOpacity,
} from "react-native";
import Colors from "../../../components/constants/Colors";
import { supabase } from "../../../utils/supabase";

interface Conversation {
    id: string;
    house_id: string;
    renter_id: string;
    borrower_id: string;
    house: { title: string };
}

interface Message {
    id: string;
    sender_id: string;
    content: string;
    created_at: string;
}

const ChatScreen = () => {
    const [conversations, setConversations] = useState<Conversation[]>([]);
    const [selectedConversation, setSelectedConversation] =
        useState<Conversation | null>(null);
    const [messages, setMessages] = useState<Message[]>([]);
    const [newMessage, setNewMessage] = useState("");
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        const fetchConversations = async () => {
            try {
                const {
                    data: { user },
                    error: userError,
                } = await supabase.auth.getUser();
                if (userError || !user) {
                    setError("User not authenticated. Please log in.");
                    return;
                }

                const { data, error } = await supabase
                    .from("conversations")
                    .select(
                        "id, house_id, renter_id, borrower_id, house:house_id (title)"
                    )
                    .or(`renter_id.eq.${user.id},borrower_id.eq.${user.id}`);

                if (error) {
                    console.error("Error fetching conversations:", error);
                    setError(`Failed to fetch conversations: ${error.message}`);
                    return;
                }

                setConversations(
                    (data || []).map((conversation) => ({
                        ...conversation,
                        house: Array.isArray(conversation.house)
                            ? conversation.house[0]
                            : conversation.house,
                    }))
                );
            } catch (err) {
                console.error("Unexpected error fetching conversations:", err);
                setError(
                    "An unexpected error occurred while fetching conversations."
                );
            }
        };

        fetchConversations();
    }, []);

    useEffect(() => {
        if (!selectedConversation) return;

        const fetchMessages = async () => {
            const { data, error } = await supabase
                .from("messages")
                .select("*")
                .eq("conversation_id", selectedConversation.id)
                .order("created_at", { ascending: true });

            if (error) {
                console.error("Error fetching messages:", error);
                setError(`Failed to fetch messages: ${error.message}`);
            } else {
                setMessages(data || []);
            }
        };

        fetchMessages();

        // Subscribe to new messages
        const subscription = supabase
            .channel(`conversation:${selectedConversation.id}`)
            .on(
                "postgres_changes",
                {
                    event: "INSERT",
                    schema: "public",
                    table: "messages",
                    filter: `conversation_id=eq.${selectedConversation.id}`,
                },
                (payload) => {
                    setMessages((prev) => [...prev, payload.new as Message]);
                }
            )
            .subscribe();

        return () => {
            subscription.unsubscribe();
        };
    }, [selectedConversation]);

    const sendMessage = async () => {
        if (!newMessage.trim() || !selectedConversation) return;

        const {
            data: { user },
        } = await supabase.auth.getUser();
        if (!user) {
            setError("User not authenticated. Please log in.");
            return;
        }

        const { error } = await supabase.from("messages").insert({
            conversation_id: selectedConversation.id,
            sender_id: user.id,
            content: newMessage.trim(),
        });

        if (error) {
            console.error("Error sending message:", error);
            setError(`Failed to send message: ${error.message}`);
        } else {
            setNewMessage("");
        }
    };

    const renderConversationItem = ({ item }: { item: Conversation }) => (
        <TouchableOpacity
            style={styles.conversationItem}
            onPress={() => setSelectedConversation(item)}
        >
            <Text style={styles.conversationTitle}>{item.house.title}</Text>
        </TouchableOpacity>
    );

    const renderMessageItem = ({ item }: { item: Message }) => {
        const [isSender, setIsSender] = useState(false);

        useEffect(() => {
            const fetchUser = async () => {
                const { data: userResponse } = await supabase.auth.getUser();
                const user = userResponse?.user;
                setIsSender(item.sender_id === user?.id);
            };

            fetchUser();
        }, [item.sender_id]);

        return (
            <View
                style={[
                    styles.message,
                    isSender ? styles.messageSent : styles.messageReceived,
                ]}
            >
                <Text style={styles.messageText}>{item.content}</Text>
            </View>
        );
    };

    if (error) {
        return (
            <View style={styles.errorContainer}>
                <Text style={styles.errorText}>{error}</Text>
            </View>
        );
    }

    return (
        <View style={styles.container}>
            {selectedConversation ? (
                <>
                    <Text style={styles.chatTitle}>
                        {selectedConversation.house.title}
                    </Text>
                    <FlatList
                        data={messages}
                        renderItem={renderMessageItem}
                        keyExtractor={(item) => item.id}
                        contentContainerStyle={styles.messageList}
                    />
                    <View style={styles.inputContainer}>
                        <TextInput
                            style={styles.input}
                            value={newMessage}
                            onChangeText={setNewMessage}
                            placeholder="Type a message..."
                            placeholderTextColor={Colors.grayLight}
                        />
                        <TouchableOpacity
                            style={styles.sendButton}
                            onPress={sendMessage}
                        >
                            <Text style={styles.sendButtonText}>Send</Text>
                        </TouchableOpacity>
                    </View>
                </>
            ) : (
                <FlatList
                    data={conversations}
                    renderItem={renderConversationItem}
                    keyExtractor={(item) => item.id}
                    contentContainerStyle={styles.conversationList}
                />
            )}
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: Colors.black,
        paddingTop: 50,
    },
    conversationList: {
        paddingHorizontal: 20,
    },
    conversationItem: {
        backgroundColor: Colors.glassBackground,
        padding: 15,
        borderRadius: 10,
        marginBottom: 10,
        borderWidth: 1,
        borderColor: Colors.glassBorder,
    },
    conversationTitle: {
        fontSize: 18,
        color: Colors.white,
    },
    chatTitle: {
        fontSize: 22,
        fontWeight: "bold",
        color: Colors.white,
        padding: 20,
    },
    messageList: {
        flexGrow: 1,
        paddingHorizontal: 20,
        paddingBottom: 20,
    },
    message: {
        padding: 10,
        borderRadius: 10,
        marginBottom: 10,
        maxWidth: "80%",
    },
    messageSent: {
        backgroundColor: Colors.secondary,
        alignSelf: "flex-end",
    },
    messageReceived: {
        backgroundColor: Colors.glassBackground,
        alignSelf: "flex-start",
    },
    messageText: {
        fontSize: 16,
        color: Colors.white,
    },
    inputContainer: {
        flexDirection: "row",
        padding: 20,
        borderTopWidth: 1,
        borderTopColor: Colors.grayLight,
    },
    input: {
        flex: 1,
        backgroundColor: Colors.glassBackground,
        color: Colors.white,
        padding: 10,
        borderRadius: 10,
        marginRight: 10,
        borderWidth: 1,
        borderColor: Colors.glassBorder,
    },
    sendButton: {
        backgroundColor: Colors.secondary,
        padding: 10,
        borderRadius: 10,
        justifyContent: "center",
    },
    sendButtonText: {
        fontSize: 16,
        color: Colors.white,
        fontWeight: "bold",
    },
    errorContainer: {
        flex: 1,
        justifyContent: "center",
        alignItems: "center",
        backgroundColor: Colors.black,
    },
    errorText: {
        color: Colors.white,
        fontSize: 18,
        textAlign: "center",
        paddingHorizontal: 20,
    },
});

export default ChatScreen;
