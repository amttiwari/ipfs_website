import React from 'react';
import { Intent, Tag, Tooltip } from '@blueprintjs/core';
import ComboBox from '../../../components/Exchange/ComboBox';
import TradingViewChart from '../../../components/Exchange/TradingViewChart';
import tokenOptions from './tokens.json';
import classes from './ExchangeBlocks.module.css';

const mockChartData = [
	{ time: '2019-04-11', value: 80.01 },
	{ time: '2019-04-12', value: 96.63 },
	{ time: '2019-04-13', value: 76.64 },
	{ time: '2019-04-14', value: 81.89 },
	{ time: '2019-04-15', value: 74.43 },
	{ time: '2019-04-16', value: 80.01 },
	{ time: '2019-04-17', value: 96.63 },
	{ time: '2019-04-18', value: 76.64 },
	{ time: '2019-04-19', value: 81.89 },
	{ time: '2019-04-20', value: 74.43 }
];
const player = (props) => {
	console.log(props);
 }
const renderTokenData = (token) => {
	player(token)
	if (token === 'CLERK') {
		return (
			<>
				<span className={classes.additionalInfoBox}>
					<span>Last Price ($2,926.00):</span>
					<span className={classes.blue}>0.00749249 ETH</span>
				</span>
				<span className={classes.additionalInfoBox}>
					<span>{token} Buy Wall:</span>
					<span className={classes.blue}>At lvl. 67 ~2.97 USD</span>
				</span>
				<span className={classes.additionalInfoBox}>
					<span>{token} Supply Left:</span>
					<span className={classes.blue}>To reach lvl. 68 5454.59 {token}</span>
				</span>
			</>
		);
	}
	if (token === 'RCR') {
		return (
			<>
				<span className={classes.additionalInfoBox}>
					<span>Last Price ($2,926.00):</span>
					<span className={classes.blue}>0.00749249 ETH</span>
				</span>
				<span className={classes.additionalInfoBox}>
					<span>{token} Supply Left:</span>
					<span className={classes.blue}>To reach lvl. 68 5454.59 {token}</span>
				</span>
			</>
		);
	}
	return null;
};

const gasOptions = [
	{ label: 'Slow', value: 'slow' },
	{ label: 'Normal', value: 'normal' },
	{ label: 'Fast', value: 'fast' }
];

const PriceChart = ({ token, setToken, currentPrice, priceChange, gas }) => {
	const [gasSelectedOption, setGasSelectedOption] = React.useState(gasOptions[0]?.value);

	const getLabel = () => `${token} / ETH`;

	const getPriceChange = () => {
		if (!priceChange && priceChange !== 0) return null;
		let el = null;
		if (priceChange < 0) el = <span className={classes.red}>({priceChange}%)</span>;
		else if (priceChange > 0) el = <span className={classes.green}>({priceChange}%)</span>;
		else el = `(0%)`;
		return (
			<Tooltip content="Changes in the last 24h">
				{el}
			</Tooltip>
		);
	};

	const getCurrentPrice = () => {
		if (currentPrice === null) return '-';
		const formattedPrice = currentPrice === null ? '-' : `$${currentPrice} USD`;
		return (
			<span className={classes.blue}>
				{formattedPrice}
				{` `}
				{getPriceChange()}
			</span>
		);
	};

	const getGasPrice = () => {
		return (
			<span className={classes.blue}>
				{gas[gasSelectedOption] ? `${gas[gasSelectedOption]} GWEI` : '-'}
			</span>
		);
	};

	return (
		<>
			<div className={classes.priceChartTopBar}>
				<ComboBox
					items={tokenOptions}
					label={getLabel()}
					value={token}
					onSelect={setToken}
				/>
				<div className={classes.priceChartInfo}>
					<div>
						<small>ETH Price: {getCurrentPrice()}</small>
						<small>GAS Price: {getGasPrice()}</small>
					</div>
					<div className={classes.priceTagInput}>
						{gasOptions.map((gasOption) => {
							return (
								<Tag
									key={gasOption?.value}
									active={gasOption?.value === gasSelectedOption}
									className={classes.priceTagInputButton}
									interactive
									onClick={() => setGasSelectedOption(gasOption?.value)}
									intent={Intent.PRIMARY}
								>
									{gasOption?.label}
								</Tag>
							);
						})}
					</div>
				</div>
			</div>
			<div className={classes.priceChartAdditionalInfo}>
				{renderTokenData(token)}
			</div>
			<TradingViewChart data={mockChartData} />
		</>
	);
};

export default PriceChart;
