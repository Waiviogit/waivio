import React from 'react';

import PropTypes from 'prop-types';
import { Link } from 'react-router-dom';
import { injectIntl } from 'react-intl';

import Avatar from '../../../../client/components/Avatar';

import './TopPredictions.less';

const TopPredictors = ({ title, userList, showMore, activeUser, handleShowMore, intl, top }) => {
  const myNameInTopFive = userList.some(user => user.name === activeUser.name);

  return (
    <div className="TopPredictors">
      <div className="TopPredictors__title">
        <span>{title}</span>
        <i className="iconfont icon-Dollar" />
      </div>
      <div className="TopPredictors__content">
        {userList.map(user => (
          <div key={user.name} className="TopPredictors__tab">
            <Link className="TopPredictors__link" to={`/@${user.name}`}>
              <div className="TopPredictors__flex-wrapper">
                <Avatar username={user.name} size={34} />
                <span className="TopPredictors__user-name" title={user.name}>
                  {user.name}
                </span>
              </div>
            </Link>
            {user.successful_suppose >= 0 && (
              <span className="TopPredictors__present">{user.successful_suppose}</span>
            )}
            {user.reward >= 0 && (
              <span className="TopPredictors__reward" title={user.reward}>
                +{user.reward.toFixed(3)}
              </span>
            )}
          </div>
        ))}
        {showMore && (
          <button className="TopPredictors__show-more" onClick={() => handleShowMore()}>
            {intl.formatMessage({
              id: 'show_more_winners',
              defaultMessage: 'Show more winners',
            })}
          </button>
        )}
        {activeUser.name && !myNameInTopFive && top && (
          <React.Fragment>
            <div className="TopPredictors__tab TopPredictors__tab--text-center">...</div>
            <div className="TopPredictors__tab">
              <Link className="TopPredictors__link" to={`/@${activeUser.name}`}>
                <div className="TopPredictors__flex-wrapper">
                  <Avatar username={activeUser.name} size={34} />
                  <span className="TopPredictors__user-name">{activeUser.name}</span>
                </div>
              </Link>
              <span className="TopPredictors__present">{activeUser.successful_suppose}</span>
            </div>
          </React.Fragment>
        )}
      </div>
    </div>
  );
};

TopPredictors.propTypes = {
  title: PropTypes.string.isRequired,
  userList: PropTypes.arrayOf(
    PropTypes.shape({
      name: PropTypes.string,
      successful_suppose: PropTypes.oneOfType([PropTypes.number, PropTypes.string]),
      reward: PropTypes.number,
    }),
  ).isRequired,
  showMore: PropTypes.bool,
  activeUser: PropTypes.shape({
    name: PropTypes.string,
    successful_suppose: PropTypes.number,
  }),
  top: PropTypes.bool,
  handleShowMore: PropTypes.func,
  intl: PropTypes.shape({
    formatMessage: PropTypes.func,
  }).isRequired,
};

TopPredictors.defaultProps = {
  authorization: false,
  showMore: false,
  top: false,
  activeUser: '',
  handleShowMore: () => {},
};

export default injectIntl(TopPredictors);
