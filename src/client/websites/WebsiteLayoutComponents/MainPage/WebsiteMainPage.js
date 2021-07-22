import React from 'react';
import { Icon } from 'antd';
import { Link } from 'react-router-dom';
import WebsiteFooter from '../WebsiteFooter/Footer';
import MainPageHeader from '../Header/MainPageHeader';

import './WebsiteMainPage.less';
import ModalSignIn from '../../../components/Navigation/ModlaSignIn/ModalSignIn';

const WebsiteMainPage = () => (
  <div className="WebsiteMainPage">
    <MainPageHeader />
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
          <ModalSignIn
            buttonClassName="WebsiteMainPage__button WebsiteMainPage__button--fill"
            text="Sing up"
            isButton
          />
          <Link to={'/map'} className="WebsiteMainPage__button">
            Find Rewards <Icon type="right" />
          </Link>
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
              <img src={'/images/tab_1.png'} alt="Find the restaurant, choose your dish" />
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
              <img src={'/images/tab_2.png'} alt="Find the restaurant, choose your dish" />
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
              <img src={'/images/tab_3.png'} alt="Find the restaurant, choose your dish" />
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
      <img src={'/images/money-tree.png'} alt="money-tree" />
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
    <WebsiteFooter />
  </div>
);

export default WebsiteMainPage;
