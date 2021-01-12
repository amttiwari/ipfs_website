import React, { Component } from 'react';
import { connect } from 'react-redux';
import { toast } from 'react-toastify';
import Cookies from 'js-cookie';
import classes from './LockRCR.module.css';

import Wrapper from './Wrapper/Wrapper';
import InputField from './InputField/InputField';
import MonthDiv from './MonthDiv/MonthDiv';
import Button from '../../UI/Button/Button';

// import * as web3Actions from '../../../store/actions/index';
import HODLER_ABI from '../../../web3/abi/hodler';


class LockRCR extends Component {

    constructor(props) {
        super(props);
        this.rcrInput = React.createRef();
        this.clerkInput = React.createRef();

        this.state = {
            hover_rcr: false,
            hover_clerk: false,
            threem_selected: true,
            sixm_selected: false,
            twelvem_selected: false,
            months: 3,
            rate: 1,
        }
    }

    maxValueHandler = () => {
        this.rcrInput.current.value = this.props.balances.rcr;
        this.clerkInput.current.value = (this.state.rate / 100) * this.props.balances.rcr;
    } 

    inputChangeHandler = (e) => {
        let rcr_max = this.props.balances.rcr;
        let clerk_max = (this.state.rate / 100) * this.props.balances.rcr;

        if(e.target.id.includes('RCR')) 
        return this.rcrInput.current.value > rcr_max ? e.target.value = rcr_max: this.clerkInput.current.value = (this.state.rate / 100) * e.target.value;

        if(e.target.id.includes('CLERK'))
        return this.clerkInput.current.value > clerk_max ? e.target.value = clerk_max : this.rcrInput.current.value = this.clerkInput.current.value / (this.state.rate / 100);
    }

    monthSelectorHelper = (rate, e) => {
        this.clerkInput.current.value = (rate/100) * this.rcrInput.current.value;
        this.setState({rate: rate, threem_selected: false, sixm_selected: false, twelvem_selected: false});
    }

    monthSelectorHandler = (e) => {
        switch(e.target.innerText) {
            case '3 MONTHS':
                this.monthSelectorHelper(1);
                this.setState({threem_selected: true, months: 3})
                break;

            case '6 MONTHS':
                this.monthSelectorHelper(2);
                this.setState({sixm_selected: true, months: 6})
                break;
            
            case '12 MONTHS':
                this.monthSelectorHelper(4);
                this.setState({twelvem_selected: true, months: 12})
                break;

            default:
                return null;
        }
    }



    hasError = async (web3, contract, address, value) => {

        const data = contract.methods.hodl(55, 100000000, 3).encodeABI();
        const gas = {
            "from": address,
            "to": this.props.CONTRACTS.HODLER,
            "data": data
        }                        
        const gasAmount = await web3.eth.estimateGas(gas,function (err,res) {
             return res;
        })

        const gasPrice =  await web3.eth.getGasPrice();
        let totalPrice = gasAmount * gasPrice;
        let totalPriceEth = await web3.utils.fromWei(totalPrice.toString(), 'ether')

        const suficit = this.props.balances.ether - totalPriceEth;

        if(isNaN(parseInt(value)) || parseInt(value) === 0) { 
            toast.error(`😑 Fill in all the required fields first.`, {
                position: "top-right"
            });

            this.rcrInput.current.focus();

            return true;
        }

        if(this.props.balances.rcr < value) {
            toast.error(`😟 You don't have that much RCR available on this account.`, {
                position: "top-right"
            });

            return true;
        }

        if (suficit < 0) {
            toast.error(`😟 Insufficient ether balance. You won't be able to pay the fees.`, {
                position: "top-right"
            });

            return true;
        }

        return false;
    }

    

