import React from 'react';

import classes from './AboutContent.module.css';
import Aux from '../../hoc/Auxi/Auxi';
import CommunityLinks from './CommunityLinks/CommunityLinks';
import Button from '../UI/Button/Button';
import AboutTokens from './AboutTokens/AboutTokens';


const aboutContent = (props) => {
    return (
        <Aux>    
        
            <div className={classes.aboutContent}>
                <h1 className={classes.title}>Defi Clerk</h1>
                <h2 className={classes.subtitle}>Inter-Chain Defi Solutions </h2>
                <h2> Offer your customers most popular cryptos as payment method.</h2>
                <h2> Optimize your business with monthly crypto subscriptions!</h2>
                <h2> Subscribe and follow trades of other succesful accounts on blockchain!</h2> <br/>
                
                <em style={{fontWeight: 500}}> Time release, event based payments. <i className="fas fa-check" style={{color: '#e7a92c'}}></i> </em> <br />
                <em style={{fontWeight: 500}}> Mirror trading. <i className="fas fa-check" style={{color: '#e7a92c'}}></i> </em>

                <CommunityLinks />

                <Button href='google.com' btnType='About'> Whitepaper 
                <span className={classes.comingsoon}>(coming soon)</span> 
                </Button>
                 
                <div className={classes.tokensdiv}>
                    <AboutTokens token='RCR' />
                    <AboutTokens token='Clerk' />
                </div>
            </div>

            



        </Aux>
    );
};

export default aboutContent;