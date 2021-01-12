import React from 'react';
import { useState } from 'react';
import classes from './Dapps.module.css';

import Modal from '../UI/Modal/Modal';
import Button from '../UI/Button/Button';
import Card from 'react-bootstrap/Card';

import mirror_bot_example from '../../assets/images/dapps/mirror_bot_example.png';
import tradebot from '../../assets/images/dapps/tradebot.png';
import subscriptions from '../../assets/images/dapps/subscriptions.png';

const Dapps = (props) => {

    const [firstShow, setFirstShow] = useState(false);
    const [secondShow, setSecondShow] = useState(false);
    const [thirdShow, setThirdShow] = useState(false);

    return (
        <div className='container' style={{marginLeft: '1em auto'}}>

            <div>
                <h1 className={classes.title} style={{marginBottom: '0px'}}>Dapps</h1>
                <p>And some capps with token integration...</p>
            </div>


            {/* MODAL 1 - CENTRALIZED EXCHANGE MIRROR BOT */}
            <Modal show={firstShow}
                   handleClose={() => setFirstShow(false)} 
                   handleShow={() => setFirstShow(true)}
                   title='CEX MIRROR TRADING BOT'>
                    
                <div class='mirrorbot'>
                        <p>App is finished, just needs some design tweak before going live on deficlerk website.</p>

                        <p className={classes.explanation}>Very simple, client accounts follow everything master account does.</p>
                        <p className={classes.explanation}>It is designed mainly for day traders that have many clients as it allows them to make trades for all of the accounts from single master account.</p>
                        <p className={classes.explanation}>Future updates will allow traders to be followed by other people and get rewarded in CLERK tokens depending on their trading success. </p>
                        <img src={mirror_bot_example} alt='centralized exchange bot' width='100%'/>
                        <p className={classes.explanation}>Anyone that holds at least 50 CLERK tokens will be able to use the bot for free.</p>
                </div> 
            </Modal>

            {/* MODAL 2 - DECENTRALIZED EXCHANGE MIRROR BOT */}
            <Modal show={secondShow}
                   handleClose={() => setSecondShow(false)} 
                   handleShow={() => setSecondShow(true)}
                   title='DEX MIRROR TRADING BOT'>
                   
                <div>
                    <p>Under Construction, Expected Release Q4 2020</p>

                    <p className={classes.explanation}>You will be provided a list of succesful traders/bots addresses which you will be able to follow.</p>
                </div>
            </Modal>

            {/* MODAL 3 - SUBSCRIPTION PROTOCOL AND SUBSCRIPTION DAPPS */}
            <Modal show={thirdShow}
                   handleClose={() => setThirdShow(false)} 
                   handleShow={() => setThirdShow(true)}
                   title='CRYPTO SUBSCRIPTIONS'>
                   
                <div>
                    <p>Expected Release Q1 2021</p>

                    <p className={classes.explanation}>You will be able to create a widget on Defi Clerk website which you can then insert on your website.</p>
                    <p>The widget will allow you to start accepting monthly crypto subscriptions.</p>
                </div> 
            </Modal>

            <div className={classes.cards}>
                <Card style={{ width: '18rem' }}>
                    <Card.Img variant='top' src={tradebot} onClick={() => setFirstShow(true)}/>
                    <Card.Body>
                        <Card.Title>CEX mirror trading bot</Card.Title>
                        <Card.Text>
                        98% finished. Needs design changes before going live.
                        </Card.Text>
                        <Button btnType='About' padding='6px 14px' clicked={() => setFirstShow(true)}>Read more</Button>
                    </Card.Body>
                </Card>

                <Card style={{ width: '18rem' }}>
                    <Card.Img variant='top' src={tradebot} onClick={() => setSecondShow(true)}/>
                    <Card.Body>
                        <Card.Title>DEX mirror trading bot</Card.Title>
                        <Card.Text>
                        Status: Under development. Copy succesful uniswap traders.
                        </Card.Text>
                        <Button btnType='About' padding='6px 14px' clicked={() => setSecondShow(true)}>Read more</Button>
                    </Card.Body>
                </Card>

                <Card style={{ width: '18rem' }}>
                    <Card.Img variant='top' src={subscriptions} onClick={() => setThirdShow(true)}/>
                    <Card.Body>
                        <Card.Title>Crypto Subscriptions</Card.Title>
                        <Card.Text>
                        ETA: Q1 2021. Subscription widget and similar time release event based dapps.
                        </Card.Text>
                        <Button btnType='About' padding='6px 14px' clicked={() => setThirdShow(true)}>Read more</Button>
                    </Card.Body>
                </Card>
            </div>

        </div>
    );
}


export default Dapps;