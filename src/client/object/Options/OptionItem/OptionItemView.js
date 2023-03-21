import React, { useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import classNames from 'classnames';
import { useHistory } from 'react-router';
import PropTypes from 'prop-types';
import { FormattedMessage } from 'react-intl';
import {
  setStoreActiveCategory,
  setStoreActiveOption,
} from '../../../../store/optionsStore/optionsActions';
import { getObject } from '../../../../waivioApi/ApiClient';
import { getAuthenticatedUserName } from '../../../../store/authStore/authSelectors';
import { getLocale } from '../../../../common/helpers/localStorageHelpers';
import { getActiveOption } from '../../../../store/optionsStore/optionsSelectors';
import LinkButton from '../../../components/LinkButton/LinkButton';

const optionsLimit = 15;

const OptionItemView = ({ option, wobject, setHoveredOption, optionsNumber, optionsBack }) => {
  const [hovered, setHovered] = useState({});
  const locale = useSelector(getLocale);
  const userName = useSelector(getAuthenticatedUserName);
  const activeStoreOption = useSelector(getActiveOption);
  const history = useHistory();
  const dispatch = useDispatch();

  const getAvailableOption = el =>
    Object.values(activeStoreOption)
      .filter(opt => opt.body.category !== el.body.category)
      .some(o => optionsBack[o.body.value].includes(el.author_permlink));

  const getOptionsPicturesClassName = el =>
    classNames({
      'Options__pictures--black': getAvailableOption(el),
      Options__pictures: el.author_permlink !== wobject.author_permlink,
      'Options__my-pictures': el.author_permlink === wobject.author_permlink,
      'Options__my-pictures--selected':
        el.body?.image === activeStoreOption[el.body.category]?.body?.image ||
        wobject.author_permlink === el.author_permlink,
    });

  const getOptionsClassName = el =>
    classNames({
      'Options__option-button--black': getAvailableOption(el),
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
    dispatch(setStoreActiveOption({ [el.body.category]: el }));
    if (el.author_permlink !== wobject.author_permlink) {
      getObject(el.author_permlink, userName, locale).then(obj =>
        history.push(obj.defaultShowLink),
      );
      dispatch(setStoreActiveCategory(el.body.category));
      dispatch(setStoreActiveOption({ [el.body.category]: el }));
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
  option: PropTypes.arrayOf().isRequired,
  setHoveredOption: PropTypes.func.isRequired,
  optionsNumber: PropTypes.number.isRequired,
};

export default OptionItemView;
