import { getGeminiService, isGeminiInitialized, TranslationVariant } from '@/services/gemini';
import { Ionicons } from '@expo/vector-icons';
import * as Clipboard from 'expo-clipboard';
import { useRouter } from 'expo-router';
import React, { useEffect, useState } from 'react';
import {
  ActivityIndicator,
  Alert,
  SafeAreaView,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from 'react-native';

export default function CommentWriterScreen() {
  const router = useRouter();
  const [recognizedText, setRecognizedText] = useState('');
  const [isTranslating, setIsTranslating] = useState(false);
  const [translations, setTranslations] = useState<TranslationVariant[]>([]);
  const [selectedIndex, setSelectedIndex] = useState<number | null>(null);

  useEffect(() => {
    if (!isGeminiInitialized()) {
      Alert.alert(
        'API 키 필요',
        'Gemini API 키를 먼저 설정해주세요.',
        [
          { text: '설정으로 이동', onPress: () => router.push('/(tabs)/settings') },
          { text: '취소', onPress: () => router.back() },
        ]
      );
    }
  }, []);

  const startTranslation = async () => {
    if (!recognizedText.trim()) {
      Alert.alert('알림', '먼저 한글 댓글을 입력해주세요');
      return;
    }

    try {
      setIsTranslating(true);
      setTranslations([]);
      setSelectedIndex(null);

      const gemini = getGeminiService();
      const results = await gemini.translateToEnglish(recognizedText);
      setTranslations(results);
    } catch (error: any) {
      Alert.alert('오류', error.message || '번역에 실패했습니다');
    } finally {
      setIsTranslating(false);
    }
  };

  const selectAndCopy = async (index: number) => {
    setSelectedIndex(index);
    const selectedText = translations[index].text;
    await Clipboard.setStringAsync(selectedText);

    Alert.alert(
      '복사 완료! 📋',
      '클립보드에 복사되었습니다.\n손자 블로그에 붙여넣기 하세요!',
      [{ text: '확인' }]
    );
  };

  const reset = () => {
    setRecognizedText('');
    setTranslations([]);
    setSelectedIndex(null);
  };

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity onPress={() => router.back()} style={styles.backButton}>
          <Ionicons name="arrow-back" size={28} color="#fff" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>댓글 작성 도우미</Text>
        <TouchableOpacity onPress={reset} style={styles.resetButton}>
          <Ionicons name="refresh" size={24} color="#fff" />
        </TouchableOpacity>
      </View>

      <ScrollView style={styles.content} contentContainerStyle={styles.contentContainer}>
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>1. 한글로 입력하세요 ✍️</Text>
          <TextInput
            style={styles.textInput}
            placeholder="예: 손자야 오늘 운동회 하느라 수고 많았어!"
            placeholderTextColor="#666"
            value={recognizedText}
            onChangeText={setRecognizedText}
            multiline
            numberOfLines={4}
          />
        </View>

        {recognizedText.trim().length > 0 && !isTranslating && translations.length === 0 && (
          <View style={styles.section}>
            <TouchableOpacity style={styles.translateButton} onPress={startTranslation}>
              <Ionicons name="language" size={24} color="#fff" />
              <Text style={styles.translateButtonText}>영어로 번역하기</Text>
            </TouchableOpacity>
          </View>
        )}

        {isTranslating && (
          <View style={styles.loadingContainer}>
            <ActivityIndicator size="large" color="#e91e63" />
            <Text style={styles.loadingText}>AI가 손자가 좋아할 표현으로{'\n'}번역하고 있습니다...</Text>
          </View>
        )}

        {translations.length > 0 && (
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>3. 마음에 드는 표현을 선택하세요 ✨</Text>
            {translations.map((variant, index) => (
              <TouchableOpacity
                key={index}
                style={[
                  styles.translationCard,
                  selectedIndex === index && styles.translationCardSelected,
                ]}
                onPress={() => selectAndCopy(index)}
              >
                <View style={styles.translationHeader}>
                  <Text style={styles.translationStyle}>{variant.style} 스타일</Text>
                  {selectedIndex === index && <Ionicons name="checkmark-circle" size={24} color="#4CAF50" />}
                </View>
                <Text style={styles.translationText}>{variant.text}</Text>
                <View style={styles.translationFooter}>
                  <Ionicons name="copy-outline" size={16} color="#aaa" />
                  <Text style={styles.translationFooterText}>탭하여 복사하기</Text>
                </View>
              </TouchableOpacity>
            ))}
          </View>
        )}
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#1a1a2e' },
  header: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', paddingHorizontal: 16, paddingVertical: 12, backgroundColor: '#16213e' },
  headerTitle: { fontSize: 20, fontWeight: 'bold', color: '#fff' },
  backButton: { padding: 8 },
  resetButton: { padding: 8 },
  content: { flex: 1 },
  contentContainer: { paddingBottom: 40 },
  section: { padding: 20 },
  sectionTitle: { fontSize: 18, fontWeight: 'bold', color: '#fff', marginBottom: 16 },
  textInput: { backgroundColor: '#16213e', borderRadius: 12, padding: 16, color: '#fff', fontSize: 18, minHeight: 120, textAlignVertical: 'top', borderWidth: 2, borderColor: '#4CAF50' },
  translateButton: { backgroundColor: '#2196F3', borderRadius: 12, padding: 20, flexDirection: 'row', alignItems: 'center', justifyContent: 'center' },
  translateButtonText: { color: '#fff', fontSize: 18, fontWeight: '600', marginLeft: 8 },
  loadingContainer: { padding: 40, alignItems: 'center' },
  loadingText: { color: '#aaa', fontSize: 16, marginTop: 16, textAlign: 'center' },
  translationCard: { backgroundColor: '#16213e', borderRadius: 12, padding: 16, marginBottom: 12, borderWidth: 2, borderColor: 'transparent' },
  translationCardSelected: { borderColor: '#4CAF50', backgroundColor: '#1a2f1a' },
  translationHeader: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 12 },
  translationStyle: { fontSize: 14, color: '#e91e63', fontWeight: '600' },
  translationText: { fontSize: 18, color: '#fff', lineHeight: 28, marginBottom: 12 },
  translationFooter: { flexDirection: 'row', alignItems: 'center' },
  translationFooterText: { fontSize: 12, color: '#aaa', marginLeft: 4 },
});