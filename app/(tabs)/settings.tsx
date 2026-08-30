import { Ionicons } from '@expo/vector-icons';
import React, { useState } from 'react';
import {
  SafeAreaView,
  ScrollView,
  StyleSheet,
  Switch,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';

export default function SettingsScreen() {
  const [autoTranslate, setAutoTranslate] = useState(true);
  const [ttsEnabled, setTtsEnabled] = useState(false);
  const [largeText, setLargeText] = useState(true);
  const [saveHistory, setSaveHistory] = useState(true);

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.headerTitle}>설정</Text>
      </View>

      <ScrollView style={styles.content}>
        {/* 일반 설정 */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>일반</Text>
          
          <View style={styles.settingItem}>
            <View style={styles.settingLeft}>
              <Ionicons name="language" size={24} color="#4CAF50" />
              <View style={styles.settingText}>
                <Text style={styles.settingTitle}>자동 번역</Text>
                <Text style={styles.settingDescription}>
                  음성 인식 후 자동으로 번역
                </Text>
              </View>
            </View>
            <Switch
              value={autoTranslate}
              onValueChange={setAutoTranslate}
              trackColor={{ false: '#555', true: '#4CAF50' }}
            />
          </View>

          <View style={styles.settingItem}>
            <View style={styles.settingLeft}>
              <Ionicons name="volume-high" size={24} color="#2196F3" />
              <View style={styles.settingText}>
                <Text style={styles.settingTitle}>음성 읽기(검토 중)</Text>
                <Text style={styles.settingDescription}>
                  번역된 텍스트를 음성으로 읽기
                </Text>
              </View>
            </View>
            <Switch
              value={ttsEnabled}
              onValueChange={setTtsEnabled}
              trackColor={{ false: '#555', true: '#4CAF50' }}
            />
          </View>

          <View style={styles.settingItem}>
            <View style={styles.settingLeft}>
              <Ionicons name="text" size={24} color="#FF9800" />
              <View style={styles.settingText}>
                <Text style={styles.settingTitle}>큰 글씨(검토 중)</Text>
                <Text style={styles.settingDescription}>
                  어르신이 보기 편한 큰 글씨 사용
                </Text>
              </View>
            </View>
            <Switch
              value={largeText}
              onValueChange={setLargeText}
              trackColor={{ false: '#555', true: '#4CAF50' }}
            />
          </View>
        </View>

        {/* 개인정보 설정 */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>개인정보</Text>
          
          <View style={styles.settingItem}>
            <View style={styles.settingLeft}>
              <Ionicons name="save" size={24} color="#9C27B0" />
              <View style={styles.settingText}>
                <Text style={styles.settingTitle}>대화 기록 저장</Text>
                <Text style={styles.settingDescription}>
                  대화 내용을 기기에 저장
                </Text>
              </View>
            </View>
            <Switch
              value={saveHistory}
              onValueChange={setSaveHistory}
              trackColor={{ false: '#555', true: '#4CAF50' }}
            />
          </View>
        </View>

        {/* 정보 */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>정보</Text>
          
          <TouchableOpacity style={styles.infoItem}>
            <Text style={styles.infoText}>버전</Text>
            <Text style={styles.infoValue}>1.0.0</Text>
          </TouchableOpacity>

          <TouchableOpacity style={styles.infoItem}>
            <Text style={styles.infoText}>개발자</Text>
            <Text style={styles.infoValue}>Chooyoon Kim</Text>
          </TouchableOpacity>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#1a1a2e',
  },
  header: {
    padding: 20,
    backgroundColor: '#16213e',
    borderBottomWidth: 1,
    borderBottomColor: '#2a2a3e',
  },
  headerTitle: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#fff',
  },
  content: {
    flex: 1,
  },
  section: {
    marginTop: 24,
    paddingHorizontal: 16,
  },
  sectionTitle: {
    fontSize: 14,
    fontWeight: 'bold',
    color: '#aaa',
    marginBottom: 12,
    textTransform: 'uppercase',
  },
  // 기존 설정 스타일
  settingItem: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    backgroundColor: '#16213e',
    padding: 16,
    borderRadius: 12,
    marginBottom: 8,
  },
  settingLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },
  settingText: {
    marginLeft: 12,
    flex: 1,
  },
  settingTitle: {
    fontSize: 16,
    color: '#fff',
    fontWeight: '600',
  },
  settingDescription: {
    fontSize: 12,
    color: '#aaa',
    marginTop: 2,
  },
  infoItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    backgroundColor: '#16213e',
    padding: 16,
    borderRadius: 12,
    marginBottom: 8,
  },
  infoText: {
    fontSize: 16,
    color: '#fff',
  },
  infoValue: {
    fontSize: 16,
    color: '#aaa',
  },
});