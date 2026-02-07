import { Ionicons } from '@expo/vector-icons';
import { Link } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import React, { useEffect, useState } from 'react';
import {
    Animated,
    Platform,
    SafeAreaView,
    StyleSheet,
    Text,
    TouchableOpacity,
    View,
} from 'react-native';

export default function HomeScreen() {
  const [pulseAnim] = useState(new Animated.Value(1));

  useEffect(() => {
    // 마이크 버튼 펄스 애니메이션
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
    <SafeAreaView style={styles.container}>
      <StatusBar style="light" />
      
      {/* 헤더 */}
      <View style={styles.header}>
        <Text style={styles.title}>GrandTalk</Text>
        <Text style={styles.subtitle}>할머니 할아버지와 대화하세요</Text>
      </View>

      {/* 메인 컨텐츠 */}
      <View style={styles.content}>
        {/* 큰 마이크 버튼 */}
        <Link href="/conversation" asChild>
          <TouchableOpacity style={styles.micButtonContainer}>
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
        </Link>

        {/* 안내 문구 */}
        <View style={styles.infoBox}>
          <View style={styles.infoRow}>
            <Ionicons name="volume-high" size={24} color="#4CAF50" />
            <Text style={styles.infoText}>음성을 텍스트로 변환</Text>
          </View>
          <View style={styles.infoRow}>
            <Ionicons name="language" size={24} color="#2196F3" />
            <Text style={styles.infoText}>실시간 번역 지원</Text>
          </View>
          <View style={styles.infoRow}>
            <Ionicons name="text" size={24} color="#FF9800" />
            <Text style={styles.infoText}>큰 글씨로 표시</Text>
          </View>
        </View>
      </View>

      {/* 하단 메뉴 */}
      <View style={styles.footer}>
        <Link href="/settings" asChild>
          <TouchableOpacity style={styles.footerButton}>
            <Ionicons name="settings-outline" size={28} color="#666" />
            <Text style={styles.footerButtonText}>설정</Text>
          </TouchableOpacity>
        </Link>
        
        <Link href="/history" asChild>
          <TouchableOpacity style={styles.footerButton}>
            <Ionicons name="time-outline" size={28} color="#666" />
            <Text style={styles.footerButtonText}>기록</Text>
          </TouchableOpacity>
        </Link>
        
        <Link href="/help" asChild>
          <TouchableOpacity style={styles.footerButton}>
            <Ionicons name="help-circle-outline" size={28} color="#666" />
            <Text style={styles.footerButtonText}>도움말</Text>
          </TouchableOpacity>
        </Link>
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
    paddingTop: Platform.OS === 'ios' ? 20 : 40,
    paddingHorizontal: 20,
    paddingBottom: 30,
    alignItems: 'center',
  },
  title: {
    fontSize: 48,
    fontWeight: 'bold',
    color: '#fff',
    marginBottom: 8,
  },
  subtitle: {
    fontSize: 18,
    color: '#aaa',
  },
  content: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 20,
  },
  micButtonContainer: {
    alignItems: 'center',
    marginBottom: 60,
  },
  micButton: {
    width: 180,
    height: 180,
    borderRadius: 90,
    backgroundColor: '#e91e63',
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: '#e91e63',
    shadowOffset: {
      width: 0,
      height: 8,
    },
    shadowOpacity: 0.5,
    shadowRadius: 16,
    elevation: 12,
  },
  micButtonText: {
    marginTop: 20,
    fontSize: 20,
    color: '#fff',
    fontWeight: '600',
  },
  infoBox: {
    backgroundColor: '#16213e',
    borderRadius: 16,
    padding: 24,
    width: '100%',
    maxWidth: 400,
  },
  infoRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 16,
  },
  infoText: {
    marginLeft: 12,
    fontSize: 16,
    color: '#fff',
  },
  footer: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    paddingVertical: 20,
    paddingHorizontal: 20,
    backgroundColor: '#16213e',
    borderTopWidth: 1,
    borderTopColor: '#2a2a3e',
  },
  footerButton: {
    alignItems: 'center',
    padding: 8,
  },
  footerButtonText: {
    marginTop: 4,
    fontSize: 12,
    color: '#666',
  },
});