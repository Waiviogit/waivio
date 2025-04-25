import React from 'react';
import PropTypes from 'prop-types';
import { FormattedMessage } from 'react-intl';
import LinkButton from '../../components/LinkButton/LinkButton';
import { shortenDescription } from '../wObjectHelper';
import { cleanHtmlCommentsAndLines } from './DescriptionPage';

const DescriptionInfo = ({ description, wobjPermlink, showDescriptionBtn, isDescriptionPage }) => {
  const showBtn = (description.length < 300 && showDescriptionBtn) || description.length > 300;
  const { firstDescrPart } = shortenDescription(description, 300);
  const paragraph = cleanHtmlCommentsAndLines(firstDescrPart);

  return (
    <div className="description-field">
      {paragraph}
      {showBtn && (
        <div className="object-sidebar__menu-item">
          <LinkButton
            className={
              isDescriptionPage ? 'LinkButton active menu-button mt2' : 'LinkButton menu-button mt2'
            }
            to={`/object/${wobjPermlink}/description`}
          >
            <div>
              <FormattedMessage id="description" defaultMessage="Description" />
            </div>
          </LinkButton>
        </div>
      )}
    </div>
  );
};

DescriptionInfo.propTypes = {
  description: PropTypes.string.isRequired,
  wobjPermlink: PropTypes.string.isRequired,
  showDescriptionBtn: PropTypes.bool,
  isDescriptionPage: PropTypes.bool,
};

export default DescriptionInfo;
