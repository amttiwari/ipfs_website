import React from 'react';

import classes from './MonthDiv.module.css';

const MonthDiv = (props) => {

    return (
        <div className={`${classes.monthdiv} ${props.selected} flex-column-center`} onClick={props.onClick}>
            <div>{props.duration}</div>
            <div className={classes.rate}>rate {props.rate}</div>
        </div>
    );
}

export default MonthDiv;