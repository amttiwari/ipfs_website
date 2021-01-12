import React, { Component } from 'react';
import { Button, Callout, Intent } from '@blueprintjs/core';
import axios from 'axios';
import ExchangeBlock from '../../components/Exchange/ExchangeBlock';
import PriceChart from './ExchangeBlocks/PriceChart';
import CreateOrder from './ExchangeBlocks/CreateOrder';
import MyOrders from './ExchangeBlocks/MyOrders';
import OrderBook from './ExchangeBlocks/OrderBook';
import tokenOptions from './ExchangeBlocks/tokens.json';
import classes from './Exchange.module.css';

import RCR_ABI from '../../web3/abi/rcr';
import CLERK_ABI from '../../web3/abi/clerk';
import Web3 from 'web3';

const CONTRACT = {
    RECURLY: '0xf5323c19FB271a489000B739B09554C144bA840d',
    CLERK: '0x432A92CCcB253E890b6765e5d368733A27A5df49',
    HODLER: '0x2f444075CE7f45CEc25CdBdC4EC3a421945F09EA'
};
const renderTokenData =async()=> {
  alert('1')
}
const ethEnabled = () => {
  return typeof window.ethereum !== 'undefined'
};

const getTokenPrice = async () => {
  const response = await axios.get(
    'https://api.coingecko.com/api/v3/coins/markets?vs_currency=usd&ids=bitcoin%2C%20ethereum&order=market_cap_desc&per_page=2&page=1&sparkline=false&price_change_percentage=24h'
  );

  const tokens = {
    bitcoin: response?.data[0]?.current_price,
    ethereum: response?.data[1]?.current_price
  };

  const price_change = {
    bitcoin: Math.round(response?.data[0]?.price_change_percentage_24h * 10) / 10,
    ethereum: Math.round(response?.data[1]?.price_change_percentage_24h * 10)  / 10
  };

  return { tokens, price_change };
};

const getGasValue = async () => {
  const response = await axios.get('https://ethgasstation.info/json/ethgasAPI.json');
  const slow = response?.data?.safeLow || 0;
  const average = response?.data?.average || 0;
  const fast = response?.data?.fast || 0;

  return {
    gas: {
      slow: slow > 0 ? slow / 10 : 0,
      normal: average > 0 ? average / 10 : 0,
      fast: fast > 0 ? fast / 10 : 0
    }
  };
};

class Exchange extends Component {
  constructor(props) {
    super(props);
    this.state = {
      isEthEnabled: null,
      isMetaMaskConnected: false,
      token: tokenOptions[0]?.value,
      tokens: {
        bitcoin: null,
        ethereum: null
      },
      price_change: {
        bitcoin: null,
        ethereum: null
      },
      gas: {
        slow: null,
        normal: null,
        fast: null
      },
      createOrderActiveTab: 'buy',
      orderBookActiveTab: 'sell',
      createOrderData: {
        amount: 0,
        price: 0
      }
    };
  }

  updateTokenPrice = async () => {
    this.setState({ ...await getTokenPrice() });
  
  }

  updateGasValue = async () => {
    this.setState({ ...await getGasValue() });
  };

  componentDidMount() {
    this.updateTokenPrice();
    this.updateGasValue();
    this.setState({
      isEthEnabled: ethEnabled()
    });
  }

  changeTab = (target, idTab) => {
    
    const newState = {
      createOrderActiveTab: 'buy',
      orderBookActiveTab: 'sell',
      createOrderData: {
        amount: 0,
        price: 0
      }
    };

    if (target === 'CreateOrder') {
      newState.createOrderActiveTab = idTab;
      newState.orderBookActiveTab = idTab === 'buy' ? 'sell' : 'buy';
    } else if (target === 'OrderBook') {
      newState.createOrderActiveTab = idTab === 'buy' ? 'sell' : 'buy';
      newState.orderBookActiveTab = idTab;
    }

    this.setState({
      ...newState
    });
  };

  changeCreateOrderData = (prop, value) => {
    this.setState({
      createOrderData: {
        ...this.state.createOrderData,
        [prop]: value
      }
    });
  };

  render() {
    return (
      <div className={classes.exchangeContainer}>
        {this.state.isEthEnabled === false && (
          <Callout intent={Intent.WARNING} className={classes.fullRow}>
            MetaMask is not available
          </Callout>
        )}
        {this.state.isEthEnabled && this.state.isMetaMaskConnected === false && (
          <Callout intent={Intent.PRIMARY} className={classes.fullRow}>
            Connect to MetaMask
            <Button text="Request Access" intent={Intent.PRIMARY} small onClick={async () => {
              const accounts = await window.ethereum.request({ method: 'eth_requestAccounts' });
              console.log('accounts');
              console.log(accounts);

              window.web3.eth.getTransactionCount(accounts[0], (err, transactionCount) => {
                console.log('getTransactionCount');
                console.log(transactionCount);
                for (let i = 0; i < transactionCount; i += 1) {
                  window.web3.eth.getBlock(transactionCount - i, true, (err, block) => {
                    console.log('getBlock');
                    console.log(block);
                    console.log(block.hash);
                    window.web3.eth.getTransactionFromBlock(block.hash, (err, transaction) => {
                      console.log('getTransactionFromBlock');
                      console.log(transaction);
                      console.log(err);
                    });
                  });
                }
              });
            }} />
          </Callout>
        )}
        <ExchangeBlock className={classes.priceChart}>
          <PriceChart
            token={this.state.token}
            setToken={(token) => this.setState({ token })}
            currentPrice={this.state.tokens.ethereum}
            priceChange={this.state.price_change.ethereum}
            gas={this.state.gas}
          />
        </ExchangeBlock>

        <ExchangeBlock className={classes.createOrder}>
          <CreateOrder
            activeTab={this.state.createOrderActiveTab}
            changeTab={this.changeTab}
            data={this.state.createOrderData}
            changeData={this.changeCreateOrderData}
          />
        </ExchangeBlock>

        <ExchangeBlock className={classes.myOrders}>
          <MyOrders />
        </ExchangeBlock>

        <ExchangeBlock className={classes.orderBook}>
          <OrderBook
            activeTab={this.state.orderBookActiveTab}
            changeTab={this.changeTab}
            changeData={(createOrderData) => this.setState({ createOrderData })}
          />
        </ExchangeBlock>
      </div>
    );
  }
}

export default Exchange;
