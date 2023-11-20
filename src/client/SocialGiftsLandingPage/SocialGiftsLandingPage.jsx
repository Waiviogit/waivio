import React from 'react';
import './SocialGiftsLandingPage.less';

const SocialGiftsLandingPage = () => (
  <div className="SocialGiftsLandingPage">
    <h2>Social Gifts</h2>
    <div className="SocialGiftsLandingPage__container">
      <div className="SocialGiftsLandingPage__text">
        Welcome to our platform, the ultimate destination for creating your own online shop. With
        our user-friendly tools and intuitive interface, you can effortlessly build your dream
        online store and start selling your products or services in no time.
      </div>
      <div className="SocialGiftsLandingPage__text">
        Go to<a href="https://www.waivio.com/"> Waivio </a> and start your journey!
      </div>
    </div>
    <img className="SocialGiftsLandingPage__image" src={'/images/logo.png'} alt="Logo" />
  </div>
);

export default SocialGiftsLandingPage;
