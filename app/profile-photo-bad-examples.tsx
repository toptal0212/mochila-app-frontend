import React, { useState, useRef } from 'react';
import { StyleSheet, Text, View, TouchableOpacity, Image, ScrollView, Dimensions, NativeScrollEvent, NativeSyntheticEvent } from 'react-native';
import { useRouter, useLocalSearchParams } from 'expo-router';
import { useFonts, NotoSansJP_400Regular, NotoSansJP_700Bold } from '@expo-google-fonts/noto-sans-jp';
import { COLORS } from '@/constants/colors';

const { width: SCREEN_WIDTH } = Dimensions.get('window');

export default function ProfilePhotoBadExamplesScreen() {
  const router = useRouter();
  const params = useLocalSearchParams();
  const email = params.email as string;
  const [currentPage, setCurrentPage] = useState(0);
  const scrollViewRef = useRef<ScrollView>(null);

  let [fontsLoaded] = useFonts({
    NotoSansJP_400Regular,
    NotoSansJP_700Bold,
  });

  if (!fontsLoaded) {
    return null;
  }

  const handleScroll = (event: NativeSyntheticEvent<NativeScrollEvent>) => {
    const offsetX = event.nativeEvent.contentOffset.x;
    const page = Math.round(offsetX / SCREEN_WIDTH);
    setCurrentPage(page);
  };

  const handleNext = () => {
    router.push({
      pathname: '/profile-photo-register',
      params: { email },
    });
  };

  const badExamples = [
    {
      id: 1,
      label: '顔が暗い写真',
      color: '#FFD700',
      description: 'Photo where the face is dark',
      imageUrl: require('@/assets/images/bad_01.jpg'), 
    },
    {
      id: 2,
      label: '顔が大きすぎる写真',
      color: COLORS.TEAL_PRIMARY,
      description: 'Photo where the face is too big',
      imageUrl: require('@/assets/images/bad_02.jpg'), 
    },
    {
      id: 3,
      label: '本人が写っていない写真',
      color: '#FF6B6B',
      description: 'Photo where the person themselves is not pictured',
      imageUrl: require('@/assets/images/bad_03.jpg'), 
    },
  ];

  return (
    <View style={styles.container}>
      {/* Step Indicator */}
      <View style={styles.stepIndicator}>
        <View style={styles.stepCircle}>
          <Text style={styles.stepNumber}>2</Text>
        </View>
      </View>

      {/* Title */}
      <Text style={styles.title}>
        マッチングしにくい{'\n'}写真3選
      </Text>

      {/* Example Images */}
      <ScrollView 
        ref={scrollViewRef}
        horizontal 
        pagingEnabled
        showsHorizontalScrollIndicator={false}
        onScroll={handleScroll}
        scrollEventThrottle={16}
        style={styles.examplesScrollView}
      >
        {badExamples.map((example, index) => (
          <View key={example.id} style={styles.exampleCard}>
            <Image
              source={example.imageUrl}
              style={styles.exampleImage}
              resizeMode="cover"
            />
          </View>
        ))}
      </ScrollView>

      {/* Explanations */}
      <View style={styles.explanationsContainer}>
        {badExamples.map((example) => (
          <View key={example.id} style={styles.explanationItem}>
            <View style={[styles.numberCircle, { backgroundColor: example.color }]}>
              <Text style={styles.numberText}>{example.id}</Text>
            </View>
            <Text style={styles.explanationText}>{example.label}</Text>
          </View>
        ))}
      </View>

      {/* Pagination Dots */}
      <View style={styles.paginationContainer}>
        {badExamples.map((example, index) => (
          <View 
            key={example.id} 
            style={[styles.dot, currentPage === index && styles.dotActive]} 
          />
        ))}
      </View>

      {/* Next Button */}
      <TouchableOpacity style={styles.nextButton} onPress={handleNext}>
        <Text style={styles.nextButtonText}>次へ</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.WHITE,
    paddingHorizontal: 20,
    paddingTop: 20,
  },
  stepIndicator: {
    marginBottom: 10,
    alignItems: 'center',
  },
  stepCircle: {
    width: 60,
    height: 60,
    borderRadius: 30,
    backgroundColor: COLORS.TEAL_PRIMARY,
    alignItems: 'center',
    justifyContent: 'center',
  },
  stepNumber: {
    fontSize: 24,
    color: COLORS.WHITE,
    fontFamily: 'NotoSansJP_700Bold',
  },
  title: {
    fontSize: 20,
    color: COLORS.GREY_DARK,
    fontFamily: 'NotoSansJP_700Bold',
    textAlign: 'center',
    marginBottom: 30,
    lineHeight: 30,
  },
  examplesScrollView: {
    marginBottom: 10,
    height: 300,
  },
  exampleCard: {
    width: SCREEN_WIDTH,
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 20,
    overflow: 'hidden',
  },
  exampleImagePlaceholder: {
    width: SCREEN_WIDTH - 80,
    height: 280,
    borderRadius: 15,
    alignItems: 'center',
    justifyContent: 'center',
  },
  exampleImage: {
    width: SCREEN_WIDTH - 80,
    height: 280,
    borderRadius: 15,
    alignSelf: 'center',
  },
  placeholderText: {
    fontSize: 14,
    color: COLORS.GREY_MEDIUM,
    fontFamily: 'NotoSansJP_400Regular',
  },
  explanationsContainer: {
    marginBottom: 30,
    gap: 15,
  },
  explanationItem: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: COLORS.GREY_LIGHT,
    paddingVertical: 10,
    paddingHorizontal: 20,
    borderRadius: 10,
  },
  numberCircle: {
    width: 25,
    height: 25,
    borderRadius: 15,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 15,
  },
  numberText: {
    fontSize: 14,
    color: COLORS.WHITE,
    fontFamily: 'NotoSansJP_700Bold',
  },
  explanationText: {
    fontSize: 14,
    color: COLORS.GREY_DARK,
    fontFamily: 'NotoSansJP_400Regular',
    flex: 1,
  },
  paginationContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 10,
    gap: 8,
  },
  dot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: COLORS.GREY_LIGHT,
  },
  dotActive: {
    backgroundColor: COLORS.TEAL_PRIMARY,
  },
  nextButton: {
    width: '100%',
    maxWidth: 300,
    alignSelf: 'center',
    paddingVertical: 12,
    borderRadius: 30,
    backgroundColor: COLORS.TEAL_PRIMARY,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 25,
  },
  nextButtonText: {
    fontSize: 16,
    color: COLORS.WHITE,
    fontFamily: 'NotoSansJP_700Bold',
  },
});

