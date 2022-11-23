import React, { useLayoutEffect } from 'react';
import { Icon } from 'antd';
import { Helmet } from 'react-helmet';
import { Link } from 'react-router-dom';
import PropTypes from 'prop-types';
import { injectIntl } from 'react-intl';

import WebsiteFooter from '../WebsiteFooter/Footer';
import CarouselSection from './components/CarouselSection/CarouselSection';
import DistrictSection from './components/DistrictSection/DistrictSection';
import NearbySection from './components/NearbySection/NearbySection';
import { isMobile } from '../../../../common/helpers/apiHelpers';
import SubmitDishPhotosButton from '../../../widgets/SubmitDishPhotosButton/SubmitDishPhotosButton';

import './WebsiteMainPage.less';

const WebsiteMainPage = props => {
  const helmetImg = '/images/dining.gifts.png';

  useLayoutEffect(() => {
    if (window) {
      window.scrollTo(0, 0);
    }
  }, []);

  const onClickButtonFindRewards = () => {
    const findRewardsLink = isMobile() ? 'type=restaurant' : 'showPanel=true&type=restaurant';

    if (window.gtag) window.gtag('event', 'click_button_find_rewards');

    props.history.push(`/map?${findRewardsLink}`);
  };

  return (
    <div className="WebsiteMainPage">
      <Helmet>
        <title>Dining.Gifts</title>
        <link rel="canonical" href={'https://dining.gifts/'} />
        <meta property="description" content={'Dining.Gifts'} />
        <meta property="og:title" content={'Dining.Gifts'} />
        <meta property="og:type" content="article" />
        <meta property="og:url" content={'https://dining.gifts/'} />
        <meta property="og:image" content={helmetImg} />
        <meta property="og:image:url" content={helmetImg} />
        <meta property="og:image:width" content="600" />
        <meta property="og:image:height" content="600" />
        <meta property="og:description" content={'Dining.Gifts'} />
        <meta name="twitter:card" content={'summary_large_image'} />
        <meta name="twitter:site" content={'@Dining.Gifts'} />
        <meta name="twitter:title" content={'Dining.Gifts'} />
        <meta name="twitter:description" content={'Dining.Gifts'} />
        <meta name="twitter:image" property="twitter:image" content={helmetImg} />
        <meta property="og:site_name" content={'Dining.Gifts'} />
        <link rel="image_src" href={helmetImg} />
        <link id="favicon" rel="icon" href={helmetImg} type="image/x-icon" />
      </Helmet>
      <div className="WebsiteMainPage__banner">
        <div className="WebsiteMainPage__wrapperTitle">
          <div>
            <h1 className="WebsiteMainPage__mainTitle">
              <i>
                {props.intl.formatMessage({ id: 'earn_rewards', defaultMessage: 'Earn rewards' })}
              </i>{' '}
              {props.intl.formatMessage({
                id: 'photographing_your_meal',
                defaultMessage: 'by photographing your meal at our restaurants.',
              })}
            </h1>
            <h2 className="WebsiteMainPage__secondTitle">
              {props.intl.formatMessage({
                id: 'you_deserve',
                defaultMessage: 'You deserve to get more out of your meals.',
              })}
            </h2>
          </div>
          <div className="WebsiteMainPage__buttonWrap">
            <SubmitDishPhotosButton className="WebsiteMainPage__button WebsiteMainPage__button--fill" />
            <button onClick={onClickButtonFindRewards} className="WebsiteMainPage__button">
              {props.intl.formatMessage({id: "find_rewards", defaultMessage: "Find Rewards"})} <Icon type="right" />
            </button>
          </div>
        </div>
      </div>
      <section className="WebsiteMainPage__rewardsSection">
        <h3 className="WebsiteMainPage__rewardsSectionTitle">
          {props.intl.formatMessage({
            id: 'its_easy',
            defaultMessage: 'It’s as easy as one, two, three.',
          })}
        </h3>
        <ol className="WebsiteMainPage__stepsContainer">
          <li>
            <h4>
              {props.intl.formatMessage({
                id: 'first_step',
                defaultMessage: '1. Find the restaurant, choose your dish',
              })}
            </h4>
            <div className="WebsiteMainPage__steps">
              <div className="WebsiteMainPage__stepsHeader">
                <span>
                  {props.intl.formatMessage({
                    id: 'eat_out_earn_crypto',
                    defaultMessage: 'Eat out, earn crypto',
                  })}
                  . |<i> {props.intl.formatMessage({ id: 'step1', defaultMessage: 'step 1' })}</i>
                </span>
                <Icon type="close" />
              </div>
              <div className="WebsiteMainPage__stepsBody">
                <h5>
                  {props.intl.formatMessage({ id: 'find_the', defaultMessage: 'Find the' })}
                  <i>
                    {' '}
                    {props.intl.formatMessage({
                      id: 'restaurant_new',
                      defaultMessage: 'restaurant',
                    })}
                  </i>
                  ,{' '}
                  {props.intl.formatMessage({ id: 'choose_your', defaultMessage: ' choose your' })}
                  <i>
                    {' '}
                    {props.intl.formatMessage({ id: 'dish_lowercase', defaultMessage: 'dish' })}
                  </i>
                </h5>
                <img src={'/images/step_1.png'} alt="Find the restaurant, choose your dish" />
              </div>
            </div>
          </li>
          <li>
            <h4>
              {props.intl.formatMessage({
                id: 'second_step',
                defaultMessage: '2. Reserve your reward',
              })}
            </h4>
            <div className="WebsiteMainPage__steps">
              <div className="WebsiteMainPage__stepsHeader">
                <span>
                  {props.intl.formatMessage({
                    id: 'eat_out_earn_crypto',
                    defaultMessage: 'Eat out, earn crypto',
                  })}
                  . |<i> {props.intl.formatMessage({ id: 'step2', defaultMessage: 'step 2' })}</i>
                </span>
                <Icon type="close" />
              </div>
              <div className="WebsiteMainPage__stepsBody">
                <h5>
                  <i>
                    {props.intl.formatMessage({ id: 'reserve_new', defaultMessage: 'Reserve' })}{' '}
                  </i>
                  {props.intl.formatMessage({
                    id: 'your_reward_new',
                    defaultMessage: 'your reward',
                  })}
                </h5>
                <img src={'/images/step_2.png'} alt="Find the restaurant, choose your dish" />
              </div>
            </div>
          </li>
          <li>
            <h4>
              {props.intl.formatMessage({
                id: 'step_three',
                defaultMessage: '3. Share two photos of your dish & earn!',
              })}
            </h4>
            <div className="WebsiteMainPage__steps">
              <div className="WebsiteMainPage__stepsHeader">
                <span>
                  {props.intl.formatMessage({
                    id: 'eat_out_earn_crypto',
                    defaultMessage: 'Eat out, earn crypto',
                  })}
                  . |<i> {props.intl.formatMessage({ id: 'step3', defaultMessage: 'step 3' })}</i>
                </span>
                <Icon type="close" />
              </div>
              <div className="WebsiteMainPage__stepsBody">
                <h5>
                  <i>{props.intl.formatMessage({ id: 'share_new', defaultMessage: 'Share' })} </i>
                  {props.intl.formatMessage({
                    id: 'two_photos_of_your_dish',
                    defaultMessage: 'two photos of your dish & earn!',
                  })}
                </h5>
                <img src={'/images/step_3.png'} alt="Find the restaurant, choose your dish" />
              </div>
            </div>
          </li>
        </ol>
        <Link
          to={'/object/mds-dining-gifts/page#wdh-about'}
          className="WebsiteMainPage__button WebsiteMainPage__button--fill"
        >
          {props.intl.formatMessage({ id: 'learn_more', defaultMessage: 'Learn more' })}
        </Link>
      </section>
      <section className="WebsiteMainPage__withdrawSection">
        <h2 className="WebsiteMainPage__withdrawTitle">
          <i>{props.intl.formatMessage({ id: 'withdrawing', defaultMessage: 'Withdrawing' })} </i>
          {props.intl.formatMessage({
            id: 'easy_too',
            defaultMessage: 'your rewards is easy too.',
          })}
        </h2>
        <img className="money-tree-picture" src={'/images/money-tree.png'} alt="money-tree" />
        <img
          className="money-tree-picture-nightmode"
          src={'/images/money-tree-nightmode.png'}
          alt="money-tree-nightmode"
        />
        <div className="WebsiteMainPage__infoWrapper">
          <p className="WebsiteMainPage__services">
            {props.intl.formatMessage({
              id: 'other_services',
              defaultMessage:
                'Other services make withdrawing rewards a headache, so we’ve done better.',
            })}
          </p>
          <p>
            {props.intl.formatMessage({
              id: 'they_offer_rewards',
              defaultMessage:
                'They offer rewards that are practically meaningless. Or they’re rewards can only be used on a set list of items. Or their rewards require you to jump through hoops to withdraw.',
            })}
          </p>
          <p>
            {props.intl.formatMessage({
              id: 'makes_fun',
              defaultMessage: 'Dining.Gifts makes rewards fun, like they’re meant to be.',
            })}
          </p>
          <p className="WebsiteMainPage__paragraphCurrency">
            {props.intl.formatMessage({ id: 'we_help', defaultMessage: 'We help you' })}
            <i> {props.intl.formatMessage({ id: 'instantly', defaultMessage: 'instantly' })} </i>
            {props.intl.formatMessage({
              id: 'convert_rewards',
              defaultMessage: 'convert rewards you earn into major cryptos, such as',
            })}{' '}
            <i>
              {props.intl.formatMessage({
                id: 'three_currency',
                defaultMessage: 'Bitcoin, Ethereum, Litecoin',
              })}{' '}
            </i>
            {props.intl.formatMessage({
              id: 'directly_cash',
              defaultMessage: 'or directly into cash using any Bitcoin ATM.',
            })}
          </p>
          <p>
            {props.intl.formatMessage({
              id: 'its_2022',
              defaultMessage: 'It’s 2022. Rewards should be easy!',
            })}
          </p>
        </div>
        <Link
          to={'/object/mds-dining-gifts/page#dyq-faq'}
          className="WebsiteMainPage__button WebsiteMainPage__button--fill"
        >
          {props.intl.formatMessage({ id: 'learn_more', defaultMessage: 'Learn more' })}
        </Link>
      </section>
      <DistrictSection />
      <CarouselSection />
      <NearbySection />
      <WebsiteFooter />
    </div>
  );
};

WebsiteMainPage.propTypes = {
  history: PropTypes.shape({
    push: PropTypes.func,
  }).isRequired,
  intl: PropTypes.shape().isRequired,
};

export default injectIntl(WebsiteMainPage);
