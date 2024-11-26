import React, { useState } from 'react';
import { injectIntl } from 'react-intl';
import { useHistory } from 'react-router';
import { Icon } from 'antd';
import PropTypes from 'prop-types';
import { isNil } from 'lodash';
import { useSelector } from 'react-redux';
import MapObjectImport from '../../../../websites/MapObjectImport/MapObjectImport';
import { hasAccessToImport } from '../../../../../waivioApi/importApi';
import { getAuthenticatedUserName } from '../../../../../store/authStore/authSelectors';

const NearbyButton = ({ intl, close, parentPost }) => {
  const [showImportModal, setShowImportModal] = useState(false);
  const [loading, setLoading] = useState(false);
  const [usersState, setUsersState] = useState(null);
  const authUserName = useSelector(getAuthenticatedUserName);
  const history = useHistory();
  const isComment = !history?.location?.pathname?.includes('editor');
  const setShowImport = () => {
    setLoading(true);
    hasAccessToImport(authUserName).then(r => {
      setUsersState(r);
      setLoading(false);
    });

    setShowImportModal(true);
  };
  const closeImportModal = () => {
    close();
    setShowImportModal(false);
  };

  return (
    <div>
      <button className="md-sb-button action-btn" onClick={setShowImport}>
        {loading ? (
          <Icon type="loading" style={{ marginLeft: '2px' }} />
        ) : (
          <img
            style={{ width: '26px', marginTop: '2px', marginLeft: '2px' }}
            src="/images/import-icon.svg"
            alt="aim"
            className="action-btn__caption"
          />
        )}
        <span className="action-btn__caption">
          {intl.formatMessage({ id: 'nearby', defaultMessage: 'Nearby' })}
        </span>
      </button>
      {!isNil(usersState) && (
        <MapObjectImport
          isEditor
          parentPost={isComment ? parentPost : {}}
          isComment={isComment}
          usersState={usersState}
          showImportModal={showImportModal}
          closeModal={closeImportModal}
        />
      )}
    </div>
  );
};

NearbyButton.propTypes = {
  intl: PropTypes.shape().isRequired,
  parentPost: PropTypes.shape(),
  close: PropTypes.func,
};

export default injectIntl(NearbyButton);
