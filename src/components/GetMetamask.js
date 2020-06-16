import React, {Component} from 'react';
import '../assets/App.css';
import metamask from '../assets/GetMetamask.png';
import logo from '../assets/logo.png';

class GetMetamask extends Component {

    render() {

        return (
            <div className='App'>
                <header className='App-header'>
                    <img src={logo} align='left' className='App-logo' alt='logo'/>
                    <h1> Mint your Artists' Liberation Front (ALF) Rare Digital Art Token</h1>
                </header>
                <div align="center">
                    <h1>Install Metamask</h1>
                    <img src={metamask} alt={'metamask'}/><br/>
                        <a href="https://chrome.google.com/webstore/detail/metamask/nkbihfbeogaeaoehlefnkodbefgpgknn">
                            For Chrome
                        </a><br/>
                        <a href="https://addons.mozilla.org/en-US/firefox/addon/ether-metamask/">
                            For Firefox
                        </a><br/>
                        <a href="https://addons.opera.com/en/extensions/details/metamask/">
                            For Opera
                        </a><br/>
                        <a href="https://brave.com/">
                            Get Brave browser
                        </a><br/>
                </div>
            </div>
        );
    }
}

export default GetMetamask;
