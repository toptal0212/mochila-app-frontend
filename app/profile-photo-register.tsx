import React, { useState } from 'react';
import { StyleSheet, Text, View, TouchableOpacity, Image, Modal, ScrollView } from 'react-native';
import { useRouter, useLocalSearchParams } from 'expo-router';
import { useFonts, NotoSansJP_400Regular, NotoSansJP_700Bold } from '@expo-google-fonts/noto-sans-jp';
import { Ionicons } from '@expo/vector-icons';
import { COLORS } from '@/constants/colors';
import * as ImagePicker from 'expo-image-picker';

// Import bad example images
const badExampleImages = {
  bad_01: require('@/assets/images/暗い.jpg'),
  bad_02: require('@/assets/images/顔がアップすぎる.jpg'),
  bad_03: require('@/assets/images/顔が見えない.jpg'),
  bad_04: require('@/assets/images/画像が粗い.jpg'),
  bad_05: require('@/assets/images/生活感が溢れている.jpg'),
  bad_06: require('@/assets/images/顔が写っていない.jpg'),
};

// Import good example images (placeholder - use appropriate images)
const goodExampleImages = {
  good_01: require('@/assets/images/笑顔.jpg'), // Replace with actual good example image
  good_02: require('@/assets/images/趣味がわかる.jpg'), // Replace with actual good example image
  good_03: require('@/assets/images/全身がわかる.jpg'), // Replace with actual good example image
};

