import React, { useEffect, useState } from 'react';
import PropTypes from 'prop-types';
import { ReactSVG } from 'react-svg';
import { has } from 'lodash';
import './ListDescription.less';

const ListDescription = ({ wobject }) => {
  const [showContent, setShowContent] = useState(false);
  const hasTitle = has(wobject, 'title');
  const hasAvatar = has(wobject, 'avatar');
  const hasDescription = has(wobject, 'description');

  useEffect(() => {
    setShowContent(false);
  }, [wobject.author_permlink]);

  return (
    (hasTitle || hasDescription) && (
      <div className={'ListDescription'}>
        <h1 className={'ListDescription__title margin-bottom'}>
          {hasTitle ? wobject.title : wobject.name}
        </h1>
        {hasDescription && (
          <>
            <div
              className={`ListDescription__icon ${!showContent ? 'margin-bottom' : ''}`}
              onClick={() => setShowContent(!showContent)}
            >
              <ReactSVG
                className={'ListDescription__img'}
                wrapper="span"
                src={showContent ? '/images/icons/up.svg' : '/images/icons/down.svg'}
              />
            </div>
            <div className={`ListDescription__description-container ${showContent ? 'show' : ''}`}>
              <div
                className={`ListDescription__description-${hasAvatar ? 'with' : 'without'}-image`}
              >
                {wobject.description}
              </div>
              {hasAvatar && (
                <div className={'ListDescription__image-container'}>
                  <img className={'ListDescription__image'} src={wobject.avatar} alt={''} />
                </div>
              )}
            </div>
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
