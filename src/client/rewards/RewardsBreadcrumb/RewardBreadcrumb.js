import { isEmpty } from 'lodash';
import React from 'react';
import { Link } from 'react-router-dom';
import PropTypes from 'prop-types';
import { injectIntl } from 'react-intl';
import { Breadcrumb } from 'antd';
import classNames from 'classnames';
import { getObjectName } from '../../helpers/wObjectHelper';
import { getBreadCrumbText, getSessionData, widgetUrlConstructor } from '../rewardsHelper';
import '../Rewards.less';

const rewardText = {
  all: { id: 'all', defaultMessage: 'All' },
  active: { id: 'eligible', defaultMessage: 'Eligible' },
  reserved: { id: 'reserved', defaultMessage: 'Reserved' },
  history: { id: 'history', defaultMessage: 'History' },
  created: { id: 'created', defaultMessage: 'Created' },
  messages: { id: 'messages', defaultMessage: 'Messages' },
};

const RewardBreadcrumb = ({ intl, filterKey, reqObject, location, match }) => {
  const isCorrectFilter = !!rewardText[filterKey];
  const objName = getObjectName(reqObject);
  const widgetLink = getSessionData('isWidget');
  const userName = getSessionData('userName');
  const ref = getSessionData('refUser');
  const widgetUrl = widgetUrlConstructor(widgetLink, userName, ref);

  let url = `/rewards/${filterKey}`;
  if (widgetLink) url += `/${widgetUrl}`;

  const breadCrumbText = `${
    isCorrectFilter ? getBreadCrumbText(intl, location, filterKey, rewardText, match) : ''
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
            <Breadcrumb.Item>
              <Link to={url}>{breadCrumbText}</Link>
            </Breadcrumb.Item>
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
  match: PropTypes.shape(),
};

RewardBreadcrumb.defaultProps = {
  filterKey: '',
  reqObject: {},
  location: '',
  match: {},
};

export default injectIntl(RewardBreadcrumb);
