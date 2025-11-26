import React, { useState } from 'react';
import { StyleSheet, Text, View, TouchableOpacity } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useRouter, useLocalSearchParams } from 'expo-router';
import { useFonts, NotoSansJP_400Regular, NotoSansJP_700Bold } from '@expo-google-fonts/noto-sans-jp';
import { COLORS } from '@/constants/colors';
import { saveUserProfile } from '@/utils/api';

export default function EmailNotificationsScreen() {
  const router = useRouter();
  const params = useLocalSearchParams();
  const email = params.email as string || 'sample@sample.com';
  
  const [allAgreed, setAllAgreed] = useState(true);
  const [messagesAgreed, setMessagesAgreed] = useState(true);
  const [campaignsAgreed, setCampaignsAgreed] = useState(true);

  let [fontsLoaded] = useFonts({
    NotoSansJP_400Regular,
    NotoSansJP_700Bold,
  });

  if (!fontsLoaded) {
    return null;
  }

  const handleAllAgreedToggle = () => {
    const newValue = !allAgreed;
    setAllAgreed(newValue);
    setMessagesAgreed(newValue);
    setCampaignsAgreed(newValue);
  };

  const handleNext = async () => {
    // Save email notification preferences to backend
    await saveUserProfile({
      email,
      emailNotifications: {
        allAgreed,
        messagesAgreed,
        campaignsAgreed,
      },
    });
    
    router.push({
      pathname: '/occupation',
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
        メールでお知らせを{'\n'}受け取りましょう
      </Text>
      <Text style={styles.subtitle}>
        この設定は、アプリの利用開始後に変更できます。
      </Text>

      {/* Email Address */}
      <View style={styles.emailContainer}>
        <Text style={styles.emailLabel}>登録されたメールアドレス</Text>
        <Text style={styles.emailValue}>{email}</Text>
      </View>

      {/* Checkboxes */}
      <View style={styles.checkboxesContainer}>
        <TouchableOpacity
          style={styles.checkboxRow}
          onPress={handleAllAgreedToggle}
          activeOpacity={0.7}
        >
          <View style={[styles.checkbox, allAgreed && styles.checkboxChecked]}>
            {allAgreed && <Text style={styles.checkmark}>✓</Text>}
          </View>
          <Text style={styles.checkboxLabel}>下記の項目すべてに同意します。</Text>
        </TouchableOpacity>

        <View style={styles.indentedCheckboxes}>
          <TouchableOpacity
            style={styles.checkboxRow}
            onPress={() => setMessagesAgreed(!messagesAgreed)}
            activeOpacity={0.7}
          >
            <View style={[styles.checkbox, messagesAgreed && styles.checkboxChecked]}>
              {messagesAgreed && <Text style={styles.checkmark}>✓</Text>}
            </View>
            <Text style={styles.checkboxLabel}>
              旅の仲間からのメッセージを受け取る
            </Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={styles.checkboxRow}
            onPress={() => setCampaignsAgreed(!campaignsAgreed)}
            activeOpacity={0.7}
          >
            <View style={[styles.checkbox, campaignsAgreed && styles.checkboxChecked]}>
              {campaignsAgreed && <Text style={styles.checkmark}>✓</Text>}
            </View>
            <Text style={styles.checkboxLabel}>
              お得なキャンペーンなどのお知らせ (広告宣伝メール)を受け取る
            </Text>
          </TouchableOpacity>
        </View>
      </View>

      {/* Disclaimer */}
      <Text style={styles.disclaimer}>
        ※サービス上重要なお知らせは、設定内容によらず送信されることがあります。
      </Text>

      {/* Navigation Button */}
      <View style={styles.navigationContainer}>
        <View style={styles.navButtonPlaceholder} />
        <TouchableOpacity
          style={styles.navButtonNext}
          onPress={handleNext}
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
  emailContainer: {
    marginBottom: 30,
  },
  emailLabel: {
    fontSize: 14,
    color: COLORS.GREY_DARK,
    fontFamily: 'NotoSansJP_400Regular',
    marginBottom: 8,
  },
  emailValue: {
    fontSize: 18,
    color: COLORS.GREY_DARK,
    fontFamily: 'NotoSansJP_700Bold',
  },
  checkboxesContainer: {
    marginBottom: 20,
  },
  checkboxRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 16,
  },
  indentedCheckboxes: {
    marginLeft: 32,
  },
  checkbox: {
    width: 24,
    height: 24,
    borderWidth: 2,
    borderColor: COLORS.GREY_DARK,
    borderRadius: 4,
    marginRight: 12,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: COLORS.WHITE,
  },
  checkboxChecked: {
    backgroundColor: COLORS.GREY_DARK,
  },
  checkmark: {
    color: COLORS.WHITE,
    fontSize: 16,
    fontWeight: 'bold',
  },
  checkboxLabel: {
    fontSize: 14,
    color: COLORS.GREY_DARK,
    fontFamily: 'NotoSansJP_400Regular',
    flex: 1,
  },
  disclaimer: {
    fontSize: 12,
    color: COLORS.GREY_MEDIUM,
    fontFamily: 'NotoSansJP_400Regular',
    marginBottom: 30,
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
    backgroundColor: COLORS.CYAN_LIGHT,
    alignItems: 'center',
    justifyContent: 'center',
  },
});

