import _ from 'lodash';
import classNames from 'classnames';
import { injectIntl } from 'react-intl';
import PropTypes from 'prop-types';
import React from 'react';
import './TabSelect.less';

class TabSelect extends React.Component {
    constructor (props) {
        super(props);
        const { data, defaultValue } = props;
        this.state = {
            selectedItem: defaultValue ? _.find(data, item => item.value === defaultValue) : data[0]
        };
    }
    selectValue = (item) => {
        const { onSelect } = this.props;
        onSelect(item);
        this.setState({ selectedItem: item });
    };
    render () {
        const {
            data, className, disable, position
        } = this.props;
        const { selectedItem } = this.state;
        const tabSelectClass = classNames('st-tab-select', className);
        return (
            <div className={tabSelectClass}>
                {_.map(disable ? [selectedItem] : data, (item, index) => (
                    <div
                        key={item.value}
                        className={classNames('st-tab-select-label', position,
                            { selected: item.value === selectedItem.value, first: index === 0, last: disable || index === data.length - 1 })}
                        onClick={!disable ? () => this.selectValue(item) : null}
                    >
                        {item.label}
                    </div>
                ))}
            </div>
        );
    }
}

TabSelect.propTypes = {
    data: PropTypes.array.isRequired,
    onSelect: PropTypes.func.isRequired,
    className: PropTypes.string,
    disable: PropTypes.bool,
    defaultValue: PropTypes.string,
    position: PropTypes.string
};

TabSelect.defaultProps = {
    position: 'top'
};

export default injectIntl(TabSelect);
