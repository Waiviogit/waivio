import React, { useEffect } from 'react';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';

import { toggleModal } from '../../redux/actions/modalsActions';

const ChartCaller = ({ quotes, id, quotesSettings, toggleModalCaller, isModalOpen, setOpen }) => {
  useEffect(() => {
    toggleModalCaller('openDeals', {
      quote: quotes[id],
      quoteSettings: quotesSettings[id],
      platformName: 'widgets',
      caller: 'od-op',
    });
    setOpen(false);
  }, [isModalOpen]);

  return <span />;
};

const mapStateToProps = state => ({
  quotes: state.quotes,
  quotesSettings: state.quotesSettings,
});

const mapDispatchToProps = {
  toggleModalCaller: toggleModal,
};

ChartCaller.propTypes = {
  toggleModalCaller: PropTypes.func.isRequired,
  quotes: PropTypes.shape({}).isRequired,
  quotesSettings: PropTypes.shape({}).isRequired,
  id: PropTypes.string.isRequired,
  isModalOpen: PropTypes.bool.isRequired,
  setOpen: PropTypes.func.isRequired,
};

export default connect(mapStateToProps, mapDispatchToProps)(ChartCaller);
