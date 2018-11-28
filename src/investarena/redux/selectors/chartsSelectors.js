import { createSelector } from 'reselect';
// selector
export const getChartsState = (state) => state.charts;
// reselect function
export const getAssetsChartsState = (state) => state.charts.assets;

export const makeGetChartState = () => createSelector(
    getChartsState,
    (state, props) => props.quoteSecurity,
    (chart, quoteSecurity) => chart[quoteSecurity]
);
