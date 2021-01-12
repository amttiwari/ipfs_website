//NEEDS TO BE REFACTORED. Use bootstrap Card instead and then import it to About/Tokenomics/Roadmap/Team and Dapp page.
import React from 'react';
import classes from './Card.module.css';

const card = (props) => (
    <div className={classes.card} width={props.width} height={props.height} 
    style={{flexDirection: props.flexDirection}}>
        {props.children}
    </div>

);

export default card;