import React, { Component } from 'react';
import classes from './Layout.module.css';


import Aux from '../Auxi/Auxi';
import { ToastContainer } from 'react-toastify';
import { connect } from 'react-redux';
import 'react-toastify/dist/ReactToastify.css';

import web3Modal from '../../web3/web3func';
import * as web3Actions from '../../store/actions/index';

import Header from '../../components/Navigation/Header/Header';
import SideDrawer from '../../components/Navigation/SideDrawer/SideDrawer';
import Backdrop from '../../components/UI/Backdrop/Backdrop';

class Layout extends Component {

    state = {
        showSideDrawer: window.innerWidth <= 1000 ? false : true,
        y_pos: 0,
        shouldScroll: false
    }
    
    async componentDidMount () {
        window.addEventListener('resize', this.sideDrawerResizeHandler);
        window.addEventListener('scroll', this.handleScroll);

        // if(web3Modal.providerController.cachedProvider === 'injected') {
        //     await this.props.connectToWallet();
        // }
    }
    
    componentWillUnmount() {
        window.removeEventListener('resize', this.sideDrawerResizeHandler);
        window.addEventListener('scroll', this.handleScroll);
    }

    sideDrawerResizeHandler = () => {

        if (window.innerWidth <= 1000) {
            this.setState( {showSideDrawer: false })
        } else {
            this.setState( {showSideDrawer: true })
        }
        
        if (window.location.pathname.includes('Stake') && window.innerWidth <= 1350) {
            this.setState({ showSideDrawer: false })
        } 
    }

    sideDrawerClosedHandler = () => {
        this.setState( { showSideDrawer: false } );
    }

    sideDrawerToggleHandler = () => {
        this.setState( ( prevState ) => {
            return { showSideDrawer: !prevState.showSideDrawer };
        } );
    }

    scrollToTop = () => {
        window.scrollTo({
            top: 0,
            behavior:'smooth'
        });
        this.setState({shouldScroll: false})
    }

    handleScroll = () => {
        if (window.scrollY > this.state.y_pos) {
            this.setState({shouldScroll: true})
        } else {
            this.setState({shouldScroll: false})
        }
    }

    render () {

        let attachedClasses = [classes.contentwrapper, classes.Close];
        let contentClasses = [classes.Content, classes.contentWithoutDrawer];
            if (this.state.showSideDrawer) {
                attachedClasses = [classes.contentwrapper, classes.Open];
                contentClasses = [classes.Content];
            }
        
        return (
            <Aux>
                <ToastContainer />
                <Backdrop show={this.state.showSideDrawer} clicked={this.sideDrawerClosedHandler}/>

                <Header drawerToggleClicked={this.sideDrawerToggleHandler} />
                <SideDrawer closed={this.sideDrawerClosedHandler} open={this.state.showSideDrawer} onClick={window.innerWidth <= 800 ? this.sideDrawerClosedHandler : null}/>
                <main className={contentClasses.join(' ')} onScroll={this.handleScroll}>
                    <div className={attachedClasses.join(' ')}>
                    {this.props.children}

                    {this.state.shouldScroll ? 
                    <i onClick={this.scrollToTop} className={`${classes.scrollUpArrow} fas fa-chevron-circle-up`}></i> : null }
                    </div>
                </main>

            </Aux>
        )
    }
}


const mapStateToProps = state => {
    return {
        address: state.address,
        wallet: state.web3instance
    };
}


const mapDispatchToProps = dispatch => {
    return {
        // connectToWallet: () => dispatch(web3Actions.connectToWallet())
    }
}

export default connect(mapStateToProps, mapDispatchToProps)(Layout);