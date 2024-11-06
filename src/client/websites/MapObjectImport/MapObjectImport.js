import React from 'react';
import PropTypes from 'prop-types';
import MapObjectImportModal from './MapObjectImportModal';
import ImportErrorModal from './ImportErrorModal';

const MapObjectImport = ({
  closeModal,
  showImportModal,
  usersState,
  initialMapSettings,
  isEditor,
}) => (
  <div>
    {usersState?.result ? (
      <MapObjectImportModal
        isEditor={isEditor}
        initialMapSettings={initialMapSettings}
        closeImportModal={closeModal}
        showImportModal={showImportModal}
      />
    ) : (
      <ImportErrorModal
        usersState={usersState}
        closeImportModal={closeModal}
        showImportModal={showImportModal}
      />
    )}
  </div>
);

MapObjectImport.propTypes = {
  closeModal: PropTypes.func.isRequired,
  showImportModal: PropTypes.bool.isRequired,
  isEditor: PropTypes.bool,
  usersState: PropTypes.shape().isRequired,
  initialMapSettings: PropTypes.shape().isRequired,
};
export default MapObjectImport;