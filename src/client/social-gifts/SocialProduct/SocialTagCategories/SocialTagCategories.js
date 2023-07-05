import React, { useState } from 'react';
import { Tag } from 'antd';
import { Link } from 'react-router-dom';
import { FormattedMessage } from 'react-intl';

const SocialTagCategories = ({ tagCategoriesList, wobject }) => {
  const [showMoreCategoryItems, setShowMoreCategoryItems] = useState(false);

  const renderCategoryItems = (categoryItems = [], category) => {
    const { object_type: type } = wobject;
    const onlyFiveItems = categoryItems.filter((f, i) => i < 5);
    const tagArray = showMoreCategoryItems ? categoryItems : onlyFiveItems;

    return (
      <span>
        {tagArray.map(item => (
          <div key={item.body}>
            <Tag key={`${category}/${item.body}`} className="SocialProduct__tag-item">
              <Link to={`/discover-objects/${type}?${category}=${item.body}`}>{item.body}</Link>
            </Tag>{' '}
          </div>
        ))}
        {categoryItems.length > 5 && !showMoreCategoryItems && (
          <span
            role="presentation"
            className="show-more"
            onClick={() => setShowMoreCategoryItems(true)}
          >
            <FormattedMessage id="show_more" defaultMessage="Show more" />
          </span>
        )}
      </span>
    );
  };

  return tagCategoriesList.map(item => (
    <div className="SocialProduct__tag-wrapper" key={item.id}>
      {`${item.body}:`}
      <div className="SocialProduct__tags">
        {item.items && renderCategoryItems(item.items, item.body)}
      </div>
    </div>
  ));
};

export default SocialTagCategories;
