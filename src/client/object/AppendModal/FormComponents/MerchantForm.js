import React from 'react';
import { Form, Input } from 'antd';
import classNames from 'classnames';
import { injectIntl } from 'react-intl';
import PropTypes from 'prop-types';
import { objectFields, merchantFields } from '../../../../common/constants/listOfFields';
import SearchObjectsAutocomplete from '../../../components/EditorObject/SearchObjectsAutocomplete';
import ObjectCardView from '../../../objectCard/ObjectCardView';
import CreateObject from '../../../post/CreateObjectModal/CreateObject';

const MerchantForm = ({
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
      {getFieldDecorator(merchantFields.merchantName, {
        rules: getFieldRules(merchantFields.merchantName),
        initialValue: '',
      })(
        <Input
          className={classNames('AppendForm__input', {})}
          disabled={loading}
          placeholder={intl.formatMessage({
            id: 'merchant_name',
            defaultMessage: 'Merchant name',
          })}
        />,
      ) || selectedObject}
    </Form.Item>
    <Form.Item>
      {getFieldDecorator(merchantFields.merchant, {
        rules: getFieldRules(merchantFields.merchant),
      })(
        <SearchObjectsAutocomplete
          useExtendedSearch
          objectType="business"
          placeholder={intl.formatMessage({
            id: 'objects_auto_complete_merchant_placeholder',
            defaultMessage: 'Find merchant',
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
            id: 'create_new_merchant',
            defaultMessage: 'Create new merchant',
          })}
          currentField={objectFields.merchant}
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

MerchantForm.propTypes = {
  getFieldDecorator: PropTypes.func.isRequired,
  onCreateObject: PropTypes.func.isRequired,
  handleSelectObject: PropTypes.func.isRequired,
  onObjectCardDelete: PropTypes.func.isRequired,
  getFieldRules: PropTypes.func.isRequired,
  loading: PropTypes.bool.isRequired,

  selectedObject: PropTypes.shape().isRequired,
  intl: PropTypes.shape().isRequired,
};
export default injectIntl(MerchantForm);
