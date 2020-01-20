import React from 'react';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';
import { Icon } from 'antd';

import { toggleModal } from '../../redux/actions/modalsActions';

const GraphicCaller = ({disabled, quotes, id, quotesSettings, toggleModalCaller}) => (
  <button className="graphic"
          disabled={disabled}
          onClick={() => toggleModalCaller('openDeals',  {
            quote: quotes[id],
            quoteSettings: quotesSettings[id],
            platformName:"widgets",
            caller: 'od-op'
            })
          }>
    <Icon type="bar-chart" />
  </button>
);

const mapStateToProps = state => ({
  quotes: state.quotes,
  quotesSettings: state.quotesSettings,
});

const mapDispatchToProps = {
  toggleModalCaller: toggleModal,
};

GraphicCaller.propTypes = {
  toggleModalCaller: PropTypes.func.isRequired,
  quotes: PropTypes.shape().isRequired,
  quotesSettings: PropTypes.shape().isRequired,
  id: PropTypes.string.isRequired,
  disabled: PropTypes.bool,
};

GraphicCaller.defaultProps = {
  disabled: false,
};

export default connect(mapStateToProps, mapDispatchToProps)(GraphicCaller);
