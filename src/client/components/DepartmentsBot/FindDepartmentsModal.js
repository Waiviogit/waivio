import React, { useState } from 'react';
import { useSelector } from 'react-redux';
import PropTypes from 'prop-types';
import { injectIntl } from 'react-intl';
import { Checkbox, Modal } from 'antd';
import { getAuthenticatedUserName } from '../../../store/authStore/authSelectors';
import { createDepartment } from '../../../waivioApi/importApi';
import ObjectCardView from '../../objectCard/ObjectCardView';
import SearchObjectsAutocomplete from '../EditorObject/SearchObjectsAutocomplete';

const FindDepartmentsModal = ({
  visible,
  onClose,
  updateDepartmentsList,
  intl,
  createTag,
  title,
}) => {
  const userName = useSelector(getAuthenticatedUserName);
  const [selectedObj, setSelectedObj] = useState(null);
  const [includeObjects, setIncludeObjects] = useState(true);
  const [loading, setLoading] = useState(false);
  const handleSubmit = () => {
    setLoading(true);
    if (createTag) {
      createTag(userName, selectedObj.author_permlink, includeObjects).then(() => {
        onClose();
        setLoading(false);
        updateDepartmentsList();
      });
    } else {
      createDepartment(userName, selectedObj.author_permlink, includeObjects).then(() => {
        onClose();
        setLoading(false);
        updateDepartmentsList();
      });
    }
  };

  return (
    <Modal
      visible={visible}
      title={title}
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

FindDepartmentsModal.propTypes = {
  visible: PropTypes.bool,
  title: PropTypes.string,
  onClose: PropTypes.func,
  createTag: PropTypes.func,
  updateDepartmentsList: PropTypes.func,
  intl: PropTypes.shape(),
};

FindDepartmentsModal.defaultProps = {
  title: 'Department update bot',
};

export default injectIntl(FindDepartmentsModal);
