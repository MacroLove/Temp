/**
 * React Native Grid Component
 * https://github.com/phil-r/react-native-grid-component
 */

import React, { Component } from 'react';
import PropTypes from 'prop-types';
import {
    StyleSheet,
    View,
    ListView,
    Dimensions,
} from 'react-native';

const { height, width } = Dimensions.get('window');

// http://stackoverflow.com/questions/8495687/split-array-into-chunks
// I don't see the reason to take lodash.chunk for this
const chunk = (arr, n) =>
    Array.from(Array(Math.ceil(arr.length / n)), (_, i) => arr.slice(i * n, (i * n) + n));

const mapValues = (obj, callback) => {
    const newObj = {};

    Object.keys(obj).forEach((key) => {
        newObj[key] = callback(obj[key]);
    });

    return newObj;
};

export default class GridView extends Component {

    static propTypes = {
        itemsPerRow: PropTypes.number,
        onEndReached: PropTypes.func,
        itemHasChanged: PropTypes.func,
        renderItem: PropTypes.func.isRequired,
        renderPlaceholder: PropTypes.func,
        renderSectionHeader: PropTypes.func,
        data: PropTypes.arrayOf(PropTypes.any).isRequired,
        refreshControl: PropTypes.element,
        renderFooter: PropTypes.func,
        sections: PropTypes.bool,
    }

    static defaultProps = {
        itemsPerRow: 3,
        onEndReached() {},
        itemHasChanged(r1, r2) {
            return r1 !== r2;
        },
        renderFooter: () => null,
        refreshControl: null,
        renderPlaceholder: null,
        renderSectionHeader: () => null,
        sections: false,
    }

    constructor(props) {
        super(props);

        const ds = new ListView.DataSource({
            rowHasChanged: (r1, r2) => r1.some((e, i) => props.itemHasChanged(e, r2[i])),
            sectionHeaderHasChanged: (s1, s2) => s1 !== s2,
        });
        if (props.sections === true) {
            this.state = {
                dataSource: ds.cloneWithRowsAndSections(this._prepareSectionedData(this.props.data)),
            };
        } else {
            this.state = {
                dataSource: ds.cloneWithRows(this._prepareData(this.props.data)),
            };
        }
    }

    componentWillReceiveProps(nextProps) {
        if (nextProps.sections === true) {
            this.state = {
                dataSource: this.state.dataSource
                    .cloneWithRowsAndSections(this._prepareSectionedData(nextProps.data)),
            };
        } else {
            let ds = new ListView.DataSource({
                rowHasChanged: (r1, r2) => r1.some((e, i) => props.itemHasChanged(e, r2[i])),
                sectionHeaderHasChanged: (s1, s2) => s1 !== s2,
            });
            this.setState({
                dataSource: ds.cloneWithRows(this._prepareData(nextProps.data)),
            });
        }
    }

    _prepareSectionedData = data => {
        const preparedData = mapValues(data, (vals) => this._prepareData(vals));
        return preparedData;
    }

    _prepareData = data => {
        const rows = chunk(data, this.props.itemsPerRow);
        if (rows.length) {
            const lastRow = rows[rows.length - 1];
            for (let i = 0; lastRow.length < this.props.itemsPerRow; i += 1) {
                lastRow.push(null);
            }
        }
        return rows;
    }

    _renderPlaceholder = i =>
        <View key={i} style={{ width: width / this.props.itemsPerRow }} />

    _renderRow = rowData =>
        <View style={styles.row}>
            {rowData.map((item, i) => {
                if (item) {
                    return this.props.renderItem(item, i);
                }
                // render a placeholder
                if (this.props.renderPlaceholder) {
                    return this.props.renderPlaceholder(i);
                }
                return this._renderPlaceholder(i);
            })}
        </View>

    render() {
        return (
            <View style={styles.container}>
                <ListView
                    {...this.props}
                    style={styles.list}
                    dataSource={this.state.dataSource}
                    renderRow={this._renderRow}
                    enableEmptySections
                    onEndReached={this.props.onEndReached}
                    onEndReachedThreshold={height}
                    refreshControl={this.props.refreshControl}
                    renderFooter={this.props.renderFooter}
                    renderSectionHeader={this.props.renderSectionHeader}
                />
            </View>
        );
    }
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
    },
    list: {
        flex: 1,
    },
    row: {
        justifyContent: 'space-around',
        flexDirection: 'row',
        flexWrap: 'wrap',
        alignItems: 'flex-start',
        flex: 1,
    },
});