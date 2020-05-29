import React, { useState } from 'react';
import PropTypes from 'prop-types';
import { FormattedMessage, injectIntl } from 'react-intl';
import SortSelector from '../../components/SortSelector/SortSelector';
import './Messages.less';
// import ApiClient from "../../../waivioApi/ApiClient";

const Messages = ({ intl }) => {
  const [sort, setSort] = useState('Inquiry date');
  // const [rewards, setRewards] = useState([]);
  const [loadingRewards, setLoadingRewards] = useState(false);
  // const getRewards = ({ user, sortBy }) => {
  //   ApiClient.getRewards({userName: user, sort: sortBy}).then(newRewards => {
  //     setLoadingRewards(false);
  //     setRewards([...rewards, newRewards]);
  //   })
  // };
  const handleSortChange = sortBy => {
    setLoadingRewards(true);
    setSort(sortBy);
    // getRewards({ userName, sort: sortBy });
  };
  console.log('loadingRewards', loadingRewards);
  return (
    <div className="Messages">
      <React.Fragment>
        <div className="Messages__wrap">
          <div className="Messages__wrap-title">
            {intl.formatMessage({
              id: 'messages',
              defaultMessage: 'Messages',
            })}{' '}
            :
          </div>
        </div>
        <SortSelector sort={sort} onChange={handleSortChange}>
          <SortSelector.Item key="Inquiry date">
            <FormattedMessage id="inquiry_date" defaultMessage="Inquiry date">
              {msg => msg}
            </FormattedMessage>
          </SortSelector.Item>
          <SortSelector.Item key="date">
            <FormattedMessage id="latest" defaultMessage="Latest">
              {msg => msg}
            </FormattedMessage>
          </SortSelector.Item>
          <SortSelector.Item key="proximity">
            <FormattedMessage id="paymentTable_reservation" defaultMessage="Reservation">
              {msg => msg}
            </FormattedMessage>
          </SortSelector.Item>
        </SortSelector>
      </React.Fragment>
    </div>
  );
};

Messages.propTypes = {
  intl: PropTypes.shape().isRequired,
  // userName: PropTypes.string.isRequired,
};

export default injectIntl(Messages);
