import React, { useState, useRef, useEffect } from 'react';
import { StyleSheet, Text, View, TouchableOpacity,Animated, Modal } from 'react-native';
import { useRouter, useLocalSearchParams } from 'expo-router';
import { useFonts, NotoSansJP_400Regular, NotoSansJP_700Bold } from '@expo-google-fonts/noto-sans-jp';
import { GlobeIcon } from '@/components/GlobeIcon';
import { COLORS } from '@/constants/colors';

export default function ConsentScreen() {
  const router = useRouter();
  const params = useLocalSearchParams();
  const email = params.email as string;
  const [ageChecked, setAgeChecked] = useState(false);
  const [termsChecked, setTermsChecked] = useState(false);
  const [modalVisible, setModalVisible] = useState(false);
  const [modalMessage, setModalMessage] = useState('');
  const hasNavigatedRef = useRef(false);

  const rotateAnim = useRef(new Animated.Value(0)).current;

  let [fontsLoaded] = useFonts({
    NotoSansJP_400Regular,
    NotoSansJP_700Bold,
  });

  // Validate email parameter only once
  useEffect(() => {
    if (!email) {
      console.error('Email parameter is missing in consent page');
      // Only redirect if we haven't navigated yet
      if (!hasNavigatedRef.current) {
        router.replace('/email-signin');
      }
    }
  }, []); // Empty dependency array - only run once

  if (!fontsLoaded || !email) {
    return null;
  }

  const handleProceed = () => {
    if (!ageChecked || !termsChecked) {
      setModalMessage('両方の項目に同意してください。');
      setModalVisible(true);
      return;
    }

    // Prevent multiple navigations using ref
    if (hasNavigatedRef.current) {
      console.log('Navigation already in progress, ignoring duplicate call');
      return;
    }

    hasNavigatedRef.current = true;
    
    // TODO: Save consent status and proceed to next screen
    console.log('Consent accepted, navigating to onboarding-1');
    // Navigate to onboarding intro screen with email
    router.push({
      pathname: '/onboarding-1',
      params: { email },
    });
  };

  const handleTermsPress = () => {
    // TODO: Navigate to terms page or open modal
    alert('利用規約を表示');
  };

  const handlePrivacyPress = () => {
    // TODO: Navigate to privacy policy page or open modal
    alert('プライバシーポリシーを表示');
  };

  const rotation = rotateAnim.interpolate({
    inputRange: [0, 1],
    outputRange: ['360deg', '0deg'],
  });

  return (
    <View style={styles.container}>
      {/* Globe Icon */}
      <Animated.Image 
          source={require('@/assets/images/logo.png')} 
          style={[styles.logo, { transform: [{ rotate: rotation }] }]}
          resizeMode="contain"
      />

      {/* Mochila Branding */}
      <Text style={styles.brandText}>Mochila</Text>

      {/* Checkboxes */}
      <View style={styles.checkboxContainer}>
        <TouchableOpacity
          style={styles.checkboxRow}
          onPress={() => setAgeChecked(!ageChecked)}
          activeOpacity={0.7}
        >
          <View style={[styles.checkbox, ageChecked && styles.checkboxChecked]}>
            {ageChecked && (
              <Text style={styles.checkmark}>✓</Text>
            )}
          </View>
          <Text style={styles.checkboxLabel}>私は18歳以上です。</Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={styles.checkboxRow}
          onPress={() => setTermsChecked(!termsChecked)}
          activeOpacity={0.7}
        >
          <View style={[styles.checkbox, termsChecked && styles.checkboxChecked]}>
            {termsChecked && (
              <Text style={styles.checkmark}>✓</Text>
            )}
          </View>
          <Text style={styles.checkboxLabel}>利用規約に同意します。</Text>
        </TouchableOpacity>
      </View>

      {/* Links */}
      <View style={styles.linksContainer}>
        <TouchableOpacity onPress={handleTermsPress}>
          <Text style={styles.linkText}>利用規約</Text>
        </TouchableOpacity>
        <Text style={styles.linkSeparator}> | </Text>
        <TouchableOpacity onPress={handlePrivacyPress}>
          <Text style={styles.linkText}>プライバシーポリシー</Text>
        </TouchableOpacity>
      </View>

      {/* Proceed Button */}
      <TouchableOpacity
        style={[
          styles.proceedButton,
          (!ageChecked || !termsChecked) && styles.proceedButtonDisabled
        ]}
        onPress={handleProceed}
        disabled={!ageChecked || !termsChecked}
      >
        <Text style={styles.proceedButtonText}>内容に同意して進む</Text>
      </TouchableOpacity>

      {/* Error Modal */}
      <Modal
        animationType="fade"
        transparent={true}
        visible={modalVisible}
        onRequestClose={() => setModalVisible(false)}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            <Text style={styles.modalTitle}>エラー</Text>
            <Text style={styles.modalMessage}>{modalMessage}</Text>
            <TouchableOpacity
              style={styles.modalButton}
              onPress={() => setModalVisible(false)}
            >
              <Text style={styles.modalButtonText}>OK</Text>
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
    backgroundColor: '#ffffff',
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 20,
  },
  logo: {
    width: 193,
    height: 193,
  },
  iconContainer: {
    alignItems: 'center',
    marginBottom: 20,
  },
  brandText: {
    fontSize: 55,
    fontWeight: 'bold',
    color: '#6758E8',
    fontFamily: 'NotoSansJP_700Bold',
    marginBottom: 60,
    letterSpacing: 1,
  },
  checkboxContainer: {
    width: '100%',
    maxWidth: 300,
    marginBottom: 30,
  },
  checkboxRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 20,
  },
  checkbox: {
    width: 24,
    height: 24,
    borderWidth: 2,
    borderColor: '#6758E8',
    borderRadius: 4,
    marginRight: 12,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#ffffff',
  },
  checkboxChecked: {
    backgroundColor: '#6758E8',
  },
  checkmark: {
    color: '#ffffff',
    fontSize: 16,
    fontWeight: 'bold',
  },
  checkboxLabel: {
    fontSize: 16,
    color: '#4A4A4A',
    fontFamily: 'NotoSansJP_400Regular',
    flex: 1,
  },
  linksContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 40,
  },
  linkText: {
    fontSize: 14,
    color: '#6758E8',
    fontFamily: 'NotoSansJP_400Regular',
  },
  linkSeparator: {
    fontSize: 14,
    color: '#6758E8',
    marginHorizontal: 8,
    fontFamily: 'NotoSansJP_400Regular',
  },
  proceedButton: {
    backgroundColor: '#6758E8',
    borderRadius: 30,
    paddingVertical: 18,
    paddingHorizontal: 40,
    width: '100%',
    maxWidth: 300,
    alignItems: 'center',
    justifyContent: 'center',
  },
  proceedButtonDisabled: {
    backgroundColor: '#CCCCCC',
    opacity: 0.6,
  },
  proceedButtonText: {
    fontSize: 16,
    color: '#ffffff',
    fontFamily: 'NotoSansJP_700Bold',
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  modalContent: {
    backgroundColor: '#ffffff',
    borderRadius: 20,
    padding: 30,
    width: '80%',
    maxWidth: 300,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 4,
    elevation: 5,
  },
  modalTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#4A4A4A',
    fontFamily: 'NotoSansJP_700Bold',
    marginBottom: 20,
  },
  modalMessage: {
    fontSize: 16,
    color: '#4A4A4A',
    fontFamily: 'NotoSansJP_400Regular',
    textAlign: 'center',
    marginBottom: 30,
    lineHeight: 24,
  },
  modalButton: {
    backgroundColor: '#6758E8',
    borderRadius: 25,
    paddingVertical: 12,
    paddingHorizontal: 40,
    minWidth: 120,
  },
  modalButtonText: {
    fontSize: 16,
    color: '#ffffff',
    fontFamily: 'NotoSansJP_700Bold',
    textAlign: 'center',
  },
});

