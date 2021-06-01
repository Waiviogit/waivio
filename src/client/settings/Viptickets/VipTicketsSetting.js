import React, { useCallback, useEffect, useState } from 'react';
import { injectIntl } from 'react-intl';
import { connect } from 'react-redux';
import { Input, InputNumber, Modal } from 'antd';
import PropTypes from 'prop-types';
import { isNumber, debounce, isEmpty, size } from 'lodash';
import DynamicTbl from '../../components/Tools/DynamicTable/DynamicTable';
import Transfer from '../../wallet/Transfer/Transfer';
import CopyButton from '../../widgets/CopyButton/CopyButton';
import Loading from '../../components/Icon/Loading';
import {
  buttonsConfig,
  configActiveVipTicketTableHeader,
  configCreateAccountsTableHeader,
} from '../common/tablesConfig';
import {
  addNoteInTicket,
  getMoreVipTickets,
  getVipTickets,
} from '../../store/settingsStore/settingsActions';
import { openTransfer } from '../../store/walletStore/walletActions';
import {
  getActiveTickets,
  getConsumedTickets,
  getShowMoreActiveTickets,
  getShowMoreConsumedTickets,
  getTicketsPrice,
} from '../../store/settingsStore/settingsSelectors';

import './VipTicketsSetting.less';

