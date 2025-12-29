import React, { useState, useEffect } from 'react';
import { StyleSheet, Text, View, TouchableOpacity, ScrollView, Image, Modal } from 'react-native';
import { useRouter, useLocalSearchParams, useFocusEffect } from 'expo-router';
import { useFonts, NotoSansJP_400Regular, NotoSansJP_700Bold } from '@expo-google-fonts/noto-sans-jp';
import { Ionicons } from '@expo/vector-icons';
import { COLORS } from '@/constants/colors';
import { getUserProfile } from '@/utils/api';
import { getDisplayAge } from '@/utils/helpers';
import * as ImagePicker from 'expo-image-picker';

export default function ProfileSettingsScreen() {
  const router = useRouter();
  const params = useLocalSearchParams();
  const email = params.email as string;
  const [profile, setProfile] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [photoModalVisible, setPhotoModalVisible] = useState(false);

  let [fontsLoaded] = useFonts({
    NotoSansJP_400Regular,
    NotoSansJP_700Bold,
  });

  useEffect(() => {
    loadProfile();
  }, []);

  // Reload profile when screen comes into focus (after editing photo)
  useFocusEffect(
    React.useCallback(() => {
      loadProfile();
    }, [])
  );

  const loadProfile = async () => {
    setLoading(true);
    try {
      const data = await getUserProfile(email);
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

  const menuItems = [
    { icon: 'person-outline', label: 'プロフィール編集', path: '/profile-edit' },
    { icon: 'settings-outline', label: '設定', path: '/settings' },
    { icon: 'help-circle-outline', label: 'ヘルプ・お問い合わせ', path: '/help' },
    { icon: 'document-text-outline', label: '利用規約', path: '/terms' },
    { icon: 'shield-checkmark-outline', label: 'プライバシーポリシー', path: '/privacy' },
    { icon: 'log-out-outline', label: 'ログアウト', action: 'logout' },
  ];

  const handleMenuItemPress = (item: any) => {
    if (item.action === 'logout') {
      // TODO: Implement logout
      alert('ログアウトしますか？');
    } else if (item.path) {
      router.push({
        pathname: item.path,
        params: { email },
      });
    }
  };

  const handleEditPhoto = () => {
    setPhotoModalVisible(true);
  };

  const handleSelectFromLibrary = async () => {
    const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();
    if (status !== 'granted') {
      alert('写真へのアクセス許可が必要です');
      return;
    }

    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ['images'],
      allowsEditing: true,
      aspect: [1, 1],
      quality: 1,
      base64: true, // Get base64 for web compatibility
    });

    if (!result.canceled && result.assets[0]) {
      setPhotoModalVisible(false);
      router.push({
        pathname: '/profile-photo-crop',
        params: { email, imageUri: result.assets[0].uri, returnTo: 'settings' },
      });
    }
  };

  const handleTakePhoto = async () => {
    const { status } = await ImagePicker.requestCameraPermissionsAsync();
    if (status !== 'granted') {
      alert('カメラへのアクセス許可が必要です');
      return;
    }

    const result = await ImagePicker.launchCameraAsync({
      allowsEditing: true,
      aspect: [1, 1],
      quality: 1,
      base64: true, // Get base64 for web compatibility
    });

    if (!result.canceled && result.assets[0]) {
      setPhotoModalVisible(false);
      router.push({
        pathname: '/profile-photo-crop',
        params: { email, imageUri: result.assets[0].uri, withGuide: 'true', returnTo: 'settings' },
      });
    }
  };

  return (
    <View style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity onPress={() => router.back()}>
          <Ionicons name="chevron-back" size={24} color={COLORS.GREY_DARK} />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>プロフィール</Text>
        <View style={styles.headerRight} />
      </View>

      <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
        {/* Profile Section */}
        <View style={styles.profileSection}>
          <View style={styles.profilePhotoContainer}>
            <Image
              source={{ 
                uri: profile?.profilePhotoUrl || 'https://via.placeholder.com/200',
                cache: 'force-cache'
              }}
              style={styles.profilePhoto}
              resizeMode="cover"
              onError={() => console.log('Profile photo load error')}
            />
            <TouchableOpacity style={styles.editPhotoButton} onPress={handleEditPhoto}>
              <Ionicons name="camera" size={20} color={COLORS.WHITE} />
            </TouchableOpacity>
          </View>
          <Text style={styles.profileName}>{profile?.displayName || 'ユーザー'}</Text>
          <Text style={styles.profileInfo}>
            {getDisplayAge(profile) || '未設定'}歳 / {profile?.region || '未設定'}
          </Text>
        </View>

        {/* Stats Section */}
        <View style={styles.statsSection}>
          <View style={styles.statItem}>
            <Text style={styles.statValue}>0</Text>
            <Text style={styles.statLabel}>いいね</Text>
          </View>
          <View style={styles.statDivider} />
          <View style={styles.statItem}>
            <Text style={styles.statValue}>0</Text>
            <Text style={styles.statLabel}>マッチ</Text>
          </View>
          <View style={styles.statDivider} />
          <View style={styles.statItem}>
            <Text style={styles.statValue}>0</Text>
            <Text style={styles.statLabel}>足あと</Text>
          </View>
        </View>

        {/* Menu Items */}
        <View style={styles.menuSection}>
          {menuItems.map((item, index) => (
            <TouchableOpacity
              key={index}
              style={styles.menuItem}
              onPress={() => handleMenuItemPress(item)}
              activeOpacity={0.7}
            >
              <Ionicons name={item.icon as any} size={24} color={COLORS.GREY_DARK} />
              <Text style={styles.menuItemText}>{item.label}</Text>
              <Ionicons name="chevron-forward" size={20} color={COLORS.GREY_MEDIUM} />
            </TouchableOpacity>
          ))}
        </View>

        {/* App Info */}
        <View style={styles.appInfoSection}>
          <Text style={styles.appInfoText}>Mochila v1.0.0</Text>
          <Text style={styles.appInfoText}>© 2026 Mochila</Text>
        </View>
      </ScrollView>

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
        <TouchableOpacity
          style={styles.navItem}
          onPress={() => router.push({ pathname: '/messages', params: { email } })}
        >
          <View style={styles.navItemWithBadge}>
            <Ionicons name="chatbubbles" size={24} color={COLORS.GREY_MEDIUM} />
            <View style={styles.badge} />
          </View>
        </TouchableOpacity>
        <TouchableOpacity style={styles.navItem}>
          <View style={styles.navItemWithBadge}>
            <Ionicons name="person" size={24} color={COLORS.PURPLE_PRIMARY} />
            <View style={styles.badge} />
          </View>
        </TouchableOpacity>
      </View>

      {/* Photo Selection Modal */}
      <Modal
        animationType="slide"
        transparent={true}
        visible={photoModalVisible}
        onRequestClose={() => setPhotoModalVisible(false)}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            <Text style={styles.modalTitle}>プロフィール写真を変更</Text>
            
            <TouchableOpacity
              style={styles.modalOption}
              onPress={handleTakePhoto}
              activeOpacity={0.7}
            >
              <Ionicons name="camera" size={24} color={COLORS.PURPLE_PRIMARY} />
              <Text style={styles.modalOptionText}>カメラで撮影</Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={styles.modalOption}
              onPress={handleSelectFromLibrary}
              activeOpacity={0.7}
            >
              <Ionicons name="images" size={24} color={COLORS.PURPLE_PRIMARY} />
              <Text style={styles.modalOptionText}>ライブラリから選択</Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={styles.modalCancelButton}
              onPress={() => setPhotoModalVisible(false)}
              activeOpacity={0.7}
            >
              <Text style={styles.modalCancelText}>キャンセル</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>
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
  headerRight: {
    width: 24,
  },
  content: {
    flex: 1,
  },
  profileSection: {
    alignItems: 'center',
    paddingVertical: 30,
    backgroundColor: COLORS.WHITE,
    borderBottomWidth: 1,
    borderBottomColor: COLORS.GREY_LIGHT,
  },
  profilePhotoContainer: {
    position: 'relative',
    marginBottom: 15,
  },
  profilePhoto: {
    width: 120,
    height: 120,
    borderRadius: 60,
    backgroundColor: COLORS.GREY_LIGHT,
  },
  editPhotoButton: {
    position: 'absolute',
    bottom: 0,
    right: 0,
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: COLORS.PURPLE_PRIMARY,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 3,
    borderColor: COLORS.WHITE,
  },
  profileName: {
    fontSize: 24,
    color: COLORS.GREY_DARK,
    fontFamily: 'NotoSansJP_700Bold',
    marginBottom: 5,
  },
  profileInfo: {
    fontSize: 16,
    color: COLORS.GREY_MEDIUM,
    fontFamily: 'NotoSansJP_400Regular',
  },
  statsSection: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    alignItems: 'center',
    paddingVertical: 20,
    backgroundColor: COLORS.WHITE,
    borderBottomWidth: 1,
    borderBottomColor: COLORS.GREY_LIGHT,
  },
  statItem: {
    alignItems: 'center',
    flex: 1,
  },
  statValue: {
    fontSize: 24,
    color: COLORS.PURPLE_PRIMARY,
    fontFamily: 'NotoSansJP_700Bold',
    marginBottom: 5,
  },
  statLabel: {
    fontSize: 14,
    color: COLORS.GREY_MEDIUM,
    fontFamily: 'NotoSansJP_400Regular',
  },
  statDivider: {
    width: 1,
    height: 40,
    backgroundColor: COLORS.GREY_LIGHT,
  },
  menuSection: {
    backgroundColor: COLORS.WHITE,
    marginTop: 10,
  },
  menuItem: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingVertical: 18,
    borderBottomWidth: 1,
    borderBottomColor: COLORS.GREY_LIGHT,
    gap: 15,
  },
  menuItemText: {
    flex: 1,
    fontSize: 16,
    color: COLORS.GREY_DARK,
    fontFamily: 'NotoSansJP_400Regular',
  },
  appInfoSection: {
    alignItems: 'center',
    paddingVertical: 30,
    backgroundColor: COLORS.WHITE,
  },
  appInfoText: {
    fontSize: 12,
    color: COLORS.GREY_MEDIUM,
    fontFamily: 'NotoSansJP_400Regular',
    marginBottom: 5,
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
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'flex-end',
  },
  modalContent: {
    backgroundColor: COLORS.WHITE,
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    paddingVertical: 30,
    paddingHorizontal: 20,
  },
  modalTitle: {
    fontSize: 18,
    color: COLORS.GREY_DARK,
    fontFamily: 'NotoSansJP_700Bold',
    textAlign: 'center',
    marginBottom: 25,
  },
  modalOption: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 18,
    paddingHorizontal: 20,
    backgroundColor: COLORS.PURPLE_PRIMARY,
    borderRadius: 12,
    marginBottom: 12,
    gap: 15,
  },
  modalOptionText: {
    fontSize: 16,
    color: COLORS.GREY_DARK,
    fontFamily: 'NotoSansJP_400Regular',
  },
  modalCancelButton: {
    paddingVertical: 15,
    alignItems: 'center',
    marginTop: 10,
  },
  modalCancelText: {
    fontSize: 16,
    color: COLORS.GREY_MEDIUM,
    fontFamily: 'NotoSansJP_400Regular',
  },
});

