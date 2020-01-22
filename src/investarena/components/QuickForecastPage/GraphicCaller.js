import React, { useEffect } from 'react';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';

import { toggleModal } from '../../redux/actions/modalsActions';

const GraphicCaller = ({ quotes, id, quotesSettings, toggleModalCaller, onOpenModal }) => {
  useEffect(() => {
    toggleModalCaller('openDeals', {
      quote: quotes[id],
      quoteSettings: quotesSettings[id],
      platformName: 'widgets',
      caller: 'od-op',
    });
  }, [onOpenModal]);

  return <span />;
};

const mapStateToProps = state => ({
  quotes: state.quotes,
  quotesSettings: state.quotesSettings,
});

const mapDispatchToProps = {
  toggleModalCaller: toggleModal,
};

GraphicCaller.propTypes = {
  toggleModalCaller: PropTypes.func.isRequired,
  quotes: PropTypes.shape({}).isRequired,
  quotesSettings: PropTypes.shape({}).isRequired,
  id: PropTypes.string.isRequired,
  onOpenModal: PropTypes.bool.isRequired,
};

export default connect(mapStateToProps, mapDispatchToProps)(GraphicCaller);
