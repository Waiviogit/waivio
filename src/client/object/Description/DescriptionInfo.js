import React from 'react';
import PropTypes from 'prop-types';
import { FormattedMessage } from 'react-intl';
import { truncate } from '../wObjectHelper';
import LinkButton from '../../components/LinkButton/LinkButton';

const DescriptionInfo = ({ description, wobjPermlink }) => (
  <div className="description-field">
    {description.length > 255 ? (
      <>
        {truncate(description)}
        <LinkButton className="menu-btn mt2" to={`/object/${wobjPermlink}/description`}>
          <FormattedMessage id="description" defaultMessage="Description" />
        </LinkButton>
      </>
    ) : (
      description
    )}
  </div>
);

DescriptionInfo.propTypes = {
  description: PropTypes.string.isRequired,
  wobjPermlink: PropTypes.string.isRequired,
};

export default DescriptionInfo;
