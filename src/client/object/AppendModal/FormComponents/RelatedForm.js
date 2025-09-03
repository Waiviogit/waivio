import React from 'react';
import { Form } from 'antd';
import PropTypes from 'prop-types';
import { injectIntl } from 'react-intl';
import { objectFields } from '../../../../common/constants/listOfFields';
import SearchObjectsAutocomplete from '../../../components/EditorObject/SearchObjectsAutocomplete';
import ObjectCardView from '../../../objectCard/ObjectCardView';
import CreateObject from '../../../post/CreateObjectModal/CreateObject';

const RelatedForm = ({
  getFieldDecorator,
  selectedObject,
  getFieldRules,
  intl,
  handleSelectObject,
  onCreateObject,
  onObjectCardDelete,
  wobjRelated,
}) => {
  const relatedPermlinks = wobjRelated?.map(obj => obj.body);

  return (
    <>
      <Form.Item>
        {getFieldDecorator(objectFields.related, {
          rules: getFieldRules(objectFields.related),
        })(
          <SearchObjectsAutocomplete
            useExtendedSearch
            itemsIdsToOmit={relatedPermlinks}
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
            currentField={objectFields.related}
            onCreateObject={onCreateObject}
            parentObject={{}}
          />
        </div>{' '}
      </Form.Item>
    </>
  );
};

RelatedForm.propTypes = {
  getFieldDecorator: PropTypes.func.isRequired,
  onCreateObject: PropTypes.func.isRequired,
  handleSelectObject: PropTypes.func.isRequired,
  onObjectCardDelete: PropTypes.func.isRequired,
  getFieldRules: PropTypes.func.isRequired,
  selectedObject: PropTypes.shape().isRequired,
  intl: PropTypes.shape().isRequired,
  wobjRelated: PropTypes.arrayOf(PropTypes.shape()).isRequired,
};

export default injectIntl(RelatedForm);
