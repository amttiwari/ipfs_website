import React from 'react';

import classes from './InputField.module.css';

const InputField = (props) => {

    return (
        <div className={classes.inputamountdiv}>
            <div className={`${classes.inputamountlabel} flex-row-center`}>
                <span>{props.label}</span>
            </div>
            {props.children}
        </div>
    );
}

export default InputField;