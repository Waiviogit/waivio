import React, { useState } from 'react';
import { Checkbox, Modal } from 'antd';
import PropTypes from 'prop-types';
import { useSelector } from 'react-redux';
import { injectIntl } from 'react-intl';

import SearchObjectsAutocomplete from '../EditorObject/SearchObjectsAutocomplete';
import ObjectCardView from '../../objectCard/ObjectCardView';
import { createAuthority } from '../../../waivioApi/importApi';
import { getAuthenticatedUserName } from '../../../store/authStore/authSelectors';

import './ClaimAthorityBot.less';

const FindClaimAthorityModal = ({ visible, onClose, updateAuthorityList, intl }) => {
  const userName = useSelector(getAuthenticatedUserName);
  const [selectedObj, setSelectedObj] = useState(null);
  const [includeObjects, setIncludeObjects] = useState(true);
  const [loading, setLoading] = useState(false);
  const handleSubmit = () => {
    setLoading(true);
    createAuthority(userName, selectedObj.author_permlink, includeObjects).then(() => {
      onClose();
      setLoading(false);
      updateAuthorityList();
    });
  };

  return (
    <Modal
      visible={visible}
      title={intl.formatMessage({
        id: 'claim_administrative_authority',
        defaultMessage: 'Claim administrative authority',
      })}
      onCancel={onClose}
      onOk={handleSubmit}
      okText={intl.formatMessage({
        id: 'submit',
        defaultMessage: 'Submit',
      })}
      okButtonProps={{
        disabled: loading || !selectedObj,
        loading,
      }}
    >
      {selectedObj ? (
        <ObjectCardView closeButton wObject={selectedObj} onDelete={() => setSelectedObj(null)} />
      ) : (
        <React.Fragment>
          <h4 className="ClaimAthorityBot__margin">
            {intl.formatMessage({
              id: 'select_list_map',
              defaultMessage: 'Select list or map',
            })}
            :
          </h4>
          <SearchObjectsAutocomplete
            placeholder={'Find an object'}
            handleSelect={setSelectedObj}
            onlyObjectTypes={['list', 'map']}
          />
        </React.Fragment>
      )}
      <Checkbox
        className="ClaimAthorityBot__margin"
        checked={includeObjects}
        onChange={e => setIncludeObjects(e.target.checked)}
      />{' '}
      {intl.formatMessage({
        id: 'process_lists',
        defaultMessage: 'Process embedded lists',
      })}
    </Modal>
  );
};

FindClaimAthorityModal.propTypes = {
  visible: PropTypes.bool,
  onClose: PropTypes.func,
  updateAuthorityList: PropTypes.func,
  intl: PropTypes.shape(),
};

export default injectIntl(FindClaimAthorityModal);
