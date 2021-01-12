import Web3 from 'web3';
import web3Modal from '../../web3/web3func';

import * as actionTypes from './actionTypes';

import Cookies from 'js-cookie';
import RCR_ABI from '../../web3/abi/rcr';
import CLERK_ABI from '../../web3/abi/clerk';

const CONTRACT = {
    RECURLY: '0xf5323c19FB271a489000B739B09554C144bA840d',
    CLERK: '0x432A92CCcB253E890b6765e5d368733A27A5df49',
    HODLER: '0x2f444075CE7f45CEc25CdBdC4EC3a421945F09EA'
};


export const updateWallet = (wallet, notify, balances) => {
    return {
        type: actionTypes.UPDATE_WALLET,
        wallet: wallet,
        notify: notify,
        balances: balances,

        address: wallet.currentProvider.selectedAddress,
    }
}


export const fetchBalances = async (web3, address) => {
    let rcrInst = new web3.eth.Contract(RCR_ABI, CONTRACT.RECURLY);
    let rcrbalance = await rcrInst.methods.balanceOf(address).call().then(function (bal) {
        return bal / 1000000000000000000;
    });

    let clerkInst = new web3.eth.Contract(CLERK_ABI, CONTRACT.CLERK);
    let clerkbalance = await clerkInst.methods.balanceOf(address).call().then(function (bal) {
        return bal / 1000000000000000000;
    });

    let ethInst = await web3.eth.getBalance(address, (err, balance) => {
        return balance;
    });
    let ethbalance = web3.utils.fromWei(ethInst, 'ether')

    let balances = {
        rcr: rcrbalance,
        clerk: clerkbalance,
        ether: ethbalance
    }

    return balances;
}

export const disconnectToWallet = () => {
    return async dispatch => {
        // await web3Modal.connect().then(async (provider) => {

        //     let web3 = new Web3(provider);
        //     console.log('PROVIDER');
        //     console.log(provider);
        //     let notify;

        //     if (web3Modal.providerController.cachedProvider === 'injected') {
        //         notify = false;
        //     } else {
        //         notify = true;
        //     }

        //     // let balances = await fetchBalances(web3, provider.selectedAddress);
        //     // dispatch(updateWallet(web3, notify, balances));

            
        //     // alert()
        // })
        const clear = await web3Modal.clearCachedProvider();
    }
}

export const connectToWallet123 = () => {
    return async dispatch => {
        await web3Modal.connect().then(async (provider) => {
            
            Cookies.set('is_login','1');
            let web3 = new Web3(provider);
            console.log('PROVIDER');
            console.log(provider);
            let notify;

            if (web3Modal.providerController.cachedProvider === 'injected') {
                notify = false;
            } else {
                notify = true;
            }

            let balances = await fetchBalances(web3, provider.selectedAddress);
            dispatch(updateWallet(web3, notify, balances));


            provider.on("accountsChanged", async (address) => {
                let balances = await fetchBalances(web3, address[0]);
                dispatch(updateWallet(web3, notify, balances));
            });
        })
    }
}


