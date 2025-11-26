import React, { useState } from 'react';
import { StyleSheet, Text, View, TouchableOpacity, Image, Dimensions } from 'react-native';
import { useRouter, useLocalSearchParams } from 'expo-router';
import { useFonts, NotoSansJP_400Regular, NotoSansJP_700Bold } from '@expo-google-fonts/noto-sans-jp';
import { Ionicons } from '@expo/vector-icons';
import { COLORS } from '@/constants/colors';

const { width: SCREEN_WIDTH } = Dimensions.get('window');

export default function ProfilePhotoCropScreen() {
  const router = useRouter();
  const params = useLocalSearchParams();
  const email = params.email as string;
  const imageUri = params.imageUri as string;
  const withGuide = params.withGuide === 'true';
  const [showGuide, setShowGuide] = useState(withGuide);

  let [fontsLoaded] = useFonts({
    NotoSansJP_400Regular,
    NotoSansJP_700Bold,
  });

  if (!fontsLoaded) {
    return null;
  }

  const handleNext = () => {
    router.push({
      pathname: '/profile-photo-filter',
      params: { email, imageUri },
    });
  };

  const handleCancel = () => {
    router.back();
  };

  return (
    <View style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity onPress={handleCancel}>
          <Text style={styles.cancelText}>キャンセル</Text>
        </TouchableOpacity>
        <Text style={styles.title}>移動と拡大縮小</Text>
        <TouchableOpacity onPress={handleNext}>
          <Text style={styles.doneText}>完了</Text>
        </TouchableOpacity>
      </View>

      {/* Image with Guide */}
      <View style={styles.imageContainer}>
        <Image source={{ uri: imageUri }} style={styles.image} resizeMode="contain" />
        {showGuide && (
          <View style={styles.guideCircle}>
            <View style={styles.guideCircleInner} />
          </View>
        )}
      </View>

      {/* Warning Box */}
      {showGuide && (
        <View style={styles.warningBox}>
          <Ionicons name="warning" size={20} color="#FF0000" />
          <View style={styles.warningTextContainer}>
            <Text style={styles.warningText}>
              顔のサイズを見直しましょう
            </Text>
            <Text style={styles.warningSubtext}>
              ガイドと同程度のサイズ感が異性に好印象を与えます
            </Text>
          </View>
        </View>
      )}

      {/* Remove Guide Button */}
      {showGuide && (
        <TouchableOpacity style={styles.removeGuideButton} onPress={() => setShowGuide(false)}>
          <Text style={styles.removeGuideText}>ガイドを消す</Text>
        </TouchableOpacity>
      )}

      {/* Navigation Buttons */}
      <View style={styles.navigationContainer}>
        <TouchableOpacity style={styles.navButton} onPress={handleCancel}>
          <Text style={styles.navButtonText}>キャンセル</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.navButtonNext} onPress={handleNext}>
          <Text style={styles.navButtonNextText}>次へ</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.BLACK,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingTop: 60,
    paddingHorizontal: 20,
    paddingBottom: 20,
  },
  cancelText: {
    fontSize: 16,
    color: COLORS.WHITE,
    fontFamily: 'NotoSansJP_400Regular',
  },
  title: {
    fontSize: 16,
    color: COLORS.WHITE,
    fontFamily: 'NotoSansJP_700Bold',
  },
  doneText: {
    fontSize: 16,
    color: COLORS.WHITE,
    fontFamily: 'NotoSansJP_400Regular',
  },
  imageContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    position: 'relative',
  },
  image: {
    width: SCREEN_WIDTH,
    height: SCREEN_WIDTH,
  },
  guideCircle: {
    position: 'absolute',
    width: 200,
    height: 200,
    borderRadius: 100,
    borderWidth: 2,
    borderColor: COLORS.WHITE,
    borderStyle: 'dashed',
    justifyContent: 'center',
    alignItems: 'center',
  },
  guideCircleInner: {
    width: 180,
    height: 180,
    borderRadius: 90,
    borderWidth: 1,
    borderColor: COLORS.WHITE,
    borderStyle: 'dashed',
  },
  warningBox: {
    flexDirection: 'row',
    backgroundColor: '#FF0000',
    marginHorizontal: 20,
    padding: 15,
    borderRadius: 8,
    marginBottom: 15,
    alignItems: 'flex-start',
  },
  warningTextContainer: {
    marginLeft: 10,
    flex: 1,
  },
  warningText: {
    fontSize: 14,
    color: COLORS.WHITE,
    fontFamily: 'NotoSansJP_700Bold',
    marginBottom: 5,
  },
  warningSubtext: {
    fontSize: 12,
    color: COLORS.WHITE,
    fontFamily: 'NotoSansJP_400Regular',
    lineHeight: 18,
  },
  removeGuideButton: {
    alignSelf: 'center',
    marginBottom: 20,
  },
  removeGuideText: {
    fontSize: 14,
    color: COLORS.WHITE,
    fontFamily: 'NotoSansJP_400Regular',
  },
  navigationContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingHorizontal: 20,
    paddingBottom: 40,
    gap: 15,
  },
  navButton: {
    flex: 1,
    paddingVertical: 15,
    borderRadius: 25,
    backgroundColor: COLORS.GREY_DARK,
    alignItems: 'center',
  },
  navButtonText: {
    fontSize: 16,
    color: COLORS.WHITE,
    fontFamily: 'NotoSansJP_400Regular',
  },
  navButtonNext: {
    flex: 1,
    paddingVertical: 15,
    borderRadius: 25,
    backgroundColor: COLORS.TEAL_PRIMARY,
    alignItems: 'center',
  },
  navButtonNextText: {
    fontSize: 16,
    color: COLORS.WHITE,
    fontFamily: 'NotoSansJP_700Bold',
  },
});

