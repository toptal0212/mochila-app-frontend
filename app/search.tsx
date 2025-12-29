import React, { useState } from 'react';
import { StyleSheet, Text, View, TouchableOpacity, ScrollView } from 'react-native';
import { useRouter, useLocalSearchParams } from 'expo-router';
import { useFonts, NotoSansJP_400Regular, NotoSansJP_700Bold } from '@expo-google-fonts/noto-sans-jp';
import { Ionicons } from '@expo/vector-icons';
import { COLORS } from '@/constants/colors';

export default function SearchScreen() {
  const router = useRouter();
  const params = useLocalSearchParams();
  const email = params.email as string;
  const [saveAsFavorite, setSaveAsFavorite] = useState(false);

  // Search criteria state
  const [criteria, setCriteria] = useState({
    age: '30歳~35歳',
    residence: '日本:東京',
    height: '問わない',
    bodyType: '問わない',
    lastLogin: '1週間以内',
    registrationDate: '問わない',
    partnerLikes: '問わない',
    hometown: '問わない',
    smoking: '問わない',
    drinking: '問わない',
    education: '問わない',
    occupation: '問わない',
    income: '問わない',
    daysOff: '問わない',
    selfIntroduction: '問わない',
    subPhotos: '問わない',
  });

  let [fontsLoaded] = useFonts({
    NotoSansJP_400Regular,
    NotoSansJP_700Bold,
  });

  if (!fontsLoaded) {
    return null;
  }

  const handleBack = () => {
    router.back();
  };

  const handleReset = () => {
    setCriteria({
      age: '問わない',
      residence: '問わない',
      height: '問わない',
      bodyType: '問わない',
      lastLogin: '問わない',
      registrationDate: '問わない',
      partnerLikes: '問わない',
      hometown: '問わない',
      smoking: '問わない',
      drinking: '問わない',
      education: '問わない',
      occupation: '問わない',
      income: '問わない',
      daysOff: '問わない',
      selfIntroduction: '問わない',
      subPhotos: '問わない',
    });
  };

  const handleRecallFavorite = () => {
    // TODO: Implement favorite conditions recall
    alert('お気に入り条件を呼び出します');
  };

  const handleSearch = () => {
    // TODO: Implement search with criteria
    router.push({
      pathname: '/home',
      params: { email, searchCriteria: JSON.stringify(criteria) },
    });
  };

  const handleCriteriaPress = (key: string) => {
    // TODO: Open selection modal for this criteria
    alert(`${key}の選択画面を開きます`);
  };

  const renderCriteriaRow = (label: string, key: string, value: string) => (
    <TouchableOpacity
      style={styles.criteriaRow}
      onPress={() => handleCriteriaPress(key)}
      activeOpacity={0.7}
    >
      <Text style={styles.criteriaLabel}>{label}</Text>
      <View style={styles.criteriaValueContainer}>
        <Text style={styles.criteriaValue}>{value}</Text>
        <Ionicons name="chevron-forward" size={20} color={COLORS.GREY_MEDIUM} />
      </View>
    </TouchableOpacity>
  );

  return (
    <View style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity onPress={handleBack}>
          <Ionicons name="chevron-back" size={24} color={COLORS.GREY_DARK} />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>検索条件</Text>
        <View style={styles.headerRight} />
      </View>

      {/* Top Action Buttons */}
      <View style={styles.topActions}>
        <TouchableOpacity style={styles.actionButton} onPress={handleRecallFavorite}>
          <Text style={styles.actionButtonText}>お気に入り条件呼び出し</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.actionButton} onPress={handleReset}>
          <Text style={styles.actionButtonText}>リセット</Text>
        </TouchableOpacity>
      </View>

      {/* Search Criteria Sections */}
      <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
        {/* Basic Section */}
        <View style={styles.section}>
          <View style={styles.sectionHeader}>
            <View style={styles.sectionBar} />
            <Text style={styles.sectionTitle}>基本</Text>
          </View>
          {renderCriteriaRow('年齢', 'age', criteria.age)}
          {renderCriteriaRow('居住地', 'residence', criteria.residence)}
          {renderCriteriaRow('身長', 'height', criteria.height)}
          {renderCriteriaRow('体型', 'bodyType', criteria.bodyType)}
          {renderCriteriaRow('最終ログイン日', 'lastLogin', criteria.lastLogin)}
          {renderCriteriaRow('登録日', 'registrationDate', criteria.registrationDate)}
          {renderCriteriaRow('お相手のいいね! 数', 'partnerLikes', criteria.partnerLikes)}
        </View>

        {/* Profile Section */}
        <View style={styles.section}>
          <View style={styles.sectionHeader}>
            <View style={styles.sectionBar} />
            <Text style={styles.sectionTitle}>プロフィール</Text>
          </View>
          {renderCriteriaRow('出身地', 'hometown', criteria.hometown)}
          {renderCriteriaRow('タバコ', 'smoking', criteria.smoking)}
          {renderCriteriaRow('お酒', 'drinking', criteria.drinking)}
        </View>

        {/* Occupation Section */}
        <View style={styles.section}>
          <View style={styles.sectionHeader}>
            <View style={styles.sectionBar} />
            <Text style={styles.sectionTitle}>職業</Text>
          </View>
          {renderCriteriaRow('学歴', 'education', criteria.education)}
          {renderCriteriaRow('職業', 'occupation', criteria.occupation)}
          {renderCriteriaRow('年収', 'income', criteria.income)}
          {renderCriteriaRow('休日', 'daysOff', criteria.daysOff)}
        </View>

        {/* Refine Section */}
        <View style={styles.section}>
          <View style={styles.sectionHeader}>
            <View style={styles.sectionBar} />
            <Text style={styles.sectionTitle}>絞り込み</Text>
          </View>
          {renderCriteriaRow('自己紹介文', 'selfIntroduction', criteria.selfIntroduction)}
          {renderCriteriaRow('サブ写真', 'subPhotos', criteria.subPhotos)}
        </View>
      </ScrollView>

      {/* Bottom Actions */}
      <View style={styles.bottomActions}>
        <TouchableOpacity
          style={styles.checkboxContainer}
          onPress={() => setSaveAsFavorite(!saveAsFavorite)}
        >
          <View style={[styles.checkbox, saveAsFavorite && styles.checkboxChecked]}>
            {saveAsFavorite && <Ionicons name="checkmark" size={16} color={COLORS.WHITE} />}
          </View>
          <Text style={styles.checkboxLabel}>お気に入り条件として保存</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.searchButton} onPress={handleSearch}>
          <Text style={styles.searchButtonText}>検索する</Text>
        </TouchableOpacity>
      </View>

      {/* Bottom Navigation */}
      <View style={styles.bottomNav}>
        <TouchableOpacity style={styles.navItem}>
          <Ionicons name="search" size={24} color={COLORS.PURPLE_PRIMARY} />
        </TouchableOpacity>
        <TouchableOpacity
          style={styles.navItem}
          onPress={() => router.push({ pathname: '/home', params: { email } })}
        >
          <View style={styles.navItemWithBadge}>
            <Ionicons name="thumbs-up" size={24} color={COLORS.GREY_MEDIUM} />
            <View style={styles.badge} />
          </View>
        </TouchableOpacity>
        <TouchableOpacity
          style={styles.navItem}
          onPress={() => router.push({ pathname: '/home', params: { email } })}
        >
          <Ionicons name="eye" size={24} color={COLORS.GREY_MEDIUM} />
        </TouchableOpacity>
        <TouchableOpacity
          style={styles.navItem}
          onPress={() => router.push({ pathname: '/home', params: { email } })}
        >
          <Ionicons name="chatbubbles" size={24} color={COLORS.GREY_MEDIUM} />
        </TouchableOpacity>
        <TouchableOpacity
          style={styles.navItem}
          onPress={() => router.push({ pathname: '/home', params: { email } })}
        >
          <View style={styles.navItemWithBadge}>
            <Ionicons name="person" size={24} color={COLORS.GREY_MEDIUM} />
            <View style={styles.badge} />
          </View>
        </TouchableOpacity>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.WHITE,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingTop: 15,
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
    width: 24,
  },
  topActions: {
    flexDirection: 'row',
    paddingHorizontal: 20,
    paddingVertical: 15,
    gap: 10,
    backgroundColor: COLORS.WHITE,
    borderBottomWidth: 1,
    borderBottomColor: COLORS.GREY_LIGHT,
  },
  actionButton: {
    flex: 1,
    paddingVertical: 12,
    paddingHorizontal: 15,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: COLORS.GREY_MEDIUM,
    alignItems: 'center',
  },
  actionButtonText: {
    fontSize: 14,
    color: COLORS.GREY_DARK,
    fontFamily: 'NotoSansJP_400Regular',
  },
  content: {
    flex: 1,
  },
  section: {
    backgroundColor: COLORS.WHITE,
    paddingVertical: 15,
    borderBottomWidth: 1,
    borderBottomColor: COLORS.GREY_LIGHT,
  },
  sectionHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 20,
    marginBottom: 10,
  },
  sectionBar: {
    width: 4,
    height: 20,
    backgroundColor: COLORS.PURPLE_PRIMARY,
    marginRight: 10,
  },
  sectionTitle: {
    fontSize: 16,
    color: COLORS.GREY_DARK,
    fontFamily: 'NotoSansJP_700Bold',
  },
  criteriaRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingVertical: 15,
    borderBottomWidth: 1,
    borderBottomColor: COLORS.GREY_LIGHT,
  },
  criteriaLabel: {
    fontSize: 14,
    color: COLORS.GREY_DARK,
    fontFamily: 'NotoSansJP_400Regular',
    flex: 1,
  },
  criteriaValueContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  criteriaValue: {
    fontSize: 14,
    color: COLORS.GREY_MEDIUM,
    fontFamily: 'NotoSansJP_400Regular',
  },
  bottomActions: {
    padding: 20,
    backgroundColor: COLORS.WHITE,
    borderTopWidth: 1,
    borderTopColor: COLORS.GREY_LIGHT,
  },
  checkboxContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 15,
  },
  checkbox: {
    width: 20,
    height: 20,
    borderRadius: 4,
    borderWidth: 2,
    borderColor: COLORS.GREY_MEDIUM,
    marginRight: 10,
    alignItems: 'center',
    justifyContent: 'center',
  },
  checkboxChecked: {
    backgroundColor: COLORS.PURPLE_PRIMARY,
    borderColor: COLORS.PURPLE_PRIMARY,
  },
  checkboxLabel: {
    fontSize: 14,
    color: COLORS.GREY_DARK,
    fontFamily: 'NotoSansJP_400Regular',
  },
  searchButton: {
    width: '100%',
    paddingVertical: 18,
    borderRadius: 30,
    backgroundColor: COLORS.PURPLE_PRIMARY,
    alignItems: 'center',
    justifyContent: 'center',
  },
  searchButtonText: {
    fontSize: 16,
    color: COLORS.WHITE,
    fontFamily: 'NotoSansJP_700Bold',
  },
  bottomNav: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    alignItems: 'center',
    paddingVertical: 10,
    paddingBottom: 30,
    backgroundColor: COLORS.WHITE,
    borderTopWidth: 1,
    borderTopColor: COLORS.GREY_LIGHT,
  },
  navItem: {
    alignItems: 'center',
    justifyContent: 'center',
  },
  navItemWithBadge: {
    position: 'relative',
  },
  badge: {
    position: 'absolute',
    top: -2,
    right: -2,
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: '#FF0000',
  },
});

