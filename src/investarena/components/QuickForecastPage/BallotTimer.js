import React from 'react';
import PropTypes from 'prop-types';

export default class BallotTimer extends React.PureComponent {
  state = {
    hours: this.props.hours,
    minutes: this.props.minutes,
    seconds: this.props.seconds,
  };

  componentDidMount() {
    setInterval(this.startTimer, 1000);
  }

  startTimer = () => {
    if (this.state.seconds === 0) {
      this.setState((prevState) => ({
        minutes: prevState.minutes - 1,
        seconds: 59,
      }));
    } else {
      this.setState((prevState) => ({
        seconds: prevState.seconds - 1,
      }));
    }

    if (this.state.seconds === 0 && this.state.minutes === 0) {
      if(this.state.hours !== 0) {
        this.setState({
          hours: this.state.hours - 1,
          minutes: 59,
          seconds: 59,
        });
      }

      this.setState({
        minutes: 5,
        seconds: 0,
      });

      //send request get new forecast
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

BallotTimer.propsType = {
  hours: PropTypes.number,
  minutes: PropTypes.number,
  seconds: PropTypes.number,
};

BallotTimer.defaultProps = {
  hours: 0,
  minutes: 5,
  seconds: 0,
};

