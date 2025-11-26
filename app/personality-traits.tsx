import React, { useState } from 'react';
import { StyleSheet, Text, View, TouchableOpacity, ScrollView } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useRouter, useLocalSearchParams } from 'expo-router';
import { useFonts, NotoSansJP_400Regular, NotoSansJP_700Bold } from '@expo-google-fonts/noto-sans-jp';
import { COLORS } from '@/constants/colors';
import { saveUserProfile } from '@/utils/api';

const PERSONALITY_TRAITS = [
  '照れ屋',
  'さわやか',
  '面白い',
  '寛容',
  '社交的',
  '決断力がある',
  '明るい',
  '知的',
  '上品',
  '謙虚',
  'いつも笑顔',
  '気前がいい',
  '気分屋',
  '厳格',
  '大胆',
  '好奇心旺盛',
  '家庭的',
  '話し上手',
  '穏やか',
  '楽観的',
  '行動的',
  '熱い',
  '仕事好き',
  '負けず嫌い',
  '几帳面',
  '奥手',
  '合理的',
  '素直',
  '責任感がある',
  '聞き上手',
  'マメ',
  '思いやりがある',
  '裏表がない',
  '落ち着いている',
  '優しい',
  '面倒見が良い',
  '冷静沈着',
  '天然と言われる',
  'マイペース',
  '真面目',
  'インドア',
];

const MAX_SELECTIONS = 3;

export default function PersonalityTraitsScreen() {
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
    setSelectedOptions(prev => {
      if (prev.includes(option)) {
        return prev.filter(item => item !== option);
      } else if (prev.length < MAX_SELECTIONS) {
        return [...prev, option];
      }
      return prev;
    });
  };

  const handleNext = async () => {
    // Save personality traits to backend
    await saveUserProfile({
      email,
      personalityTraits: selectedOptions,
    });
    
    router.push({
      pathname: '/match-preference',
      params: { email },
    });
  };

  const handleBack = () => {
    router.back();
  };

  return (
    <View style={styles.container}>
      {/* Title */}
      <Text style={styles.title}>周りからはどんな人と言われますか?</Text>
      <Text style={styles.subtitle}>最大3つまで選択できます</Text>

      {/* Options Grid */}
      <ScrollView style={styles.scrollView} contentContainerStyle={styles.optionsContainer}>
        {PERSONALITY_TRAITS.map((option, index) => {
          const isSelected = selectedOptions.includes(option);
          return (
            <TouchableOpacity
              key={index}
              style={[styles.optionButton, isSelected && styles.optionButtonSelected]}
              onPress={() => toggleOption(option)}
              activeOpacity={0.7}
              disabled={!isSelected && selectedOptions.length >= MAX_SELECTIONS}
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
    color: COLORS.TEAL_DARK,
    fontFamily: 'NotoSansJP_700Bold',
    textAlign: 'center',
    marginBottom: 10,
    lineHeight: 30,
  },
  subtitle: {
    fontSize: 14,
    color: COLORS.GREY_MEDIUM,
    fontFamily: 'NotoSansJP_400Regular',
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

