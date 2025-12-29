import React, { useState, useEffect } from 'react';
import { StyleSheet, Text, View, TouchableOpacity, ScrollView, TextInput, Alert } from 'react-native';
import { useRouter, useLocalSearchParams } from 'expo-router';
import { useFonts, NotoSansJP_400Regular, NotoSansJP_700Bold } from '@expo-google-fonts/noto-sans-jp';
import { Ionicons } from '@expo/vector-icons';
import { COLORS } from '@/constants/colors';
import { getUserProfile, saveUserProfile } from '@/utils/api';
import { getDisplayAge } from '@/utils/helpers';

const PREFECTURES = [
  '北海道', '青森', '岩手', '宮城', '秋田', '山形', '福島',
  '茨城', '栃木', '群馬', '埼玉', '千葉', '東京', '神奈川',
  '新潟', '富山', '石川', '福井', '山梨', '長野', '岐阜',
  '静岡', '愛知', '三重', '滋賀', '京都', '大阪', '兵庫',
  '奈良', '和歌山', '鳥取', '島根', '岡山', '広島', '山口',
  '徳島', '香川', '愛媛', '高知', '福岡', '佐賀', '長崎',
  '熊本', '大分', '宮崎', '鹿児島', '沖縄',
];

export default function ProfileEditScreen() {
  const router = useRouter();
  const params = useLocalSearchParams();
  const email = params.email as string;
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [profile, setProfile] = useState<any>(null);
  const [showRegionPicker, setShowRegionPicker] = useState(false);
  
  // Form states
  const [displayName, setDisplayName] = useState('');
  const [region, setRegion] = useState('');
  const [selfIntroduction, setSelfIntroduction] = useState('');
  const [occupation, setOccupation] = useState('');

  let [fontsLoaded] = useFonts({
    NotoSansJP_400Regular,
    NotoSansJP_700Bold,
  });

  useEffect(() => {
    loadProfile();
  }, []);

  const loadProfile = async () => {
    setLoading(true);
    try {
      const data = await getUserProfile(email);
      if (data) {
        setProfile(data);
        setDisplayName(data.displayName || '');
        setRegion(data.region || '');
        setSelfIntroduction(data.selfIntroduction || '');
        setOccupation(data.occupation || '');
      }
    } catch (error) {
      console.error('Error loading profile:', error);
      Alert.alert('エラー', 'プロフィールの読み込みに失敗しました');
    } finally {
      setLoading(false);
    }
  };

  const handleSave = async () => {
    if (!displayName.trim()) {
      Alert.alert('エラー', '表示名を入力してください');
      return;
    }

    setSaving(true);
    try {
      await saveUserProfile({
        email,
        displayName: displayName.trim(),
        region: region || undefined,
        selfIntroduction: selfIntroduction.trim() || undefined,
        occupation: occupation.trim() || undefined,
      });
      
      Alert.alert('成功', 'プロフィールを更新しました', [
        { text: 'OK', onPress: () => router.back() }
      ]);
    } catch (error) {
      console.error('Error saving profile:', error);
      Alert.alert('エラー', 'プロフィールの更新に失敗しました');
    } finally {
      setSaving(false);
    }
  };

  if (!fontsLoaded || loading) {
    return (
      <View style={styles.loadingContainer}>
        <Text style={styles.loadingText}>読み込み中...</Text>
      </View>
    );
  }

  if (showRegionPicker) {
    return (
      <View style={styles.container}>
        {/* Header */}
        <View style={styles.header}>
          <TouchableOpacity onPress={() => setShowRegionPicker(false)}>
            <Ionicons name="chevron-back" size={24} color={COLORS.GREY_DARK} />
          </TouchableOpacity>
          <Text style={styles.headerTitle}>地域を選択</Text>
          <View style={styles.headerRight} />
        </View>

        {/* Region Picker */}
        <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
          {PREFECTURES.map((prefecture, index) => {
            const isSelected = region === prefecture;
            return (
              <TouchableOpacity
                key={index}
                style={[styles.regionItem, isSelected && styles.regionItemSelected]}
                onPress={() => {
                  setRegion(prefecture);
                  setShowRegionPicker(false);
                }}
                activeOpacity={0.7}
              >
                <Text style={[styles.regionText, isSelected && styles.regionTextSelected]}>
                  {prefecture}
                </Text>
                {isSelected && (
                  <Ionicons name="checkmark" size={24} color={COLORS.PURPLE_PRIMARY} />
                )}
              </TouchableOpacity>
            );
          })}
        </ScrollView>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity onPress={() => router.back()}>
          <Ionicons name="chevron-back" size={24} color={COLORS.GREY_DARK} />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>プロフィール編集</Text>
        <TouchableOpacity onPress={handleSave} disabled={saving}>
          <Text style={[styles.saveButton, saving && styles.saveButtonDisabled]}>
            {saving ? '保存中...' : '保存'}
          </Text>
        </TouchableOpacity>
      </View>

      <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
        {/* Display Name */}
        <View style={styles.section}>
          <Text style={styles.sectionLabel}>表示名 *</Text>
          <TextInput
            style={styles.input}
            value={displayName}
            onChangeText={setDisplayName}
            placeholder="表示名を入力"
            placeholderTextColor={COLORS.GREY_LIGHT}
            maxLength={20}
          />
          <Text style={styles.helperText}>他のユーザーに表示される名前です</Text>
        </View>

        {/* Birthday (Read-only) */}
        <View style={styles.section}>
          <Text style={styles.sectionLabel}>年齢</Text>
          <View style={styles.readOnlyField}>
            <Text style={styles.readOnlyText}>
              {(() => {
                const age = getDisplayAge(profile);
                return age ? `${age}歳` : '未設定';
              })()}
            </Text>
            <Text style={styles.helperText}>年齢は生年月日から自動計算されます</Text>
          </View>
        </View>

        {/* Region */}
        <View style={styles.section}>
          <Text style={styles.sectionLabel}>地域</Text>
          <TouchableOpacity
            style={styles.selectField}
            onPress={() => setShowRegionPicker(true)}
            activeOpacity={0.7}
          >
            <Text style={[styles.selectFieldText, !region && styles.selectFieldPlaceholder]}>
              {region || '地域を選択'}
            </Text>
            <Ionicons name="chevron-forward" size={20} color={COLORS.GREY_MEDIUM} />
          </TouchableOpacity>
        </View>

        {/* Occupation */}
        <View style={styles.section}>
          <Text style={styles.sectionLabel}>職業</Text>
          <TextInput
            style={styles.input}
            value={occupation}
            onChangeText={setOccupation}
            placeholder="職業を入力"
            placeholderTextColor={COLORS.GREY_LIGHT}
            maxLength={30}
          />
        </View>

        {/* Self Introduction */}
        <View style={styles.section}>
          <Text style={styles.sectionLabel}>自己紹介</Text>
          <TextInput
            style={[styles.input, styles.textArea]}
            value={selfIntroduction}
            onChangeText={setSelfIntroduction}
            placeholder="自己紹介を入力してください"
            placeholderTextColor={COLORS.GREY_LIGHT}
            multiline
            numberOfLines={6}
            maxLength={500}
            textAlignVertical="top"
          />
          <Text style={styles.helperText}>
            {selfIntroduction.length}/500文字
          </Text>
        </View>

        {/* Info Box */}
        <View style={styles.infoBox}>
          <Ionicons name="information-circle-outline" size={20} color={COLORS.PURPLE_PRIMARY} />
          <Text style={styles.infoText}>
            プロフィール写真を変更する場合は、プロフィール画面の写真をタップしてください
          </Text>
        </View>
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.WHITE,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: COLORS.WHITE,
  },
  loadingText: {
    fontSize: 16,
    color: COLORS.GREY_MEDIUM,
    fontFamily: 'NotoSansJP_400Regular',
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingTop: 60,
    paddingHorizontal: 20,
    paddingBottom: 15,
    backgroundColor: COLORS.WHITE,
    borderBottomWidth: 1,
    borderBottomColor: COLORS.GREY_LIGHT,
  },
  headerTitle: {
    fontSize: 18,
    color: COLORS.GREY_DARK,
    fontFamily: 'NotoSansJP_700Bold',
  },
  headerRight: {
    width: 60,
  },
  saveButton: {
    fontSize: 16,
    color: COLORS.PURPLE_PRIMARY,
    fontFamily: 'NotoSansJP_700Bold',
  },
  saveButtonDisabled: {
    opacity: 0.5,
  },
  content: {
    flex: 1,
    paddingHorizontal: 20,
  },
  section: {
    marginTop: 24,
  },
  sectionLabel: {
    fontSize: 14,
    color: COLORS.GREY_DARK,
    fontFamily: 'NotoSansJP_700Bold',
    marginBottom: 8,
  },
  input: {
    borderWidth: 1,
    borderColor: COLORS.GREY_LIGHT,
    borderRadius: 8,
    paddingHorizontal: 16,
    paddingVertical: 12,
    fontSize: 16,
    color: COLORS.GREY_DARK,
    fontFamily: 'NotoSansJP_400Regular',
    backgroundColor: COLORS.WHITE,
  },
  textArea: {
    minHeight: 120,
    paddingTop: 12,
  },
  helperText: {
    fontSize: 12,
    color: COLORS.GREY_MEDIUM,
    fontFamily: 'NotoSansJP_400Regular',
    marginTop: 6,
  },
  readOnlyField: {
    paddingVertical: 12,
  },
  readOnlyText: {
    fontSize: 16,
    color: COLORS.GREY_DARK,
    fontFamily: 'NotoSansJP_400Regular',
    marginBottom: 6,
  },
  selectField: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: COLORS.GREY_LIGHT,
    borderRadius: 8,
    paddingHorizontal: 16,
    paddingVertical: 12,
    backgroundColor: COLORS.WHITE,
  },
  selectFieldText: {
    fontSize: 16,
    color: COLORS.GREY_DARK,
    fontFamily: 'NotoSansJP_400Regular',
  },
  selectFieldPlaceholder: {
    color: COLORS.GREY_LIGHT,
  },
  regionItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 16,
    paddingHorizontal: 16,
    borderBottomWidth: 1,
    borderBottomColor: COLORS.GREY_LIGHT,
  },
  regionItemSelected: {
    backgroundColor: COLORS.PURPLE_LIGHT,
  },
  regionText: {
    fontSize: 16,
    color: COLORS.GREY_DARK,
    fontFamily: 'NotoSansJP_400Regular',
  },
  regionTextSelected: {
    color: COLORS.PURPLE_PRIMARY,
    fontFamily: 'NotoSansJP_700Bold',
  },
  infoBox: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    backgroundColor: COLORS.PURPLE_LIGHT,
    padding: 16,
    borderRadius: 8,
    marginTop: 24,
    marginBottom: 40,
  },
  infoText: {
    flex: 1,
    fontSize: 14,
    color: COLORS.GREY_DARK,
    fontFamily: 'NotoSansJP_400Regular',
    marginLeft: 12,
    lineHeight: 20,
  },
});

