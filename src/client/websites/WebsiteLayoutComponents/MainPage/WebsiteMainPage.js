import React, { useLayoutEffect } from 'react';
import { Icon } from 'antd';
import { Helmet } from 'react-helmet';
import { Link } from 'react-router-dom';
import PropTypes from 'prop-types';
import DiningGiftsLogoIcon from '@images/dining.gifts.png';
import FirstStepImg from '@images/step_1.png';
import SecondStepImg from '@images/step_2.png';
import ThirdStepImg from '@images/step_3.png';
import MoneyTreeImg from '@images/money-tree.png';
import MoneyTreeDarkImg from '@images/money-tree-nightmode.png';

import WebsiteFooter from '../WebsiteFooter/Footer';
import CarouselSection from './components/CarouselSection/CarouselSection';
import DistrictSection from './components/DistrictSection/DistrictSection';
import NearbySection from './components/NearbySection/NearbySection';
import { isMobile } from '../../../../common/helpers/apiHelpers';
import SubmitDishPhotosButton from '../../../widgets/SubmitDishPhotosButton/SubmitDishPhotosButton';

import './WebsiteMainPage.less';

const WebsiteMainPage = props => {
  const helmetImg = DiningGiftsLogoIcon;

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
              <i>Earn rewards</i> by photographing your meal at our restaurants.
            </h1>
            <h2 className="WebsiteMainPage__secondTitle">
              You deserve to get more out of your meals.
            </h2>
          </div>
          <div className="WebsiteMainPage__buttonWrap">
            <SubmitDishPhotosButton className="WebsiteMainPage__button WebsiteMainPage__button--fill" />
            <button onClick={onClickButtonFindRewards} className="WebsiteMainPage__button">
              Find Rewards <Icon type="right" />
            </button>
          </div>
        </div>
      </div>
      <section className="WebsiteMainPage__rewardsSection">
        <h3 className="WebsiteMainPage__rewardsSectionTitle">It’s as easy as one, two, three.</h3>
        <ol className="WebsiteMainPage__stepsContainer">
          <li>
            <h4>1. Find the restaurant, choose your dish</h4>
            <div className="WebsiteMainPage__steps">
              <div className="WebsiteMainPage__stepsHeader">
                <span>
                  Eat out, earn crypto. | <i>step 1</i>
                </span>
                <Icon type="close" />
              </div>
              <div className="WebsiteMainPage__stepsBody">
                <h5>
                  Find the <i>restaurant</i>, choose your <i>dish</i>
                </h5>
                <img src={FirstStepImg} alt="Find the restaurant, choose your dish" />
              </div>
            </div>
          </li>
          <li>
            <h4>2. Reserve your reward</h4>
            <div className="WebsiteMainPage__steps">
              <div className="WebsiteMainPage__stepsHeader">
                <span>
                  Eat out, earn crypto. | <i>step 2</i>
                </span>
                <Icon type="close" />
              </div>
              <div className="WebsiteMainPage__stepsBody">
                <h5>
                  <i>Reserve</i> your reward
                </h5>
                <img src={SecondStepImg} alt="Find the restaurant, choose your dish" />
              </div>
            </div>
          </li>
          <li>
            <h4>3. Share two photos of your dish & earn!</h4>
            <div className="WebsiteMainPage__steps">
              <div className="WebsiteMainPage__stepsHeader">
                <span>
                  Eat out, earn crypto. | <i>step 3</i>
                </span>
                <Icon type="close" />
              </div>
              <div className="WebsiteMainPage__stepsBody">
                <h5>
                  <i>Share</i> two photos of your dish & earn!
                </h5>
                <img src={ThirdStepImg} alt="Find the restaurant, choose your dish" />
              </div>
            </div>
          </li>
        </ol>
        <Link
          to={'/object/mds-dining-gifts/page#wdh-about'}
          className="WebsiteMainPage__button WebsiteMainPage__button--fill"
        >
          Learn more
        </Link>
      </section>
      <section className="WebsiteMainPage__withdrawSection">
        <h2 className="WebsiteMainPage__withdrawTitle">
          <i>Withdrawing</i> your rewards is easy too.
        </h2>
        <img className="money-tree-picture" src={MoneyTreeImg} alt="money-tree" />
        <img
          className="money-tree-picture-nightmode"
          src={MoneyTreeDarkImg}
          alt="money-tree-nightmode"
        />
        <div className="WebsiteMainPage__infoWrapper">
          <p className="WebsiteMainPage__services">
            Other services make withdrawing rewards a headache, so we’ve done better.
          </p>
          <p>
            They offer rewards that are practically meaningless. Or they’re rewards can only be used
            on a set list of items. Or their rewards require you to jump through hoops to withdraw.
          </p>
          <p>Dining.Gifts makes rewards fun, like they’re meant to be.</p>
          <p className="WebsiteMainPage__paragraphCurrency">
            We help you <i>instantly</i> convert rewards you earn into major cryptos, such as{' '}
            <i>Bitcoin, Ethereum, Litecoin</i> or directly into cash using any Bitcoin ATM.
          </p>
          <p>It’s 2021. Rewards should be easy!</p>
        </div>
        <Link
          to={'/object/mds-dining-gifts/page#dyq-faq'}
          className="WebsiteMainPage__button WebsiteMainPage__button--fill"
        >
          Learn more
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
};

export default WebsiteMainPage;
