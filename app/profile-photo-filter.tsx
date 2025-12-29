import React, { useState } from 'react';
import { StyleSheet, Text, View, TouchableOpacity, Image, ScrollView, Dimensions, SafeAreaView } from 'react-native';
import { useRouter, useLocalSearchParams } from 'expo-router';
import { useFonts, NotoSansJP_400Regular, NotoSansJP_700Bold } from '@expo-google-fonts/noto-sans-jp';
import { COLORS } from '@/constants/colors';

const { width: SCREEN_WIDTH } = Dimensions.get('window');

// Filter configurations using color overlays and opacity
// Since React Native doesn't support CSS filters, we use color tints and opacity
const FILTER_CONFIGS = {
  original: { 
    overlayColor: null, 
    overlayOpacity: 0,
    imageOpacity: 1,
  },
  clear: { 
    overlayColor: 'rgba(255, 255, 255, 0.15)', // Slight white overlay for brightness
    overlayOpacity: 0.15,
    imageOpacity: 1,
  },
  creamy: { 
    overlayColor: 'rgba(255, 248, 220, 0.25)', // Warm creamy overlay
    overlayOpacity: 0.25,
    imageOpacity: 0.95,
  },
  cool: { 
    overlayColor: 'rgba(173, 216, 230, 0.2)', // Cool blue overlay
    overlayOpacity: 0.2,
    imageOpacity: 0.98,
  },
  hot: { 
    overlayColor: 'rgba(255, 140, 0, 0.15)', // Warm orange overlay
    overlayOpacity: 0.15,
    imageOpacity: 1.05,
  },
};

