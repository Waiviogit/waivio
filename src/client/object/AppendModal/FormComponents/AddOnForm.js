import React from 'react';
import { Form } from 'antd';
import PropTypes from 'prop-types';
import { injectIntl } from 'react-intl';
import { objectFields } from '../../../../common/constants/listOfFields';
import SearchObjectsAutocomplete from '../../../components/EditorObject/SearchObjectsAutocomplete';
import ObjectCardView from '../../../objectCard/ObjectCardView';
import CreateObject from '../../../post/CreateObjectModal/CreateObject';

const AddOnForm = ({
  getFieldDecorator,
  selectedObject,
  getFieldRules,
  intl,
  handleSelectObject,
  onCreateObject,
  onObjectCardDelete,
  wobjAddOn,
}) => {
  const addOnPermlinks = wobjAddOn?.map(obj => obj.body);

  return (
    <>
      <Form.Item>
        {getFieldDecorator(objectFields.addOn, {
          rules: getFieldRules(objectFields.addOn),
        })(
          <SearchObjectsAutocomplete
            useExtendedSearch
            itemsIdsToOmit={addOnPermlinks}
            placeholder={intl.formatMessage({
              id: 'objects_auto_complete_placeholder',
              defaultMessage: 'Find object',
            })}
            handleSelect={handleSelectObject}
          />,
        )}
        {selectedObject && (
          <ObjectCardView closeButton onDelete={onObjectCardDelete} wObject={selectedObject} />
        )}
        <br />
        <div className="add-create-btns">
          <CreateObject
            withOpenModalBtn={!selectedObject}
            openModalBtnText={intl.formatMessage({
              id: 'create_new_object',
              defaultMessage: 'Create new object',
            })}
            currentField={objectFields.addOn}
            onCreateObject={onCreateObject}
            parentObject={{}}
          />
        </div>{' '}
      </Form.Item>
    </>
  );
};

AddOnForm.propTypes = {
  getFieldDecorator: PropTypes.func.isRequired,
  onCreateObject: PropTypes.func.isRequired,
  handleSelectObject: PropTypes.func.isRequired,
  onObjectCardDelete: PropTypes.func.isRequired,
  getFieldRules: PropTypes.func.isRequired,
  selectedObject: PropTypes.shape().isRequired,
  intl: PropTypes.shape().isRequired,
  wobjAddOn: PropTypes.arrayOf(PropTypes.shape()).isRequired,
};

export default injectIntl(AddOnForm);
