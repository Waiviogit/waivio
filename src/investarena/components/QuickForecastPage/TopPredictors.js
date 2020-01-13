import React from 'react';
import PropTypes from 'prop-types';
import {Link} from 'react-router-dom';

import Avatar from '../../../client/components/Avatar';

import './TopPredictions.less';

const TopPredictors = ({title, userList, showMore, activeUser}) => {
  const myNameInTopFive = userList.some(user => user.userName === activeUser);

  return (
    <div className="top-predictors">
      <div className="top-predictors__title">
        <span>{title}</span>
      </div>
      <div className="top-predictors__content">
        {
          userList.map(user => (
            <div key={Math.random()} className="top-predictors__tab">
                <Link className="top-predictors__link" to={`/@${user.userName}`}>
                  <div className="top-predictors__flex-wrapper">
                  <Avatar username={user.userName} size={34}/>
                  <span className="top-predictors__user-name">{user.userName}</span>
                  </div>
                </Link>
              {
                user.guessed && (
                <span className="top-predictors__present">{user.guessed}</span>)
              }
              {
                user.reward && (
                <span className="top-predictors__reward">+{user.reward}</span>)
              }
            </div>
          ))
        }
        {
          showMore && (
            <button className="top-predictors__show-more" onClick={() => console.log('show more')}>
              ShowMore
            </button>
          )
        }
        {
          activeUser && !myNameInTopFive && (
            <React.Fragment>
              <div className="top-predictors__tab top-predictors__tab--text-center">
              ...
            </div>
                <div className="top-predictors__tab">
                  <Link className="top-predictors__link" to={`/@${activeUser}`}>
                  <div className="top-predictors__flex-wrapper">
                      <Avatar username={activeUser} size={34}/>
                      <span className="top-predictors__user-name">{activeUser}</span>
                  </div>
                  </Link>
                  <span className="top-predictors__present">15</span>
                </div>
            </React.Fragment>
          )
        }
      </div>
    </div>
  )};

TopPredictors.propTypes = {
  title: PropTypes.string.isRequired,
  userList: PropTypes.arrayOf(PropTypes.shape({
    userName: PropTypes.string,
    guessed: PropTypes.oneOfType([PropTypes.number, PropTypes.string])
  })).isRequired,
  showMore: PropTypes.bool,
  activeUser: PropTypes.string,
};

TopPredictors.defaultProps = {
  showMore: false,
  activeUser: '',
};

export default TopPredictors;
