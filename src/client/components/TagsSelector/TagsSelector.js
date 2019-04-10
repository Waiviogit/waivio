import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { Select } from 'antd';

class TagsSelector extends Component {
  static propTypes = {
    label: PropTypes.string,
    topics: PropTypes.arrayOf(PropTypes.string),
    placeholder: PropTypes.string,
    onChange: PropTypes.func,
    // validator: PropTypes.func,
  };
  static defaultProps = {
    label: '',
    topics: [],
    placeholder: '',
    onChange: () => {},
    // validator: null,
  };

  constructor(props) {
    super(props);

    this.state = {
      topics: props.topics,
    };
  }

  handleTopicsChange = topics => {
    this.setState({ topics });
    this.props.onChange(topics);
  };

  render() {
    const { topics } = this.state;
    const { label, placeholder } = this.props;
    return (
      <div className="tags-selector">
        {label && <div className="tags-selector__label">{label}</div>}
        <Select
          mode="tags"
          style={{ width: '100%' }}
          placeholder={placeholder}
          dropdownStyle={{ display: 'none' }}
          tokenSeparators={[' ', ',']}
          onChange={this.handleTopicsChange}
        >
          {topics.map(topic => (
            <Select.Option key={topic}>{topic}</Select.Option>
          ))}
        </Select>
      </div>
    );
  }
}

export default TagsSelector;
