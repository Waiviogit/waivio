import React from 'react';
import { Form, Input } from 'antd';
import { injectIntl } from 'react-intl';
import classNames from 'classnames';
import PropTypes from 'prop-types';
import { objectFields, brandFields } from '../../../../common/constants/listOfFields';
import SearchObjectsAutocomplete from '../../../components/EditorObject/SearchObjectsAutocomplete';
import ObjectCardView from '../../../objectCard/ObjectCardView';
import CreateObject from '../../../post/CreateObjectModal/CreateObject';

const BrandForm = ({
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
      {getFieldDecorator(brandFields.brandName, {
        rules: getFieldRules(brandFields.brandName),
        initialValue: '',
      })(
        <Input
          className={classNames('AppendForm__input', {})}
          disabled={loading}
          placeholder={intl.formatMessage({
            id: 'brand_name',
            defaultMessage: 'Brand name',
          })}
        />,
      ) || selectedObject}
    </Form.Item>
    <Form.Item>
      {getFieldDecorator(brandFields.brand, {
        rules: getFieldRules(brandFields.brand),
      })(
        <SearchObjectsAutocomplete
          useExtendedSearch
          objectType="business"
          placeholder={intl.formatMessage({
            id: 'objects_auto_complete_brand_placeholder',
            defaultMessage: 'Find brand',
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
            id: 'create_new_brand',
            defaultMessage: 'Create new brand',
          })}
          currentField={objectFields.brand}
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

BrandForm.propTypes = {
  getFieldDecorator: PropTypes.func.isRequired,
  onCreateObject: PropTypes.func.isRequired,
  handleSelectObject: PropTypes.func.isRequired,
  onObjectCardDelete: PropTypes.func.isRequired,
  getFieldRules: PropTypes.func.isRequired,
  loading: PropTypes.bool.isRequired,
  selectedObject: PropTypes.shape().isRequired,
  intl: PropTypes.shape().isRequired,
};
export default injectIntl(BrandForm);
