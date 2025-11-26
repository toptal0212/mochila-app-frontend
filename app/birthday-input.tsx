import React, { useState, useRef } from 'react';
import { StyleSheet, Text, View, TouchableOpacity, TextInput } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useRouter, useLocalSearchParams } from 'expo-router';
import { useFonts, NotoSansJP_400Regular, NotoSansJP_700Bold } from '@expo-google-fonts/noto-sans-jp';
import { COLORS } from '@/constants/colors';
import { saveUserProfile } from '@/utils/api';

export default function BirthdayInputScreen() {
  const router = useRouter();
  const params = useLocalSearchParams();
  const email = params.email as string;
  const [date, setDate] = useState(['', '', '', '', '', '', '', '']); // YYYY/MM/DD
  const [focusedIndex, setFocusedIndex] = useState(0);
  const inputRefs = useRef<(TextInput | null)[]>([]);

  let [fontsLoaded] = useFonts({
    NotoSansJP_400Regular,
    NotoSansJP_700Bold,
  });

  if (!fontsLoaded) {
    return null;
  }

  const handleKeypadPress = (value: string) => {
    if (focusedIndex < 8) {
      const newDate = [...date];
      newDate[focusedIndex] = value;
      setDate(newDate);
      
      // Auto-advance to next field
      if (focusedIndex === 3) {
        setFocusedIndex(5); // Skip the '/' position
      } else if (focusedIndex < 7) {
        setFocusedIndex(focusedIndex + 1);
      }
    }
  };

  const handleBackspace = () => {
    if (focusedIndex > 0) {
      const newDate = [...date];
      if (focusedIndex === 5) {
        setFocusedIndex(3);
        newDate[3] = '';
      } else {
        setFocusedIndex(focusedIndex - 1);
        newDate[focusedIndex - 1] = '';
      }
      setDate(newDate);
    }
  };

  const handleInputFocus = (index: number) => {
    setFocusedIndex(index);
  };

  const isDateValid = () => {
    const year = date.slice(0, 4).join('');
    const month = date.slice(4, 6).join('');
    const day = date.slice(6, 8).join('');
    return year.length === 4 && month.length === 2 && day.length === 2;
  };

  const handleNext = async () => {
    if (!isDateValid()) return;
    const year = date.slice(0, 4).join('');
    const month = date.slice(4, 6).join('');
    const day = date.slice(6, 8).join('');
    const birthday = `${year}/${month}/${day}`;
    
    // Save birthday to backend
    await saveUserProfile({
      email,
      birthday,
    });
    
    router.push({
      pathname: '/region-select',
      params: { email },
    });
  };

  const handleBack = () => {
    router.back();
  };

  const keypadData = [
    { number: '1', letters: '' },
    { number: '2', letters: 'ABC' },
    { number: '3', letters: 'DEF' },
    { number: '4', letters: 'GHI' },
    { number: '5', letters: 'JKL' },
    { number: '6', letters: 'MNO' },
    { number: '7', letters: 'PQRS' },
    { number: '8', letters: 'TUV' },
    { number: '9', letters: 'WXYZ' },
  ];

  return (
    <View style={styles.container}>
      {/* Title */}
      <Text style={styles.title}>あなたの誕生日を教えてください</Text>
      <Text style={styles.subtitle}>一度登録すると誕生日の変更はできません</Text>

      {/* Date Input */}
      <View style={styles.dateContainer}>
        {[0, 1, 2, 3].map((index) => (
          <TextInput
            key={`year-${index}`}
            ref={(ref: any) => (inputRefs.current[index] = ref)}
            style={[
              styles.dateInput,
              focusedIndex === index && styles.dateInputFocused
            ]}
            value={date[index]}
            onChangeText={(text) => {
              if (/^\d$/.test(text) || text === '') {
                const newDate = [...date];
                newDate[index] = text;
                setDate(newDate);
                if (text && index < 3) {
                  setFocusedIndex(index + 1);
                }
              }
            }}
            onFocus={() => handleInputFocus(index)}
            keyboardType="number-pad"
            maxLength={1}
            selectTextOnFocus
            showSoftInputOnFocus={false}
          />
        ))}
        <Text style={styles.separator}>/</Text>
        {[4, 5].map((index) => (
          <TextInput
            key={`month-${index}`}
            ref={(ref: any) => (inputRefs.current[index] = ref)}
            style={[
              styles.dateInput,
              focusedIndex === index && styles.dateInputFocused
            ]}
            value={date[index]}
            onChangeText={(text) => {
              if (/^\d$/.test(text) || text === '') {
                const newDate = [...date];
                newDate[index] = text;
                setDate(newDate);
                if (text && index < 5) {
                  setFocusedIndex(index + 1);
                }
              }
            }}
            onFocus={() => handleInputFocus(index)}
            keyboardType="number-pad"
            maxLength={1}
            selectTextOnFocus
            showSoftInputOnFocus={false}
          />
        ))}
        <Text style={styles.separator}>/</Text>
        {[6, 7].map((index) => (
          <TextInput
            key={`day-${index}`}
            ref={(ref: any) => (inputRefs.current[index] = ref)}
            style={[
              styles.dateInput,
              focusedIndex === index && styles.dateInputFocused
            ]}
            value={date[index]}
            onChangeText={(text) => {
              if (/^\d$/.test(text) || text === '') {
                const newDate = [...date];
                newDate[index] = text;
                setDate(newDate);
                if (text && index < 7) {
                  setFocusedIndex(index + 1);
                }
              }
            }}
            onFocus={() => handleInputFocus(index)}
            keyboardType="number-pad"
            maxLength={1}
            selectTextOnFocus
            showSoftInputOnFocus={false}
          />
        ))}
      </View>

      {/* Navigation Buttons */}
      <View style={styles.navigationContainer}>
        <TouchableOpacity style={styles.navButton} onPress={handleBack} activeOpacity={0.7}>
          <Ionicons name="chevron-back" size={24} color={COLORS.TEAL_DARK} />
        </TouchableOpacity>
        <TouchableOpacity
          style={[styles.navButtonNext, !isDateValid() && styles.navButtonDisabled]}
          onPress={handleNext}
          disabled={!isDateValid()}
          activeOpacity={0.7}
        >
          <Ionicons name="chevron-forward" size={24} color={COLORS.TEAL_DARK} />
        </TouchableOpacity>
      </View>

      {/* Numeric Keypad */}
      <View style={styles.keypadContainer}>
        <View style={styles.keypadRow}>
          {keypadData.slice(0, 3).map((btn) => (
            <TouchableOpacity
              key={btn.number}
              style={styles.keypadButton}
              onPress={() => handleKeypadPress(btn.number)}
            >
              <Text style={styles.keypadNumber}>{btn.number}</Text>
              {btn.letters && <Text style={styles.keypadLetters}>{btn.letters}</Text>}
            </TouchableOpacity>
          ))}
        </View>
        <View style={styles.keypadRow}>
          {keypadData.slice(3, 6).map((btn) => (
            <TouchableOpacity
              key={btn.number}
              style={styles.keypadButton}
              onPress={() => handleKeypadPress(btn.number)}
            >
              <Text style={styles.keypadNumber}>{btn.number}</Text>
              {btn.letters && <Text style={styles.keypadLetters}>{btn.letters}</Text>}
            </TouchableOpacity>
          ))}
        </View>
        <View style={styles.keypadRow}>
          {keypadData.slice(6, 9).map((btn) => (
            <TouchableOpacity
              key={btn.number}
              style={styles.keypadButton}
              onPress={() => handleKeypadPress(btn.number)}
            >
              <Text style={styles.keypadNumber}>{btn.number}</Text>
              {btn.letters && <Text style={styles.keypadLetters}>{btn.letters}</Text>}
            </TouchableOpacity>
          ))}
        </View>
        <View style={styles.keypadRow}>
          <View style={styles.keypadButton} />
          <TouchableOpacity
            style={styles.keypadButton}
            onPress={() => handleKeypadPress('0')}
          >
            <Text style={styles.keypadNumber}>0</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.keypadButton} onPress={handleBackspace}>
            <Ionicons name="backspace-outline" size={24} color={COLORS.GREY_DARK} />
          </TouchableOpacity>
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.WHITE,
    paddingHorizontal: 20,
    paddingTop: 60,
  },
  title: {
    fontSize: 20,
    color: COLORS.TEAL_DARK,
    fontFamily: 'NotoSansJP_700Bold',
    textAlign: 'center',
    marginBottom: 10,
  },
  subtitle: {
    fontSize: 14,
    color: COLORS.GREY_MEDIUM,
    fontFamily: 'NotoSansJP_400Regular',
    textAlign: 'center',
    marginBottom: 40,
  },
  dateContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 40,
    gap: 8,
  },
  dateInput: {
    width: 32,
    height: 50,
    borderBottomWidth: 2,
    borderBottomColor: COLORS.GREY_MEDIUM,
    fontSize: 24,
    textAlign: 'center',
    color: COLORS.GREY_DARK,
    fontFamily: 'NotoSansJP_700Bold',
  },
  dateInputFocused: {
    borderBottomColor: COLORS.TEAL_DARK,
    backgroundColor: COLORS.TEAL_LIGHT,
  },
  separator: {
    fontSize: 24,
    color: COLORS.GREY_DARK,
    fontFamily: 'NotoSansJP_700Bold',
    marginHorizontal: 4,
  },
  navigationContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingBottom: 20,
    paddingHorizontal: 10,
    position: 'absolute',
    left: '50%',
    transform: [{ translateX: '-50%' }],
    bottom: 300,
    width: '94%',
  },
  navButton: {
    width: 50,
    height: 50,
    borderRadius: 25,
    backgroundColor: COLORS.TEAL_LIGHT,
    alignItems: 'center',
    justifyContent: 'center',
  },
  navButtonNext: {
    width: 50,
    height: 50,
    borderRadius: 25,
    backgroundColor: COLORS.CYAN_LIGHT,
    alignItems: 'center',
    justifyContent: 'center',
  },
  navButtonDisabled: {
    opacity: 0.5,
  },
  keypadContainer: {
    backgroundColor: COLORS.GREY_LIGHT,
    paddingVertical: 15,
    paddingHorizontal: 12,
    borderTopWidth: 1,
    borderTopColor: '#E0E0E0',
    position: 'absolute',
    bottom: 0,
    left: 0,
    width: '100%'
  },
  keypadRow: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 8,
    gap: 8,
  },
  keypadButton: {
    flex: 1,
    height: 60,
    backgroundColor: COLORS.WHITE,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#E0E0E0',
    justifyContent: 'center',
    alignItems: 'center',
  },
  keypadNumber: {
    fontSize: 24,
    color: COLORS.BLACK,
    fontFamily: 'NotoSansJP_700Bold',
  },
  keypadLetters: {
    fontSize: 10,
    color: COLORS.GREY_MEDIUM,
    marginTop: 2,
  },
});

