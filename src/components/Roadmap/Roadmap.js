import React from 'react';

import classes from './Roadmap.module.css';
import Aux from '../../hoc/Auxi/Auxi';

//images
// import coinmarketcap from '../../assets/images/roadmap/coinmarketcap.png';
import coingecko from '../../assets/images/roadmap/coingecko.png';
import staking from '../../assets/images/roadmap/staking.png';
import feedback from '../../assets/images/roadmap/feedback.png';
import liquidity from '../../assets/images/roadmap/liquidity.png';
import protocol from '../../assets/images/roadmap/protocol.png';
import dapps from '../../assets/images/roadmap/dapps.png';
import partnership from '../../assets/images/roadmap/partnership.png';
import governance from '../../assets/images/roadmap/governance.png';


const roadmap = (props) => {


    function makeCard (name, description, image1, finished, url) {
        return (
            <div className={`${classes.card} ${finished ? classes.finished : null}`} 
                 onClick={() => url !== undefined ? window.location.href = url : null}>
                    <div className={classes.center}>
                        <img src={image1} width='100px' alt='placeholder' draggable={false}/>
                    </div>
                    <div className={classes.center}>{name}</div>
                    <div className={classes.caption}>{description}</div>
            </div>
        )
    }

    return (
    <Aux>
        <div className='container'>
            <div>
                <h1 className={classes.title}> Roadmap </h1>
            </div>

            <div>
                <h2 className={classes.subtitle}>2020: </h2>
            </div>
            <div className={classes.cards}>
                {makeCard('CMC and Coingecko', 'Applications for CMC and Coingecko will be sent out in September 2020.', coingecko, true)}
                {makeCard('Staking', 'Stake RCR for CLERK. Functionality will be added on Defi Clerk website in September.', staking, true, '/Stake')}
                {makeCard('Liquidity Programs', 'After the initial offering, we will ensure there is always sufficient amount of ETH in the pool for CLERK token to be valued no less than $1.', liquidity)}
                {makeCard('Community Feedback', 'During 2020 we will roll out smaller apps and will constantly seek feedback and reward people that participate with RCR tokens from the community reserve.', feedback)}
            </div>

            <div>
                <h2 className={classes.subtitle}>2021: </h2>
            </div>
            <div className={classes.cards}>
                {makeCard('Subscriptions Prototype', 'In Q1 2021 we will have prototype finished on which all of the future apps will be built upon.', protocol)}
                {makeCard('DAPP Development', 'UI for all of the DAPPS will be provided on Defi Clerk website.', dapps)}
                {makeCard('Governance Mechanism', 'Community will be able to make and vote on proposals using their CLERK tokens.', governance)}
                {makeCard('Partnerships & Adoption', 'After we have a more robust system in place we can look for bigger parnterships and mainstream adoption. Businesses will be able to simply include our widget on their website to start accepting crypto subscriptions.', partnership)}
            </div>
            
        </div>
    </Aux>
    );
};

export default roadmap;