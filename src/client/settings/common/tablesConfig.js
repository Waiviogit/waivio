import React from 'react';

export const buttonsConfig = (intl, setInformationForModal) => ({
  ticket: item => {
    const intlState = item.note
      ? {
          id: 'edit_note',
          defaultMessage: 'edit note',
        }
      : {
          id: 'add_note',
          defaultMessage: 'add note',
        };

    return (
      <div className="VipTicketsSetting__add-note">
        {item.note}{' '}
        <a role="presentation" onClick={() => setInformationForModal(item)}>
          ({intl.formatMessage(intlState)})
        </a>
      </div>
    );
  },
  link: item => (
    <a
      href={`https://hiveonboard.com/create-account?ticket=${item.ticket}&redirect_url=https%3A%2F%2Fwww.waivio.com`}
    >
      {intl.formatMessage({
        id: 'apply',
        defaultMessage: 'apply',
      })}
    </a>
  ),
  share: item => (
    <a role="presentation" onClick={() => setInformationForModal(item)}>
      {intl.formatMessage({
        id: 'details_tickets',
        defaultMessage: 'details',
      })}
    </a>
  ),
});

export const configActiveVipTicketTableHeader = [
  {
    id: 'createdAt',
    intl: {
      id: 'purchased',
      defaultMessage: 'Purchased',
    },
  },
  {
    id: 'ticket',
    intl: {
      id: 'vip_ticket',
      defaultMessage: 'VIP ticket',
    },
  },
  {
    id: 'link',
    intl: {
      id: 'link',
      defaultMessage: 'Link',
    },
  },
  {
    id: 'share',
    intl: {
      id: 'share_tickets',
      defaultMessage: 'Share',
    },
  },
];

export const configCreateAccountsTableHeader = [
  {
    id: 'createdAt',
    intl: {
      id: 'purchased',
      defaultMessage: 'Purchased',
    },
  },
  {
    id: 'ticket',
    intl: {
      id: 'vip_ticket',
      defaultMessage: 'VIP ticket',
    },
  },
];

export default null;
