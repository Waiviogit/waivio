import React, { useEffect, useState } from 'react';
import { Modal, Tabs } from 'antd';
import { injectIntl } from 'react-intl';
import Cookie from 'js-cookie';
import PropTypes from 'prop-types';
import { Link } from 'react-router-dom';
import FirstStepImg from '@images/step_1.png';
import SecondStepImg from '@images/step_2.png';
import ThirdStepImg from '@images/step_3.png';
import './WebsiteWelcomeModal.less';

const WebsiteWelcomeModal = props => {
  const [tabKey, setTabKey] = useState('1');
  const [openModal, setOpenModal] = useState(false);

  useEffect(() => {
    const notShowWelcomeModal = Cookie.get('notShowWelcomeModal');

    if (!notShowWelcomeModal) setOpenModal(true);
  }, []);

  const handleOk = () => {
    if (tabKey < 3) {
      setTabKey(`${+tabKey + 1}`);
    }
  };

  const handlePrev = () => {
    if (tabKey > 1) {
      setTabKey(`${+tabKey - 1}`);
    }
  };

  const handleClose = () => {
    Cookie.set('notShowWelcomeModal', 'true');
    setOpenModal(false);
  };

  const buttonsState = [
    {
      ...(tabKey < 2
        ? {
            intl: { id: 'close', defaultMessage: 'Close' },
            handler: handleClose,
          }
        : {
            intl: { id: 'previous', defaultMessage: 'Previous' },
            handler: handlePrev,
          }),
      classList: 'WebsiteWelcomeModal__button WebsiteWelcomeModal__button--first',
    },
    {
      ...(tabKey === '3'
        ? {
            intl: { id: 'ok', defaultMessage: 'Ok' },
            handler: handleClose,
          }
        : { intl: { id: 'next', defaultMessage: 'Next' }, handler: handleOk }),
      classList: 'WebsiteWelcomeModal__button WebsiteWelcomeModal__button--second',
    },
  ];

  const footer = (
    <React.Fragment>
      {buttonsState.map(button => (
        <button key={button.intl.id} className={button.classList} onClick={button.handler}>
          {props.intl.formatMessage(button.intl)}
        </button>
      ))}
    </React.Fragment>
  );

  return (
    <Modal
      visible={openModal}
      onCancel={handleClose}
      title={props.intl.formatMessage({
        id: 'receive_restaurant_rebates',
        defaultMessage: 'Earn crypto every time you dine out!',
      })}
      className="WebsiteWelcomeModal"
      footer={footer}
    >
      <h3>
        {props.intl.formatMessage({ id: 'step', defaultMessage: 'Step' })} {tabKey}:
      </h3>
      <Tabs defaultActiveKey="1" activeKey={tabKey}>
        <Tabs.TabPane key="1" tab="1">
          <p className="WebsiteWelcomeModal__paragph">
            {props.intl.formatMessage({
              id: 'find_the_restaurant',
              defaultMessage: 'Find the restaurant and select the dish',
            })}
          </p>
          <img src={FirstStepImg} alt="" className="WebsiteWelcomeModal__img" />
        </Tabs.TabPane>
        <Tabs.TabPane key="2" tab="2">
          <p className="WebsiteWelcomeModal__paragph">
            {props.intl.formatMessage({
              id: 'reserve_rewards_few_days',
              defaultMessage: 'Reserve the reward for a few days',
            })}
          </p>
          <img src={SecondStepImg} alt="" className="WebsiteWelcomeModal__img" />
        </Tabs.TabPane>
        <Tabs.TabPane key="3" tab="3">
          <p className="WebsiteWelcomeModal__paragph">
            {props.intl.formatMessage({
              id: 'share_photos_of_the_dish',
              defaultMessage: 'Share photos of the dish and get the reward!',
            })}
          </p>
          <img src={ThirdStepImg} alt="" className="WebsiteWelcomeModal__img" />
        </Tabs.TabPane>
      </Tabs>
      <h3 className="WebsiteWelcomeModal__police-title">
        {props.intl.formatMessage({ id: 'privacy_notice', defaultMessage: 'Privacy Notice' })}:
      </h3>
      <p className="WebsiteWelcomeModal__police">
        {props.intl.formatMessage({
          id: 'cookies_experience',
          defaultMessage:
            'We use cookies to improve user experience. By using this site, you consent to the use of cookies. Learn more about website',
        })}{' '}
        <Link to="/object/uid-cookies-policy/page" target="_blank">
          {props.intl.formatMessage({
            id: 'cookies_policy_modal',
            defaultMessage: 'Cookies Policy',
          })}
        </Link>
        ,{' '}
        <Link to="/object/poi-privacy-policy/page" target="_blank">
          {props.intl.formatMessage({
            id: 'privacy_policy_modal',
            defaultMessage: 'Privacy Policy',
          })}
        </Link>
        ,{' '}
        <Link to="/object/xrj-terms-and-conditions/page" target="_blank">
          {props.intl.formatMessage({
            id: 'terms_and_conditions_modal',
            defaultMessage: 'Terms and Conditions',
          })}
        </Link>
      </p>
    </Modal>
  );
};

WebsiteWelcomeModal.propTypes = {
  intl: PropTypes.shape({
    formatMessage: PropTypes.func,
  }).isRequired,
};

export default injectIntl(WebsiteWelcomeModal);
