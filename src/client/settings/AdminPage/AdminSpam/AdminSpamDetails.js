import React, { useEffect, useState } from 'react';
import PropTypes from 'prop-types';
import { isEmpty } from 'lodash';
import { useHistory } from 'react-router';
import { useDispatch } from 'react-redux';
import moment from 'moment/moment';
import Loading from '../../../components/Icon/Loading';
import { getHtml } from '../../../components/Story/Body';
import { setLinkSafetyInfo } from '../../../../store/wObjectStore/wobjActions';

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
  const dispatch = useDispatch();

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

  const openLink = e => {
    const anchor = e.target.closest('a');

    if (anchor) {
      e.preventDefault();
      e.stopPropagation();
      const href = anchor.getAttribute('href');

      dispatch(setLinkSafetyInfo(href));
    }
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
      {details?.map((d, index) => {
        const body =
          expandedItems[index] || d.body.length <= 300 ? d.body : `${d.body.slice(0, 300)}`;

        return (
          // eslint-disable-next-line react/no-array-index-key
          <div key={index}>
            {index === 0 && <h3 className={'mb3'}>{d.account}</h3>}
            <div>
              <b>{moment(d.createdAt).format('MMMM DD, YYYY')}</b>
              <div>
                <b>Reason: </b>
                <div>{d.reason}</div>
              </div>
              <div>
                <b>Content: </b>
                <span onClick={openLink} className={'AdminPage__details-body'}>
                  {getHtml(body, {}, 'Object')}
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
                    Show more records
                  </span>
                )}
              </div>
            )}
          </div>
        );
      })}
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
