import React from 'react';
import PropTypes from 'prop-types';
import {connect} from 'react-redux';
import {injectIntl} from 'react-intl';
import {Icon} from 'antd';
import { Link } from 'react-router-dom';

import QuickForecastCard from './QuickForecastCard/QuickForecastCard';
import Loading from '../../../client/components/Icon/Loading';
import BallotTimer from './BallotTimer';
import TopPredictors from './TopPredictions/TopPredictors';
import USDDisplay from '../../../client/components/Utils/USDDisplay';
import SortSelector from '../../../client/components/SortSelector/SortSelector';
import {
  answerForQuickForecast,
  getDataForQuickForecast, getForecastRoundRewards,
  getForecastStatistic,
  getForecastWinners,
} from '../../redux/actions/forecastActions';
import {marketNames} from '../../constants/objectsInvestarena';

import './QuickForecastPage.less';

class QuickForecastPage extends React.PureComponent {
  state = {
    sortBy: '',
  };

  componentDidMount() {
    this.props.getDataForQuickForecast();
    this.props.getForecastStatistic();
    this.props.getForecastWinners(5, this.props.winners.length);
    this.props.getForecastRoundRewards();

    this.currentTime = Date.now();
    setTimeout(() => this.setState(state => ({isLoading: !state.isLoading})), 3000);
  }

  getSortItemKey = type =>
    (type.name === 'Reset'
      ? ''
      : type.name);

  filtersType = [{
    name: 'Reset',
    key: '',
    intl: {
      id: 'reset_filter',
      defaultMessage: 'Reset',
    },
  },
    ...marketNames];

  handleSort(sort) {
    this.setState({sortBy: sort});
  }

  handleFinishTimer() {
    this.props.getDataForQuickForecast();
    this.props.getForecastWinners(5, 0);
    this.props.getForecastRoundRewards();
  }

  render() {
    const filterForecastList = this.props.quickForecastDataList.filter(
      obj => obj.market === this.state.sortBy && obj.active,
    );
    const answeredForecastList = this.props.quickForecastDataList.filter(
      forecast => !forecast.active
    );
    const forecastList = this.state.sortBy
      ? [...answeredForecastList, ...filterForecastList]
      : this.props.quickForecastDataList;
    const currentForecastList = answeredForecastList.length === 5
      ? answeredForecastList
      : forecastList;
    const secondsInMilliseconds = sec => sec / 0.001;
    const finishRoundTime = this.props.roundTime && this.currentTime + secondsInMilliseconds(this.props.roundTime);

    return (
      <div className="shifted">
        <div className="feed-layout container">
          <h1 className="head-title">Guess and get money
            <br/>absolutely
            <span className="free"> FREE</span></h1>
          <div className="leftContainer">
            <Link to="#" className="rules"  title="How it works">
              <span className="rules__link">
               {
                 this.props.intl.formatMessage({
                   id: 'how_it_work',
                   defaultMessage: 'How it works',
                 })
               }&#160;
              </span>
              <Icon type="question-circle"/>
            </Link>
            <TopPredictors
              userList={this.props.usersList}
              title="Top 5 Users"
              activeUser={this.props.user}
            />
          </div>
          <div className="center">
            {
              this.state.isLoading ? (
                <React.Fragment>
                  <div className="timer-container">
                    <BallotTimer endTimerTime={finishRoundTime}
                                 willCallAfterTimerEnd={() => this.handleFinishTimer()}/>
                  </div>
                  <SortSelector
                    caption="Filter"
                    sort={this.state.sortBy}
                    onChange={sort => this.handleSort(sort)}
                  >
                    {
                      this.filtersType.map(type => (
                        <SortSelector.Item key={this.getSortItemKey(type)}>
                          {
                            this.props.intl.formatMessage({id: type.intl.id, defaultMessage: type.intl.defaultMessage})
                          }
                        </SortSelector.Item>
                      ))
                    }
                  </SortSelector>
                  {
                    currentForecastList.map((obj, index) => (
                      <QuickForecastCard
                        forecast={obj}
                        key={Math.random()}
                        predictionObjectName={this.props.quotesSett[obj.security] && this.props.quotesSett[obj.security].name}
                        avatar={this.props.quotesSett[obj.security] && this.props.quotesSett[obj.security].wobjData.avatarlink}
                        answerForecast={this.props.answerForQuickForecast}
                        getForecast={this.props.getDataForQuickForecast}
                        timerData={secondsInMilliseconds(this.props.timeForTimer)}
                        id={index}
                        timerCallback={() => this.handleFinishTimer()}
                        counter={answeredForecastList.length}
                      />))
                  }
                </React.Fragment>
              ) : <Loading/>
            }
            {
              this.state.isLoading && !forecastList.length && (
                <div className="no-posts">
                  {
                    this.props.intl.formatMessage({
                      id: 'no_quick_forecasts',
                      defaultMessage: 'There are currently no forecasts in this category',
                    })
                  }
                </div>
              )}
          </div>
          <div className="rightContainer">
            <div className="reward">
              <span className="reward__row">
                {
                  this.props.intl.formatMessage({
                    id: 'forecasts__rewards',
                    defaultMessage: 'Rewards',
                  })
                }:&#160;
                <USDDisplay value={this.props.roundInformation.rewards}/>
              </span>
              <span className="reward__row">
                {
                  this.props.intl.formatMessage({
                    id: 'forecast_round',
                    defaultMessage: 'Current round',
                  })
                }:&#160;
                <USDDisplay value={this.props.roundInformation.voitingPowers}/>
              </span>
            </div>
            <TopPredictors
              userList={this.props.winners}
              title="Current round winners"
              activeUser={this.props.user}
              showMore={this.props.hasMore}
            />
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
  getForecastRoundRewards: PropTypes.func.isRequired,
  getForecastWinners: PropTypes.func.isRequired,
  getForecastStatistic: PropTypes.func.isRequired,
  intl: PropTypes.shape({
    formatMessage: PropTypes.func,
  }).isRequired,
  quotesSett: PropTypes.shape().isRequired,
  user: PropTypes.shape({
    name: PropTypes.string,
    successful_suppose: PropTypes.number,
  }),
  usersList: PropTypes.arrayOf(PropTypes.shape({})).isRequired,
  winners: PropTypes.arrayOf(PropTypes.shape({})).isRequired,
  hasMore: PropTypes.bool,
  roundTime: PropTypes.number,
  timeForTimer: PropTypes.number.isRequired,
  roundInformation: PropTypes.shape({
    rewards: PropTypes.number,
    voitingPowers: PropTypes.number,
  }).isRequired,
};

QuickForecastPage.defaultProps = {
  user: {
    name: '',
    successful_suppose: 0,
  },
  hasMore: false,
  roundTime: 0,
};

const mapStateToProps = state => ({
  quickForecastDataList: state.forecasts.quickForecastData,
  quotesSett: state.quotesSettings,
  usersList: state.forecasts.userStatistics,
  user: state.forecasts.current,
  winners: state.forecasts.winners,
  hasMore: state.forecasts.hasMoreStatistic,
  timeForTimer: state.forecasts.timer,
  roundInformation: state.forecasts.roundInfo,
  roundTime: state.forecasts.roundTime,
});

const mapDispatchToProps = {
  answerForQuickForecast,
  getDataForQuickForecast,
  getForecastWinners,
  getForecastStatistic,
  getForecastRoundRewards,
};

export default injectIntl(connect(mapStateToProps, mapDispatchToProps)(QuickForecastPage));
