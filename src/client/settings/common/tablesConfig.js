import React from 'react';
import Cookie from 'js-cookie';

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
        <span className="VipTicketsSetting__note">{item.note}</span>{' '}
        <a role="presentation" onClick={() => setInformationForModal(item)}>
          ({intl.formatMessage(intlState)})
        </a>
      </div>
    );
  },
  link: item => {
    const hostname = typeof location !== 'undefined' ? location.hostname : '';
    const cookieValue = Cookie.get('allActiveSites');
    const activeSites =
      typeof cookieValue === 'string' && cookieValue !== 'undefined' ? JSON.parse(cookieValue) : [];

    const allSites = [...activeSites, 'https://www.waivio.com'];
    const siteName = `https://${hostname}/`;

    let waivioRedirect = `https://www.waivio.com/`;

    if (!siteName.includes('waivio.com') && allSites.includes(siteName)) {
      waivioRedirect = `https://www.waivio.com/?vipticket_redirect_url=${siteName}`;
    }

    return (
      <a
        href={`https://hiveonboard.com/create-account?ticket=${
          item.ticket
        }&redirect_url=${waivioRedirect.toString()}&creator=vancouverdining`}
      >
        {intl.formatMessage({
          id: 'apply',
          defaultMessage: 'apply',
        })}
      </a>
    );
  },
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
      id: 'vip_ticket_table_link',
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
