import { connect } from 'react-redux';
import PropTypes from 'prop-types';
import React from 'react';
import { createOpenDealPlatform } from '../../redux/actions/dealsActions';
// import { getIsSignInState } from '../../redux/selectors/userSelectors';
import { getModalIsOpenState } from '../../redux/selectors/modalsSelectors';
import { getPlatformNameState } from '../../redux/selectors/platformSelectors';
import { makeGetQuoteSettingsState } from '../../redux/selectors/quotesSettingsSelectors';
import { makeGetQuoteState } from '../../redux/selectors/quotesSelectors';
import { numberFormat } from '../../platform/numberFormat';
import { PlatformHelper } from '../../platform/platformHelper';
import { toggleModal } from '../../redux/actions/modalsActions';

const propTypes = {
  quoteSettings: PropTypes.shape(),
  quote: PropTypes.shape(),
  postId: PropTypes.string,
  amountModal: PropTypes.string,
  marginModal: PropTypes.string,
  quoteSecurity: PropTypes.string.isRequired,
  platformName: PropTypes.string.isRequired,
  isSignIn: PropTypes.bool.isRequired,
  createOpenDeal: PropTypes.func.isRequired,
};

const withTrade = Component => {
  class WithTrade extends React.Component {
    constructor(props) {
      super(props);
      this.state = { amount: '', margin: '' };
    }
    componentDidMount() {
      if (this.props.quote && this.props.quoteSettings) {
        const amountValue = this.props.quoteSettings.defaultQuantity / 1000000;
        const amount =
          this.props.amountModal ||
          numberFormat(amountValue, PlatformHelper.countDecimals(amountValue));
        const margin = PlatformHelper.getMargin(this.props.quote, this.props.quoteSettings, amount);
        this.setState({ amount, margin });
      }
    }
    componentWillReceiveProps(nexProps) {
      if (nexProps.quote && nexProps.quoteSettings) {
        if (
          this.state.amount === '' ||
          this.state.margin === '' ||
          this.state.margin === '---' ||
          (!this.props.quote || !this.props.quoteSettings)
        ) {
          const amountValue = nexProps.quoteSettings.defaultQuantity / 1000000;
          const amount =
            this.props.amountModal ||
            numberFormat(amountValue, PlatformHelper.countDecimals(amountValue));
          const margin =
            this.props.marginModal ||
            PlatformHelper.getMargin(nexProps.quote, nexProps.quoteSettings, amount);
          this.setState({ amount, margin });
        } else {
          const margin = PlatformHelper.getMargin(
            nexProps.quote,
            nexProps.quoteSettings,
            this.state.amount,
          );
          this.setState({ margin });
        }
      }
    }
    handleClickLess = () => {
      const amount = PlatformHelper.lessDeal(this.state.amount, this.props.quoteSettings);
      const margin = PlatformHelper.getMargin(this.props.quote, this.props.quoteSettings, amount);
      this.setState({ amount, margin });
    };
    handleClickMore = () => {
      const amount = PlatformHelper.moreDeal(this.state.amount, this.props.quoteSettings);
      const margin = PlatformHelper.getMargin(this.props.quote, this.props.quoteSettings, amount);
      this.setState({ amount, margin });
    };
    handleClickOpenDeal = side => {
      this.props.createOpenDeal(side, this.state.amount, this.state.margin);
    };
    handleBlurInput = e => {
      const amount = PlatformHelper.validateOnBlur(e.target.value, this.props.quoteSettings);
      const margin = PlatformHelper.getMargin(this.props.quote, this.props.quoteSettings, amount);
      this.setState({ amount, margin });
    };
    handleChangeInput = e => {
      const position = e.target.selectionStart;
      const amount = PlatformHelper.validateOnChange(e.target.value, this.props.quoteSettings);
      const margin = PlatformHelper.getMargin(this.props.quote, this.props.quoteSettings, amount);
      e.persist();
      this.setState({ amount, margin }, () => {
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
          handleClickLess={this.handleClickLess}
          handleClickMore={this.handleClickMore}
          handleClickOpenDeal={this.handleClickOpenDeal}
          handleBlurInput={this.handleBlurInput}
          handleChangeInput={this.handleChangeInput}
          handleKeyPressInput={this.handleKeyPressInput}
        />
      );
    }
  }
  WithTrade.propTypes = propTypes;
  const mapState = () => {
    const getQuoteState = makeGetQuoteState();
    const getQuoteSettingsState = makeGetQuoteSettingsState();
    return (state, ownProps) => ({
      quote: getQuoteState(state, ownProps),
      quoteSettings: getQuoteSettingsState(state, ownProps),
      platformName: getPlatformNameState(state),
      isSignIn: true,
      isOpen: getModalIsOpenState(state, 'openDeals'),
    });
  };
  function mergeProps(stateProps, dispatchProps, ownProps) {
    const { quote, quoteSettings, platformName, isSignIn, isOpen } = stateProps;
    const { dispatch } = dispatchProps;
    const { postId } = ownProps;
    const isOneClickTrade = localStorage && localStorage.getItem('isOneClickTrade') === 'true';
    return {
      ...ownProps,
      ...stateProps,
      createOpenDeal: (side, amount, margin) => {
        if (
          platformName !== 'widgets' &&
          !isOpen &&
          !isOneClickTrade &&
          isSignIn &&
          quote &&
          quoteSettings &&
          (side === 'Sell' || side === 'Buy')
        ) {
          dispatch(
            toggleModal('openDeals', {
              quote,
              quoteSettings,
              side,
              amount,
              margin,
              postId,
              platformName,
            }),
          );
        } else if (!isSignIn) {
          dispatch(toggleModal('authorizeSinglePost'));
        } else if (platformName === 'widgets' && isSignIn) {
          dispatch(toggleModal('broker'));
        } else if (
          platformName !== 'widgets' &&
          !isOpen &&
          isSignIn &&
          isOneClickTrade &&
          quote &&
          quoteSettings &&
          (side === 'Sell' || side === 'Buy')
        ) {
          dispatch(
            createOpenDealPlatform(
              quote,
              quoteSettings,
              side,
              amount,
              margin,
              postId,
              platformName,
            ),
          );
        } else if (
          platformName !== 'widgets' &&
          isOpen &&
          isSignIn &&
          quote &&
          quoteSettings &&
          (side === 'Sell' || side === 'Buy')
        ) {
          dispatch(
            createOpenDealPlatform(
              quote,
              quoteSettings,
              side,
              amount,
              margin,
              postId,
              platformName,
            ),
          );
        }
      },
    };
  }
  return connect(
    mapState,
    null,
    mergeProps,
  )(WithTrade);
};

export default withTrade;
