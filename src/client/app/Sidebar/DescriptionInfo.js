import React from 'react';
import PropTypes from 'prop-types';
import { injectIntl } from 'react-intl';
import { truncate } from '../../object/wObjectHelper';

@injectIntl
class DescriptionInfo extends React.Component {
  state = {
    showMore: true,
  };

  toggle = () =>
    this.setState(prevState => ({
      showMore: !prevState.showMore,
    }));

  render() {
    const { description, intl } = this.props;
    const { showMore } = this.state;

    return (
      <React.Fragment>
        {showMore ? truncate(description) : description}{' '}
        {description.length > 255 && (
          <a role="presentation" onClick={this.toggle}>
            {intl.formatMessage({
              id: showMore ? 'show_more' : 'show_less',
              defaultMessage: showMore ? 'View more' : 'View less',
            })}
          </a>
        )}
      </React.Fragment>
    );
  }
}

DescriptionInfo.propTypes = {
  description: PropTypes.string.isRequired,
  intl: PropTypes.shape().isRequired,
};

export default DescriptionInfo;
