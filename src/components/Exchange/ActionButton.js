import React from 'react';
import { Button } from '@blueprintjs/core';
import classes from './ActionButton.module.css';

const ActionButton = ({ disabled, intent, text, onClick }) => {
	return (
		<Button
			disabled={disabled}
			className={classes.actionButton}
			fill
			intent={intent}
			text={text}
			onClick={onClick}
		/>
	);
};

export default ActionButton;
