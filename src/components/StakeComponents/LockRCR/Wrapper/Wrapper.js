import React from 'react';

import classes from './Wrapper.module.css';
import LockPNG from '../../../../assets/images/staking/lock.png';

const wrapper = (props) => (

        <div className={classes.stake}>
            <div className={classes.stakeheader}>
                <span className={classes.headerspan}>LOCK RCR</span>
            </div>

            <div className={classes.lockbody}>
                <div className={classes.safediv} style={{maxHeight: '150px'}}>
                    <img src={LockPNG} height='135px' alt='locksafe' draggable={false}/>
                </div>

                <div className={`${classes.staketokens} flex-column-center`}>

                    {props.children}

                <div className={classes.note}>
                    Locked RCR will be unavailable during the locking period.</div>

                </div>
            </div>
        </div>
);

export default wrapper;