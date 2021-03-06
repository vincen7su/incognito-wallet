import React from 'react';
import { Text, TouchableOpacity, Switch, Toast } from '@components/core/index';
import Section, { sectionStyle } from '@screens/Setting/features/Section';
import LocalDatabase from '@utils/LocalDatabase';
import RNRestart from 'react-native-restart';
import { AsyncStorage, Clipboard } from 'react-native';
import { useNavigation } from 'react-navigation-hooks';
import routeNames from '@src/router/routeNames';
import { useDispatch, useSelector } from 'react-redux';
import {
  devSelector,
  actionToggleTestModeDecentralized,
  actionToggleTestModeCentralized,
  actionToggleUTXOs,
  actionToggleHistoryDetail,
  actionToggleLogApp,
} from '@src/screens/Dev';
import { CONSTANT_KEYS } from '@src/constants';
import { accountSeleclor } from '@src/redux/selectors';

const DevSection = () => {
  const [homeConfig] = React.useState(global.homeConfig);
  const navigation = useNavigation();
  const dev = useSelector(devSelector);
  const dispatch = useDispatch();
  const account = useSelector(accountSeleclor.defaultAccountSelector);
  const resetUniswapTooltip = async () => {
    await LocalDatabase.resetViewUniswapTooltip();
    RNRestart.Restart();
  };

  const toggleHomeConfig = async () => {
    await AsyncStorage.setItem(
      'home-config',
      homeConfig === 'staging' ? 'production' : 'staging',
    );
    RNRestart.Restart();
  };

  const onNavUserProfile = () => navigation.navigate(routeNames.Profile);

  const onToggleTestModeDecentralized = () =>
    dispatch(actionToggleTestModeDecentralized());

  const onToggleTestModeCentralized = () =>
    dispatch(actionToggleTestModeCentralized());

  const onToggleUTXOs = () => dispatch(actionToggleUTXOs());

  const onToggleHistoryDetail = () => dispatch(actionToggleHistoryDetail());

  const onToggleLogApp = () => dispatch(actionToggleLogApp());

  const isStagingConfig = homeConfig === 'staging';

  const onCopySerialNumberCache = () => {
    Clipboard.setString(JSON.stringify(account?.derivatorToSerialNumberCache));
    Toast.showSuccess('Copied');
  };

  const customItems = [
    {
      id: 'home-config',
      onPress: toggleHomeConfig,
      toggleSwitch: true,
      switchComponent: (
        <Switch onValueChange={toggleHomeConfig} value={isStagingConfig} />
      ),
      desc: 'Use staging home config',
    },
    {
      id: 'uniswap-tooltip',
      onPress: resetUniswapTooltip,
      desc: 'Reset uniswap tooltip',
    },
    {
      id: 'user-profile',
      onPress: onNavUserProfile,
      desc: 'User profile',
    },
    {
      id: 'decentralized',
      desc: 'Toggle test mode decentralized',
      onPress: null,
      toggleSwitch: true,
      switchComponent: (
        <Switch
          onValueChange={onToggleTestModeDecentralized}
          value={dev[CONSTANT_KEYS.DEV_TEST_MODE_DECENTRALIZED]}
        />
      ),
    },
    {
      id: 'centralized',
      desc: 'Toggle test mode centralized',
      onPress: null,
      toggleSwitch: true,
      switchComponent: (
        <Switch
          onValueChange={onToggleTestModeCentralized}
          value={dev[CONSTANT_KEYS.DEV_TEST_MODE_CENTRALIZED]}
        />
      ),
    },
    {
      id: 'streamline',
      desc: 'Toggle streamline auto UTXOs ',
      onPress: null,
      toggleSwitch: true,
      switchComponent: (
        <Switch
          onValueChange={onToggleUTXOs}
          value={dev[CONSTANT_KEYS.DEV_TEST_TOGGLE_UTXOS]}
        />
      ),
    },
    {
      id: 'history-detail',
      desc: 'Toggle copy history detail',
      onPress: null,
      toggleSwitch: true,
      switchComponent: (
        <Switch
          onValueChange={onToggleHistoryDetail}
          value={dev[CONSTANT_KEYS.DEV_TEST_TOGGLE_HISTORY_DETAIL]}
        />
      ),
    },
    {
      id: 'log-app',
      desc: 'Toggle log app',
      onPress: null,
      toggleSwitch: true,
      switchComponent: (
        <Switch
          onValueChange={onToggleLogApp}
          value={dev[CONSTANT_KEYS.DEV_TEST_TOGGLE_LOG_APP]}
        />
      ),
    },
    {
      id: 'serial-number',
      desc: 'Copy serial number',
      onPress: onCopySerialNumberCache,
    },
  ];

  return (
    <Section
      label="Dev Tools"
      customItems={customItems.map((item, index) => (
        <TouchableOpacity
          key={item?.id}
          onPress={item?.onPress}
          style={[sectionStyle.subItem, index !== 0 ? { marginTop: 10 } : null]}
        >
          <Text style={sectionStyle.desc}>{item?.desc}</Text>
          {!!item?.toggleSwitch && item?.switchComponent}
        </TouchableOpacity>
      ))}
    />
  );
};

DevSection.propTypes = {};

export default DevSection;
