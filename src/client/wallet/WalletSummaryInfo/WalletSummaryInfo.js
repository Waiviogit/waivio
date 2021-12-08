import React from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { withRouter } from 'react-router';
import { isNil } from 'lodash';
import { FormattedMessage } from 'react-intl';
import { getUser } from '../../../store/usersStore/usersSelectors';
import USDDisplay from '../../components/Utils/USDDisplay';
import Loading from '../../components/Icon/Loading';
import HiveWalletSidebar from '../../components/Sidebar/WalletSidebar/HiveWalletSidebar';
import { HBD, HIVE, WAIV } from '../../../common/constants/cryptos';
import { isMobile } from '../../helpers/apiHelpers';
import './WalletSummaryInfo.less';

const WalletSummaryInfo = ({ estAccValue, children }) => {
  const isMobileDevice = isMobile();

  return (
    <React.Fragment>
      <div className="WalletSummaryInfo">
        {children}
        <div className="WalletSummaryInfo__item WalletSummaryInfo__estimateItem">
          <i className="iconfont icon-people_fill WalletSummaryInfo__icon" />
          <div className="WalletSummaryInfo__label">
            <FormattedMessage id="est_account_value" defaultMessage="Est. Account Value" />
          </div>
          <div className="WalletSummaryInfo__value">
            {isNil(estAccValue) || isNaN(estAccValue) ? (
              <Loading />
            ) : (
              <USDDisplay value={estAccValue} />
            )}
          </div>
        </div>
      </div>
      {isMobileDevice && <HiveWalletSidebar cryptos={[WAIV.symbol, HIVE.symbol, HBD.symbol]} />}
    </React.Fragment>
  );
};

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
