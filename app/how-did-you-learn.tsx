import React, { useState } from 'react';
import { StyleSheet, Text, View, TouchableOpacity, ScrollView } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useRouter, useLocalSearchParams } from 'expo-router';
import { useFonts, NotoSansJP_400Regular, NotoSansJP_700Bold } from '@expo-google-fonts/noto-sans-jp';
import { COLORS } from '@/constants/colors';
import { saveUserProfile } from '@/utils/api';

const SOURCE_OPTIONS = [
  '友人・知人・家族からの口コミ',
  'SNS',
  'テレビCM・TVer',
  'まとめサイト',
  '屋外・交通広告',
  '新聞や雑誌などの記事',
  'インターネット広告',
  'YouTube',
  'その他',
];

export default function HowDidYouLearnScreen() {
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
    
    // Save how did you learn to backend
    await saveUserProfile({
      email,
      howDidYouLearn: selectedOption,
    });
    
    router.push({
      pathname: '/purpose-of-use',
      params: { email },
    });
  };

  const handleBack = () => {
    router.back();
  };

  return (
    <View style={styles.container}>
      {/* Title */}
      <Text style={styles.title}>Mochilaをどこで知りましたか?</Text>

      {/* Options List */}
      <ScrollView style={styles.scrollView} contentContainerStyle={styles.optionsContainer}>
        {SOURCE_OPTIONS.map((option, index) => {
          const isSelected = selectedOption === option;
          return (
            <TouchableOpacity
              key={index}
              style={[styles.optionItem, isSelected && styles.optionItemSelected]}
              onPress={() => setSelectedOption(option)}
              activeOpacity={0.7}
            >
              <Text style={[styles.optionText, isSelected && styles.optionTextSelected]}>
                {option}
              </Text>
            </TouchableOpacity>
          );
        })}
      </ScrollView>

      {/* Navigation Button */}
      <View style={styles.navigationContainer}>
        <View style={styles.navButtonPlaceholder} />
        <TouchableOpacity
          style={[styles.navButtonNext, !selectedOption && styles.navButtonDisabled]}
          onPress={handleNext}
          disabled={!selectedOption}
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
    color: COLORS.GREY_MEDIUM,
    fontFamily: 'NotoSansJP_400Regular',
  },
  optionTextSelected: {
    color: COLORS.TEAL_DARK,
    fontFamily: 'NotoSansJP_700Bold',
  },
  navigationContainer: {
    flexDirection: 'row',
    justifyContent: 'flex-end',
    alignItems: 'center',
    paddingBottom: 30,
    paddingHorizontal: 10,
  },
  navButtonPlaceholder: {
    width: 50,
  },
  navButtonNext: {
    width: 50,
    height: 50,
    borderRadius: 25,
    backgroundColor: COLORS.TEAL_PRIMARY,
    alignItems: 'center',
    justifyContent: 'center',
  },
  navButtonDisabled: {
    opacity: 0.5,
  },
});

