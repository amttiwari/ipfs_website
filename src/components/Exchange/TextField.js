import React from 'react';
import { FormGroup, InputGroup } from '@blueprintjs/core';
import classes from './TextField.module.css';

const TextField = ({ disabled, label, value, onChange }) => {
	return (
		<FormGroup disabled={disabled} inline label={label} className={classes.textField}>
			<InputGroup disabled={disabled} large value={value} onChange={onChange} />
		</FormGroup>
	);
};

export default React.memo(TextField);
