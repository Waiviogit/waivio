export const SET_BREAD_CRUMB = '@shop/SET_BREAD_CRUMB';

export const setBreadCrumb = crumb => ({
  type: SET_BREAD_CRUMB,
  crumb,
});

export const SET_BREAD_ACTIVE_CRUMB = '@shop/SET_BREAD_CRUMB';

export const setBreadActiveCrumb = crumb => ({
  type: SET_BREAD_ACTIVE_CRUMB,
  crumb,
});

export const SET_EXCLUDED = '@shop/SET_EXCLUDED';

export const setExcluded = excluded => ({
  type: SET_EXCLUDED,
  excluded,
});

export const RESET_BREAD_CRUMB = '@shop/RESET_BREAD_CRUMB';

export const resetBreadCrumb = () => ({
  type: RESET_BREAD_CRUMB,
});
export const SET_OPTION_CLICKED = '@shop/SET_OPTION_CLICKED';

export const setOptionClicked = () => ({
  type: SET_OPTION_CLICKED,
});

export const RESET_OPTION_CLICKED = '@shop/RESET_OPTION_CLICKED';

export const resetOptionClicked = () => ({
  type: RESET_OPTION_CLICKED,
});
