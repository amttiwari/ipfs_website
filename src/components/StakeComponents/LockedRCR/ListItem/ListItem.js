import React from 'react';
import classes from './ListItem.module.css';

import moment from 'moment';
import Button from '../../../UI/Button/Button';

const ListItem = (props) => {

    function calculateDate() {
        const timenow = moment().unix();
        const releasetime = props.releasetime;
        
        let timeleft = releasetime - timenow;
        
        var d = Math.floor(timeleft / (3600*24));
        return d;
    }

    return (
        <div className={classes.listitem}>
            <div style={{width: '150px', textAlign: 'center'}}>{props.amount}</div>
            {/* <div style={{width: '150px', textAlign: 'center'}}>12</div>
            <div style={{width: '150px', textAlign: 'center'}}>3months</div> */}
            <div style={{width: '150px', textAlign: 'center'}}>{calculateDate()} days left</div>
            <Button btnType='Release' disabled={!props.fulfilled}>Release</Button>
        </div>
    );
}

export default ListItem;