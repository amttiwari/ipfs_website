import React, { useEffect, useRef, useState } from 'react';
import { useSelector, useDispatch } from 'react-redux';

import Jazzicon from '@metamask/jazzicon';

import classes from './Header.module.css';
import Cookies from 'js-cookie';
import * as web3Actions from '../../../store/actions/index';
import * as web3Logout from '../../../store/actions/logout';
import Logo from '../../Logo/Logo';
import Button from '../../UI/Button/Button';
import Modal from '../../UI/Modal/Modal';

import RCRLogo from '../../../assets/images/rc.svg';
import CLERKLogo from '../../../assets/images/clerk.svg';
import ETHLogo from '../../../assets/images/eth.svg';
import $ from "jquery";
import Web3 from 'web3';
import { STYLE } from '@blueprintjs/icons/lib/esm/generated/iconContents';
// import Web3Modal from "web3modal";

export const TokenPrices = (token) => {
    const price = useSelector(state => state.prices[token])
    return <div className={classes.price}>Price: ${price}</div>
}




async function modal_open() {
    const modalShow = '';


    const accounts = await window.ethereum.request({ method: 'eth_requestAccounts' });
    if (accounts[0]) {
        var walletAddress = accounts[0]
        var address = walletAddress
        setTimeout(() => {
            document.getElementById("addressCopy").innerHTML = address
        }, 1000);


        window.web3.eth.getTransactionCount(accounts[0], (err, transactionCount) => {
            for (let i = 0; i < transactionCount; i += 1) {
                window.web3.eth.getBlock(transactionCount - i, true, (err, block) => {
                    window.web3.eth.getTransactionFromBlock(block.hash, (err, transaction) => {
                    });
                });
            }
        });
    } else {
    }

    //=================================  Show ETH Balance   =============================
    window.web3.eth.getBalance(address, (err, ETHBalance) => {
        ETHBalance = window.web3.fromWei(ETHBalance) + " ETH".split(' ')[0]
        setTimeout(() => {
            document.getElementById("eth_balance").innerHTML = ETHBalance
        }, 1000)

    });

    //===================================  Show Clerk Balance ===========================

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
                document.getElementById("clerk_balance").innerHTML = balance.toString()
            }, 1000)
        });
    });

    //===================================  Show RCR Balance ========================


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
    // Get ERC20 Token contract instance
    let contract = window.web3.eth.contract(minABI).at(tokenAddress);
    // Call balanceOf function
    contract.balanceOf(address, (error, balance) => {
        // Get decimals
        contract.decimals((error, decimals) => {
            // calculate a balance
            balance = balance.div(10 ** decimals);
            setTimeout(() => {

            document.getElementById("rcr_balance").innerHTML = balance.toString()
            },1000)
        });
    });
}

// ====================================MetaMask Link=================
async function metamask_link() {
    const accounts = await window.ethereum.request({ method: 'eth_requestAccounts' });
    if (accounts[0]) {

        var walletAddress = accounts[0]
        const address = walletAddress
        // document.getElementById("addressCopy").innerHTML = walletAddress
        var res1 = address.slice(-4);
        document.getElementById("lblData").innerHTML = res1;

        var res = address.substr(0, 4);
        document.getElementById("lblData").innerHTML = res;


        // address = res

        $("#lblData").html(res + '....' + res1);
        $('#prof_img').show();


        window.web3.eth.getTransactionCount(accounts[0], (err, transactionCount) => {
            for (let i = 0; i < transactionCount; i += 1) {
                window.web3.eth.getBlock(transactionCount - i, true, (err, block) => {
                    window.web3.eth.getTransactionFromBlock(block.hash, (err, transaction) => {
                    });
                });
            }
        });

        $('#addMain').show();
        $('#cntMain').hide();
        $('#logoutBtn').show();
    } else {
        $("#lblData").html('');
        $('#addMain').hide();
        $('#cntMain').show();
        $('#logoutBtn').hide();
    }
}

