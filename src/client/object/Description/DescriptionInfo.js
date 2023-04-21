import React from 'react';
import PropTypes from 'prop-types';
import { FormattedMessage } from 'react-intl';
import LinkButton from '../../components/LinkButton/LinkButton';
import { shortenDescription } from '../wObjectHelper';

const DescriptionInfo = ({ description, wobjPermlink, showDescriptionBtn }) => (
  <div className="description-field">
    {showDescriptionBtn ? (
      <>
        {shortenDescription(description)}
        <div className="object-sidebar__menu-item">
          <LinkButton
            className="LinkButton menu-button mt2"
            to={`/object/${wobjPermlink}/description`}
          >
            <FormattedMessage id="description" defaultMessage="Description" />
          </LinkButton>
        </div>
      </>
    ) : (
      description
    )}
  </div>
);

DescriptionInfo.propTypes = {
  description: PropTypes.string.isRequired,
  wobjPermlink: PropTypes.string.isRequired,
  showDescriptionBtn: PropTypes.bool,
};

export default DescriptionInfo;
