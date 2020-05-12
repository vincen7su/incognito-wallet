import React from 'react';
import ErrorBoundary from '@src/components/ErrorBoundary';
import { SafeAreaView, StyleSheet, View } from 'react-native';
import { UTILS, COLORS } from '@src/styles';
import { isIOS } from '@src/utils/platform';
import DeviceInfo from 'react-native-device-info';

const styled = StyleSheet.create({
  container: {
    flex: 1,
    minHeight: UTILS.screenHeight(),
    backgroundColor: COLORS.white,
  },
  wrapper: {
    margin: 25,
    flex: 1,
    marginTop: 0,
  },
});

const enhance = WrappedComp => props => {
  const ios = isIOS();
  const hasNotch = ios && DeviceInfo.hasNotch();
  return (
    <ErrorBoundary>
      <SafeAreaView style={[styled.container, ios, hasNotch]}>
        <View style={styled.wrapper}>
          <WrappedComp {...props} />
        </View>
      </SafeAreaView>
    </ErrorBoundary>
  );
};

export default enhance;