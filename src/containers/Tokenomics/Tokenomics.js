import React, { Component } from 'react';
import { connect } from 'react-redux';

import axios from 'axios';
import Aux from '../../hoc/Auxi/Auxi';
import classes from './Tokenomics.module.css';
import Button from '../../components/UI/Button/Button';
import RCRLogo from '../../assets/images/rc.svg';
import CLERKLogo from '../../assets/images/clerk.svg';
import Loader from './loader'
class Tokenomics extends Component {

    state = {
        richlist: false,
        codeDataOpenOrder:'',
        clerk_team_holding:0.00,
        clerk_community_holding:0.00,
        
        tokens: {
            bitcoin: null,
            ethereum: null
        },
        price_change: {
            bitcoin: null,
            ethereum: null
        }
    }

    updateTokenPrice = () => {
        axios.get('https://api.coingecko.com/api/v3/coins/markets?vs_currency=usd&ids=bitcoin%2C%20ethereum&order=market_cap_desc&per_page=2&page=1&sparkline=false&price_change_percentage=24h').then(response => {
            console.log(response)

            const tokens = {
                bitcoin: response.data[0].current_price,
                ethereum: response.data[1].current_price
            }

            const price_change = {
                bitcoin: Math.round(response.data[0].price_change_percentage_24h * 10) / 10,
                ethereum: Math.round(response.data[1].price_change_percentage_24h * 10) / 10
            }

            this.setState({ tokens: tokens, price_change: price_change })
        })
    }

    componentWillMount() {
        this.updateTokenPrice();
    }

    componentDidMount() {
        this.interval = setInterval(this.updateTokenPrice, 1000 * 30);
        this.tokenomicsData();
        this.clerk_team_holding_fun();
        this.clerk_community_holding_fun();
    }

    componentWillUnmount() {
        clearInterval(this.interval);
    }


    clerk_team_holding_fun()
    {
        axios.get(`https://espsofttech.org:3000/api/glr/mainnet/getBalance/0x0c51Cc43FbfD7E273181197a800fE70f056BD771/0x432a92cccb253e890b6765e5d368733a27a5df49`, {

        }).then((res) =>{            
            this.setState({
                clerk_team_holding:res.data.balance
            });
        })
    }
    clerk_community_holding_fun()
    {
        axios.get(`https://espsofttech.org:3000/api/glr/mainnet/getinfo/0x432a92cccb253e890b6765e5d368733a27a5df49`, {

        }).then((res) =>{            
            this.setState({
                clerk_community_holding:res.data.totalSupply
            });
        })
    }


    async tokenomicsData() {

       await axios.get(`https://espsofttech.org:3000/tokenomics`, {

        }).then((res) => {
            console.log(res);
            this.setState({
                codeDataOpenOrder :res.data
            });
            console.log(this.state.codeDataOpenOrder?.RCR.unlocked.initialOffering)

        }).catch((error) => {
        });

    }

    makeCard = (chk,name, percent, available, locked, logo, address, contract) => {
        return (
            
            <div className={classes.card}>
                <div style={{ textAlign: 'center' }}>
                    <img src={logo} width='50%' alt='placeholder' draggable={false} />
                </div>
                <div className={classes.center}>
                    {name}
                </div>
                <div className={classes.center}>
                    {percent}
                </div>
                <div>
                    <p className={classes.infotext}><span className={classes.available}>Available:</span> {available}</p>
                    {locked != null ?
                        <p className={classes.infotext}><span className={classes.locked}>{(chk==='1')?'Distributed':'Locked'}:</span> {locked}</p>
                        : <p className={classes.infotext}></p>}
                </div>
                {address != null ?
                    <div>
                        <Button href={address} btnType='Tokenomics'>Address</Button>
                        {contract != null ?
                            <Button href={contract} btnType='Tokenomics'>Vault Contract</Button>
                            : null}
                    </div> : null
                }
            </div>

        );
    }

    //===============================  Show richlist  ==================================

    richListShow(id) {
        if (id === 0) {

            this.setState({
                richlist: true
            })
        }
        else if (id === 1) {

            this.setState({
                richlist: false
            })
        }

    }

