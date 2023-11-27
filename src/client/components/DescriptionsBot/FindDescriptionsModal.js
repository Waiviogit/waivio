import React, { useState } from 'react';
import { useSelector } from 'react-redux';
import PropTypes from 'prop-types';
import { Checkbox, Modal } from 'antd';
import { getAuthenticatedUserName } from '../../../store/authStore/authSelectors';
import { createDescription } from '../../../waivioApi/importApi';
import ObjectCardView from '../../objectCard/ObjectCardView';
import SearchObjectsAutocomplete from '../EditorObject/SearchObjectsAutocomplete';

const FindDescriptionsModal = ({ visible, onClose, updateDescriptionsList }) => {
  const userName = useSelector(getAuthenticatedUserName);
  const [selectedObj, setSelectedObj] = useState(null);
  const [includeObjects, setIncludeObjects] = useState(true);
  const [loading, setLoading] = useState(false);
  const handleSubmit = () => {
    setLoading(true);
    createDescription(userName, selectedObj.author_permlink, includeObjects).then(() => {
      onClose();
      setLoading(false);
      updateDescriptionsList();
    });
  };

  return (
    <Modal
      visible={visible}
      title={'Descriptions bot'}
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
          <h4 className="DepartmentsBot__margin">Select list:</h4>
          <SearchObjectsAutocomplete handleSelect={setSelectedObj} objectType={'list'} />
        </React.Fragment>
      )}
      <Checkbox
        className="DepartmentsBot__margin"
        checked={includeObjects}
        onChange={e => setIncludeObjects(e.target.checked)}
      />{' '}
      Process embedded lists
    </Modal>
  );
};

FindDescriptionsModal.propTypes = {
  visible: PropTypes.bool,
  onClose: PropTypes.func,
  updateDescriptionsList: PropTypes.func,
};

export default FindDescriptionsModal;
