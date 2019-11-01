import React from 'react';
import PropTypes from 'prop-types';
import { Link } from 'react-router-dom';
import InstrumentAvatar from '../../../../investarena/components/InstrumentAvatar';
import classNames from 'classnames';
import './UserInstrumentsTable.less';

const UserInstrumentsTableRow = ({ forecast }) => {
  return (
    <div className="UserInstrumentsTableRow">
      <div className="UserInstrumentsTableRow__instruments">
        <div className="UserInstrumentsTableRow__instruments-icon">
          <InstrumentAvatar
            avatarlink={forecast.wobjData.avatarlink}
            market={forecast.market}
            permlink={forecast.wobjData.author_permlink}
          />
        </div>
        <Link
          to={`/object/${forecast.wobjData.author_permlink}`}
          className="st-post-sell-buy-quote"
        >
          {forecast.name}
        </Link>
      </div>
      <div className="UserInstrumentsTableRow__deals">{forecast.count}</div>
      <div
        className={classNames('UserInstrumentsTableRow__profit', {
          success: forecast.pips > 0,
          unsuccess: forecast.pips < 0,
        })}
      >
        {forecast.pips}
      </div>
    </div>
  );
};

UserInstrumentsTableRow.propTypes = {
  forecast: PropTypes.shape().isRequired,
};

export default UserInstrumentsTableRow;
