import React, { useState } from 'react';
import { useHistory } from 'react-router';
import { Link } from 'react-router-dom';
import { injectIntl } from 'react-intl';
import PropTypes from 'prop-types';
import { Drawer } from 'antd';
import { useDispatch } from 'react-redux';
import { getMenuLinkTitle } from '../../../../../common/helpers/headerHelpers';
import { setEditMode } from '../../../../../store/wObjectStore/wobjActions';
import './BurgerMenu.less';

const BurgerMenu = ({
  items,
  title,
  openButtonText,
  openButtonIcon,
  intl,
  editButton,
  shopSettings,
}) => {
  const [open, setOpen] = useState(false);
  const history = useHistory();
  const dispatch = useDispatch();

  return (
    <div className={'BurgerMenu'}>
      <span onClick={() => setOpen(true)}>
        {openButtonText}
        {openButtonIcon}
      </span>
      {
        <Drawer
          className={'BurgerMenu__drawer'}
          title={title}
          placement="right"
          visible={open}
          onClose={() => setOpen(false)}
        >
          {items.map(i =>
            i.type === 'blank' ? (
              <a
                key={i.link}
                rel="noreferrer"
                href={i.link}
                target={'_blank'}
                className={'BurgerMenu__item'}
              >
                {' '}
                {getMenuLinkTitle(i, intl, 20)}
              </a>
            ) : (
              <Link
                to={i.link}
                className={
                  history.location.pathname?.includes(i.link)
                    ? 'BurgerMenu__item--active'
                    : 'BurgerMenu__item'
                }
                key={i.link}
                onClick={() => setOpen(false)}
              >
                {getMenuLinkTitle(i, intl, 20)}
              </Link>
            ),
          )}
          {
            <div
              className={'BurgerMenu__item--no-padding'}
              onClick={() => {
                dispatch(setEditMode(true));

                history.push(`/object/${shopSettings?.value}`);
                setOpen(false);
              }}
            >
              {editButton('')}
            </div>
          }
        </Drawer>
      }
    </div>
  );
};

BurgerMenu.propTypes = {
  items: PropTypes.arrayOf(PropTypes.shape()),
  intl: PropTypes.shape(),
  shopSettings: PropTypes.shape(),
  title: PropTypes.string,
  openButtonText: PropTypes.string,
  openButtonIcon: PropTypes.node,
  editButton: PropTypes.node,
};

export default injectIntl(BurgerMenu);
