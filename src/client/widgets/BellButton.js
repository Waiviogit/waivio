import React from 'react';
import { Icon, Tooltip } from 'antd';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';
import { isEmpty } from 'lodash';
import { FormattedMessage } from 'react-intl';
import { bellNotifications } from '../../store/userStore/userActions';
import { wobjectBellNotification } from '../../store/wObjectStore/wobjActions';
import { getAuthenticatedUserName } from '../../store/authStore/authSelectors';

import './widgetsStyle.less';
import { isMobile } from '../../common/helpers/apiHelpers';

const BellButton = ({
  bellUserNotifications,
  authUserName,
  user,
  wobj,
  bellWobjNotification,
  isSocialProduct,
}) => {
  const type = !isEmpty(wobj) ? wobj : user;
  const bellStyle = type.bell ? 'bell-active' : 'bell';
  const tooltipTitle = <FormattedMessage id="receive_news" defaultMessage="Receive news" />;

  const bellNotification = () => {
    if (!isEmpty(wobj.author_permlink)) {
      return bellWobjNotification(wobj.author_permlink);
    }

    return bellUserNotifications(authUserName, user.name);
  };
  const bellButtonElement = (
    <div onClick={bellNotification} className="UserHeader__bell" role="presentation">
      {type.bellLoading ? (
        <Icon type="loading" />
      ) : (
        <Icon type="bell" theme="filled" className={bellStyle} />
      )}
    </div>
  );

  return !isMobile() ? (
    <Tooltip
      placement="topLeft"
      title={tooltipTitle}
      overlayClassName={isSocialProduct ? 'SocialBellButtonContainer' : 'BellButtonContainer'}
    >
      {bellButtonElement}
    </Tooltip>
  ) : (
    bellButtonElement
  );
};

BellButton.propTypes = {
  user: PropTypes.shape({
    name: PropTypes.string,
    bellLoading: PropTypes.bool,
    bell: PropTypes.bool,
  }),
  bellUserNotifications: PropTypes.func.isRequired,
  authUserName: PropTypes.string,
  isSocialProduct: PropTypes.bool,
  wobj: PropTypes.shape(),
  bellWobjNotification: PropTypes.func.isRequired,
};

BellButton.defaultProps = {
  user: {
    name: '',
    bellLoading: false,
    bell: false,
  },
  authUserName: '',
  wobj: {},
};

export default connect(
  state => ({
    authUserName: getAuthenticatedUserName(state),
  }),
  {
    bellUserNotifications: bellNotifications,
    bellWobjNotification: wobjectBellNotification,
  },
)(BellButton);
