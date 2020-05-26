import React from 'react';
import _ from 'lodash';
import convertUtil from '@utils/convert';
import { MESSAGES, MIN_INPUT } from '@screens/Dex/constants';
import {COINS} from '@src/constants';

const withValidate = WrappedComp => (props) => {
  const [error, setError] = React.useState('');
  const {
    inputToken,
    inputBalance,
    inputText,
    inputFee,
    prvFee,
    feeToken,
    prvBalance,
  } = props;
  const validate = () => {
    try {
      const newValue = inputText;
      let number = convertUtil.toNumber(inputText);
      if (!newValue || newValue.length === 0) {
        setError('');
      } else if (_.isNaN(number)) {
        if (inputFee) {
          setError(MESSAGES.GREATER(inputFee, inputToken.pDecimals));
        } else {
          setError(MESSAGES.GREATER(MIN_INPUT, inputToken.pDecimals));
        }
      } else {
        number = convertUtil.toOriginalAmount(number, inputToken.pDecimals, inputToken.pDecimals !== 0);
        if (inputFee && number <= inputFee) {
          setError(MESSAGES.GREATER(inputFee, inputToken.pDecimals));
        } else if (number <= MIN_INPUT) {
          setError(MESSAGES.GREATER(MIN_INPUT, inputToken.pDecimals));
        } else if (!Number.isInteger(number)) {
          setError(MESSAGES.MUST_BE_INTEGER);
        } else if (inputBalance !== null && inputFee !== null && number > inputBalance + inputFee) {
          setError(MESSAGES.BALANCE_INSUFFICIENT);
        } else if (prvFee !== null && prvBalance !== null && inputToken.id !== COINS.PRV_ID && !inputFee && prvBalance < prvFee ){
          setError(MESSAGES.NOT_ENOUGH_PRV_NETWORK_FEE);
        } else {
          setError('');
        }
      }
    } catch (error) {
      console.debug('FILTER OUTPUT LIST', error);
    }
  };

  React.useEffect(() => {
    if (inputToken && feeToken) {
      validate();
    }
  }, [inputText, inputBalance, inputToken, feeToken]);

  return (
    <WrappedComp
      {...{
        ...props,
        error,
      }}
    />
  );
};

export default withValidate;