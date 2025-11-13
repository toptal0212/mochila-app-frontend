import React, { useState } from 'react';
import { StyleSheet, Text, View, TouchableOpacity, TextInput, Modal } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import { useFonts, NotoSansJP_400Regular, NotoSansJP_700Bold } from '@expo-google-fonts/noto-sans-jp';

export default function EmailSignInScreen() {
  const router = useRouter();
  const [email, setEmail] = useState('');
  const [modalVisible, setModalVisible] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');
  const [loading, setLoading] = useState(false);

  let [fontsLoaded] = useFonts({
    NotoSansJP_400Regular,
    NotoSansJP_700Bold,
  });

  if (!fontsLoaded) {
    return null;
  }

  const validateEmail = (email: string) => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  };

  const generateVerificationCode = (): string => {
    // Generate a 6-digit random number (100000 to 999999)
    return Math.floor(100000 + Math.random() * 900000).toString();
  };

  const sendVerificationEmail = async (emailAddress: string, code: string): Promise<boolean> => {
    try {
      // Use environment variable or default to localhost for development
      const API_URL = process.env.EXPO_PUBLIC_EMAIL_API_URL || 'http://localhost:3000/api/send-verification-email';
      
      const response = await fetch(API_URL, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          email: emailAddress,
          code: code,
          subject: '認証コード',
          message: `あなたの認証コードは ${code} です。`,
        }),
      });

      if (!response.ok) {
        throw new Error('Failed to send email');
      }

      return true;
    } catch (error) {
      console.error('Error sending verification email:', error);
      return false;
    }
  };

  const handleSignIn = async () => {
    const trimmedEmail = email.trim();
    
    if (!trimmedEmail) {
      setErrorMessage('メールアドレスを入力してください');
      setModalVisible(true);
      return;
    }
    
    if (!validateEmail(trimmedEmail)) {
      setErrorMessage('メールアドレスの形式が正しくありません');
      setModalVisible(true);
      return;
    }
    
    setLoading(true);
    
    // Generate 6-digit verification code
    const verificationCode = generateVerificationCode();
    console.log('Verification code generated:', verificationCode);
    
    // Send verification code to email
    const emailSent = await sendVerificationEmail(trimmedEmail, verificationCode);
    
    setLoading(false);
    
    if (!emailSent) {
      setErrorMessage('メールの送信に失敗しました。もう一度お試しください。');
      setModalVisible(true);
      return;
    }
    
    // Navigate to verification screen with email and code
    router.push({
      pathname: '/email-verify',
      params: {
        email: trimmedEmail,
        code: verificationCode,
      },
    });
  };

  return (
    <View style={styles.container}>
      {/* Top Section: Email Icon */}
      <View style={styles.iconContainer}>
        <Ionicons name="mail-outline" size={30} color="#4A4A4A" />
      </View>

      {/* Instruction Text */}
      <Text style={styles.instructionText}>メールアドレスを<br/>入力してください</Text>

      {/* Email Input Field */}
      <View style={styles.inputContainer}>
        <TextInput
          style={styles.input}
          placeholder="sample@sample.com"
          placeholderTextColor="#999"
          value={email}
          onChangeText={setEmail}
          keyboardType="email-address"
          autoCapitalize="none"
          autoCorrect={false}
        />
      </View>

      {/* Sign In Button */}
      <TouchableOpacity 
        style={[styles.signInButton, loading && styles.signInButtonDisabled]}
        onPress={handleSignIn}
        disabled={loading}
      >
        <Ionicons name="mail-outline" style={styles.buttonIcon} />
        <Text style={styles.signInButtonText}>
          {loading ? '送信中...' : 'メールアドレスでサインイン'}
        </Text>
      </TouchableOpacity>

      {/* Back Button */}
      <TouchableOpacity 
        style={styles.backButton}
        onPress={() => router.back()}
      >
        <Text style={styles.backButtonText}>戻る</Text>
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
            <Text style={styles.modalMessage}>{errorMessage}</Text>
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
  iconContainer: {
    alignItems: 'center',
    marginBottom: 25,
  },
  instructionText: {
    fontSize: 24,
    color: '#6758E8',
    lineHeight : 32,
    fontFamily: 'NotoSansJP_700Bold',
    marginBottom: 80,
    textAlign: 'center',
  },
  inputContainer: {
    width: '100%',
    maxWidth: 300,
    marginBottom: 35,
  },
  input: {
    fontSize: 15,
    color: '#4A4A4A',
    fontFamily: 'NotoSansJP_400Regular',
    paddingVertical: 10,
    paddingHorizontal: 18,
    borderBottomWidth: 1,
    borderBottomColor: '#4A4A4A',
    outline: 'none',
  },
  signInButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#ffffff',
    borderColor: '#4A4A4A',
    borderWidth: 1,
    borderRadius: 30,
    paddingVertical: 18,
    paddingHorizontal: 30,
    width: '100%',
    maxWidth: 300,
    marginLeft: 'auto',
    marginRight: 'auto',
    height: 47,
    elevation: 1,
    paddingLeft: 15,
    paddingRight: 15,
    gap: 20,
  },
  buttonIcon: {
    fontSize: 24,
    color: '#4A4A4A',
  },
  signInButtonText: {
    fontSize: 15,
    color: '#4A4A4A',
    fontWeight: '700',
    fontFamily: 'NotoSansJP_700Bold',
  },
  signInButtonDisabled: {
    opacity: 0.6,
  },
  backButton: {
    marginTop: 30,
  },
  backButtonText: {
    fontSize: 16,
    color: '#6758E8',
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

