import { injectIntl, FormattedMessage } from 'react-intl';
import React, { Component } from 'react';
import PropTypes from 'prop-types';
import Select from 'react-select';
import SelectSearchOption from 'components/CustomComponentSelect/SelectSearchOption';
import SelectSearchValue from 'components/CustomComponentSelect/SelectSearchValue';

const propTypes = {
    groupId: PropTypes.string,
    companyId: PropTypes.string,
    searchable: PropTypes.bool,
    maxLength: PropTypes.number,
    backspaceRemoves: PropTypes.bool,
    labelKey: PropTypes.string,
    valueKey: PropTypes.string,
    getOptions: PropTypes.func,
    onChange: PropTypes.func,
    placeholderMessage: PropTypes.string,
    disableCache: PropTypes.bool,
    searchParams: PropTypes.string.isRequired
};

class QuotesSearch extends Component {
    constructor (props) {
        super(props);
    }
    onChange = (value) => {
        this.props.onChange(value);
    };
    render () {
        return (
            <div className="st-items-search-wrap">
                <FormattedMessage id={this.props.placeholderMessage ? this.props.placeholderMessage : 'createPost.selectLabel.default'}>
                    { msg => (
                        <Select
                            inputProps={this.props.maxLength ? {maxLength: this.props.maxLength} : {maxLength: 30} }
                            placeholder={msg}
                            value={this.props.value}
                            searchable={this.props.searchable}
                            backspaceRemoves={this.props.backspaceRemoves}
                            labelKey={this.props.labelKey}
                            valueKey={this.props.valueKey}
                            valueComponent={SelectSearchValue}
                            optionComponent={SelectSearchOption}
                            onChange={this.onChange}
                            options={this.props.options}
                            filterOptions={this.props.filterOptions}/>
                    )}
                </FormattedMessage>
            </div>
        );
    }
}

QuotesSearch.propTypes = propTypes;

export default injectIntl(QuotesSearch);
