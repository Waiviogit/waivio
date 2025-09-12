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
    this.state = {
      deletedTags: [],
    };
    this.handleTopicsChange = this.handleTopicsChange.bind(this);
    this.deleteTopic = this.deleteTopic.bind(this);
  }

  handleTopicsChange(tags) {
    const { validator } = this.props;
    const updatedTopics = validator ? tags.filter(t => validator(t)) : tags;

    this.props.onChange(updatedTopics);
  }
  deleteTopic(tag) {
    const updatedTopics = this.props.tags.filter(t => t !== tag);
    const isTagDeleted = this.state.deletedTags?.includes(tag);

    this.setState(prevState => ({
      deletedTags: isTagDeleted ? prevState.deletedTags : [...prevState.deletedTags, tag],
    }));
    this.props.onChange(updatedTopics);
  }

  render() {
    const { label, placeholder, tags, defaultHashtag, className, disabled } = this.props;
    const { deletedTags } = this.state;
    const currentURL = window && window.location.href?.includes('objects-filters');

    if (!currentURL) {
      if (
        !tags?.includes(defaultHashtag) &&
        defaultHashtag &&
        !deletedTags?.includes(defaultHashtag)
      ) {
        tags.unshift(defaultHashtag);
      }
      if (!tags?.includes('waivio') && !deletedTags?.includes('waivio')) {
        tags.unshift('waivio');
      }
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
          onDeselect={this.deleteTopic}
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
