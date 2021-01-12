import React from 'react';
import { Card } from '@blueprintjs/core';
import classes from './ExchangeBlock.module.css';

const ExchangeBlock = ({ children, className }) => {
	const classNameParsed = [classes.exchangeBlock];
	if (className) classNameParsed.push(className);
	return (
		<Card className={classNameParsed.join(' ')} interactive={false}>
			{children}
		</Card>
	);
};

export default ExchangeBlock;
