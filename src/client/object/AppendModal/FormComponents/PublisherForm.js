import React from 'react';
import { Form, Input } from 'antd';
import { injectIntl } from 'react-intl';
import classNames from 'classnames';
import PropTypes from 'prop-types';
import { objectFields, publisherFields } from '../../../../common/constants/listOfFields';
import SearchObjectsAutocomplete from '../../../components/EditorObject/SearchObjectsAutocomplete';
import ObjectCardView from '../../../objectCard/ObjectCardView';
import CreateObject from '../../../post/CreateObjectModal/CreateObject';

const PublisherForm = ({
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
      {getFieldDecorator(publisherFields.publisherName, {
        rules: getFieldRules(publisherFields.publisherName),
        initialValue: '',
      })(
        <Input
          className={classNames('AppendForm__input', {})}
          disabled={loading}
          placeholder={intl.formatMessage({
            id: 'publisher_name',
            defaultMessage: 'Publisher name',
          })}
        />,
      ) || selectedObject}
    </Form.Item>
    <Form.Item>
      {getFieldDecorator(publisherFields.publisher, {
        rules: getFieldRules(publisherFields.publisher),
      })(
        <SearchObjectsAutocomplete
          useExtendedSearch
          objectType="business"
          placeholder={intl.formatMessage({
            id: 'objects_auto_complete_publisher_placeholder',
            defaultMessage: 'Find publisher',
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
            id: 'create_new_publisher',
            defaultMessage: 'Create new publisher',
          })}
          currentField={objectFields.publisher}
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

PublisherForm.propTypes = {
  getFieldDecorator: PropTypes.func.isRequired,
  onCreateObject: PropTypes.func.isRequired,
  handleSelectObject: PropTypes.func.isRequired,
  onObjectCardDelete: PropTypes.func.isRequired,
  getFieldRules: PropTypes.func.isRequired,
  loading: PropTypes.bool.isRequired,
  selectedObject: PropTypes.shape().isRequired,
  intl: PropTypes.shape().isRequired,
};
export default injectIntl(PublisherForm);
