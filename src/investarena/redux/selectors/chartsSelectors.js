import { createSelector } from 'reselect';
// selector
export const getChartsState = (state) => state.entities.charts;
// reselect function
export const getAssetsChartsState = (state) => state.entities.charts.assets;

export const makeGetChartState = () => createSelector(
    getChartsState,
    (state, props) => props.quoteSecurity,
    (chart, quoteSecurity) => chart[quoteSecurity]
);
