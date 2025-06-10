import React, { useEffect, useState } from 'react';
import PropTypes from 'prop-types';
import { isEmpty } from 'lodash';
import { useHistory } from 'react-router';
import moment from 'moment/moment';
import Loading from '../../../components/Icon/Loading';

const AdminSpamDetails = ({
  loadDetails,
  details,
  hasMoreDetails,
  setShowDetails,
  getMoreDetails,
  setDetails,
}) => {
  const [expandedItems, setExpandedItems] = useState({});
  const history = useHistory();

  useEffect(() => {
    if (!history?.location?.pathname?.includes('/admin-spam')) setShowDetails(false);
  }, [history?.location?.pathname]);

  const onBackBtnClick = () => {
    setShowDetails(false);
    setExpandedItems({});
    setDetails([]);
  };

  useEffect(() => () => onBackBtnClick(), []);

  const toggleExpand = index => {
    setExpandedItems(prev => ({
      ...prev,
      [index]: !prev[index],
    }));
  };

  return isEmpty(details) ? (
    <Loading />
  ) : (
    <div>
      <div className={'flex justify-end'}>
        <div className="main-color-button" onClick={onBackBtnClick}>
          Back
        </div>
      </div>
      {details?.map((d, index) => (
        // eslint-disable-next-line react/no-array-index-key
        <div key={index}>
          {index === 0 && <h3 className={'mb3'}>{d.account}</h3>}
          <div>
            <b>{moment(d.createdAt).format('MMMM DD, YYYY')}</b>
            <div>
              <b>Reason: </b>
              <span>{d.reason}</span>
            </div>
            <div>
              <b>Content: </b>
              <span>
                {expandedItems[index] || d.body.length <= 300 ? d.body : `${d.body.slice(0, 300)}`}
              </span>
              {d.body.length > 300 && (
                <span
                  className="main-color-button ml-2 cursor-pointer"
                  onClick={() => toggleExpand(index)}
                >
                  {expandedItems[index] ? 'Show less' : 'Show more'}
                </span>
              )}
            </div>
            <br />
          </div>
          {hasMoreDetails && index === details.length - 1 && (
            <div className={'flex justify-center'}>
              {loadDetails ? (
                <Loading />
              ) : (
                <span className="main-color-button" onClick={() => getMoreDetails(d.account)}>
                  {' '}
                  Show more details
                </span>
              )}
            </div>
          )}
        </div>
      ))}
    </div>
  );
};

AdminSpamDetails.propTypes = {
  details: PropTypes.shape(),
  setShowDetails: PropTypes.func,
  setDetails: PropTypes.func,
  getMoreDetails: PropTypes.func,
  hasMoreDetails: PropTypes.bool,
  loadDetails: PropTypes.bool,
};

export default AdminSpamDetails;
