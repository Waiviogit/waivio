import React from 'react';
import { injectIntl } from 'react-intl';

const VipTicketsSetting = props => (
  <div>
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
        id: 'create_new_account_protect',
        defaultMessage:
          'When you open your first Hive account, you can do so for free (https://hiveonboard.com/create-account) by confirming your mobile phone. But if you prefer an anonymous account or need additional accounts, you can do so by purchasing HiveOnBoard VIP tickets.',
      })}
    </p>
  </div>
);

export default injectIntl(VipTicketsSetting);
