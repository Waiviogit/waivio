import React from 'react';
import { Button, Modal } from 'antd';
import { FormattedMessage } from 'react-intl';
import PropTypes from 'prop-types';
import Cookie from 'js-cookie';
import { connect } from 'react-redux';
import { toggleBots } from '../../../store/authStore/authActions';
import { MATCH_BOTS_TYPES, redirectAuthHiveSigner } from '../../../common/helpers/matchBotsHelpers';
import {
  getGuestAuthority,
  getIsConnectMatchBot,
  isGuestUser,
} from '../../../store/authStore/authSelectors';

const errorMessages = {
  notEnoughPower: {
    trigger: 'Not enough vote power',
    message:
      'A minimum of $10 worth of WAIV Power is required to perform data import. Please power up some WAIV to continue.',
  },
  noAuthorization: {
    trigger:
      'There is no data import authorization. Please go to the Data Import page and activate it.',
    message:
      'Please authorize the Data Import bot to post object updates on the Hive blockchain. You can include the Authorize button here for convenience. The Ok button can be replaced with Cancel.',
  },
};

const ImportErrorModal = ({
  closeImportModal,
  showImportModal,
  usersState,
  isAuthority,
  isGuest,
  toggleImportBots,
}) => {
  const errorKey = Object.keys(errorMessages).find(
    key => usersState?.message === errorMessages[key].trigger,
  );

  const mess = errorKey ? errorMessages[errorKey].message : usersState?.message;

  const isAuthError = errorMessages.noAuthorization.trigger === usersState?.message;
  const handleRedirect = () => {
    if (Cookie.get('auth') || isGuest) {
      toggleImportBots(MATCH_BOTS_TYPES.IMPORT, isAuthority);
    } else {
      redirectAuthHiveSigner(isAuthority, MATCH_BOTS_TYPES.IMPORT);
    }
  };

  return (
    <Modal
      onCancel={closeImportModal}
      footer={[
        <Button key="Ok" type="primary" onClick={isAuthError ? handleRedirect : closeImportModal}>
          <FormattedMessage
            id={isAuthError ? 'authorize' : 'ok'}
            defaultMessage={isAuthError ? 'Authorize' : 'Ok'}
          />
        </Button>,
      ]}
      visible={showImportModal}
      title={'Data import for Nearby'}
    >
      <p className={'flex justify-center'}>{mess}</p>
    </Modal>
  );
};

ImportErrorModal.propTypes = {
  closeImportModal: PropTypes.func.isRequired,
  showImportModal: PropTypes.func.isRequired,
  toggleImportBots: PropTypes.func.isRequired,
  usersState: PropTypes.shape().isRequired,
  isAuthority: PropTypes.bool.isRequired,
  isGuest: PropTypes.bool.isRequired,
};

const mapStateToProps = (state, props) => {
  const isGuest = isGuestUser(state);

  return {
    isAuthority: isGuest ? getGuestAuthority(state) : getIsConnectMatchBot(state, props),
    isGuest: isGuestUser(state),
  };
};
const mapDispatchToProps = {
  toggleImportBots: toggleBots,
};

export default connect(mapStateToProps, mapDispatchToProps)(ImportErrorModal);
