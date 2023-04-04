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

const optionsLimit = 15;

const OptionItemView = ({
  option,
  wobject,
  setHoveredOption,
  optionsNumber,
  optionsBack,
  ownOptions,
}) => {
  const [hovered, setHovered] = useState({});
  const activeStoreOption = useSelector(getActiveOption);
  const history = useHistory();
  const dispatch = useDispatch();

  useEffect(() => {
    dispatch(setStoreActiveOption(ownOptions));
  }, []);

  const getAvailableOption = el =>
    Object.values(!isEmpty(activeStoreOption) ? activeStoreOption : ownOptions)
      ?.filter(opt => opt.body.category !== el.body.category)
      ?.some(o => optionsBack[o.body.value]?.includes(el.author_permlink));

  const func = (el, getPermlink = false) => {
    const activeCategories = Object.keys(ownOptions).filter(key => key !== el.body.category);
    const activeOptions = activeCategories
      .map(key => ownOptions[key])
      .reduce((acc, currOpt) => [...acc, ...optionsBack[currOpt.body.value]], []);

    if (getPermlink) {
      return optionsBack[el.body.value].find(perm => activeOptions.some(p => p === perm));
    }

    return optionsBack[el.body.value].some(perm => activeOptions.some(p => p === perm));
  };

  const getOptionsPicturesClassName = el =>
    classNames({
      'Options__pictures--black': getAvailableOption(el) || func(el),
      Options__pictures: el.author_permlink !== wobject.author_permlink,
      'Options__my-pictures': el.author_permlink === wobject.author_permlink,
      'Options__my-pictures--selected':
        el.body?.image === activeStoreOption[el.body.category]?.body?.image ||
        wobject.author_permlink === el.author_permlink,
    });

  const getOptionsClassName = el =>
    classNames({
      'Options__option-button--black': getAvailableOption(el) || func(el),
      'Options__option-button': el.author_permlink !== wobject.author_permlink,
      'Options__my-option-button': el.author_permlink === wobject.author_permlink,
      'Options__my-option-button--selected':
        activeStoreOption[el.body.category]?.body?.value === el.body?.value ||
        wobject.author_permlink === el.author_permlink,
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
    setHoveredOption(el);
    dispatch(setStoreActiveOption({ ...activeStoreOption, [el.body.category]: el }));
    if (el.author_permlink !== wobject.author_permlink) {
      if (isMobile()) {
        history.push(`/object/${func(el, true)}/about`);
      }
      history.push(`/object/${func(el, true)}`);
      dispatch(setStoreActiveCategory(el.body.category));
      dispatch(setStoreActiveOption({ ...activeStoreOption, [el.body.category]: el }));
    }
  };

  const getOptions = optionsList => optionsList?.slice(0, optionsLimit);

  return (
    <div key={option[0]}>
      {' '}
      <div className="Options__option-category">
        {option[0]}:{' '}
        <span className="fw8">
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
                src={el.body.image}
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
      {option[1]?.length > optionsLimit && (
        <LinkButton
          className="menu-btn mt2"
          to={`/object/${wobject.author_permlink}/options/${option[0]}`}
        >
          <FormattedMessage id="show_all" defaultMessage="Show all" />
          <span className="ml1">({optionsNumber})</span>
        </LinkButton>
      )}
    </div>
  );
};

OptionItemView.propTypes = {
  wobject: PropTypes.shape().isRequired,
  optionsBack: PropTypes.shape(),
  ownOptions: PropTypes.shape(),
  option: PropTypes.arrayOf().isRequired,
  setHoveredOption: PropTypes.func.isRequired,
  optionsNumber: PropTypes.number.isRequired,
};

export default OptionItemView;
