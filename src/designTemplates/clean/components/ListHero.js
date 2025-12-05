import PropTypes from 'prop-types';
import React, { memo, useMemo, useState } from 'react';
import { FormattedMessage } from 'react-intl';
import classNames from 'classnames';
import { getObjectName } from '../../../common/helpers/wObjectHelper';
import { removeEmptyLines, shortenDescription } from '../../../client/object/wObjectHelper';

import './ListHero.less';

const CleanListHero = ({ wobject }) => {
  const [isExpanded, setIsExpanded] = useState(false);

  const eyebrow = useMemo(() => getObjectName(wobject) || wobject?.name, [wobject, wobject?.name]);

  const heroTitle = useMemo(() => wobject?.title || getObjectName(wobject), [wobject]);

  const fullDescription = useMemo(() => removeEmptyLines(wobject?.description || ''), [
    wobject?.description,
  ]);

  const shortDescription = useMemo(() => {
    if (!fullDescription) return '';

    const { firstDescrPart } = shortenDescription(fullDescription, 260);

    return firstDescrPart;
  }, [fullDescription]);

  const hasMoreText = fullDescription.length > 260;
  const heroDescription = isExpanded ? fullDescription : shortDescription;

  const banner = wobject?.avatar;

  const hasContent = heroTitle || heroDescription || banner;

  if (!hasContent) return null;

  return (
    <section
      className={classNames('CleanListHero', {
        'CleanListHero--no-banner': !banner,
      })}
    >
      <div className="CleanListHero__content">
        {eyebrow && <p className="CleanListHero__eyebrow">{eyebrow}</p>}
        {heroTitle && <h2 className="CleanListHero__title">{heroTitle}</h2>}
        {heroDescription && <p className="CleanListHero__subtitle">{heroDescription}</p>}
        {hasMoreText && (
          <button
            type="button"
            className="CleanListHero__readMore"
            onClick={() => setIsExpanded(!isExpanded)}
          >
            {isExpanded ? (
              <FormattedMessage id="show_less" defaultMessage="show less" />
            ) : (
              <FormattedMessage id="read_more" defaultMessage="read more" />
            )}
          </button>
        )}
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
