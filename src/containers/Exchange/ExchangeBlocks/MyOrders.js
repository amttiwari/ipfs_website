import React from 'react';
import { Tab, Tabs } from '@blueprintjs/core';
import Table from '../../../components/Exchange/Table';

const MyOrdersOpen = () => {
	const [data, setData] = React.useState([]);
	const [loading, setLoading] = React.useState(false);

	React.useEffect(() => {
		setLoading(true);
		setTimeout(() => {
			setData([
				[1, 1, 1, 1, 1, 1],
				[2, 2, 2, 2, 2, 2],
				[3, 3, 3, 3, 3, 3]
			]);
			setLoading(false);
		}, 2000);
	}, []);

	return (
		<Table
			headers={[
				{ text: 'Type', align: 'center' },
				{ text: 'Price', align: 'center' },
				{ text: 'Amount', align: 'center' },
				{ text: 'Total', align: 'center' },
				{ text: 'Time', align: 'center' },
				{ text: 'Status', align: 'center' }
			]}
			data={data}
			loading={loading}
		/>
	);
};

const MyOrdersClosed = () => {
	return (
		<Table
			headers={[
				{ text: 'Type', align: 'center' },
				{ text: 'Price', align: 'center' },
				{ text: 'Amount', align: 'center' },
				{ text: 'Total', align: 'center' },
				{ text: 'Time', align: 'center' }
			]}
			data={[
				[1, 1, 1, 1, 1],
				[2, 2, 2, 2, 2],
				[3, 3, 3, 3, 3]
			]}
		/>
	);
};

const MyOrders = () => {
	const [selectedTab, setSelectedTab] = React.useState('open');
	return (
		<Tabs
			id="create-order"
			animate={false}
			selectedTabId={selectedTab}
			onChange={setSelectedTab}
		>
			<h3>My Orders</h3>
			<Tabs.Expander />
			<Tab id="open" title="Open" panel={<MyOrdersOpen />} />
			<Tab id="closed" title="Closed" panel={<MyOrdersClosed />} />
		</Tabs>
	);
};

export default MyOrders;
