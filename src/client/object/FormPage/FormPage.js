import React from 'react';
import PropTypes from 'prop-types';
import { FormattedMessage } from 'react-intl';
import { formColumnsField } from '../../../common/constants/listOfFields';
import './FormPage.less';

const FormPage = props => {
  const { wobject, currentForm, history } = props;
  return (
    <div className="FormPage">
      {currentForm.column === formColumnsField.entire && (
        <span
          role="presentation"
          onClick={() => history.push(`/object/${wobject.author_permlink}`)}
          className="FormPage__back-btn"
        >
          <FormattedMessage id="form_back" defaultMessage="Back to reviews" />
        </span>
      )}
      <div className="FormPage__block">
        <iframe
          src={currentForm.link}
          width="100%"
          height="100%"
          allowFullScreen
          title={currentForm.formTitle}
        />
      </div>
    </div>
  );
};

FormPage.propTypes = {
  wobject: PropTypes.shape(),
  currentForm: PropTypes.shape(),
  history: PropTypes.shape().isRequired,
};

FormPage.defaultProps = {
  wobject: {},
  currentForm: {},
};

export default FormPage;
