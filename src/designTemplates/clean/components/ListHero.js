import PropTypes from 'prop-types';
import React, { memo, useMemo } from 'react';
import classNames from 'classnames';
import { getObjectName } from '../../../common/helpers/wObjectHelper';
import { removeEmptyLines } from '../../../client/object/wObjectHelper';

import './ListHero.less';

const CleanListHero = ({ wobject }) => {
  const name = useMemo(() => getObjectName(wobject) || wobject?.name, [wobject, wobject?.name]);

  const heroTitle = useMemo(() => wobject?.title || getObjectName(wobject), [wobject]);

  const fullDescription = useMemo(() => removeEmptyLines(wobject?.description || ''), [
    wobject?.description,
  ]);

  const descriptionParagraphs = useMemo(() => {
    if (!fullDescription) return [];

    return wobject?.description.split('\n\n').filter(p => p.trim().length > 0);
  }, [fullDescription]);

  const displayParagraphs = descriptionParagraphs;

  const banner = wobject?.avatar;

  const hasContent =
    (heroTitle && banner) ||
    (fullDescription && banner) ||
    (heroTitle && banner && fullDescription);

  if (!hasContent) return null;

  return (
    <section
      className={classNames('CleanListHero', {
        'CleanListHero--no-banner': !banner,
      })}
    >
      <div className="CleanListHero__content">
        {name && <h2 className="CleanListHero__title">{name}</h2>}
        {displayParagraphs.length > 0 && (
          <div className="CleanListHero__subtitle">
            {displayParagraphs.map((paragraph, index) => (
              // eslint-disable-next-line react/no-array-index-key
              <p key={index}>{paragraph}</p>
            ))}
          </div>
        )}
      </div>
      {banner && (
        <div className="CleanListHero__banner">
          <img src={banner} alt={heroTitle || 'Hero visual'} />
        </div>
      )}
    </section>
  );
};

CleanListHero.propTypes = {
  wobject: PropTypes.shape({
    background: PropTypes.string,
    description: PropTypes.string,
    name: PropTypes.string,
    title: PropTypes.string,
    avatar: PropTypes.string,
  }),
};

CleanListHero.defaultProps = {
  wobject: {},
};

export default memo(CleanListHero);
