import PropTypes from 'prop-types';
import React, { memo, useCallback, useMemo } from 'react';
import { useHistory } from 'react-router';
import { useSelector } from 'react-redux';
import { getNavigItems, getWebsiteConfiguration } from '../../../store/appStore/appSelectors';
import { getObjectName } from '../../../common/helpers/wObjectHelper';
import { getBaseObject } from '../../../store/wObjectStore/wObjectSelectors';
import { removeEmptyLines, shortenDescription } from '../../../client/object/wObjectHelper';

import './ListHero.less';

const MAX_SECONDARY_ACTIONS = 4;

const CleanListHero = ({ wobject }) => {
  const history = useHistory();
  const baseObject = useSelector(getBaseObject);
  const navigationItems = useSelector(getNavigItems);
  const configuration = useSelector(getWebsiteConfiguration);

  const eyebrow = useMemo(
    () => getObjectName(baseObject) || configuration?.header?.name || wobject?.name,
    [baseObject, configuration?.header?.name, wobject?.name],
  );

  const heroTitle = useMemo(
    () => baseObject?.title || configuration?.header?.tagline || getObjectName(baseObject),
    [baseObject, configuration?.header?.tagline],
  );

  const heroDescription = useMemo(() => {
    const source =
      baseObject?.description ||
      configuration?.header?.subtitle ||
      removeEmptyLines(wobject?.description || '');

    if (!source) return '';

    const { firstDescrPart } = shortenDescription(source, 260);

    return firstDescrPart;
  }, [baseObject?.description, configuration?.header?.subtitle, wobject?.description]);

  const banner = wobject?.background || baseObject?.background || configuration?.mainBanner;
  const actions = navigationItems?.slice(0, MAX_SECONDARY_ACTIONS + 1) || [];
  const primaryAction = actions[0];
  const secondaryActions = actions.slice(1);

  const handleNavigation = useCallback(
    action => {
      if (!action?.link) return;

      if (action.type === 'blank') {
        if (typeof window !== 'undefined')
          window.open(action.link, '_blank', 'noopener,noreferrer');
      } else {
        history.push(action.link);
      }
    },
    [history],
  );

  const hasContent = heroTitle || heroDescription || banner;

  if (!hasContent) return null;

  return (
    <section className="CleanListHero">
      <div className="CleanListHero__content">
        {eyebrow && <p className="CleanListHero__eyebrow">{eyebrow}</p>}
        {heroTitle && <h1 className="CleanListHero__title">{heroTitle}</h1>}
        {heroDescription && <p className="CleanListHero__subtitle">{heroDescription}</p>}
        {!!actions?.length && (
          <div className="CleanListHero__actions">
            {primaryAction && (
              <button
                type="button"
                className="CleanListHero__cta CleanListHero__cta--primary"
                onClick={() => handleNavigation(primaryAction)}
              >
                {primaryAction.name}
              </button>
            )}
            {secondaryActions.map(action => (
              <button
                type="button"
                key={action.link}
                className="CleanListHero__cta CleanListHero__cta--ghost"
                onClick={() => handleNavigation(action)}
              >
                {action.name}
              </button>
            ))}
          </div>
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
  }),
};

CleanListHero.defaultProps = {
  wobject: {},
};

export default memo(CleanListHero);
