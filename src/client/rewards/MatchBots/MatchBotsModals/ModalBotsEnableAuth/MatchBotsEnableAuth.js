import { message, Modal } from 'antd';
import * as React from 'react';
import PropTypes from 'prop-types';
import { isEmpty, omit } from 'lodash';
import { Link } from 'react-router-dom';
import { injectIntl } from 'react-intl';

import { MATCH_BOTS_NAMES, redirectAuthHiveSigner } from '../../../../helpers/matchBotsHelpers';

const ModalBotsEnableAuth = ({
  isAuthority,
  modalBot,
  intl,
  setModalBot,
  type,
  botType,
  toggleEnableAuthorBot,
}) => {
  const setContent = () => {
    if (!isAuthority)
      return intl.formatMessage({
        id: 'matchBot_match_bot_requires_authorization_distribute_votes_behalf',
        defaultMessage: 'The match bot requires authorization to distribute votes on your behalf',
      });
    if (!modalBot.enabled)
      return (
        <div>
          {intl.formatMessage({ id: `matchBot_success_intention_rule_activation_${type}` })}{' '}
          <Link to={`/@${modalBot.name}`}>{` @${modalBot.name}`}</Link>?
        </div>
      );

    return (
      <div>
        {intl.formatMessage({ id: `matchBot_success_intention_rule_inactivation_${type}` })}{' '}
        <Link to={`/@${modalBot.name}`}>{` @${modalBot.name}`}</Link>?
      </div>
    );
  };

  const handleCancel = () => setModalBot(null);

  const handleOkModal = () => {
    if (!isAuthority) {
      return redirectAuthHiveSigner(isAuthority, botType);
    }
    const bot = omit({ ...modalBot, enabled: !modalBot.enabled, type }, '_id');

    setModalBot(null);

    return toggleEnableAuthorBot(bot)
      .then(() => {
        if (type === MATCH_BOTS_NAMES.AUTHORS) {
          message.success(
            intl.formatMessage({
              id: 'matchBot_success_updated_author',
              defaultMessage: 'Author was successfully updated',
            }),
          );
        } else if (type === MATCH_BOTS_NAMES.CURATORS) {
          message.success(
            intl.formatMessage({
              id: 'matchBot_success_updated_curator',
              defaultMessage: 'Curator was successfully updated',
            }),
          );
        }
      })
      .catch(() =>
        message.error(
          intl.formatMessage({
            id: 'append_validate_common_message',
            defaultMessage: 'Something went wrong',
          }),
        ),
      );
  };

  return (
    modalBot && (
      <Modal
        onCancel={handleCancel}
        onOk={handleOkModal}
        okText={intl.formatMessage({ id: isAuthority ? 'confirm' : 'matchBot_authorize_now' })}
        title={intl.formatMessage({
          id: isAuthority ? 'matchBot_success_rule_activation' : 'matchBot_authorization_required',
        })}
        cancelText={intl.formatMessage({ id: 'cancel', defaultMessage: 'Cancel' })}
        visible={!isEmpty(modalBot)}
      >
        {setContent()}
      </Modal>
    )
  );
};

ModalBotsEnableAuth.propTypes = {
  modalBot: PropTypes.shape(),
  intl: PropTypes.shape().isRequired,
  botType: PropTypes.string.isRequired,
  isAuthority: PropTypes.bool.isRequired,
  setModalBot: PropTypes.func.isRequired,
  toggleEnableAuthorBot: PropTypes.func.isRequired,
  type: PropTypes.oneOf(['curator', 'author']).isRequired,
};

ModalBotsEnableAuth.defaultProps = {
  modalBot: null,
};

export default injectIntl(ModalBotsEnableAuth);
