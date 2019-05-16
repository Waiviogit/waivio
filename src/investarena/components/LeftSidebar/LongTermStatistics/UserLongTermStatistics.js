import React from 'react';
import _ from 'lodash';
import PropTypes from 'prop-types';
import {injectIntl} from "react-intl";
import './LongTermStatistics.less';
import * as ApiClient from "../../../../waivioApi/ApiClient";
import {getLongTermStatisticsForUser} from "../../../helpers/diffDateTime";

@injectIntl
class UserLongTermStatistics extends React.Component {
  static propTypes = {
    userName: PropTypes.string.isRequired,
    intl: PropTypes.shape().isRequired,
  };

  constructor(props) {
    super(props);
    this.state = {
      longTermStatistics: {},
    };
  }

  componentDidMount() {
          ApiClient.getUserLongTermStatistics(this.props.userName).then(data => {
            if (data && !_.isError(data)) {
            const longTermStatistics = getLongTermStatisticsForUser(data, this.props.intl);
              if (!_.isEmpty(data)) this.setState({ longTermStatistics });
            }
          });
        }

render() {
  return (
    <div className="InstrumentLongTermStatistics">
      <div className="InstrumentLongTermStatistics__title">{`Performance`}</div>
      <div>
        {!_.isEmpty(this.state.longTermStatistics) ? _.map(this.state.longTermStatistics, period => (
          <div className="PeriodStatisticsLine">
            <div className="PeriodStatisticsLine__periodName">{period.label}</div>
            <div className={`PeriodStatisticsLine__value-${period.isUp ? 'success' : 'danger'}`}>
              {period.price}
            </div>
          </div>
        )) : <div>
          The user has not written posts with forecasts
        </div>
        }
      </div>
    </div>
  );
};
}

export default UserLongTermStatistics;
