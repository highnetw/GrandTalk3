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
  View,
} from 'react-native';

export default function HomeScreen() {
  const router = useRouter();
  const [pulseAnim] = useState(new Animated.Value(1));

  useEffect(() => {
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

  return (
    <View style={styles.container}>
      {/* 1. ScrollView로 전체를 감싸서 가림 현상 방지 */}
      <ScrollView 
        style={styles.scrollView}
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        {/* 헤더 */}
        <View style={styles.header}>
          <Text style={styles.title}>GrandTalk</Text>
          <Text style={styles.subtitle}>blog에 영어 댓글 달기</Text>
        </View>

        {/* 메인 컨텐츠 */}
        <View style={styles.content}>
          {/* 큰 버튼 */}
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
              <Ionicons name="create" size={80} color="#fff" />
            </Animated.View>
            <Text style={styles.micButtonText}>탭하여 녹음</Text>
          </TouchableOpacity>

          {/* 안내 문구 - 아이콘과 글자 크기 확대 */}
          <View style={styles.infoBox}>
            <View style={styles.infoRow}>
              <Ionicons name="mic" size={30} color="#4CAF50" />
              <Text style={styles.infoText}>음성인식 후 AI 번역</Text>
            </View>
            <View style={styles.infoRow}>
              <Ionicons name="sparkles" size={30} color="#2196F3" />
              <Text style={styles.infoText}>3가지 style로 번역</Text>
            </View>
            <View style={styles.infoRow}>
              <Ionicons name="copy" size={30} color="#FF9800" />
              <Text style={styles.infoText}>클립보드에 복사</Text>
            </View>
          </View>

          {/* 빠른 시작 가이드 */}
          <View style={styles.quickGuide}>
            <Text style={styles.quickGuideTitle}>💡 사용법</Text>
            <Text style={styles.quickGuideText}>
              1. 마이크 버튼을 누르시고, {'\n'}
              2. 한글로 말씀하세요^^{'\n'}
              3. AI가 영어 번역을 해줍니다,{'\n'}
              4. 3가지 style로 ^^!
            </Text>
          </View>
        </View>
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#131b21',
  },
  scrollView: {
    flex: 1, // 화면 전체를 차지하게 함
  },
  scrollContent: {
    paddingBottom: 120, // 하단 탭 바에 가리지 않게 넉넉한 여백
  },
  header: {
    paddingTop: Platform.OS === 'ios' ? 60 : 50,
    paddingHorizontal: 20,
    paddingBottom: 30,
    alignItems: 'center',
    backgroundColor: '#16213e',
  },
  title: {
    fontSize: 56, // 아주 큰 제목
    fontWeight: 'bold',
    color: '#fff',
    marginBottom: 8,
  },
  subtitle: {
    fontSize: 28, // 자막 크게
    color: '#aaa',
  },
  content: {
    flex: 1,
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingTop: 30,
  },
  micButtonContainer: {
    alignItems: 'center',
    marginBottom: 40,
  },
  micButton: {
    width: 200, // 버튼 크기 확대
    height: 200,
    borderRadius: 75,
    backgroundColor: '#c2dbb4',
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: '#22a05b',
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.5,
    shadowRadius: 16,
    elevation: 12,
  },
  micButtonText: {
    marginTop: 25,
    fontSize: 30, // 버튼 밑 글씨 크게
    color: '#fff',
    fontWeight: 'bold',
  },
  infoBox: {
    backgroundColor: '#16213e',
    borderRadius: 16,
    padding: 24,
    width: '100%',
    maxWidth: 450,
    marginBottom: 30,
  },
  infoRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 20,
  },
  infoText: {
    marginLeft: 15,
    fontSize: 22, // 안내 텍스트 크게
    color: '#fff',
  },
  quickGuide: {
    backgroundColor: '#0f3460',
    borderRadius: 12,
    padding: 25,
    width: '100%',
    maxWidth: 450,
    borderLeftWidth: 6,
    borderLeftColor: '#7a4caf',
  },
  quickGuideTitle: {
    fontSize: 20, // 사용법 제목 크게
    fontWeight: 'bold',
    color: '#fff',
    marginBottom: 15,
  },
  quickGuideText: {
    fontSize: 20, // 사용법 본문 크게
    color: '#ddd',
    lineHeight: 32,
  },
});