import React from 'react';
import classes from './TokenBalance.module.css';

const tokenBalance = (props) => {

    return (
        <div className={`${classes.textwithIcon} flex-row-center`}>
            <div className={classes.tokenimg}>
                <img src={props.img} alt='token logo' draggable={false}/>   
            </div>
            <div className={`${classes.tokentext} flex-column-center`}>
                <div className={classes.tokentextup}>{props.name}</div>
                <div className={classes.tokentextdown}>{props.balance}</div>
            </div>
        </div>
    );
}

export default tokenBalance;
