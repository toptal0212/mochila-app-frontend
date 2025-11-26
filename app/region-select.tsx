import React, { useState } from 'react';
import { StyleSheet, Text, View, TouchableOpacity, ScrollView } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useRouter, useLocalSearchParams } from 'expo-router';
import { useFonts, NotoSansJP_400Regular, NotoSansJP_700Bold } from '@expo-google-fonts/noto-sans-jp';
import { COLORS } from '@/constants/colors';
import { saveUserProfile } from '@/utils/api';

const PREFECTURES = [
  '北海道', '青森', '岩手', '宮城', '秋田', '山形', '福島',
  '茨城', '栃木', '群馬', '埼玉', '千葉', '東京', '神奈川',
  '新潟', '富山', '石川', '福井', '山梨', '長野', '岐阜',
  '静岡', '愛知', '三重', '滋賀', '京都', '大阪', '兵庫',
  '奈良', '和歌山', '鳥取', '島根', '岡山', '広島', '山口',
  '徳島', '香川', '愛媛', '高知', '福岡', '佐賀', '長崎',
  '熊本', '大分', '宮崎', '鹿児島', '沖縄',
];

export default function RegionSelectScreen() {
  const router = useRouter();
  const params = useLocalSearchParams();
  const email = params.email as string;
  const [selectedPrefecture, setSelectedPrefecture] = useState<string | null>(null);

  let [fontsLoaded] = useFonts({
    NotoSansJP_400Regular,
    NotoSansJP_700Bold,
  });

  if (!fontsLoaded) {
    return null;
  }

  const handleNext = async () => {
    if (!selectedPrefecture) return;
    
    // Save region to backend
    await saveUserProfile({
      email,
      region: selectedPrefecture,
    });
    
    router.push({
      pathname: '/how-did-you-learn',
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
        あなたはどちらに{'\n'}お住まいですか?
      </Text>
      <Text style={styles.subtitle}>地域が近いお相手に探されやすくなります</Text>

      {/* Country Selection */}
      <View style={styles.countryContainer}>
        <Text style={styles.countryText}>日本</Text>
        <Ionicons name="chevron-down" size={20} color={COLORS.TEAL_DARK} />
      </View>

      {/* Prefecture List */}
      <ScrollView style={styles.scrollView}>
        {PREFECTURES.map((prefecture, index) => {
          const isSelected = selectedPrefecture === prefecture;
          return (
            <TouchableOpacity
              key={index}
              style={[styles.prefectureItem, isSelected && styles.prefectureItemSelected]}
              onPress={() => setSelectedPrefecture(prefecture)}
              activeOpacity={0.7}
            >
              <Text style={[styles.prefectureText, isSelected && styles.prefectureTextSelected]}>
                {prefecture}
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
          style={[styles.navButtonNext, !selectedPrefecture && styles.navButtonDisabled]}
          onPress={handleNext}
          disabled={!selectedPrefecture}
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
    marginBottom: 10,
    lineHeight: 30,
  },
  subtitle: {
    fontSize: 14,
    color: COLORS.GREY_MEDIUM,
    fontFamily: 'NotoSansJP_400Regular',
    textAlign: 'center',
    marginBottom: 20,
  },
  countryContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 20,
  },
  countryText: {
    fontSize: 16,
    color: COLORS.TEAL_DARK,
    fontFamily: 'NotoSansJP_700Bold',
    marginRight: 8,
  },
  scrollView: {
    flex: 1,
  },
  prefectureItem: {
    paddingVertical: 16,
    paddingHorizontal: 4,
    borderBottomWidth: 1,
    borderBottomColor: COLORS.GREY_LIGHT,
  },
  prefectureItemSelected: {
    backgroundColor: COLORS.TEAL_LIGHT,
  },
  prefectureText: {
    fontSize: 16,
    color: COLORS.GREY_MEDIUM,
    fontFamily: 'NotoSansJP_400Regular',
  },
  prefectureTextSelected: {
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

