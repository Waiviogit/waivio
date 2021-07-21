import React from 'react';
import { Link } from 'react-router-dom';
import ModalSignIn from '../../../components/Navigation/ModlaSignIn/ModalSignIn';

const MainPageHeader = () => (
  <div className="MainPageHeader">
    <div className="MainPageHeader__logo">
      <img src={'/images/dining.gifts.png'} className="MainPageHeader__logoImg" alt="logo" />
      <b>Dining.Gifts</b> <span>Eat out, earn crypto.</span>
    </div>
    <div className="MainPageHeader__listLink">
      <Link to="/object/mds-dining-gifts/newsFilter/dininggifts-dw09owbl6bh">Rewiews</Link>
      <Link to="/map">map</Link>
      <Link to="/object/mds-dining-gifts/page#voy-business-3-0">partners</Link>
      <ModalSignIn buttonClassName="MainPageHeader__signIn" isButton />
    </div>
  </div>
);

export default MainPageHeader;
