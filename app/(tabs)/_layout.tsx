import React, { ReactElement } from 'react';
import { Tabs } from 'expo-router';
import { View, Text, Platform } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import i18n from '../../src/i18n';

function TabIcon({ icon, label, focused }: { icon: string; label: string; focused: boolean }): ReactElement {
  return (
    <View style={{ alignItems: 'center', justifyContent: 'center', paddingTop: 4 }}>
      <Text style={{ fontSize: 24 }}>{icon}</Text>
      <Text 
        style={{ 
          fontSize: 10, 
          color: focused ? '#4CAF50' : '#999', 
          fontWeight: focused ? '600' : '400',
          marginTop: 2,
        }}
      >
        {label}
      </Text>
    </View>
  );
}

export default function TabLayout(): ReactElement {
  const insets = useSafeAreaInsets();

  return (
    <Tabs
      screenOptions={{
        headerShown: false,
        tabBarStyle: {
          height: Platform.OS === 'ios' ? 85 : 65 + insets.bottom,
          paddingTop: 8,
          paddingBottom: Platform.OS === 'ios' ? 30 : insets.bottom + 8,
          backgroundColor: 'white',
          borderTopWidth: 1,
          borderTopColor: '#eee',
          elevation: 8,
          shadowColor: '#000',
          shadowOffset: { width: 0, height: -2 },
          shadowOpacity: 0.1,
          shadowRadius: 4,
        },
        tabBarShowLabel: false,
        tabBarHideOnKeyboard: true,
      }}
    >
      <Tabs.Screen
        name="index"
        options={{
          tabBarIcon: ({ focused }) => (
            <TabIcon icon="🏠" label={i18n.t('home')} focused={focused} />
          ),
        }}
      />
      <Tabs.Screen
        name="symptoms"
        options={{
          tabBarIcon: ({ focused }) => (
            <TabIcon icon="🩺" label={i18n.t('symptoms')} focused={focused} />
          ),
        }}
      />
      <Tabs.Screen
        name="medicine"
        options={{
          tabBarIcon: ({ focused }) => (
            <TabIcon icon="💊" label={i18n.t('medicine')} focused={focused} />
          ),
        }}
      />
      <Tabs.Screen
        name="records"
        options={{
          tabBarIcon: ({ focused }) => (
            <TabIcon icon="📋" label={i18n.t('records')} focused={focused} />
          ),
        }}
      />
      <Tabs.Screen
        name="profile"
        options={{
          tabBarIcon: ({ focused }) => (
            <TabIcon icon="👤" label={i18n.t('profile')} focused={focused} />
          ),
        }}
      />
    </Tabs>
  );
}