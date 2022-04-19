import React from 'react';
import PropTypes from 'prop-types';
import { withRouter } from 'react-router';
import { injectIntl } from 'react-intl';
import { isNumber } from 'lodash';
import classNames from 'classnames';
import { Tooltip } from 'antd';
import Avatar from '../../components/Avatar';
import TransferButton from './TransferButton';
import ArrowSmallIcon from '@icons/arrowSmall.svg'
import './PaymentCard.less';

const PaymentCard = props => {
  const name = props.paymentInfo.userName || props.paymentInfo.guideName;

  const notPayedPeriodClassList = classNames('PaymentCard__notPayedPeriod', {
    'PaymentCard__notPayedPeriod--expired': props.paymentInfo.notPayedPeriod >= 21,
  });
  const handleSetUser = () => {
    props.history.push(props.path);
  };

  const handleClick = e => {
    e.preventDefault();
    e.stopPropagation();
    props.history.push(`/@${name}`);
  };

  return (
    <div className="PaymentCard" onClick={handleSetUser} role="presentation">
      <div className="PaymentCard__content" onClick={handleClick} role="presentation">
        <Avatar username={name} size={40} />
        <div className="PaymentCard__content-name-wrap">
          <div className="PaymentCard__content-name-wrap-alias"> {props.paymentInfo.alias}</div>
          <div className="PaymentCard__content-name-wrap-row">
            <div className="PaymentCard__content-name-wrap-row-name">{`@${name}`}</div>
          </div>
        </div>
      </div>
      <div className="PaymentCard__end-wrap">
        {isNumber(props.paymentInfo.notPayedPeriod) && (
          <span className={notPayedPeriodClassList}>{props.paymentInfo.notPayedPeriod}d</span>
        )}
        <div className="PaymentCard__content-name-wrap-row-pay">
          <TransferButton payable={props.paymentInfo.payable} name={name} match={props.match} />
          <div className="PaymentCard__end-wrap-icon">
            <Tooltip
              title={props.intl.formatMessage(
                {
                  id: 'payment_card_your_payment_history_with_user',
                  defaultMessage: 'Your payment history with {username}',
                },
                { username: name },
              )}
            >
              {/* eslint-disable-next-line jsx-a11y/no-noninteractive-element-interactions */}
              <img
                src={ArrowSmallIcon}
                alt="Payments history"
                onClick={handleSetUser}
              />
            </Tooltip>
          </div>
        </div>
      </div>
    </div>
  );
};

PaymentCard.propTypes = {
  intl: PropTypes.shape().isRequired,
  paymentInfo: PropTypes.shape({
    payable: PropTypes.number.isRequired,
    userName: PropTypes.string.isRequired,
    guideName: PropTypes.string.isRequired,
    alias: PropTypes.string,
    notPayedPeriod: PropTypes.number,
  }),
  history: PropTypes.shape().isRequired,
  path: PropTypes.string.isRequired,
  match: PropTypes.shape().isRequired,
};

PaymentCard.defaultProps = {
  paymentInfo: {},
};

export default withRouter(injectIntl(PaymentCard));
