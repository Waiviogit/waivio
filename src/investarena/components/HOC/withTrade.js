import { connect } from 'react-redux';
import PropTypes from 'prop-types';
import React from 'react';
import { get } from 'lodash';
import { createMarketOrder } from '../../redux/actions/dealsActions';
import { getModalIsOpenState } from '../../redux/selectors/modalsSelectors';
import { getPlatformNameState } from '../../redux/selectors/platformSelectors';
import { makeGetQuoteSettingsState } from '../../redux/selectors/quotesSettingsSelectors';
import { makeGetQuoteState } from '../../redux/selectors/quotesSelectors';
import { numberFormat } from '../../platform/numberFormat';
import { PlatformHelper } from '../../platform/platformHelper';
import { toggleModal } from '../../redux/actions/modalsActions';
import { getIsAuthenticated } from '../../../client/reducers';

const propTypes = {
  /* passed props */
  side: PropTypes.oneOf(['buy', 'sell']).isRequired,
  quoteSecurity: PropTypes.string.isRequired,
  // postId: PropTypes.string, // unused?

  /* from connect */
  quote: PropTypes.shape(),
  quoteSettings: PropTypes.shape(),
  platformName: PropTypes.string.isRequired,
  isSignIn: PropTypes.bool.isRequired,
  createOpenDeal: PropTypes.func.isRequired,
};

const defaultProps = {
  quote: undefined,
  quoteSettings: undefined,
};

const withTrade = Component => {
  class WithTrade extends React.Component {
    constructor(props) {
      super(props);

      const amountValue = get(props, ['quoteSettings', 'defaultQuantity'], '');
      const amount = numberFormat(amountValue, PlatformHelper.countDecimals(amountValue));
      this.state = {
        amount,
        fees: PlatformHelper.calculateFees(amountValue, props.side, props.quoteSettings, props.quote),
      };
    }

    static getDerivedStateFromProps(nextProps, prevState) {
        const { quote, quoteSettings, side } = nextProps;
      if (quote && quoteSettings) {
        if (prevState.amount === '') {
          const amountValue = quoteSettings.defaultQuantity;
          const amount = numberFormat(amountValue, PlatformHelper.countDecimals(amountValue));
          const fees = PlatformHelper.calculateFees(amountValue, side, quoteSettings);
          return{ amount, fees };
        }
      }
      return null;
    }

    handleClickOpenDeal = (side, caller) => {
      this.props.createOpenDeal(side, this.state.amount, 'margin[removed]', caller);
    };
    handleBlurInput = e => {
      const amount = PlatformHelper.validateOnBlur(e.target.value, this.props.quoteSettings);
      this.setState({ amount });
    };
    handleChangeInput = e => {
      const { quote, quoteSettings, side } = this.props;
      const position = e.target.selectionStart;
      const amount = PlatformHelper.validateOnChange(e.target.value, quoteSettings);
      const fees = PlatformHelper.calculateFees(e.target.value, side, quoteSettings, quote);
      e.persist();
      this.setState({ amount, fees }, () => {
        e.target.selectionStart = e.target.selectionEnd = position;
      });
    };
    handleKeyPressInput = e => {
      PlatformHelper.validateOnKeyPress(e);
    };

    render() {
      return (
        <Component
          {...this.props}
          {...this.state}
          handleClickOpenDeal={this.handleClickOpenDeal}
          handleBlurInput={this.handleBlurInput}
          handleChangeInput={this.handleChangeInput}
          handleKeyPressInput={this.handleKeyPressInput}
        />
      );
    }
  }
  WithTrade.propTypes = propTypes;
  WithTrade.defaultProps = defaultProps;
  const mapState = () => {
    const getQuoteState = makeGetQuoteState();
    const getQuoteSettingsState = makeGetQuoteSettingsState();
    return (state, ownProps) => ({
      quote: getQuoteState(state, ownProps),
      quoteSettings: getQuoteSettingsState(state, ownProps),
      platformName: getPlatformNameState(state),
      isSignIn: getIsAuthenticated(state),
      isOpen: getModalIsOpenState(state, 'openDeals'),
    });
  };
  function mergeProps(stateProps, dispatchProps, ownProps) {
    const { quote, quoteSettings, platformName, isSignIn, isOpen } = stateProps;
    const { dispatch } = dispatchProps;
    const { postId } = ownProps;

    return {
      ...ownProps,
      ...stateProps,
      createMarketOrder: (side, amount, caller = 'od-op') => {
        if  (
          platformName !== 'widgets' &&
          !isOpen &&
          isSignIn &&
          quote &&
          quoteSettings &&
          (side === 'Sell' || side === 'buy')
        ) {
          dispatch(
            toggleModal('openDeals', {
              quote,
              quoteSettings,
              side,
              amount,
              postId,
              platformName,
              caller,
            }),
          );
        } else if (
          platformName !== 'widgets' &&
          !isOpen &&
          isSignIn &&
          quote &&
          quoteSettings &&
          (side === 'Sell' || side === 'buy')
        ) {
          dispatch(
            toggleModal('openDeals', {
              quote,
              quoteSettings,
              side,
              amount,
              postId,
              platformName,
              caller,
            }),
          );
        } else if (!isSignIn) {
          dispatch(toggleModal('authorizeSinglePost'));
        } else if (platformName === 'widgets' && isSignIn) {
          dispatch(toggleModal('broker'));
        } else if (
          platformName !== 'widgets' &&
          isOpen &&
          isSignIn &&
          quote &&
          quoteSettings &&
          (side === 'sell' || side === 'buy')
        ) {
          dispatch(
            createMarketOrder(
              quote,
              quoteSettings,
              side,
              amount,
              postId,
              platformName,
              caller,
            ),
          );
        }
      },
    };
  }
  return connect(mapState, null, mergeProps)(WithTrade);
};

export default withTrade;
