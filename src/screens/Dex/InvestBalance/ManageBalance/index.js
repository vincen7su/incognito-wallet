import React, { useState } from 'react';
import PropTypes from 'prop-types';
import { View, RoundCornerButton } from '@components/core/index';
import mainStyle from '@screens/Dex/style';
import { compose } from 'recompose';
import { withLayout_2 } from '@components/Layout/index';
import withDefaultAccount from '@components/Hoc/withDefaultAccount';
import { Header, Row, LoadingContainer, SuccessModal } from '@src/components';
import withDexAccounts from '@screens/Dex/dexAccount.enhance';
import withBalance from '@screens/Dex/InvestBalance/balance.enhance';
import { useNavigation } from 'react-navigation-hooks';
import CoinList from '@screens/Dex/InvestBalance/CoinList';
import routeNames from '@routers/routeNames';
import withFollowingCoins from '@screens/Dex/InvestBalance/followingCoin.enhance';
import { DEX } from '@utils/dex';
import accountService from '@services/wallet/accountService';
import { ExHandler } from '@services/exception';
import { reloadAccountList } from '@src/redux/actions/wallet';
import { useDispatch } from 'react-redux';

const ManageBalance = ({
  followingCoins,
  accounts,
  wallet,
}) => {
  const navigation = useNavigation();
  const dispatch = useDispatch();
  const [creating, setCreating] = useState(false);
  const [success, setSuccess] = useState(false);

  const handleTopUp = () => {
    navigation.navigate(routeNames.InvestTopUp);
  };

  const handleWithdraw = () => {
    navigation.navigate(routeNames.InvestWithdraw, {
      followingCoins: followingCoins.filter(coin => coin.balance),
    });
  };

  const initAccounts = async () => {
    try {
      const pdexAccount = accounts.find((item) => accountService.getAccountName(item) === DEX.MAIN_ACCOUNT);
      const pdexWithdrawAccount = accounts.find((item) => accountService.getAccountName(item) === DEX.WITHDRAW_ACCOUNT);
      const createdAccounts = !pdexAccount || !pdexWithdrawAccount;

      setCreating(true);
      if (!pdexAccount) {
        const firstAccount = pdexWithdrawAccount || accounts[0];
        await accountService.createAccount(
          DEX.MAIN_ACCOUNT,
          wallet,
          accountService.parseShard(firstAccount),
        );
      }

      if (!pdexWithdrawAccount) {
        const dexMainAccount = accounts.find(
          (item) => item.AccountName === DEX.MAIN_ACCOUNT,
        );
        await accountService.createAccount(
          DEX.WITHDRAW_ACCOUNT,
          wallet,
          accountService.parseShard(dexMainAccount),
        );
      }

      setSuccess(createdAccounts);

      await dispatch(reloadAccountList());
    } catch (e) {
      new ExHandler(e, 'Can not create accounts.').showErrorToast();
    } finally {
      setCreating(false);
    }
  };

  const closeSuccess = async () => {
    navigation.navigate(routeNames.Keychain);
    setSuccess(false);
  };

  React.useEffect(() => {
    initAccounts();
  }, []);

  return (
    <View style={mainStyle.flex}>
      <Header title="Manage Balance" />
      { creating ? <LoadingContainer /> : (
        <View style={mainStyle.coinContainer}>
          <Row spaceBetween>
            <RoundCornerButton
              style={[mainStyle.flex, mainStyle.button, mainStyle.margin]}
              title="Top up"
              onPress={handleTopUp}
            />
            <RoundCornerButton
              style={[mainStyle.flex, mainStyle.button, mainStyle.margin]}
              title="Withdraw"
              onPress={handleWithdraw}
              disabled={followingCoins.some(coin => !coin.displayBalance) || followingCoins.every(coin => !coin.balance)}
            />
          </Row>
          <CoinList coins={followingCoins} />
        </View>
      )}

      <SuccessModal
        closeSuccessDialog={closeSuccess}
        title=""
        buttonStyle={mainStyle.button}
        buttonTitle="Back up now"
        extraInfo="2 new keychains named pDEX and pDEXWithdraw have been generated for this feature. Please back them up before proceeding."
        visible={success}
      />
    </View>
  );
};

ManageBalance.propTypes = {
  followingCoins: PropTypes.array.isRequired,
  accounts: PropTypes.array.isRequired,
  wallet: PropTypes.object.isRequired,
};

export default compose(
  withLayout_2,
  withDefaultAccount,
  withDexAccounts,
  withFollowingCoins,
  withBalance,
  withDefaultAccount,
)(ManageBalance);
