import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { Select } from 'antd';

class TagsSelector extends Component {
  static propTypes = {
    label: PropTypes.string,
    placeholder: PropTypes.string,
    tags: PropTypes.arrayOf(PropTypes.string).isRequired,
    onChange: PropTypes.func.isRequired,
    validator: PropTypes.func,
  };
  static defaultProps = {
    label: '',
    tags: [],
    placeholder: '',
    onChange: () => {},
    validator: null,
  };

  constructor(props) {
    super(props);
    this.handleTopicsChange = this.handleTopicsChange.bind(this);
  }

  handleTopicsChange(tags) {
    const { validator } = this.props;
    const updatedTopics = validator ? tags.filter(t => validator(t)) : tags;
    this.props.onChange(updatedTopics);
  }

  render() {
    const { label, placeholder, tags } = this.props;
    return (
      <div className="tags-selector">
        {label && <div className="tags-selector__label">{label}</div>}
        <Select
          mode="tags"
          style={{ width: '100%' }}
          placeholder={placeholder}
          dropdownStyle={{ display: 'none' }}
          tokenSeparators={[' ', ',']}
          value={tags}
          onChange={this.handleTopicsChange}
        >
          {tags.map(tag => (
            <Select.Option key={tag}>{tag}</Select.Option>
          ))}
        </Select>
      </div>
    );
  }
}

export default TagsSelector;
