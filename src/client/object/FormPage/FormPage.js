import React from 'react';
import PropTypes from 'prop-types';
import { Link } from 'react-router-dom';
import { FormattedMessage } from 'react-intl';
import { formColumnsField } from '../../../common/constants/listOfFields';

import './FormPage.less';

const FormPage = props => {
  const { wobject, currentForm } = props;

  return (
    <div className="FormPage">
      {currentForm.column === formColumnsField.entire && (
        <Link to={`/object/${wobject.author_permlink}`} className="FormPage__back-btn">
          <FormattedMessage id="form_back" defaultMessage="Back to reviews" />
        </Link>
      )}
      {currentForm.form === 'Widget' ? (
        // eslint-disable-next-line react/no-danger
        <div className="FormPage__block" dangerouslySetInnerHTML={{ __html: currentForm.link }} />
      ) : (
        <div className="FormPage__block">
          <iframe
            src={currentForm.link}
            width="100%"
            height="100%"
            allowFullScreen
            title={currentForm.formTitle}
            frameBorder="0"
            allowTransparency
            allowscriptaccess="always"
          />
        </div>
      )}
    </div>
  );
};

FormPage.propTypes = {
  wobject: PropTypes.shape(),
  currentForm: PropTypes.shape(),
};

FormPage.defaultProps = {
  wobject: {},
  currentForm: {},
};

export default FormPage;
