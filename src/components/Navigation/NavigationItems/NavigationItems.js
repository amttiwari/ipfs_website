import React from 'react';

import classes from './NavigationItems.module.css';
import NavigationItem from './NavigationItem/NavigationItem';
import CommunityLinks from '../../AboutContent/CommunityLinks/CommunityLinks';
import Aux from '../../../hoc/Auxi/Auxi';
import Ripples from 'react-ripples'

const navigationItems = (props) => (
    <Aux>
        {/* <div className="row">
                <p>ahdvfhsdvsdhbv</p>
            </div> */}
        {/* <ul className={classes.NavigationItems}> */}

        <div className={classes.caption} style={{ marginTop: '1em', textAlign: 'center', fontWeight: '600' }}>Navigation</div>
        <Ripples>

            <NavigationItem onClick={props.onClick} link="/deficlerk/" active>
                <i className="fas fa-home"></i> About
            </NavigationItem>
        </Ripples><br />

        <Ripples>
            <NavigationItem onClick={props.onClick} link="/deficlerk/Tokenomics"> <i className="fas fa-coins"></i> Tokenomics </NavigationItem>
        </Ripples><br />

        <Ripples>
            <NavigationItem onClick={props.onClick} link="/deficlerk/Roadmap"> <i className="fas fa-road"></i> Roadmap </NavigationItem>
        </Ripples><br />

        <Ripples>
            <NavigationItem onClick={props.onClick} link="/deficlerk/Team"> <i className="fas fa-user-friends"></i> Team </NavigationItem>
        </Ripples><br />

        <Ripples>
            <NavigationItem onClick={props.onClick} link="/deficlerk/Stake"> <i className="fas fa-lock"></i> <span className={classes.navtext}>Stake</span></NavigationItem>
        </Ripples><br />

        <Ripples>
            <NavigationItem onClick={props.onClick} link="/deficlerk/Dapps"> <i className="fas fa-rocket"></i> <span className={classes.navtext}>Dapps</span></NavigationItem>
        </Ripples><br />

        <Ripples>

            <NavigationItem onClick={props.onClick} link="/deficlerk/Xchange"> <i className="fa fa-exchange"></i> <span className={classes.navtext}>Exchange</span></NavigationItem>
        </Ripples><br />


        <div className={classes.divider}></div>

        <div className={classes.caption} style={{ marginTop: '1em', textAlign: 'center', fontWeight: '600' }}>Useful External Links</div>
        <Ripples>
            <li className={classes.NavigationItem}>
                <a target='_blank' rel='noopener noreferrer' href='https://www.youtube.com/watch?v=dcZ7kVC2-6g'> <i className="fab fa-youtube"></i> Uniswap Tutorial </a> </li>
        </Ripples>

        <Ripples>
            <li className={classes.NavigationItem}>
                <a target='_blank' rel='noopener noreferrer' href='https://uniswap.exchange/swap/0xf5323c19fb271a489000b739b09554c144ba840d'> <i className="fas fa-angle-double-right"></i> RCR/ETH Exchange</a> </li>
        </Ripples>

        <Ripples>
            <li className={classes.NavigationItem}>
                <a target='_blank' rel='noopener noreferrer' href='https://uniswap.exchange/swap/0x432A92CCcB253E890b6765e5d368733A27A5df49'> <i className="fas fa-angle-double-right"></i> CLERK/ETH Exchange</a> </li>
        </Ripples>

        <div className={classes.divider}></div>

        <CommunityLinks />

        {/* </ul> */}
    </Aux>

);

export default navigationItems;