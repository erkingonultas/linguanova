import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, ScrollView } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import Voice from "@react-native-voice/voice";


interface ChatMessage {
  id: string;
  text: string;
  isUser: boolean;
}

const ChatScreen: React.FC = () => {
  const [isListening, setIsListening] = useState(false);
  const [recording, setRecording] = useState(false);
  const [messages, setMessages] = useState<ChatMessage[]>([]);

  const speechStartHandler = async () => {
    try {
      // await Voice.start('en-US');
      console.log("speech started");
      setIsListening(true);
    } catch (e) {
      console.error(e);
    }
  };

  const speechEndHandler = async (e: any) => {
    try {
      // await Voice.start('en-US');
      console.log("speech emd");
      setIsListening(false);
    } catch (e) {
      console.error(e);
    }
  };

  const speechResultsHandler = async (e: any) => {
    try {
      // await Voice.start('en-US');
      console.log("speech results" ,e);
    } catch (e) {
      console.error(e);
    }
  };
  const speechErrorHandler = async (e: any) => {
    console.error("speech error" ,e);
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
  }

  const stopRecording = async () => {
    if (Voice) {
      try {
        await Voice.stop();
        setRecording(false);
      } catch (error) {
        console.error(error);
      } 
    }
  }

  

  // const stopListening = async () => {
  //   try {
  //     // await Voice.stop();
  //     setIsListening(false);
  //   } catch (e) {
  //     console.error(e);
  //   }
  // };

  // Voice.onSpeechResults = (e: any) => {
  //   if (e.value) {
  //     const newMessage: ChatMessage = {
  //       id: Date.now().toString(),
  //       text: e.value[0],
  //       isUser: true,
  //     };
  //     setMessages((prevMessages) => [...prevMessages, newMessage]);
  //     // Here you would typically send the message to your AI service
  //     // and then add the AI's response to the messages array
  //   }
  // };

  useEffect(() => {
    Voice.onSpeechStart = speechStartHandler;
    Voice.onSpeechEnd = speechEndHandler;
    Voice.onSpeechResults = speechResultsHandler;
    Voice.onSpeechError = speechErrorHandler;

  
    return () => {
      Voice.destroy().then(Voice.removeAllListeners);
    }
  }, [])
  

  return (
    <View style={styles.container}>
      <View style={styles.chatBox}>
      <ScrollView style={styles.chatHistory}>
        {messages.length > 0 ?
          messages.map((message) => (
            <View
              key={message.id}
              style={[
                message.isUser ? styles.userMessage : styles.aiMessage,
                styles.messageBubble,
              ]}
            >
              <Text style={styles.messageText}>{message.text}</Text>
            </View>
          )) : <View
            key="empty"
            style={[
              styles.messageBubble,
              styles.aiMessage,
            ]}
          >
            <Text style={styles.messageText}>Hey, how are you today?</Text>
          </View>
        }
      </ScrollView>
      </View>
      <TouchableOpacity
        style={[styles.speakButton, isListening && styles.listeningButton]}
        onPressIn={startRecording}
        onPressOut={stopRecording}
      >
        <Ionicons
          name={isListening ? 'mic' : 'mic-outline'}
          size={26}
          color="#FFFFFF"
        />
        <Text style={styles.speakButtonText}>
          {isListening ? 'Listening...' : 'Hold to Speak'}
        </Text>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
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
  listeningButton: {
    backgroundColor: '#c1666b',
    opacity: 1,
  },
  speakButtonText: {
    fontSize: 16,
    marginLeft: 6,
    color: "#E8E8E8",
  },
});

export default ChatScreen;

