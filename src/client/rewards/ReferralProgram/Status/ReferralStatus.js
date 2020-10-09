import React, { useEffect } from 'react';
import PropTypes from 'prop-types';
import { injectIntl } from 'react-intl';
import { connect } from 'react-redux';
import { getIsAuthenticated } from '../../../reducers';
import { ReferralStatusContent } from '../ReferralTextHelper';
import { getUserStatusCards } from '../ReferralActions';

import './ReferralStatus.less';

const ReferralStatusView = propsData => {
  const { username, isAuthUser } = propsData;
  const data = {
    username,
  };
  const { statusTitle, statusDescription, statusCount, statusPaymentText } = ReferralStatusContent(
    data,
  );

  return (
    <React.Fragment>
      {isAuthUser && (
        <div className="ReferralStatus">
          <h2 className="ReferralStatus__title">{statusTitle}</h2>
          <div className="ReferralStatus__description">{statusDescription}</div>
          <div className="ReferralStatus__container">
            <span className="ReferralStatus__container__total-count">{statusCount}</span>
            <span className="ReferralStatus__container__sort-by">sort by</span>
          </div>
          <div className="ReferralStatus__user-cards">cards here</div>
          <div className="ReferralStatus__payment-text">{statusPaymentText}</div>
        </div>
      )}
    </React.Fragment>
  );
};

const ReferralStatus = props => {
  const { match, isAuthenticated, getUserCards } = props;
  const name = match.params.name;

  useEffect(() => {
    getUserCards(name);
  }, []);

  const propsData = {
    username: name,
    isAuthUser: isAuthenticated,
  };
  return ReferralStatusView(propsData);
};

ReferralStatus.propTypes = {
  isAuthenticated: PropTypes.bool.isRequired,
  getUserCards: PropTypes.func,
};

ReferralStatus.defaultProps = {
  getUserCards: () => {},
};

const mapStateToProps = state => ({
  isAuthenticated: getIsAuthenticated(state),
});

export default injectIntl(
  connect(mapStateToProps, {
    getUserCards: getUserStatusCards,
  })(ReferralStatus),
);
