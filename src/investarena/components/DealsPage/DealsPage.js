import React, { Component } from 'react';
import { injectIntl } from 'react-intl';
import PropTypes from 'prop-types';
import { getViewMode, setViewMode } from '../../helpers/localStorageHelpers';
import OpenDeals from './OpenDeals';
import ClosedDeals from './ClosedDeals';
import Affix from '../../../client/components/Utils/Affix';
import LeftSidebar from '../../../client/app/Sidebar/LeftSidebar';
import SortSelector from '../../../client/components/SortSelector/SortSelector';
import './DealsPage.less';

const propTypes = {
  intl: PropTypes.shape().isRequired,
  match: PropTypes.shape().isRequired,
  platformName: PropTypes.string.isRequired,
  toggleModalBroker: PropTypes.func.isRequired,
};

class DealsPage extends Component {
  constructor(props) {
    super(props);
    this.state = {
      viewMode: 'list',
    };
  }

  componentDidMount() {
    const currentViewMode = getViewMode('instruments');
    if (currentViewMode) this.setState({ viewMode: currentViewMode });
  }

  toggleViewMode = viewMode => {
    this.setState({ viewMode });
    setViewMode('instruments', viewMode);
  };
  render() {
    const { viewMode } = this.state;
    const paramDealType = this.props.match.params.dealType;
    const isClosedDealType = paramDealType === 'closed';
    return (
      <div className="st-deals-page">
        <div className="feed-layout container">
          <Affix className="leftContainer" stickPosition={115}>
            <div className="left">
              <LeftSidebar />
            </div>
          </Affix>
          <div className="center">
            <div className="st-deals-toggle-view">
              <SortSelector
                caption={this.props.intl.formatMessage({
                  id: 'view_as',
                  defaultMessage: 'View as',
                })}
                sort={this.state.viewMode}
                onChange={this.toggleViewMode}
              >
                <SortSelector.Item key="list">
                  {this.props.intl.formatMessage({ id: 'list', defaultMessage: 'List' })}
                </SortSelector.Item>
                <SortSelector.Item key="cards">
                  {this.props.intl.formatMessage({ id: 'cards', defaultMessage: 'Cards' })}
                </SortSelector.Item>
              </SortSelector>
            </div>
            <div className="st-instruments-details">
              {this.props.platformName !== 'widgets' ? (
                isClosedDealType ? (
                  <ClosedDeals viewMode={viewMode} />
                ) : (
                  <OpenDeals viewMode={viewMode} />
                )
              ) : (
                <div className="st-deals-wrap st-connect-to-broker-wrap">
                  <span className="st-margin-bottom-large">
                    {this.props.intl.formatMessage({
                      id: 'headerAuthorized.textAttention3',
                      defaultMessage: 'To start trading, connect ',
                    })}
                    <a onClick={this.props.toggleModalBroker} role="presentation">
                      {this.props.intl.formatMessage({
                        id: 'wia.your_broker',
                        defaultMessage: 'your broker',
                      })}
                    </a>
                  </span>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    );
  }
}

DealsPage.propTypes = propTypes;

export default injectIntl(DealsPage);
