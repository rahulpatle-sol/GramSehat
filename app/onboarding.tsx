import React, { useState, useRef, ReactElement } from 'react';
import {
  View, Text, StyleSheet, TouchableOpacity, Dimensions, FlatList,
  Platform, StatusBar,
} from 'react-native';
import { SafeAreaView, useSafeAreaInsets } from 'react-native-safe-area-context';
import { useRouter } from 'expo-router';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { Ionicons, MaterialCommunityIcons } from '@expo/vector-icons';
import Animated, { FadeInDown, FadeInUp, BounceIn, LightSpeedInRight } from 'react-native-reanimated';
import { Colors, Spacing, Radius, Shadow, Typography } from '../constants/theme';

const { width, height } = Dimensions.get('window');

const FEATURES = [
  {
    icon: 'stethoscope',
    iconFamily: 'MaterialCommunityIcons',
    title: 'Symptom Check',
    subtitle: 'AI-powered symptom analysis & early detection',
  },
  {
    icon: 'pill',
    iconFamily: 'MaterialCommunityIcons',
    title: 'Medicine Search',
    subtitle: 'Find & verify medicines instantly',
  },
  {
    icon: 'hospital-building',
    iconFamily: 'MaterialCommunityIcons',
    title: 'Nearby Hospitals',
    subtitle: 'Locate healthcare facilities near you',
  },
  {
    icon: 'clipboard-outline',
    iconFamily: 'Ionicons',
    title: 'Health Records',
    subtitle: 'Store & manage family health records',
  },
];

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: Colors.primary },
  header: { position: 'absolute', top: Platform.OS === 'android' ? 50 : 20, right: Spacing.lg, zIndex: 10 },
  skipBtn: { paddingHorizontal: Spacing.lg, paddingVertical: Spacing.sm },
  skipText: { color: 'rgba(255,255,255,0.9)', fontSize: 16, fontWeight: '600' },
  slide: {
    width,
    height: height - 180,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: Spacing.xxxl,
  },
  logoWrap: {
    width: 120,
    height: 120,
    borderRadius: 60,
    backgroundColor: 'rgba(255,255,255,0.2)',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: Spacing.xxl,
  },
  logo: {
    width: 100,
    height: 100,
    borderRadius: 50,
    backgroundColor: Colors.surface,
    justifyContent: 'center',
    alignItems: 'center',
  },
  logoText: {
    fontSize: 36,
    fontWeight: '800',
    color: Colors.primary,
    letterSpacing: 1,
  },
  tagline: {
    fontSize: 22,
    fontWeight: '700',
    color: Colors.textInverse,
    textAlign: 'center',
    marginBottom: Spacing.lg,
  },
  description: {
    fontSize: 16,
    fontWeight: '400',
    color: 'rgba(255,255,255,0.9)',
    textAlign: 'center',
    lineHeight: 24,
    paddingHorizontal: Spacing.sm,
  },
  aboutTitle: {
    fontSize: 26,
    fontWeight: '700',
    color: Colors.textInverse,
    textAlign: 'center',
    marginBottom: Spacing.sm,
  },
  aboutSubtitle: {
    fontSize: 15,
    fontWeight: '400',
    color: 'rgba(255,255,255,0.8)',
    textAlign: 'center',
    marginBottom: Spacing.xxl,
  },
  cardsContainer: {
    width: '100%',
    gap: Spacing.md,
  },
  card: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: Colors.surface,
    borderRadius: Radius.lg,
    paddingHorizontal: Spacing.lg,
    paddingVertical: Spacing.lg,
    ...Shadow.md,
  },
  cardIcon: {
    width: 48,
    height: 48,
    borderRadius: Radius.md,
    backgroundColor: Colors.primaryLight,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: Spacing.lg,
  },
  cardText: { flex: 1 },
  cardTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: Colors.text,
    marginBottom: 2,
  },
  cardSubtitle: {
    fontSize: 13,
    fontWeight: '400',
    color: Colors.textSecondary,
  },
  footer: {
    position: 'absolute',
    bottom: Platform.OS === 'android' ? 40 : 30,
    left: 0,
    right: 0,
    paddingHorizontal: Spacing.xxl,
  },
  pagination: { flexDirection: 'row', justifyContent: 'center', gap: Spacing.sm, marginBottom: Spacing.xxl },
  dot: { width: 8, height: 8, borderRadius: 4, backgroundColor: 'rgba(255,255,255,0.4)' },
  dotActive: { width: 24, backgroundColor: Colors.textInverse },
  nextBtn: {
    paddingVertical: Spacing.lg,
    borderRadius: Radius.lg,
    alignItems: 'center',
    backgroundColor: Colors.textInverse,
    ...Shadow.lg,
  },
  nextBtnText: { ...Typography.bodyBold, color: Colors.primary, fontSize: 18 },
});

