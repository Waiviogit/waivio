import React from 'react';
import { Form, Input } from 'antd';
import classNames from 'classnames';
import { injectIntl } from 'react-intl';
import PropTypes from 'prop-types';
import { objectFields, authorsFields } from '../../../../common/constants/listOfFields';
import SearchObjectsAutocomplete from '../../../components/EditorObject/SearchObjectsAutocomplete';
import ObjectCardView from '../../../objectCard/ObjectCardView';
import CreateObject from '../../../post/CreateObjectModal/CreateObject';
import { parseWobjectField } from '../../../../common/helpers/wObjectHelper';

const AuthorForm = ({
  getFieldDecorator,
  loading,
  selectedObject,
  getFieldRules,
  intl,
  onCreateObject,
  handleSelectObject,
  onObjectCardDelete,
  wobjAuthors,
}) => {
  const authors = wobjAuthors?.map(el => parseWobjectField(el, 'body', []));
  const authorsPermlinks = authors?.map(author => author.author_permlink || author.authorPermlink);

  return (
    <>
      <Form.Item>
        {getFieldDecorator(authorsFields.name, {
          rules: getFieldRules(authorsFields.name),
          initialValue: '',
        })(
          <Input
            className={classNames('AppendForm__input', {})}
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
            useExtendedSearch
            itemsIdsToOmit={authorsPermlinks}
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
            onCreateObject={onCreateObject}
            parentObject={{}}
          />
        </div>{' '}
      </Form.Item>
    </>
  );
};

AuthorForm.propTypes = {
  getFieldDecorator: PropTypes.func.isRequired,
  onCreateObject: PropTypes.func.isRequired,
  handleSelectObject: PropTypes.func.isRequired,
  onObjectCardDelete: PropTypes.func.isRequired,
  getFieldRules: PropTypes.func.isRequired,
  loading: PropTypes.bool.isRequired,
  selectedObject: PropTypes.shape().isRequired,
  wobjAuthors: PropTypes.arrayOf().isRequired,
  intl: PropTypes.shape().isRequired,
};
export default injectIntl(AuthorForm);
