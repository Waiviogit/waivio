import React, { useState } from 'react';
import PropTypes from 'prop-types';
import { FormattedMessage } from 'react-intl';
import { has, isEmpty } from 'lodash';
import { removeEmptyLines, shortenDescription } from '../../object/wObjectHelper';
import './ListDescription.less';

const ListDescription = ({ wobject, isMap }) => {
  const [showMore, setShowMore] = useState(false);
  const hasTitle = has(wobject, 'title');
  const hasAvatar = has(wobject, 'avatar');
  const hasDescription = has(wobject, 'description');
  const { firstDescrPart, secondDescrPart } = shortenDescription(wobject?.description, 2000);
  const { firstDescrPart: description } = shortenDescription(
    removeEmptyLines(wobject?.description),
    350,
  );
  const altText = description || `${wobject.name} image`;

  return (
    ((hasTitle && !isMap) || hasDescription) && (
      <div className={'ListDescription'} style={isMap && hasAvatar ? { minHeight: '350px' } : {}}>
        <section>
          {hasAvatar && hasDescription && (
            <div className={'ListDescription__image-container'}>
              <img className={'ListDescription__image'} src={wobject.avatar} alt={altText} />
            </div>
          )}
          {hasDescription && (
            <>
              <div>
                <h1 className={'ListDescription__title margin-bottom'}>
                  {hasTitle ? wobject.title : wobject.name}
                </h1>
                <p>
                  {firstDescrPart}
                  {!isEmpty(secondDescrPart) && !showMore && (
                    <button
                      onClick={() => setShowMore(!showMore)}
                      className="main-color-button ml2"
                    >
                      <FormattedMessage id="show_more" defaultMessage="Show more" />
                    </button>
                  )}
                </p>
                {showMore && <p>{secondDescrPart}</p>}
              </div>
            </>
          )}
        </section>
      </div>
    )
  );
};

ListDescription.propTypes = {
  isMap: PropTypes.bool,
  wobject: PropTypes.shape({
    description: PropTypes.string,
    title: PropTypes.string,
    name: PropTypes.string,
    avatar: PropTypes.string,
  }).isRequired,
};

export default ListDescription;
