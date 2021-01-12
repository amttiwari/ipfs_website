import React from 'react';

import Aux from '../../../hoc/Auxi/Auxi';
import classes from './CommunityLinks.module.css';


const communityLinks = (props) => {

    return (
        <Aux>
            <div className={classes.main}>
                <h4 style={{marginBottom: '1em'}}>Join The Community</h4>
                <ul className={classes.socials}>
                    <li>
                        <a href='https://discord.gg/eJtqnfU' rel='noopener noreferrer' target="_blank">
                            <em className={`${classes.icon} fab fa-discord discord`}>

                            </em>
                        </a>
                    </li>

                    <li> 
                        <a href='https://t.me/deficlerk' rel='noopener noreferrer' target="_blank">
                            <em className={`${classes.icon} fab fa-telegram telegram`}>

                            </em>
                        </a>
                    </li>

                    <li> 
                        <a href='https://twitter.com/DefiClerk' rel='noopener noreferrer' target="_blank">
                            <em className={`${classes.icon} fab fa-twitter twitter`}>

                            </em>
                        </a>
                    </li>


                </ul>
            </div>
        </Aux>
    )
};

export default communityLinks;