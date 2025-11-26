import React, { useState } from 'react';
import { StyleSheet, Text, View, TouchableOpacity, Image, ScrollView, Dimensions } from 'react-native';
import { useRouter, useLocalSearchParams } from 'expo-router';
import { useFonts, NotoSansJP_400Regular, NotoSansJP_700Bold } from '@expo-google-fonts/noto-sans-jp';
import { COLORS } from '@/constants/colors';

const { width: SCREEN_WIDTH } = Dimensions.get('window');

export default function ProfilePhotoFilterScreen() {
  const router = useRouter();
  const params = useLocalSearchParams();
  const email = params.email as string;
  const imageUri = params.imageUri as string;
  const [selectedFilter, setSelectedFilter] = useState('original');

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

  const handleNext = () => {
    router.push({
      pathname: '/profile-photo-complete',
      params: { email, imageUri, filter: selectedFilter },
    });
  };

  const handleCancel = () => {
    router.back();
  };

  return (
    <View style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity onPress={handleCancel}>
          <Text style={styles.cancelText}>キャンセル</Text>
        </TouchableOpacity>
        <TouchableOpacity onPress={handleNext}>
          <Text style={styles.doneText}>完了</Text>
        </TouchableOpacity>
      </View>

      {/* Main Image */}
      <View style={styles.imageContainer}>
        <Image source={{ uri: imageUri }} style={styles.image} resizeMode="cover" />
      </View>

      {/* Filter Thumbnails */}
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
              <Image source={{ uri: imageUri }} style={styles.filterThumbnailImage} />
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

      {/* Bottom Navigation */}
      <View style={styles.bottomNav}>
        <TouchableOpacity style={styles.navTab}>
          <Text style={[styles.navTabText, styles.navTabActive]}>フィルター</Text>
          <View style={styles.navTabIndicator} />
        </TouchableOpacity>
        <TouchableOpacity style={styles.navTab}>
          <Text style={styles.navTabText}>編集</Text>
        </TouchableOpacity>
      </View>
    </View>
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
  },
  image: {
    width: SCREEN_WIDTH,
    height: SCREEN_WIDTH,
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
});

