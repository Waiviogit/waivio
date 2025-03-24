import React, { useEffect, useState } from 'react';
import { useSelector } from 'react-redux';
import { injectIntl } from 'react-intl';
import { isEmpty } from 'lodash';
import PropTypes from 'prop-types';
import { Link } from 'react-router-dom';
import { getSubscriptionsByAdminList } from '../../../../waivioApi/ApiClient';
import { getAuthenticatedUserName } from '../../../../store/authStore/authSelectors';
import { subscriptionsConfig } from '../../../newRewards/constants/adminPageConfigs';

import PayPalSubscription from '../../../websites/WebsiteTools/PayPal/PayPalSubscription';

const AdminSubscriptions = ({ intl }) => {
  const authUserName = useSelector(getAuthenticatedUserName);
  const [subscriptions, setSubscriptions] = useState([]);
  const [host, setHost] = useState(undefined);

  useEffect(() => {
    getSubscriptionsByAdminList(authUserName).then(r => {
      setSubscriptions(r);
    });
  }, [authUserName]);

  return (
    <div>
      <div className={'AdminPage__title-wrap'}>
        <div className={'AdminPage__title'}>Websites with PayPal subscriptions</div>
      </div>
      {!isEmpty(subscriptions) && (
        <table className="DynamicTable">
          <thead>
            {subscriptionsConfig.map((row, rowIndex) => (
              // eslint-disable-next-line react/no-array-index-key
              <tr key={`row-${rowIndex}`}>
                {row.map((column, colIndex) => {
                  if (!column.intl || !column.id) return null;

                  return (
                    <th
                      // eslint-disable-next-line react/no-array-index-key
                      key={`column-${colIndex}`}
                      rowSpan={column.rowspan || 1}
                      colSpan={column.colspan || 1}
                    >
                      {intl.formatMessage(column.intl)}
                    </th>
                  );
                })}
              </tr>
            ))}
          </thead>
          <tbody>
            {subscriptions.map(row => {
              const rowSpan = row.websites.length;

              return (
                <React.Fragment key={row.userName}>
                  {row.websites.map((website, index) => (
                    <tr key={website.host || index}>
                      {/* Shared cells are rendered only for the first website */}
                      {index === 0 && (
                        <>
                          <td rowSpan={rowSpan}>
                            <Link to={`/@${row.userName}`}>{row.userName}</Link>
                          </td>
                        </>
                      )}
                      {/* Website-specific cells */}
                      <td>
                        {website.status === 'active' ? (
                          <a href={`https://${website.host}`} target="_blank" rel="noreferrer">
                            {website.host}
                          </a>
                        ) : (
                          website.host
                        )}
                      </td>

                      <td>{website.status}</td>

                      <td>
                        {/* eslint-disable-next-line jsx-a11y/interactive-supports-focus */}
                        <a
                          role="button"
                          className="DynamicTable__delete"
                          onClick={() => setHost(website.host)}
                        >
                          details
                        </a>
                      </td>
                    </tr>
                  ))}
                </React.Fragment>
              );
            })}
          </tbody>
        </table>
      )}
      {host && <PayPalSubscription host={host} setHost={setHost} isSubscribe={false} />}
    </div>
  );
};

AdminSubscriptions.propTypes = {
  intl: PropTypes.shape(),
};

export default injectIntl(AdminSubscriptions);
