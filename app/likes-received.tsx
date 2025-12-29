import React, { useState, useEffect } from 'react';
import { StyleSheet, Text, View, TouchableOpacity, ScrollView, Image, Dimensions } from 'react-native';
import { useRouter, useLocalSearchParams } from 'expo-router';
import { useFonts, NotoSansJP_400Regular, NotoSansJP_700Bold } from '@expo-google-fonts/noto-sans-jp';
import { Ionicons } from '@expo/vector-icons';
import { COLORS } from '@/constants/colors';
import { getLikesReceived, addLike, getUserProfile } from '@/utils/api';
import { getDisplayAge } from '@/utils/helpers';

const { width: SCREEN_WIDTH } = Dimensions.get('window');

export default function LikesReceivedScreen() {
  const router = useRouter();
  const params = useLocalSearchParams();
  const email = params.email as string;
  const [likes, setLikes] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [currentUserId, setCurrentUserId] = useState<string | null>(null);

  let [fontsLoaded] = useFonts({
    NotoSansJP_400Regular,
    NotoSansJP_700Bold,
  });

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    setLoading(true);
    try {
      // Get current user profile to get user ID
      const userProfile = await getUserProfile(email);
      if (userProfile && (userProfile as any).id) {
        setCurrentUserId((userProfile as any).id);
        
        // Load likes received
        const likesData = await getLikesReceived((userProfile as any).id);
        
        // Format likes data with date grouping
        const formattedLikes = likesData.map((like: any) => {
          const date = new Date(like.timestamp);
          const dateStr = `${date.getMonth() + 1}/${date.getDate()} (${['日', '月', '火', '水', '木', '金', '土'][date.getDay()]})`;
          const timeStr = `${date.getHours().toString().padStart(2, '0')}:${date.getMinutes().toString().padStart(2, '0')}`;
          
          return {
            id: like.user?.id || like.fromUserId,
            displayName: like.user?.displayName || 'ユーザー',
            age: getDisplayAge(like.user),
            region: like.user?.region || '',
            height: like.user?.height || '',
            occupation: like.user?.occupation || '',
            profilePhotoUrl: like.user?.profilePhotoUrl,
            matchRate: like.user?.matchRate || 0,
            timestamp: timeStr,
            date: dateStr,
          };
        });
        
        setLikes(formattedLikes);
      }
    } catch (error) {
      console.error('Error loading likes:', error);
    } finally {
      setLoading(false);
    }
  };

  if (!fontsLoaded) {
    return null;
  }

  const handleLike = async (userId: string) => {
    if (!currentUserId) return;
    
    try {
      const success = await addLike(currentUserId, userId);
      if (success) {
        alert('いいね！を送りました');
        // Reload data
        loadData();
      }
    } catch (error) {
      console.error('Error adding like:', error);
      alert('いいね！の送信に失敗しました');
    }
  };

  const handleProfilePress = (userId: string) => {
    router.push({
      pathname: '/profile-detail',
      params: { email, memberId: userId },
    });
  };

  const handleSkipView = () => {
    // TODO: Navigate to skipped users
    alert('スキップしたお相手を見る');
  };

  return (
    <View style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity onPress={() => router.back()}>
          <Ionicons name="chevron-back" size={24} color={COLORS.GREY_DARK} />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>お相手から</Text>
        <TouchableOpacity>
          <Ionicons name="menu" size={24} color={COLORS.GREY_DARK} />
        </TouchableOpacity>
      </View>

      {/* Yellow Banner */}
      <View style={styles.yellowBanner}>
        <Text style={styles.bannerText}>ハイライト表示で注目度をUPさせよう!</Text>
        <TouchableOpacity style={styles.bannerButton}>
          <Text style={styles.bannerButtonText}>詳細</Text>
        </TouchableOpacity>
      </View>

      {/* Content */}
      <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
        {loading ? (
          <View style={styles.emptyState}>
            <Text style={styles.emptyTextSecondary}>読み込み中...</Text>
          </View>
        ) : likes.length === 0 ? (
          <View style={styles.emptyState}>
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
              あなたに「いいね!」をしている
            </Text>
            <Text style={styles.emptyTextSecondary}>
              新着のお相手はいません
            </Text>
            <TouchableOpacity style={styles.skipButton} onPress={handleSkipView}>
              <Text style={styles.skipButtonText}>スキップしたお相手を見る</Text>
            </TouchableOpacity>
          </View>
        ) : (
          <View style={styles.likesList}>
            {likes.map((like, index) => (
              <View key={like.id}>
                {index > 0 && likes[index - 1].date !== like.date && (
                  <View style={styles.dateSeparator}>
                    <View style={styles.dateLine} />
                    <Text style={styles.dateText}>{like.date}</Text>
                    <View style={styles.dateLine} />
                  </View>
                )}
                {index === 0 && (
                  <View style={styles.dateSeparator}>
                    <View style={styles.dateLine} />
                    <Text style={styles.dateText}>{like.date}</Text>
                    <View style={styles.dateLine} />
                  </View>
                )}
                <TouchableOpacity
                  style={styles.likeCard}
                  onPress={() => handleProfilePress(like.id)}
                  activeOpacity={0.7}
                >
                  <View style={styles.photoContainer}>
                    <Image
                      source={{ 
                        uri: like.profilePhotoUrl || 'https://via.placeholder.com/200',
                        cache: 'force-cache'
                      }}
                      style={styles.photo}
                      resizeMode="cover"
                      onError={() => console.log('Image load error for like:', like.id)}
                    />
                    <View style={styles.matchBadge}>
                      <Text style={styles.matchBadgeText}>{like.matchRate}%</Text>
                    </View>
                  </View>
                  <View style={styles.infoContainer}>
                    <Text style={styles.userInfo}>
                      {like.age}歳 {like.region}
                    </Text>
                    <Text style={styles.userDetails}>
                      {like.height} {like.occupation}
                    </Text>
                    <TouchableOpacity
                      style={styles.likeButton}
                      onPress={(e) => {
                        e.stopPropagation();
                        handleLike(like.id);
                      }}
                    >
                      <Ionicons name="thumbs-up" size={20} color={COLORS.WHITE} />
                      <Text style={styles.likeButtonText}>いいね!</Text>
                    </TouchableOpacity>
                  </View>
                  <Text style={styles.timestamp}>{like.timestamp}</Text>
                </TouchableOpacity>
              </View>
            ))}
          </View>
        )}
      </ScrollView>

      {/* Bottom Yellow Banner */}
      <View style={styles.bottomBanner}>
        <TouchableOpacity style={styles.closeButton}>
          <Ionicons name="close" size={20} color={COLORS.GREY_DARK} />
        </TouchableOpacity>
        <View style={styles.bottomBannerContent}>
          <Text style={styles.bottomBannerText}>
            プッシュ通知をオンにしましょう!{'\n'}いいね!が届いた時に、いち早くお知らせします
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
        <TouchableOpacity style={styles.navItem}>
          <Ionicons name="thumbs-up" size={24} color={COLORS.PURPLE_PRIMARY} />
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
          <View style={styles.navItemWithBadge}>
            <Ionicons name="chatbubbles" size={24} color={COLORS.GREY_MEDIUM} />
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
    paddingTop: 15,
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
    backgroundColor: '#FFEB3B',
    paddingHorizontal: 15,
    paddingVertical: 12,
  },
  bannerText: {
    fontSize: 14,
    color: COLORS.GREY_DARK,
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
    color: COLORS.GREY_DARK,
    fontFamily: 'NotoSansJP_400Regular',
  },
  content: {
    flex: 1,
  },
  emptyState: {
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
  skipButton: {
    marginTop: 30,
    paddingHorizontal: 20,
    paddingVertical: 12,
    borderRadius: 20,
    backgroundColor: COLORS.GREY_LIGHT,
  },
  skipButtonText: {
    fontSize: 14,
    color: COLORS.GREY_DARK,
    fontFamily: 'NotoSansJP_400Regular',
  },
  likesList: {
    padding: 15,
  },
  dateSeparator: {
    flexDirection: 'row',
    alignItems: 'center',
    marginVertical: 15,
    gap: 10,
  },
  dateLine: {
    flex: 1,
    height: 1,
    backgroundColor: COLORS.GREY_LIGHT,
  },
  dateText: {
    fontSize: 12,
    color: COLORS.GREY_MEDIUM,
    fontFamily: 'NotoSansJP_400Regular',
  },
  likeCard: {
    flexDirection: 'row',
    backgroundColor: COLORS.WHITE,
    borderRadius: 12,
    padding: 15,
    marginBottom: 15,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  photoContainer: {
    position: 'relative',
    marginRight: 15,
  },
  photo: {
    width: 100,
    height: 100,
    borderRadius: 8,
    backgroundColor: COLORS.GREY_LIGHT,
  },
  matchBadge: {
    position: 'absolute',
    bottom: 5,
    left: 5,
    backgroundColor: 'rgba(255, 107, 157, 0.9)',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 12,
  },
  matchBadgeText: {
    fontSize: 12,
    color: COLORS.WHITE,
    fontFamily: 'NotoSansJP_700Bold',
  },
  infoContainer: {
    flex: 1,
    justifyContent: 'space-between',
  },
  userInfo: {
    fontSize: 16,
    color: COLORS.GREY_DARK,
    fontFamily: 'NotoSansJP_400Regular',
    marginBottom: 5,
  },
  userDetails: {
    fontSize: 14,
    color: COLORS.GREY_MEDIUM,
    fontFamily: 'NotoSansJP_400Regular',
    marginBottom: 10,
  },
  likeButton: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FFB6C1',
    paddingHorizontal: 20,
    paddingVertical: 12,
    borderRadius: 25,
    alignSelf: 'flex-start',
    gap: 8,
  },
  likeButtonText: {
    fontSize: 16,
    color: COLORS.WHITE,
    fontFamily: 'NotoSansJP_700Bold',
  },
  timestamp: {
    fontSize: 12,
    color: COLORS.GREY_MEDIUM,
    fontFamily: 'NotoSansJP_400Regular',
    position: 'absolute',
    top: 15,
    right: 15,
  },
  bottomBanner: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FFEB3B',
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
    color: COLORS.GREY_DARK,
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
    color: COLORS.GREY_DARK,
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