const VipTicketsSetting = props => {
  const [countTickets, setCountTickets] = useState(null);
  const [activeTicketInfo, setActiveTicketInfo] = useState(null);
  const [loading, setLoading] = useState(true);
  const [note, setNote] = useState(null);
  const [showMoreLoading, setShowMoreLoading] = useState({});

  useEffect(() => {
    props.getVipTickets().then(() => setLoading(false));
  }, []);

  const handleNoteChange = useCallback(
    debounce(e => setNote(e), 300),
    [],
  );
  const setInformationForModal = item => {
    setActiveTicketInfo(item);
    setNote(item.note);
  };

  const handleSafeNote = () => {
    setLoading(true);
    props.addNoteInTicket(activeTicketInfo.ticket, note).then(() => {
      props.getVipTickets().then(() => {
        setLoading(false);
        setActiveTicketInfo(null);
      });
    });
  };

  const handleShowMoreTicket = (tickets, isActive = false) => {
    setShowMoreLoading({ [isActive ? 'active' : 'consumed']: true });

    return props.getMoreVipTickets(isActive, size(tickets)).then(() => {
      setShowMoreLoading({});
    });
  };

  const handleChangeAmount = e => {
    if (!e) setCountTickets(0);
    if (isNumber(e)) setCountTickets(e);
  };

  const handleClickPayNow = () =>
    props.openTransfer('waivio.vip', countTickets * props.price, 'HIVE', '', '', false, true);

  if (loading && isEmpty(props.activeTickets) && isEmpty(props.consumedTickets)) return <Loading />;

  return (
    <div className="VipTicketsSetting">
      <h1>
        {props.intl.formatMessage({
          id: 'create_new_account',
          defaultMessage: 'Create new Hive accounts',
        })}
      </h1>
      <p>
        {props.intl.formatMessage({
          id: 'create_new_account_protect',
          defaultMessage:
            'In order to protect Hive from spam, the blockchain witnesses have introduced a small one-time fee for new Hive accounts.',
        })}
      </p>
      <p>
        {props.intl.formatMessage({
          id: 'create_new_account_instruction',
          defaultMessage: 'When you open your first Hive account, you can do so',
        })}
        <a href="https://hiveonboard.com/create-account" rel="noreferrer" target="_blank">
          {' '}
          {props.intl.formatMessage({
            id: 'for_free',
            defaultMessage: 'for free',
          })}{' '}
        </a>
        {props.intl.formatMessage({
          id: 'create_new_account_instruction_part2',
          defaultMessage:
            'by confirming your mobile phone. But if you prefer an anonymous account or need additional accounts, you can do so by purchasing HiveOnBoard VIP tickets',
        })}
        .
      </p>
      <p>
        {props.intl.formatMessage({
          id: 'create_new_account_friends',
          defaultMessage:
            'You can also help your friends open Hive accounts by giving them VIP tickets.',
        })}
      </p>
      <p>
        {props.intl.formatMessage({
          id: 'create_new_account_hive_on_board',
          defaultMessage:
            'VIP tickets can be securely shared via email or other digital means, as they are valid for the activation of a single new account via',
        })}{' '}
        <a href="https://hiveonboard.com/" rel="noreferrer" target="_blank">
          HiveOnBoard.com
        </a>
        .
      </p>
      <p>
        {props.intl.formatMessage({
          id: 'create_new_account_how_used_ticket',
          defaultMessage:
            'Once the VIP ticket has been used, it will no longer be valid and will be archived in the second table.',
        })}
      </p>
      <div className="VipTicketsSetting__section">
        <h3>
          {props.intl.formatMessage({
            id: 'buy_vip_tickets',
            defaultMessage: 'Buy VIP tickets',
          })}
        </h3>
        <div>
          <InputNumber
            placeholder={props.intl.formatMessage({
              id: 'number_of_tickets',
              defaultMessage: '# of tickets',
            })}
            min={0}
            max={10}
            onChange={handleChangeAmount}
          />
          X {props.price} HIVE = <b>{countTickets * props.price}</b> HIVE
          <button className="VipTicketsSetting__pay" onClick={handleClickPayNow}>
            {props.intl.formatMessage({
              id: 'payment_card_pay_now',
              defaultMessage: 'Pay now',
            })}
          </button>
        </div>
      </div>
      <div className="VipTicketsSetting__section">
        <h3>
          {props.intl.formatMessage({
            id: 'active_vip_tickets',
            defaultMessage: 'Active VIP tickets',
          })}
        </h3>
        <DynamicTbl
          bodyConfig={props.activeTickets}
          header={configActiveVipTicketTableHeader}
          buttons={buttonsConfig(props.intl, setInformationForModal)}
          showMore={props.showMoreActiveTickets}
          loadingMore={showMoreLoading.active}
          handleShowMore={() => handleShowMoreTicket(props.activeTickets, true)}
        />
      </div>
      <div className="VipTicketsSetting__section">
        <div>
          <h3>
            {props.intl.formatMessage({
              id: 'used_vip_tickets',
              defaultMessage: 'Used VIP tickets',
            })}
          </h3>
          <DynamicTbl
            bodyConfig={props.consumedTickets}
            header={configCreateAccountsTableHeader}
            buttons={buttonsConfig(props.intl, setInformationForModal)}
            showMore={props.showMoreConsumedTickets}
            loadingMore={showMoreLoading.consumed}
            handleShowMore={() => handleShowMoreTicket(props.consumedTickets)}
          />
        </div>
      </div>
      <Transfer />
      {activeTicketInfo && (
        <Modal
          visible={activeTicketInfo.ticket}
          title={props.intl.formatMessage({
            id: 'share_ticket',
            defaultMessage: 'Share VIP ticket',
          })}
          onCancel={() => setActiveTicketInfo(null)}
          onOk={handleSafeNote}
          okText={props.intl.formatMessage({ id: 'save', defaultMessage: 'Save' })}
          okButtonProps={{ loading, disabled: loading || activeTicketInfo.note === note }}
        >
          <div className="VipTicketsSetting__modal-section">
            <h3>
              {props.intl.formatMessage({
                id: 'vip_ticket',
                defaultMessage: 'VIP ticket',
              })}
              :
            </h3>
            <CopyButton text={activeTicketInfo.ticket} />
          </div>
          <div className="VipTicketsSetting__modal-section">
            <h3>
              {props.intl.formatMessage({
                id: 'vip_ticket_link',
                defaultMessage: 'VIP ticket link:',
              })}
            </h3>
            <CopyButton
              text={`https://hiveonboard.com/create-account?ticket=${activeTicketInfo.ticket}&redirect_url=https%3A%2F%2Fwww.waivio.com`}
            />
          </div>
          <div className="VipTicketsSetting__modal-section">
            <h3>
              {props.intl.formatMessage({
                id: 'note',
                defaultMessage: 'Note',
              })}
              :
            </h3>
            <Input.TextArea
              defaultValue={activeTicketInfo.note}
              placeholder={props.intl.formatMessage({
                id: 'note_for_self',
                defaultMessage: 'Note to self',
              })}
              onChange={e => handleNoteChange(e.target.value)}
            />
          </div>
        </Modal>
      )}
    </div>
  );
};

VipTicketsSetting.propTypes = {
  intl: PropTypes.shape().isRequired,
  getVipTickets: PropTypes.func.isRequired,
  openTransfer: PropTypes.func.isRequired,
  addNoteInTicket: PropTypes.func.isRequired,
  getMoreVipTickets: PropTypes.func.isRequired,
  price: PropTypes.string.isRequired,
  showMoreActiveTickets: PropTypes.bool.isRequired,
  showMoreConsumedTickets: PropTypes.bool.isRequired,
  consumedTickets: PropTypes.arrayOf().isRequired,
  activeTickets: PropTypes.arrayOf().isRequired,
};

export default connect(
  state => ({
    activeTickets: getActiveTickets(state),
    consumedTickets: getConsumedTickets(state),
    price: getTicketsPrice(state),
    showMoreActiveTickets: getShowMoreActiveTickets(state),
    showMoreConsumedTickets: getShowMoreConsumedTickets(state),
  }),
  { getVipTickets, openTransfer, addNoteInTicket, getMoreVipTickets },
)(injectIntl(VipTicketsSetting));
