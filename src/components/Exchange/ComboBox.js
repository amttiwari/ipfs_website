import React from 'react';
import { Button, Intent, MenuItem } from '@blueprintjs/core';
import { IconNames } from '@blueprintjs/icons';
import { Select } from '@blueprintjs/select';
import classes from './ComboBox.module.css';

const ComboBox = ({ label, items, onSelect, value }) => {
	const itemRender = (item) => {
		const isSelected = item?.value === value;
		return (
			<MenuItem
				key={item?.value}
				text={item?.label}
				onClick={() => onSelect(item?.value)}
				icon={isSelected ? IconNames.TICK_CIRCLE : IconNames.CIRCLE}
			/>
		);
	};

	return (
		<Select
			className={classes.comboBox}
			items={items}
			itemRenderer={itemRender}
			filterable={false}
		>
			<Button intent={Intent.PRIMARY} fill rightIcon={IconNames.CARET_DOWN}>{label}</Button>
		</Select>
	);
};

export default ComboBox;
