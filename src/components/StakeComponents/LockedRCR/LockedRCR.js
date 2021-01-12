import React, { Component } from 'react';
import { connect } from 'react-redux';
import classes from './LockedRCR.module.css';

import ListItem from './ListItem/ListItem';

import HODLER_ABI from '../../../web3/abi/hodler';
import Cookies from 'js-cookie';
import Web3 from 'web3';

class LockedRCR extends Component {

    constructor(props){
        super(props)
        this.setState({
            lockups: [],
            address: '',
        })
    }

    componentDidMount() {
        // alert('22')
        if (this.props.web3.eth !== undefined) {
            // this.fetchLockUps(this.props.web3, this.state?.address)
        }

        if (Cookies.get('is_login')==='1') {
            setTimeout(() => {
                var address = window.web3.currentProvider.selectedAddress;
                this.setState({
                    lockups: [],
                    address: address,
                })
                // const web3 = new Web3(window.web3.currentProvider);
                // this.kamlesh(web3, this.state?.address)
            }, 350);
        }
    
        
    // window.ethereum.on('accountsChanged', function(accounts) {
    //     if (accounts[0] === undefined) {
    //         Cookies.set('is_login', '0');

    //     }
    }

    kamlesh(web3,address)
    {
        let hodlerInstance = new web3.eth.Contract(HODLER_ABI, address);
        console.log(hodlerInstance)
    }
    componentDidUpdate(prevProps) {
        if (this.state?.address !== prevProps.address) {
            // this.fetchLockUps(this.props.web3, this.state?.address)
        }
    }

    fetchLockUps = async (web3, address) => {
        let hodlerInstance = new web3.eth.Contract(HODLER_ABI, this.props.CONTRACTS.HODLER);
        let lockups = [];

        let id = 1;
        let item = await hodlerInstance.methods.getItem(address, id).call();

        while (parseInt(item['0']) === id) {
            id += 1;
            lockups.push(item);
            item = await hodlerInstance.methods.getItem(address, id).call()
        }

        this.setState({ lockups: lockups });
    }

    render() {

        return (
            <div className={classes.lockedrcr}>
                <div className={classes.listheader}>
                    <span className={classes.headerspan}>LOCKED RCR</span>
                </div>

                <div className={classes.listbody}>
                    <div className={classes.tableheader}>
                        <div>RCR</div>
                        {/* <div>Reward(CLERK)</div>
                    <div>Locking Period</div> */}
                        <div>Time Left</div>
                        <div></div>
                    </div>

                    <div className={classes.listcontent}>
                        {this.state?.address ? this.state.lockups[0] !== undefined ?
                            this.state.lockups.map(lockup => (
                                <ListItem
                                    key={lockup[0]}
                                    amount={lockup[2] / 1000000000000000000}
                                    releasetime={lockup[3]}
                                    fulfilled={lockup[4]} />
                            )) : <div className={classes.not_connected}>You don't have any RCR locked up.</div>
                            : <div className={classes.not_connected}>Metamask not connected.</div>
                        }
                    </div>

                </div>
            </div>
        );
    }
};

const mapStateToProps = state => {
    return {
        balances: state.balances,
        web3: state.web3instance,
        address: state?.address,
        CONTRACTS: state.CONTRACTS
    };
}

// const mapDispatchToProps = dispatch => {
//     return {

//     }
// }

export default connect(mapStateToProps, null)(LockedRCR);