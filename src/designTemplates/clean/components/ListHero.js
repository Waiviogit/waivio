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

  const descriptionParagraphs = useMemo(() => {
    if (!fullDescription) return [];

    return wobject?.description.split('\n\n').filter(p => p.trim().length > 0);
  }, [fullDescription]);

  const shortDescription = useMemo(() => {
    if (!fullDescription) return '';

    const { firstDescrPart } = shortenDescription(fullDescription, 260);

    return firstDescrPart;
  }, [fullDescription]);

  const shortDescriptionParagraphs = useMemo(() => {
    if (!shortDescription) return [];

    return shortDescription.split('\n\n').filter(p => p.trim().length > 0);
  }, [shortDescription]);

  const hasMoreText = fullDescription.length > 260;
  const displayParagraphs = isExpanded ? descriptionParagraphs : shortDescriptionParagraphs;

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
        'CleanListHero--expanded': isExpanded,
      })}
    >
      <div className="CleanListHero__content">
        {eyebrow && <p className="CleanListHero__eyebrow">{eyebrow}</p>}
        {heroTitle && <h2 className="CleanListHero__title">{heroTitle}</h2>}
        {displayParagraphs.length > 0 && (
          <div className="CleanListHero__subtitle">
            {displayParagraphs.map((paragraph, index) => {
              if (isExpanded && index === 0) {
                return (
                  // eslint-disable-next-line react/no-array-index-key
                  <p key={index} className="CleanListHero__paragraph--first">
                    {paragraph}
                  </p>
                );
              }
              if (isExpanded && index > 0) {
                return null;
              }

              return (
                // eslint-disable-next-line react/no-array-index-key
                <p key={index}>{paragraph}</p>
              );
            })}
          </div>
        )}
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
      {isExpanded && displayParagraphs.length > 1 && (
        <div className="CleanListHero__restParagraphs">
          {displayParagraphs.slice(1).map((paragraph, index) => (
            // eslint-disable-next-line react/no-array-index-key
            <p key={index + 1}>{paragraph}</p>
          ))}
        </div>
      )}
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
