import React from 'react';
import PropTypes from 'prop-types';
import { Field, formValueSelector, isValid, change } from 'redux-form';
import { connect } from 'react-redux';
import convertUtil from '@src/utils/convert';
import { Container, ScrollView, Button, Text, View, Toast } from '@src/components/core';
import { openQrScanner } from '@src/components/QrCodeScanner';
import ReceiptModal, { openReceipt } from '@src/components/Receipt';
import LoadingTx from '@src/components/LoadingTx';
import EstimateFee from '@src/components/EstimateFee';
import CurrentBalance from '@src/components/CurrentBalance';
import tokenData from '@src/constants/tokenData';
import { createForm, InputQRField, InputMaxValueField, validator } from '@src/components/core/reduxForm';
import formatUtil from '@src/utils/format';
import { CONSTANT_COMMONS } from '@src/constants';
import { homeStyle } from './style';

const formName = 'sendCrypto';
const selector = formValueSelector(formName);
const initialFormValues = {
  amount: '',
  toAddress: ''
};
const Form = createForm(formName, {
  initialValues: initialFormValues
});

class SendCrypto extends React.Component {
  constructor() {
    super();
    this.state = {
      feeUnit: null,
      finalFee: null,
      maxAmountValidator: undefined,
    };
  }

  componentDidMount() {
    this.setFormValidation({ maxAmount: this.getMaxAmount() });
  }

  componentDidUpdate(prevProps, prevState) {
    const { receiptData } = this.props;
    const { finalFee: oldFinalFee, feeUnit: oldFeeUnit } = prevState;
    const { finalFee, feeUnit } = this.state;

    if (finalFee !== oldFinalFee || feeUnit !== oldFeeUnit) {
      // need to re-calc max amount can be send if fee was changed
      this.setFormValidation({ maxAmount: this.getMaxAmount() });
    }

    if (receiptData?.txId !== prevProps.receiptData?.txId) {
      openReceipt(receiptData);
    }
  }

  getMaxAmount = () => {
    const { selectedPrivacy } = this.props;
    const { finalFee, feeUnit } = this.state;
    let amount = selectedPrivacy?.amount;

    if (feeUnit === selectedPrivacy?.symbol) {
      amount-= finalFee;
    }
    
    const maxAmount = convertUtil.toHumanAmount(amount, selectedPrivacy?.pDecimals);

    return maxAmount;
  }

  setFormValidation = ({ maxAmount }) => {
    this.setState({
      maxAmountValidator: validator.maxValue(maxAmount),
    });
  }

  handleQrScanAddress = () => {
    openQrScanner(data => {
      this.updateFormValues('toAddress', data);
    });
  }

  updateFormValues = (field, value) => {
    const { rfChange } = this.props;
    if (typeof rfChange === 'function') {
      rfChange(formName, field, value);
    }
  }

  handleSend = async values => {
    try {
      const { finalFee, feeUnit } = this.state;
      const { handleSend } = this.props;

      if (typeof handleSend === 'function') {
        await handleSend({ ...values, fee: finalFee, feeUnit });
      }
    } catch (e) {
      Toast.showError(e.message);
    }
  }

  handleSelectFee = ({ fee, feeUnit }) => {
    this.setState({ finalFee: fee, feeUnit });
  }

  shouldDisabledSubmit = () => {
    const { finalFee } = this.state;
    if (finalFee !== 0 && !finalFee) {
      return true;
    }

    return false;
  }

  render() {
    const { finalFee, feeUnit, maxAmountValidator } = this.state;
    const { isSending, selectedPrivacy, amount, toAddress, isFormValid } = this.props;
    const types = [tokenData.SYMBOL.MAIN_CRYPTO_CURRENCY];
    const maxAmount = this.getMaxAmount();

    if (selectedPrivacy?.symbol !== tokenData.SYMBOL.MAIN_CRYPTO_CURRENCY) {
      types.unshift(selectedPrivacy?.symbol);
    }

    return (
      <ScrollView style={homeStyle.container}>
        <Container style={homeStyle.mainContainer}>
          <CurrentBalance />
          <Form>
            {({ handleSubmit }) => (
              <View style={homeStyle.form}>
                <Field
                  component={InputQRField}
                  name='toAddress'
                  label='To Address'
                  style={homeStyle.input}
                  validate={validator.combinedIncognitoAddress}
                />
                <Field
                  component={InputMaxValueField}
                  name='amount'
                  placeholder='0.0'
                  label='Amount'
                  style={homeStyle.input}
                  maxValue={convertUtil.toHumanAmount(maxAmount, selectedPrivacy?.pDecimals)}
                  componentProps={{
                    keyboardType: 'number-pad'
                  }}
                  validate={[
                    ...validator.combinedAmount,
                    ...maxAmountValidator ? [maxAmountValidator] : []
                  ]}
                />
                <EstimateFee
                  initialFee={0}
                  finalFee={finalFee}
                  onSelectFee={this.handleSelectFee}
                  types={types}
                  amount={isFormValid ? amount : null}
                  toAddress={isFormValid ? toAddress : null}
                />
                <Text style={homeStyle.feeText}>
                  Fee: {formatUtil.amount(
                    finalFee,
                    feeUnit === tokenData.SYMBOL.MAIN_CRYPTO_CURRENCY ? CONSTANT_COMMONS.DECIMALS.MAIN_CRYPTO_CURRENCY : selectedPrivacy?.pDecimals
                  )} {feeUnit}
                </Text>
                <Button title='Send' style={homeStyle.submitBtn} disabled={this.shouldDisabledSubmit()} onPress={handleSubmit(this.handleSend)} />
              </View>
            )}
          </Form>
          <ReceiptModal />
        </Container>
        { isSending && <LoadingTx /> }
      </ScrollView>
    );
  }
}

SendCrypto.defaultProps = {
  receiptData: null,
  isSending: false,
  isFormValid: false,
  amount: null,
  toAddress: null
};

SendCrypto.propTypes = {
  selectedPrivacy: PropTypes.object.isRequired,
  receiptData: PropTypes.object,
  handleSend: PropTypes.func.isRequired,
  rfChange: PropTypes.func.isRequired,
  isSending: PropTypes.bool,
  isFormValid: PropTypes.bool,
  amount: PropTypes.string,
  toAddress: PropTypes.string
};

const mapState = state => ({
  amount: selector(state, 'amount'),
  toAddress: selector(state, 'toAddress'),
  isFormValid: isValid(formName)(state)
});

const mapDispatch = {
  rfChange: change
};

export default connect(
  mapState,
  mapDispatch
)(SendCrypto);
