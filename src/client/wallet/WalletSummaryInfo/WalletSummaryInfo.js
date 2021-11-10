import React from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { withRouter } from 'react-router';
import { FormattedMessage } from 'react-intl';
import { getUser } from '../../../store/usersStore/usersSelectors';
import USDDisplay from '../../components/Utils/USDDisplay';
import Loading from '../../components/Icon/Loading';

import './WalletSummaryInfo.less';

const WalletSummaryInfo = ({ estAccValue, children }) => (
  <div className="WalletSummaryInfo">
    {children}
    <div className="WalletSummaryInfo__item WalletSummaryInfo__estimateItem">
      <i className="iconfont icon-people_fill WalletSummaryInfo__icon" />
      <div className="WalletSummaryInfo__label">
        <FormattedMessage id="est_account_value" defaultMessage="Est. Account Value" />
      </div>
      <div className="WalletSummaryInfo__value">
        {estAccValue ? <USDDisplay value={estAccValue} /> : <Loading />}
      </div>
    </div>
  </div>
);

WalletSummaryInfo.propTypes = {
  estAccValue: PropTypes.number,
  children: PropTypes.node.isRequired,
};

WalletSummaryInfo.defaultProps = {
  estAccValue: 0,
};

export default connect((state, ownProps) => ({
  user: getUser(state, ownProps.userName),
}))(withRouter(WalletSummaryInfo));
