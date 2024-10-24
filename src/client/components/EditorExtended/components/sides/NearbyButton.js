import React, { useState } from 'react';
import { injectIntl } from 'react-intl';
import PropTypes from 'prop-types';
import MapObjectImport from '../../../../websites/MapObjectImport/MapObjectImport';

const NearbyButton = ({ intl }) => {
  const [showImportModal, setShowImportModal] = useState(false);

  const setShowImport = () => {
    setShowImportModal(true);
  };
  const closeImportModal = () => {
    setShowImportModal(false);
  };

  return (
    <div>
      <button className="md-sb-button action-btn" onClick={setShowImport}>
        <img
          style={{ width: '26px', marginTop: '2px', marginLeft: '2px' }}
          src="/images/import-icon.svg"
          alt="aim"
          className="action-btn__caption"
        />
        <span className="action-btn__caption">
          {intl.formatMessage({ id: 'nearby', defaultMessage: 'Nearby' })}
        </span>
      </button>
      <MapObjectImport showImportModal={showImportModal} closeModal={closeImportModal} />
    </div>
  );
};

NearbyButton.propTypes = {
  intl: PropTypes.shape().isRequired,
};

export default injectIntl(NearbyButton);
