import React, { useState, ReactElement } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Image, Dimensions, FlatList, Platform, StatusBar } from 'react-native';
import { SafeAreaView, useSafeAreaInsets } from 'react-native-safe-area-context';
import { useRouter } from 'expo-router';
import AsyncStorage from '@react-native-async-storage/async-storage';
import i18n from '../app/src/i18n';

const { width, height } = Dimensions.get('window');

interface OnboardingSlide {
  id: number;
  title: string;
  titleHi: string;
  description: string;
  descriptionHi: string;
  image: string;
}

const SLIDES: OnboardingSlide[] = [
  {
    id: 1,
    title: 'Welcome to GramSehat',
    titleHi: 'GramSehat में आपका स्वागत है',
    description: 'Your village health companion for early disease detection and healthcare access',
    descriptionHi: 'बीमारी की पहले पहचान और स्वास्थ्य सेवाओं के लिए आपके गाँव का स्वास्थ्य साथी',
    image: 'https://images.unsplash.com/photo-1631217868264-e5b90bb7e133?w=800&h=600&fit=crop',
  },
  {
    id: 2,
    title: 'Report Symptoms',
    titleHi: 'लक्षण रिपोर्ट करें',
    description: 'Check symptoms and get AI-powered suggestions. Help detect outbreaks early.',
    descriptionHi: 'लक्षण जाँचें और AI-आधारित सुझाव प्राप्त करें। महामारी की पहले पहचान में मदद करें।',
    image: 'https://images.unsplash.com/photo-1584308666744-24d5c474f2ae?w=800&h=600&fit=crop',
  },
  {
    id: 3,
    title: 'Find Medicines',
    titleHi: 'दवाइयाँ खोजें',
    description: 'Scan medicines to verify authenticity. Keep your family safe from fake drugs.',
    descriptionHi: 'दवाइयों की प्रामाणिकता जाँचें। नकली दवाओं से अपने परिवार को सुरक्षित रखें।',
    image: 'https://images.unsplash.com/photo-1587854692152-cbe660dbde88?w=800&h=600&fit=crop',
  },
  {
    id: 4,
    title: 'Health Records',
    titleHi: 'स्वास्थ्य रिकॉर्ड',
    description: 'Store health records for your entire family. Access anytime, anywhere.',
    descriptionHi: 'पूरे परिवार के स्वास्थ्य रिकॉर्ड संхраित करें। कभी भी, कहीं भी एक्सेस करें।',
    image: 'https://images.unsplash.com/photo-1576091160399-112ba8d25d1d?w=800&h=600&fit=crop',
  },
];

export default function OnboardingScreen(): ReactElement {
  const [currentIndex, setCurrentIndex] = useState<number>(0);
  const router = useRouter();
  const insets = useSafeAreaInsets();
  const isHindi = i18n.locale === 'hi';

  const handleNext = (): void => {
    if (currentIndex < SLIDES.length - 1) {
      setCurrentIndex(currentIndex + 1);
    } else {
      handleFinish();
    }
  };

  const handleSkip = async (): Promise<void> => {
    await handleFinish();
  };

  const handleFinish = async (): Promise<void> => {
    await AsyncStorage.setItem('onboardingComplete', 'true');
    router.replace('/(auth)/phone');
  };

  const renderSlide = ({ item }: { item: OnboardingSlide }): ReactElement => (
    <View style={styles.slide}>
      <Image
        source={{ uri: item.image }}
        style={styles.image}
        resizeMode="cover"
      />
      <View style={styles.textContainer}>
        <Text style={styles.title}>{isHindi ? item.titleHi : item.title}</Text>
        <Text style={styles.description}>{isHindi ? item.descriptionHi : item.description}</Text>
      </View>
    </View>
  );

  return (
    <SafeAreaView style={[styles.container, { paddingTop: insets.top }]}>
      <StatusBar barStyle="light-content" backgroundColor="#4CAF50" />
      
      <View style={styles.header}>
        <TouchableOpacity onPress={handleSkip}>
          <Text style={styles.skipText}>Skip</Text>
        </TouchableOpacity>
      </View>

      <FlatList
        data={SLIDES}
        renderItem={renderSlide}
        keyExtractor={(item) => item.id.toString()}
        horizontal
        pagingEnabled
        showsHorizontalScrollIndicator={false}
        onMomentumScrollEnd={(e) => {
          const index = Math.round(e.nativeEvent.contentOffset.x / width);
          setCurrentIndex(index);
        }}
      />

      <View style={styles.footer}>
        <View style={styles.pagination}>
          {SLIDES.map((_, index) => (
            <View
              key={index}
              style={[
                styles.dot,
                currentIndex === index && styles.dotActive,
              ]}
            />
          ))}
        </View>

        <TouchableOpacity style={styles.nextButton} onPress={handleNext}>
          <Text style={styles.nextButtonText}>
            {currentIndex === SLIDES.length - 1 ? 'Get Started' : 'Next'}
          </Text>
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#4CAF50',
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'flex-end',
    paddingHorizontal: 20,
    paddingVertical: 10,
  },
  skipText: {
    color: 'white',
    fontSize: 16,
    fontWeight: '600',
  },
  slide: {
    width: width,
    alignItems: 'center',
  },
  image: {
    width: width * 0.85,
    height: height * 0.45,
    borderRadius: 20,
  },
  textContainer: {
    paddingHorizontal: 30,
    paddingTop: 40,
    alignItems: 'center',
  },
  title: {
    fontSize: 26,
    fontWeight: 'bold',
    color: 'white',
    textAlign: 'center',
    marginBottom: 16,
  },
  description: {
    fontSize: 16,
    color: 'rgba(255,255,255,0.9)',
    textAlign: 'center',
    lineHeight: 24,
  },
  footer: {
    paddingHorizontal: 30,
    paddingBottom: Platform.OS === 'ios' ? 40 : 30,
  },
  pagination: {
    flexDirection: 'row',
    justifyContent: 'center',
    marginBottom: 30,
  },
  dot: {
    width: 10,
    height: 10,
    borderRadius: 5,
    backgroundColor: 'rgba(255,255,255,0.3)',
    marginHorizontal: 5,
  },
  dotActive: {
    backgroundColor: 'white',
    width: 30,
  },
  nextButton: {
    backgroundColor: 'white',
    paddingVertical: 16,
    borderRadius: 30,
    alignItems: 'center',
  },
  nextButtonText: {
    color: '#4CAF50',
    fontSize: 18,
    fontWeight: 'bold',
  },
});