import PropTypes from 'prop-types';
import React, { memo, useMemo } from 'react';
import { getObjectName } from '../../../common/helpers/wObjectHelper';
import { removeEmptyLines, shortenDescription } from '../../../client/object/wObjectHelper';

import './ListHero.less';

const CleanListHero = ({ wobject }) => {
  const eyebrow = useMemo(() => getObjectName(wobject) || wobject?.name, [wobject, wobject?.name]);

  const heroTitle = useMemo(() => wobject?.title || getObjectName(wobject), [wobject]);

  const heroDescription = useMemo(() => {
    const source = removeEmptyLines(wobject?.description || '');

    if (!source) return '';

    const { firstDescrPart } = shortenDescription(source, 260);

    return firstDescrPart;
  }, [wobject?.description]);

  const banner = wobject?.avatar;

  const hasContent = heroTitle || heroDescription || banner;

  if (!hasContent) return null;

  return (
    <section className="CleanListHero">
      <div className="CleanListHero__content">
        {eyebrow && <p className="CleanListHero__eyebrow">{eyebrow}</p>}
        {heroTitle && <h1 className="CleanListHero__title">{heroTitle}</h1>}
        {heroDescription && <p className="CleanListHero__subtitle">{heroDescription}</p>}
      </div>
      {banner && (
        <div className="CleanListHero__banner">
          <img src={banner} alt={heroTitle || eyebrow || 'Hero visual'} />
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
