import _ from 'lodash';
import React from 'react';
import PropTypes from 'prop-types';
import { FormattedMessage } from 'react-intl';
import './CurrentObjectFields.less';
import { objectFields } from '../../../common/constants/listOfFields';

export const getFieldsBody = field => {
  try {
    const parsedBody = JSON.parse(field.body);
    return _.map(parsedBody, (value, key) => {
      if (value)
        return (
          <p key={key + value}>
            {key}: {value}
          </p>
        );
      return null;
    });
  } catch (e) {
    return field.body;
  }
};

const CurrentObjectFields = ({ wobject, currentField, currentLocaleInList }) => {
  const setStyledField = field => {
    switch (field.name) {
      case objectFields.avatarImage:
      case objectFields.backgroundImage: {
        const imageSrc = field.body;
        return (
          imageSrc && (
            <div className="CurrentObjectFields__field">
              <img
                className="CurrentObjectFields__field__image"
                src={imageSrc}
                alt={currentField}
              />
              <span className="CurrentObjectFields__field__body" title="Field weight">
                ({field.weight})
              </span>
            </div>
          )
        );
      }
      case objectFields.link:
        return (
          <div className="CurrentObjectFields__field__body">
            {getFieldsBody(field)}
            <span title="Field weight">({field.weight})</span>
          </div>
        );
      default:
        return (
          <div className="CurrentObjectFields__field__body">
            {getFieldsBody(field)}
            <span title="Field weight">({field.weight})</span>
          </div>
        );
    }
  };
  return (
    <div className="CurrentObjectFields__field">
      <FormattedMessage id="current_fields1" defaultMessage="Current" />
      <span className="CurrentObjectFields__field__current">{`"${currentField}"`}</span>
      <FormattedMessage id="current_fields2" defaultMessage="fields" />

      {currentLocaleInList.id !== 'auto' && (
        <div>
          <FormattedMessage id="for_lang1" defaultMessage="for" />
          <span className="CurrentObjectFields__field__current">
            {`${currentLocaleInList.nativeName} - ${currentLocaleInList.name}`}
          </span>
          <FormattedMessage id="for_lang2" defaultMessage="language" />
        </div>
      )}
      {_.some(wobject.fields, { name: currentField, locale: currentLocaleInList.id }) ? (
        _.map(
          _.orderBy(
            _.filter(
              wobject.fields,
              field => field.name === currentField && field.locale === currentLocaleInList.id,
            ),
            'weight',
            ['desc'],
          ),
          field => (
            <div
              key={`${Math.random()
                .toString(36)
                .substring(2)} ${field.locale}`}
            >
              <div className="CurrentObjectFields__field__line">{setStyledField(field)}</div>
            </div>
          ),
        )
      ) : (
        <div className="CurrentObjectFields__field__noItems">
          <FormattedMessage id="no_fields" defaultMessage="There is no added fields with type" />
          <span className="CurrentObjectFields__field__current">{`"${currentField}"`}</span>
        </div>
      )}
    </div>
  );
};
CurrentObjectFields.propTypes = {
  wobject: PropTypes.shape().isRequired,
  currentField: PropTypes.string.isRequired,
  currentLocaleInList: PropTypes.shape().isRequired,
};
CurrentObjectFields.defaultProps = {
  wobject: { fields: [] },
  currentField: 'name',
  currentLocaleInList: { id: '', name: '', nativeName: '' },
};
export default CurrentObjectFields;
