import { isEmpty } from 'lodash';
import React from 'react';
import PropTypes from 'prop-types';
import { injectIntl } from 'react-intl';
import { Breadcrumb } from 'antd';
import classNames from 'classnames';
import { getFieldWithMaxWeight } from '../../object/wObjectHelper';
import { getBreadCrumbText } from '../rewardsHelper';
import '../Rewards.less';

const rewardText = {
  all: { id: 'all', defaultMessage: 'All' },
  active: { id: 'eligible', defaultMessage: 'Eligible' },
  reserved: { id: 'reserved', defaultMessage: 'Reserved' },
  history: { id: 'history', defaultMessage: 'History' },
  created: { id: 'created', defaultMessage: 'Created' },
  messages: { id: 'messages', defaultMessage: 'Messages' },
};

const RewardBreadcrumb = ({ intl, filterKey, reqObject, location }) => {
  const isCorrectFilter = !!rewardText[filterKey];
  const objName = !isEmpty(reqObject) ? getFieldWithMaxWeight(reqObject, 'name') : null;
  const breadCrumbText = `${
    isCorrectFilter ? getBreadCrumbText(intl, location, filterKey, rewardText) : ''
  } ${
    filterKey !== 'history'
      ? intl.formatMessage({
          id: 'rewards',
          defaultMessage: 'rewards',
        })
      : ''
  }`;

  return (
    <div className={classNames('RewardBreadcrumb', { 'ml3 mb3': !isEmpty(reqObject) })}>
      <Breadcrumb separator={'>'}>
        {objName ? (
          <React.Fragment>
            <Breadcrumb.Item href={`/rewards/${filterKey}`}>{breadCrumbText}</Breadcrumb.Item>
            <Breadcrumb.Item>{objName}</Breadcrumb.Item>
          </React.Fragment>
        ) : (
          <Breadcrumb.Item>{breadCrumbText}</Breadcrumb.Item>
        )}
      </Breadcrumb>
    </div>
  );
};

RewardBreadcrumb.propTypes = {
  intl: PropTypes.shape().isRequired,
  reqObject: PropTypes.shape(),
  filterKey: PropTypes.string,
  location: PropTypes.string,
};

RewardBreadcrumb.defaultProps = {
  filterKey: '',
  reqObject: {},
  location: '',
};

export default injectIntl(RewardBreadcrumb);