export default function ProfilePhotoFilterScreen() {
  const router = useRouter();
  const params = useLocalSearchParams();
  const email = params.email as string;
  const imageUri = params.imageUri as string;
  const returnTo = params.returnTo as string;
  const [selectedFilter, setSelectedFilter] = useState('original');
  const [currentTab, setCurrentTab] = useState<'filter' | 'edit'>('filter');

  let [fontsLoaded] = useFonts({
    NotoSansJP_400Regular,
    NotoSansJP_700Bold,
  });

  if (!fontsLoaded) {
    return null;
  }

  const filters = [
    { id: 'original', name: 'オリジナル' },
    { id: 'clear', name: 'クリア' },
    { id: 'creamy', name: 'クリーミー' },
    { id: 'cool', name: 'クール' },
    { id: 'hot', name: 'ホット' },
  ];

  const getFilterStyle = (filterId: string) => {
    const config = FILTER_CONFIGS[filterId as keyof typeof FILTER_CONFIGS];
    return config;
  };

  const handleNext = () => {
    router.push({
      pathname: '/profile-photo-complete',
      params: { email, imageUri, filter: selectedFilter, returnTo },
    });
  };

  const handleCancel = () => {
    router.back();
  };

  const handleEditTab = () => {
    setCurrentTab('edit');
    // TODO: Implement edit functionality
    alert('編集機能は現在開発中です');
  };

  return (
    <SafeAreaView style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity onPress={handleCancel}>
          <Text style={styles.cancelText}>キャンセル</Text>
        </TouchableOpacity>
        <TouchableOpacity onPress={handleNext}>
          <Text style={styles.doneText}>完了</Text>
        </TouchableOpacity>
      </View>

      {/* Main Image with Filter */}
      <View style={styles.imageContainer}>
        <Image 
          source={{ uri: imageUri }} 
          style={[styles.image, { opacity: getFilterStyle(selectedFilter).imageOpacity }]} 
          resizeMode="cover" 
        />
        {getFilterStyle(selectedFilter).overlayColor && (
          <View 
            style={[
              styles.filterOverlay, 
              { backgroundColor: getFilterStyle(selectedFilter).overlayColor || 'transparent' }
            ]} 
          />
        )}
      </View>

      {/* Filter Thumbnails */}
      {currentTab === 'filter' && (
        <ScrollView
          horizontal
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={styles.filtersContainer}
          style={styles.filtersScroll}
        >
          {filters.map((filter) => (
            <TouchableOpacity
              key={filter.id}
              style={styles.filterItem}
              onPress={() => setSelectedFilter(filter.id)}
            >
              <View
                style={[
                  styles.filterThumbnail,
                  selectedFilter === filter.id && styles.filterThumbnailSelected,
                ]}
              >
                <Image 
                  source={{ uri: imageUri }} 
                  style={[
                    styles.filterThumbnailImage,
                    { opacity: getFilterStyle(filter.id).imageOpacity }
                  ]} 
                />
                {getFilterStyle(filter.id).overlayColor && (
                  <View 
                    style={[
                      StyleSheet.absoluteFill,
                      { backgroundColor: getFilterStyle(filter.id).overlayColor || 'transparent' }
                    ]} 
                  />
                )}
              </View>
              <Text
                style={[
                  styles.filterLabel,
                  selectedFilter === filter.id && styles.filterLabelSelected,
                ]}
              >
                {filter.name}
              </Text>
            </TouchableOpacity>
          ))}
        </ScrollView>
      )}

      {/* Edit Mode Placeholder */}
      {currentTab === 'edit' && (
        <View style={styles.editContainer}>
          <Text style={styles.editPlaceholder}>編集機能は現在開発中です</Text>
        </View>
      )}

      {/* Bottom Navigation */}
      <View style={styles.bottomNav}>
        <TouchableOpacity 
          style={styles.navTab}
          onPress={() => setCurrentTab('filter')}
        >
          <Text style={[styles.navTabText, currentTab === 'filter' && styles.navTabActive]}>
            フィルター
          </Text>
          {currentTab === 'filter' && <View style={styles.navTabIndicator} />}
        </TouchableOpacity>
        <TouchableOpacity 
          style={styles.navTab}
          onPress={handleEditTab}
        >
          <Text style={[styles.navTabText, currentTab === 'edit' && styles.navTabActive]}>
            編集
          </Text>
          {currentTab === 'edit' && <View style={styles.navTabIndicator} />}
        </TouchableOpacity>
      </View>

      {/* Fixed Completion Button for Mobile */}
      {/* <View style={styles.fixedButtonContainer}>
        <TouchableOpacity style={styles.completeButton} onPress={handleNext}>
          <Text style={styles.completeButtonText}>完了</Text>
        </TouchableOpacity>
      </View> */}
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.BLACK,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingTop: 60,
    paddingHorizontal: 20,
    paddingBottom: 20,
  },
  cancelText: {
    fontSize: 16,
    color: COLORS.WHITE,
    fontFamily: 'NotoSansJP_400Regular',
  },
  doneText: {
    fontSize: 16,
    color: COLORS.WHITE,
    fontFamily: 'NotoSansJP_400Regular',
  },
  imageContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: COLORS.BLACK,
    overflow: 'hidden',
    position: 'relative',
  },
  filterOverlay: {
    position: 'absolute',
    width: SCREEN_WIDTH,
    height: SCREEN_WIDTH,
    pointerEvents: 'none',
  },
  image: {
    width: SCREEN_WIDTH,
    height: SCREEN_WIDTH,
  },
  editContainer: {
    height: 150,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: COLORS.GREY_DARK,
  },
  editPlaceholder: {
    fontSize: 14,
    color: COLORS.WHITE,
    fontFamily: 'NotoSansJP_400Regular',
  },
  filtersScroll: {
    maxHeight: 150,
  },
  filtersContainer: {
    paddingHorizontal: 20,
    paddingVertical: 20,
    gap: 15,
  },
  filterItem: {
    alignItems: 'center',
    marginRight: 10,
  },
  filterThumbnail: {
    width: 80,
    height: 80,
    borderRadius: 8,
    overflow: 'hidden',
    borderWidth: 2,
    borderColor: 'transparent',
  },
  filterThumbnailSelected: {
    borderColor: COLORS.WHITE,
  },
  filterThumbnailImage: {
    width: '100%',
    height: '100%',
  },
  filterLabel: {
    fontSize: 12,
    color: COLORS.GREY_MEDIUM,
    fontFamily: 'NotoSansJP_400Regular',
    marginTop: 8,
  },
  filterLabelSelected: {
    color: COLORS.WHITE,
    fontFamily: 'NotoSansJP_700Bold',
  },
  bottomNav: {
    flexDirection: 'row',
    borderTopWidth: 1,
    borderTopColor: COLORS.GREY_DARK,
    paddingTop: 10,
    paddingBottom: 30,
  },
  navTab: {
    flex: 1,
    alignItems: 'center',
  },
  navTabText: {
    fontSize: 14,
    color: COLORS.GREY_MEDIUM,
    fontFamily: 'NotoSansJP_400Regular',
  },
  navTabActive: {
    color: COLORS.WHITE,
    fontFamily: 'NotoSansJP_700Bold',
  },
  navTabIndicator: {
    width: 30,
    height: 2,
    backgroundColor: COLORS.WHITE,
    marginTop: 5,
  },
  fixedButtonContainer: {
    position: 'absolute',
    bottom: 120,
    left: 0,
    right: 0,
    paddingHorizontal: 40,
    alignItems: 'center',
  },
  completeButton: {
    width: '100%',
    maxWidth: 300,
    paddingVertical: 16,
    backgroundColor: COLORS.TEAL_PRIMARY,
    borderRadius: 30,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 8,
  },
  completeButtonText: {
    fontSize: 16,
    color: COLORS.WHITE,
    fontFamily: 'NotoSansJP_700Bold',
  },
});

