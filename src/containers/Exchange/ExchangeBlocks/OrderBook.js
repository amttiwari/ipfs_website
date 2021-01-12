import React from 'react';
import { Tab, Tabs } from '@blueprintjs/core';
import Table from '../../../components/Exchange/Table';

const mockTableData = [
	[342.74, 5.00996, '24.09 04:68'],
	[342.74, 5.00996, '24.09 04:68'],
	[342.74, 5.00996, '24.09 04:68'],
	[342.74, 5.00996, '24.09 04:68'],
	[342.74, 5.00996, '24.09 04:68'],
	[342.74, 5.00996, '24.09 04:68'],
	[342.74, 5.00996, '24.09 04:68'],
	[342.74, 5.00996, '24.09 04:68'],
	[342.74, 5.00996, '24.09 04:68'],
	[342.74, 5.00996, '24.09 04:68'],
	[342.74, 5.00996, '24.09 04:68'],
	[342.74, 5.00996, '24.09 04:68'],
	[342.74, 5.00996, '24.09 04:68']
];

const getData = (handler, index) => {
	handler({
		amount: mockTableData[index][1],
		price: mockTableData[index][0]
	});
};

const OrderBookBuy = ({ selectRow }) => {
	return (
		<Table
			headers={[
				{ text: 'Price', align: 'center' },
				{ text: 'Amount', align: 'center' },
				{ text: 'Time', align: 'center' }
			]}
			data={mockTableData}
			onClick={(data) => getData(selectRow, data)}
			highlightRow
		/>
	);
};

const OrderBookSell = ({ selectRow }) => {
	return (
		<Table
			headers={[
				{ text: 'Price', align: 'center' },
				{ text: 'Amount', align: 'center' },
				{ text: 'Time', align: 'center' }
			]}
			data={mockTableData}
			onClick={(data) => getData(selectRow, data)}
			highlightRow
			highlightRowColor="red"
		/>
	);
};

const OrderBook = ({ activeTab, changeTab, changeData }) => {
	const handleSelectRow = (params) => {
		changeData({
			// tab: activeTab,
			...params
		});
	};

	return (
		<Tabs
			id="orderbook"
			animate={false}
			selectedTabId={activeTab}
			onChange={(id) => changeTab('OrderBook', id)}
		>
			<h3>OrderBook</h3>
			<Tabs.Expander />
			<Tab id="buy" title="Buy" panel={<OrderBookBuy selectRow={handleSelectRow} />} />
			<Tab id="sell" title="Sell" panel={<OrderBookSell selectRow={handleSelectRow} />} />
		</Tabs>
	);
};


export default OrderBook;
