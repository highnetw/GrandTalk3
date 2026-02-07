import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import React, { useState } from 'react';
import {
    SafeAreaView,
    ScrollView,
    StyleSheet,
    Text,
    TouchableOpacity,
    View,
} from 'react-native';

export default function ConversationScreen() {
  const router = useRouter();
  const [isListening, setIsListening] = useState(false);
  const [messages, setMessages] = useState<Array<{
    id: string;
    text: string;
    translation: string;
    timestamp: Date;
  }>>([]);

  const startListening = () => {
    setIsListening(true);
    // TODO: 음성 인식 시작
  };

  const stopListening = () => {
    setIsListening(false);
    // TODO: 음성 인식 중지
  };

  return (
    <SafeAreaView style={styles.container}>
      {/* 헤더 */}
      <View style={styles.header}>
        <TouchableOpacity onPress={() => router.back()} style={styles.backButton}>
          <Ionicons name="arrow-back" size={28} color="#fff" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>대화중</Text>
        <TouchableOpacity style={styles.settingsButton}>
          <Ionicons name="settings-outline" size={24} color="#fff" />
        </TouchableOpacity>
      </View>

      {/* 메시지 영역 */}
      <ScrollView style={styles.messagesContainer}>
        {messages.length === 0 ? (
          <View style={styles.emptyState}>
            <Ionicons name="chatbubbles-outline" size={64} color="#666" />
            <Text style={styles.emptyText}>아래 마이크 버튼을 눌러</Text>
            <Text style={styles.emptyText}>대화를 시작하세요</Text>
          </View>
        ) : (
          messages.map((message) => (
            <View key={message.id} style={styles.messageCard}>
              <Text style={styles.messageText}>{message.text}</Text>
              <Text style={styles.translationText}>{message.translation}</Text>
              <Text style={styles.timestamp}>
                {message.timestamp.toLocaleTimeString('ko-KR')}
              </Text>
            </View>
          ))
        )}
      </ScrollView>

      {/* 하단 컨트롤 */}
      <View style={styles.controls}>
        <TouchableOpacity
          style={[
            styles.micButton,
            isListening && styles.micButtonActive,
          ]}
          onPress={isListening ? stopListening : startListening}
        >
          <Ionicons
            name={isListening ? 'stop' : 'mic'}
            size={48}
            color="#fff"
          />
        </TouchableOpacity>
        <Text style={styles.statusText}>
          {isListening ? '듣고 있습니다...' : '탭하여 말하기'}
        </Text>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#1a1a2e',
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 16,
    paddingVertical: 12,
    backgroundColor: '#16213e',
    borderBottomWidth: 1,
    borderBottomColor: '#2a2a3e',
  },
  backButton: {
    padding: 8,
  },
  headerTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#fff',
  },
  settingsButton: {
    padding: 8,
  },
  messagesContainer: {
    flex: 1,
    padding: 16,
  },
  emptyState: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingVertical: 100,
  },
  emptyText: {
    fontSize: 18,
    color: '#666',
    marginTop: 8,
  },
  messageCard: {
    backgroundColor: '#16213e',
    borderRadius: 12,
    padding: 16,
    marginBottom: 12,
    borderLeftWidth: 4,
    borderLeftColor: '#4CAF50',
  },
  messageText: {
    fontSize: 24,
    color: '#fff',
    marginBottom: 8,
    lineHeight: 36,
  },
  translationText: {
    fontSize: 18,
    color: '#aaa',
    marginBottom: 8,
    lineHeight: 28,
  },
  timestamp: {
    fontSize: 12,
    color: '#666',
    textAlign: 'right',
  },
  controls: {
    alignItems: 'center',
    paddingVertical: 24,
    paddingHorizontal: 16,
    backgroundColor: '#16213e',
    borderTopWidth: 1,
    borderTopColor: '#2a2a3e',
  },
  micButton: {
    width: 100,
    height: 100,
    borderRadius: 50,
    backgroundColor: '#e91e63',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 12,
  },
  micButtonActive: {
    backgroundColor: '#c2185b',
  },
  statusText: {
    fontSize: 16,
    color: '#aaa',
  },
});