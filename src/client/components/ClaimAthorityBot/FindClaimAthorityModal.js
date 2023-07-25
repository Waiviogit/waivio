import React, { useState } from 'react';
import { Checkbox, Modal } from 'antd';
import PropTypes from 'prop-types';
import { useSelector } from 'react-redux';

import SearchObjectsAutocomplete from '../EditorObject/SearchObjectsAutocomplete';
import ObjectCardView from '../../objectCard/ObjectCardView';
import { createAuthority } from '../../../waivioApi/importApi';
import { getAuthenticatedUserName } from '../../../store/authStore/authSelectors';

import './ClaimAthorityBot.less';

const FindClaimAthorityModal = ({ visible, onClose, updateAuthorityList }) => {
  const userName = useSelector(getAuthenticatedUserName);
  const [selectedObj, setSelectedObj] = useState(null);
  const [includeObjects, setIncludeObjects] = useState(true);
  const [loading, setLoading] = useState(false);
  const handleSubmit = () => {
    setLoading(true);
    createAuthority(userName, selectedObj.author_permlink).then(() => {
      onClose();
      setLoading(false);
      updateAuthorityList();
    });
  };

  return (
    <Modal
      visible={visible}
      title={'Claim administrative authority'}
      onCancel={onClose}
      onOk={handleSubmit}
      okText={'Submit'}
      okButtonProps={{
        disabled: loading || !selectedObj,
        loading,
      }}
    >
      {selectedObj ? (
        <ObjectCardView closeButton wObject={selectedObj} onDelete={() => setSelectedObj(null)} />
      ) : (
        <React.Fragment>
          <h4 className="ClaimAthorityBot__margin">Select list:</h4>
          <SearchObjectsAutocomplete handleSelect={setSelectedObj} objectType={'list'} />
        </React.Fragment>
      )}
      <Checkbox
        className="ClaimAthorityBot__margin"
        checked={includeObjects}
        onChange={e => setIncludeObjects(e.target.checked)}
      />{' '}
      Include objects from embeddes lists
    </Modal>
  );
};

FindClaimAthorityModal.propTypes = {
  visible: PropTypes.bool,
  onClose: PropTypes.func,
  updateAuthorityList: PropTypes.func,
};

export default FindClaimAthorityModal;
