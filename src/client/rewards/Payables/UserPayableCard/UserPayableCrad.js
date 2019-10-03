import React from 'react';
import PropTypes from 'prop-types';
import { withRouter } from 'react-router';
import { injectIntl } from 'react-intl';
import { Link } from 'react-router-dom';
import { Icon } from 'antd';
import Avatar from '../../../components/Avatar';
import './UserPayableCard.less';

const UserPayableCard = ({ intl, user, setPaymentUser, history }) => {
  const handleSetUser = () => {
    setPaymentUser(user.userName);
    history.push(`/rewards/payables/@${user.userName}`);
  };
  return (
    <div className="UserPayableCard">
      <div className="UserPayableCard__content">
        <Avatar username={user.userName} size={40} />
        <div className="UserPayableCard__content-name-wrap">
          <div className="UserPayableCard__content-name-wrap-alias"> {user.aliasName}</div>
          <div className="UserPayableCard__content-name-wrap-row">
            <div className="UserPayableCard__content-name-wrap-row-name">{`@${user.userName}`}</div>
            <div className="UserPayableCard__content-name-wrap-row-pay">
              <Link to={'/rewards/pay-now'}>
                {intl.formatMessage({
                  id: 'payables_page_pay_now',
                  defaultMessage: 'Pay now',
                })}
              </Link>
            </div>
          </div>
        </div>
      </div>
      <div className="UserPayableCard__end-wrap">
        <div className="UserPayableCard__end-wrap-payable">
          {' '}
          {`${user.payable && user.payable.toFixed(2)} SBD`}
        </div>
        <div className="UserPayableCard__end-wrap-icon">
          <Icon type="right" onClick={handleSetUser} />
        </div>
      </div>
    </div>
  );
};

UserPayableCard.propTypes = {
  intl: PropTypes.shape().isRequired,
  setPaymentUser: PropTypes.func.isRequired,
  user: PropTypes.shape().isRequired,
  history: PropTypes.shape().isRequired,
};

export default withRouter(injectIntl(UserPayableCard));
