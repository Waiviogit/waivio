import _ from 'lodash';
import React from 'react';
import PropTypes from 'prop-types';
import { injectIntl } from 'react-intl';
import { Breadcrumb } from 'antd';
import { getFieldWithMaxWeight } from '../../object/wObjectHelper';
import '../Rewards.less';

const rewardText = {
  all: { id: 'all', defaultMessage: 'all' },
  active: { id: 'eligible', defaultMessage: 'eligible' },
  reserved: { id: 'reserved', defaultMessage: 'reserved' },
  history: { id: 'history', defaultMessage: 'history' },
  created: { id: 'created', defaultMessage: 'created' },
};
const RewardBreadcrumb = ({ intl, filterKey, reqObject }) => {
  const isCorrectFilter = !!rewardText[filterKey];
  const objName = !_.isEmpty(reqObject) ? getFieldWithMaxWeight(reqObject, 'name') : null;
  const breadCrumbText = `${
    isCorrectFilter ? intl.formatMessage(rewardText[filterKey]) : ''
  } ${intl.formatMessage({
    id: 'rewards',
    defaultMessage: 'rewards',
  })}`;
  return (
    <div className="RewardBreadcrumb">
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
  filterKey: PropTypes.string.isRequired,
};

RewardBreadcrumb.defaultProps = {
  filterKey: '',
  reqObject: {},
};

export default injectIntl(RewardBreadcrumb);
