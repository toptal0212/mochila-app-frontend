import React, { useState, useEffect } from 'react';
import { StyleSheet, Text, View, TouchableOpacity, ScrollView, Image, Dimensions } from 'react-native';
import { useRouter, useLocalSearchParams } from 'expo-router';
import { useFonts, NotoSansJP_400Regular, NotoSansJP_700Bold } from '@expo-google-fonts/noto-sans-jp';
import { Ionicons } from '@expo/vector-icons';
import { COLORS } from '@/constants/colors';
import { getMembersList } from '@/utils/api';

const { width: SCREEN_WIDTH } = Dimensions.get('window');
const CARD_WIDTH = (SCREEN_WIDTH - 40 - 10) / 2; // 2 columns with padding and gap

export default function HomeScreen() {
  const router = useRouter();
  const params = useLocalSearchParams();
  const email = params.email as string;
  const [activeTab, setActiveTab] = useState('popular');
  const [members, setMembers] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  let [fontsLoaded] = useFonts({
    NotoSansJP_400Regular,
    NotoSansJP_700Bold,
  });

  useEffect(() => {
    loadMembers();
  }, [activeTab]);

  const loadMembers = async () => {
    setLoading(true);
    try {
      const data = await getMembersList(activeTab, email);
      console.log(`Loaded ${data?.length || 0} members from API (excluding current user)`);
      setMembers(data || []);
    } catch (error) {
      console.error('Error loading members:', error);
      setMembers([]);
    } finally {
      setLoading(false);
    }
  };

  if (!fontsLoaded) {
    return null;
  }

  const tabs = [
    { id: 'popular', label: '人気メンバー' },
    { id: 'login', label: 'ログイン順' },
    { id: 'recommended', label: 'おすすめ順' },
    { id: 'new', label: '新メンバー' },
    { id: 'keyword', label: 'キーワード' },
  ];

  const handleProfilePress = (memberId: string) => {
    router.push({
      pathname: '/profile-detail',
      params: { email, memberId },
    });
  };

  return (
    <View style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <View style={styles.headerLeft}>
          <Ionicons name="thumbs-up" size={24} color={COLORS.PURPLE_PRIMARY} />
          <Text style={styles.likeCount}>130</Text>
        </View>
        <Text style={styles.appName}>Mochila</Text>
        <TouchableOpacity>
          <Ionicons name="filter" size={24} color={COLORS.GREY_DARK} />
        </TouchableOpacity>
      </View>

      {/* Tabs */}
      <ScrollView
        horizontal
        showsHorizontalScrollIndicator={false}
        style={styles.tabsContainer}
        contentContainerStyle={styles.tabsContent}
      >
        {tabs.map((tab) => (
          <TouchableOpacity
            key={tab.id}
            style={[styles.tab, activeTab === tab.id && styles.tabActive]}
            onPress={() => setActiveTab(tab.id)}
          >
            <Text
              style={[
                styles.tabText,
                activeTab === tab.id && styles.tabTextActive,
              ]}
            >
              {tab.label}
            </Text>
            {activeTab === tab.id && <View style={styles.tabIndicator} />}
          </TouchableOpacity>
        ))}
      </ScrollView>

      {/* Member Grid */}
      {loading ? (
        <View style={styles.loadingContainer}>
          <Text style={styles.loadingText}>読み込み中...</Text>
        </View>
      ) : (
        <ScrollView style={styles.content} contentContainerStyle={styles.gridContainer}>
          {members.map((member) => (
            <TouchableOpacity
              key={member.id}
              style={styles.memberCard}
              onPress={() => handleProfilePress(member.id)}
              activeOpacity={0.7}
            >
              <Image
                source={{ 
                  uri: member.profilePhotoUrl || 'https://via.placeholder.com/200',
                  cache: 'force-cache'
                }}
                style={styles.memberPhoto}
                resizeMode="cover"
                onError={() => console.log('Image load error for member:', member.id)}
              />
              <View style={styles.memberInfo}>
                <View style={styles.memberLocation}>
                  <View style={[styles.statusDot, { backgroundColor: member.isOnline ? '#4CAF50' : '#FFC107' }]} />
                  <Text style={styles.memberText}>
                    {member.age ? `${member.age}歳` : ''} {member.region || '未設定'}
                  </Text>
                </View>
                <View style={styles.memberStats}>
                  <View style={styles.statItem}>
                    <Ionicons name="thumbs-up" size={12} color={COLORS.GREY_MEDIUM} />
                    <Text style={styles.statText}>{member.likes || 0}</Text>
                  </View>
                  <View style={styles.statItem}>
                    <Ionicons name="eye" size={12} color={COLORS.GREY_MEDIUM} />
                    <Text style={styles.statText}>{member.views || 0}</Text>
                  </View>
                  <View style={styles.statItem}>
                    <Ionicons name="heart" size={12} color="#FF6B9D" />
                    <Text style={[styles.statText, styles.matchText]}>{member.matchRate || 0}%</Text>
                  </View>
                </View>
              </View>
            </TouchableOpacity>
          ))}
        </ScrollView>
      )}

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
          <View style={styles.navItemWithBadge}>
            <Ionicons name="thumbs-up" size={24} color={COLORS.GREY_MEDIUM} />
            <View style={styles.badge} />
          </View>
        </TouchableOpacity>
        <TouchableOpacity
          style={styles.navItem}
          onPress={() => router.push({ pathname: '/footprints', params: { email } })}
        >
          <Ionicons name="eye" size={24} color={COLORS.GREY_MEDIUM} />
        </TouchableOpacity>
        <TouchableOpacity
          style={styles.navItem}
          onPress={() => router.push({ pathname: '/messages', params: { email } })}
        >
          <Ionicons name="chatbubbles" size={24} color={COLORS.GREY_MEDIUM} />
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
    paddingTop: 10,
    paddingHorizontal: 20,
    paddingBottom: 15,
    backgroundColor: COLORS.WHITE,
    borderBottomWidth: 1,
    borderBottomColor: COLORS.GREY_LIGHT,
  },
  headerLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 5,
  },
  likeCount: {
    fontSize: 16,
    color: COLORS.PURPLE_PRIMARY,
    fontFamily: 'NotoSansJP_700Bold',
  },
  appName: {
    fontSize: 20,
    color: COLORS.PURPLE_PRIMARY,
    fontFamily: 'NotoSansJP_700Bold',
  },
  tabsContainer: {
    backgroundColor: COLORS.WHITE,
    borderBottomWidth: 1,
    borderBottomColor: COLORS.GREY_LIGHT,
    maxHeight: Math.min(48, Dimensions.get('window').height * 0.1),
  },
  tabsContent: {
    paddingHorizontal: 10,
    paddingVertical: 10,
    gap: 15,
  },
  tab: {
    paddingHorizontal: 12,
    paddingVertical: 8,
    marginRight: 5,
  },
  tabActive: {
    borderBottomWidth: 2,
    borderBottomColor: COLORS.PURPLE_PRIMARY,
  },
  tabText: {
    fontSize: 14,
    color: COLORS.GREY_MEDIUM,
    fontFamily: 'NotoSansJP_400Regular',
  },
  tabTextActive: {
    color: COLORS.PURPLE_PRIMARY,
    fontFamily: 'NotoSansJP_700Bold',
  },
  tabIndicator: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    height: 2,
    backgroundColor: COLORS.PURPLE_PRIMARY,
  },
  content: {
    flex: 1,
  },
  gridContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    padding: 10,
    gap: 10,
  },
  memberCard: {
    width: CARD_WIDTH,
    borderRadius: 12,
    overflow: 'hidden',
    backgroundColor: COLORS.WHITE,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
    marginBottom: 10,
  },
  memberPhoto: {
    width: '100%',
    height: CARD_WIDTH * 1.2,
    backgroundColor: COLORS.GREY_LIGHT,
  },
  memberInfo: {
    padding: 10,
  },
  memberLocation: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 8,
    gap: 5,
  },
  statusDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
  },
  memberText: {
    fontSize: 12,
    color: COLORS.GREY_DARK,
    fontFamily: 'NotoSansJP_400Regular',
  },
  memberStats: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  statItem: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  statText: {
    fontSize: 10,
    color: COLORS.GREY_MEDIUM,
    fontFamily: 'NotoSansJP_400Regular',
  },
  matchText: {
    color: '#FF6B9D',
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  loadingText: {
    fontSize: 14,
    color: COLORS.GREY_MEDIUM,
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

