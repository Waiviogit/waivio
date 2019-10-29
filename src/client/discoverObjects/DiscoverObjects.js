import React from 'react';
import PropTypes from 'prop-types';
import Helmet from 'react-helmet';
import { injectIntl } from 'react-intl';
import { connect } from 'react-redux';
import Affix from '../components/Utils/Affix';
import LeftSidebar from '../app/Sidebar/LeftSidebar';
import DiscoverObjectsContent from './DiscoverObjectsContent';
import ObjectsContainer from '../objects/ObjectsContainer';
import RightSidebar from '../app/Sidebar/RightSidebar';
import { getQuotesSettingsState } from '../../investarena/redux/selectors/quotesSettingsSelectors';
import { typesWithChartId } from '../../investarena/constants/objectsInvestarena';
import './DiscoverObjects.less';

const DiscoverObjects = ({ intl, history, match, quoteSettings }) => {
  const isTypeChosen = Boolean(match.params.typeName !== 'show_all');
  const { pathname, search } = history.location;

  const paramMarket = match.params.marketType;
  const marketType = typesWithChartId.some(market => market === paramMarket)
    ? paramMarket
    : 'crypto';
  const quoteSettingsSorted = {};
  Object.entries(quoteSettings).forEach(([key, value]) => {
    if (value.wobjData && value.priceRounding) {
      const marketName = value.market.toLowerCase();
      quoteSettingsSorted[marketName] = quoteSettingsSorted[marketName]
        ? [...quoteSettingsSorted[marketName], { ...value, keyName: key }]
        : [{ ...value, keyName: key }];
    }
  });

  return (
    <div className="shifted">
      <Helmet>
        <title>
          {intl.formatMessage({ id: 'objects_title', defaultMessage: 'Discover objects' })} - Waivio
        </title>
      </Helmet>
      <div className="feed-layout container">
        <Affix className="leftContainer" stickPosition={116}>
          <div className="left">
            <LeftSidebar />
          </div>
        </Affix>
        {isTypeChosen && (
          <Affix className="rightContainer" stickPosition={116}>
            <div className="right">
              <RightSidebar />
            </div>
          </Affix>
        )}
        <div className={`discover-objects${isTypeChosen ? ' center' : ''}`}>
          {isTypeChosen ? (
            <DiscoverObjectsContent
              history={history}
              typeName={match.params.typeName}
              key={pathname + search}
              intl={intl}
              match={match}
            />
          ) : (
            <ObjectsContainer />
          )}
        </div>
      </div>
    </div>
  );
};

DiscoverObjects.propTypes = {
  intl: PropTypes.shape().isRequired,
  history: PropTypes.shape().isRequired,
  match: PropTypes.shape().isRequired,
  quoteSettings: PropTypes.shape().isRequired,
};

const mapStateToProps = state => ({ quoteSettings: getQuotesSettingsState(state) });

export default connect(mapStateToProps)(injectIntl(DiscoverObjects));
