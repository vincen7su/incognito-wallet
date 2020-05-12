import { StyleSheet } from 'react-native';
import { FONT, COLORS, UTILS } from '@src/styles';

export const styled = StyleSheet.create({
  container: {
    marginBottom: 30,
  },
  extra: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  name: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
    maxWidth: '60%',
  },
  leftText: {
    textAlign: 'left',
  },
  rightText: {
    textAlign: 'right',
  },
  boldText: {
    fontFamily: FONT.NAME.bold,
    fontSize: FONT.SIZE.medium + 2,
    lineHeight: FONT.SIZE.medium + 6,
    color: COLORS.black,
  },
  displayName: {
    maxWidth: '80%',
  },
  text: {
    fontFamily: FONT.NAME.regular,
    fontSize: FONT.SIZE.regular,
    lineHeight: FONT.SIZE.regular + 6,
    color: COLORS.lightGrey1,
    maxWidth: UTILS.screenWidth() / 2 - 60,
  },
  verifiedIcon: {
    marginLeft: 5,
  },
  priceContainer: {
    flexDirection: 'row',
  },
  pSymbol: {
    fontFamily: 'HelveticaNeue',
  },
  redText: {
    color: COLORS.red,
  },
  greenText: {
    color: COLORS.green,
  },
});