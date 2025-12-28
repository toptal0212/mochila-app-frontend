import React from 'react';
import { StyleSheet, Text, View, TouchableOpacity, ScrollView } from 'react-native';
import { useRouter, useLocalSearchParams } from 'expo-router';
import { useFonts, NotoSansJP_400Regular, NotoSansJP_700Bold } from '@expo-google-fonts/noto-sans-jp';
import { Ionicons } from '@expo/vector-icons';
import { COLORS } from '@/constants/colors';

export default function MessagesScreen() {
  const router = useRouter();
  const params = useLocalSearchParams();
  const email = params.email as string;

  let [fontsLoaded] = useFonts({
    NotoSansJP_400Regular,
    NotoSansJP_700Bold,
  });

  if (!fontsLoaded) {
    return null;
  }

  return (
    <View style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity onPress={() => router.back()}>
          <Ionicons name="chevron-back" size={24} color={COLORS.GREY_DARK} />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>メッセージ</Text>
        <TouchableOpacity>
          <Ionicons name="filter" size={24} color={COLORS.GREY_DARK} />
        </TouchableOpacity>
      </View>

      {/* Yellow Banner */}
      <View style={styles.yellowBanner}>
        <Text style={styles.bannerText}>ハイライト表示で注目度をUPさせよう!</Text>
        <TouchableOpacity style={styles.bannerButton}>
          <Text style={styles.bannerButtonText}>詳細</Text>
        </TouchableOpacity>
      </View>

      {/* Maintenance Message */}
      <View style={styles.maintenanceContainer}>
        <View style={styles.emptyIcon}>
          <Ionicons name="person" size={60} color={COLORS.GREY_MEDIUM} />
        </View>
        <View style={styles.emptyButton}>
          <Ionicons name="heart" size={24} color={COLORS.WHITE} />
          <Text style={styles.emptyButtonText}>いいね!</Text>
        </View>
        <Text style={styles.emptyTextPrimary}>
          気になるお相手の方へいいね!をしましょう
        </Text>
        <Text style={styles.emptyTextSecondary}>
          現在マッチングが成立している
        </Text>
        <Text style={styles.emptyTextSecondary}>
          お相手の方はいません
        </Text>
        <View style={styles.maintenanceBox}>
          <Text style={styles.maintenanceText}>メンテナンス中</Text>
        </View>
      </View>

      {/* Bottom Yellow Banner */}
      <View style={styles.bottomBanner}>
        <TouchableOpacity style={styles.closeButton}>
          <Ionicons name="close" size={20} color={COLORS.GREY_DARK} />
        </TouchableOpacity>
        <View style={styles.bottomBannerContent}>
          <Text style={styles.bottomBannerText}>
            プッシュ通知をオンにしましょう!{'\n'}マッチングが成立した時に、いち早くお知らせします
          </Text>
        </View>
        <TouchableOpacity style={styles.settingsButton}>
          <Text style={styles.settingsButtonText}>設定</Text>
        </TouchableOpacity>
      </View>

      {/* Bottom Navigation */}
      <View style={styles.bottomNav}>
        <TouchableOpacity
          style={styles.navItem}
          onPress={() => router.push({ pathname: '/search', params: { email } })}
        >
          <Ionicons name="search" size={24} color={COLORS.GREY_MEDIUM} />
        </TouchableOpacity>
        <TouchableOpacity
          style={styles.navItem}
          onPress={() => router.push({ pathname: '/likes-received', params: { email } })}
        >
          <Ionicons name="thumbs-up" size={24} color={COLORS.GREY_MEDIUM} />
        </TouchableOpacity>
        <TouchableOpacity
          style={styles.navItem}
          onPress={() => router.push({ pathname: '/footprints', params: { email } })}
        >
          <Ionicons name="eye" size={24} color={COLORS.GREY_MEDIUM} />
        </TouchableOpacity>
        <TouchableOpacity style={styles.navItem}>
          <View style={styles.navItemWithBadge}>
            <Ionicons name="chatbubbles" size={24} color={COLORS.PURPLE_PRIMARY} />
            <View style={styles.badge} />
          </View>
        </TouchableOpacity>
        <TouchableOpacity
          style={styles.navItem}
          onPress={() => router.push({ pathname: '/profile-settings', params: { email } })}
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
    paddingTop: 60,
    paddingHorizontal: 20,
    paddingBottom: 15,
    backgroundColor: COLORS.WHITE,
  },
  headerTitle: {
    fontSize: 18,
    color: COLORS.GREY_DARK,
    fontFamily: 'NotoSansJP_700Bold',
  },
  yellowBanner: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    backgroundColor: COLORS.PURPLE_PRIMARY,
    paddingHorizontal: 15,
    paddingVertical: 12,
  },
  bannerText: {
    fontSize: 14,
    color: COLORS.WHITE,
    fontFamily: 'NotoSansJP_400Regular',
    flex: 1,
  },
  bannerButton: {
    paddingHorizontal: 15,
    paddingVertical: 6,
    borderRadius: 15,
    borderWidth: 1,
    borderColor: COLORS.WHITE,
  },
  bannerButtonText: {
    fontSize: 12,
    color: COLORS.WHITE,
    fontFamily: 'NotoSansJP_400Regular',
  },
  maintenanceContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingVertical: 60,
  },
  emptyIcon: {
    width: 100,
    height: 100,
    borderRadius: 12,
    backgroundColor: COLORS.GREY_LIGHT,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 20,
  },
  emptyButton: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FF6B9D',
    paddingHorizontal: 30,
    paddingVertical: 15,
    borderRadius: 25,
    marginBottom: 30,
    gap: 8,
  },
  emptyButtonText: {
    fontSize: 16,
    color: COLORS.WHITE,
    fontFamily: 'NotoSansJP_700Bold',
  },
  emptyTextPrimary: {
    fontSize: 16,
    color: '#FF6B9D',
    fontFamily: 'NotoSansJP_400Regular',
    textAlign: 'center',
    marginBottom: 10,
  },
  emptyTextSecondary: {
    fontSize: 14,
    color: COLORS.GREY_MEDIUM,
    fontFamily: 'NotoSansJP_400Regular',
    textAlign: 'center',
    marginBottom: 5,
  },
  maintenanceBox: {
    marginTop: 40,
    paddingHorizontal: 30,
    paddingVertical: 15,
    backgroundColor: COLORS.GREY_LIGHT,
    borderRadius: 10,
  },
  maintenanceText: {
    fontSize: 18,
    color: COLORS.GREY_DARK,
    fontFamily: 'NotoSansJP_700Bold',
    textAlign: 'center',
  },
  bottomBanner: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: COLORS.PURPLE_PRIMARY,
    paddingHorizontal: 15,
    paddingVertical: 12,
    gap: 10,
  },
  closeButton: {
    width: 24,
    height: 24,
    borderRadius: 12,
    backgroundColor: COLORS.WHITE,
    alignItems: 'center',
    justifyContent: 'center',
  },
  bottomBannerContent: {
    flex: 1,
  },
  bottomBannerText: {
    fontSize: 12,
    color: COLORS.WHITE,
    fontFamily: 'NotoSansJP_400Regular',
    lineHeight: 18,
  },
  settingsButton: {
    paddingHorizontal: 15,
    paddingVertical: 6,
    borderRadius: 15,
    borderWidth: 1,
    borderColor: COLORS.WHITE,
  },
  settingsButtonText: {
    fontSize: 12,
    color: COLORS.WHITE,
    fontFamily: 'NotoSansJP_400Regular',
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

