import React from 'react';
import PropTypes from 'prop-types';
import { FormattedMessage } from 'react-intl';
import { useSelector } from 'react-redux';
import LinkButton from '../../components/LinkButton/LinkButton';
import { shortenDescription } from '../wObjectHelper';
import { cleanHtmlCommentsAndLines } from './DescriptionPage';
import { getHtml } from '../../components/Story/Body';
import { getAppUrl } from '../../../store/appStore/appSelectors';

const DescriptionInfo = ({ description, wobjPermlink, showDescriptionBtn, isDescriptionPage }) => {
  const showBtn = (description.length < 300 && showDescriptionBtn) || description.length > 300;
  const descr = cleanHtmlCommentsAndLines(description);
  const { firstDescrPart } = shortenDescription(descr, 300);

  const appUrl = useSelector(getAppUrl);

  return (
    <div className="description-field">
      {getHtml(firstDescrPart, {}, 'Object', { appUrl })}
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
