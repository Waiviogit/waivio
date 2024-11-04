import React from 'react';
import { Tag } from 'antd';
import { Link } from 'react-router-dom';

const SocialTagCategories = ({ tagCategoriesList, wobject }) => {
  const renderCategoryItems = (categoryItems = [], category) => {
    const { object_type: type } = wobject;
    const tags = categoryItems?.sort((a, b) => b.weight - a.weight);

    return (
      <span>
        {tags.map(item => (
          <span key={item.body}>
            <Tag key={`${category}/${item.body}`} className="SocialProduct__tag-item">
              <Link to={`/discover-objects/${type}?category=${category}&tag=${item.body}`}>
                {item.body}
              </Link>
            </Tag>{' '}
          </span>
        ))}
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