    render() {

        return (
            
            <Aux>
                <div className='container'>
                    {this.state.richlist === false ? <div>
                        <div className='row ma-0 pa-3'>
                            <div className="col-md-10 text-center">

                                <h2 className={classes.headertext}>RCR Tokenomics</h2>
                            </div>

                            <div className="col-md-2">
                                
                                {/* <button className="Header_connect_meta__3yQP9" onClick={this.richListShow.bind(this, 0)}>Richlist</button> */}
                            </div>

                        </div>
                        {(this.state.codeDataOpenOrder==='')?
                        <div style={{ marginTop: 25 }}>
                                    <Loader />
                        </div>:''}
                        <div className={classes.row} style={{opacity:(this.state.codeDataOpenOrder==='')?'0.3':'1'}} >
                            {this.makeCard('1','Initial distribution', '10%', this.state.codeDataOpenOrder?.RCR?.unlocked?.initialOffering.toFixed(4),  this.state.codeDataOpenOrder?.RCR?.locked?.staking.toFixed(4), RCRLogo, '0x339c27a9448DAE15DE043a3575ECF0a271b13439')}

                            {this.makeCard('0','Team Reserve', '10%', this.state.codeDataOpenOrder?.RCR?.unlocked?.teamReserve.toFixed(4), this.state.codeDataOpenOrder?.RCR?.locked?.teamReserve.toFixed(4), RCRLogo,
                                'https://etherscan.io/address/0x0c51Cc43FbfD7E273181197a800fE70f056BD771', 'https://etherscan.io/address/0xBE23E67938d40F2A9e1672F2C99c0dE3D079417E')}

                            {this.makeCard('0','Community Reserve', '65%', this.state.codeDataOpenOrder?.RCR?.unlocked?.communityReserve.toFixed(4),this.state.codeDataOpenOrder?.RCR?.locked?.communityReserve.toFixed(4), RCRLogo,
                                'https://etherscan.io/address/0x7962d11EDf3e7163D7bae3E3E2F007F37c4C6F29', 'https://etherscan.io/address/0xD65794890dd6c2209Ff921DDA3940A605f1d9B26')}

                            {this.makeCard('0','Developer Reserve', '15%', this.state.codeDataOpenOrder?.RCR?.unlocked?.developerReserve.toFixed(4), this.state.codeDataOpenOrder?.RCR?.locked?.developerReserve.toFixed(4), RCRLogo,
                                'https://etherscan.io/address/0x218aaF29CB46F3d663f0863b4d8d8620e1f40Af8', 'https://etherscan.io/address/0x8c3f684C79C19518B8DF3b86EA0B23905972d14e')}
                        </div>



                        <div className='row ma-0 pa-3'>
                            <h2 className={classes.headertext}>Clerk Tokenomics</h2>
                        </div>

                        <div className={classes.row}>
                            {this.makeCard('0','Team holdings', '0%',this.state?.clerk_team_holding, null, CLERKLogo, 'https://etherscan.io/address/0x0c51Cc43FbfD7E273181197a800fE70f056BD771')}
                            {this.makeCard('0','Community holdings', '10%', (this.state?.clerk_community_holding-this.state?.clerk_team_holding).toFixed(4), null, CLERKLogo)}
                        </div>


                        <div>
                            <h2 className={classes.headertext}>Explanation:</h2>
                            <p className={classes.infotext}> <span className={classes.explainspan}>Initial Distribution:</span> 100k token liquidity offering. </p>
                            <p className={classes.infotext}> <span className={classes.explainspan}>Community reserve:</span> Rewards for liquidity pool staking, giveaways and contributing to the community.</p>
                            <p className={classes.infotext}> <span className={classes.explainspan}>Developer reserve:</span>  Creating products/protocols that will benefit users and stakeholders.</p>
                            <p className={classes.infotext} style={{ marginBottom: '2em' }}><span className={classes.explainspan}>Team/Community holdings:</span> Governance ratio. Community should eventually equal out and exceed team holdings. </p>
                        </div>


                    </div>
                        :
                        <>
                            <button className="Header_connect_meta__3yQP9" style={{ marginBottom: '10px' }} onClick={this.richListShow.bind(this, 1)}>Back</button>
                            <div className="row">
                                <div className="col-md-6">
                                    <p>
                                        RCR Total: 10,001,831.095</p>

                                    <p> RCR Circulation: 4,092,586.05</p>

                                    <p> CLERK Total: 824,665.69</p>



                                </div>

                                <div className="col-md-6">
                                    <p> RCR Locked: 5,909,245.045</p>

                                    <p>CLERK Lost: 252,452.855</p>
                                </div>


                            </div>
                            <div aria-labelledby="bp3-tab-title_orderbook_buy" aria-hidden={this.state.buy_Sell_Order === 'SELL' ? "true" : "false"} className="bp3-tab-panel" id="bp3-tab-panel_orderbook_buy" role="tabpanel">
                                <div className="Table_tableContainer__37XrN" style={{ border: '1px solid #ddd' }}>
                                    <table className="bp3-html-table bp3-html-table-bordered bp3-html-table-condensed bp3-interactive">
                                        <thead>
                                            <tr>
                                                <th style={{ textAlign: 'center' }}>Rank</th>
                                                <th style={{ textAlign: 'center' }}>Note</th>
                                                <th style={{ textAlign: 'center' }}>Address</th>
                                                <th style={{ textAlign: 'center' }}>Total RCR</th>
                                                <th style={{ textAlign: 'center' }}>Total CLERK</th>
                                                <th style={{ textAlign: 'center' }}>Unlocked RCR</th>
                                                <th style={{ textAlign: 'center' }}>Locked RCR</th>
                                            </tr>
                                        </thead>
                                        <tbody>

                                            <tr >

                                                <>
                                                    <td style={{ textAlign: 'center' }}>1</td>
                                                    <td style={{ textAlign: 'center' }}>Reese</td>
                                                    <td style={{ textAlign: 'center' }}>0xcf37018d283f8199df3f2bcf9365175ee0b7c665</td>
                                                    <td style={{ textAlign: 'center' }}>2,12,333</td>
                                                    <td style={{ textAlign: 'center' }}>324</td>
                                                    <td style={{ textAlign: 'center' }}>234234</td>
                                                    <td style={{ textAlign: 'center' }}>23432</td>


                                                </>

                                            </tr>


                                        </tbody>

                                    </table>
                                </div>
                            </div>
                        </>
                    }



                </div>
            </Aux>
        );
    }
}

const mapStateToProps = state => {
    return {
        CONTRACTS: state.CONTRACTS
    };
}


const mapDispatchToProps = dispatch => {
    return {

    }
}

export default connect(mapStateToProps, mapDispatchToProps)(Tokenomics);