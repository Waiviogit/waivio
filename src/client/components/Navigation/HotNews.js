import React, { useState } from 'react';
import { injectIntl } from 'react-intl';
import { Link } from 'react-router-dom';
import { Icon } from 'antd';
import PropTypes from 'prop-types';
import { isEmpty } from 'lodash';
import BTooltip from '../BTooltip';
import PopoverContainer from '../Popover';
import { getTopPosts } from '../../../waivioApi/ApiClient';
import './NewsOverlay.less';

const HotNews = props => {
  const { intl, isMobile } = props;
  const [hotNewsVisible, setHotNewsVisible] = useState(false);
  const [dailyChosenPost, setDailyChosenPost] = useState('');
  const [weeklyChosenPost, setWeeklyChosenPost] = useState('');

  const handleVisibleChange = async () => {
    setHotNewsVisible(!hotNewsVisible);

    if (isEmpty(dailyChosenPost)) {
      getTopPosts()
        .then(data => {
          if (!isEmpty(data.daily_chosen_post) && !isEmpty(data.weekly_chosen_post)) {
            setDailyChosenPost(data.daily_chosen_post);
            setWeeklyChosenPost(data.weekly_chosen_post);
          }
        })
        .catch(error => console.error(error));
    }
  };

  return (
    <BTooltip
      placement="bottom"
      title={intl.formatMessage({ id: 'hot_news', defaultMessage: 'Hot news' })}
      overlayClassName="Topnav__notifications-tooltip"
      mouseEnterDelay={1}
    >
      <PopoverContainer
        placement="bottomRight"
        trigger="click"
        content={
          <div className="Topnav__hot-news">
            {!isEmpty(dailyChosenPost) && (
              <Link
                to={`/@${dailyChosenPost.author}/${dailyChosenPost.permlink}`}
                className="Topnav__hot-news-item"
                onClick={handleVisibleChange}
              >
                {dailyChosenPost.title}
              </Link>
            )}
            {!isEmpty(weeklyChosenPost) && (
              <Link
                to={`/@${weeklyChosenPost.author}/${weeklyChosenPost.permlink}`}
                className="Topnav__hot-news-item"
                onClick={handleVisibleChange}
              >
                {weeklyChosenPost.title}
              </Link>
            )}
            <Link
              to="/economical-calendar"
              className="Topnav__hot-news-item"
              onClick={handleVisibleChange}
            >
              Economical calendar
            </Link>
          </div>
        }
        visible={hotNewsVisible}
        onVisibleChange={handleVisibleChange}
        overlayClassName="NewsOverlay__popover-overlay"
        title={intl.formatMessage({ id: 'hot_news', defaultMessage: 'Hot news' })}
      >
        {!isMobile ? (
          <Icon type="fire" className="iconfont fire-icon" />
        ) : (
          <a className="MenuButtons__item-link">
            <img className="fire-img" alt="news" src="/images/icons/ia-icon-fire.svg" />
          </a>
        )}
      </PopoverContainer>
    </BTooltip>
  );
};

HotNews.propTypes = {
  intl: PropTypes.shape().isRequired,
  isMobile: PropTypes.bool,
};

HotNews.defaultProps = {
  isMobile: false,
};

export default injectIntl(HotNews);
