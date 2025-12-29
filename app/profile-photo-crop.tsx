import React, { useState } from 'react';
import { StyleSheet, Text, View, TouchableOpacity, Dimensions, Alert, ActivityIndicator, ScrollView } from 'react-native';
import { useRouter, useLocalSearchParams } from 'expo-router';
import { useFonts, NotoSansJP_400Regular, NotoSansJP_700Bold } from '@expo-google-fonts/noto-sans-jp';
import { Ionicons } from '@expo/vector-icons';
import { GestureHandlerRootView, GestureDetector, Gesture } from 'react-native-gesture-handler';
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withSpring,
  runOnJS,
} from 'react-native-reanimated';
import * as ImageManipulator from 'expo-image-manipulator';
import { COLORS } from '@/constants/colors';

const { width: SCREEN_WIDTH, height: SCREEN_HEIGHT } = Dimensions.get('window');
const CIRCLE_SIZE = 280; // Size of the circular crop area
const OUTPUT_SIZE = 512; // High-quality output size for profile pictures

export default function ProfilePhotoCropScreen() {
  const router = useRouter();
  const params = useLocalSearchParams();
  const email = params.email as string;
  const imageUri = params.imageUri as string;
  const withGuide = params.withGuide === 'true';
  const returnTo = params.returnTo as string;
  const [showGuide, setShowGuide] = useState(withGuide);
  const [isProcessing, setIsProcessing] = useState(false);

  // Load fonts first (hook must be called unconditionally)
  let [fontsLoaded] = useFonts({
    NotoSansJP_400Regular,
    NotoSansJP_700Bold,
  });

  // Animation values for pan and zoom
  const scale = useSharedValue(1);
  const savedScale = useSharedValue(1);
  const translateX = useSharedValue(0);
  const translateY = useSharedValue(0);
  const savedTranslateX = useSharedValue(0);
  const savedTranslateY = useSharedValue(0);
  const focalX = useSharedValue(0);
  const focalY = useSharedValue(0);

  // Pinch gesture for zoom with focal point
  const pinchGesture = Gesture.Pinch()
    .onStart((e) => {
      focalX.value = e.focalX;
      focalY.value = e.focalY;
    })
    .onUpdate((e) => {
      const newScale = savedScale.value * e.scale;
      // Limit scale between 0.5 and 5 for more flexibility
      scale.value = Math.min(Math.max(newScale, 0.5), 5);
      
      // Adjust translation to zoom towards focal point
      const scaleDiff = scale.value - savedScale.value;
      translateX.value = savedTranslateX.value - (focalX.value - SCREEN_WIDTH / 2) * scaleDiff / savedScale.value;
      translateY.value = savedTranslateY.value - (focalY.value - SCREEN_WIDTH / 2) * scaleDiff / savedScale.value;
    })
    .onEnd(() => {
      savedScale.value = scale.value;
      savedTranslateX.value = translateX.value;
      savedTranslateY.value = translateY.value;
    });

  // Pan gesture for moving
  const panGesture = Gesture.Pan()
    .onUpdate((e) => {
      translateX.value = savedTranslateX.value + e.translationX;
      translateY.value = savedTranslateY.value + e.translationY;
    })
    .onEnd(() => {
      savedTranslateX.value = translateX.value;
      savedTranslateY.value = translateY.value;
    });

  // Double tap to reset
  const doubleTap = Gesture.Tap()
    .numberOfTaps(2)
    .onEnd(() => {
      scale.value = withSpring(1);
      translateX.value = withSpring(0);
      translateY.value = withSpring(0);
      savedScale.value = 1;
      savedTranslateX.value = 0;
      savedTranslateY.value = 0;
    });

  // Combine gestures
  const composedGesture = Gesture.Race(
    doubleTap,
    Gesture.Simultaneous(pinchGesture, panGesture)
  );

  // Animated style
  const animatedStyle = useAnimatedStyle(() => {
    return {
      transform: [
        { translateX: translateX.value },
        { translateY: translateY.value },
        { scale: scale.value },
      ],
    };
  });

  // Early return after all hooks are called
  if (!fontsLoaded) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color={COLORS.PURPLE_PRIMARY} />
      </View>
    );
  }

  /**
   * Process and crop the image to circular format
   * Implementation: Canvas-based circular cropping with high-quality output
   * Use Cases: 
   * - Profile pictures: Avatar cropping for user accounts
   * - Content management: Image editing for blogs and media
   * - E-commerce: Product photos with consistent format
   * - Social media: Post preparation with circular output
   */
  const handleNext = async () => {
    if (isProcessing) return;
    
    setIsProcessing(true);
    try {
      // Get current transform values from shared values
      const currentScale = scale.value;
      const currentTranslateX = translateX.value;
      const currentTranslateY = translateY.value;

      console.log('🔧 Transform values:', { currentScale, currentTranslateX, currentTranslateY });

      // Load original image to get dimensions
      const imageInfo = await ImageManipulator.manipulateAsync(imageUri, [], {
        format: ImageManipulator.SaveFormat.PNG,
      });

      const imageWidth = imageInfo.width;
      const imageHeight = imageInfo.height;
      console.log('📏 Original image dimensions:', { imageWidth, imageHeight });

      // For resizeMode="cover", calculate how the image is actually displayed
      // The image fills the container (SCREEN_WIDTH x SCREEN_WIDTH) by covering it
      const imageAspect = imageWidth / imageHeight;
      const containerAspect = 1; // Square container
      
      let displayedWidth, displayedHeight, offsetX, offsetY;
      
      if (imageAspect > containerAspect) {
        // Image is wider - height fills container, width is cropped
        displayedHeight = SCREEN_WIDTH;
        displayedWidth = SCREEN_WIDTH * imageAspect;
        offsetX = (displayedWidth - SCREEN_WIDTH) / 2;
        offsetY = 0;
      } else {
        // Image is taller - width fills container, height is cropped
        displayedWidth = SCREEN_WIDTH;
        displayedHeight = SCREEN_WIDTH / imageAspect;
        offsetX = 0;
        offsetY = (displayedHeight - SCREEN_WIDTH) / 2;
      }
      
      console.log('📐 Displayed dimensions:', { displayedWidth, displayedHeight, offsetX, offsetY });
      
      // Scale factor from displayed size to original image size
      const scaleToOriginal = imageWidth / displayedWidth;
      console.log('🔍 Scale to original:', scaleToOriginal);
      
      // Circle center in screen coordinates (center of the screen)
      const circleCenterScreenX = SCREEN_WIDTH / 2;
      const circleCenterScreenY = SCREEN_WIDTH / 2;
      
      // Convert circle center from screen coordinates to image displayed coordinates
      // Account for the user's pan (translate)
      const circleCenterImageX = (circleCenterScreenX + offsetX - currentTranslateX) / currentScale;
      const circleCenterImageY = (circleCenterScreenY + offsetY - currentTranslateY) / currentScale;
      
      console.log('🎯 Circle center in image coords:', { circleCenterImageX, circleCenterImageY });
      
      // Circle radius in displayed image coordinates
      const circleRadiusDisplayed = CIRCLE_SIZE / 2 / currentScale;
      
      // Convert to original image coordinates
      const cropCenterX = circleCenterImageX * scaleToOriginal;
      const cropCenterY = circleCenterImageY * scaleToOriginal;
      const cropRadius = circleRadiusDisplayed * scaleToOriginal;
      
      console.log('✂️ Crop in original coords:', { cropCenterX, cropCenterY, cropRadius });
      
      // Calculate crop rectangle (top-left corner and size)
      const cropX = cropCenterX - cropRadius;
      const cropY = cropCenterY - cropRadius;
      const cropSize = cropRadius * 2;
      
      // Ensure crop region is within image bounds
      const finalCropX = Math.max(0, Math.min(cropX, imageWidth - cropSize));
      const finalCropY = Math.max(0, Math.min(cropY, imageHeight - cropSize));
      const finalCropSize = Math.min(cropSize, imageWidth - finalCropX, imageHeight - finalCropY);

      console.log('📦 Final crop:', { finalCropX, finalCropY, finalCropSize });

      // Step 1: Crop to square
      const croppedImage = await ImageManipulator.manipulateAsync(
        imageUri,
        [
          {
            crop: {
              originX: Math.round(finalCropX),
              originY: Math.round(finalCropY),
              width: Math.round(finalCropSize),
              height: Math.round(finalCropSize),
            },
          },
          {
            resize: {
              width: OUTPUT_SIZE,
              height: OUTPUT_SIZE,
            },
          },
        ],
        { 
          compress: 1, // Maximum quality
          format: ImageManipulator.SaveFormat.PNG,
          base64: false,
        }
      );

      console.log('✅ Image cropped successfully:', croppedImage.uri);

      // Navigate to next screen with high-quality cropped image
      router.push({
        pathname: '/profile-photo-filter',
        params: { 
          email, 
          imageUri: croppedImage.uri,
          isCircular: 'true', // Flag for circular treatment
          returnTo,
        },
      });
    } catch (error) {
      console.error('Error processing image:', error);
      Alert.alert(
        'エラー', 
        '画像の処理中にエラーが発生しました。もう一度お試しください。'
      );
    } finally {
      setIsProcessing(false);
    }
  };

  const handleCancel = () => {
    router.back();
  };

  return (
    <GestureHandlerRootView style={styles.container}>
      <ScrollView 
        contentContainerStyle={styles.scrollContent}
        bounces={false}
        showsVerticalScrollIndicator={false}
      >
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
          <View style={styles.cropArea}>
            <GestureDetector gesture={composedGesture}>
              <Animated.View style={styles.imageWrapper}>
                <Animated.Image 
                  source={{ uri: imageUri }} 
                  style={[styles.image, animatedStyle]} 
                  resizeMode="cover" 
                />
              </Animated.View>
            </GestureDetector>
          </View>
          {showGuide && (
            <View style={styles.guideCircle} pointerEvents="none">
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

      {/* Instructions */}
      <View style={styles.instructionsContainer}>
        <Text style={styles.instructionText}>
          ピンチで拡大縮小、ドラッグで移動、ダブルタップでリセット
        </Text>
      </View>

      {/* Navigation Buttons */}
      <View style={styles.navigationContainer}>
        <TouchableOpacity 
          style={styles.navButton} 
          onPress={handleCancel}
          disabled={isProcessing}
        >
          <Text style={styles.navButtonText}>キャンセル</Text>
        </TouchableOpacity>
        <TouchableOpacity 
          style={[styles.navButtonNext, isProcessing && styles.navButtonDisabled]} 
          onPress={handleNext}
          disabled={isProcessing}
        >
          {isProcessing ? (
            <ActivityIndicator color={COLORS.WHITE} size="small" />
          ) : (
            <Text style={styles.navButtonNextText}>次へ</Text>
          )}
        </TouchableOpacity>
      </View>
      </ScrollView>

      {/* Processing Overlay */}
      {isProcessing && (
        <View style={styles.processingOverlay}>
          <View style={styles.processingBox}>
            <ActivityIndicator size="large" color={COLORS.TEAL_PRIMARY} />
            <Text style={styles.processingText}>画像を処理中...</Text>
          </View>
        </View>
      )}
    </GestureHandlerRootView>
  );
}

const styles = StyleSheet.create({
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: COLORS.BLACK,
  },
  container: {
    flex: 1,
    backgroundColor: COLORS.BLACK,
  },
  scrollContent: {
    flexGrow: 1,
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
    width: SCREEN_WIDTH,
    height: SCREEN_WIDTH,
    justifyContent: 'center',
    alignItems: 'center',
    position: 'relative',
    alignSelf: 'center',
    marginVertical: 20,
  },
  cropArea: {
    width: SCREEN_WIDTH,
    height: SCREEN_WIDTH,
    overflow: 'hidden',
    backgroundColor: COLORS.BLACK,
    justifyContent: 'center',
    alignItems: 'center',
  },
  imageWrapper: {
    width: SCREEN_WIDTH,
    height: SCREEN_WIDTH,
    justifyContent: 'center',
    alignItems: 'center',
  },
  image: {
    width: '100%',
    height: '100%',
  },
  guideCircle: {
    position: 'absolute',
    width: CIRCLE_SIZE,
    height: CIRCLE_SIZE,
    borderRadius: CIRCLE_SIZE / 2,
    borderWidth: 2,
    borderColor: COLORS.WHITE,
    borderStyle: 'dashed',
    justifyContent: 'center',
    alignItems: 'center',
  },
  guideCircleInner: {
    width: CIRCLE_SIZE - 20,
    height: CIRCLE_SIZE - 20,
    borderRadius: (CIRCLE_SIZE - 20) / 2,
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
  instructionsContainer: {
    paddingHorizontal: 20,
    paddingVertical: 10,
    alignItems: 'center',
  },
  instructionText: {
    fontSize: 12,
    color: COLORS.GREY_LIGHT,
    fontFamily: 'NotoSansJP_400Regular',
    textAlign: 'center',
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
  navButtonDisabled: {
    opacity: 0.5,
  },
  processingOverlay: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: 'rgba(0, 0, 0, 0.7)',
    justifyContent: 'center',
    alignItems: 'center',
    zIndex: 1000,
  },
  processingBox: {
    backgroundColor: COLORS.WHITE,
    padding: 30,
    borderRadius: 15,
    alignItems: 'center',
    gap: 15,
  },
  processingText: {
    fontSize: 16,
    color: COLORS.GREY_DARK,
    fontFamily: 'NotoSansJP_400Regular',
  },
});

