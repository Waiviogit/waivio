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
      <FormattedMessage id="map_list" defaultMessage="Map list" />
    </div>
    <div>
      {props.getFieldDecorator(mapObjectTypeFields.mapObjectsList, {
        rules: props.getFieldRules(objectFields.parent),
      })(
        <SearchObjectsAutocomplete
          placeholder={props.intl.formatMessage({
            id: 'find_a_list',
            defaultMessage: 'Find a list',
          })}
          objectType={'list'}
          handleSelect={props.handleSelectObject}
        />,
      )}
      {props.selectedObject && (
        <div className={'mb2'}>
          <ObjectCardView
            onDelete={props.onObjectCardDelete}
            showHeart={false}
            closeButton
            wObject={props.selectedObject}
          />
        </div>
      )}
    </div>
    <p>
      {props.intl.formatMessage({
        id: 'map_list_note',
        defaultMessage:
          'By selecting the main list, all objects, including embedded ones, will be displayed on the map.',
      })}
    </p>
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
  onObjectCardDelete: PropTypes.func.isRequired,
};
export default injectIntl(MapObjectsListForm);
