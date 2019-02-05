import React, { Component } from 'react';
import _ from 'lodash';
import { injectIntl } from 'react-intl';
import PropTypes from 'prop-types';
import { getViewMode, setViewMode } from '../../helpers/localStorageHelpers';
import AssetsTab from './AssetsTab/AssetsTab';
import { getAllSignals } from '../../redux/actions/signalsActions';
import { supportedObjectTypes } from "../../constants/objectsInvestarena";
import Affix from '../../../client/components/Utils/Affix';
import LeftSidebar from '../../../client/app/Sidebar/LeftSidebar';
import SortSelector from '../../../client/components/SortSelector/SortSelector';
import './InstrumentsPage.less';

const propTypes = {
    charts: PropTypes.shape(),
    openDeals: PropTypes.shape(),
    quotes: PropTypes.shape().isRequired,
    match: PropTypes.shape().isRequired,
    quoteSettings: PropTypes.shape().isRequired,
    getChartsData: PropTypes.func.isRequired,
    intl: PropTypes.shape().isRequired,
};
const defaultProps = {
    charts: {},
    openDeals: {},
    favorites: []
};

class InstrumentsPage extends Component {
    constructor (props) {
        super(props);
        this.state = {
            trends: [],
            signals: {},
            wobjs: [],
            viewMode: 'list',
        };
    }

    componentDidMount () {
        this.props.getChartsData();
        const viewMode = getViewMode('instruments');
        if(viewMode) this.setState({viewMode});
        getAllSignals().then(({ data, error }) => {
            if (!error && data) {
              this.setState({signals: data})
            }
        });

    }

    toggleViewMode = viewMode => {
      this.setState({viewMode});
      setViewMode('instruments', viewMode);
    };

    render () {
      const paramMarket = this.props.match.params.marketType;
      const marketType = _.some(supportedObjectTypes, market => market === paramMarket) ? paramMarket : 'crypto';
      return (
            <div className="st-instr-page">
              <div className="feed-layout container">
                <Affix className="leftContainer" stickPosition={115}>
                  <div className="left">
                    <LeftSidebar />
                  </div>
                </Affix>
                <div className="center">
                  <div role='presentation' className="st-instruments-toggle-view">
                    <SortSelector
                      caption={this.props.intl.formatMessage({id: 'view_as', defaultMessage: "View as"})}
                      sort={this.state.viewMode}
                      onChange={this.toggleViewMode}
                    >
                      <SortSelector.Item key="list">
                        {this.props.intl.formatMessage({id: 'list', defaultMessage: "List"})}
                      </SortSelector.Item>
                      <SortSelector.Item key="cards">
                        {this.props.intl.formatMessage({id: 'cards', defaultMessage: "Cards"})}
                      </SortSelector.Item>
                    </SortSelector>
                  </div>
                  <AssetsTab
                    quotes={this.props.quotes}
                    charts={this.props.charts}
                    signals={this.state.signals}
                    deals={this.props.openDeals}
                    quoteSettings={this.props.quoteSettings}
                    title={marketType.toLowerCase()}
                    trends={this.state.trends}
                    viewMode={this.state.viewMode}
                  />
                  </div>
                </div>
              </div>
        );
    }
}

InstrumentsPage.propTypes = propTypes;
InstrumentsPage.defaultProps = defaultProps;

export default injectIntl(InstrumentsPage);