const FeatureIcon = ({ item, index }: { item: typeof FEATURES[0]; index: number }) => {
  const iconProps = { size: 28, color: Colors.primary };
  return (
    <Animated.View
      entering={FadeInDown.delay(200 + index * 150).springify()}
      style={styles.card}
    >
      <View style={styles.cardIcon}>
        {item.iconFamily === 'MaterialCommunityIcons' ? (
          <MaterialCommunityIcons name={item.icon as any} {...iconProps} />
        ) : (
          <Ionicons name={item.icon as any} {...iconProps} />
        )}
      </View>
      <View style={styles.cardText}>
        <Text style={styles.cardTitle}>{item.title}</Text>
        <Text style={styles.cardSubtitle}>{item.subtitle}</Text>
      </View>
    </Animated.View>
  );
};

const slides = [
  {
    id: 1,
    content: (
      <View style={styles.slide}>
        <Animated.View entering={BounceIn.delay(200).springify()} style={styles.logoWrap}>
          <View style={styles.logo}>
            <Text style={styles.logoText}>GS</Text>
          </View>
        </Animated.View>
        <Animated.Text entering={FadeInDown.delay(600).springify()} style={styles.tagline}>
          Swasth Gaon, Swasth Desh
        </Animated.Text>
        <Animated.Text entering={FadeInDown.delay(800).springify()} style={styles.description}>
          Your village health companion for early disease detection, medicine verification, and healthcare access — bridging the gap between rural India and quality medical care.
        </Animated.Text>
      </View>
    ),
  },
  {
    id: 2,
    content: (
      <View style={styles.slide}>
        <Animated.Text entering={FadeInDown.delay(200).springify()} style={styles.aboutTitle}>
          GramSehat Ke Baare Mein
        </Animated.Text>
        <Animated.Text entering={FadeInDown.delay(400).springify()} style={styles.aboutSubtitle}>
          Everything you need for better health
        </Animated.Text>
        <View style={styles.cardsContainer}>
          {FEATURES.map((item, index) => (
            <FeatureIcon key={item.title} item={item} index={index} />
          ))}
        </View>
      </View>
    ),
  },
];

export default function OnboardingScreen(): ReactElement {
  const [currentIndex, setCurrentIndex] = useState<number>(0);
  const router = useRouter();
  const insets = useSafeAreaInsets();
  const flatRef = useRef<FlatList>(null);

  const handleNext = () => {
    if (currentIndex < slides.length - 1) {
      flatRef.current?.scrollToIndex({ index: currentIndex + 1, animated: true });
      setCurrentIndex(currentIndex + 1);
    } else {
      handleFinish();
    }
  };

  const handleFinish = async () => {
    await AsyncStorage.setItem('onboardingComplete', 'true');
    router.replace('/(auth)/phone');
  };

  const renderSlide = ({ item }: { item: typeof slides[0] }) => item.content;

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="light-content" backgroundColor={Colors.primary} />

      <View style={styles.header}>
        <TouchableOpacity onPress={handleFinish} style={styles.skipBtn}>
          <Text style={styles.skipText}>Skip</Text>
        </TouchableOpacity>
      </View>

      <FlatList
        ref={flatRef}
        data={slides}
        renderItem={renderSlide}
        keyExtractor={(item) => item.id.toString()}
        horizontal
        pagingEnabled
        showsHorizontalScrollIndicator={false}
        bounces={false}
        scrollEnabled={false}
        onMomentumScrollEnd={(e) => {
          const index = Math.round(e.nativeEvent.contentOffset.x / width);
          setCurrentIndex(index);
        }}
      />

      <View style={styles.footer}>
        <View style={styles.pagination}>
          {slides.map((_, index) => (
            <View key={index} style={[styles.dot, currentIndex === index && styles.dotActive]} />
          ))}
        </View>

        <Animated.View entering={FadeInUp.duration(300)}>
          <TouchableOpacity
            style={styles.nextBtn}
            onPress={handleNext}
            activeOpacity={0.9}
          >
            <Text style={styles.nextBtnText}>
              {currentIndex === slides.length - 1 ? 'Get Started' : 'Next'}
            </Text>
          </TouchableOpacity>
        </Animated.View>
      </View>
    </SafeAreaView>
  );
}
