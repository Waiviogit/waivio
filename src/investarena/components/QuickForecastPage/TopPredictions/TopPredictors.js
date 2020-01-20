import React from 'react';
import PropTypes from 'prop-types';
import {Link} from 'react-router-dom';
import {injectIntl} from 'react-intl';

import Avatar from '../../../../client/components/Avatar';

import './TopPredictions.less';

const TopPredictors = ({title, userList, showMore, activeUser, handleShowMore, intl}) => {
  const myNameInTopFive = userList.some(user => user.name === activeUser.name);

  return (
    <div className="top-predictors">
      <div className="top-predictors__title">
        <span>{title}</span>
        <i className="iconfont icon-Dollar"/>
      </div>
      <div className="top-predictors__content">
        {
          userList.map(user => (
            <div key={Math.random()} className="top-predictors__tab">
              <Link className="top-predictors__link" to={`/@${user.name}`}>
                <div className="top-predictors__flex-wrapper">
                  <Avatar username={user.name} size={34}/>
                  <span className="top-predictors__user-name">{user.name}</span>
                </div>
              </Link>
              {
                user.successful_suppose >= 0 && (
                  <span className="top-predictors__present">{user.successful_suppose}</span>)
              }
              {
                user.reward >= 0 && (
                  <span className="top-predictors__reward">+{user.reward}</span>)
              }
            </div>
          ))
        }
        {
          showMore && (
            <button className="top-predictors__show-more" onClick={() => handleShowMore()}>
              {
                intl.formatMessage({
                  id: 'show_more_winners',
                  defaultMessage: 'Show more winners'
                })
              }
            </button>
          )
        }
        {
          activeUser.name && !myNameInTopFive && (
            <React.Fragment>
              <div className="top-predictors__tab top-predictors__tab--text-center">
                ...
              </div>
              <div className="top-predictors__tab">
                <Link className="top-predictors__link" to={`/@${activeUser.name}`}>
                  <div className="top-predictors__flex-wrapper">
                    <Avatar username={activeUser.name} size={34}/>
                    <span className="top-predictors__user-name">{activeUser.name}</span>
                  </div>
                </Link>
                <span className="top-predictors__present">{activeUser.successful_suppose}</span>
              </div>
            </React.Fragment>
          )
        }
      </div>
    </div>
  )
};

TopPredictors.propTypes = {
  title: PropTypes.string.isRequired,
  userList: PropTypes.arrayOf(PropTypes.shape({
    name: PropTypes.string,
    successful_suppose: PropTypes.oneOfType([PropTypes.number, PropTypes.string]),
    reward: PropTypes.number,
  })).isRequired,
  showMore: PropTypes.bool,
  activeUser: PropTypes.shape({
    name: PropTypes.string,
    successful_suppose: PropTypes.number,
  }),
  handleShowMore: PropTypes.func,
  intl: PropTypes.shape({
    formatMessage: PropTypes.func,
  }).isRequired,
};

TopPredictors.defaultProps = {
  showMore: false,
  activeUser: '',
  handleShowMore: () => {
  },
};

export default injectIntl(TopPredictors);
