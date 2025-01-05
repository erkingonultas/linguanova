import React, { useState, useEffect, useRef } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, ScrollView, SafeAreaView, Alert, Animated } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import Voice from '@react-native-community/voice';
import { apiCall } from '@/api/openai';
import { useNavigation } from '@react-navigation/native';

interface ChatMessage {
  role: string;
  content: string;
}

const ChatScreen: React.FC = () => {
  const [isSpeaking, setIsSpeaking] = useState(false);
  const [recording, setRecording] = useState(false);
  const [canceling, setCanceling] = useState(false);
  const [messages, setMessages] = useState<ChatMessage[]>([{ role: "assistant", content: "Hey, how are you today?" }]);
  const [result, setResult] = useState("");
  const scrollViewRef = useRef<ScrollView | null>(null);
  const popUpAnimation = useRef(new Animated.Value(0)).current;
  const navigation = useNavigation();

  const speechStartHandler = async () => {
    try {
      console.log("speech started");
      setIsSpeaking(true);
      Animated.timing(popUpAnimation, {
        toValue: 1,
        duration: 300,
        useNativeDriver: true,
      }).start();
    } catch (e) {
      console.error(e);
    }
  };

  const speechEndHandler = async () => {
    try {
      console.log("speech end");
      setIsSpeaking(false);
      Animated.timing(popUpAnimation, {
        toValue: 0,
        duration: 300,
        useNativeDriver: true,
      }).start();
    } catch (e) {
      console.error(e);
    }
  };

  const speechResultsHandler = async (e: any) => {
    try {
      console.log("speech results", e);
      setResult(e.value[0]);
    } catch (e) {
      console.error(e);
    }
  };

  const speechErrorHandler = async (e: any) => {
    setIsSpeaking(false);
      Animated.timing(popUpAnimation, {
        toValue: 0,
        duration: 300,
        useNativeDriver: true,
      }).start();
  };

  const startRecording = async () => {
    if (Voice) {
      setRecording(true);
      try {
        await Voice.start("en-GB");
      } catch (error) {
        console.error(error);
      }
    }
  };

  const stopRecording = async () => {
    if (Voice) {
      setRecording(false);
      try {
        await Voice.stop();
        await fetchResponse();
      } catch (error) {
        console.error(error);
      }
    }
  };

  const cancelRecording = async () => {
    setRecording(false);
    setCanceling(true);
    try {
      await Voice.stop();
      setResult(""); // Reset result to ensure no further processing
    } catch (error) {
      console.error(error);
    }
  };

  const clear = () => {
    setMessages([]);
  };

  const fetchResponse = async () => {
    if (result.trim().length > 0) {
      let newMessages = [...messages];
      newMessages.push({ role: "user", content: result });
      setMessages([...newMessages]);
      apiCall(newMessages).then((res) => {
        if (res?.success) {
          setMessages([...res.data]);
          setResult('');
        } else {
          Alert.alert("Error on creating response: ", res!.data ?? "Unknown");
        }
      });
    }
  };

  const handleRelease = () => {
    if (!canceling) {
      stopRecording();
      fetchResponse();
    } else {
      setCanceling(false); // Reset canceling state
    }
  };

  useEffect(() => {
    Voice.onSpeechStart = speechStartHandler;
    Voice.onSpeechEnd = speechEndHandler;
    Voice.onSpeechResults = speechResultsHandler;
    Voice.onSpeechError = speechErrorHandler;

    return () => {
      Voice.destroy().then(Voice.removeAllListeners);
    };
  }, []);

  const popUpTranslateY = popUpAnimation.interpolate({
    inputRange: [0, 1],
    outputRange: [50, -10],
  });

  return (
    <SafeAreaView style={styles.container}>
      {/* Navigation Bar */}
      <View style={styles.navBar}>
        <TouchableOpacity onPress={() => navigation.goBack()}>
          <Ionicons name="arrow-back" size={24} color="#383F51" />
        </TouchableOpacity>
        <Text style={styles.navBarTitle}>Chat Practice</Text>
        <TouchableOpacity onPress={clear}>
          <Ionicons name="trash-outline" size={24} color="#383F51" />
        </TouchableOpacity>
      </View>
      <View style={styles.chatBox}>
        <ScrollView
          ref={scrollViewRef}
          style={styles.chatHistory}
          onContentSizeChange={() => {
            scrollViewRef.current?.scrollToEnd();
          }}
        >
          {messages.length > 0
            ? messages.map((message, index) => (
                <View
                  key={index}
                  style={[
                    message.role == "user" ? styles.userMessage : styles.aiMessage,
                    styles.messageBubble,
                  ]}
                >
                  <Text style={styles.messageText}>{message.content}</Text>
                </View>
              ))
            : (
              <View
                key="empty"
                style={[
                  styles.messageBubble,
                  styles.aiMessage,
                ]}
              >
                <Text style={styles.messageText}>Hey, how are you today?</Text>
              </View>
            )}
        </ScrollView>
      </View>
      <Animated.View
        style={[
          styles.popUpContainer,
          { transform: [{ translateY: popUpTranslateY }], opacity: popUpAnimation },
        ]}
      >
        <Text style={styles.popUpText}>{result}</Text>
      </Animated.View>
      <View style={styles.actionContainer}>
        <TouchableOpacity
          style={[styles.speakButton, isSpeaking && styles.speakingButton]}
          onPressIn={startRecording}
          onPressOut={handleRelease}
        >
          <Ionicons
            name={isSpeaking ? 'mic' : 'mic-outline'}
            size={26}
            color="#FFFFFF"
          />
          <Text style={styles.speakButtonText}>
            {isSpeaking ? 'Speaking...' : 'Hold to Speak'}
          </Text>
        </TouchableOpacity>
        {recording && (
          <TouchableOpacity
            style={styles.cancelButton}
            onPressIn={cancelRecording}
          >
            <Ionicons name="close-circle" size={26} color="#FFFFFF" />
            <Text style={styles.cancelButtonText}>Cancel</Text>
          </TouchableOpacity>
        )}
      </View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  navBar: {
    backgroundColor: '#e8e8e8',
    height: 56,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 16,
  },
  navBarTitle: {
    color: '#383F51',
    fontSize: 18,
    fontWeight: 'bold',
  },
  chatBox: {
    flex: 1, backgroundColor: '#F8F8F8', margin: 12, marginTop: 30, borderRadius: 12,
  },
  container: {
    flex: 1,
    backgroundColor: '#E8E8E8',
  },
  chatHistory: {
    flex: 1,
    padding: 20,
  },
  messageBubble: {
    maxWidth: '80%',
    padding: 12,
    borderRadius: 20,
    marginBottom: 10,
  },
  userMessage: {
    alignSelf: 'flex-end',
    backgroundColor: '#383F51',
    borderTopRightRadius: 0,
    color: "#191919",
  },
  aiMessage: {
    alignSelf: 'flex-start',
    backgroundColor: '#4CAF50',
    borderTopLeftRadius: 0,
  },
  messageText: {
    fontSize: 16,
    color: "#e8e8e8",
  },
  popUpContainer: {
    position: 'absolute',
    bottom: 100,
    alignSelf: 'center',
    backgroundColor: '#383F51',
    padding: 12,
    borderRadius: 10,
    maxWidth: '80%',
    zIndex: 1,
  },
  popUpText: {
    color: '#FFFFFF',
    fontSize: 16,
  },
  actionContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 20,
  },
  speakButton: {
    backgroundColor: '#383F51',
    alignItems: 'center',
    display: "flex",
    flexDirection: "row",
    textAlign: "center",
    justifyContent: 'center',
    padding: 12,
    margin: 12,
    borderRadius: 16,
    transitionDuration: ".2",
  },
  speakingButton: {
    backgroundColor: '#c1666b',
    opacity: 1,
  },
  speakButtonText: {
    fontSize: 16,
    marginLeft: 6,
    color: "#E8E8E8",
  },
  cancelButton: {
    backgroundColor: '#FF5252',
    alignItems: 'center',
    flexDirection: 'row',
    justifyContent: 'center',
    padding: 12,
    margin: 12,
    borderRadius: 16,
  },
  cancelButtonText: {
    fontSize: 16,
    marginLeft: 6,
    color: "#FFFFFF",
  },
});

export default ChatScreen;
