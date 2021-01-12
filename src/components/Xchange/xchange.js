import React, { Component } from 'react';
import classes from '../../containers/Exchange/Exchange.module.css';
import { Button, Callout, Intent } from '@blueprintjs/core';
import axios from 'axios';
import tokenOptions from '../../containers/Exchange/ExchangeBlocks/tokens.json';
import TradingViewWidget, { Themes } from 'react-tradingview-widget';
import TradingViewChart from '../../components/Exchange/TradingViewChart';
import Cookies from 'js-cookie';
import { toast } from 'react-toastify';
import { createChart } from 'lightweight-charts';
import { DARK } from '@blueprintjs/core/lib/esm/common/classes';

// const mockChartData = [
//     { time: '2019-04-11', value: 80.01 },
//     { time: '2019-04-12', value: 96.63 },
//     { time: '2019-04-13', value: 76.64 },
//     { time: '2019-04-14', value: 81.89 },
//     { time: '2019-04-15', value: 74.43 },
//     { time: '2019-04-16', value: 80.01 },
//     { time: '2019-04-17', value: 96.63 },
//     { time: '2019-04-18', value: 76.64 },
//     { time: '2019-04-19', value: 81.89 },
//     { time: '2019-04-20', value: 74.43 }
// ];

// const mockChartData1 = [
//     { time: '2019-04-21', value: 99.01 },
//     { time: '2019-04-22', value: 56.63 },
//     { time: '2019-04-23', value: 44.64 },
//     { time: '2019-04-24', value: 21.89 },
//     { time: '2019-04-25', value: 74.43 },
//     { time: '2019-04-26', value: 99.01 },
//     { time: '2019-04-27', value: 56.63 },
//     { time: '2019-04-28', value: 44.64 },
//     { time: '2019-04-29', value: 21.89 },
//     { time: '2019-04-30', value: 74.43 }
// ];
const CONTRACT = {
    RECURLY: '0xf5323c19FB271a489000B739B09554C144bA840d',
    CLERK: '0x432A92CCcB253E890b6765e5d368733A27A5df49',
    HODLER: '0x2f444075CE7f45CEc25CdBdC4EC3a421945F09EA'
};
const renderTokenData = async () => {
    // alert('1')
}
const ethEnabled = () => {
    return typeof window.ethereum !== 'undefined'
};