const Header = (props) => {
    // const address1 ='';
    setInterval(async () => {
        // const address1 = await window.ethereum.request({ method: 'eth_requestAccounts' });
        // alert(address1)
    }, 2000);
    // var address1 = '0xd43c21304aa7fbc50d2bb0fccc60fcfbd05cb1fd'

    const dispatch = useDispatch()
    const [showAddress, setShowAddress] = useState(false);
    const modalShow = useSelector(state => 'none');
    const [isthemeColor, setisthemeColor] = useState("");

    const address = useSelector(state => '0xd43c21304aa7fbc50d2bb0fccc60fcfbd05cb1fd');
    const identicon = useRef(null);
    const copyText = useRef(null);

    useEffect(() => {
        $('#prof_img').hide();
        $('#logoutBtn').hide()
        if (Cookies.get('is_login') === '1') {
            metamask_link()
        }
        if (address && identicon.current) {
            identicon.current.innerHTML = ''
            identicon.current.appendChild(Jazzicon(18, parseInt(address.slice(2, 10), 16)))
        }

        if (Cookies.get('is_theme') === 'light') {
            // alert('light')
            $('body').removeClass('darkTheme')

            setisthemeColor('light')
        }
        else if (Cookies.get('is_theme') === 'dark') {
            // alert('dark')
            setisthemeColor('dark')
            $('body').addClass('darkTheme')
            // <link rel="manifest" href="%PUBLIC_URL%/manifest.json" />
            // setTimeout(() => {
                
            //     import "../../../dark.css"
            // }, 1000);


            // import Modal from '../../UI/Modal/Modal';
        }
    }, [address])


    function formatAddress(address) {
        let first6 = address.substring(0, 6);
        let last4 = address.substring(address.length - 4, address.length);

        return `${first6}...${last4}`;
    }

    function copyAddress() {
        navigator.clipboard.writeText(address);
        copyText.current.innerHTML = '<i class="far fa-thumbs-up"></i>Copied';

        setTimeout(() => {
            copyText.current.innerHTML = '<i class="far fa-copy"></i>Copy Address';
        }, 500);
    }

    async function onDisconnect() {
        Cookies.set('is_login', '0');
        window.location.reload();
    }
    async function onConnect() {
        const accounts = await window.ethereum.request({ method: 'eth_requestAccounts' });
        if (accounts[0]) {
            Cookies.set('is_login', '1')
            window.location.reload();
        }
    }
    window.ethereum.on('accountsChanged', function (accounts) {
        if (accounts[0] === undefined) {
            Cookies.set('is_login', '0');
        
        }
        
        if((Cookies.get('change_metamask')!==accounts[0] || Cookies.get('change_metamask')=== undefined) && accounts[0] !== undefined )
        {
            
            Cookies.set('change_metamask','1');
            window.location.reload();
        }
        Cookies.set('change_metamask',accounts[0]);
    });


    const themeSelect = (value) => {
        Cookies.set('is_theme', value);
        setisthemeColor(value)
        // useEffect()
        window.location.reload();

    }


    return (
        <header className={classes.Header}>
            <div className={classes.HeaderContent}>

                <Button btnType='Menu'
                    clicked={props.drawerToggleClicked}> <i className="fas fa-bars" style={{ color: 'black' }}></i> </Button>
                <Logo />

                <div className={classes.rightblock}>


                    <div className={classes.walletinfo}>
                        <div id="prof_img">{address != '' ?
                            <>
                                <div style={{ height: '1.1em' }} ref={identicon}>


                                </div>

                            </>
                            : ''}</div>

                        <div id="addMain" className={classes.address} onClick={() => modal_open()}>
                            <span id="lblData" onClick={() => setShowAddress(true)}></span> </div>
                        <div id="cntMain" className={classes.connect_meta}
                            onClick={() => dispatch(onConnect)} >
                            <i className="fas fa-wallet"></i>Connect wallet
                            </div>
                        {/* <div className={classes.pending}>0 pending tx</div> */}
                    </div>
                    <button id="logoutBtn" onClick={onDisconnect} className={classes.connect_meta} >Logout</button>
                    {/* <select className="form-control" style={{marginLeft:'15px'}} value={isthemeColor} onChange={e => themeSelect(e.target.value)}>
                        <option value="light">Light</option>
                        <option value="dark">Dark</option>

                    </select> */}


                    {/* <div className={classes.marketinfo}>
                        <div className={classes.marketcap}>Mcap: $700,000</div>
                        {TokenPrices('rcr')}
                    </div> */}

                </div>

            </div>


            <Modal show={showAddress && address.length > 2}
                handleClose={() => setShowAddress(false)}
                handleShow={() => setShowAddress(true)}
                title='Account Overview' style={{ display: modalShow }}>

                <div>

                    <div>
                        <div style={{ fontSize: '1.3em' }}>Address:
                        {/* {formatAddress(address)} */}
                            <span id="addressCopy"></span>
                        </div>

                        {/* <span className={classes.modaladdressaction}>
                            <a href={`https://etherscan.io/address/${address}`}
                                target='_blank'
                                rel='noopener noreferrer'>
                                <i className="fas fa-external-link-alt"></i>View on EtherScan</a></span>

                        <span className={classes.modaladdressaction}
                            ref={copyText}
                            onClick={() => copyAddress()} >
                            <i className="far fa-copy"></i>Copy Address</span> */}

                        <span className={classes.modaladdressaction} onClick={() => onDisconnect()}>
                            <i class="fas fa-sign-out-alt"></i>Disconnect
                        </span>
                    </div>

                    <div className={classes.modalsection}>
                        <h2>Balances:</h2>
                        <div className={classes.modaltoken}>RCR: <span id="rcr_balance"></span><img src={RCRLogo} alt='rcr logo' style={{ width: '1.1em', marginLeft: '0.25em' }} /></div>
                        <div className={classes.modaltoken}>CLERK: <span id="clerk_balance"></span> <img src={CLERKLogo} alt='clerk logo' style={{ width: '1.1em', marginLeft: '0.25em' }} /></div>
                        <div className={classes.modaltoken}>ETHER: <span id="eth_balance"></span>  <img src={ETHLogo} alt='eth logo' style={{ width: '1.1em', marginLeft: '0.25em' }} /></div>
                    </div>

                    <hr />

                    {/* <div className={classes.pendingtx}>
                        Your pending transactions will appear here...
            </div> */}
                </div>
            </Modal>

        </header>


    )
};

export default Header;