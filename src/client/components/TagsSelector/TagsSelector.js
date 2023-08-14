import React, { Component } from 'react';
import PropTypes from 'prop-types';
import classNames from 'classnames';
import { Select } from 'antd';

class TagsSelector extends Component {
  static propTypes = {
    className: PropTypes.string,
    disabled: PropTypes.bool,
    label: PropTypes.string,
    defaultHashtag: PropTypes.string,
    placeholder: PropTypes.string,
    tags: PropTypes.arrayOf(PropTypes.string).isRequired,
    onChange: PropTypes.func.isRequired,
    validator: PropTypes.func,
  };
  static defaultProps = {
    className: '',
    disabled: false,
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
    const { label, placeholder, tags, defaultHashtag, className, disabled } = this.props;
    const currentURL = window.location.href.includes('objects-filters');

    if (!currentURL) {
      if (defaultHashtag) tags.unshift(defaultHashtag);
      if (!tags.includes('waivio')) tags.unshift('waivio');
    }

    return (
      <div className={classNames('tags-selector', { [className]: Boolean(className) })}>
        {label && <div className="tags-selector__label">{label}</div>}
        <Select
          mode="tags"
          style={{ width: '100%' }}
          disabled={disabled}
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
