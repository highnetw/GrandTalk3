import { Ionicons } from '@expo/vector-icons';
import { Tabs } from 'expo-router';
import React from 'react';
import { Platform } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

export default function TabLayout() {
  const insets = useSafeAreaInsets();

  return (
    <Tabs
      screenOptions={{
        // 활성화된 탭 색상을 할아버지가 좋아하시는 초록색 계열로 변경했습니다.
        tabBarActiveTintColor: '#4CAF50', 
        tabBarInactiveTintColor: '#666',
        tabBarStyle: {
          backgroundColor: '#16213e',
          borderTopColor: '#2a2a3e',
          borderTopWidth: 1,
          height: Platform.OS === 'ios' ? 90 : 70 + insets.bottom,
          paddingBottom: Math.max(insets.bottom, 5),
          paddingTop: 10,
          // 탭이 하나만 남으므로 탭 바를 숨기고 싶으시면 아래 주석을 해제하세요.
          // display: 'none', 
        },
        tabBarLabelStyle: {
          fontSize: 14, // 글자 크기를 조금 더 키웠습니다.
          fontWeight: '600',
        },
        headerShown: false,
      }}
    >
      {/* 1. 홈 탭: 이것만 화면에 나타납니다. */}
      <Tabs.Screen
        name="index"
        options={{
          title: '홈',
          tabBarIcon: ({ color, size }) => (
            <Ionicons name="home" size={size + 4} color={color} />
          ),
        }}
      />

      {/* 2. 나머지 탭들: href: null 을 넣어 파일은 두되 화면에서는 숨겼습니다. */}
      <Tabs.Screen
        name="history"
        options={{
          href: null, // 화면에서 숨김
        }}
      />
      <Tabs.Screen
        name="settings"
        options={{
          href: null, // 화면에서 숨김
        }}
      />
      <Tabs.Screen
        name="help"
        options={{
          href: null, // 화면에서 숨김
        }}
      />
      <Tabs.Screen
        name="explore"
        options={{
          href: null, // 화면에서 숨김
        }}
      />
    </Tabs>
  );
}