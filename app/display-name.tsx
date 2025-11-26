import React, { useState } from 'react';
import { StyleSheet, Text, View, TouchableOpacity, TextInput } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useRouter, useLocalSearchParams } from 'expo-router';
import { useFonts, NotoSansJP_400Regular, NotoSansJP_700Bold } from '@expo-google-fonts/noto-sans-jp';
import { COLORS } from '@/constants/colors';
import { saveUserProfile } from '@/utils/api';

export default function DisplayNameScreen() {
  const router = useRouter();
  const params = useLocalSearchParams();
  const email = params.email as string;
  const [displayName, setDisplayName] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  let [fontsLoaded] = useFonts({
    NotoSansJP_400Regular,
    NotoSansJP_700Bold,
  });

  if (!fontsLoaded) {
    return null;
  }

  const handleNext = async () => {
    if (!displayName.trim()) return;
    
    setIsLoading(true);
    
    // Save display name to backend
    const success = await saveUserProfile({
      email,
      displayName: displayName.trim(),
    });
    
    setIsLoading(false);
    
    if (success) {
      router.push({
        pathname: '/email-notifications',
        params: { email },
      });
    } else {
      // Check console for detailed error message
      console.error('Failed to save display name. Check console for details.');
      alert('表示名の保存に失敗しました。\n\n考えられる原因:\n- データベースのマイグレーションが未実行\n- ネットワークエラー\n\n詳細はコンソールを確認してください。');
    }
  };

  const handleBack = () => {
    router.back();
  };

  return (
    <View style={styles.container}>
      {/* Title */}
      <Text style={styles.title}>あなたの表示名を決めましょう</Text>
      <Text style={styles.subtitle}>あとから変更できます</Text>

      {/* Input Field */}
      <View style={styles.inputContainer}>
        <TextInput
          style={styles.input}
          value={displayName}
          onChangeText={setDisplayName}
          placeholder=""
          placeholderTextColor={COLORS.GREY_MEDIUM}
          autoFocus
        />
      </View>

      {/* Hint Bubble */}
      <View style={styles.hintBubble}>
        <Text style={styles.hintText}>下の名前やニックネームがおすすめ!</Text>
      </View>

      {/* Loading Indicator */}
      {isLoading && (
        <View style={styles.loadingContainer}>
          <View style={styles.loadingBox}>
            <Ionicons name="reload" size={24} color={COLORS.GREY_MEDIUM} />
          </View>
        </View>
      )}

      {/* Navigation Buttons */}
      <View style={styles.navigationContainer}>
        <TouchableOpacity style={styles.navButton} onPress={handleBack} activeOpacity={0.7}>
          <Ionicons name="chevron-back" size={24} color={COLORS.GREY_DARK} />
        </TouchableOpacity>
        <TouchableOpacity
          style={[styles.navButtonNext, (!displayName.trim() || isLoading) && styles.navButtonDisabled]}
          onPress={handleNext}
          disabled={!displayName.trim() || isLoading}
          activeOpacity={0.7}
        >
          <Ionicons name="chevron-forward" size={24} color={COLORS.TEAL_DARK} />
        </TouchableOpacity>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.WHITE,
    paddingHorizontal: 20,
    paddingTop: 60,
  },
  title: {
    fontSize: 20,
    color: COLORS.TEAL_DARK,
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
  inputContainer: {
    marginBottom: 20,
  },
  input: {
    fontSize: 18,
    color: COLORS.GREY_DARK,
    fontFamily: 'NotoSansJP_400Regular',
    borderBottomWidth: 1,
    borderBottomColor: COLORS.GREY_MEDIUM,
    paddingVertical: 10,
    paddingHorizontal: 4,
  },
  hintBubble: {
    alignSelf: 'center',
    backgroundColor: COLORS.TEAL_DARK,
    paddingHorizontal: 16,
    paddingVertical: 10,
    borderRadius: 20,
    marginBottom: 20,
  },
  hintText: {
    fontSize: 14,
    color: COLORS.WHITE,
    fontFamily: 'NotoSansJP_400Regular',
  },
  loadingContainer: {
    alignItems: 'center',
    marginBottom: 20,
  },
  loadingBox: {
    width: 40,
    height: 40,
    backgroundColor: COLORS.GREY_LIGHT,
    borderRadius: 8,
    alignItems: 'center',
    justifyContent: 'center',
  },
  navigationContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingBottom: 30,
    paddingHorizontal: 10,
  },
  navButton: {
    width: 50,
    height: 50,
    borderRadius: 25,
    backgroundColor: COLORS.GREY_LIGHT,
    alignItems: 'center',
    justifyContent: 'center',
  },
  navButtonNext: {
    width: 50,
    height: 50,
    borderRadius: 25,
    backgroundColor: COLORS.CYAN_LIGHT,
    alignItems: 'center',
    justifyContent: 'center',
  },
  navButtonDisabled: {
    opacity: 0.5,
  },
});

