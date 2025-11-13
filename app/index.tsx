import React, { useEffect, useRef } from 'react';
import { StyleSheet, Text, View, TouchableOpacity, Animated, Easing } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import { useFonts, NotoSansJP_400Regular, NotoSansJP_700Bold } from '@expo-google-fonts/noto-sans-jp';

export default function LoginScreen() {
  const router = useRouter();
  
  let [fontsLoaded] = useFonts({
    NotoSansJP_400Regular,
    NotoSansJP_700Bold,
  });

  const rotateAnim = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    const rotate = () => {
      rotateAnim.setValue(0);
      Animated.timing(rotateAnim, {
        toValue: 1,
        duration: 10000,
        easing: Easing.linear,
        useNativeDriver: true,
      }).start(() => rotate());
    };
    rotate();
  }, [rotateAnim]);

  const rotation = rotateAnim.interpolate({
    inputRange: [0, 1],
    outputRange: ['360deg', '0deg'],
  });

  if (!fontsLoaded) {
    return null; // or a loading component
  }

  return (
    <View style={styles.container}>
      {/* Top Section: Logo/Branding */}
      <View style={styles.logoContainer}>
        <Animated.Image 
          source={require('@/assets/images/logo.png')} 
          style={[styles.logo, { transform: [{ rotate: rotation }] }]}
          resizeMode="contain"
        />
        <Text style={styles.appName}>Mochila</Text>
      </View>

      {/* Middle Section: Action/Information */}
      <View style={styles.mainContent}>
        <TouchableOpacity 
          style={styles.signInButton}
          onPress={() => router.push('/email-signin')}
        >
          <Ionicons name="mail-outline" style={styles.mailIcon} />
          <Text style={styles.signInButtonText}>メールアドレスでサインイン</Text>
        </TouchableOpacity>

        <Text style={styles.infoText}>※18歳未満の方はご登録いただけません。</Text>
        <TouchableOpacity onPress={() => alert('サポートにご連絡ください')}>
          <Text style={styles.infoText}>
            サインイン・新規登録でお困りの方
          </Text>
        </TouchableOpacity>
      </View>

      {/* Bottom Section: Footer */}
      <View style={styles.footer}>
        <TouchableOpacity onPress={() => alert('利用規約')}>
          <Text style={styles.footerLink}>利用規約</Text>
        </TouchableOpacity>
        <Text style={styles.footerSeparator}> | </Text>
        <TouchableOpacity onPress={() => alert('プライバシーポリシー')}>
          <Text style={styles.footerLink}>プライバシーポリシー</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#ffffff',
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 20,
  },
  logoContainer: {
    alignItems: 'center',
    marginBottom: 100,
  },
  appName: {
    fontSize: 55,
    fontWeight: 'bold',
    color: '#6758E8',
    marginTop: 0,
    letterSpacing: 1,
    fontFamily: 'NotoSansJP_700Bold',
  },
  mainContent: {
    alignItems: 'center',
    width: '100%',
    marginBottom: 120,
  },
  signInButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#ffffff',
    borderColor: '#4A4A4A',
    borderWidth: 1,
    borderRadius: 30,
    paddingVertical: 18,
    paddingHorizontal: 30,
    width: '100%',
    maxWidth: 300,
    marginLeft: 'auto',
    marginRight: 'auto',
    height: 47,
    marginBottom: 30,
    elevation: 1,
    paddingLeft: 15,
    paddingRight: 15,
    gap: 20,
  },
  mailIcon: {
    fontSize: 24,
    color: '#4A4A4A',
  },
  signInButtonText: {
    fontSize: 15,
    color: '#4A4A4A',
    fontWeight: '700',
    fontFamily: 'NotoSansJP_700Bold',
  },
  infoText: {
    fontSize: 10,
    color: '#6758E8',
    textAlign: 'center',
    lineHeight: 15,
    fontFamily: 'NotoSansJP_400Regular',
  },
  footer: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    position: 'absolute',
    bottom: 30,
  },
  footerLink: {
    fontSize: 10,
    color: '#6758E8',
    fontFamily: 'NotoSansJP_400Regular',
  },
  footerSeparator: {
    fontSize: 10,
    color: '#6758E8',
    marginHorizontal: 8,
    fontFamily: 'NotoSansJP_400Regular',
  },
  logo: {
    width: 193,
    height: 193,
  },
});
