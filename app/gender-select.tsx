import React, { useState } from 'react';
import { StyleSheet, Text, View, TouchableOpacity } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useRouter, useLocalSearchParams } from 'expo-router';
import { useFonts, NotoSansJP_400Regular, NotoSansJP_700Bold } from '@expo-google-fonts/noto-sans-jp';
import { saveUserProfile } from '@/utils/api';

// Teal color scheme based on design
const TEAL_PRIMARY = '#4ECDC4';
const TEAL_DARK = '#2E8B87';
const TEAL_LIGHT = '#E0F7F5';
const CYAN_LIGHT = '#B3E5E0';

export default function GenderSelectScreen() {
  const router = useRouter();
  const params = useLocalSearchParams();
  const email = params.email as string;
  const [selectedGender, setSelectedGender] = useState<'male' | 'female' | null>(null);

  let [fontsLoaded] = useFonts({
    NotoSansJP_400Regular,
    NotoSansJP_700Bold,
  });

  if (!fontsLoaded) {
    return null;
  }

  const handleNext = async () => {
    if (!selectedGender) {
      return;
    }

    // Save gender selection to backend
    await saveUserProfile({
      email,
      gender: selectedGender,
    });

    router.push({
      pathname: '/onboarding-1',
      params: { email },
    });
  };

  const handleBack = () => {
    router.back();
  };

  return (
    <View style={styles.container}>
      {/* Main Content - Centered */}
      <View style={styles.mainContent}>
        {/* Title */}
        <Text style={styles.title}>
          あなたの性別を{'\n'}教えてください
        </Text>

        {/* Gender Selection Buttons */}
        <View style={styles.genderButtonsContainer}>
          {/* Male Button */}
          <TouchableOpacity
            style={[
              styles.genderButton,
              selectedGender === 'male' && styles.genderButtonSelected
            ]}
            onPress={() => setSelectedGender('male')}
            activeOpacity={0.8}
          >
            <View style={styles.genderIconContainer}>
              {/* Male icon - person with square shoulders */}
              <View style={styles.personIcon}>
                <View style={styles.iconHead} />
                <View style={styles.iconNeck} />
                <View style={styles.iconBodyMale} />
              </View>
            </View>
            <Text style={styles.genderLabel}>男性</Text>
          </TouchableOpacity>

          {/* Female Button */}
          <TouchableOpacity
            style={[
              styles.genderButton,
              selectedGender === 'female' && styles.genderButtonSelected
            ]}
            onPress={() => setSelectedGender('female')}
            activeOpacity={0.8}
          >
            <View style={styles.genderIconContainer}>
              {/* Female icon - person with triangular body */}
              <View style={styles.personIcon}>
                <View style={styles.iconHead} />
                <View style={styles.iconNeck} />
                <View style={styles.iconBodyFemale} />
              </View>
            </View>
            <Text style={styles.genderLabel}>女性</Text>
          </TouchableOpacity>
        </View>

        {/* Disclaimer Text */}
        <Text style={styles.disclaimerText}>性別は一度登録したら変更できない</Text>
      </View>

      {/* Navigation Buttons - Bottom */}
      <View style={styles.navigationContainer}>
        {/* Back Button */}
        <TouchableOpacity
          style={styles.navButton}
          onPress={handleBack}
          activeOpacity={0.7}
        >
          <Ionicons name="chevron-back" size={24} color={TEAL_DARK} />
        </TouchableOpacity>

        {/* Next Button */}
        <TouchableOpacity
          style={[
            styles.navButton,
            styles.navButtonNext,
            !selectedGender && styles.navButtonDisabled
          ]}
          onPress={handleNext}
          disabled={!selectedGender}
          activeOpacity={0.7}
        >
          <Ionicons name="chevron-forward" size={24} color={TEAL_DARK} />
        </TouchableOpacity>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#ffffff',
    paddingHorizontal: 20,
  },
  mainContent: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  title: {
    fontSize: 24,
    color: TEAL_DARK,
    fontFamily: 'NotoSansJP_700Bold',
    textAlign: 'center',
    marginBottom: 60,
    lineHeight: 36,
  },
  genderButtonsContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    gap: 30,
    marginBottom: 20,
  },
  genderButton: {
    width: 120,
    height: 120,
    borderRadius: 60,
    backgroundColor: TEAL_LIGHT,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 2,
    borderColor: 'transparent',
  },
  genderButtonSelected: {
    borderColor: TEAL_DARK,
    backgroundColor: TEAL_LIGHT,
  },
  genderIconContainer: {
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 8,
  },
  personIcon: {
    alignItems: 'center',
    justifyContent: 'center',
    width: 40,
    height: 50,
  },
  iconHead: {
    width: 30,
    height: 30,
    borderRadius: 15,
    backgroundColor: TEAL_DARK,
    marginBottom: 3,
  },
  iconNeck: {
    width: 10,
    height: 8,
    backgroundColor: TEAL_DARK,
    marginBottom: 2,
  },
  iconBodyMale: {
    width: 38,
    height: 34,
    backgroundColor: TEAL_DARK,
    // Rectangular body with square shoulders
    borderRadius: 2,
  },
  iconBodyFemale: {
    width: 38,
    height: 34,
    backgroundColor: TEAL_DARK,
    // Triangular/dress shape - wider shoulders, narrow waist
    borderTopLeftRadius: 19,
    borderTopRightRadius: 19,
    borderBottomLeftRadius: 22,
    borderBottomRightRadius: 22,
  },
  genderLabel: {
    fontSize: 16,
    color: TEAL_DARK,
    fontFamily: 'NotoSansJP_700Bold',
    marginTop: 4,
  },
  disclaimerText: {
    fontSize: 14,
    color: '#999999',
    fontFamily: 'NotoSansJP_400Regular',
    textAlign: 'center',
    marginTop: 20,
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
    backgroundColor: TEAL_LIGHT,
    alignItems: 'center',
    justifyContent: 'center',
  },
  navButtonNext: {
    backgroundColor: CYAN_LIGHT,
  },
  navButtonDisabled: {
    opacity: 0.5,
  },
});

