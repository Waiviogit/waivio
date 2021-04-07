import React, {useEffect, useState} from 'react';
import { injectIntl } from 'react-intl';
import { connect } from 'react-redux';
import { InputNumber } from 'antd';
import PropTypes from "prop-types";
import {isNumber} from "lodash";

import DynamicTbl from '../../components/Tools/DynamicTable/DynamicTable';
import {
  configActiveVipTicketTableHeader,
  configCreateAccountsTableHeader,
} from '../../websites/constants/tableConfig';
import { getTicketsInfo } from '../../store/reducers';
import { getVipTickets } from '../settingsActions';

import './VipTicketsSetting.less'

const VipTicketsSetting = props => {
  const [countTickets, setCountTickets] = useState(0);

  useEffect(() => {
    props.getVipTickets();
  }, []);

  const handleChangeAmount = e => {
    if(isNumber(e)) {
      console.log(e);
      setCountTickets(e);
    }
  }

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
        {props.intl.formatMessage(
          {
            id: 'create_new_account_instruction',
            defaultMessage:
              'When you open your first Hive account, you can do so {forFee} by confirming your mobile phone. But if you prefer an anonymous account or need additional accounts, you can do so by purchasing HiveOnBoard VIP tickets.',
          },
          {
            forFee: (
              <a href="https://hiveonboard.com/create-account">
                {props.intl.formatMessage({
                  id: 'for_fee',
                  defaultMessage: 'for fee',
                })}
              </a>
            ),
          },
        )}
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
            'VIP tickets can be securely shared via email or other digital means, as they are valid for the activation of a single new account via HiveOnBoard.com.',
        })}
      </p>
      <p>
        {props.intl.formatMessage({
          id: 'create_new_account_how_used_ticket',
          defaultMessage:
            'Once the VIP ticket has been used, it will no longer be valid and will be archived in the second table with a reference to the account created. You can delegate some Hive Power to new accounts, follow them and welcome them to the community.',
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
          X 5.00 HIVE = <b>{countTickets * 5}</b> HIVE
          <button className="VipTicketsSetting__pay">
            {props.intl.formatMessage({
              id: 'pay_now',
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
        <DynamicTbl bodyConfig={[]} header={configActiveVipTicketTableHeader} />
      </div>
    <div className="VipTicketsSetting__section">
      <div>
        <h3>
          {props.intl.formatMessage({
            id: 'used_vip_tickets',
            defaultMessage: 'Used VIP tickets',
          })}
        </h3>
        <DynamicTbl bodyConfig={[]} header={configCreateAccountsTableHeader} />
      </div>
    </div>
    </div>
  );
};

VipTicketsSetting.propTypes = {
  intl: PropTypes.shape().isRequired,
  getVipTickets: PropTypes.func.isRequired
};

export default connect(
  state => ({
    tickets: getTicketsInfo(state),
  }),
  { getVipTickets },
)(injectIntl(VipTicketsSetting));
