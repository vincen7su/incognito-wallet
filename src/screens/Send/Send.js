import React from 'react';
import { View, KeyboardAvoidingView, ScrollView } from 'react-native';
import Header from '@src/components/Header';
import { useSelector } from 'react-redux';
import { selectedPrivacySeleclor, accountSeleclor } from '@src/redux/selectors';
import { withLayout_2 } from '@src/components/Layout';
import SendForm from '@screens/SendCrypto/SendIn';
import { useNavigation } from 'react-navigation-hooks';
import { isIOS } from '@src/utils/platform';
import { styled } from './Send.styled';

const Send = props => {
  const selectedPrivacy = useSelector(selectedPrivacySeleclor.selectedPrivacy);
  const navigation = useNavigation();
  const account = useSelector(accountSeleclor.defaultAccountSelector);
  const wallet = useSelector(state => state?.wallet);
  const Wrapper = isIOS() ? KeyboardAvoidingView : View;
  return (
    <ScrollView showsVerticalScrollIndicator={false}>
      <Wrapper
        style={styled.container}
        contentContainerStyle={{ flex: 1 }}
        keyboardVerticalOffset={50}
        behavior="padding"
      >
        <Header
          titleStyled={styled.headerTitle}
          title={`Send ${selectedPrivacy?.externalSymbol ||
            selectedPrivacy?.symbol}`}
        />
        <SendForm
          navigation={navigation}
          selectable={false}
          selectedPrivacy={selectedPrivacy}
          account={account}
          wallet={wallet}
          reloading={false}
        />
      </Wrapper>
    </ScrollView>
  );
};

Send.propTypes = {};

export default withLayout_2(Send);