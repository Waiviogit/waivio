import React, { useMemo } from 'react';
import { Tag, Modal } from 'antd';
import { useHistory, useRouteMatch } from 'react-router';
import PropTypes from 'prop-types';
import { isEmpty } from 'lodash';
import { parseQueryForFilters } from '../../../waivioApi/helpers';
import { getUserShopSchema } from '../../../common/helpers/shopHelper';
import WobjectShopFilter from '../../object/ObjectTypeShop/WobjectShopFilter';
import GlobalShopFilters from '../../Shop/ShopFilters/GlobalShopFilters';
import UserFilters from '../../Shop/ShopFilters/UserFilters';

const FiltersForMobile = ({ type, setVisible, user, visible, isRecipePage }) => {
  const history = useHistory();
  const match = useRouteMatch();

  const currentQuery = React.useMemo(() => new URLSearchParams(history.location.search), [
    history.location.search,
  ]);

  const activeFilters = parseQueryForFilters(currentQuery);

  const isRecipe = isRecipePage || getUserShopSchema(history?.location?.pathname) === 'recipe';

  const filter = useMemo(() => {
    const closeFilter = () => setVisible(false);

    switch (type) {
      case 'user':
        return <UserFilters name={user} onClose={closeFilter} isRecipePage={isRecipe} />;

      case 'wobject':
        return <WobjectShopFilter name={user} onClose={closeFilter} />;

      default:
        return <GlobalShopFilters onClose={closeFilter} />;
    }
  }, [type, match.params.name, match.params.department, isRecipe, user]);

  const handleRemoveTag = (categoryName, tag) => {
    const currentTags = currentQuery.get(categoryName)?.split(',') || [];
    const filteredTags = currentTags.filter(t => t !== tag);

    const newQuery = new URLSearchParams(currentQuery);

    if (isEmpty(filteredTags)) {
      newQuery.delete(categoryName);
    } else {
      newQuery.set(categoryName, filteredTags.join(','));
    }

    history.push(`?${newQuery.toString()}${history.location.hash}`);
  };

  const handleRemoveRating = () => {
    const newQuery = new URLSearchParams(currentQuery);

    newQuery.delete('rating');
    history.push(`?${newQuery.toString()}${history.location.hash}`);
  };

  const hasActiveTags = currentQuery.toString().length > 0;

  return (
    <div className={'RewardLists__filterButton'}>
      Filters:{' '}
      {hasActiveTags && (
        <>
          {activeFilters.rating && (
            <Tag key="rating" closable onClose={handleRemoveRating}>
              Ratings: {activeFilters.rating / 2} stars
            </Tag>
          )}
          {activeFilters.tagCategory.map(category => {
            const formattedCategoryName = decodeURIComponent(
              category.categoryName.replace(/%20/g, ' ').replace(/\+/g, ' '),
            );

            return category.tags.map(tag => (
              <Tag
                key={`${category.categoryName}-${tag}`}
                closable
                onClose={() => handleRemoveTag(category.categoryName, tag)}
              >
                {formattedCategoryName}: {tag}
              </Tag>
            ));
          })}
        </>
      )}{' '}
      <span className={'RewardLists__filterButton--withUnderline'} onClick={() => setVisible(true)}>
        add
      </span>
      <Modal visible={visible} onCancel={() => setVisible(false)} onOk={() => setVisible(false)}>
        {filter}
      </Modal>
    </div>
  );
};

FiltersForMobile.propTypes = {
  setVisible: PropTypes.func.isRequired,
  type: PropTypes.string,
  user: PropTypes.string,
  visible: PropTypes.bool,
  isRecipePage: PropTypes.bool,
};

export default FiltersForMobile;
