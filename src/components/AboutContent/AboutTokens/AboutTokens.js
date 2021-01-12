import React from 'react';
import classes from './AboutTokens.module.css';
import Button from '../../UI/Button/Button';
import Card from '../../UI/Card/Card';

const button = (props) => {

    let token;
    let uniswapbtn;
    let etherscanbtn;
    let poolbtn;

    if(props.token === 'RCR') {
        token = <p> <b>RCR</b> is the native utility token for the Defi Clerk platform. 
            It is responsive to market conditions and used in our ecosystem of DAPPs and for staking.
            </p>
        uniswapbtn = <Button btnType='About' href='https://app.uniswap.org/#/swap/0xf5323c19fb271a489000b739b09554c144ba840d'>Uniswap</Button>
        etherscanbtn = <Button btnType='About' href='https://etherscan.io/token/0xf5323c19FB271a489000B739B09554C144bA840d'>Etherscan</Button>
        poolbtn = <Button btnType='About' href='https://app.uniswap.org/#/add/ETH/0xf5323c19FB271a489000B739B09554C144bA840d'>Pool</Button>
         

    } else if (props.token === 'Clerk') {
        token = <p> <b>CLERK</b> is the native governance token for the Defi Clerk platform. It is mintable by staking RCR tokens. 
        Its main and only use is for voting on future changes to the protocol. (staking rewards, burns)
        </p> 
        etherscanbtn = <Button btnType='About' href='https://etherscan.io/token/0x432a92cccb253e890b6765e5d368733a27a5df49'>Etherscan</Button>
    }

    return (
        <Card>
            {token}
            <div className={classes.tokenlinks}>
                {uniswapbtn}
                {etherscanbtn}
                {poolbtn}
            </div>
        </Card>
    )
};

export default button;