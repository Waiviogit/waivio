import React from 'react';
import PropTypes from 'prop-types';
import './UserInstrumentsTable.less';
import InstrumentAvatar from '../../../../investarena/components/InstrumentAvatar';
import classNames from 'classnames';

const UserInstrumentsTableRow = ({ forecast }) => {
  return (
    <div className="UserInstrumentsTableRow">
      <div className="UserInstrumentsTableRow__instruments">
        <InstrumentAvatar
          avatarlink={forecast.wobjData.avatarlink}
          market={forecast.market}
          permlink={forecast.wobjData.author_permlink}
        />
        {forecast.name}
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
