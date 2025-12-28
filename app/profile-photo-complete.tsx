import React, { useState, useEffect } from 'react';
import { StyleSheet, Text, View, TouchableOpacity, Modal, Image } from 'react-native';
import { useRouter, useLocalSearchParams } from 'expo-router';
import { useFonts, NotoSansJP_400Regular, NotoSansJP_700Bold } from '@expo-google-fonts/noto-sans-jp';
import { Ionicons } from '@expo/vector-icons';
import { COLORS } from '@/constants/colors';
import { uploadProfilePhoto, saveUserProfile } from '@/utils/api';

export default function ProfilePhotoCompleteScreen() {
  const router = useRouter();
  const params = useLocalSearchParams();
  const email = params.email as string;
  const imageUri = params.imageUri as string;
  const filter = params.filter as string;
  const returnTo = params.returnTo as string; // 'settings' or undefined
  const [modalVisible, setModalVisible] = useState(true);
  const [uploading, setUploading] = useState(false);

  let [fontsLoaded] = useFonts({
    NotoSansJP_400Regular,
    NotoSansJP_700Bold,
  });

  const handleUploadPhoto = async () => {
    setUploading(true);
    try {
      const photoUrl = await uploadProfilePhoto(email, imageUri, filter);
      if (photoUrl) {
        // Photo uploaded successfully - uploadProfilePhoto already saves to database
        console.log('Photo uploaded successfully:', photoUrl);
        // No need to call saveUserProfile again - uploadProfilePhoto already saved to database
      } else {
        console.error('Failed to upload photo');
      }
    } catch (error) {
      console.error('Error uploading photo:', error);
    } finally {
      setUploading(false);
    }
  };

  useEffect(() => {
    // Upload photo when component mounts
    if (fontsLoaded && email && imageUri) {
      handleUploadPhoto();
    }
  }, [fontsLoaded, email, imageUri]);

  if (!fontsLoaded) {
    return null;
  }

  const handleCloseModal = () => {
    setModalVisible(false);
    // Navigate back to appropriate screen
    if (returnTo === 'settings') {
      router.replace({
        pathname: '/profile-settings',
        params: { email },
      });
    } else {
      router.replace({
        pathname: '/home',
        params: { email },
      });
    }
  };

  return (
    <View style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity onPress={() => router.back()}>
          <Ionicons name="close" size={24} color={COLORS.GREY_DARK} />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>おためしでいいね!</Text>
        <Text style={styles.headerSubtitle}>0人まで無料!</Text>
      </View>

      {/* Main Content - Grayed out background */}
      <View style={styles.mainContent}>
        {/* Navigation buttons */}
        <View style={styles.navButtonsContainer}>
          <TouchableOpacity style={styles.navButtonLeft}>
            <Ionicons name="chevron-back" size={24} color={COLORS.GREY_DARK} />
            <Text style={styles.navButtonText}>次へ</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.navButtonRight}>
            <Ionicons name="thumbs-up" size={24} color={COLORS.WHITE} />
            <Text style={styles.navButtonTextWhite}>いいね!</Text>
          </TouchableOpacity>
        </View>

        {/* Bottom link */}
        <TouchableOpacity style={styles.bottomLink}>
          <Text style={styles.bottomLinkText}>プロフィールをもっと見る</Text>
        </TouchableOpacity>
      </View>

      {/* Completion Modal */}
      <Modal
        visible={modalVisible}
        transparent
        animationType="fade"
        onRequestClose={handleCloseModal}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            <Text style={styles.modalTitle}>ありがとうございます!</Text>
            <Text style={styles.modalMessage}>
              それではMochilaを{'\n'}実際に使ってみましょう
            </Text>
            <TouchableOpacity style={styles.modalButton} onPress={handleCloseModal}>
              <Text style={styles.modalButtonText}>閉じる</Text>
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
    backgroundColor: COLORS.GREY_LIGHT,
  },
  header: {
    paddingTop: 60,
    paddingHorizontal: 20,
    paddingBottom: 20,
    backgroundColor: COLORS.WHITE,
  },
  headerTitle: {
    fontSize: 18,
    color: COLORS.GREY_DARK,
    fontFamily: 'NotoSansJP_700Bold',
    textAlign: 'center',
    marginTop: 10,
  },
  headerSubtitle: {
    fontSize: 14,
    color: COLORS.GREY_MEDIUM,
    fontFamily: 'NotoSansJP_400Regular',
    textAlign: 'center',
    marginTop: 5,
  },
  mainContent: {
    flex: 1,
    justifyContent: 'space-between',
    paddingHorizontal: 20,
    paddingTop: 40,
    paddingBottom: 40,
  },
  navButtonsContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    paddingHorizontal: 20,
  },
  navButtonLeft: {
    width: 80,
    height: 80,
    borderRadius: 40,
    backgroundColor: COLORS.GREY_LIGHT,
    alignItems: 'center',
    justifyContent: 'center',
  },
  navButtonRight: {
    width: 80,
    height: 80,
    borderRadius: 40,
    backgroundColor: '#FF0000',
    alignItems: 'center',
    justifyContent: 'center',
  },
  navButtonText: {
    fontSize: 12,
    color: COLORS.GREY_DARK,
    fontFamily: 'NotoSansJP_400Regular',
    marginTop: 5,
  },
  navButtonTextWhite: {
    fontSize: 12,
    color: COLORS.WHITE,
    fontFamily: 'NotoSansJP_400Regular',
    marginTop: 5,
  },
  bottomLink: {
    alignSelf: 'center',
    paddingVertical: 10,
  },
  bottomLinkText: {
    fontSize: 14,
    color: COLORS.GREY_DARK,
    fontFamily: 'NotoSansJP_400Regular',
    textDecorationLine: 'underline',
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  modalContent: {
    backgroundColor: COLORS.WHITE,
    borderRadius: 20,
    padding: 30,
    width: '80%',
    maxWidth: 300,
    alignItems: 'center',
  },
  modalTitle: {
    fontSize: 20,
    color: COLORS.GREY_DARK,
    fontFamily: 'NotoSansJP_700Bold',
    marginBottom: 20,
    textAlign: 'center',
  },
  modalMessage: {
    fontSize: 16,
    color: COLORS.GREY_DARK,
    fontFamily: 'NotoSansJP_400Regular',
    textAlign: 'center',
    marginBottom: 30,
    lineHeight: 24,
  },
  modalButton: {
    width: '100%',
    paddingVertical: 15,
    borderRadius: 10,
    backgroundColor: COLORS.GREY_LIGHT,
    alignItems: 'center',
  },
  modalButtonText: {
    fontSize: 16,
    color: COLORS.GREY_DARK,
    fontFamily: 'NotoSansJP_700Bold',
  },
});

