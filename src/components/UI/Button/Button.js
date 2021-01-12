import React from 'react';
import classes from './Button.module.css';

const button = (props) => {
    
    let attachedClasses = [classes.Button, classes[props.btnType]];

    if (props.disabled) {
        attachedClasses.push(classes.disabled);
    }

    return (
    <a  href={props.href} target='_blank' rel="noopener noreferrer"
        className={attachedClasses.join(' ')}
        style={{padding: props.padding}}
        onClick={props.clicked} > <span>{props.children} </span> </a>
    );
};

export default button;