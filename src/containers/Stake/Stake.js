import React, { Component } from 'react';
import { connect } from 'react-redux';
import classes from './Stake.module.css';

import Balances from '../../components/StakeComponents/Balances/Balances';
import LockRCR from '../../components/StakeComponents/LockRCR/LockRCR';
import LockedRCR from '../../components/StakeComponents/LockedRCR/LockedRCR';

import * as web3Actions from '../../store/actions/index';

class Stake extends Component {

    render() {

        return (
            <div className={`${classes.stakebody} flex-row-center`}>

                <div className={`${classes.leftblock} ${classes.block} flex-column-center`}>
                    <Balances balances={this.props.balances} />
                    <LockRCR />
                </div>
 
                <div className={`${classes.rightblock} ${classes.block}`}>
                    <LockedRCR address={this.props.address}/>
                </div>
            </div>
        );
    }
};


const mapStateToProps = state => {
    return {
        address: state.address,
        balances: state.balances
    };
}

const mapDispatchToProps = dispatch => {
    return {
        // connectToWallet: () => dispatch(web3Actions.connectToWallet())
    }
}

export default connect(mapStateToProps, mapDispatchToProps)(Stake);