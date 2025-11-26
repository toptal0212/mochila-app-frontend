import React, { useState } from 'react';
import { StyleSheet, Text, View, TouchableOpacity, ScrollView } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useRouter, useLocalSearchParams } from 'expo-router';
import { useFonts, NotoSansJP_400Regular, NotoSansJP_700Bold } from '@expo-google-fonts/noto-sans-jp';
import { COLORS } from '@/constants/colors';
import { saveUserProfile } from '@/utils/api';

const OCCUPATIONS = [
  '大手企業',
  '公務員',
  '受付',
  '事務員',
  '看護師',
  '保育士',
  '客室乗務員',
  '秘書',
  '教育関連',
  '福祉・介護',
  '料理師・栄養士',
  'アパレル・ショップ',
  '美容師',
  'エンジニア',
  'デザイナー',
  '営業',
  'マーケティング',
  'コンサルタント',
  '医師',
  '弁護士',
  '会計士',
  '自営業',
  '学生',
  'フリーランス',
  'その他',
];

export default function OccupationScreen() {
  const router = useRouter();
  const params = useLocalSearchParams();
  const email = params.email as string;
  const [selectedOccupation, setSelectedOccupation] = useState<string | null>(null);

  let [fontsLoaded] = useFonts({
    NotoSansJP_400Regular,
    NotoSansJP_700Bold,
  });

  if (!fontsLoaded) {
    return null;
  }

  const handleNext = async () => {
    if (!selectedOccupation) return;
    
    // Save occupation to backend
    await saveUserProfile({
      email,
      occupation: selectedOccupation,
    });
    
    router.push({
      pathname: '/profile-intro',
      params: { email },
    });
  };

  const handleBack = () => {
    router.back();
  };

  return (
    <View style={styles.container}>
      {/* Title */}
      <Text style={styles.title}>どんなお仕事をしていますか?</Text>

      {/* Occupation List */}
      <ScrollView style={styles.scrollView}>
        {OCCUPATIONS.map((occupation, index) => {
          const isSelected = selectedOccupation === occupation;
          return (
            <TouchableOpacity
              key={index}
              style={[styles.occupationItem, isSelected && styles.occupationItemSelected]}
              onPress={() => setSelectedOccupation(occupation)}
              activeOpacity={0.7}
            >
              <Text style={[styles.occupationText, isSelected && styles.occupationTextSelected]}>
                {occupation}
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
          style={[styles.navButtonNext, !selectedOccupation && styles.navButtonDisabled]}
          onPress={handleNext}
          disabled={!selectedOccupation}
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
    color: COLORS.TEAL_DARK,
    fontFamily: 'NotoSansJP_700Bold',
    textAlign: 'center',
    marginBottom: 30,
  },
  scrollView: {
    flex: 1,
  },
  occupationItem: {
    paddingVertical: 16,
    paddingHorizontal: 4,
    borderBottomWidth: 1,
    borderBottomColor: COLORS.GREY_LIGHT,
  },
  occupationItemSelected: {
    backgroundColor: COLORS.TEAL_LIGHT,
  },
  occupationText: {
    fontSize: 16,
    color: COLORS.GREY_MEDIUM,
    fontFamily: 'NotoSansJP_400Regular',
  },
  occupationTextSelected: {
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
    backgroundColor: COLORS.TEAL_DARK,
    alignItems: 'center',
    justifyContent: 'center',
  },
  navButtonDisabled: {
    opacity: 0.5,
  },
});

