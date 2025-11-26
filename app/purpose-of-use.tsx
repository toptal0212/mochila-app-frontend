import React, { useState } from 'react';
import { StyleSheet, Text, View, TouchableOpacity, ScrollView } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useRouter, useLocalSearchParams } from 'expo-router';
import { useFonts, NotoSansJP_400Regular, NotoSansJP_700Bold } from '@expo-google-fonts/noto-sans-jp';
import { COLORS } from '@/constants/colors';
import { saveUserProfile } from '@/utils/api';

const PURPOSE_OPTIONS = [
  '旅先で友達を作る',
  '一緒に旅行する',
  '駐在中の友達探し',
  '留学中の友達探し',
  '語学を勉強する',
  '一緒に遊ぶ人探す',
];

export default function PurposeOfUseScreen() {
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
    // Save purpose of use to backend
    await saveUserProfile({
      email,
      purposeOfUse: selectedOptions,
    });
    
    router.push({
      pathname: '/display-name',
      params: { email },
    });
  };

  const handleBack = () => {
    router.back();
  };

  return (
    <View style={styles.container}>
      {/* Title */}
      <Text style={styles.title}>
        Mochilaの利用目的は{'\n'}何ですか?
      </Text>

      {/* Options List */}
      <ScrollView style={styles.scrollView} contentContainerStyle={styles.optionsContainer}>
        {PURPOSE_OPTIONS.map((option, index) => {
          const isSelected = selectedOptions.includes(option);
          return (
            <TouchableOpacity
              key={index}
              style={[styles.optionItem, isSelected && styles.optionItemSelected]}
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
          <Ionicons name="chevron-back" size={24} color={COLORS.WHITE} />
        </TouchableOpacity>
        <TouchableOpacity
          style={[styles.navButtonNext, selectedOptions.length === 0 && styles.navButtonDisabled]}
          onPress={handleNext}
          disabled={selectedOptions.length === 0}
          activeOpacity={0.7}
        >
          <Ionicons name="chevron-forward" size={24} color={COLORS.WHITE} />
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
    marginBottom: 40,
    lineHeight: 30,
  },
  scrollView: {
    flex: 1,
  },
  optionsContainer: {
    gap: 1,
  },
  optionItem: {
    paddingVertical: 16,
    paddingHorizontal: 4,
    borderBottomWidth: 1,
    borderBottomColor: COLORS.GREY_LIGHT,
  },
  optionItemSelected: {
    backgroundColor: COLORS.TEAL_LIGHT,
  },
  optionText: {
    fontSize: 16,
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
    backgroundColor: COLORS.CYAN_LIGHT,
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

