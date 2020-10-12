import React from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { injectIntl } from 'react-intl';
import { withRouter } from 'react-router';
import { SponsoredRewardsContent } from '../ReferralTextHelper';
import SponsoredRewardsHeader from '../constants';

import './SponsoredRewards.less';

const SponsoredRewards = props => {
  const { match, intl } = props;
  const data = { username: match.params.name };
  const { sponsoredRewardsTitle } = SponsoredRewardsContent(data);
  return (
    <div className="SponsoredRewards">
      <h2 className="SponsoredRewards__title">{sponsoredRewardsTitle}</h2>
      <div className="SponsoredRewards__table">
        <table style={{ width: '100%' }}>
          <thead>
            <tr>
              {SponsoredRewardsHeader.map(tdElement => (
                <th key={tdElement.id} className={tdElement.className}>
                  {intl.formatMessage({
                    id: tdElement.id,
                    defaultMessage: tdElement.message,
                  })}
                </th>
              ))}
            </tr>
          </thead>
        </table>
      </div>
    </div>
  );
};

SponsoredRewards.propTypes = {
  match: PropTypes.shape(),
  intl: PropTypes.shape().isRequired,
};

SponsoredRewards.defaultProps = {
  match: {},
};

const mapStateToProps = state => {
  // eslint-disable-next-line no-unused-expressions
  state;
};

export default connect(mapStateToProps, null)(withRouter(injectIntl(SponsoredRewards)));
