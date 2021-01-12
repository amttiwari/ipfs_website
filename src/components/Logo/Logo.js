import React from 'react';

import companyLogo from '../../assets/images/logo.svg';
import classes from './Logo.module.css';

console.log(classes)
const logo = (props) => (
    
    <div className={classes.Logo} style={{height: props.height}}>
        <img src={companyLogo} alt="DefiClerk" />
    </div>
);

export default logo;