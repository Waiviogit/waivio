import React, { useEffect, useState } from 'react';
import { isEmpty, take, takeRight } from 'lodash';
import { Icon } from 'antd';
import PropTypes from 'prop-types';
import { injectIntl } from 'react-intl';
import BusinessMenuItem from './BusinessMenuItem';
import { sortListItems } from '../../../../common/helpers/wObjectHelper';
import { prepareMenuItems } from '../../SocialProduct/SocialMenuItems/SocialMenuItems';
import './BusinessMenuItems.less';

import { isTabletOrMobile } from '../../SocialProduct/SocialProductHelper';
import Popover from '../../../components/Popover';
import PopoverMenu, { PopoverMenuItem } from '../../../components/PopoverMenu/PopoverMenu';

const listLength = 3;

const BusinessMenuItemsList = ({ menuItem, intl }) => {
  const [menuItems, setMenuItems] = useState(prepareMenuItems(menuItem));
  const [visible, setVisible] = useState(false);
  const linkList = sortListItems(
    menuItems,
    menuItem.map(i => i.permlink),
  );
  const lastItemsLength = linkList.length - listLength;
  const lastItems = takeRight(linkList, lastItemsLength);
  const handleMoreMenuVisibleChange = vis => setVisible(vis);

  useEffect(() => {
    setMenuItems(prepareMenuItems(menuItem));
  }, [menuItem.length]);

  if (isEmpty(menuItems)) return null;

  return (
    <div className="BusinessMenuItems">
      {take(linkList, listLength).map(item => (
        <BusinessMenuItem key={item._id} item={item} />
      ))}
      {!isEmpty(lastItems) &&
        (lastItemsLength > 1 ? (
          <>
            {!isTabletOrMobile ? (
              <Popover
                placement="bottom"
                trigger="click"
                visible={visible}
                onVisibleChange={handleMoreMenuVisibleChange}
                overlayStyle={{ position: 'fixed' }}
                content={
                  <PopoverMenu
                    onSelect={(i, type) => {
                      if (type === 'blank') {
                        window.location.replace(i);
                      } else {
                        setVisible(false);
                        history.push(i);
                      }
                    }}
                  >
                    {lastItems.map(i => {
                      const itemBody = JSON.parse(i.body);

                      return (
                        <PopoverMenuItem key={itemBody.permlink} data={itemBody.title}>
                          <BusinessMenuItem
                            className={'BusinessMenuItems__popover-item'}
                            item={i}
                          />
                        </PopoverMenuItem>
                      );
                    })}
                  </PopoverMenu>
                }
                overlayClassName="BusinessMenuItems__popover"
              >
                <span className={'BusinessMenuItems__item'}>
                  {intl.formatMessage({ id: 'more', defaultMessage: 'More' })}{' '}
                  <Icon type="caret-down" />
                </span>
              </Popover>
            ) : (
              lastItems.map(item => <BusinessMenuItem key={item._id} item={item} />)
            )}
          </>
        ) : (
          <BusinessMenuItem item={lastItems[0]} />
        ))}
    </div>
  );
};

BusinessMenuItemsList.propTypes = {
  menuItem: PropTypes.arrayOf().isRequired,
  intl: PropTypes.shape(),
};

export default injectIntl(BusinessMenuItemsList);
