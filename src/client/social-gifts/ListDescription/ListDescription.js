import React from 'react';
import PropTypes from 'prop-types';
import { has } from 'lodash';
import './ListDescription.less';

const ListDescription = ({ wobject }) => {
  const hasTitle = has(wobject, 'title');
  const hasAvatar = has(wobject, 'avatar');
  const hasDescription = has(wobject, 'description');

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
                {wobject.description}
              </div>
              {hasAvatar && (
                <div className={'ListDescription__image-container show'}>
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
