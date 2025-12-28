import React, { useState, useRef, useEffect } from 'react';
import { StyleSheet, Text, View, TouchableOpacity, Animated, Modal, ScrollView } from 'react-native';
import { useRouter, useLocalSearchParams } from 'expo-router';
import { useFonts, NotoSansJP_400Regular, NotoSansJP_700Bold } from '@expo-google-fonts/noto-sans-jp';
import { GlobeIcon } from '@/components/GlobeIcon';
import { COLORS } from '@/constants/colors';

export default function ConsentScreen() {
  const router = useRouter();
  const params = useLocalSearchParams();
  const email = params.email as string;
  const [ageChecked, setAgeChecked] = useState(false);
  const [termsChecked, setTermsChecked] = useState(false);
  const [modalVisible, setModalVisible] = useState(false);
  const [modalMessage, setModalMessage] = useState('');
  const [termsModalVisible, setTermsModalVisible] = useState(false);
  const [privacyModalVisible, setPrivacyModalVisible] = useState(false);
  const hasNavigatedRef = useRef(false);

  const rotateAnim = useRef(new Animated.Value(0)).current;

  let [fontsLoaded] = useFonts({
    NotoSansJP_400Regular,
    NotoSansJP_700Bold,
  });

  // Validate email parameter only once
  useEffect(() => {
    if (!email) {
      console.error('Email parameter is missing in consent page');
      // Only redirect if we haven't navigated yet
      if (!hasNavigatedRef.current) {
        router.replace('/email-signin');
      }
    }
  }, []); // Empty dependency array - only run once

  if (!fontsLoaded || !email) {
    return null;
  }

  const handleProceed = () => {
    if (!ageChecked || !termsChecked) {
      setModalMessage('両方の項目に同意してください。');
      setModalVisible(true);
      return;
    }

    // Prevent multiple navigations using ref
    if (hasNavigatedRef.current) {
      console.log('Navigation already in progress, ignoring duplicate call');
      return;
    }

    hasNavigatedRef.current = true;
    
    // TODO: Save consent status and proceed to next screen
    console.log('Consent accepted, navigating to onboarding-1');
    // Navigate to onboarding intro screen with email
    router.push({
      pathname: '/onboarding-1',
      params: { email },
    });
  };

  const handleTermsPress = () => {
    setTermsModalVisible(true);
  };

  const handlePrivacyPress = () => {
    setPrivacyModalVisible(true);
  };

  const rotation = rotateAnim.interpolate({
    inputRange: [0, 1],
    outputRange: ['360deg', '0deg'],
  });

  return (
    <View style={styles.container}>
      {/* Globe Icon */}
      <Animated.Image 
          source={require('@/assets/images/logo.png')} 
          style={[styles.logo, { transform: [{ rotate: rotation }] }]}
          resizeMode="contain"
      />

      {/* Mochila Branding */}
      <Text style={styles.brandText}>Mochila</Text>

      {/* Checkboxes */}
      <View style={styles.checkboxContainer}>
        <TouchableOpacity
          style={styles.checkboxRow}
          onPress={() => setAgeChecked(!ageChecked)}
          activeOpacity={0.7}
        >
          <View style={[styles.checkbox, ageChecked && styles.checkboxChecked]}>
            {ageChecked && (
              <Text style={styles.checkmark}>✓</Text>
            )}
          </View>
          <Text style={styles.checkboxLabel}>私は18歳以上です。</Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={styles.checkboxRow}
          onPress={() => setTermsChecked(!termsChecked)}
          activeOpacity={0.7}
        >
          <View style={[styles.checkbox, termsChecked && styles.checkboxChecked]}>
            {termsChecked && (
              <Text style={styles.checkmark}>✓</Text>
            )}
          </View>
          <Text style={styles.checkboxLabel}>利用規約に同意します。</Text>
        </TouchableOpacity>
      </View>

      {/* Links */}
      <View style={styles.linksContainer}>
        <TouchableOpacity onPress={handleTermsPress}>
          <Text style={styles.linkText}>利用規約</Text>
        </TouchableOpacity>
        <Text style={styles.linkSeparator}> | </Text>
        <TouchableOpacity onPress={handlePrivacyPress}>
          <Text style={styles.linkText}>プライバシーポリシー</Text>
        </TouchableOpacity>
      </View>

      {/* Proceed Button */}
      <TouchableOpacity
        style={[
          styles.proceedButton,
          (!ageChecked || !termsChecked) && styles.proceedButtonDisabled
        ]}
        onPress={handleProceed}
        disabled={!ageChecked || !termsChecked}
      >
        <Text style={styles.proceedButtonText}>内容に同意して進む</Text>
      </TouchableOpacity>

      {/* Error Modal */}
      <Modal
        animationType="fade"
        transparent={true}
        visible={modalVisible}
        onRequestClose={() => setModalVisible(false)}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            <Text style={styles.modalTitle}>エラー</Text>
            <Text style={styles.modalMessage}>{modalMessage}</Text>
            <TouchableOpacity
              style={styles.modalButton}
              onPress={() => setModalVisible(false)}
            >
              <Text style={styles.modalButtonText}>OK</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>

      {/* Terms of Service Modal */}
      <Modal
        animationType="slide"
        transparent={true}
        visible={termsModalVisible}
        onRequestClose={() => setTermsModalVisible(false)}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.documentModalContent}>
            <View style={styles.documentModalHeader}>
              <Text style={styles.documentModalTitle}>利用規約</Text>
              <TouchableOpacity
                onPress={() => setTermsModalVisible(false)}
                style={styles.closeButton}
              >
                <Text style={styles.closeButtonText}>✕</Text>
              </TouchableOpacity>
            </View>
            <ScrollView style={styles.documentScrollView} showsVerticalScrollIndicator={true}>
              <Text style={styles.documentText}>
                <Text style={styles.documentSectionTitle}>第1条（適用）{'\n'}</Text>
                本規約は、本サービスの提供条件及び本サービスの利用に関する当社とユーザーとの間の権利義務関係を定めることを目的とし、ユーザーと当社との間の本サービスの利用に関わる一切の関係に適用されます。{'\n\n'}

                <Text style={styles.documentSectionTitle}>第2条（定義）{'\n'}</Text>
                本規約において使用する以下の用語は、各々以下に定める意味を有するものとします。{'\n'}
                (1) 「サービス利用契約」とは、本規約を契約条件として当社とユーザーの間で締結される、本サービスの利用契約を意味します。{'\n'}
                (2) 「知的財産権」とは、著作権、特許権、実用新案権、意匠権、商標権その他の知的財産権（それらの権利を取得し、またはそれらの権利につき登録等を出願する権利を含みます。）を意味します。{'\n'}
                (3) 「投稿データ」とは、ユーザーが本サービスを利用して投稿その他送信するコンテンツ（文章、画像、動画その他のデータを含みますがこれらに限りません。）を意味します。{'\n\n'}

                <Text style={styles.documentSectionTitle}>第3条（登録）{'\n'}</Text>
                1. 本サービスの利用を希望する者（以下「登録希望者」といいます。）は、本規約を遵守することに同意し、かつ当社の定める一定の情報（以下「登録事項」といいます。）を当社の定める方法で当社に提供することにより、当社に対し、本サービスの利用の登録を申請することができます。{'\n'}
                2. 当社は、当社の基準に従って、登録希望者の登録の可否を判断し、当社が登録を認める場合にはその旨を登録希望者に通知します。登録希望者のユーザーとしての登録は、当社が本項の通知を行ったことをもって完了したものとします。{'\n\n'}

                <Text style={styles.documentSectionTitle}>第4条（利用料金および支払方法）{'\n'}</Text>
                1. ユーザーは、本サービスの有料部分の対価として、当社が別途定め、本ウェブサイトに表示する利用料金を、当社が指定する支払方法により当社に支払うものとします。{'\n'}
                2. ユーザーが利用料金の支払を遅滞した場合、ユーザーは年14.6％の割合による遅延損害金を当社に支払うものとします。{'\n\n'}

                <Text style={styles.documentSectionTitle}>第5条（禁止事項）{'\n'}</Text>
                ユーザーは、本サービスの利用にあたり、以下の各号のいずれかに該当する行為または該当すると当社が判断する行為をしてはなりません。{'\n'}
                (1) 法令に違反する行為または犯罪行為に関連する行為{'\n'}
                (2) 当社、本サービスの他のユーザーまたはその他の第三者に対する詐欺または脅迫行為{'\n'}
                (3) 公序良俗に反する行為{'\n'}
                (4) 当社、本サービスの他のユーザーまたはその他の第三者の知的財産権、肖像権、プライバシーの権利、名誉、その他の権利または利益を侵害する行為{'\n'}
                (5) 本サービスを通じ、以下に該当し、または該当すると当社が判断する情報を当社または本サービスの他のユーザーに送信すること{'\n'}
                - 過度に暴力的または残虐な表現を含む情報{'\n'}
                - コンピューター・ウィルスその他の有害なコンピューター・プログラムを含む情報{'\n'}
                - 当社、本サービスの他のユーザーまたはその他の第三者の名誉または信用を毀損する表現を含む情報{'\n'}
                - 過度にわいせつな表現を含む情報{'\n'}
                - 差別を助長する表現を含む情報{'\n'}
                - 自殺、自傷行為を助長する表現を含む情報{'\n'}
                - 薬物の不適切な利用を助長する表現を含む情報{'\n'}
                - 反社会的な表現を含む情報{'\n'}
                - チェーンメール等の第三者への情報の拡散を求める情報{'\n'}
                - 他人に不快感を与える表現を含む情報{'\n\n'}

                <Text style={styles.documentSectionTitle}>第6条（本サービスの停止等）{'\n'}</Text>
                当社は、以下のいずれかに該当する場合には、ユーザーに事前に通知することなく、本サービスの全部または一部の提供を停止または中断することができるものとします。{'\n'}
                (1) 本サービスに係るコンピューター・システムの点検または保守作業を緊急に行う場合{'\n'}
                (2) コンピューター、通信回線等の障害、誤操作、過度なアクセスの集中、不正アクセス、ハッキング等により本サービスの運営ができなくなった場合{'\n'}
                (3) 地震、落雷、火災、風水害、停電、天災地変などの不可抗力により本サービスの運営ができなくなった場合{'\n'}
                (4) その他、当社が停止または中断を必要と判断した場合{'\n\n'}

                <Text style={styles.documentSectionTitle}>第7条（権利帰属）{'\n'}</Text>
                本サービスに関する知的財産権は全て当社または当社にライセンスを許諾している者に帰属しており、本規約に基づく本サービスの利用許諾は、本サービスに関する当社または当社にライセンスを許諾している者の知的財産権の使用許諾を意味するものではありません。{'\n\n'}

                <Text style={styles.documentSectionTitle}>第8条（登録抹消等）{'\n'}</Text>
                当社は、ユーザーが、以下の各号のいずれかの事由に該当する場合は、事前に通知または催告することなく、投稿データを削除しもしくは当該ユーザーについて本サービスの利用を一時的に停止し、またはユーザーとしての登録を抹消することができます。{'\n'}
                (1) 本規約のいずれかの条項に違反した場合{'\n'}
                (2) 登録事項に虚偽の事実があることが判明した場合{'\n'}
                (3) 支払停止もしくは支払不能となり、または破産手続開始、民事再生手続開始、会社更生手続開始、特別清算開始若しくはこれらに類する手続の開始の申立てがあった場合{'\n'}
                (4) 6ヶ月以上本サービスの利用がない場合{'\n'}
                (5) 当社からの問い合わせその他の回答を求める連絡に対して30日間以上応答がない場合{'\n'}
                (6) その他、当社が本サービスの利用またはユーザーとしての登録の継続を適当でないと判断した場合{'\n\n'}

                <Text style={styles.documentSectionTitle}>第9条（免責事項）{'\n'}</Text>
                当社は、本サービスに関して、ユーザーと他のユーザーまたは第三者との間において生じた取引、連絡または紛争等について一切責任を負いません。{'\n\n'}

                <Text style={styles.documentSectionTitle}>第10条（サービス内容の変更、終了）{'\n'}</Text>
                当社は、当社の都合により、本サービスの内容を変更し、または提供を終了することができます。当社が本サービスの提供を終了する場合、当社はユーザーに事前に通知するものとします。{'\n\n'}

                <Text style={styles.documentSectionTitle}>第11条（利用規約の変更）{'\n'}</Text>
                当社は、当社が必要と認めた場合は、本規約を変更できるものとします。本規約を変更する場合、変更後の本規約の施行時期および内容を当社ウェブサイト上での掲示その他の適切な方法により周知し、またはユーザーに通知します。{'\n\n'}

                <Text style={styles.documentSectionTitle}>第12条（準拠法および管轄裁判所）{'\n'}</Text>
                本規約の準拠法は日本法とし、本規約に起因し、または関連する一切の紛争については、東京地方裁判所を第一審の専属的合意管轄裁判所とします。{'\n\n'}

                以上{'\n\n'}
                制定日：2024年1月1日
              </Text>
            </ScrollView>
            <TouchableOpacity
              style={styles.documentModalButton}
              onPress={() => setTermsModalVisible(false)}
            >
              <Text style={styles.modalButtonText}>閉じる</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>

      {/* Privacy Policy Modal */}
      <Modal
        animationType="slide"
        transparent={true}
        visible={privacyModalVisible}
        onRequestClose={() => setPrivacyModalVisible(false)}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.documentModalContent}>
            <View style={styles.documentModalHeader}>
              <Text style={styles.documentModalTitle}>プライバシーポリシー</Text>
              <TouchableOpacity
                onPress={() => setPrivacyModalVisible(false)}
                style={styles.closeButton}
              >
                <Text style={styles.closeButtonText}>✕</Text>
              </TouchableOpacity>
            </View>
            <ScrollView style={styles.documentScrollView} showsVerticalScrollIndicator={true}>
              <Text style={styles.documentText}>
                当社は、ユーザーの個人情報について以下のとおりプライバシーポリシー（以下「本ポリシー」といいます）を定めます。{'\n\n'}

                <Text style={styles.documentSectionTitle}>1. 個人情報の収集{'\n'}</Text>
                当社は、ユーザーから以下の情報を取得します。{'\n'}
                • メールアドレス{'\n'}
                • 氏名（ニックネーム）{'\n'}
                • 生年月日{'\n'}
                • 性別{'\n'}
                • 写真{'\n'}
                • プロフィール情報（趣味、興味、旅行先の希望など）{'\n'}
                • 位置情報{'\n'}
                • 端末情報{'\n'}
                • Cookie及びこれに類する技術により取得した情報{'\n\n'}

                <Text style={styles.documentSectionTitle}>2. 個人情報の利用目的{'\n'}</Text>
                当社は、取得した個人情報を以下の目的で利用します。{'\n'}
                (1) 本サービスの提供、維持、保護及び改善のため{'\n'}
                (2) ユーザー登録の確認のため{'\n'}
                (3) マッチング機能の提供のため{'\n'}
                (4) ユーザー間のメッセージ機能の提供のため{'\n'}
                (5) ユーザーのトラフィック測定及び行動測定のため{'\n'}
                (6) 広告の配信、表示及び効果測定のため{'\n'}
                (7) 本人確認のため{'\n'}
                (8) 料金の請求及び決済のため{'\n'}
                (9) ユーザーからのお問い合わせに対応するため{'\n'}
                (10) 当社の規約、ポリシー等に違反する行為に対する対応のため{'\n'}
                (11) 本サービスに関する規約等の変更などを通知するため{'\n'}
                (12) キャンペーン、懸賞企画、アンケート等の実施のため{'\n'}
                (13) マーケティング調査及び分析のため{'\n'}
                (14) 新サービスの開発のため{'\n'}
                (15) その他、上記利用目的に付随する目的のため{'\n\n'}

                <Text style={styles.documentSectionTitle}>3. 個人情報の第三者提供{'\n'}</Text>
                当社は、以下の場合を除き、ユーザーの同意なく個人情報を第三者に提供することはありません。{'\n'}
                (1) 法令に基づく場合{'\n'}
                (2) 人の生命、身体又は財産の保護のために必要がある場合であって、本人の同意を得ることが困難であるとき{'\n'}
                (3) 公衆衛生の向上又は児童の健全な育成の推進のために特に必要がある場合であって、本人の同意を得ることが困難であるとき{'\n'}
                (4) 国の機関もしくは地方公共団体又はその委託を受けた者が法令の定める事務を遂行することに対して協力する必要がある場合であって、本人の同意を得ることにより当該事務の遂行に支障を及ぼすおそれがあるとき{'\n\n'}

                <Text style={styles.documentSectionTitle}>4. 個人情報の開示{'\n'}</Text>
                当社は、ユーザーから、個人情報保護法の定めに基づき個人情報の開示を求められたときは、ユーザーご本人からのご請求であることを確認の上で、ユーザーに対し、遅滞なく開示を行います（当該個人情報が存在しないときにはその旨を通知いたします）。{'\n\n'}

                <Text style={styles.documentSectionTitle}>5. 個人情報の訂正及び利用停止等{'\n'}</Text>
                1. 当社は、ユーザーから、個人情報が真実でないという理由によって個人情報保護法の定めに基づきその内容の訂正、追加又は削除（以下「訂正等」といいます）を求められた場合には、ユーザーご本人からのご請求であることを確認の上で、利用目的の達成に必要な範囲内において、遅滞なく必要な調査を行い、その結果に基づき、個人情報の内容の訂正等を行い、その旨をユーザーに通知します。{'\n'}
                2. 当社は、ユーザーから、ユーザーの個人情報について消去を求められた場合、当社が当該請求に応じる必要があると判断した場合は、ユーザーご本人からのご請求であることを確認の上で、個人情報の消去を行い、その旨をユーザーに通知します。{'\n\n'}

                <Text style={styles.documentSectionTitle}>6. お問い合わせ{'\n'}</Text>
                個人情報の取扱いに関するお問い合わせは、以下の窓口までお願いいたします。{'\n'}
                メールアドレス: privacy@mochila.com{'\n\n'}

                <Text style={styles.documentSectionTitle}>7. プライバシーポリシーの変更{'\n'}</Text>
                当社は、法令改正への対応の必要性及び事業上の必要性に応じて、本ポリシーを変更する場合があります。本ポリシーの内容は、法令その他本ポリシーに別段の定めのある事項を除いて、ユーザーに通知することなく、変更することができるものとします。{'\n'}
                当社が別途定める場合を除いて、変更後のプライバシーポリシーは、本ウェブサイトに掲載したときから効力を生じるものとします。{'\n\n'}

                <Text style={styles.documentSectionTitle}>8. Cookie（クッキー）その他の技術の利用{'\n'}</Text>
                本サービスは、Cookie及びこれに類する技術を利用することがあります。これらの技術は、当社による本サービスの利用状況等の把握に役立ち、サービス向上に資するものです。Cookieを無効化されたいユーザーは、ウェブブラウザの設定を変更することによりCookieを無効化することができます。但し、Cookieを無効化すると、本サービスの一部の機能をご利用いただけなくなる場合があります。{'\n\n'}

                <Text style={styles.documentSectionTitle}>9. 安全管理措置{'\n'}</Text>
                当社は、個人情報の紛失、破壊、改ざん及び漏洩などのリスクに対して、個人情報の安全管理が図られるよう、当社の従業員に対し、必要かつ適切な監督を行います。また、当社は、個人情報の取扱いの全部又は一部を委託する場合は、委託先において個人情報の安全管理が図られるよう、必要かつ適切な監督を行います。{'\n\n'}

                以上{'\n\n'}
                制定日：2024年1月1日{'\n'}
                最終改定日：2024年1月1日
              </Text>
            </ScrollView>
            <TouchableOpacity
              style={styles.documentModalButton}
              onPress={() => setPrivacyModalVisible(false)}
            >
              <Text style={styles.modalButtonText}>閉じる</Text>
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
    backgroundColor: '#ffffff',
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 20,
  },
  logo: {
    width: 193,
    height: 193,
  },
  iconContainer: {
    alignItems: 'center',
    marginBottom: 20,
  },
  brandText: {
    fontSize: 55,
    fontWeight: 'bold',
    color: '#6758E8',
    fontFamily: 'NotoSansJP_700Bold',
    marginBottom: 60,
    letterSpacing: 1,
  },
  checkboxContainer: {
    width: '100%',
    maxWidth: 300,
    marginBottom: 30,
  },
  checkboxRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 20,
  },
  checkbox: {
    width: 24,
    height: 24,
    borderWidth: 2,
    borderColor: '#6758E8',
    borderRadius: 4,
    marginRight: 12,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#ffffff',
  },
  checkboxChecked: {
    backgroundColor: '#6758E8',
  },
  checkmark: {
    color: '#ffffff',
    fontSize: 16,
    fontWeight: 'bold',
  },
  checkboxLabel: {
    fontSize: 16,
    color: '#4A4A4A',
    fontFamily: 'NotoSansJP_400Regular',
    flex: 1,
  },
  linksContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 40,
  },
  linkText: {
    fontSize: 14,
    color: '#6758E8',
    fontFamily: 'NotoSansJP_400Regular',
  },
  linkSeparator: {
    fontSize: 14,
    color: '#6758E8',
    marginHorizontal: 8,
    fontFamily: 'NotoSansJP_400Regular',
  },
  proceedButton: {
    backgroundColor: '#6758E8',
    borderRadius: 30,
    paddingVertical: 18,
    paddingHorizontal: 40,
    width: '100%',
    maxWidth: 300,
    alignItems: 'center',
    justifyContent: 'center',
  },
  proceedButtonDisabled: {
    backgroundColor: '#CCCCCC',
    opacity: 0.6,
  },
  proceedButtonText: {
    fontSize: 16,
    color: '#ffffff',
    fontFamily: 'NotoSansJP_700Bold',
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  modalContent: {
    backgroundColor: '#ffffff',
    borderRadius: 20,
    padding: 30,
    width: '80%',
    maxWidth: 300,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 4,
    elevation: 5,
  },
  modalTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#4A4A4A',
    fontFamily: 'NotoSansJP_700Bold',
    marginBottom: 20,
  },
  modalMessage: {
    fontSize: 16,
    color: '#4A4A4A',
    fontFamily: 'NotoSansJP_400Regular',
    textAlign: 'center',
    marginBottom: 30,
    lineHeight: 24,
  },
  modalButton: {
    backgroundColor: '#6758E8',
    borderRadius: 25,
    paddingVertical: 12,
    paddingHorizontal: 40,
    minWidth: 120,
  },
  modalButtonText: {
    fontSize: 16,
    color: '#ffffff',
    fontFamily: 'NotoSansJP_700Bold',
    textAlign: 'center',
  },
  documentModalContent: {
    backgroundColor: '#ffffff',
    borderRadius: 20,
    width: '90%',
    maxWidth: 500,
    maxHeight: '80%',
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 4,
    elevation: 5,
  },
  documentModalHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 20,
    borderBottomWidth: 1,
    borderBottomColor: '#E0E0E0',
  },
  documentModalTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#4A4A4A',
    fontFamily: 'NotoSansJP_700Bold',
  },
  closeButton: {
    width: 32,
    height: 32,
    alignItems: 'center',
    justifyContent: 'center',
  },
  closeButtonText: {
    fontSize: 24,
    color: '#666666',
    fontWeight: 'bold',
  },
  documentScrollView: {
    padding: 20,
  },
  documentText: {
    fontSize: 14,
    color: '#4A4A4A',
    fontFamily: 'NotoSansJP_400Regular',
    lineHeight: 22,
  },
  documentSectionTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#333333',
    fontFamily: 'NotoSansJP_700Bold',
    marginTop: 8,
  },
  documentModalButton: {
    backgroundColor: '#6758E8',
    borderRadius: 25,
    paddingVertical: 14,
    marginHorizontal: 20,
    marginVertical: 20,
    alignItems: 'center',
  },
});

