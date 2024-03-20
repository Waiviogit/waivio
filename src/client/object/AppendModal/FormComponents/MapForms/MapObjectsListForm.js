import React from 'react';
import classNames from 'classnames';
import { FormattedMessage, injectIntl } from 'react-intl';
import PropTypes from 'prop-types';
import SearchObjectsAutocomplete from '../../../../components/EditorObject/SearchObjectsAutocomplete';
import '../NewsFilterForm.less';
import { mapObjectTypeFields, objectFields } from '../../../../../common/constants/listOfFields';
import ObjectCardView from '../../../../objectCard/ObjectCardView';

const MapObjectsListForm = props => (
  <div className={'MapForms'}>
    <div className={classNames('ant-form-item-label AppendForm__appendTitles mb2')}>
      <FormattedMessage id="object_field_mapObjectTypes" defaultMessage="Object types" />
    </div>
    <div>
      {props.getFieldDecorator(mapObjectTypeFields.mapObjectsList, {
        rules: props.getFieldRules(objectFields.parent),
      })(<SearchObjectsAutocomplete objectType={'list'} handleSelect={props.handleSelectObject} />)}
      {props.selectedObject && <ObjectCardView wObject={props.selectedObject} />}
    </div>
  </div>
);

MapObjectsListForm.propTypes = {
  intl: PropTypes.shape({
    formatMessage: PropTypes.func,
  }).isRequired,
  selectedObject: PropTypes.shape().isRequired,
  handleSelectObject: PropTypes.func.isRequired,
  getFieldDecorator: PropTypes.func.isRequired,
  getFieldRules: PropTypes.func.isRequired,
};
export default injectIntl(MapObjectsListForm);
