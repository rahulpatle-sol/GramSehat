import React, { ReactElement, useState, useEffect } from 'react';
import { Tabs, useRouter } from 'expo-router';
import { View, Text, Platform, StyleSheet, TouchableOpacity } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withSpring,
  FadeInUp,
} from 'react-native-reanimated';
import i18n from '../../src/i18n';
import { Colors, Radius, Shadow } from '../../constants/theme';
import { Ionicons, MaterialCommunityIcons } from '@expo/vector-icons';
import QuickAddSheet from '../../components/QuickAddSheet';

type TabConfig = {
  icon: string;
  lib: 'ion' | 'material';
  labelKey: string;
};

const TABS: Record<string, TabConfig> = {
  index: { icon: 'home-outline', lib: 'ion', labelKey: 'home' },
  profile: { icon: 'person-outline', lib: 'ion', labelKey: 'profile' },
};

function TabIcon({ name, focused }: { name: string; focused: boolean }): ReactElement {
  const config = TABS[name];
  if (!config) return <View />;

  const scale = useSharedValue(focused ? 1 : 0.85);
  const translateY = useSharedValue(focused ? -4 : 0);

  useEffect(() => {
    if (focused) {
      scale.value = withSpring(1, { stiffness: 250, damping: 18 });
      translateY.value = withSpring(-4, { stiffness: 250, damping: 18 });
    } else {
      scale.value = withSpring(0.85, { stiffness: 250, damping: 18 });
      translateY.value = withSpring(0, { stiffness: 250, damping: 18 });
    }
  }, [focused]);

  const animatedStyle = useAnimatedStyle(() => ({
    transform: [
      { scale: scale.value },
      { translateY: translateY.value },
    ],
  }));

  const iconColor = focused ? Colors.primary : '#94a3b8';
  const iconSize = 22;

  const renderIcon = () => {
    if (config.lib === 'material') {
      return <MaterialCommunityIcons name={config.icon as any} size={iconSize} color={iconColor} />;
    }
    return <Ionicons name={config.icon as any} size={iconSize} color={iconColor} />;
  };

  return (
    <Animated.View style={[styles.tabItem, animatedStyle]}>
      <View style={[styles.iconWrap, focused && styles.iconWrapActive]}>
        {renderIcon()}
      </View>
      {focused && (
        <Animated.Text entering={FadeInUp.duration(200)} style={styles.tabLabel}>
          {i18n.t(config.labelKey)}
        </Animated.Text>
      )}
    </Animated.View>
  );
}

function PlusButton({ onPress }: { onPress: () => void }) {
  const scale = useSharedValue(1);
  const animatedStyle = useAnimatedStyle(() => ({
    transform: [{ scale: scale.value }],
  }));

  return (
    <Animated.View style={animatedStyle}>
      <TouchableOpacity
        style={styles.plusBtn}
        onPressIn={() => { scale.value = withSpring(0.9); }}
        onPressOut={() => { scale.value = withSpring(1); }}
        onPress={onPress}
        activeOpacity={0.8}
      >
        <Ionicons name="add" size={28} color="#fff" />
      </TouchableOpacity>
    </Animated.View>
  );
}

export default function TabLayout(): ReactElement {
  const insets = useSafeAreaInsets();
  const router = useRouter();
  const [showQuickAdd, setShowQuickAdd] = useState(false);

  const handleAddPerson = () => {
    router.push('/(tabs)/family');
  };

  const handleAddRecord = () => {
    router.push('/(tabs)/add-record');
  };

  return (
    <>
      <Tabs
        screenOptions={{
          headerShown: false,
          tabBarStyle: {
            height: Platform.OS === 'ios' ? 88 : 64 + insets.bottom,
            paddingTop: 8,
            paddingBottom: Platform.OS === 'ios' ? 28 : insets.bottom + 4,
            backgroundColor: Colors.surface,
            borderTopWidth: 0,
            elevation: 0,
            ...Shadow.lg,
          },
          tabBarShowLabel: false,
          tabBarHideOnKeyboard: true,
        }}
      >
        <Tabs.Screen
          name="index"
          options={{ tabBarIcon: ({ focused }) => <TabIcon name="index" focused={focused} /> }}
        />
        <Tabs.Screen
          name="quick-add"
          options={{
            tabBarButton: () => (
              <View style={styles.plusWrap}>
                <PlusButton onPress={() => setShowQuickAdd(true)} />
              </View>
            ),
          }}
        />
        <Tabs.Screen
          name="profile"
          options={{ tabBarIcon: ({ focused }) => <TabIcon name="profile" focused={focused} /> }}
        />
        {/* Hidden screens */}
        <Tabs.Screen name="symptoms" options={{ href: null }} />
        <Tabs.Screen name="medicine" options={{ href: null }} />
        <Tabs.Screen name="records" options={{ href: null }} />
        <Tabs.Screen name="notifications" options={{ href: null }} />
        <Tabs.Screen name="hospitals" options={{ href: null }} />
        <Tabs.Screen name="family" options={{ href: null }} />
        <Tabs.Screen name="add-record" options={{ href: null }} />
      </Tabs>

      <QuickAddSheet
        visible={showQuickAdd}
        onClose={() => setShowQuickAdd(false)}
        onAddPerson={handleAddPerson}
        onAddRecord={handleAddRecord}
      />
    </>
  );
}

const styles = StyleSheet.create({
  tabItem: {
    alignItems: 'center',
    justifyContent: 'center',
  },
  iconWrap: {
    width: 36,
    height: 36,
    borderRadius: Radius.md,
    justifyContent: 'center',
    alignItems: 'center',
  },
  iconWrapActive: {
    backgroundColor: '#ecfdf5',
  },
  tabLabel: {
    fontSize: 10,
    color: Colors.primary,
    fontWeight: '600',
    marginTop: 2,
    letterSpacing: 0.2,
  },
  plusWrap: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    top: Platform.OS === 'ios' ? -8 : -6,
  },
  plusBtn: {
    width: 48,
    height: 48,
    borderRadius: 24,
    backgroundColor: Colors.primary,
    justifyContent: 'center',
    alignItems: 'center',
    ...Shadow.md,
  },
});
