import React from 'react';
import PropTypes from 'prop-types';
import { Form, Input } from 'antd';
import { injectIntl } from 'react-intl';
import classNames from 'classnames';
import { manufacturerFields, objectFields } from '../../../../common/constants/listOfFields';
import SearchObjectsAutocomplete from '../../../components/EditorObject/SearchObjectsAutocomplete';
import ObjectCardView from '../../../objectCard/ObjectCardView';
import CreateObject from '../../../post/CreateObjectModal/CreateObject';

const ManufacturerForm = ({
  getFieldDecorator,
  loading,
  selectedObject,
  getFieldRules,
  intl,
  handleSelectObject,
  onCreateObject,
  onObjectCardDelete,
}) => (
  <>
    <Form.Item>
      {getFieldDecorator(manufacturerFields.manufacturerName, {
        rules: getFieldRules(manufacturerFields.manufacturerName),
      })(
        <Input
          className={classNames('AppendForm__input', {})}
          disabled={loading}
          placeholder={intl.formatMessage({
            id: 'manufacturer_name',
            defaultMessage: 'Manufacturer name',
          })}
        />,
      ) || selectedObject}
    </Form.Item>
    <Form.Item>
      {getFieldDecorator(manufacturerFields.manufacturer, {
        rules: getFieldRules(manufacturerFields.manufacturer),
      })(
        <SearchObjectsAutocomplete
          useExtendedSearch
          objectType="business"
          placeholder={intl.formatMessage({
            id: 'objects_auto_complete_manufacturer_placeholder',
            defaultMessage: 'Find manufacturer',
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
            id: 'create_new_manufacturer',
            defaultMessage: 'Create new manufacturer',
          })}
          currentField={objectFields.manufacturer}
          isSingleType
          defaultObjectType="business"
          disabled
          onCreateObject={onCreateObject}
          parentObject={{}}
        />
      </div>{' '}
    </Form.Item>
  </>
);

ManufacturerForm.propTypes = {
  getFieldDecorator: PropTypes.func.isRequired,
  handleSelectObject: PropTypes.func.isRequired,
  onCreateObject: PropTypes.func.isRequired,
  onObjectCardDelete: PropTypes.func.isRequired,
  getFieldRules: PropTypes.func.isRequired,
  loading: PropTypes.bool.isRequired,
  selectedObject: PropTypes.shape().isRequired,
  intl: PropTypes.shape().isRequired,
};
export default injectIntl(ManufacturerForm);
