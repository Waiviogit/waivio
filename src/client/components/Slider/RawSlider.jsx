import React from 'react';
import PropTypes from 'prop-types';
import { Radio, Slider } from 'antd';
import './RawSlider.less';

const RadioButton = Radio.Button;
const RadioGroup = Radio.Group;

class RawSlider extends React.Component {
  static propTypes = {
    initialValue: PropTypes.number,
    tipFormatter: PropTypes.func,
    onChange: PropTypes.func,
    min: PropTypes.number,
    disabled: PropTypes.bool,
    oprtr: PropTypes.string,
  };

  static defaultProps = {
    initialValue: 100,
    tipFormatter: value => `${value}%`,
    onChange: () => {},
    min: 1,
    disabled: false,
    oprtr: '',
  };

  state = {
    value: 100,
  };

  componentWillMount() {
    this.setState({ value: this.props.initialValue });
  }

  componentWillReceiveProps(nextProps) {
    if (nextProps.initialValue !== this.props.initialValue) {
      this.setState({
        value: nextProps.initialValue,
      });
    }
  }

  marks = {
    1: `${this.props.oprtr}1%`,
    25: `${this.props.oprtr}25%`,
    50: `${this.props.oprtr}50%`,
    75: `${this.props.oprtr}75%`,
    100: `${this.props.oprtr}100%`,
  };

  handlePresetChange = event => {
    this.setState({ value: event.target.value }, () => {
      this.props.onChange(event.target.value);
    });
  };

  handleChange = value => {
    this.setState({ value }, () => {
      this.props.onChange(value);
    });
  };

  render() {
    const { value } = this.state;
    const { min, disabled, oprtr } = this.props;

    return (
      <div className="RawSlider">
        <Slider
          min={min}
          value={value}
          marks={this.marks}
          tipFormatter={this.props.tipFormatter}
          onChange={this.handleChange}
          disabled={disabled}
        />
        <div className="RawSlider__presets">
          <RadioGroup
            disabled={disabled}
            value={value}
            size="large"
            onChange={this.handlePresetChange}
          >
            {Object.keys(this.marks).map(percent => (
              <RadioButton key={percent} value={percent}>
                {oprtr}
                {percent}%
              </RadioButton>
            ))}
          </RadioGroup>
        </div>
      </div>
    );
  }
}

export default RawSlider;
