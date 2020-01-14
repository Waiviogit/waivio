import React from 'react';
import PropTypes from 'prop-types';

class BallotTimer extends React.PureComponent {
  state = {
    hours: this.props.hours,
    minutes: this.props.minutes,
    seconds: this.props.seconds,
  };

  componentDidMount() {
    if (this.state.minutes > 0) {
      this.intervalID = setInterval(this.startTimer, 1000);
    }
  }

  componentWillUnmount() {
    clearInterval(this.intervalID);
  }

  intervalID;

  startTimer = () => {
    if (this.state.seconds === 0) {
      this.setState(prevState => ({
        minutes: prevState.minutes - 1,
        seconds: 59,
      }));
    } else {
      this.setState((prevState) => ({
        seconds: prevState.seconds - 1,
      }));
    }

    if (this.state.seconds === 0 && this.state.minutes === 0) {
      if (this.state.hours !== 0) {
        this.setState({
          hours: this.state.hours - 1,
          minutes: 59,
          seconds: 59,
        });
      }

      if (this.props.replay) {
        this.setState({
          hours: this.props.hours,
          minutes: this.props.minutes,
          seconds: this.props.seconds,
        });
      } else {
        clearInterval(this.intervalID);
      }



      this.props.willCallAfterTimerEnd();
    }
  };

  render() {

    return (
      <React.Fragment>
        {
          !!this.state.hours && (
            <span className="minute">{this.state.hours <= 9 ? `0${this.state.hours}` : this.state.hours}h&#160;</span>
          )
        }
        <span className="minute">{this.state.minutes <= 9 ? `0${this.state.minutes}` : this.state.minutes}m&#160;</span>
        <span className="seconds">{this.state.seconds <= 9 ? `0${this.state.seconds}` : this.state.seconds}s</span>
      </React.Fragment>
    )
  }
}

BallotTimer.propTypes = {
  hours: PropTypes.number,
  minutes: PropTypes.number,
  seconds: PropTypes.number,
  willCallAfterTimerEnd: PropTypes.func,
  replay: PropTypes.bool,
};

BallotTimer.defaultProps = {
  hours: 0,
  minutes: 0,
  seconds: 0,
  willCallAfterTimerEnd: () => {
  },
  replay: false,
};

export default BallotTimer;
