import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { Collapse } from 'antd';
import { injectIntl } from 'react-intl';

@injectIntl
class AdvanceSettings extends Component {
  static propTypes = {
    intl: PropTypes.shape().isRequired,
  };
  render() {
    const { intl } = this.props;
    return (
      <Collapse>
        <Collapse.Panel
          header={intl.formatMessage({
            id: 'advance_settings',
            defaultMessage: 'Advance settings',
          })}
        >
          Settings will be here
        </Collapse.Panel>
      </Collapse>
    );
  }
}

export default AdvanceSettings;
