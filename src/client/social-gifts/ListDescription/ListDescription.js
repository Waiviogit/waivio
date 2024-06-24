import React, { useState } from 'react';
import PropTypes from 'prop-types';
import { FormattedMessage } from 'react-intl';
import { has, isEmpty } from 'lodash';
import { removeEmptyLines, shortenDescription } from '../../object/wObjectHelper';
import './ListDescription.less';

const ListDescription = ({ wobject }) => {
  const [showMore, setShowMore] = useState(false);
  const hasTitle = has(wobject, 'title');
  const hasAvatar = has(wobject, 'avatar');
  const hasDescription = has(wobject, 'description');
  const { firstDescrPart, secondDescrPart } = shortenDescription(wobject?.description, 800);
  const { firstDescrPart: secondPart, secondDescrPart: thirdPartDescr } = shortenDescription(
    secondDescrPart,
    750,
  );
  const { firstDescrPart: thirdPart, secondDescrPart: fourthPart } = shortenDescription(
    thirdPartDescr,
    750,
  );
  const { firstDescrPart: description } = shortenDescription(
    removeEmptyLines(wobject?.description),
    350,
  );
  const altText = description || `${wobject.name} image`;

  return (
    (hasTitle || hasDescription) && (
      <div className={'ListDescription'}>
        {hasDescription && (
          <>
            <div className={`ListDescription__description-container show`}>
              <div
                className={`ListDescription__description-${hasAvatar ? 'with' : 'without'}-image`}
              >
                <h1 className={'ListDescription__title margin-bottom'}>
                  {hasTitle ? wobject.title : wobject.name}
                </h1>
                {firstDescrPart}
              </div>
              {hasAvatar && (
                <div className={'ListDescription__image-container show'}>
                  <img className={'ListDescription__image'} src={wobject.avatar} alt={altText} />
                </div>
              )}
            </div>
            <div
              className={`ListDescription__second-description ${
                !hasAvatar ? 'without-avatar' : ''
              }`}
            >
              {'\n'}
              {secondPart}
            </div>
            <div
              className={`ListDescription__second-description ${
                !hasAvatar ? 'without-avatar' : ''
              }`}
            >
              {'\n'}
              {thirdPart}
              {!isEmpty(fourthPart) && !showMore && (
                <button
                  onClick={() => setShowMore(!showMore)}
                  className="WalletTable__csv-button ml2"
                >
                  <FormattedMessage id="show_more" defaultMessage="Show more" />
                </button>
              )}
            </div>
            {showMore && (
              <div
                className={`ListDescription__remaining-description ${
                  !hasAvatar ? 'without-avatar' : ''
                }`}
              >
                {'\n'}
                {fourthPart}
              </div>
            )}
          </>
        )}
      </div>
    )
  );
};

ListDescription.propTypes = {
  wobject: PropTypes.shape({
    description: PropTypes.string,
    title: PropTypes.string,
    name: PropTypes.string,
    avatar: PropTypes.string,
  }).isRequired,
};

export default ListDescription;
