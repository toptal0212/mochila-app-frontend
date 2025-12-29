import React, { useState, useEffect } from 'react';
import { StyleSheet, Text, View, TouchableOpacity, ScrollView, Image, Dimensions } from 'react-native';
import { useRouter, useLocalSearchParams } from 'expo-router';
import { useFonts, NotoSansJP_400Regular, NotoSansJP_700Bold } from '@expo-google-fonts/noto-sans-jp';
import { Ionicons } from '@expo/vector-icons';
import { COLORS } from '@/constants/colors';
import { getMemberProfile, getUserProfile } from '@/utils/api';
import { getDisplayAge } from '@/utils/helpers';

const { width: SCREEN_WIDTH } = Dimensions.get('window');

export default function ProfileDetailScreen() {
  const router = useRouter();
  const params = useLocalSearchParams();
  const email = params.email as string;
  const memberId = params.memberId as string;
  const [profile, setProfile] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [selectedPhotoIndex, setSelectedPhotoIndex] = useState(0);

  let [fontsLoaded] = useFonts({
    NotoSansJP_400Regular,
    NotoSansJP_700Bold,
  });

  useEffect(() => {
    loadProfile();
  }, [memberId]);

  const loadProfile = async () => {
    setLoading(true);
    try {
      // Get current user ID if email is provided
      let viewerId: string | undefined;
      if (email) {
        const userProfile = await getUserProfile(email);
        if (userProfile && (userProfile as any).id) {
          viewerId = (userProfile as any).id;
        }
      }
      
      const data = await getMemberProfile(memberId, viewerId);
      setProfile(data);
    } catch (error) {
      console.error('Error loading profile:', error);
    } finally {
      setLoading(false);
    }
  };

  if (!fontsLoaded || loading) {
    return (
      <View style={styles.loadingContainer}>
        <Text style={styles.loadingText}>読み込み中...</Text>
      </View>
    );
  }

  if (!profile) {
    return (
      <View style={styles.loadingContainer}>
        <Text style={styles.loadingText}>プロフィールが見つかりません</Text>
      </View>
    );
  }

  const photos = profile.photos || [profile.profilePhotoUrl].filter(Boolean);

  return (
    <ScrollView style={styles.container} showsVerticalScrollIndicator={false}>
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity onPress={() => router.back()}>
          <Ionicons name="chevron-back" size={24} color={COLORS.GREY_DARK} />
        </TouchableOpacity>
        <TouchableOpacity>
          <Ionicons name="ellipsis-horizontal" size={24} color={COLORS.GREY_DARK} />
        </TouchableOpacity>
      </View>

      {/* Main Photo */}
      <View style={styles.photoSection}>
        <Image
          source={{ uri: photos[selectedPhotoIndex] || 'https://via.placeholder.com/400' }}
          style={styles.mainPhoto}
          resizeMode="cover"
        />
        <View style={styles.matchBadge}>
          <Text style={styles.matchBadgeText}>マッチ度 {profile.matchRate || 0}%</Text>
        </View>
      </View>

      {/* Photo Thumbnails */}
      {photos.length > 1 && (
        <ScrollView
          horizontal
          showsHorizontalScrollIndicator={false}
          style={styles.thumbnailsContainer}
          contentContainerStyle={styles.thumbnailsContent}
        >
          {photos.map((photo: string, index: number) => (
            <TouchableOpacity
              key={index}
              style={[
                styles.thumbnail,
                selectedPhotoIndex === index && styles.thumbnailSelected,
              ]}
              onPress={() => setSelectedPhotoIndex(index)}
            >
              <Image 
                source={{ uri: photo, cache: 'force-cache' }} 
                style={styles.thumbnailImage} 
                resizeMode="cover"
                onError={() => console.log('Thumbnail load error')}
              />
            </TouchableOpacity>
          ))}
        </ScrollView>
      )}

      {/* User Info */}
      <View style={styles.userInfo}>
        <View style={styles.userHeader}>
          <View style={styles.userBasic}>
            <Text style={styles.userName}>{profile.displayName || 'ユーザー'}</Text>
            <Text style={styles.userAgeLocation}>
              {getDisplayAge(profile) || '未設定'}歳/{profile.region}
            </Text>
          </View>
          <View style={styles.onlineStatus}>
            <View style={[styles.statusDot, { backgroundColor: profile.isOnline ? '#4CAF50' : '#999' }]} />
            <Text style={styles.onlineText}>{profile.isOnline ? 'オンライン' : 'オフライン'}</Text>
          </View>
        </View>
        <TouchableOpacity style={styles.likeButton}>
          <Ionicons name="heart" size={20} color="#FF6B9D" />
          <Text style={styles.likeButtonText}>いいね!?</Text>
        </TouchableOpacity>
      </View>

      {/* Interests */}
      {profile.interests && profile.interests.length > 0 && (
        <View style={styles.section}>
          <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.interestsContainer}>
            {profile.interests.map((interest: string, index: number) => (
              <View key={index} style={styles.interestTag}>
                <Text style={styles.interestText}>{interest}</Text>
              </View>
            ))}
          </ScrollView>
          {profile.videoCallOk && (
            <TouchableOpacity style={styles.videoCallButton}>
              <Text style={styles.videoCallText}>ビデオ通話OK</Text>
            </TouchableOpacity>
          )}
        </View>
      )}

      {/* Self Introduction */}
      {profile.selfIntroduction && (
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>自己紹介文</Text>
          <Text style={styles.sectionContent}>{profile.selfIntroduction}</Text>
        </View>
      )}

      {/* Appearance & Inner Self */}
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>外見・内面</Text>
        <View style={styles.infoRow}>
          <Text style={styles.infoLabel}>身長</Text>
          <Text style={styles.infoValue}>{profile.height || '未設定'}</Text>
        </View>
        <View style={styles.infoRow}>
          <Text style={styles.infoLabel}>体型</Text>
          <Text style={styles.infoValue}>{profile.bodyType || '未設定'}</Text>
        </View>
        {profile.charmPoints && profile.charmPoints.length > 0 && (
          <View style={styles.infoRow}>
            <Text style={styles.infoLabel}>チャームポイント</Text>
            <Text style={styles.infoValue}>{profile.charmPoints.join('、')}</Text>
          </View>
        )}
        {profile.personality && profile.personality.length > 0 && (
          <View style={styles.infoRow}>
            <Text style={styles.infoLabel}>性格・タイプ</Text>
            <Text style={styles.infoValue}>{profile.personality.join('、')}</Text>
          </View>
        )}
      </View>

      {/* Basic Information */}
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>基本情報</Text>
        <View style={styles.infoRow}>
          <Text style={styles.infoLabel}>居住地</Text>
          <Text style={styles.infoValue}>{profile.region || '未設定'}</Text>
        </View>
        {profile.hometown && (
          <View style={styles.infoRow}>
            <Text style={styles.infoLabel}>出身地</Text>
            <Text style={styles.infoValue}>{profile.hometown}</Text>
          </View>
        )}
        <View style={styles.infoRow}>
          <Text style={styles.infoLabel}>使用言語</Text>
          <Text style={styles.infoValue}>{profile.languages?.join('、') || '日本語'}</Text>
        </View>
        {profile.bloodType && (
          <View style={styles.infoRow}>
            <Text style={styles.infoLabel}>血液型</Text>
            <Text style={styles.infoValue}>{profile.bloodType}</Text>
          </View>
        )}
        {profile.siblings && (
          <View style={styles.infoRow}>
            <Text style={styles.infoLabel}>兄弟姉妹</Text>
            <Text style={styles.infoValue}>{profile.siblings}</Text>
          </View>
        )}
      </View>

      {/* Occupation & Education */}
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>職業・学歴</Text>
        {profile.occupation && (
          <View style={styles.infoRow}>
            <Text style={styles.infoLabel}>職業</Text>
            <Text style={styles.infoValue}>{profile.occupation}</Text>
          </View>
        )}
        {profile.income && (
          <View style={styles.infoRow}>
            <Text style={styles.infoLabel}>年収</Text>
            <Text style={styles.infoValue}>{profile.income}</Text>
          </View>
        )}
        {profile.education && (
          <View style={styles.infoRow}>
            <Text style={styles.infoLabel}>学歴</Text>
            <Text style={styles.infoValue}>{profile.education}</Text>
          </View>
        )}
      </View>

      {/* Action Buttons */}
      <View style={styles.actionButtons}>
        <TouchableOpacity style={styles.likeActionButton}>
          <Ionicons name="heart" size={28} color={COLORS.WHITE} />
        </TouchableOpacity>
        <TouchableOpacity style={styles.messageActionButton}>
          <Ionicons name="mail" size={28} color={COLORS.WHITE} />
        </TouchableOpacity>
      </View>
    </ScrollView>
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
  },
  photoSection: {
    width: SCREEN_WIDTH,
    height: SCREEN_WIDTH,
    position: 'relative',
  },
  mainPhoto: {
    width: '100%',
    height: '100%',
    backgroundColor: COLORS.GREY_LIGHT,
  },
  matchBadge: {
    position: 'absolute',
    bottom: 20,
    right: 20,
    backgroundColor: 'rgba(0, 0, 0, 0.6)',
    paddingHorizontal: 15,
    paddingVertical: 8,
    borderRadius: 20,
  },
  matchBadgeText: {
    fontSize: 14,
    color: COLORS.WHITE,
    fontFamily: 'NotoSansJP_700Bold',
  },
  thumbnailsContainer: {
    maxHeight: 100,
    backgroundColor: COLORS.WHITE,
  },
  thumbnailsContent: {
    paddingHorizontal: 10,
    paddingVertical: 10,
    gap: 10,
  },
  thumbnail: {
    width: 80,
    height: 80,
    borderRadius: 8,
    overflow: 'hidden',
    borderWidth: 2,
    borderColor: 'transparent',
  },
  thumbnailSelected: {
    borderColor: COLORS.PURPLE_PRIMARY,
  },
  thumbnailImage: {
    width: '100%',
    height: '100%',
  },
  userInfo: {
    padding: 20,
    backgroundColor: COLORS.WHITE,
  },
  userHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: 15,
  },
  userBasic: {
    flex: 1,
  },
  userName: {
    fontSize: 24,
    color: COLORS.GREY_DARK,
    fontFamily: 'NotoSansJP_700Bold',
    marginBottom: 5,
  },
  userAgeLocation: {
    fontSize: 16,
    color: COLORS.GREY_MEDIUM,
    fontFamily: 'NotoSansJP_400Regular',
  },
  onlineStatus: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 5,
  },
  statusDot: {
    width: 10,
    height: 10,
    borderRadius: 5,
  },
  onlineText: {
    fontSize: 14,
    color: COLORS.GREY_MEDIUM,
    fontFamily: 'NotoSansJP_400Regular',
  },
  likeButton: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FFE5E5',
    paddingHorizontal: 20,
    paddingVertical: 10,
    borderRadius: 20,
    alignSelf: 'flex-start',
    gap: 5,
  },
  likeButtonText: {
    fontSize: 16,
    color: '#FF6B9D',
    fontFamily: 'NotoSansJP_400Regular',
  },
  section: {
    padding: 20,
    backgroundColor: COLORS.WHITE,
    borderTopWidth: 1,
    borderTopColor: COLORS.GREY_LIGHT,
  },
  sectionTitle: {
    fontSize: 18,
    color: COLORS.GREY_DARK,
    fontFamily: 'NotoSansJP_700Bold',
    marginBottom: 15,
  },
  sectionContent: {
    fontSize: 14,
    color: COLORS.GREY_DARK,
    fontFamily: 'NotoSansJP_400Regular',
    lineHeight: 24,
  },
  interestsContainer: {
    marginBottom: 15,
  },
  interestTag: {
    paddingHorizontal: 15,
    paddingVertical: 8,
    borderRadius: 20,
    borderWidth: 1,
    borderColor: '#FF6B9D',
    marginRight: 10,
    backgroundColor: COLORS.WHITE,
  },
  interestText: {
    fontSize: 14,
    color: '#FF6B9D',
    fontFamily: 'NotoSansJP_400Regular',
  },
  videoCallButton: {
    alignSelf: 'flex-start',
    backgroundColor: '#FFE5E5',
    paddingHorizontal: 20,
    paddingVertical: 10,
    borderRadius: 20,
    marginTop: 10,
  },
  videoCallText: {
    fontSize: 14,
    color: '#FF6B9D',
    fontFamily: 'NotoSansJP_400Regular',
  },
  infoRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: 12,
  },
  infoLabel: {
    fontSize: 14,
    color: COLORS.GREY_MEDIUM,
    fontFamily: 'NotoSansJP_400Regular',
    width: 120,
  },
  infoValue: {
    fontSize: 14,
    color: COLORS.GREY_DARK,
    fontFamily: 'NotoSansJP_400Regular',
    flex: 1,
    textAlign: 'right',
  },
  actionButtons: {
    flexDirection: 'row',
    justifyContent: 'center',
    padding: 20,
    gap: 20,
    backgroundColor: COLORS.WHITE,
    paddingBottom: 40,
  },
  likeActionButton: {
    width: 70,
    height: 70,
    borderRadius: 35,
    backgroundColor: '#FF0000',
    alignItems: 'center',
    justifyContent: 'center',
  },
  messageActionButton: {
    width: 70,
    height: 70,
    borderRadius: 35,
    backgroundColor: '#FFC107',
    alignItems: 'center',
    justifyContent: 'center',
  },
});

