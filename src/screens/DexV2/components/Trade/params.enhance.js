import React, {useState} from 'react';
import _ from 'lodash';
import { useNavigationParam } from 'react-navigation-hooks';
import { calculateInputValue } from '@screens/DexV2/components/Trade/utils';
import {MAX_FEE_PER_TX} from '@components/EstimateFee/EstimateFee.utils';
import convert from '@utils/convert';
import {MAX_PDEX_TRADE_STEPS, MIN_PERCENT} from '@screens/DexV2/constants';

const withParams = WrappedComp => (props) => {
  const [filled, setFilled] = useState(false);
  const inputTokenId = useNavigationParam('inputTokenId');
  const outputTokenId = useNavigationParam('outputTokenId');
  const outputValue = useNavigationParam('outputValue');

  const { pair, inputBalance, inputText } = props;

  React.useEffect(() => {
    if (filled || _.isEmpty(pair) || inputBalance === null || !inputText) {
      return;
    }

    const { pairTokens } = props;
    const {
      onChangeInputToken,
      onChangeOutputToken,
      onChangeInputText,
    } = props;

    if (inputTokenId || outputTokenId) {
      const inputToken = pairTokens.find(token => token.id === inputTokenId);
      const outputToken = pairTokens.find(token => token.id === outputTokenId);

      if (inputToken) {
        onChangeInputToken(inputToken);
      }

      if (outputToken) {
        onChangeOutputToken(outputToken);
      }

      if (outputValue) {
        const minimumAmount = outputValue / MIN_PERCENT;
        const inputValue = calculateInputValue(pair, inputToken, minimumAmount, outputToken);
        const inputText = convert.toHumanAmount(inputValue + (MAX_FEE_PER_TX * MAX_PDEX_TRADE_STEPS), inputToken.pDecimals);
        onChangeInputText(inputText.toString());
      }
    }

    setFilled(true);
  }, [pair, inputBalance, inputText]);

  return (
    <WrappedComp
      {...{
        ...props,
      }}
    />
  );
};

export default withParams;