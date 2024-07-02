import React, { useState } from 'react';
import { useSelector } from 'react-redux';
import PropTypes from 'prop-types';
import { injectIntl } from 'react-intl';
import { Checkbox, Modal } from 'antd';
import { getAuthenticatedUserName } from '../../../store/authStore/authSelectors';
import { createDescription } from '../../../waivioApi/importApi';
import ObjectCardView from '../../objectCard/ObjectCardView';
import SearchObjectsAutocomplete from '../EditorObject/SearchObjectsAutocomplete';

const FindDescriptionsModal = ({ visible, onClose, updateDescriptionsList, intl }) => {
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
      title={intl.formatMessage({
        id: 'descriptions_bot',
        defaultMessage: 'Descriptions bot',
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
        <ObjectCardView
          showHeart={false}
          closeButton
          wObject={selectedObj}
          onDelete={() => setSelectedObj(null)}
        />
      ) : (
        <React.Fragment>
          <h4 className="DepartmentsBot__margin">
            {intl.formatMessage({
              id: 'select_list_map',
              defaultMessage: 'Select list or map',
            })}
            :
          </h4>
          <SearchObjectsAutocomplete
            handleSelect={setSelectedObj}
            onlyObjectTypes={['list', 'map']}
          />
        </React.Fragment>
      )}
      <Checkbox
        className="DepartmentsBot__margin"
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

FindDescriptionsModal.propTypes = {
  visible: PropTypes.bool,
  onClose: PropTypes.func,
  updateDescriptionsList: PropTypes.func,
  intl: PropTypes.shape(),
};

export default injectIntl(FindDescriptionsModal);
