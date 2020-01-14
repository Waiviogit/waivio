import React from 'react';
import PropTypes from 'prop-types';
import {connect} from 'react-redux';
import {injectIntl} from 'react-intl';

import QuickForecastCard from './QuickForecastCard';
import Loading from '../../../client/components/Icon/Loading';
import BallotTimer from './BallotTimer';
import TopPredictors from './TopPredictors';
import USDDisplay from '../../../client/components/Utils/USDDisplay';
import SortSelector from '../../../client/components/SortSelector/SortSelector';
import {
  answerForQuickForecast,
  getDataForQuickForecast,
  getForecastStatistic,
  getForecastWinners
} from '../../redux/actions/forecastActions';
import {marketNames} from '../../constants/objectsInvestarena';

import './QuickForecastPage.less';

class QuickForecastPage extends React.PureComponent {
  state = {
    isLoading: false,
    sortBy: ''
  };

  componentDidMount () {
    this.props.getDataForQuickForecast();
    this.props.getForecastStatistic();
    this.props.getForecastWinners(5, this.props.quickForecastDataList.length);

    setTimeout(() => this.setState(state => ({isLoading: !state.isLoading})), 3000)
  }

  handleSort (sort) {
    this.setState({sortBy: sort});
  };

  handleFinishTimer () {
    this.props.getDataForQuickForecast();
    this.props.getForecastWinners();
  }

  render() {
    // const seconds = (finish - currentTime) * 0.001;
    const time = 3000;
    let minutes = time / 60;
    let hours;

    if (minutes > 60) {
      hours = Math.floor(minutes / 60);
      minutes -= (hours * 60);
    }

    if (minutes < 0) {
      minutes = 0;
      hours = 0;
    }
    const filterForecastList = this.props.quickForecastDataList.filter(obj => obj.market === this.state.sortBy);
    // const forecastList = this.state.sortBy
    //   ? filterForecastList
    //   : this.props.quickForecastDataList;
    const forecastList = [{
      "_id": "5e1c9f7face3080c161a91c8",
      "author_count_forecasts": 1,
      "priority_counter": 3,
      "active": true,
      "market": "Stock",
      "visible_marker": 0,
      "id": "sor31/testing",
      "author": "sor31",
      "permlink": "testing",
      "createdAt": "2020-01-13T16:48:58.000Z",
      "security": "ABBV",
      "recommend": "Sell",
      "expiredAt": "2020-01-13T17:18:58.000Z",
      "__v": 0
    }];
    const filtersType = [...marketNames,
      {
        name: 'Reset',
        key: '',
        intl: {
          id: 'reset_filter',
          defaultMessage: 'Reset'
        }
      }];
    const sortItemKey = type => type.name === 'Reset' ? '' : type.name;

    return (
      <div className="shifted">
        <div className="feed-layout container">
          <div className="leftContainer">
            <TopPredictors userList={this.props.usersList} title="Top 5 Users" activeUser={this.props.user}/>
          </div>
          <div className="center">
            <div className="timer-container">
              <BallotTimer minutes={minutes} hours={hours} willCallAfterTimerEnd={this.handleFinishTimer} timeInSeconds={3000}/>
            </div>
            <SortSelector caption="Filter" sort={this.state.sortBy} onChange={sort => this.handleSort(sort)}>
              {
                filtersType.map(type => (
                  <SortSelector.Item key={sortItemKey(type)}>
                    {this.props.intl.formatMessage({id: type.intl.id, defaultMessage: type.intl.defaultMessage})}
                  </SortSelector.Item>
                ))
              }
            </SortSelector>
            {
              this.state.isLoading
                ? forecastList.map(obj => (
                  <QuickForecastCard forecast={obj} key={Math.random()}
                                     predictionObjectName={this.props.quotesSett[obj.security].name}
                                     answerForecast={this.props.answerForQuickForecast}
                                     price={this.props.quotes[obj.security].bidPrice}
                                     getForecast={this.props.getDataForQuickForecast}/>)
                )
                : <Loading/>
            }
            {
              this.state.isLoading && !forecastList.length && (
                <div className="no-posts">
                  {this.props.intl.formatMessage({id: 'no_quick_forecasts', defaultMessage: 'There are currently no forecasts in this category'})}
                </div>
              )
            }
          </div>
          <div className="rightContainer">
            <div className="reward">
              <span>Rewards:</span>
              <USDDisplay value={14}/>
              <span>Current round:</span>
              <USDDisplay value={14}/>
            </div>
            <TopPredictors
              userList={this.props.winners}
              title="Current round winners"
              activeUser={this.props.user}
              showMore={this.props.hasMore}/>
          </div>
        </div>
      </div>
    );
  }
}

QuickForecastPage.propTypes = {
  quickForecastDataList: PropTypes.arrayOf(PropTypes.object).isRequired,
  answerForQuickForecast: PropTypes.func.isRequired,
  getDataForQuickForecast: PropTypes.func.isRequired,
  getForecastWinners: PropTypes.func.isRequired,
  getForecastStatistic: PropTypes.func.isRequired,
  intl: PropTypes.shape({
    formatMessage: PropTypes.func,
  }).isRequired,
  quotesSett: PropTypes.shape().isRequired,
  quotes: PropTypes.shape().isRequired,
  user: PropTypes.shape({
    name: PropTypes.string,
    successful_suppose: PropTypes.number,
  }),
  usersList: PropTypes.arrayOf(PropTypes.shape({})).isRequired,
  winners: PropTypes.arrayOf(PropTypes.shape({})).isRequired,
  hasMore: PropTypes.bool,
};

QuickForecastPage.defaultProps = {
  user: {
    name: '',
    successful_suppose: 0,
  },
  hasMore: false,
};

const mapStateToProps = state => ({
  quickForecastDataList: state.forecasts.quickForecastData,
  quotesSett: state.quotesSettings,
  quotes: state.quotes,
  usersList: state.forecasts.userStatistics,
  user: state.forecasts.current,
  winners: state.forecasts.winners,
  hasMore: state.forecasts.hasMoreStatistic
});

const mapDispatchToProps = {
  answerForQuickForecast,
  getDataForQuickForecast,
  getForecastWinners,
  getForecastStatistic,
};

export default injectIntl(connect(mapStateToProps, mapDispatchToProps)(QuickForecastPage));
