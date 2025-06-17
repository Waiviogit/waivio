import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import classNames from 'classnames';
import { useHistory } from 'react-router';
import PropTypes from 'prop-types';
import { isEmpty } from 'lodash';
import { FormattedMessage } from 'react-intl';
import {
  setStoreActiveCategory,
  setStoreActiveOption,
} from '../../../../store/optionsStore/optionsActions';
import { getActiveOption } from '../../../../store/optionsStore/optionsSelectors';
import LinkButton from '../../../components/LinkButton/LinkButton';
import { isMobile } from '../../../../common/helpers/apiHelpers';
import { getProxyImageURL } from '../../../../common/helpers/image';
import { setOptionClicked } from '../../../../store/shopStore/shopActions';

const OptionItemView = ({
  option,
  wobject,
  setHoveredOption,
  optionsNumber,
  optionsBack,
  ownOptions,
  isSocialProduct,
}) => {
  const optionsLimit = isSocialProduct ? 30 : 15;
  const [hovered, setHovered] = useState({});
  const activeStoreOption = useSelector(getActiveOption);
  const history = useHistory();
  const dispatch = useDispatch();
  const isSocialObject =
    isSocialProduct &&
    ['book', 'product', 'person', 'business', 'link', 'place'].includes(wobject.object_type);
  const waivioOptionsLink = `/object/${wobject.author_permlink}/options/${option[0]}`;
  const waivioAvailableOptionsLink = el =>
    `/object/${getAvailableOptionPermlinkAndStyle(el, true)}`;
  const linkToOption = isSocialObject
    ? `/object/${wobject.author_permlink}/options/${option[0]}`
    : waivioOptionsLink;
  const linkToAvailableOption = el =>
    isSocialObject
      ? `/object/${getAvailableOptionPermlinkAndStyle(el, true)}`
      : waivioAvailableOptionsLink(el);

  useEffect(() => {
    if (!isSocialProduct) dispatch(setStoreActiveOption(ownOptions));
  }, []);

  const getAvailableOption = el =>
    Object.values(!isEmpty(activeStoreOption) ? activeStoreOption : ownOptions)
      ?.filter(opt => opt.body.category !== el.body.category)
      ?.some(o => optionsBack[o.body.value]?.includes(el.author_permlink));

  const getAvailableOptionPermlinkAndStyle = (el, getPermlink = false) => {
    const activeCategories = Object.keys(ownOptions).filter(key => key !== el.body.category);
    const activeOptions = activeCategories
      .map(key => ownOptions[key])
      .reduce((acc, currOpt) => [...acc, ...optionsBack[currOpt.body.value]], []);

    const category = optionsBack[el.body.value];
    const callback = permlink => activeOptions.some(p => p === permlink);

    if (getPermlink) {
      return category.find(callback) || el.author_permlink;
    }

    return category.some(callback);
  };

  const getOptionsPicturesClassName = el =>
    classNames({
      'Options__my-pictures--selected':
        ownOptions[el.body.category]?.body?.value === el.body?.value ||
        wobject.author_permlink === el.author_permlink,
      'Options__pictures--black': getAvailableOption(el) || getAvailableOptionPermlinkAndStyle(el),
      Options__pictures: el.author_permlink !== wobject.author_permlink,
      'Options__my-pictures': el.author_permlink === wobject.author_permlink,
    });

  const getOptionsClassName = el =>
    classNames({
      'Options__my-option-button--selected':
        ownOptions[el.body.category]?.body?.value === el.body?.value ||
        wobject.author_permlink === el.author_permlink,
      'Options__option-button--black':
        getAvailableOption(el) || getAvailableOptionPermlinkAndStyle(el),
      'Options__option-button': el.author_permlink !== wobject.author_permlink,
      'Options__my-option-button': el.author_permlink === wobject.author_permlink,
    });

  const onMouseOver = (e, el) => {
    setHoveredOption(el);
    setHovered({ ...hovered, [el.body.category]: el });
  };
  const onMouseOut = () => {
    setHoveredOption(activeStoreOption);
    setHovered(activeStoreOption);
  };
  const onOptionButtonClick = (e, el) => {
    dispatch(setStoreActiveCategory(el.body.category));
    dispatch(setOptionClicked());
    setHoveredOption(el);
    dispatch(setStoreActiveOption({ ...activeStoreOption, [el.body.category]: el }));
    if (el.author_permlink !== wobject.author_permlink) {
      if (isMobile()) {
        isSocialObject
          ? history.push(`${linkToAvailableOption(el)}`)
          : history.push(`${linkToAvailableOption(el)}/about`);
      } else {
        history.push(linkToAvailableOption(el));
      }
      dispatch(setStoreActiveCategory(el.body.category));
      dispatch(setStoreActiveOption({ ...activeStoreOption, [el.body.category]: el }));
    }
  };

  const getOptions = optionsList =>
    isSocialObject ? optionsList : optionsList?.slice(0, optionsLimit);

  return (
    <div key={option[0]}>
      {' '}
      <div
        className={isSocialProduct ? 'Options__option-socialCategory' : 'Options__option-category'}
      >
        {option[0]}:{' '}
        <span className="Options__hoveredOption">
          {hovered?.[option[0]]?.body?.value || activeStoreOption?.[option[0]]?.body?.value}
        </span>
      </div>
      <>
        {getOptions(option[1]).map(el => (
          <span key={el.permlink}>
            {el.body.image ? (
              <img
                onMouseOver={e => onMouseOver(e, el)}
                onMouseOut={onMouseOut}
                onClick={e => onOptionButtonClick(e, el)}
                className={getOptionsPicturesClassName(el)}
                src={getProxyImageURL(el.body.image)}
                alt="option"
                key={el.permlink}
              />
            ) : (
              <button
                key={el.permlink}
                onMouseOver={e => onMouseOver(e, el)}
                onMouseOut={onMouseOut}
                value={el.body.value}
                onClick={e => onOptionButtonClick(e, el)}
                className={getOptionsClassName(el)}
              >
                {el.body.value}
              </button>
            )}{' '}
          </span>
        ))}
      </>
      {option[1]?.length > optionsLimit && !isSocialObject && (
        <div className="object-sidebar__menu-item">
          <LinkButton className="LinkButton menu-button mt2" to={linkToOption}>
            <div>
              <FormattedMessage id="show_all" defaultMessage="Show all" />
            </div>
            <div className="ml1">({optionsNumber})</div>
          </LinkButton>
        </div>
      )}
    </div>
  );
};

OptionItemView.propTypes = {
  wobject: PropTypes.shape().isRequired,
  optionsBack: PropTypes.shape(),
  ownOptions: PropTypes.shape(),
  isSocialProduct: PropTypes.bool,
  option: PropTypes.arrayOf().isRequired,
  setHoveredOption: PropTypes.func.isRequired,
  optionsNumber: PropTypes.number.isRequired,
};

export default OptionItemView;
