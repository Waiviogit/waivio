import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { injectIntl } from 'react-intl';

@injectIntl
class ExpandingBlock extends Component {
  static propTypes = {
    /* from decorators */
    intl: PropTypes.shape().isRequired,
    /* passed props */
    entities: PropTypes.arrayOf(PropTypes.oneOfType([PropTypes.node, PropTypes.string])).isRequired,
    minLines: PropTypes.number,
    className: PropTypes.string,
  };
  static defaultProps = {
    minLines: 3,
    className: '',
  };

  constructor(props) {
    super(props);

    this.state = {
      hasExpandBtn: props.minLines < props.entities.length,
      isExpanded: false,
    };
  }

  getMarkup = entity => {
    if (typeof entity === 'string') {
      return <div key={entity}>{entity}</div>;
    }
    return entity;
  };

  toggle = () =>
    this.setState(prevState => ({
      isExpanded: !prevState.isExpanded,
    }));

  render() {
    const { entities, minLines, className, intl } = this.props;
    const { isExpanded, hasExpandBtn } = this.state;
    const renderEntities =
      !isExpanded && minLines < entities.length ? entities.slice(0, minLines - 1) : entities;

    return (
      <React.Fragment>
        <div className={`expanding-block ${className}`}>
          {renderEntities.map(entity => this.getMarkup(entity))}
        </div>
        {hasExpandBtn ? (
          <a role="presentation" onClick={this.toggle}>
            {intl.formatMessage({
              id: isExpanded ? 'show_less' : 'show_more',
              defaultMessage: isExpanded ? 'View less' : 'View more',
            })}
          </a>
        ) : null}
      </React.Fragment>
    );
  }
}

export default ExpandingBlock;
