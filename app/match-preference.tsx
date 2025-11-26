import React, { useState } from 'react';
import { StyleSheet, Text, View, TouchableOpacity } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useRouter, useLocalSearchParams } from 'expo-router';
import { useFonts, NotoSansJP_400Regular, NotoSansJP_700Bold } from '@expo-google-fonts/noto-sans-jp';
import { COLORS } from '@/constants/colors';
import { saveUserProfile } from '@/utils/api';

const MATCH_OPTIONS = [
  { value: 'opposite', label: '異性' },
  { value: 'same', label: '同性' },
  { value: 'any', label: '問わない' },
];

export default function MatchPreferenceScreen() {
  const router = useRouter();
  const params = useLocalSearchParams();
  const email = params.email as string;
  const [selectedOption, setSelectedOption] = useState<string | null>(null);

  let [fontsLoaded] = useFonts({
    NotoSansJP_400Regular,
    NotoSansJP_700Bold,
  });

  if (!fontsLoaded) {
    return null;
  }

  const handleNext = async () => {
    if (!selectedOption) return;
    
    // Save match preference to backend
    const success = await saveUserProfile({
      email,
      matchPreference: selectedOption,
    });
    
    if (success) {
      // Navigate to profile photo intro page
      router.push({
        pathname: '/profile-photo-intro',
        params: { email },
      });
    } else {
      alert('データの保存に失敗しました。もう一度お試しください。');
    }
  };

  const handleBack = () => {
    router.back();
  };

  return (
    <View style={styles.container}>
      {/* Title */}
      <Text style={styles.title}>誰とマッチしたいですか？</Text>

      {/* Options */}
      <View style={styles.optionsContainer}>
        {MATCH_OPTIONS.map((option) => {
          const isSelected = selectedOption === option.value;
          return (
            <TouchableOpacity
              key={option.value}
              style={[styles.optionButton, isSelected && styles.optionButtonSelected]}
              onPress={() => setSelectedOption(option.value)}
              activeOpacity={0.7}
            >
              <Text style={[styles.optionText, isSelected && styles.optionTextSelected]}>
                {option.label}
              </Text>
            </TouchableOpacity>
          );
        })}
      </View>

      {/* Navigation Buttons */}
      <View style={styles.navigationContainer}>
        <TouchableOpacity style={styles.navButton} onPress={handleBack} activeOpacity={0.7}>
          <Ionicons name="chevron-back" size={24} color={COLORS.GREY_DARK} />
        </TouchableOpacity>
        <TouchableOpacity
          style={[styles.navButtonNext, !selectedOption && styles.navButtonDisabled]}
          onPress={handleNext}
          disabled={!selectedOption}
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
    paddingTop: 100,
  },
  title: {
    fontSize: 20,
    color: COLORS.GREY_DARK,
    fontFamily: 'NotoSansJP_700Bold',
    textAlign: 'center',
    marginBottom: 60,
  },
  optionsContainer: {
    flex: 1,
    justifyContent: 'center',
    gap: 20,
  },
  optionButton: {
    paddingVertical: 16,
    paddingHorizontal: 20,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: COLORS.GREY_MEDIUM,
    backgroundColor: COLORS.WHITE,
  },
  optionButtonSelected: {
    backgroundColor: COLORS.TEAL_LIGHT,
    borderColor: COLORS.TEAL_DARK,
  },
  optionText: {
    fontSize: 16,
    color: COLORS.GREY_DARK,
    fontFamily: 'NotoSansJP_400Regular',
    textAlign: 'center',
  },
  optionTextSelected: {
    color: COLORS.TEAL_DARK,
    fontFamily: 'NotoSansJP_700Bold',
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
    backgroundColor: COLORS.TEAL_LIGHT,
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

