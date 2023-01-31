import React from 'react';
import { Form, Input } from 'antd';
import classNames from 'classnames';
import { injectIntl } from 'react-intl';
import PropTypes from 'prop-types';
import { objectFields, authorsFields } from '../../../../common/constants/listOfFields';
import SearchObjectsAutocomplete from '../../../components/EditorObject/SearchObjectsAutocomplete';
import ObjectCardView from '../../../objectCard/ObjectCardView';
import CreateObject from '../../../post/CreateObjectModal/CreateObject';

const AuthorForm = ({
  getFieldDecorator,
  loading,
  selectedObject,
  getFieldRules,
  isSomeValue,
  intl,
  handleSelectObject,
  onObjectCardDelete,
}) => (
  <>
    <Form.Item>
      {getFieldDecorator(authorsFields.name, {
        rules: getFieldRules(authorsFields.name),
        initialValue: '',
      })(
        <Input
          className={classNames('AppendForm__input', {
            'validation-error': isSomeValue,
          })}
          disabled={loading}
          placeholder={intl.formatMessage({
            id: 'author_name',
            defaultMessage: 'Author name',
          })}
        />,
      ) || selectedObject}
    </Form.Item>
    <Form.Item>
      {getFieldDecorator(authorsFields.author, {
        rules: getFieldRules(authorsFields.author),
      })(
        <SearchObjectsAutocomplete
          objectType="person"
          placeholder={intl.formatMessage({
            id: 'objects_auto_complete_author_placeholder',
            defaultMessage: 'Find author',
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
            id: 'create_new_author',
            defaultMessage: 'Create new author',
          })}
          currentField={objectFields.authors}
          isSingleType
          defaultObjectType="person"
          disabled
          onCreateObject={handleSelectObject}
          parentObject={{}}
        />
      </div>{' '}
    </Form.Item>
  </>
);

AuthorForm.propTypes = {
  getFieldDecorator: PropTypes.func.isRequired,
  handleSelectObject: PropTypes.func.isRequired,
  onObjectCardDelete: PropTypes.func.isRequired,
  getFieldRules: PropTypes.func.isRequired,
  loading: PropTypes.bool.isRequired,
  isSomeValue: PropTypes.bool.isRequired,
  selectedObject: PropTypes.shape().isRequired,
  intl: PropTypes.shape().isRequired,
};
export default injectIntl(AuthorForm);
