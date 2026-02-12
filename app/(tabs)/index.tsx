import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import React, { useEffect, useState } from 'react';
import {
  Animated,
  Platform,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View
} from 'react-native';
import { ChatHistory, StorageService } from '../../services/StorageService';

export default function HomeScreen() {
  const router = useRouter();
  const [pulseAnim] = useState(new Animated.Value(1));
  const [history, setHistory] = useState<ChatHistory[]>([]);

  // 1. 기록 불러오기 함수
  const loadHistory = async () => {
    const data = await StorageService.getHistory();
    setHistory(data);
  };

  useEffect(() => {
    // 앱 켜질 때 기록 로드
    loadHistory();

    // 버튼 펄스 애니메이션
    Animated.loop(
      Animated.sequence([
        Animated.timing(pulseAnim, {
          toValue: 1.1,
          duration: 1000,
          useNativeDriver: true,
        }),
        Animated.timing(pulseAnim, {
          toValue: 1,
          duration: 1000,
          useNativeDriver: true,
        }),
      ])
    ).start();
  }, []);

  // 2. 기록 목록 각 항목 디자인
  const renderHistoryItem = ({ item }: { item: ChatHistory }) => (
    <View style={styles.historyCard}>
      <Text style={styles.historyTime}>
        {new Date(item.timestamp).toLocaleDateString()}
      </Text>
      <Text style={styles.historyKorean}>🇰🇷 {item.korean}</Text>
      <Text style={styles.historyEnglish}>🇨🇦 {item.english}</Text>
    </View>
  );

  return (
    <View style={styles.container}>
      <ScrollView 
        style={styles.scrollView}
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        {/* 헤더 */}
        <View style={styles.header}>
          <Text style={styles.title}>GrandTalk</Text>
          <Text style={styles.subtitle}>손주와 마음을 나누는 대화</Text>
        </View>

        {/* 메인 컨텐츠 */}
        <View style={styles.content}>
          {/* 큰 버튼 - 누르면 작성 페이지로 이동 */}
          <TouchableOpacity 
            style={styles.micButtonContainer}
            onPress={() => router.push('/comment-writer')}
          >
            <Animated.View
              style={[
                styles.micButton,
                {
                  transform: [{ scale: pulseAnim }],
                },
              ]}
            >
              <Ionicons name="mic" size={80} color="#fff" />
            </Animated.View>
            <Text style={styles.micButtonText}>탭하여 대화 시작</Text>
          </TouchableOpacity>

          {/* 3. 최근 대화 기록 영역 추가 */}
          <View style={styles.historySection}>
            <View style={styles.historyHeader}>
              <Text style={styles.historyTitle}>📜 최근 대화 기록</Text>
              <TouchableOpacity onPress={loadHistory}>
                <Ionicons name="refresh-circle" size={30} color="#4CAF50" />
              </TouchableOpacity>
            </View>

            {history.length > 0 ? (
              history.slice(0, 5).map((item) => ( // 홈화면이니 최근 5개만 먼저 보여줌
                <View key={item.id} style={styles.historyCard}>
                  <Text style={styles.historyTime}>
                    {new Date(item.timestamp).toLocaleDateString()}
                  </Text>
                  <Text style={styles.historyKorean}>🇰🇷 {item.korean}</Text>
                  <Text style={styles.historyEnglish}>🇨🇦 {item.english}</Text>
                </View>
              ))
            ) : (
              <View style={styles.emptyBox}>
                <Text style={styles.emptyText}>아직 저장된 대화가 없어요. 😊</Text>
              </View>
            )}
          </View>

          {/* 빠른 시작 가이드 (기존 유지) */}
          <View style={styles.quickGuide}>
            <Text style={styles.quickGuideTitle}>💡 사용법</Text>
            <Text style={styles.quickGuideText}>
              1. 위 마이크 버튼을 누르세요.{'\n'}
              2. 한글로 상준이에게 할 말을 하세요.{'\n'}
              3. AI가 예쁜 영어로 바꿔줍니다!
            </Text>
          </View>
        </View>
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#131b21' },
  scrollView: { flex: 1 },
  scrollContent: { paddingBottom: 60 },
  header: {
    paddingTop: Platform.OS === 'ios' ? 60 : 50,
    paddingHorizontal: 20,
    paddingBottom: 30,
    alignItems: 'center',
    backgroundColor: '#16213e',
  },
  title: { fontSize: 56, fontWeight: 'bold', color: '#fff' },
  subtitle: { fontSize: 24, color: '#aaa' },
  content: { flex: 1, alignItems: 'center', paddingHorizontal: 20, paddingTop: 30 },
  micButtonContainer: { alignItems: 'center', marginBottom: 40 },
  micButton: {
    width: 180,
    height: 180,
    borderRadius: 90,
    backgroundColor: '#4CAF50', // 녹색 계열로 변경
    justifyContent: 'center',
    alignItems: 'center',
    elevation: 12,
    shadowColor: '#4CAF50',
    shadowOpacity: 0.5,
    shadowRadius: 15,
  },
  micButtonText: { marginTop: 20, fontSize: 28, color: '#fff', fontWeight: 'bold' },
  
  // 기록 목록 스타일
  historySection: { width: '100%', marginBottom: 30 },
  historyHeader: { 
    flexDirection: 'row', 
    justifyContent: 'space-between', 
    alignItems: 'center',
    marginBottom: 15,
    borderBottomWidth: 1,
    borderBottomColor: '#4CAF50',
    paddingBottom: 8
  },
  historyTitle: { fontSize: 24, fontWeight: 'bold', color: '#4CAF50' },
  historyCard: { 
    backgroundColor: '#16213e', 
    borderRadius: 12, 
    padding: 18, 
    marginBottom: 12,
    borderLeftWidth: 5,
    borderLeftColor: '#4CAF50'
  },
  historyTime: { fontSize: 14, color: '#888', marginBottom: 5 },
  historyKorean: { fontSize: 18, color: '#fff', marginBottom: 5 },
  historyEnglish: { fontSize: 22, color: '#FFD700', fontWeight: 'bold' },
  emptyBox: { padding: 20, alignItems: 'center' },
  emptyText: { color: '#888', fontSize: 18 },

  quickGuide: {
    backgroundColor: '#0f3460',
    borderRadius: 12,
    padding: 25,
    width: '100%',
    borderLeftWidth: 6,
    borderLeftColor: '#7a4caf',
  },
  quickGuideTitle: { fontSize: 22, fontWeight: 'bold', color: '#fff', marginBottom: 10 },
  quickGuideText: { fontSize: 20, color: '#ddd', lineHeight: 32 },
});