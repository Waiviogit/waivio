import React, { useState } from 'react';
import PropTypes from 'prop-types';
import { ReactSVG } from 'react-svg';
import { has } from 'lodash';
import './ListDescription.less';

const ListDescription = ({ wobject }) => {
  const [showMore, setShowMore] = useState(false);
  const hasTitle = has(wobject, 'title');
  const hasAvatar = has(wobject, 'avatar');
  const hasDescription = has(wobject, 'description');
  const paragraphs = hasDescription ? wobject.description.split('\n\n') : [];
  const firstTwoParagraphs = paragraphs.slice(0, 2).join('\n\n');
  const twoMoreParagraphs = paragraphs.slice(2, 4).join('\n\n');
  const remainingParagraphs = paragraphs.slice(4).join('\n\n');

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
                {firstTwoParagraphs}
              </div>
              {hasAvatar && (
                <div className={'ListDescription__image-container show'}>
                  <img className={'ListDescription__image'} src={wobject.avatar} alt={''} />
                </div>
              )}
            </div>
            <div
              className={`ListDescription__remaining-description ${
                !hasAvatar ? 'without-avatar' : ''
              }`}
            >
              {twoMoreParagraphs}
            </div>
            {remainingParagraphs && (
              <div className={'ListDescription__icon'} onClick={() => setShowMore(!showMore)}>
                <ReactSVG
                  className={'ListDescription__img'}
                  wrapper="span"
                  src={showMore ? '/images/icons/up.svg' : '/images/icons/down.svg'}
                />
              </div>
            )}
            {showMore && (
              <div
                className={`ListDescription__remaining-description ${
                  !hasAvatar ? 'without-avatar' : ''
                }`}
              >
                {remainingParagraphs}
              </div>
            )}
          </>
        )}
      </div>
    )
  );
};

ListDescription.propTypes = {
  wobject: PropTypes.shape.isRequired,
};

export default ListDescription;
