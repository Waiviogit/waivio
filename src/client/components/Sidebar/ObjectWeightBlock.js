import { take } from 'lodash';
import React, { useEffect } from 'react';
import { Icon } from 'antd';
import { FormattedMessage } from 'react-intl';
import { useSelector, useDispatch } from 'react-redux';
import { useParams } from 'react-router';
import { Link } from 'react-router-dom';
import { excludeHashtagObjType } from '../../../common/constants/listOfObjectTypes';
import { getObjectsList } from '../../../store/dynamicList/dynamicListActions';
import { getDynamicList } from '../../../store/dynamicList/dynamicListSelectors';
import { getWobjectsWithUserWeight } from '../../../waivioApi/ApiClient';
import ObjectCard from './ObjectCard';

import './ObjectWeightBlock.less';

const ObjectWeightBlock = () => {
  const params = useParams();
  const { list, hasMore } = useSelector(state => getDynamicList(state, 'expertise-block'));
  const dispatch = useDispatch();

  const fetcher = skip =>
    getWobjectsWithUserWeight(params.name, skip, 5, params.name, excludeHashtagObjType);

  useEffect(() => {
    dispatch(getObjectsList(fetcher, 5, 0, 'expertise-block', false));
  }, [params.name]);

  const wObjects = take(list, 5);

  return wObjects?.length ? (
    <div className="ObjectWeightBlock SidebarContentBlock">
      <h4 className="SidebarContentBlock__title title">
        <Icon type="codepen" className="ObjectWeightBlock__icon" />{' '}
        <FormattedMessage id="user_expertise" defaultMessage="Expertise" />
      </h4>
      <div className="SidebarContentBlock__content">
        {wObjects &&
          wObjects?.map(wobject => (
            <ObjectCard key={wobject.author_permlink} wobject={wobject} showFollow={false} />
          ))}
        {hasMore && (
          <h4 className="ObjectWeightBlock__more">
            <Link to={`/@${params.name}/expertise-objects`}>
              <FormattedMessage id="show_more" defaultMessage="Show more" />
            </Link>
          </h4>
        )}
      </div>
    </div>
  ) : null;
};

export default ObjectWeightBlock;
