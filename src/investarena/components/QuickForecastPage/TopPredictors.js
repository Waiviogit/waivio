import React from 'react';

import './TopPredictions.less';

const TopPredictors = props => {
  const mockUsers = [{userName: 'dgdfdf'}, {userName: 'dgdfdf'}];
  return (
    <div className="top-predictors">

      <div className="top-predictors__title">
        Top 5 Users
      </div>
      <div className="top-predictors__content">
        {
          mockUsers.map(user => (
            <div key={Math.random()} className="top-predictors__tab">
              {user.userName}
            </div>
          ))
        }
      </div>
    </div>
  )};

export default TopPredictors;