const getTokenPrice = async () => {
    const response = await axios.get(
        'https://api.coingecko.com/v3/coins/markets?vs_currency=usd&ids=bitcoin%2C%20ethereum&order=market_cap_desc&per_page=2&page=1&sparkline=false&price_change_percentage=24h'
    );

    const tokens = {
        bitcoin: response?.data[0]?.current_price,
        ethereum: response?.data[1]?.current_price
    };

    const price_change = {
        bitcoin: Math.round(response?.data[0]?.price_change_percentage_24h * 10) / 10,
        ethereum: Math.round(response?.data[1]?.price_change_percentage_24h * 10) / 10
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

export default class Xchange extends Component {

    constructor(props) {
        super(props)
        this.submitFormBuyOrder = this.submitFormBuyOrder.bind(this)
        this.submitFormSellOrder = this.submitFormSellOrder.bind(this)
        this.defaultAddress = this.defaultAddress.bind(this)

        this.onChange = this.onChange.bind(this)
        this.state = {
            statsList: '',
            token_value: 0,
            eth_value: 0.00,
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
            },

            open_close_box: 0,
            clerk_Rcr: 'CLERK',
            buy_Sell_Order: 'BUY',
            my_orders: 'OPEN',
            graph_slow: 'SLOW',
            accounts: '',
            buyOrderListData: [],
            sellOrderListData: [],
            openOrderList: [],
            closeOrderList: [],
            ETHBalance: '',
            gaphData: [],
            ETHBalance1: '',
            set_interval: '10000',
            gasState: 'SLOW'
        }
    }


    componentDidMount() {
        this.setState({
            isEthEnabled: ethEnabled()
        });
        // toast.success(`Order created successfully!`, {
        //     position: "top-right",
        // });
        this.defaultAddress();

        setInterval(() => {
            this.buyOrderList()
            this.sellOrderList()
            this.graphDataClick()
            this.getStatsDetail()

        }, this.state.set_interval);

        setTimeout(() => {
            this.buyOrderList()
            this.sellOrderList()
            this.graphDataClick()
            this.getStatsDetail()
            this.getopenordersDetail()
            this.getCloseOrderDetail()
            this.getExchangeDetail()
        }, 2000);
        if (Cookies.get('is_login') === '1') {
            this.metamask_link();
        }

    }

    //======================================   grpah data  =========================================

    graphDataClick() {
        setTimeout(() => {

            axios.post(`/deficlerk/deficlerk/api/users/graph_data`, {
                "token": this.state.clerk_Rcr
            }).then((res) => {
                this.codeDataGraph = res.data.code
                if (this.codeDataGraph === true) {
                    this.setState({
                        mockChartData: res.data.response
                    })
                    console.log(this.state.mockChartData);

                }
                else {
                    this.failureMessage = res.data.response
                }

            }).catch((error) => {
            });
        }, 100);
    }




    defaultAddress() {
        this.setState({
            transfer_to_address: '0x1447DC3A0dE86bfa8F68b8b581ea7add79B5A7f3',
            receipent_id: ''
        })
    }


    onChange(e) {
        this.setState({
            [e.target.name]: e.target.value
        })
        if (e.target.name === 'clerk_eth_value' || e.target.name === 'rcr_eth_value') {
            this.defaultAddress();
            e.target.value = (e.target.value === '') ? 0 : e.target.value;
            if (this.state.clerk_Rcr === 'RCR') {
                this.state.eth_value = (parseFloat(e.target.value) * parseFloat(this.state.token_value)).toFixed(6)
            } else {
                this.state.eth_value = (parseFloat(e.target.value) * parseFloat(this.state.token_value)).toFixed(6)
            }
        }
        if (e.target.name === 'token_value') {
            this.defaultAddress();
            e.target.value = (e.target.value === '') ? 0 : e.target.value;
            if (this.state.clerk_Rcr === 'RCR') {
                this.state.eth_value = (parseFloat(e.target.value) * parseFloat(this.state.rcr_eth_value)).toFixed(6)
            } else {
                this.state.eth_value = (parseFloat(e.target.value) * parseFloat(this.state.clerk_eth_value)).toFixed(6)
            }

        }

        if (e.target.name === 'eth_value') {

            this.defaultAddress();
            e.target.value = (e.target.value === '') ? 0 : e.target.value;
            if (this.state.clerk_Rcr === 'RCR') {
                this.state.token_value = Math.floor(parseFloat(e.target.value) / parseFloat(this.state.rcr_eth_value))
            } else {
                this.state.token_value = Math.floor(parseFloat(e.target.value) / parseFloat(this.state.clerk_eth_value))
            }

        }
    }


    async submitFormBuyOrder(e) {
        e.preventDefault()
        var is_completed = '0'
        var completed_by = '0'
        if (this.state.receipent_id > 0) {
            completed_by = this.state.receipent_id
            is_completed = 1
        }

        // alert(bal);1

        if (this.state.clerk_Rcr === 'RCR') {
            var price = this.state.rcr_eth_value;
        } else {
            var price = this.state.clerk_eth_value;
        }
        if (this.state.token_value < 1) {
            toast.error(`😑 Fill in all the required fields first.`, {
                position: "top-right"
            });
            return;
        }
        if (this.state.accounts === '') {
            toast.error(`MetaMask connection required.`, {
                position: "top-right"
            });
            return;
        }
        // setTimeout(() => {
        //     alert(this.state.token_value)
        //     alert(this.ETHBalance)
        //     if (this.state.token_value > this.ETHBalance) {
        //         alert('123')
        //         toast.error(`Insufficient wallet balance`, {
        //             position: "top-right"
        //         });
        //         return;
        //     }
        // },300);

        // --------------------------------------------
        let rgb = parseFloat(this.state.eth_value) * 1000000000000000000;
        let hex = Number(rgb).toString(16);


        //============================ get balance of ether =======================
        setTimeout(() => {

            window.web3.eth.getBalance(this.state.accounts, (err, ETHBalance) => {

                var ETHBalance = window.web3.fromWei(ETHBalance) + " ETH".split(' ')[0]
                //  alert(ETHBalance);


                this.setState({
                    ETHBalance1: ETHBalance
                })
                //  this.ETHBalance = ETHBalance

            });
        }, 300)
        setTimeout(() => {
            console.log(this.state.eth_value);
            console.log(this.state.ETHBalance1);

            if (parseFloat(this.state.eth_value) > parseFloat(this.state.ETHBalance1)) {
                toast.error(`Insufficient Balance`, {
                    position: "top-right"
                });
                return;
            }
            else {
                ////==================================   /////////////////////////////////////
                //Sending Ethereum to an address
                window.ethereum.request({
                    method: 'eth_sendTransaction',
                    params: [
                        {
                            from: this.state.accounts,
                            to: this.state.transfer_to_address,
                            value: '0x' + hex,
                            // data:'0xd46e8dd67c5d32be8d46e8dd67c5d32be8058bb8eb970870f072445675058bb8eb970870f072445675',
                            // value: '0x000.2',
                            //   gasPrice: '0x09184e72a000',
                            // gas: '0x2710',
                        },
                    ],
                })
                    .then((txHash) =>
                        axios.post(`/deficlerk/deficlerk/api/users/buy_request`, {
                            "address": this.state.accounts,
                            "eth_value": this.state.eth_value,
                            "token_value": this.state.token_value,
                            "price": price,
                            "hash": txHash,
                            "token_name": this.state.clerk_Rcr,
                            "is_completed": is_completed,
                            "completed_by": completed_by
                        }).then((res) => {
                            this.codeData = res.data.code
                            if (this.codeData === true) {
                                this.setState({
                                    token_value: 0,
                                    eth_value: 0.00,
                                    rcr_eth_value: 0,
                                    clerk_eth_value: 0
                                });
                                // console.log(this.state.exchangeList);
                                this.getExchangeDetail()
                                this.getopenordersDetail()
                                this.getCloseOrderDetail()

                            }
                            else {
                                this.failureMessage = res.data.response
                            }
                            toast.success(`Order created successfully!`, {
                                position: "top-right",
                            });

                        }).catch((error) => {
                            toast.error(`Internal server error.`, {
                                position: "top-right"
                            });
                        })
                    )
                    .catch((error) =>
                        toast.error(error, {
                            position: "top-right"
                        })
                    );
            }
        }, 1000);





    }


    async submitFormSellOrder(e) {
        e.preventDefault()
        var is_completed = '0'
        var completed_by = '0'

        if (this.state.receipent_id > 0) {
            completed_by = this.state.receipent_id
            is_completed = 1
        }

        if (this.state.clerk_Rcr === 'RCR') {
            var price = this.state.rcr_eth_value;
        } else {
            var price = this.state.clerk_eth_value;
        }
        if (this.state.token_value < 1) {
            toast.error(`😑 Fill in all the required fields first.`, {
                position: "top-right"
            });
            return;
        }
        if (this.state.accounts === '') {
            toast.error(`MetaMask connection required.`, {
                position: "top-right"
            });
            return;
        }
        var amount = parseFloat(this.state.token_value) * 1000000000000000000;
        if (this.state.clerk_Rcr === 'RCR') {
            var contractAddress = '0x0248c6ea9d75d5b380df528e83a5b8bcb293cb38'
        } else {
            var contractAddress = '0x652e157c9195d809d06f793b03b4498b19073ae3'
        }

        let walletAddress = this.state.accounts;

        const web3 = window.web3;
        var abi = [{ "constant": true, "inputs": [], "name": "name", "outputs": [{ "name": "", "type": "bytes32" }], "payable": false, "type": "function" }, { "constant": false, "inputs": [], "name": "stop", "outputs": [], "payable": false, "type": "function" }, { "constant": false, "inputs": [{ "name": "guy", "type": "address" }, { "name": "wad", "type": "uint256" }], "name": "approve", "outputs": [{ "name": "", "type": "bool" }], "payable": false, "type": "function" }, { "constant": false, "inputs": [{ "name": "owner_", "type": "address" }], "name": "setOwner", "outputs": [], "payable": false, "type": "function" }, { "constant": true, "inputs": [], "name": "totalSupply", "outputs": [{ "name": "", "type": "uint256" }], "payable": false, "type": "function" }, { "constant": false, "inputs": [{ "name": "src", "type": "address" }, { "name": "dst", "type": "address" }, { "name": "wad", "type": "uint256" }], "name": "transferFrom", "outputs": [{ "name": "", "type": "bool" }], "payable": false, "type": "function" }, { "constant": true, "inputs": [], "name": "decimals", "outputs": [{ "name": "", "type": "uint256" }], "payable": false, "type": "function" }, { "constant": false, "inputs": [{ "name": "dst", "type": "address" }, { "name": "wad", "type": "uint128" }], "name": "push", "outputs": [{ "name": "", "type": "bool" }], "payable": false, "type": "function" }, { "constant": false, "inputs": [{ "name": "name_", "type": "bytes32" }], "name": "setName", "outputs": [], "payable": false, "type": "function" }, { "constant": false, "inputs": [{ "name": "wad", "type": "uint128" }], "name": "mint", "outputs": [], "payable": false, "type": "function" }, { "constant": true, "inputs": [{ "name": "src", "type": "address" }], "name": "balanceOf", "outputs": [{ "name": "", "type": "uint256" }], "payable": false, "type": "function" }, { "constant": true, "inputs": [], "name": "stopped", "outputs": [{ "name": "", "type": "bool" }], "payable": false, "type": "function" }, { "constant": false, "inputs": [{ "name": "authority_", "type": "address" }], "name": "setAuthority", "outputs": [], "payable": false, "type": "function" }, { "constant": false, "inputs": [{ "name": "src", "type": "address" }, { "name": "wad", "type": "uint128" }], "name": "pull", "outputs": [{ "name": "", "type": "bool" }], "payable": false, "type": "function" }, { "constant": true, "inputs": [], "name": "owner", "outputs": [{ "name": "", "type": "address" }], "payable": false, "type": "function" }, { "constant": false, "inputs": [{ "name": "wad", "type": "uint128" }], "name": "burn", "outputs": [], "payable": false, "type": "function" }, { "constant": true, "inputs": [], "name": "symbol", "outputs": [{ "name": "", "type": "bytes32" }], "payable": false, "type": "function" }, { "constant": false, "inputs": [{ "name": "dst", "type": "address" }, { "name": "wad", "type": "uint256" }], "name": "transfer", "outputs": [{ "name": "", "type": "bool" }], "payable": false, "type": "function" }, { "constant": false, "inputs": [], "name": "start", "outputs": [], "payable": false, "type": "function" }, { "constant": true, "inputs": [], "name": "authority", "outputs": [{ "name": "", "type": "address" }], "payable": false, "type": "function" }, { "constant": true, "inputs": [{ "name": "src", "type": "address" }, { "name": "guy", "type": "address" }], "name": "allowance", "outputs": [{ "name": "", "type": "uint256" }], "payable": false, "type": "function" }, { "inputs": [{ "name": "symbol_", "type": "bytes32" }], "payable": false, "type": "constructor" }, { "anonymous": true, "inputs": [{ "indexed": true, "name": "sig", "type": "bytes4" }, { "indexed": true, "name": "guy", "type": "address" }, { "indexed": true, "name": "foo", "type": "bytes32" }, { "indexed": true, "name": "bar", "type": "bytes32" }, { "indexed": false, "name": "wad", "type": "uint256" }, { "indexed": false, "name": "fax", "type": "bytes" }], "name": "LogNote", "type": "event" }, { "anonymous": false, "inputs": [{ "indexed": true, "name": "authority", "type": "address" }], "name": "LogSetAuthority", "type": "event" }, { "anonymous": false, "inputs": [{ "indexed": true, "name": "owner", "type": "address" }], "name": "LogSetOwner", "type": "event" }, { "anonymous": false, "inputs": [{ "indexed": true, "name": "from", "type": "address" }, { "indexed": true, "name": "to", "type": "address" }, { "indexed": false, "name": "value", "type": "uint256" }], "name": "Transfer", "type": "event" }, { "anonymous": false, "inputs": [{ "indexed": true, "name": "owner", "type": "address" }, { "indexed": true, "name": "spender", "type": "address" }, { "indexed": false, "name": "value", "type": "uint256" }], "name": "Approval", "type": "event" }]
        const contract = web3.eth.contract(abi).at(contractAddress);
        // Call balanceOf function
        setTimeout(() => {

            contract.balanceOf(walletAddress, (error, balance) => {
                // Get decimals
                contract.decimals((error, decimals) => {
                    // calculate a balance
                    balance = balance.div(10 ** decimals);
                    this.balanceToken = balance.toString()
                    console.log(this.balanceToken);

                });
            });
        }, 300);
        setTimeout(() => {
            // alert('aman')
            console.log(this.state.token_value);
            console.log(this.balanceToken);


            if (parseFloat(this.state.token_value) > parseFloat(this.balanceToken)) {
                toast.error(`Insufficient Balance`, {
                    position: "top-right"
                });
                return;
            }
            else {
                const rawTransaction = {
                    from: this.state.accounts,
                    to: contractAddress,
                    value: 0,
                    data: contract.transfer.getData(this.state.transfer_to_address, amount),
                    gas: 200000,
                    // chainId: 3,
                };

                web3.eth.sendTransaction(rawTransaction, (error, receipt) => {

                    if (receipt) {
                        axios.post(`/deficlerk/deficlerk/api/users/sell_request`, {
                            "address": this.state.accounts,
                            "eth_value": this.state.eth_value,
                            "token_value": this.state.token_value,
                            "price": price,
                            "hash": receipt,
                            "token_name": this.state.clerk_Rcr,
                            "is_completed": is_completed,
                            "completed_by": completed_by
                        }).then((res) => {
                            this.codeData = res.data.code
                            if (this.codeData === true) {
                                this.setState({
                                    token_value: 0,
                                    eth_value: 0.00,
                                    rcr_eth_value: 0,
                                    clerk_eth_value: 0
                                });
                                // console.log(this.state.exchangeList);
                                this.getExchangeDetail()
                                this.getopenordersDetail()
                                this.getCloseOrderDetail()

                            }
                            else {
                                this.failureMessage = res.data.response
                            }
                            toast.success(`Order created successfully!`, {
                                position: "top-right"
                            });

                        }).catch((error) => {
                            toast.error(`Internal server error.`, {
                                position: "top-right"
                            });
                        })
                    } else {
                        toast.error(error, {
                            position: "top-right"
                        });
                        return;
                    }

                });
            }

        }, 1000);

    }


    //================================================  Exchange Button click  ===============================
    exchange_btn(v) {
        var val = (v == 1) ? '0' : '1';
        this.setState({
            open_close_box: val,
            token_value: 0
        })
    }

    //===============================================  Select coin type  ===================================

    coinSelect(val) {

        this.setState({
            clerk_Rcr: val,
            open_close_box: 0
        })
        this.graphDataClick()
    }

    //==================================================  Toggle For Buy Orders  =======================

    buyOrder(val) {
        this.setState({
            buy_Sell_Order: val,
            token_value: 0
        })
    }

    //========================================  Toggle For My Orders  ========================

    MyOrders(val) {
        this.setState({
            my_orders: val
        })
    }

    //=====================================  Toggle for slow  ===================================

    graphSlow(val) {
        this.setState({
            graph_slow: val,
            gasState: val
        })
    }

    //=========================================   API of get Exhange Detail  ========================

    getExchangeDetail() {

        if (this.state.accounts[0] !== undefined) {
            axios.post(`/deficlerk/deficlerk/api/users/exchange_detail`, {
                "address": this.state.accounts
            }).then((res) => {
                this.codeData = res.data.code
                if (this.codeData === true) {
                    this.setState({
                        exchangeList: res.data,
                        clerk_eth_value: res.data.clerk_eth_value,
                        rcr_eth_value: res.data.rcr_eth_value,
                        set_interval: res.data.set_interval
                    });
                    // console.log(this.state.exchangeList);

                }
                else {
                    this.failureMessage = res.data.response
                }

            }).catch((error) => {
            });
        }
        else {
        }

    }


    //=========================================   API of get Stats Detail  ========================

    getStatsDetail() {

        if (this.state.accounts[0] !== undefined) {
            axios.post(`/deficlerk/deficlerk/api/users/statics`, { "address": this.state.accounts }).then((res) => {
                this.codeDataStats = res.data.code
                if (this.codeDataStats === true) {

                    // console.log(this.state.exchangeList);
                    this.setState({
                        statsList: res.data,
                        // closeOrderListOrder: 0
                    });
                    if (this.state.statsList.is_refresh === 1) {
                        this.getopenordersDetail()
                        this.getCloseOrderDetail()

                    }


                }
                else {
                    this.failureMessage = res.data.response
                }

            }).catch((error) => {
            });
        }
        else {
        }

    }

    //=========================================   API of My Open Orders  ========================

    getopenordersDetail() {
        if (this.state.accounts !== undefined) {
            axios.post(`/deficlerk/deficlerk/api/users/my_open_order`, {
                "address": this.state.accounts
            }).then((res) => {
                this.codeDataOpenOrder = res.data.code
                if (this.codeDataOpenOrder === true) {
                    this.setState({
                        openOrderList: res.data.recdata,
                    });
                    // console.log(this.state.openOrderList);

                }
                else {
                    this.setState({
                        openOrderList: []
                    });
                    this.failureMessage = res.data.response
                }

            }).catch((error) => {
            });
        }
        else {
        }

    }

    //=========================================   API of My Close Orders  ========================

    getCloseOrderDetail() {
        if (this.state.accounts !== undefined) {
            axios.post(`/deficlerk/deficlerk/api/users/my_close_order`, {
                "address": this.state.accounts
            }).then((res) => {
                this.codeDataCloseOrder = res.data.code
                if (this.codeDataCloseOrder === true) {
                    this.setState({
                        closeOrderList: res.data.recdata,
                        // closeOrderListOrder: 0
                    });
                    // console.log(this.state.closeOrderList);

                }
                else {
                    // alert('22')
                    this.setState({
                        closeOrderList: [],
                        // closeOrderListOrder: 1
                    });
                    this.failureMessage = res.data.response
                }

            }).catch((error) => {
            });
        }
        else {
        }

    }

    //=========================================   API of get ALL Buy order list  ========================

    buyOrderList() {
        axios.get(`/deficlerk/deficlerk/api/users/buy_order`).then((res) => {
            this.codeDataBuyOrederList = res.data.code
            if (this.codeDataBuyOrederList === true) {
                this.setState({
                    buyOrderListData: res.data.recdata,
                });
            }
            else {
                this.setState({
                    buyOrderListData: [],
                });
                this.failureMessage = res.data.response
            }

        }).catch((error) => {
        });
    }

    //=========================================   API of get ALL SEll order list  ========================

    sellOrderList() {
        axios.get(`/deficlerk/deficlerk/api/users/sell_order`).then((res) => {
            this.codeDataSellOrederList = res.data.code
            if (this.codeDataSellOrederList === true) {
                this.setState({
                    sellOrderListData: res.data.recdata,
                });
            }
            else {
                this.setState({
                    sellOrderListData: []
                });
                this.failureMessage = res.data.response
            }

        }).catch((error) => {
        });
    }
    // ====================================MetaMask Link=================
    async metamask_link() {
        const accounts = await window.ethereum.request({ method: 'eth_requestAccounts' });
        if (accounts[0]) {
            // console.log('accounts');
            // console.log(accounts);
            this.state.accounts = accounts[0]

            window.web3.eth.getTransactionCount(accounts[0], (err, transactionCount) => {
                // console.log('getTransactionCount');
                // console.log(transactionCount);
                for (let i = 0; i < transactionCount; i += 1) {
                    window.web3.eth.getBlock(transactionCount - i, true, (err, block) => {
                        // console.log('getBlock');
                        // console.log(block);
                        // console.log(block.hash);
                        window.web3.eth.getTransactionFromBlock(block.hash, (err, transaction) => {
                            // console.log('getTransactionFromBlock');
                            // console.log(transaction);
                            // console.log(err);
                        });
                    });
                }
            });
        } else {
            this.state.accounts = '';
        }
    }
    //  ===========================================MetaMask transaction=============================
    async sendEth(eth) {

        let rgb = parseFloat(eth) * 1000000000000000000;

        let hex = Number(rgb).toString(16);
        // console.log(hex);


        //Sending Ethereum to an address
        await window.ethereum.request({
            method: 'eth_sendTransaction',
            params: [
                {
                    from: this.state.accounts,
                    to: this.state.transfer_to_address,
                    value: '0x' + hex,
                    // value: '0x000.2',
                    //   gasPrice: '0x09184e72a000',
                    // gas: '0x2710',
                },
            ],
        })
            .then((txHash) => console.log(txHash))
            .catch((error) => console.error);
    }



    async send_token(contractAddress, _to, _from, value) {
        const web3 = window.web3;
        var v = value;

        var abi = [{ "constant": true, "inputs": [], "name": "name", "outputs": [{ "name": "", "type": "bytes32" }], "payable": false, "type": "function" }, { "constant": false, "inputs": [], "name": "stop", "outputs": [], "payable": false, "type": "function" }, { "constant": false, "inputs": [{ "name": "guy", "type": "address" }, { "name": "wad", "type": "uint256" }], "name": "approve", "outputs": [{ "name": "", "type": "bool" }], "payable": false, "type": "function" }, { "constant": false, "inputs": [{ "name": "owner_", "type": "address" }], "name": "setOwner", "outputs": [], "payable": false, "type": "function" }, { "constant": true, "inputs": [], "name": "totalSupply", "outputs": [{ "name": "", "type": "uint256" }], "payable": false, "type": "function" }, { "constant": false, "inputs": [{ "name": "src", "type": "address" }, { "name": "dst", "type": "address" }, { "name": "wad", "type": "uint256" }], "name": "transferFrom", "outputs": [{ "name": "", "type": "bool" }], "payable": false, "type": "function" }, { "constant": true, "inputs": [], "name": "decimals", "outputs": [{ "name": "", "type": "uint256" }], "payable": false, "type": "function" }, { "constant": false, "inputs": [{ "name": "dst", "type": "address" }, { "name": "wad", "type": "uint128" }], "name": "push", "outputs": [{ "name": "", "type": "bool" }], "payable": false, "type": "function" }, { "constant": false, "inputs": [{ "name": "name_", "type": "bytes32" }], "name": "setName", "outputs": [], "payable": false, "type": "function" }, { "constant": false, "inputs": [{ "name": "wad", "type": "uint128" }], "name": "mint", "outputs": [], "payable": false, "type": "function" }, { "constant": true, "inputs": [{ "name": "src", "type": "address" }], "name": "balanceOf", "outputs": [{ "name": "", "type": "uint256" }], "payable": false, "type": "function" }, { "constant": true, "inputs": [], "name": "stopped", "outputs": [{ "name": "", "type": "bool" }], "payable": false, "type": "function" }, { "constant": false, "inputs": [{ "name": "authority_", "type": "address" }], "name": "setAuthority", "outputs": [], "payable": false, "type": "function" }, { "constant": false, "inputs": [{ "name": "src", "type": "address" }, { "name": "wad", "type": "uint128" }], "name": "pull", "outputs": [{ "name": "", "type": "bool" }], "payable": false, "type": "function" }, { "constant": true, "inputs": [], "name": "owner", "outputs": [{ "name": "", "type": "address" }], "payable": false, "type": "function" }, { "constant": false, "inputs": [{ "name": "wad", "type": "uint128" }], "name": "burn", "outputs": [], "payable": false, "type": "function" }, { "constant": true, "inputs": [], "name": "symbol", "outputs": [{ "name": "", "type": "bytes32" }], "payable": false, "type": "function" }, { "constant": false, "inputs": [{ "name": "dst", "type": "address" }, { "name": "wad", "type": "uint256" }], "name": "transfer", "outputs": [{ "name": "", "type": "bool" }], "payable": false, "type": "function" }, { "constant": false, "inputs": [], "name": "start", "outputs": [], "payable": false, "type": "function" }, { "constant": true, "inputs": [], "name": "authority", "outputs": [{ "name": "", "type": "address" }], "payable": false, "type": "function" }, { "constant": true, "inputs": [{ "name": "src", "type": "address" }, { "name": "guy", "type": "address" }], "name": "allowance", "outputs": [{ "name": "", "type": "uint256" }], "payable": false, "type": "function" }, { "inputs": [{ "name": "symbol_", "type": "bytes32" }], "payable": false, "type": "constructor" }, { "anonymous": true, "inputs": [{ "indexed": true, "name": "sig", "type": "bytes4" }, { "indexed": true, "name": "guy", "type": "address" }, { "indexed": true, "name": "foo", "type": "bytes32" }, { "indexed": true, "name": "bar", "type": "bytes32" }, { "indexed": false, "name": "wad", "type": "uint256" }, { "indexed": false, "name": "fax", "type": "bytes" }], "name": "LogNote", "type": "event" }, { "anonymous": false, "inputs": [{ "indexed": true, "name": "authority", "type": "address" }], "name": "LogSetAuthority", "type": "event" }, { "anonymous": false, "inputs": [{ "indexed": true, "name": "owner", "type": "address" }], "name": "LogSetOwner", "type": "event" }, { "anonymous": false, "inputs": [{ "indexed": true, "name": "from", "type": "address" }, { "indexed": true, "name": "to", "type": "address" }, { "indexed": false, "name": "value", "type": "uint256" }], "name": "Transfer", "type": "event" }, { "anonymous": false, "inputs": [{ "indexed": true, "name": "owner", "type": "address" }, { "indexed": true, "name": "spender", "type": "address" }, { "indexed": false, "name": "value", "type": "uint256" }], "name": "Approval", "type": "event" }]
        const contract = web3.eth.contract(abi).at(contractAddress);

        const rawTransaction = {
            from: _from,
            to: contractAddress,
            value: 0,
            data: contract.transfer.getData(_to, '1000000000000000000'),
            gas: 200000,
            // chainId: 3,
        };

        web3.eth.sendTransaction(rawTransaction, (error, receipt) => {
            if (error) {
                // console.log('DEBUG - error in _sendToken ', error)
            }
            // console.log(receipt);
        });

    }
    // =================================================================

    sell_direct_order(item) {


        this.setState({
            token_value: item.amount,
            // transfer_to_address: item.wallet,
            eth_value: item.eth_value,
            receipent_id: item.id,
            clerk_eth_value: item.price,
            rcr_eth_value: item.price
        })

    }

    buy_direct_order(item) {

        this.setState({
            token_value: item.amount,
            // transfer_to_address: item.wallet,
            eth_value: item.eth_value,
            receipent_id: item.id,
            clerk_eth_value: item.price,
            rcr_eth_value: item.price
        })

    }


    //=================================  remove order  =====================================================

    removeOrder(item) {
        axios.post(`/deficlerk/deficlerk/api/users/cancel_order`, { 'order_id': item.id }).then((res) => {
            this.codeDataCancelOrder = res.data.code
            if (this.codeDataCancelOrder === true) {
                this.setState({
                    token_value: '0',
                    eth_value: '0',
                })
                toast.success(`Order deleted.`, {
                    position: "top-right"
                });
            }
            else {
                this.failureMessage = res.data.message
                toast.error(this.failureMessage, {
                    position: "top-right"
                });

            }
            this.getopenordersDetail()
            this.getCloseOrderDetail()
            this.getExchangeDetail()
        }).catch((error) => {
        });
    }
    // ====================================================
    render() {
        const codeDataBuyOrederList = this.codeDataBuyOrederList
        const codeDataSellOrederList = this.codeDataSellOrederList
        const codeDataOpenOrder = this.codeDataOpenOrder
        const codeDataCloseOrder = this.codeDataCloseOrder

        return (
            <>
                <div className="Layout_contentwrapper__O1c8R Layout_Open__3CoiA">
                    <div className={classes.exchangeContainer}>
                        {this.state.isEthEnabled === false && (
                            <Callout intent={Intent.WARNING} className={classes.fullRow}>
                                MetaMask is not available
          </Callout>
                        )}
                        {this.state.isEthEnabled && this.state.isMetaMaskConnected === false &&
                            (

                                (this.state.accounts === '') ?
                                    <Callout intent={Intent.PRIMARY} className={classes.fullRow}>
                                        Connect to MetaMask
                                {/* <button onClick={this.sendEthButton}>transaction</button> */}
                                        <Button text="Request Access" intent={Intent.PRIMARY} small onClick={async () => {
                                            const accounts = await window.ethereum.request({ method: 'eth_requestAccounts' });
                                            // console.log('accounts');
                                            // console.log(accounts);
                                            this.state.accounts = accounts[0]
                                            Cookies.set('is_login', '1');
                                            window.web3.eth.getTransactionCount(accounts[0], (err, transactionCount) => {
                                                // console.log('getTransactionCount');
                                                // console.log(transactionCount);
                                                for (let i = 0; i < transactionCount; i += 1) {
                                                    window.web3.eth.getBlock(transactionCount - i, true, (err, block) => {
                                                        // console.log('getBlock');
                                                        // console.log(block);
                                                        // console.log(block.hash);
                                                        window.web3.eth.getTransactionFromBlock(block.hash, (err, transaction) => {
                                                            // console.log('getTransactionFromBlock');
                                                            // console.log(transaction);
                                                            // console.log(err);
                                                        });
                                                    });
                                                }
                                            });
                                            window.location.reload()
                                        }} />
                                    </Callout>
                                    :
                                    <h6 className="bp3-callout bp3-intent-primary bp3-callout-icon Exchange_fullRow__2PTGt">Wallet address : {this.state.accounts}
                                    </h6>
                                // {/* <button onClick={this.send_token.bind(this, '0x652e157c9195d809d06f793b03b4498b19073ae3', '0x1447DC3A0dE86bfa8F68b8b581ea7add79B5A7f3', '0xd43c21304aa7fbc50d2bb0fccc60fcfbd05cb1fd', 0.001)}>asdf</button> */}

                            )}

                        <div className="bp3-card bp3-elevation-0 ExchangeBlock_exchangeBlock__2YV-i Exchange_priceChart__1phnh">
                            <div className="ExchangeBlocks_priceChartTopBar__1YSwc">
                                <span className="bp3-popover-wrapper ComboBox_comboBox__D2Ynv">
                                    <span className="bp3-popover-target bp3-popover-open">
                                        <div className="bp3-transition-container bp3-popover-enter-done" style={{ display: (this.state.open_close_box == 1) ? '' : 'none', position: 'absolute', willChange: 'transform', top: '-67px', left: '0px', transform: 'translate3d(296px, 245px, 0px)' }}>
                                            <div className="bp3-popover bp3-select-popover" style={{ transformOrigin: '75px top' }}>
                                                <div className="bp3-popover-arrow" style={{ left: '60px', top: '-11px' }}>
                                                    <svg viewBox="0 0 30 30" style={{ transform: 'rotate(90deg)' }}>
                                                        <path className="bp3-popover-arrow-border" d="M8.11 6.302c1.015-.936 1.887-2.922 1.887-4.297v26c0-1.378-.868-3.357-1.888-4.297L.925 17.09c-1.237-1.14-1.233-3.034 0-4.17L8.11 6.302z"></path>
                                                        <path className="bp3-popover-arrow-fill" d="M8.787 7.036c1.22-1.125 2.21-3.376 2.21-5.03V0v30-2.005c0-1.654-.983-3.9-2.21-5.03l-7.183-6.616c-.81-.746-.802-1.96 0-2.7l7.183-6.614z"></path>
                                                    </svg>
                                                </div>
                                                <div className="bp3-popover-content">
                                                    <div>
                                                        <ul className="bp3-menu">
                                                            <li className="">
                                                                <a className="bp3-menu-item bp3-popover-dismiss">
                                                                    <span icon="tick-circle" className="bp3-icon bp3-icon-tick-circle">
                                                                        <svg data-icon="tick-circle" width="16" height="16" viewBox="0 0 16 16">
                                                                            <desc>tick-circle</desc>
                                                                            {(this.state.clerk_Rcr == 'CLERK') ?
                                                                                <path d="M8 16c-4.42 0-8-3.58-8-8s3.58-8 8-8 8 3.58 8 8-3.58 8-8 8zm4-11c-.28 0-.53.11-.71.29L7 9.59l-2.29-2.3a1.003 1.003 0 00-1.42 1.42l3 3c.18.18.43.29.71.29s.53-.11.71-.29l5-5A1.003 1.003 0 0012 5z" fill-rule="evenodd"></path>
                                                                                :
                                                                                <path d="M8 0C3.6 0 0 3.6 0 8s3.6 8 8 8 8-3.6 8-8-3.6-8-8-8zm0 14c-3.3 0-6-2.7-6-6s2.7-6 6-6 6 2.7 6 6-2.7 6-6 6z" fill-rule="evenodd"></path>
                                                                            }
                                                                        </svg>
                                                                    </span>
                                                                    <div className="bp3-text-overflow-ellipsis bp3-fill" onClick={this.coinSelect.bind(this, 'CLERK')}>CLERK</div>
                                                                </a>
                                                            </li>
                                                            <li className="">
                                                                <a className="bp3-menu-item bp3-popover-dismiss">
                                                                    <span icon="circle" className="bp3-icon bp3-icon-circle">
                                                                        <svg data-icon="circle" width="16" height="16" viewBox="0 0 16 16">
                                                                            <desc>circle</desc>

                                                                            {(this.state.clerk_Rcr == 'RCR') ?
                                                                                <path d="M8 16c-4.42 0-8-3.58-8-8s3.58-8 8-8 8 3.58 8 8-3.58 8-8 8zm4-11c-.28 0-.53.11-.71.29L7 9.59l-2.29-2.3a1.003 1.003 0 00-1.42 1.42l3 3c.18.18.43.29.71.29s.53-.11.71-.29l5-5A1.003 1.003 0 0012 5z" fill-rule="evenodd"></path>
                                                                                :
                                                                                <path d="M8 0C3.6 0 0 3.6 0 8s3.6 8 8 8 8-3.6 8-8-3.6-8-8-8zm0 14c-3.3 0-6-2.7-6-6s2.7-6 6-6 6 2.7 6 6-2.7 6-6 6z" fill-rule="evenodd"></path>
                                                                            }
                                                                        </svg>
                                                                    </span>
                                                                    <div className="bp3-text-overflow-ellipsis bp3-fill" onClick={this.coinSelect.bind(this, 'RCR')}>RCR</div>
                                                                </a>
                                                            </li>
                                                        </ul>
                                                    </div>
                                                </div>
                                            </div>
                                        </div>

                                        <div className="">
                                            <button type="button" className="bp3-button bp3-fill bp3-intent-primary" onClick={this.exchange_btn.bind(this, this.state.open_close_box)}>
                                                <span className="bp3-button-text" >{this.state.clerk_Rcr} / ETH</span>
                                                <span icon="caret-down" className="bp3-icon bp3-icon-caret-down">
                                                    <svg data-icon="caret-down" width="16" height="16" viewBox="0 0 16 16">
                                                        <desc>caret-down</desc>
                                                        <path d="M12 6.5c0-.28-.22-.5-.5-.5h-7a.495.495 0 00-.37.83l3.5 4c.09.1.22.17.37.17s.28-.07.37-.17l3.5-4c.08-.09.13-.2.13-.33z" fill-rule="evenodd"></path>
                                                    </svg>
                                                </span>
                                            </button>
                                        </div>
                                    </span>
                                </span>
                                <div className="ExchangeBlocks_priceChartInfo__2WGt1">
                                    <div><small>ETH Price: <span className="ExchangeBlocks_blue__3K5_O">{this.state?.statsList?.eth_price} USD <span className="bp3-popover-wrapper"><span className="bp3-popover-target"><span className="ExchangeBlocks_green__20D86" tabindex="0"></span></span></span></span></small><small>GAS Price: <span className="ExchangeBlocks_blue__3K5_O">
                                        {this.state.gasState === 'SLOW' ? this.state.statsList?.gas_slow :this.state.gasState === 'NORMAL'?this.state.statsList?.gas_medium:this.state.statsList?.gas_fast}
                                    </span></small></div>
                                    <div className="ExchangeBlocks_priceTagInput__19O5a">
                                        <span class={`bp3-tag bp3-intent-primary ${this.state.graph_slow == 'SLOW' ? 'bp3-active' : ''} bp3-interactive ExchangeBlocks_priceTagInputButton__IImLH`} tabindex="0">
                                            <span className="bp3-text-overflow-ellipsis bp3-fill" onClick={this.graphSlow.bind(this, 'SLOW')}>Slow</span>
                                        </span>

                                        <span class={`bp3-tag bp3-intent-primary ${this.state.graph_slow == 'NORMAL' ? 'bp3-active' : ''} bp3-interactive ExchangeBlocks_priceTagInputButton__IImLH`} tabindex="0">
                                            <span className="bp3-text-overflow-ellipsis bp3-fill" onClick={this.graphSlow.bind(this, 'NORMAL')}>Normal</span>
                                        </span>

                                        <span class={`bp3-tag bp3-intent-primary ${this.state.graph_slow == 'FAST' ? 'bp3-active' : ''} bp3-interactive ExchangeBlocks_priceTagInputButton__IImLH`} tabindex="0">
                                            <span className="bp3-text-overflow-ellipsis bp3-fill" onClick={this.graphSlow.bind(this, 'FAST')}>Fast</span>
                                        </span>

                                    </div>
                                </div>
                            </div>

                            {(this.state.clerk_Rcr == 'CLERK') ? <div className="ExchangeBlocks_priceChartAdditionalInfo__2bgff">
                                <span className="ExchangeBlocks_additionalInfoBox__n1oor">
                                    <span>Last Price ({this.state?.statsList?.cltp}):</span>
                                    <span className="ExchangeBlocks_blue__3K5_O">{this.state?.statsList?.cltp_eth} ETH</span>
                                </span><span className="ExchangeBlocks_additionalInfoBox__n1oor">
                                    <span>CLERK Buy Wall:</span><span className="ExchangeBlocks_blue__3K5_O">{this.state?.statsList?.clerk_buy_wall}</span></span><span className="ExchangeBlocks_additionalInfoBox__n1oor"><span>CLERK Supply Left:</span><span className="ExchangeBlocks_blue__3K5_O">{this.state?.statsList?.clerk_supply_left}</span></span>

                            </div> : <div className="ExchangeBlocks_priceChartAdditionalInfo__2bgff">
                                    <span className="ExchangeBlocks_additionalInfoBox__n1oor">
                                        <span>Last Price ({this.state?.statsList?.rltp}):</span>
                                        <span className="ExchangeBlocks_blue__3K5_O">{this.state?.statsList?.rltp_eth} ETH</span>
                                    </span><span className="ExchangeBlocks_additionalInfoBox__n1oor">
                                        <span>RCR Supply Left:</span><span className="ExchangeBlocks_blue__3K5_O">{this.state?.statsList?.rcr_supply_left}</span></span>


                                </div>}



                            <div className="TradingViewChart_tradingViewChart__1HNZS">
                                <div style={{ width: '100%' }}>
                                    {this.state.clerk_Rcr === 'CLERK' ?
                                        <TradingViewChart data={this.state.mockChartData} />
                                        :
                                        <TradingViewChart data={this.state.mockChartData} />
                                    }

                                </div>
                            </div>
                        </div>
                        <div className="bp3-card bp3-elevation-0 ExchangeBlock_exchangeBlock__2YV-i Exchange_createOrder__285dC">
                            <div className="bp3-tabs">
                                <div className="bp3-tab-list" role="tablist">
                                    <h3>Create Order</h3>
                                    <div className="bp3-flex-expander"></div>
                                    {this.state.buy_Sell_Order === 'BUY'}
                                    <div aria-controls="bp3-tab-panel_create-order_buy" aria-disabled="false" onClick={this.buyOrder.bind(this, 'BUY')} aria-expanded={this.state.buy_Sell_Order === 'BUY' ? "true" : "false"} aria-selected={this.state.buy_Sell_Order === 'BUY' ? "true" : "false"} className="bp3-tab" data-tab-id="buy" id="bp3-tab-title_create-order_buy" role="tab" tabindex="0">Buy</div>
                                    <div aria-controls="bp3-tab-panel_create-order_sell" aria-disabled="false" onClick={this.buyOrder.bind(this, 'SELL')} aria-expanded={this.state.buy_Sell_Order === 'SELL' ? "true" : "false"} aria-selected={this.state.buy_Sell_Order === 'SELL' ? "true" : "false"} className="bp3-tab" data-tab-id="sell" id="bp3-tab-title_create-order_sell" role="tab" tabindex="0">Sell</div>
                                </div>
                                <div aria-labelledby="bp3-tab-title_create-order_buy" aria-hidden={this.state.buy_Sell_Order === 'BUY' ? "false" : "true"} className="bp3-tab-panel" id="bp3-tab-panel_create-order_buy" role="tabpanel">
                                    <form onSubmit={this.submitFormBuyOrder}>
                                        <div className="bp3-form-group bp3-inline TextField_textField__30ceS">
                                            <label className="bp3-label">Amount of {this.state.clerk_Rcr} <span className="bp3-text-muted"></span></label>
                                            <div className="bp3-form-content">
                                                <div className="bp3-input-group bp3-large">
                                                    <input type="number" autoComplete="off" className="bp3-input" value={this.state.token_value}
                                                        onChange={this.onChange} name="token_value" /></div>
                                            </div>
                                        </div>
                                        <div className="bp3-form-group bp3-inline TextField_textField__30ceS">
                                            <label className="bp3-label">ETH Price for 1 {this.state.clerk_Rcr} <span className="bp3-text-muted"></span></label>
                                            <div className="bp3-form-content">
                                                <div className="bp3-input-group bp3-large">
                                                    {this.state.clerk_Rcr === 'CLERK' ? <input type="number" autoComplete="off" step="any" className="bp3-input" value={this.state.clerk_eth_value} name="clerk_eth_value" onChange={this.onChange} /> : <input type="number" className="bp3-input" autoComplete="off" step="any" value={this.state.rcr_eth_value} name="rcr_eth_value" onChange={this.onChange} />}
                                                </div>
                                            </div>
                                        </div>
                                        <div className="bp3-form-group bp3-inline TextField_textField__30ceS">
                                            <label className="bp3-label">Total ETH <span className="bp3-text-muted"></span></label>
                                            <div className="bp3-form-content">
                                                <div className="bp3-input-group bp3-large">

                                                    {this.state.clerk_Rcr === 'CLERK' ?
                                                        <input type="number" step="any" autoComplete="off" className="bp3-input" onChange={this.onChange} name="eth_value" value={this.state.eth_value} />
                                                        :
                                                        // value={parseFloat(this.state.token_value) * parseFloat(this.state.exchangeList?.rcr_eth_value)} 
                                                        <input type="number" step="any" autoComplete="off" className="bp3-input" onChange={this.onChange} name="eth_value" value={this.state.eth_value} />}

                                                </div>
                                            </div>
                                        </div>
                                        <button type="submit" disabled={!this.state.token_value > 0} className="bp3-button bp3-fill bp3-intent-success ActionButton_actionButton__1K-bX"><span className="bp3-button-text">Place Buy Order</span></button>
                                    </form>
                                </div>
                                <div aria-labelledby="bp3-tab-title_create-order_sell" aria-hidden={this.state.buy_Sell_Order === 'SELL' ? "false" : "true"} className="bp3-tab-panel" id="bp3-tab-panel_create-order_sell" role="tabpanel">
                                    <form onSubmit={this.submitFormSellOrder}>
                                        <div className="bp3-form-group bp3-inline TextField_textField__30ceS">
                                            <label className="bp3-label">Amount of {this.state.clerk_Rcr} <span className="bp3-text-muted"></span></label>
                                            <div className="bp3-form-content">
                                                <div className="bp3-input-group bp3-large">
                                                    <input type="number" autoComplete="off" className="bp3-input" value={this.state.token_value}
                                                        onChange={this.onChange} name="token_value" /></div>
                                            </div>
                                        </div>
                                        <div className="bp3-form-group bp3-inline TextField_textField__30ceS">
                                            <label className="bp3-label">ETH Price for 1 {this.state.clerk_Rcr} <span className="bp3-text-muted"></span></label>
                                            <div className="bp3-form-content">
                                                <div className="bp3-input-group bp3-large">
                                                    {this.state.clerk_Rcr === 'CLERK' ? <input autoComplete="off" type="number" className="bp3-input" step="any" value={this.state.clerk_eth_value} name="clerk_eth_value" onChange={this.onChange} /> : <input type="number" autoComplete="off" step="any" className="bp3-input" value={this.state.rcr_eth_value} name="rcr_eth_value" onChange={this.onChange} />}
                                                </div>
                                            </div>
                                        </div>
                                        <div className="bp3-form-group bp3-inline TextField_textField__30ceS">
                                            <label className="bp3-label">Total ETH <span className="bp3-text-muted"></span></label>
                                            <div className="bp3-form-content">
                                                <div className="bp3-input-group bp3-large">
                                                    {this.state.clerk_Rcr === 'CLERK' ?
                                                        <input type="number" autoComplete="off" step="any" className="bp3-input" onChange={this.onChange} name="eth_value" value={this.state.eth_value} />
                                                        :
                                                        // value={parseFloat(this.state.token_value) * parseFloat(this.state.exchangeList?.rcr_eth_value)}
                                                        <input type="number" autoComplete="off" step="any" className="bp3-input" onChange={this.onChange} name="eth_value" value={this.state.eth_value} />} </div>
                                            </div>
                                        </div>
                                        <button type="submit" disabled={!this.state.token_value > 0} className="bp3-button bp3-fill bp3-intent-danger ActionButton_actionButton__1K-bX"><span className="bp3-button-text">Place Sell Order</span></button>
                                    </form>
                                </div>
                            </div>
                        </div>
                        <div className="bp3-card bp3-elevation-0 ExchangeBlock_exchangeBlock__2YV-i Exchange_myOrders__3VAg2">
                            <div className="bp3-tabs">
                                <div className="bp3-tab-list" role="tablist">
                                    <h3>My Orders</h3>
                                    <div className="bp3-flex-expander"></div>
                                    <div aria-controls="bp3-tab-panel_create-order_open" aria-disabled="false" aria-expanded={this.state.my_orders === 'OPEN' ? "true" : "false"} aria-selected={this.state.my_orders === 'OPEN' ? "true" : "false"} onClick={this.MyOrders.bind(this, 'OPEN')} className="bp3-tab" data-tab-id="open" id="bp3-tab-title_create-order_open" role="tab" tabindex="0">Open</div>
                                    <div aria-controls="bp3-tab-panel_create-order_closed" aria-disabled="false" aria-expanded={this.state.my_orders === 'CLOSE' ? "true" : "false"} aria-selected={this.state.my_orders === 'CLOSE' ? "true" : "false"} onClick={this.MyOrders.bind(this, 'CLOSE')} className="bp3-tab" data-tab-id="closed" id="bp3-tab-title_create-order_closed" role="tab" tabindex="0">Closed</div>
                                </div>
                                <div aria-labelledby="bp3-tab-title_create-order_open" aria-hidden={this.state.my_orders === 'OPEN' ? "true" : "false"} className="bp3-tab-panel" id="bp3-tab-panel_create-order_open" role="tabpanel">
                                    <div className="Table_tableContainer__37XrN">
                                        <table className="bp3-html-table bp3-html-table-bordered bp3-html-table-condensed">
                                            <thead>
                                                <tr>
                                                    <th style={{ textAlign: 'center' }}>Type</th>
                                                    <th style={{ textAlign: 'center' }}>Price</th>
                                                    <th style={{ textAlign: 'center' }}>Amount</th>
                                                    <th style={{ textAlign: 'center' }}>Total</th>
                                                    <th style={{ textAlign: 'center' }}>Time</th>
                                                    <th style={{ textAlign: 'center' }}>Status</th>
                                                    {/* <th>Action</th> */}
                                                </tr>
                                            </thead>
                                            <tbody>
                                                {codeDataCloseOrder ? '' : <tr><td colSpan="8" className="text-center">No Data Found</td></tr>}
                                                {this.state.closeOrderList.map(item => (
                                                    <tr>
                                                        <td style={{ textAlign: 'center' }}>{item.type}</td>
                                                        <td style={{ textAlign: 'center' }}>{item.price}</td>
                                                        <td style={{ textAlign: 'center' }}>{item.token_name + ' ' + item.amount}</td>
                                                        <td style={{ textAlign: 'center' }}>{item.type}</td>
                                                        <td style={{ textAlign: 'center' }}>{item.datetime}</td>
                                                        <td style={{ textAlign: 'center' }}>
                                                            {item.check_url === null ? <a style={{ cursor: 'default', color: 'red' }}>Pending</a> : <a href={item.check_url} target="_blank">View</a>}

                                                        </td>
                                                        {/* <td  style={{ textAlign: 'center',cursor:'pointer' }}>
                                                        {item.wallet === this.state.accounts ? <i class="fa fa-times" onClick={this.removeOrder.bind(this, item)} aria-hidden="true"></i> : ''}

                                                        </td> */}
                                                    </tr>
                                                ))}

                                            </tbody>
                                        </table>
                                    </div>
                                </div>
                                <div aria-labelledby="bp3-tab-title_create-order_closed" aria-hidden={this.state.my_orders === 'CLOSE' ? "true" : "false"} className="bp3-tab-panel" id="bp3-tab-panel_create-order_closed" role="tabpanel">
                                    <div className="Table_tableContainer__37XrN">
                                        <table className="bp3-html-table bp3-html-table-bordered bp3-html-table-condensed">
                                            <thead>
                                                <tr>
                                                    <th style={{ textAlign: 'center' }}>Type</th>
                                                    <th style={{ textAlign: 'center' }}>Price</th>
                                                    <th style={{ textAlign: 'center' }}>Amount</th>
                                                    <th style={{ textAlign: 'center' }}>Total</th>
                                                    <th style={{ textAlign: 'center' }}>Time</th>
                                                    <th style={{ textAlign: 'center' }}>Status</th>
                                                    <th>Action</th>

                                                </tr>
                                            </thead>
                                            <tbody>
                                                {codeDataOpenOrder ? '' : <tr><td colSpan="8" className="text-center">No Data Found</td></tr>}
                                                {this.state.openOrderList.map(item => (
                                                    <tr>
                                                        <td style={{ textAlign: 'center' }}>{item.type}</td>
                                                        <td style={{ textAlign: 'center' }}>{item.price}</td>
                                                        <td style={{ textAlign: 'center' }}>{item.token_name + ' ' + item.amount}</td>
                                                        <td style={{ textAlign: 'center' }}>{item.type}</td>
                                                        <td style={{ textAlign: 'center' }}>{item.datetime}</td>
                                                        <td style={{ textAlign: 'center' }}>
                                                            <a href={item.check_url} target="_blank">View</a>
                                                        </td>
                                                        <td style={{ textAlign: 'center', cursor: 'pointer' }}>
                                                            {item.wallet === this.state.accounts ? <i class="fa fa-times" onClick={this.removeOrder.bind(this, item)} aria-hidden="true"></i> : ''}

                                                        </td>
                                                    </tr>
                                                ))}
                                            </tbody>
                                        </table>
                                    </div>
                                </div>
                            </div>
                        </div>
                        <div className="bp3-card bp3-elevation-0 ExchangeBlock_exchangeBlock__2YV-i Exchange_orderBook__1e0r6">
                            <div className="bp3-tabs">
                                <div className="bp3-tab-list" role="tablist">
                                    <h3>OrderBook</h3>
                                    <div className="bp3-flex-expander"></div>
                                    <div aria-controls="bp3-tab-panel_orderbook_buy" aria-disabled="false" onClick={this.buyOrder.bind(this, 'SELL')} aria-expanded={this.state.buy_Sell_Order === 'SELL' ? "true" : "false"} aria-selected={this.state.buy_Sell_Order === 'SELL' ? "true" : "false"} className="bp3-tab" data-tab-id="buy" id="bp3-tab-title_orderbook_buy" role="tab" tabindex="0">Buy</div>
                                    <div aria-controls="bp3-tab-panel_orderbook_sell" aria-disabled="false" onClick={this.buyOrder.bind(this, 'BUY')} aria-expanded={this.state.buy_Sell_Order === 'BUY' ? "true" : "false"} aria-selected={this.state.buy_Sell_Order === 'BUY' ? "true" : "false"} className="bp3-tab" data-tab-id="sell" id="bp3-tab-title_orderbook_sell" role="tab" tabindex="0">Sell</div>
                                </div>
                                <div aria-labelledby="bp3-tab-title_orderbook_buy" aria-hidden={this.state.buy_Sell_Order === 'SELL' ? "true" : "false"} className="bp3-tab-panel" id="bp3-tab-panel_orderbook_buy" role="tabpanel">
                                    <div className="Table_tableContainer__37XrN">
                                        <table className="bp3-html-table bp3-html-table-bordered bp3-html-table-condensed bp3-interactive">
                                            <thead>
                                                <tr>
                                                    <th style={{ textAlign: 'center' }}>Price</th>
                                                    <th style={{ textAlign: 'center' }}>Amount</th>
                                                    <th style={{ textAlign: 'center' }}>ETH</th>
                                                    {/* <th style={{ textAlign: 'center' }}>Time</th> */}
                                                </tr>
                                            </thead>
                                            <tbody>
                                                {codeDataSellOrederList ? '' : <tr><td colSpan="8" className="text-center">No Data Found</td></tr>}
                                                {this.state.sellOrderListData.map(item => (
                                                    (item.token_name === this.state.clerk_Rcr) ?
                                                        <tr onClick={this.sell_direct_order.bind(this, item)} style={{ backgroundImage: 'linear-gradient(90deg, transparent ' + item.percent + '%' + ', rgba(219, 55, 55, 0.2) 0%)' }}>
                                                            {item.order_by === 'Admin' ?
                                                                <>
                                                                    <td style={{ textAlign: 'center', color: 'green' }}>{item.price}</td>
                                                                    <td style={{ textAlign: 'center', color: 'green' }}>{item.token_name + ' ' + item.amount}</td>
                                                                    <td style={{ textAlign: 'center', color: 'green' }}>{item.eth_value}

                                                                    </td>
                                                                    {/* <td style={{ textAlign: 'center', color: 'green' }}>{item.datetime}</td> */}
                                                                </>
                                                                :
                                                                <>
                                                                    <td style={{ textAlign: 'center' }}>{item.price}</td>
                                                                    <td style={{ textAlign: 'center' }}>{item.token_name + ' ' + item.amount}</td>
                                                                    <td style={{ textAlign: 'center' }}>{item.eth_value}

                                                                    </td>
                                                                    {/* <td style={{ textAlign: 'center' }}>{item.datetime}</td> */}
                                                                </>
                                                            }
                                                        </tr>
                                                        : ''
                                                ))}

                                            </tbody>

                                        </table>
                                    </div>
                                </div>
                                <div aria-labelledby="bp3-tab-title_orderbook_sell" aria-hidden={this.state.buy_Sell_Order === 'BUY' ? "true" : "false"} className="bp3-tab-panel" id="bp3-tab-panel_orderbook_sell" role="tabpanel">
                                    <div className="Table_tableContainer__37XrN">
                                        <table className="bp3-html-table bp3-html-table-bordered bp3-html-table-condensed bp3-interactive">
                                            <thead>
                                                <tr>
                                                    <th style={{ textAlign: 'center' }}>Price</th>
                                                    <th style={{ textAlign: 'center' }}>Amount</th>
                                                    <th style={{ textAlign: 'center' }}>ETH</th>
                                                    {/* <th style={{ textAlign: 'center' }}>Time</th> */}
                                                </tr>
                                            </thead>
                                            <tbody>
                                                {codeDataBuyOrederList ? '' : <tr><td colSpan="8" className="text-center">No Data Found</td></tr>}
                                                {this.state.buyOrderListData.map(item => (
                                                    (item.token_name === this.state.clerk_Rcr) ?
                                                        <tr onClick={this.buy_direct_order.bind(this, item)} style={{ backgroundImage: 'linear-gradient(90deg, transparent ' + item.percent + '%' + ', rgba(15, 153, 96, 0.2) 0%)' }}>
                                                            {item.order_by === 'Admin' ?
                                                                <>
                                                                    <td style={{ textAlign: 'center', color: 'green' }}>{item.price}</td>
                                                                    <td style={{ textAlign: 'center', color: 'green' }}>{item.token_name + ' ' + item.amount}</td>
                                                                    <td style={{ textAlign: 'center', color: 'green' }}>{item.eth_value}

                                                                    </td>
                                                                    {/* <td style={{ textAlign: 'center', color: 'green'  }}>{item.datetime}</td> */}

                                                                </>
                                                                :
                                                                <>
                                                                    <td style={{ textAlign: 'center' }}>{item.price}</td>
                                                                    <td style={{ textAlign: 'center' }}>{item.token_name + ' ' + item.amount}</td>
                                                                    <td style={{ textAlign: 'center' }}>{item.eth_value}

                                                                    </td>
                                                                    {/* <td style={{ textAlign: 'center' }}>{item.datetime}</td> */}

                                                                </>
                                                            }
                                                        </tr>
                                                        : ''
                                                ))}

                                            </tbody>

                                        </table>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </>
        )
    }
}