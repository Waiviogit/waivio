import React, { useEffect, useState } from 'react';
import PropTypes from 'prop-types';
import { get, isEmpty } from 'lodash';
import { getObject } from '../../../waivioApi/ApiClient';
import './DescriptionPage.less';
import { isMobile } from '../../../common/helpers/apiHelpers';

const DescriptionPage = ({ match }) => {
  const [wobject, setWobject] = useState({});
  const wobjName = match.params.name;
  const description = wobject?.description;
  const pics = [...get(wobject, 'preview_gallery', [])];
  const pictures = pics.length > 15 ? pics.slice(0, 15) : pics;

  useEffect(() => {
    const objectHeaderEl = document.getElementById('ObjectHeaderId');

    if (isMobile()) {
      window.scrollTo({
        top: objectHeaderEl?.offsetHeight,
        behavior: 'smooth',
      });
    }

    getObject(wobjName).then(res => setWobject(res));
  }, [wobject.author_permlink]);

  return (
    <div className="DescriptionPage Body">
      <div className="DescriptionPage__body">{description}</div>
      <div>
        {!isEmpty(pictures) &&
          pictures?.map(p => (
            <div key={p.id}>
              <img className="DescriptionPage__image" src={p.body} alt=" " />
            </div>
          ))}
      </div>
    </div>
  );
};

DescriptionPage.propTypes = {
  match: PropTypes.shape.isRequired,
};

export default DescriptionPage;
