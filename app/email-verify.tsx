import React, { useState, useRef, useEffect } from 'react';
import { StyleSheet, Text, View, TouchableOpacity, TextInput, Modal } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useRouter, useLocalSearchParams } from 'expo-router';
import { useFonts, NotoSansJP_400Regular, NotoSansJP_700Bold } from '@expo-google-fonts/noto-sans-jp';
import { getUserProfile } from '@/utils/api';

// Verification code expiration time: 1 minute in milliseconds
const CODE_EXPIRATION_TIME = 1 * 60 * 1000; // 1 minute

export default function EmailVerifyScreen() {
  const router = useRouter();
  const params = useLocalSearchParams();
  const email = params.email as string;
  const initialCode = params.code as string;
  const initialCodeTimestamp = params.codeTimestamp as string;
  
  const [code, setCode] = useState(['', '', '', '', '', '']);
  const [verificationCode, setVerificationCode] = useState(initialCode);
  const [codeTimestamp, setCodeTimestamp] = useState(initialCodeTimestamp ? parseInt(initialCodeTimestamp) : Date.now());
  const [modalVisible, setModalVisible] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');
  const [modalTitle, setModalTitle] = useState('エラー');
  const [resendLoading, setResendLoading] = useState(false);
  const [remainingTime, setRemainingTime] = useState(0);
  const [verifying, setVerifying] = useState(false);
  const inputRefs = useRef<(TextInput | null)[]>([]);
  const hasVerifiedRef = useRef(false);

  let [fontsLoaded] = useFonts({
    NotoSansJP_400Regular,
    NotoSansJP_700Bold,
  });

  // Auto-verify when all 6 digits are entered
  useEffect(() => {
    const fullCode = code.join('');
    if (fullCode.length === 6 && !verifying && verificationCode && !hasVerifiedRef.current) {
      // Only verify if we have a valid verification code and haven't verified yet
      hasVerifiedRef.current = true;
      handleVerify(fullCode);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [code, verifying, verificationCode]);

  // Update remaining time every second
  useEffect(() => {
    const updateRemainingTime = () => {
      const now = Date.now();
      const elapsed = now - codeTimestamp;
      const remaining = Math.max(0, CODE_EXPIRATION_TIME - elapsed);
      setRemainingTime(Math.floor(remaining / 1000)); // Convert to seconds
    };

    // Update immediately
    updateRemainingTime();

    // Update every second
    const interval = setInterval(updateRemainingTime, 1000);

    return () => clearInterval(interval);
  }, [codeTimestamp]);

  if (!fontsLoaded) {
    return null;
  }

  const handleKeypadPress = (value: string) => {
    const emptyIndex = code.findIndex(digit => !digit);
    if (emptyIndex !== -1) {
      const newCode = [...code];
      newCode[emptyIndex] = value;
      setCode(newCode);
      
      // Focus next input
      if (emptyIndex < 5) {
        inputRefs.current[emptyIndex + 1]?.focus();
      } else {
        inputRefs.current[emptyIndex]?.blur();
      }
    }
  };

  const handleBackspace = () => {
    const lastFilledIndex = code.map((d, i) => d ? i : -1).filter(i => i !== -1).pop();
    if (lastFilledIndex !== undefined) {
      const newCode = [...code];
      newCode[lastFilledIndex] = '';
      setCode(newCode);
      inputRefs.current[lastFilledIndex]?.focus();
    }
  };

  const handleCodeChange = (text: string, index: number) => {
    // Only allow numbers
    const numericText = text.replace(/[^0-9]/g, '');
    
    if (numericText.length > 1) {
      // Handle paste
      const pastedCode = numericText.slice(0, 6).split('');
      const newCode = [...code];
      pastedCode.forEach((char, i) => {
        if (index + i < 6) {
          newCode[index + i] = char;
        }
      });
      setCode(newCode);
      
      // Focus on the last filled input or the next empty one
      const nextEmptyIndex = newCode.findIndex((c, i) => i >= index && !c);
      if (nextEmptyIndex !== -1 && nextEmptyIndex < 6) {
        inputRefs.current[nextEmptyIndex]?.focus();
      } else if (newCode.every(c => c)) {
        inputRefs.current[5]?.blur();
      }
      return;
    }

    const newCode = [...code];
    newCode[index] = numericText;
    setCode(newCode);

    // Auto-focus next input
    if (numericText && index < 5) {
      inputRefs.current[index + 1]?.focus();
    }
  };

  const handleKeyPress = (e: any, index: number) => {
    if (e.nativeEvent.key === 'Backspace' && !code[index] && index > 0) {
      inputRefs.current[index - 1]?.focus();
    }
  };

  const isCodeExpired = (timestamp: number): boolean => {
    const now = Date.now();
    return (now - timestamp) > CODE_EXPIRATION_TIME;
  };

  const handleVerify = async (enteredCode?: string) => {
    // Prevent multiple verifications
    if (hasVerifiedRef.current && verifying) {
      console.log('Verification already in progress, ignoring duplicate call');
      return;
    }

    const codeToVerify = enteredCode || code.join('');
    
    if (codeToVerify.length !== 6) {
      setModalTitle('エラー');
      setErrorMessage('6桁のコードを入力してください');
      setModalVisible(true);
      hasVerifiedRef.current = false; // Reset on error
      return;
    }
    
    // Check if code has expired
    if (isCodeExpired(codeTimestamp)) {
      setModalTitle('エラー');
      setErrorMessage('認証コードの有効期限が切れています。新しいコードを再送信してください。');
      setModalVisible(true);
      // Clear code on error
      setCode(['', '', '', '', '', '']);
      inputRefs.current[0]?.focus();
      hasVerifiedRef.current = false; // Reset on error
      return;
    }
    
    if (codeToVerify !== verificationCode) {
      setModalTitle('エラー');
      setErrorMessage('コードが正しくありません');
      setModalVisible(true);
      // Clear code on error
      setCode(['', '', '', '', '', '']);
      inputRefs.current[0]?.focus();
      hasVerifiedRef.current = false; // Reset on error
      return;
    }
    
    // Code verification successful
    console.log('Verification successful for email:', email);
    
    // Check if user already exists in database
    setVerifying(true);
    try {
      const existingUser = await getUserProfile(email);
      
      if (existingUser && existingUser.displayName) {
        // User already registered - skip registration flow and go to home
        console.log('User already registered, skipping to home');
        router.replace({
          pathname: '/home',
          params: { email },
        });
      } else {
        // New user - proceed with registration flow
        console.log('New user, proceeding with registration');
        router.replace({
          pathname: '/consent',
          params: { email },
        });
      }
    } catch (error) {
      console.error('Error checking user:', error);
      // On error, proceed with registration flow as fallback
      router.replace({
        pathname: '/consent',
        params: { email },
      });
    } finally {
      setVerifying(false);
    }
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

  const handleMailNotReceived = async () => {
    setResendLoading(true);
    
    // Generate new code
    const newCode = Math.floor(100000 + Math.random() * 900000).toString();
    const newTimestamp = Date.now();
    console.log('New verification code generated:', newCode);
    
    // Send new code to email
    const emailSent = await sendVerificationEmail(email, newCode);
    
    setResendLoading(false);
    
    if (emailSent) {
      // Update the verification code state and timestamp
      setVerificationCode(newCode);
      setCodeTimestamp(newTimestamp);
      // Clear the input fields
      setCode(['', '', '', '', '', '']);
      inputRefs.current[0]?.focus();
      
      // Show success message
      setModalTitle('成功');
      setErrorMessage('新しい認証コードをメールに送信しました。');
      setModalVisible(true);
    } else {
      setModalTitle('エラー');
      setErrorMessage('メールの送信に失敗しました。もう一度お試しください。');
      setModalVisible(true);
    }
  };

  const keypadData = [
    { number: '1', letters: '' },
    { number: '2', letters: 'ABC' },
    { number: '3', letters: 'DEF' },
    { number: '4', letters: 'GHI' },
    { number: '5', letters: 'JKL' },
    { number: '6', letters: 'MNO' },
    { number: '7', letters: 'PQRS' },
    { number: '8', letters: 'TUV' },
    { number: '9', letters: 'WXYZ' },
  ];

  return (
    <View style={styles.container}>
      {/* Top Section: White Content Area */}
      <View style={styles.contentArea}>
        {/* Email Icon */}
        <View style={styles.iconContainer}>
          <Ionicons name="mail-outline" size={40} color="#6758E8" />
        </View>

        {/* Instruction Text */}
        <Text style={styles.instructionText}>認証コードを<br/>入力してください</Text>

        {/* Verifying Status */}
        {verifying && (
          <Text style={styles.verifyingText}>確認中...</Text>
        )}

        {/* Remaining Time Display */}
        {remainingTime > 0 && !verifying && (
          <Text style={styles.remainingTimeText}>
            有効期限: {Math.floor(remainingTime / 60)}分{remainingTime % 60}秒
          </Text>
        )}

        {/* Code Input Fields */}
        <View style={styles.codeContainer}>
          {code.map((digit, index) => (
            <TextInput
              key={index}
              ref={(ref: any) => (inputRefs.current[index] = ref)}
              style={styles.codeInput}
              value={digit}
              onChangeText={(text) => handleCodeChange(text, index)}
              onKeyPress={(e) => handleKeyPress(e, index)}
              maxLength={1}
              selectTextOnFocus
              showSoftInputOnFocus={false}
              caretHidden={true}
            />
          ))}
        </View>

        {/* Mail Not Received Link */}
        <TouchableOpacity 
          style={[styles.mailNotReceivedLink, resendLoading && styles.mailNotReceivedLinkDisabled]}
          onPress={handleMailNotReceived}
          disabled={resendLoading}
        >
          <Text style={styles.mailNotReceivedText}>
            {resendLoading ? '送信中...' : 'メールが届かない'}
          </Text>
        </TouchableOpacity>
      </View>

      {/* Numeric Keypad */}
      <View style={styles.keypadContainer}>
        {/* First 3 rows: Numbers 1-9 */}
        <View style={styles.keypadRow}>
          {keypadData.slice(0, 3).map((item) => (
            <TouchableOpacity
              key={item.number}
              style={styles.keypadButton}
              onPress={() => handleKeypadPress(item.number)}
            >
              <Text style={styles.keypadNumber}>{item.number}</Text>
              {item.letters && (
                <Text style={styles.keypadLetters}>{item.letters}</Text>
              )}
            </TouchableOpacity>
          ))}
        </View>
        <View style={styles.keypadRow}>
          {keypadData.slice(3, 6).map((item) => (
            <TouchableOpacity
              key={item.number}
              style={styles.keypadButton}
              onPress={() => handleKeypadPress(item.number)}
            >
              <Text style={styles.keypadNumber}>{item.number}</Text>
              {item.letters && (
                <Text style={styles.keypadLetters}>{item.letters}</Text>
              )}
            </TouchableOpacity>
          ))}
        </View>
        <View style={styles.keypadRow}>
          {keypadData.slice(6, 9).map((item) => (
            <TouchableOpacity
              key={item.number}
              style={styles.keypadButton}
              onPress={() => handleKeypadPress(item.number)}
            >
              <Text style={styles.keypadNumber}>{item.number}</Text>
              {item.letters && (
                <Text style={styles.keypadLetters}>{item.letters}</Text>
              )}
            </TouchableOpacity>
          ))}
        </View>
        {/* Bottom row: Empty, 0, Backspace */}
        <View style={styles.keypadRow}>
          <View style={styles.keypadButton} />
          <TouchableOpacity
            style={styles.keypadButton}
            onPress={() => handleKeypadPress('0')}
          >
            <Text style={styles.keypadNumber}>0</Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={styles.keypadButton}
            onPress={handleBackspace}
          >
            <Ionicons name="backspace-outline" size={24} color="#4A4A4A" />
          </TouchableOpacity>
        </View>
      </View>

      {/* Error Modal */}
      <Modal
        animationType="fade"
        transparent={true}
        visible={modalVisible}
        onRequestClose={() => setModalVisible(false)}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            <Text style={styles.modalTitle}>{modalTitle}</Text>
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
  },
  contentArea: {
    flex: 1,
    backgroundColor: '#ffffff',
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 20,
    paddingTop: 100,
  },
  iconContainer: {
    alignItems: 'center',
    marginBottom: 30,
  },
  instructionText: {
    fontSize: 24,
    color: '#6758E8',
    fontFamily: 'NotoSansJP_700Bold',
    marginBottom: 20,
    textAlign: 'center',
  },
  remainingTimeText: {
    fontSize: 14,
    color: '#999',
    fontFamily: 'NotoSansJP_400Regular',
    marginBottom: 45,
    textAlign: 'center',
  },
  verifyingText: {
    fontSize: 14,
    color: '#6758E8',
    fontFamily: 'NotoSansJP_400Regular',
    marginBottom: 45,
    textAlign: 'center',
  },
  codeContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 12,
    gap: 10,
    width: 300,
    alignSelf: 'center',
  },
  codeInput: {
    width: 41.67,
    height: 60,
    backgroundColor: '#e9f2f2',
    borderRadius: 8,
    fontSize: 24,
    textAlign: 'center',
    color: '#4A4A4A',
    fontFamily: 'NotoSansJP_700Bold',
  },
  mailNotReceivedLink: {
    alignSelf: 'flex-start',
    width: 300,
    marginRight: 'auto',
    marginLeft: 'auto',
  },
  mailNotReceivedLinkDisabled: {
    opacity: 0.6,
  },
  mailNotReceivedText: {
    fontSize: 14,
    color: '#6758E8',
    fontFamily: 'NotoSansJP_400Regular',
  },
  keypadContainer: {
    backgroundColor: '#F0F0F0',
    paddingVertical: 15,
    paddingHorizontal: 0,
    borderTopWidth: 1,
    borderTopColor: '#E0E0E0',
    paddingInline: 12,
  },
  keypadRow: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 8,
    gap: 8,
  },
  keypadButton: {
    flex: 1,
    height: 60,
    backgroundColor: '#ffffff',
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#E0E0E0',
    justifyContent: 'center',
    alignItems: 'center',
  },
  keypadNumber: {
    fontSize: 24,
    color: '#000000',
    fontFamily: 'NotoSansJP_700Bold',
  },
  keypadLetters: {
    fontSize: 10,
    color: '#999999',
    marginTop: 2,
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
