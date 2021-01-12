import React, { useEffect,useState } from 'react';
import * as actionTypes from '../actions/actionTypes';
import { toast } from 'react-toastify';



const initialState = {
    web3instance: {},
    address: '',
    transactions: [],
    balances: {
        rcr: 0,
        clerk: 0,
        ether: 0,
    },
    prices: {
        rcr: 0.25,
        clerk: 0.5
    },
    CONTRACTS: {
        RECURLY: '0xf5323c19FB271a489000B739B09554C144bA840d',
        CLERK: '0x432A92CCcB253E890b6765e5d368733A27A5df49',
        HODLER: '0x2f444075CE7f45CEc25CdBdC4EC3a421945F09EA'
    }
};

// useEffect(() => {
//    rcrBalance() 
// }, )



const reducer = (state = initialState, action) => {


    // const [firstShow, setFirstShow] = useState([]);
let tokenAddress = "0x0248c6ea9d75d5b380df528e83a5b8bcb293cb38";
// let walletAddress = "0xd43c21304aa7fbc50d2bb0fccc60fcfbd05cb1fd";       

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

contract.balanceOf('0xd43c21304aa7fbc50d2bb0fccc60fcfbd05cb1fd', (error, balance) => {
    // Get decimals
    contract.decimals((error, decimals) => {
        // calculate a balance
         ((balance.div(10 ** decimals)))
        
         
        // alert(rcr)
        
        // console.log(firstShow);
        // document.getElementById("rcr_balance").innerHTML = balance.toString()
    });
});





    

    switch (action.type) {

        case actionTypes.UPDATE_WALLET:
            console.log(action);
            
            if (action.notify) {
                toast.success(`🦄 Connected to ${action.wallet.currentProvider.selectedAddress.substr(0,12)}...`, {
                    position: "top-right",
                });
            }

            return {
                ...state,
                balances: {
                    ...state.balances,
                    ...action.balances
                },
                prices: {
                    ...state.prices
                },
                CONTRACTS: {
                    ...state.CONTRACTS
                },
                address: action.address,
                web3instance: action.wallet
            }

        default: 
            return state;
    }
};

export default reducer;