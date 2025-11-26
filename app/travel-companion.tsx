import React, { useState } from 'react';
import { StyleSheet, Text, View, TouchableOpacity, ScrollView } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useRouter, useLocalSearchParams } from 'expo-router';
import { useFonts, NotoSansJP_400Regular, NotoSansJP_700Bold } from '@expo-google-fonts/noto-sans-jp';
import { COLORS } from '@/constants/colors';
import { saveUserProfile } from '@/utils/api';

const TRAVEL_COMPANION_OPTIONS = [
  '明るくてポジティブ',
  '落ち着きがある',
  '聞き上手',
  'しっかり者',
  'おもしろい',
  '気配り',
  'ゆったり観光',
  'アクティブ',
  'グルメ重視',
  '写真撮影',
  'バックパッカー',
  '留学中',
  '駐在中',
  '海外移住',
  'ワーホリ',
  '沈黙が気にならない',
  '話しかけてくれる',
];

export default function TravelCompanionScreen() {
  const router = useRouter();
  const params = useLocalSearchParams();
  const email = params.email as string;
  const [selectedOptions, setSelectedOptions] = useState<string[]>([]);

  let [fontsLoaded] = useFonts({
    NotoSansJP_400Regular,
    NotoSansJP_700Bold,
  });

  if (!fontsLoaded) {
    return null;
  }

  const toggleOption = (option: string) => {
    setSelectedOptions(prev =>
      prev.includes(option)
        ? prev.filter(item => item !== option)
        : [...prev, option]
    );
  };

  const handleNext = async () => {
    // Save travel companion preferences to backend
    await saveUserProfile({
      email,
      travelCompanionPreferences: selectedOptions,
    });
    
    router.push({
      pathname: '/personality-traits',
      params: { email },
    });
  };

  const handleBack = () => {
    router.back();
  };

  return (
    <View style={styles.container}>
      {/* Title */}
      <Text style={styles.title}>どんな人と旅したいですか?</Text>

      {/* Options Grid */}
      <ScrollView style={styles.scrollView} contentContainerStyle={styles.optionsContainer}>
        {TRAVEL_COMPANION_OPTIONS.map((option, index) => {
          const isSelected = selectedOptions.includes(option);
          return (
            <TouchableOpacity
              key={index}
              style={[styles.optionButton, isSelected && styles.optionButtonSelected]}
              onPress={() => toggleOption(option)}
              activeOpacity={0.7}
            >
              <Text style={[styles.optionText, isSelected && styles.optionTextSelected]}>
                {option}
              </Text>
            </TouchableOpacity>
          );
        })}
      </ScrollView>

      {/* Navigation Buttons */}
      <View style={styles.navigationContainer}>
        <TouchableOpacity style={styles.navButton} onPress={handleBack} activeOpacity={0.7}>
          <Ionicons name="chevron-back" size={24} color={COLORS.GREY_DARK} />
        </TouchableOpacity>
        <TouchableOpacity
          style={[styles.navButtonNext, selectedOptions.length === 0 && styles.navButtonDisabled]}
          onPress={handleNext}
          disabled={selectedOptions.length === 0}
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
    color: COLORS.GREY_DARK,
    fontFamily: 'NotoSansJP_700Bold',
    textAlign: 'center',
    marginBottom: 30,
  },
  scrollView: {
    flex: 1,
  },
  optionsContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'flex-start',
    gap: 10,
    paddingBottom: 20,
  },
  optionButton: {
    paddingHorizontal: 16,
    paddingVertical: 10,
    borderRadius: 20,
    borderWidth: 1,
    borderColor: COLORS.GREY_MEDIUM,
    backgroundColor: COLORS.WHITE,
    marginBottom: 10,
  },
  optionButtonSelected: {
    backgroundColor: COLORS.TEAL_LIGHT,
    borderColor: COLORS.TEAL_DARK,
  },
  optionText: {
    fontSize: 14,
    color: COLORS.GREY_DARK,
    fontFamily: 'NotoSansJP_400Regular',
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