export default function ProfilePhotoRegisterScreen() {
  const router = useRouter();
  const params = useLocalSearchParams();
  const email = params.email as string;
  const [selectedImage, setSelectedImage] = useState<string | null>(null);
  const [modalVisible, setModalVisible] = useState(false);

  let [fontsLoaded] = useFonts({
    NotoSansJP_400Regular,
    NotoSansJP_700Bold,
  });

  if (!fontsLoaded) {
    return null;
  }

  const handleRegisterPhoto = () => {
    setModalVisible(true);
  };

  const handleSelectFromLibrary = async () => {
    const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();
    if (status !== 'granted') {
      alert('写真へのアクセス許可が必要です');
      return;
    }

    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ['images'],
      allowsEditing: true,
      aspect: [1, 1],
      quality: 1,
      base64: true, // Get base64 for web compatibility
    });

    if (!result.canceled && result.assets[0]) {
      setSelectedImage(result.assets[0].uri);
      setModalVisible(false);
    }
  };

  const handleTakePhoto = async () => {
    const { status } = await ImagePicker.requestCameraPermissionsAsync();
    if (status !== 'granted') {
      alert('カメラへのアクセス許可が必要です');
      return;
    }

    const result = await ImagePicker.launchCameraAsync({
      allowsEditing: true,
      aspect: [1, 1],
      quality: 1,
      base64: true, // Get base64 for web compatibility
    });

    if (!result.canceled && result.assets[0]) {
      setSelectedImage(result.assets[0].uri);
      setModalVisible(false);
      // Navigate to cropping screen with guide
      router.push({
        pathname: '/profile-photo-crop',
        params: { email, imageUri: result.assets[0].uri, withGuide: 'true' },
      });
    }
  };

  const handleNext = () => {
    if (selectedImage) {
      router.push({
        pathname: '/profile-photo-crop',
        params: { email, imageUri: selectedImage },
      });
    }
  };

  const goodExamples = [
    { label: '笑顔', description: 'Smiling face', image: goodExampleImages.good_01 },
    { label: '趣味がわかる', description: 'Shows your hobbies', image: goodExampleImages.good_02 },
    { label: '全身がわかる', description: 'Shows your whole body', image: goodExampleImages.good_03 },
  ];

  return (
    <View style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity onPress={() => router.back()}>
          <Ionicons name="chevron-back" size={24} color={COLORS.GREY_DARK} />
        </TouchableOpacity>
        <Text style={styles.progressText}>10/10</Text>
        <View style={styles.progressBar}>
          <View style={styles.progressFill} />
        </View>
      </View>

      {/* Title */}
      <Text style={styles.title}>プロフィール写真を登録してください</Text>
      <Text style={styles.subtitle}>※写真はいつでも変更ができます</Text>

      {/* Photo Placeholder */}
      <View style={styles.photoContainer}>
        {selectedImage ? (
          <Image source={{ uri: selectedImage }} style={styles.photo} />
        ) : (
          <View style={styles.photoPlaceholder}>
            <Ionicons name="person" size={60} color={COLORS.GREY_MEDIUM} />
          </View>
        )}
      </View>

      {/* Register Button */}
      <TouchableOpacity style={styles.registerButton} onPress={handleRegisterPhoto}>
        <Text style={styles.registerButtonText}>写真を登録する</Text>
      </TouchableOpacity>

      {/* Good Examples */}
      <View style={styles.examplesSection}>
        <Text style={styles.examplesTitle}>良い例</Text>
        <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.examplesScroll}>
          {goodExamples.map((example, index) => (
            <View key={index} style={styles.exampleItem}>
              <View style={styles.exampleImageContainer}>
                <Image source={example.image} style={styles.exampleImage} />
              </View>
              <Text style={styles.exampleLabel}>{example.label}</Text>
            </View>
          ))}
        </ScrollView>
      </View>

      {/* Next Button */}
      <TouchableOpacity
        style={[styles.nextButton, !selectedImage && styles.nextButtonDisabled]}
        onPress={handleNext}
        disabled={!selectedImage}
      >
        <Text style={styles.nextButtonText}>次へ</Text>
      </TouchableOpacity>

      {/* Modal for Upload Options */}
      <Modal
        visible={modalVisible}
        transparent
        animationType="slide"
        onRequestClose={() => setModalVisible(false)}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            <Text style={styles.modalTitle}>マッチングしにくい写真の例</Text>
            
            {/* Bad Examples Grid */}
            <View style={styles.badExamplesGrid}>
              {[
                { label: '暗い', image: badExampleImages.bad_01 },
                { label: '顔がアップすぎる', image: badExampleImages.bad_02 },
                { label: '顔が見えない', image: badExampleImages.bad_03 },
                { label: '画像が粗い', image: badExampleImages.bad_04 },
                { label: '生活感が溢れている', image: badExampleImages.bad_05 },
                { label: '顔が写っていない', image: badExampleImages.bad_06 },
              ].map((item, index) => (
                <View key={index} style={styles.badExampleItem}>
                  <View style={styles.badExampleImage}>
                    <Image source={item.image} style={styles.badExampleImageStyle} />
                    <View style={styles.badExampleX}>
                      <Text style={styles.badExampleXText}>✕</Text>
                    </View>
                  </View>
                  <Text style={styles.badExampleLabel}>{item.label}</Text>
                </View>
              ))}
            </View>

            {/* Warning */}
            <View style={styles.warningBox}>
              <Ionicons name="warning" size={20} color="#FF0000" />
              <Text style={styles.warningText}>
                他人の写真や著作物の使用は禁止です{'\n'}運営が発見した場合、利用停止となります
              </Text>
            </View>

            {/* Upload Options */}
            <TouchableOpacity style={styles.uploadOption} onPress={handleSelectFromLibrary}>
              <Ionicons name="images-outline" size={24} color={COLORS.GREY_DARK} />
              <Text style={styles.uploadOptionText}>ライブラリから選ぶ</Text>
            </TouchableOpacity>

            <TouchableOpacity style={styles.uploadOption} onPress={handleTakePhoto}>
              <Ionicons name="camera-outline" size={24} color={COLORS.GREY_DARK} />
              <Text style={styles.uploadOptionText}>写真を撮る</Text>
              <View style={styles.guideBadge}>
                <Text style={styles.guideBadgeText}>ガイド付き</Text>
              </View>
            </TouchableOpacity>

            <TouchableOpacity style={styles.closeButton} onPress={() => setModalVisible(false)}>
              <Text style={styles.closeButtonText}>閉じる</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.WHITE,
    paddingHorizontal: 20,
    paddingTop: 10,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 30,
  },
  progressText: {
    fontSize: 14,
    color: COLORS.GREY_DARK,
    fontFamily: 'NotoSansJP_700Bold',
    marginLeft: 'auto',
    marginRight: 10,
  },
  progressBar: {
    width: 100,
    height: 4,
    backgroundColor: COLORS.GREY_LIGHT,
    borderRadius: 2,
    overflow: 'hidden',
  },
  progressFill: {
    width: '100%',
    height: '100%',
    backgroundColor: '#FF0000',
  },
  title: {
    fontSize: 20,
    color: COLORS.GREY_DARK,
    fontFamily: 'NotoSansJP_700Bold',
    textAlign: 'center',
    marginBottom: 10,
  },
  subtitle: {
    fontSize: 14,
    color: COLORS.GREY_MEDIUM,
    fontFamily: 'NotoSansJP_400Regular',
    textAlign: 'center',
    marginBottom: 40,
  },
  photoContainer: {
    alignItems: 'center',
    marginBottom: 30,
  },
  photoPlaceholder: {
    width: 150,
    height: 150,
    borderRadius: 100,
    backgroundColor: COLORS.GREY_LIGHT,
    alignItems: 'center',
    justifyContent: 'center',
  },
  photo: {
    width: 150,
    height: 150,
    borderRadius: 100,
  },
  registerButton: {
    backgroundColor: '#FF6B9D',
    paddingVertical: 18,
    borderRadius: 30,
    alignItems: 'center',
    marginBottom: 40,
  },
  registerButtonText: {
    fontSize: 16,
    color: COLORS.WHITE,
    fontFamily: 'NotoSansJP_700Bold',
  },
  examplesSection: {
    marginBottom: 30,
  },
  examplesTitle: {
    fontSize: 16,
    color: COLORS.GREY_DARK,
    fontFamily: 'NotoSansJP_700Bold',
    marginBottom: 15,
  },
  examplesScroll: {
    marginBottom: 20,
  },
  exampleItem: {
    marginRight: 15,
    alignItems: 'center',
  },
  exampleImageContainer: {
    width: 100,
    height: 100,
    borderRadius: 50,
    overflow: 'hidden',
    backgroundColor: COLORS.GREY_LIGHT,
    marginBottom: 8,
  },
  exampleImage: {
    width: '100%',
    height: '100%',
    resizeMode: 'cover',
  },
  exampleImagePlaceholder: {
    width: 100,
    height: 100,
    borderRadius: 50,
    backgroundColor: COLORS.GREY_LIGHT,
    alignItems: 'center',
    justifyContent: 'center',
  },
  exampleLabel: {
    fontSize: 12,
    color: COLORS.GREY_DARK,
    fontFamily: 'NotoSansJP_400Regular',
    textAlign: 'center',
  },
  nextButton: {
    width: '100%',
    paddingVertical: 18,
    borderRadius: 30,
    backgroundColor: COLORS.TEAL_PRIMARY,
    alignItems: 'center',
    marginBottom: 40,
  },
  nextButtonDisabled: {
    backgroundColor: COLORS.GREY_LIGHT,
  },
  nextButtonText: {
    fontSize: 16,
    color: COLORS.WHITE,
    fontFamily: 'NotoSansJP_700Bold',
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'flex-end',
  },
  modalContent: {
    backgroundColor: '#FFE5E5',
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    padding: 20,
    maxHeight: '90%',
  },
  modalTitle: {
    fontSize: 18,
    color: COLORS.GREY_DARK,
    fontFamily: 'NotoSansJP_700Bold',
    marginBottom: 20,
    textAlign: 'center',
  },
  badExamplesGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
    marginBottom: 20,
  },
  badExampleItem: {
    width: '30%',
    marginBottom: 15,
  },
  badExampleImage: {
    width: '100%',
    aspectRatio: 1,
    backgroundColor: COLORS.GREY_LIGHT,
    borderRadius: 8,
    alignItems: 'center',
    justifyContent: 'center',
    position: 'relative',
    overflow: 'hidden',
  },
  badExampleImageStyle: {
    width: '100%',
    height: '100%',
    resizeMode: 'cover',
  },
  badExampleX: {
    position: 'absolute',
    top: 5,
    right: 5,
    width: 20,
    height: 20,
    borderRadius: 10,
    backgroundColor: '#FF0000',
    alignItems: 'center',
    justifyContent: 'center',
  },
  badExampleXText: {
    color: COLORS.WHITE,
    fontSize: 12,
    fontWeight: 'bold',
  },
  badExampleLabel: {
    fontSize: 12,
    color: COLORS.GREY_DARK,
    fontFamily: 'NotoSansJP_400Regular',
    marginTop: 5,
    textAlign: 'center',
  },
  warningBox: {
    flexDirection: 'row',
    backgroundColor: '#FFE0E0',
    padding: 15,
    borderRadius: 8,
    marginBottom: 20,
    alignItems: 'flex-start',
  },
  warningText: {
    fontSize: 12,
    color: '#FF0000',
    fontFamily: 'NotoSansJP_400Regular',
    marginLeft: 10,
    flex: 1,
    lineHeight: 18,
  },
  uploadOption: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: COLORS.WHITE,
    padding: 15,
    borderRadius: 10,
    marginBottom: 10,
  },
  uploadOptionText: {
    fontSize: 16,
    color: COLORS.GREY_DARK,
    fontFamily: 'NotoSansJP_400Regular',
    marginLeft: 15,
    flex: 1,
  },
  guideBadge: {
    backgroundColor: '#FFE5E5',
    paddingHorizontal: 10,
    paddingVertical: 5,
    borderRadius: 12,
  },
  guideBadgeText: {
    fontSize: 12,
    color: '#FF0000',
    fontFamily: 'NotoSansJP_400Regular',
  },
  closeButton: {
    backgroundColor: COLORS.GREY_LIGHT,
    paddingVertical: 15,
    borderRadius: 10,
    alignItems: 'center',
    marginTop: 10,
  },
  closeButtonText: {
    fontSize: 16,
    color: COLORS.GREY_DARK,
    fontFamily: 'NotoSansJP_700Bold',
  },
});

