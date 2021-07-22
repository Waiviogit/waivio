import React from 'react';
import { Link } from 'react-router-dom';
import { useSelector } from 'react-redux';

import ModalSignIn from '../../../components/Navigation/ModlaSignIn/ModalSignIn';
import { getAuthenticatedUserName } from '../../../../store/authStore/authSelectors';
import Avatar from '../../../components/Avatar';

const MainPageHeader = () => {
  const username = useSelector(getAuthenticatedUserName);

  return (
    <div className="MainPageHeader">
      <div className="MainPageHeader__logo">
        <img src={'/images/dining.gifts.png'} className="MainPageHeader__logoImg" alt="logo" />
        <b>Dining.Gifts</b> <span>Eat out, earn crypto.</span>
      </div>
      <div className="MainPageHeader__listLink">
        <Link to="/object/mds-dining-gifts/newsFilter/dininggifts-dw09owbl6bh">Rewiews</Link>
        <Link to="/map">map</Link>
        <Link to="/object/mds-dining-gifts/page#voy-business-3-0">partners</Link>
        {username ? (
          <Link className="Topnav__user" to={`/@${username}`}>
            <Avatar username={username} size={36} />
          </Link>
        ) : (
          <ModalSignIn buttonClassName="MainPageHeader__signIn" isButton />
        )}
      </div>
    </div>
  );
};

export default MainPageHeader;
