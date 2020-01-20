import React from 'react';
import PropTypes from 'prop-types';
import {Icon} from 'antd';
import {timeQuickForecastRemain} from "../../helpers/diffDateTime";

class BallotTimer extends React.PureComponent {
  state = {
    time: timeQuickForecastRemain(this.props.endTimerTime),
  };

  componentDidMount() {
    if(this.props.endTimerTime > Date.now()) {
      this.timer = setInterval(this.handleUpdateTimeRemain, 1000);
    }
  }

  componentWillUnmount() {
    clearInterval(this.timer);
  }

  handleUpdateTimeRemain = () => {
    if(this.props.endTimerTime > Date.now()) {
      this.setState({time: timeQuickForecastRemain(this.props.endTimerTime)});
    }
    else {
      clearInterval(this.timer);
      this.props.willCallAfterTimerEnd();
    }
  };

  render() {
    return (
      <React.Fragment>
          <span>
              <Icon type="clock-circle"/>&#160;
          </span>
        {this.state.time}
      </React.Fragment>
    )
  }
}

BallotTimer.propTypes = {
  endTimerTime: PropTypes.number,
  willCallAfterTimerEnd: PropTypes.func,
};

BallotTimer.defaultProps = {
  endTimerTime: 0,
  willCallAfterTimerEnd: () => {
  },
  replay: false,
};

export default BallotTimer;
