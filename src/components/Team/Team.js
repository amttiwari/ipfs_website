import React from 'react';


import Aux from '../../hoc/Auxi/Auxi';
import classes from './Team.module.css';

//images
import strahinja from '../../assets/images/team/strahinja.jpg';
import uros from '../../assets/images/team/uros.jpg';
import dolphin from '../../assets/images/team/dolphin.jpg';

const team = (props) => {


    function makeCard (name, description, image, email, linkedin) {
        return (
            <div className={classes.card}>
                    <div>
                        <img src={image}  width= '250px' height='180px' alt='person_image' draggable={false} />
                    </div>
                    <div className={classes.cardbody}>   
                        <h2>{name}</h2>
                        <p>{description}</p>
                        <p className={classes.caption}>Email: {email}</p>
                        <p className={classes.caption}>Country: Serbia</p>
                        { linkedin ?
                            <a href={linkedin} target='_blank' rel='noopener noreferrer'><i class="fab fa-linkedin-in"></i></a> : null
                        }
                    </div>
            </div>
        )
    }


    return (
    <Aux>
        <div className='container' style={{marginLeft: '1em auto'}}>
            <div>
                <h1 className={classes.title}>The Team</h1>
            </div>

            <div className={classes.teambody} style={{marginLeft:'35px'}}>
                <div className='row'>
                    {makeCard('Strahinja', 'Designer, community manager, crypto enthusiast', strahinja, 'lars@deficlerk.com')}
                    {makeCard('Uros', 'Full Stack Developer, solidity/web3.js', uros, 'uros@deficlerk.com', 'https://www.linkedin.com/in/uros-t-55674288/')}
                    {makeCard('Dolphin', 'Senior Security Engineer, system architecture', dolphin, 'dolphin@deficlerk.com')}
                </div>

                {/* <div className={classes.divider}></div> */}

                <div className={`row ${classes.explanation}`}>
                    <p>The culture of a company is what we think defines the pursuit of excelence. We aspire toward having a culture heavily based on learning and trust.
                    We are constantly learning new things and trying to be better than we were the previous day as individuals and as the company.</p>
                    We believe that people with passion can change the world for the better. You can apply to work with us even if you do not currently have any technical skills.
                    <p>If you are sharing the same values and would like to work with us, email <b>work@deficlerk.com</b> </p>
                    
                </div>
            </div>
            
        </div>
    </Aux>
    )
};

export default team;