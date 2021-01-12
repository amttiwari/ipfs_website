import React from 'react';
import NavigationItems from '../NavigationItems/NavigationItems';
import classes from './SideDrawer.module.css';
import Aux from '../../../hoc/Auxi/Auxi';


const sideDrawer = (props) => {
    let attachedClasses = [classes.SideDrawer, classes.Close];
    if (props.open) {
        attachedClasses = [classes.SideDrawer, classes.Open];
    }

    return (
        <Aux>
                <nav className={attachedClasses.join(' ')}>
                    <div className={classes.DrawerContent}>
                        <NavigationItems onClick={props.onClick} />
                    </div>
                </nav>
        </Aux>
    );
};

export default sideDrawer;