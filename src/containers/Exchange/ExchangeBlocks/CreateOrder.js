import React from 'react';
import {
	Intent,
	Tab,
	Tabs
} from '@blueprintjs/core';
import ActionButton from '../../../components/Exchange/ActionButton';
import TextField from '../../../components/Exchange/TextField';
import Loader from '../../../components/Exchange/Loader';


const CreateOrderBuy = ({ data, changeData, loading, setLoading }) => {
	const handleCLick = () => {
		setLoading(true);
		setTimeout(() => setLoading(false), 2000);
	};

	return (
		<>
			<form>
				<TextField label="Amount of CLERK" value={data?.amount} onChange={(e) => changeData('amount', e?.target?.value)} disabled={loading} />
				<TextField label="Price for 1 CLERK" value={data?.price} onChange={(e) => changeData('price', e?.target?.value)} disabled={loading} />
				<TextField label="Total ETH" />
				<ActionButton intent={Intent.SUCCESS} text="Place Buy Order" disabled={loading} onClick={handleCLick} />
			</form>
		</>
	);
};

const CreateOrderSell = ({ data, changeData, loading, setLoading }) => {
	const handleCLick = () => {
		setLoading(true);
		setTimeout(() => setLoading(false), 2000);
	};

	return (
		<>
			<form>
				<TextField label="Amount of CLERK" value={data?.amount} onChange={(e) => changeData('amount', e?.target?.value)} disabled={loading} />
				<TextField label="Price for 1 CLERK" value={data?.price} onChange={(e) => changeData('price', e?.target?.value)} disabled={loading} />
				<TextField label="Total ETH" />
				<ActionButton intent={Intent.DANGER} text="Place Sell Order" disabled={loading} onClick={handleCLick} />
			</form>
		</>
	);
};

const CreateOrder = ({ activeTab, changeTab, data, changeData }) => {
	const [loading, setLoading] = React.useState(false);
	return (
		<Tabs
			id="create-order"
			animate={false}
			selectedTabId={activeTab}
			onChange={(id) => changeTab('CreateOrder', id)}
		>
			<h3>Create Order</h3>
			{loading && <Loader />}
			<Tabs.Expander />
			<Tab id="buy" title="Buy" panel={<CreateOrderBuy data={data} changeData={changeData} loading={loading} setLoading={setLoading} />} />
			<Tab id="sell" title="Sell" panel={<CreateOrderSell data={data} changeData={changeData} loading={loading} setLoading={setLoading} />} />
		</Tabs>
	);
};

export default CreateOrder;