    Stake = async (web3, address, value, months) => {

        if (Cookies.get('is_login') !='1') {
            toast.dismiss();
            toast.warning(`😑 Please connect the wallet first.`, {
                position: "top-right"
            });
            return;
        }else{
            toast.dismiss();
            toast.success(`😑 work in progress....`, {
                position: "top-right"
            });
        }
        return;
        const hodlerInstance = new web3.eth.Contract(HODLER_ABI, this.props.CONTRACTS.HODLER);
        const hasError = await this.hasError(web3, hodlerInstance, address, value);
        if(hasError) {
            return;
        }

        let valuets = value.toString();
        const value_to_wei = web3.utils.toWei(valuets, 'ether');

        let id = 1;
        let item = await hodlerInstance.methods.getItem(address, id).call();
    
        while (parseInt(item['0']) === id) {
            id += 1;
            item = await hodlerInstance.methods.getItem(address, id).call()
        }

        await hodlerInstance.methods.hodl(id, value_to_wei, months).send({from: address})
        .on('transactionHash', function(hash) {
            const link = `etherscan.io/tx/${hash}`
            toast(`👍 TX Pending ${<a href={link} target='_blank' rel='noopener noreferrer'>View on Etherscan</a>}`, {
                position: "top-right"
            });
        }).on('confirmation', function(confirmationNumber, receipt) {
            toast.success(`👍 TX Confirmed ${confirmationNumber.substr(0,12)}...`, {
                position: "top-right",
            });
        }).on('receipt', function(receipt) {
            console.log(receipt);
        }).on('error', console.error);

}



    render() {
        
        return (
            <Wrapper>
                <div onMouseOver={() => this.setState({hover_rcr: true })}
                     onMouseLeave={() => this.setState({hover_rcr: false})}>
                    <InputField label='Amount'> 
                        <input type='number' ref={this.rcrInput} min='0' max={this.props.balances.rcr} id='RCR_input' autoComplete="off"
                               placeholder='0' className={classes.lockinput} onChange={(e) => this.inputChangeHandler(e)}/>
                        <div className={classes.innerlabel}>
                            <span onClick={this.maxValueHandler}>{this.state.hover_rcr ? 'MAX' : 'RCR'}</span>
                        </div>
                    </InputField>
                </div>

                <div onMouseOver={() => this.setState({hover_clerk: true })}
                     onMouseLeave={() => this.setState({hover_clerk: false})}>
                    <InputField label='Reward'>
                        <input type='number' ref={this.clerkInput} min='0' max={(this.state.rate / 100) * this.props.balances.rcr} id='CLERK_input' autoComplete="off"
                               placeholder='0'  className={classes.lockinput} onChange={(e) => this.inputChangeHandler(e)} />
                        <div className={classes.innerlabel}>
                            <span onClick={this.maxValueHandler}>{this.state.hover_clerk? 'MAX' : 'CLERK'}</span>
                        </div>
                    </InputField>
                </div>

                <div className={`${classes.monthsdiv} flex-row-center`}>
                    <MonthDiv duration='3 MONTHS' rate='1%' onClick={(e) => this.monthSelectorHandler(e)} selected={this.state.threem_selected ? 'selected' : ''}/>
                    <MonthDiv duration='6 MONTHS' rate='2%' onClick={(e) => this.monthSelectorHandler(e)} selected={this.state.sixm_selected ? 'selected' : ''}/>
                    <MonthDiv duration='12 MONTHS' rate='4%' onClick={(e) => this.monthSelectorHandler(e)} selected={this.state.twelvem_selected ? 'selected' : ''}/>
                </div>

                <Button btnType='Lock' clicked={() => this.Stake(window.web3, this.props.address, this.rcrInput.current.value, this.state.months)}>LOCK</Button>
            </Wrapper>
        );
    }
};

const mapStateToProps = state => {
    return {
        balances: state.balances,
        web3: state.web3instance,
        address: state.address,
        CONTRACTS: state.CONTRACTS
    };
}

const mapDispatchToProps = dispatch => {
    return {
        
    }
}


export default connect(mapStateToProps, mapDispatchToProps)(LockRCR);