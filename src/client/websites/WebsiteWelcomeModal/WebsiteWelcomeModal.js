import React, { useEffect, useState } from 'react';
import { Modal, Tabs } from 'antd';
import { injectIntl } from 'react-intl';
import Cookie from 'js-cookie';
import PropTypes from 'prop-types';

import './WebsiteWelcomeModal.less';

const WebsiteWelcomeModal = props => {
  const [tabKey, setTabKey] = useState('1');
  const [openModal, setOpenModal] = useState(false);
  const notShowWelcomeModal = Cookie.get('notShowWelcomeModal');

  useEffect(() => {
    if (!notShowWelcomeModal) setOpenModal(true);
  }, [notShowWelcomeModal]);

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
        defaultMessage: 'How To Receive Restaurant Rebates',
      })}
      className="WebsiteWelcomeModal"
      footer={footer}
    >
      <h3>
        {props.intl.formatMessage({ id: 'step', defaultMessage: 'Step' })} {tabKey}:
      </h3>
      <Tabs defaultActiveKey="1" activeKey={tabKey}>
        <Tabs.TabPane key="1">
          <p>
            {props.intl.formatMessage({
              id: 'find_the_restaurant',
              defaultMessage: 'Find the restaurant and select the dish',
            })}
          </p>
          <img src={'/images/tab_1.png'} alt="" className="WebsiteWelcomeModal__img" />
        </Tabs.TabPane>
        <Tabs.TabPane key="2">
          <p>
            {props.intl.formatMessage({
              id: 'reserve_rewards_few_days',
              defaultMessage: 'Reserve the reward for a few days',
            })}
          </p>
          <img src={'/images/tab_2.png'} alt="" className="WebsiteWelcomeModal__img" />
        </Tabs.TabPane>
        <Tabs.TabPane key="3">
          <p>
            {props.intl.formatMessage({
              id: 'share_photos_of_the_dish',
              defaultMessage: 'Share photos of the dish and get the reward!',
            })}
          </p>
          <img src={'/images/tab_3.png'} alt="" className="WebsiteWelcomeModal__img" />
        </Tabs.TabPane>
      </Tabs>
      <h3>
        {props.intl.formatMessage({ id: 'privacy_notice', defaultMessage: 'Privacy Notice' })}:
      </h3>
      <p>
        {props.intl.formatMessage({
          id: 'cookies_experience',
          defaultMessage:
            'We use cookies to improve user experience. By using this site, you consent to the use of cookies. Learn more about website',
        })}{' '}
        <a href="https://.dining.gifts/object/uid-cookies-policy/page">
          {props.intl.formatMessage({
            id: 'cookies_policy_modal',
            defaultMessage: 'Cookies Policy',
          })}
        </a>
        ,{' '}
        <a href="https://.dining.gifts/object/poi-privacy-policy/page">
          {props.intl.formatMessage({
            id: 'privacy_policy_modal',
            defaultMessage: 'Privacy Policy',
          })}
        </a>
        ,{' '}
        <a href="https://*.dining.gifts/object/xrj-terms-and-conditions/page">
          {props.intl.formatMessage({
            id: 'terms_and_conditions_modal',
            defaultMessage: 'Terms and Conditions',
          })}
        </a>
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
