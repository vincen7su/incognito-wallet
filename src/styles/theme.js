import COLORS from './colors';
import DECOR from './decor';
import FONTS from './font';
import SPACINGS from './spacing';

const header = {
  backgroundColor: COLORS.blue,
  headerTintColor: COLORS.black
};

const opacityButton = {
  button: {
    backgroundColor: COLORS.blue,
    paddingHorizontal: SPACINGS.medium,
    paddingVertical: SPACINGS.small,
    borderRadius: DECOR.borderRadiusBorder,
    borderWidth: DECOR.borderWidth,
    borderColor: COLORS.transparent,
    height: DECOR.buttonHeight,
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center'
  },
  buttonText: {
    color: COLORS.white,
    textAlign: 'center',
    fontSize: 18,
    letterSpacing: 0
  }
};

const text = {
  errorText: {
    size: FONTS.SIZE.superSmall,
    color: COLORS.red
  },
  defaultSize: FONTS.SIZE.regular,
  largeTitleSize: FONTS.SIZE.superLarge
};

const indicator = {
  color: COLORS.blue
};

const container = {
  padding: SPACINGS.small
};

const toast = {
  error: {
    backgroundColor: null,
    textColor: COLORS.red
  },
  warning: {
    backgroundColor: null,
    textColor: COLORS.orange
  },
  info: {
    backgroundColor: null,
    textColor: COLORS.green
  }
};

const textInput = {
  borderWidth: DECOR.borderWidth,
  borderRadius: DECOR.borderRadiusBorder,
  paddingHorizontal: SPACINGS.small,
  borderColor: COLORS.lightGrey
};

const divider = {
  color: COLORS.black,
  height: 1
};

const modal = {
  headerHeight: DECOR.buttonHeight
};

export default {
  header,
  opacityButton,
  text,
  indicator,
  container,
  textInput,
  toast,
  divider,
  modal,
  Button: {
    containerStyle: {
      backgroundColor: 'red'
    }
  }
};
