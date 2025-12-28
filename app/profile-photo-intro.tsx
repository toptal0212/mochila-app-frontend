import React from 'react';
import { StyleSheet, Text, View, TouchableOpacity, Image } from 'react-native';
import { useRouter, useLocalSearchParams } from 'expo-router';
import { useFonts, NotoSansJP_400Regular, NotoSansJP_700Bold } from '@expo-google-fonts/noto-sans-jp';
import { COLORS } from '@/constants/colors';

export default function ProfilePhotoIntroScreen() {
  const router = useRouter();
  const params = useLocalSearchParams();
  const email = params.email as string;

  let [fontsLoaded] = useFonts({
    NotoSansJP_400Regular,
    NotoSansJP_700Bold,
  });

  if (!fontsLoaded) {
    return null;
  }

  const handleNext = () => {
    router.push({
      pathname: '/profile-photo-bad-examples',
      params: { email },
    });
  };

  return (
    <View style={styles.container}>
      {/* Step Indicator */}
      <View style={styles.stepIndicator}>
        <View style={styles.stepCircle}>
          <Text style={styles.stepNumber}>1</Text>
        </View>
      </View>

      {/* Main Content */}
      <View style={styles.mainContent}>
        <Text style={styles.title}>
          マッチングするには{'\n'}顔写真の登録が大切
        </Text>

        {/* Central Graphic */}
        <View style={styles.imageContainer}>
          {/* Main profile photo example */}
          <Image 
            source={require('@/assets/images/良い写真.jpg')}
            style={styles.mainImage}
            resizeMode="cover"
          />
          
          {/* Thumbs up icon */}
          <View style={styles.thumbsUpContainer}>
            <Text style={styles.thumbsUpIcon}>👍</Text>
          </View>
        </View>
      </View>

      {/* Pagination Dots */}
      <View style={styles.paginationContainer}>
        <View style={[styles.dot, styles.dotActive]} />
        <View style={styles.dot} />
        <View style={styles.dot} />
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
    paddingTop: 60,
    alignItems: 'center',
  },
  stepIndicator: {
    marginBottom: 40,
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
  mainContent: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    width: '100%',
  },
  title: {
    fontSize: 20,
    color: COLORS.TEAL_DARK,
    fontFamily: 'NotoSansJP_700Bold',
    textAlign: 'center',
    marginBottom: 40,
    lineHeight: 30,
  },
  imageContainer: {
    width: '100%',
    alignItems: 'center',
    justifyContent: 'center',
    position: 'relative',
  },
  mainImage: {
    width: 250,
    height: 300,
    borderRadius: 20,
    marginBottom: 20,
  },
  thumbsUpContainer: {
    width: 80,
    height: 80,
    borderRadius: 40,
    backgroundColor: COLORS.TEAL_PRIMARY,
    alignItems: 'center',
    justifyContent: 'center',
    position: 'absolute',
    bottom: 0,
    right: 40,
  },
  thumbsUpIcon: {
    fontSize: 40,
  },
  paginationContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 30,
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
    paddingVertical: 18,
    borderRadius: 30,
    backgroundColor: COLORS.TEAL_PRIMARY,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 40,
  },
  nextButtonText: {
    fontSize: 16,
    color: COLORS.WHITE,
    fontFamily: 'NotoSansJP_700Bold',
  },
});

