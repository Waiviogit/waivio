import PropTypes from 'prop-types';
import {injectIntl} from "react-intl";
import React from 'react';
import { Tabs } from 'antd';
import ClosedDeals from './ClosedDeals';
import OpenDeals from './OpenDeals';

const TabPane = Tabs.TabPane;

const propTypes = {
    viewMode: PropTypes.oneOf(['list', 'cards'])
};
const defaultProps = {
  viewMode: 'list'
};
const DealsTab = ({viewMode, intl}) => {
    return (
        <div className="st-deals-wrap">
          <Tabs defaultActiveKey="1">
            <TabPane tab={intl.formatMessage({ id: 'sidebarWidget.tabTitle.openDeals', defaultMessage: "Open" })} key="1">
              <OpenDeals viewMode={viewMode}/>
            </TabPane>
            <TabPane tab={intl.formatMessage({ id: 'sidebarWidget.tabTitle.closedDeals', defaultMessage: "Closed" })} key="2">
              <ClosedDeals viewMode={viewMode}/>
            </TabPane>
          </Tabs>
        </div>
    );
};

DealsTab.propTypes = propTypes;
DealsTab.defaultProps = defaultProps;

export default injectIntl(DealsTab);
