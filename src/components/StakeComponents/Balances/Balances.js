import React, { useEffect } from 'react';
import classes from './Balances.module.css';

import TokenBalance from './TokenBalance/TokenBalance';

import RCR from '../../../assets/images/rc.svg';
import CLERK from '../../../assets/images/clerk.svg';
import Cookies from 'js-cookie'




const balances = (props) => {


    // setTimeout(() => {
    
    const fetchPromise = window.ethereum.request({ method: 'eth_requestAccounts' });
    // console.log(accounts);
    fetchPromise.then(response => {
        console.log(response[0]);
        var address = ''
        if(Cookies.get('is_login')==='1'){
            address = response[0];
        }

        // const [firstShow, setFirstShow] = useState([]);
        let tokenAddress = "0x0248c6ea9d75d5b380df528e83a5b8bcb293cb38";
        // let walletAddress = response[0];       

        let minABI = [
            // balanceOf
            {
                "constant": true,
                "inputs": [{ "name": "_owner", "type": "address" }],
                "name": "balanceOf",
                "outputs": [{ "name": "balance", "type": "uint256" }],
                "type": "function"
            },
            // decimals
            {
                "constant": true,
                "inputs": [],
                "name": "decimals",
                "outputs": [{ "name": "", "type": "uint8" }],
                "type": "function"
            }
        ];

        let contract = window.web3.eth.contract(minABI).at(tokenAddress);

        contract.balanceOf(address, (error, balance) => {
            // Get decimals
            contract.decimals((error, decimals) => {
                // calculate a balance
                balance = balance.div(10 ** decimals);
                document.getElementById("rcr_balance11").innerHTML = balance.toString()


                // alert(rcr)

                // console.log(firstShow);
                // document.getElementById("rcr_balance11").innerHTML = balance.toString()
            });
        });



        let tokenAddress1 = "0x652e157c9195d809d06f793b03b4498b19073ae3";

        let minABI1 = [
            // balanceOf
            {
                "constant": true,
                "inputs": [{ "name": "_owner", "type": "address" }],
                "name": "balanceOf",
                "outputs": [{ "name": "balance", "type": "uint256" }],
                "type": "function"
            },
            // decimals
            {
                "constant": true,
                "inputs": [],
                "name": "decimals",
                "outputs": [{ "name": "", "type": "uint8" }],
                "type": "function"
            }
        ];
        // Get ERC20 Token contract instance
        let contract1 = window.web3.eth.contract(minABI1).at(tokenAddress1);
        // Call balanceOf function
        contract1.balanceOf(address, (error, balance) => {
            // Get decimals
            contract1.decimals((error, decimals) => {
                // calculate a balance
                balance = balance.div(10 ** decimals);
                setTimeout(() => {
                    document.getElementById("clerk_balance1").innerHTML = balance.toString()
                }, 200)
            });
        });
        
    });






    return (
        <div className={classes.balances}>
            <div className={classes.balancesheader}>
                <span className={classes.headerspan}>RCR & CLERK BALANCE</span>
            </div>

            <div className={`${classes.balancesbody} flex-row-center`}>

                <div className="TokenBalance_textwithIcon__RhWLw flex-row-center">
                    <div className="TokenBalance_tokenimg__1ZyZf">
                        <img src="/deficlerk/static/media/rc.dda74db1.svg" alt="token logo"
                            draggable="false" />
                    </div>
                    <div className="TokenBalance_tokentext__1BX38 flex-column-center">
                        <div className="TokenBalance_tokentextup__AAr-r">RCR</div>
                        <div className="TokenBalance_tokentextdown__V4vbk" id="rcr_balance11"></div></div></div>

                {/* <TokenBalance name='RCR' img={RCR} id="rcr_balance11" /> */}
                <div className="TokenBalance_textwithIcon__RhWLw flex-row-center">
                    <div className="TokenBalance_tokenimg__1ZyZf">
                        <img src="/deficlerk/static/media/clerk.18d56721.svg" alt="token logo"
                            draggable="false" />
                    </div>
                    <div className="TokenBalance_tokentext__1BX38 flex-column-center">
                        <div className="TokenBalance_tokentextup__AAr-r">CLERK</div>
                        <div className="TokenBalance_tokentextdown__V4vbk" id="clerk_balance1"></div></div></div>
            </div>
        </div>
    );
}

export default balances;
