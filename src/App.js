import React, {Component} from 'react';
import {Tabs, TabLink, TabContent} from 'react-tabs-redux';
import {Grid, Row, Col} from 'react-bootstrap';
import axios from 'axios';
import {GetMetamask, Home, Token, Image, Metadata, Status} from './Components';
import web3 from './util/web3';
import ipfs from './util/ipfs';
import './assets/App.css';
import logo from './assets/logo.png'
import metadata from './assets/metadata-template.json';
import tokenContract from './assets/contract';

export const AppContext = React.createContext();

const web3networks = {
    1: {
        name: 'main',
        etherscanUrl: 'https://etherscan.io/tx/'
    },
    3: {
        name: 'ropsten',
        etherscanUrl: 'https://ropsten.etherscan.io/tx/'
    },
    4: {
        name: 'rinkeby',
        etherscanUrl: 'https://rinkeby.etherscan.io/tx/'
    },
    42: {
        name: 'kovan',
        etherscanUrl: 'https://kovan.etherscan.io/tx/'
    }
};

class App extends Component {

    static exists(s) {
        let chk = (s ? s.toString() : '');
        return chk && chk.trim().length > 0;
    }

    static clear() {
        window.location.reload();
    }

    constructor(props) {
        super(props);

        this.state = {
            selectedTab: 'Home',
            tabs: [
                {linkTo: 'Home', label: 'Home', component: Home},
                {linkTo: 'Token', label: 'Token', component: Token},
                {linkTo: 'Image', label: 'Image', component: Image},
                {linkTo: 'Metadata', label: 'Metadata', component: Metadata}
            ],
            web3ctx: {
                networkId: '',
                networkName: '',
                etherscanUrl: '',
                activeWallet: '',
                lastBlockNumber: '',
                currentBalance: '',
                tokenAddress: '0x494b2CeE761FdfCd6f5bE1ABefB7A6112B251874',
                ipfsGateway: 'https://ipfs.infura.io/ipfs/'
            },
            myToken: {
                address: '0x494b2CeE761FdfCd6f5bE1ABefB7A6112B251874',
                abi: tokenContract.abi,
                imageBuffer: '',
                ipfsImageHash: '',
                ipfsImageUrl: '',
                metadataBuffer: metadata,
                ipfsMetadataHash: '',
                ipfsMetadataUrl: '',
                recipientAddress: '',
                newMinterAddress: '',
                txHash: '',
                txReceipt: '',
                blockNumber: '',
                gasUsed: ''
            },
            actions: {
                captureFile: this.captureFile.bind(this),
                handleInputChange: this.handleInputChange.bind(this),
                handleMetadataChange: this.handleMetadataChange.bind(this),
                handleAbiChange: this.handleAbiChange.bind(this),
                addIpfs: this.addIpfs.bind(this),
                mintToken: this.mintToken.bind(this),
                addMinter: this.addMinter.bind(this)
            }
        };
    }

    checkNetwork = async () => {

        // first update the values that can change while connected
        let myContext = this.state.web3ctx;
        let accounts = await web3.eth.getAccounts();
        myContext.activeWallet = accounts[0];
        myContext.lastBlockNumber = await web3.eth.getBlockNumber();
        myContext.currentBalance = await web3.eth.getBalance(accounts[0]);

        await web3.eth.net.getId((err, netId) => {
            console.log(err, netId);

            if (netId && this.state.web3ctx.networkId !== netId) {
                // we're on a new network, look for deployed contract
                console.log('refreshing settings for network ' + netId);

                myContext.networkId = netId;
                myContext.networkName = (web3networks[netId] ? web3networks[netId].name : 'unknown');
                myContext.etherscanUrl = (web3networks[netId] ? web3networks[netId].etherscanUrl : 'unknown');

                if (tokenContract.networks[netId]) {
                    // attempt to load contract address deployed on this network
                    let newAddress = (tokenContract.networks[netId].address ? tokenContract.networks[netId].address : '');

                    console.log('Using contract at address \'' + newAddress + '\'');
                    myContext.tokenAddress = newAddress;

                } else {
                    console.log('No contract deployed on network ' + netId);
                    myContext.tokenAddress = '';
                }
            }
        });

        await this.setState({web3ctx: {...myContext}});
    };

    componentDidMount() {
        this.checkNetwork();
    }

    captureFile = (e) => {
        e.stopPropagation();
        e.preventDefault();
        const file = e.target.files[0];
        let reader = new window.FileReader();
        reader.readAsArrayBuffer(file);
        reader.onloadend = () => this.convertToBuffer(reader)
    };

    convertToBuffer = async (reader) => {
        // file is converted to a imageBuffer to prepare for uploading to IPFS
        const myBuffer = await Buffer.from(reader.result);
        // set this imageBuffer -using es6 syntax
        this.setState({
            myToken: {
                ...this.state.myToken,
                imageBuffer: myBuffer
            }
        });
    };

    handleInputChange(e) {
        const target = e.target;
        const value = target.value;
        const name = target.name;

        console.log('setting ' + name + ' = ' + value);

        let myMetadata = this.state.myToken.metadataBuffer;
        let ipfsImgUrl, ipfsMetaUrl, ipfsImgHash, ipfsMetaHash = '';

        if (name.endsWith('ipfsImageHash')) {

            if (App.exists(value)) {
                ipfsImgUrl = this.state.web3ctx.ipfsGateway + value;
                ipfsImgHash = value;
                myMetadata.image = ipfsImgUrl;
            }

            this.setState({
                myToken: {
                    ...this.state.myToken,
                    ipfsImageUrl: ipfsImgUrl,
                    ipfsImageHash: ipfsImgHash,
                    metadataBuffer: myMetadata
                },
                selectedTab: 'Metadata'
            });
        } else if (name.endsWith('ipfsMetadataHash')) {

            if (App.exists(value)) {
                ipfsMetaUrl = this.state.web3ctx.ipfsGateway + value;
                ipfsMetaHash = value;

                axios.get(ipfsMetaUrl)
                    .then(res => {
                        console.log('IPFS response: ' + JSON.stringify(res.data));

                        this.setState({
                            myToken: {
                                ...this.state.myToken,
                                ipfsImageUrl: res.data.image,
                                ipfsImageHash: res.data.image.substr(res.data.image.lastIndexOf('/') + 1),
                                ipfsMetadataUrl: ipfsMetaUrl,
                                ipfsMetadataHash: ipfsMetaHash,
                                metadataBuffer: res.data
                            },
                            selectedTab: 'Metadata'
                        });
                    });
            }
        } else {
            let parent = name.substr(0, name.indexOf('.'));
            let node = name.substr(name.indexOf('.') + 1);
            let parentNode = ('web3ctx' === parent ? this.state.web3ctx : this.state.myToken);

            this.setState({
                [parent]: {
                    ...parentNode,
                    [node]: value
                }
            });
        }

        return true;
    }

    handleMetadataChange(e) {

        let myMeta = JSON.parse(e.target.value);
        this.setState({
            myToken: {
                ...this.state.myToken,
                ipfsImageUrl: myMeta.image,
                ipfsImageHash: myMeta.image.substr(myMeta.image.lastIndexOf('/') + 1),
                metadataBuffer: myMeta
            },
        });
    }

    handleAbiChange(e) {
        this.setState({
            myToken: {
                ...this.state.myToken,
                abi: JSON.parse(e.target.value)
            }
        });
    }

    addIpfs = async () => {
        // save document to IPFS,return its hash#, and set hash# to state
        // https://github.com/ipfs/interface-ipfs-core/blob/master/SPEC/FILES.md#add
        // setState by setting ipfsImageHash to ipfsImageHash[0].hash
        if (this.state.myToken.imageBuffer && this.state.myToken.imageBuffer.length > 0) {

            await ipfs.add(this.state.myToken.imageBuffer, (err, ipfsHash) => {
                console.log('IPFS hash: ' + ipfsHash + ', error: ' + err);

                let myMetadata = JSON.parse(JSON.stringify(this.state.myToken.metadataBuffer));
                myMetadata.image = this.state.web3ctx.ipfsGateway + ipfsHash[0].hash;

                this.setState({
                    myToken: {
                        ...this.state.myToken,
                        ipfsImageHash: ipfsHash[0].hash,
                        ipfsImageUrl: myMetadata.image,
                        metadataBuffer: myMetadata,
                        imageBuffer: ''
                    },
                    selectedTab: 'Metadata'
                });
            })
        } else if (this.state.myToken.metadataBuffer && this.state.myToken.metadataBuffer.toString().length > 0) {

            await ipfs.add(Buffer.from(JSON.stringify(this.state.myToken.metadataBuffer)), (err, ipfsHash) => {
                console.log('IPFS hash: ' + ipfsHash + ', error: ' + err);

                this.setState({
                    myToken: {
                        ...this.state.myToken,
                        ipfsMetadataHash: ipfsHash[0].hash,
                        ipfsMetadataUrl: this.state.web3ctx.ipfsGateway + ipfsHash[0].hash
                    },
                    selectedTab: 'Metadata'
                });
            })
        } else {
            console.log('file could not be found: '
                + JSON.stringify(this.state.myToken.metadataBuffer, null, 2));
            return 1;
        }
    };

    addMinter = async () => {

        const minterAddress = this.state.myToken.newMinterAddress;

        if (!App.exists(minterAddress)) {
            console.log('Minter address is required!');
        }

        // bring in user's metamask account address
        const accounts = await web3.eth.getAccounts();
        const myTokenInstance = new web3.eth.Contract(
            JSON.parse(this.state.myToken.abi),
            this.state.web3ctx.tokenAddress
        );

        console.log('Adding minter address ' + minterAddress + ' as minter for token address '
            + myTokenInstance.options.address);

        // see, this https://web3js.readthedocs.io/en/1.0/web3-eth-contract.html#methods-mymethod-send
        await myTokenInstance.methods.addMinter(minterAddress).send({
            from: accounts[0]
        }, (error, txHash) => {
            console.log('txHash = ' + txHash + '; Error = ' + error);
        });
    };

    mintToken = async () => {

        if (!App.exists(this.state.myToken.abi) ||
            !App.exists(this.state.web3ctx.tokenAddress) ||
            !App.exists(this.state.myToken.recipientAddress) ||
            !App.exists(this.state.myToken.ipfsImageUrl) ||
            !App.exists(this.state.myToken.ipfsMetadataUrl)) {
            console.log('Required input fields are missing!');
            return false;
        }

        try {
            this.setState({
                myToken: {
                    ...this.state.myToken,
                    blockNumber: 'waiting..',
                    gasUsed: 'waiting...'
                }
            });

            // bring in user's metamask account address
            const accounts = await web3.eth.getAccounts();
            const myTokenInstance = new web3.eth.Contract(
                this.state.myToken.abi,
                this.state.web3ctx.tokenAddress
            );

            console.log('Sending from Metamask account: ' + accounts[0] + ' to token address '
                + myTokenInstance.options.address);

            // see, this https://web3js.readthedocs.io/en/1.0/web3-eth-contract.html#methods-mymethod-send
            await myTokenInstance.methods.mint(this.state.myToken.recipientAddress, this.state.myToken.ipfsMetadataUrl).send({
                from: accounts[0]
            }, (error, txHash) => {
                console.log('txHash: ' + txHash + ', error: ' + error);

                this.setState({
                    myToken: {
                        ...this.state.myToken,
                        txHash: txHash
                    }
                });
            });

            // get Transaction Receipt in console on click
            // See: https://web3js.readthedocs.io/en/1.0/web3-eth.html#gettransactionreceipt
            await web3.eth.getTransactionReceipt(this.state.myToken.txHash, (err, txReceipt) => {
                if (txReceipt) {
                    this.setState({
                        myToken: {
                            ...this.state.myToken,
                            txReceipt: txReceipt
                        }
                    });
                }
            });

        } catch (e) {
            console.log('Error: ' + e);
        }
    };

    renderTabs() {

        let length = this.state.tabs.length;

        // add links
        let tabs = this.state.tabs.map((tab, index) => {
            return (
                <TabLink to={tab.linkTo} key={index}>{tab.label}</TabLink>
            );
        });

        // now add content
        this.state.tabs.map((tab, index) => {
            return (
                tabs.push(
                    <TabContent for={tab.linkTo} key={length + index}>
                        {
                            React.createElement(tab.component)
                        }
                    </TabContent>
                )
            )
        });

        return tabs;
    };

    render() {
        if (!web3 || typeof web3 == 'undefined' || web3.version.network === 'loading') {
            return (
                <GetMetamask/>
            );
        } else {
            return (
                <div className='App'>
                    <header className='App-header'>
                        <img src={logo} align='left' className='App-logo' alt='logo'/>
                        <h1> Mint your Artists Liberation Front (ALF) Rare Digital Art Token</h1>
                    </header>
                    <AppContext.Provider
                        value={{
                            web3ctx: {...this.state.web3ctx},
                            myToken: {...this.state.myToken},
                            actions: {...this.state.actions}
                        }}>
                        <Grid>
                            <Row>
                                <Col xs={8}>
                                    <Tabs selectedTab={this.state.selectedTab} renderActiveTabContentOnly={true}>
                                        {this.renderTabs()}
                                    </Tabs>
                                </Col>
                                <Col xs={4}>
                                    <Row>
                                        <Col>
                                            <Status/>
                                        </Col>
                                    </Row>
                                </Col>
                            </Row>
                        </Grid>
                    </AppContext.Provider>
                </div>
            );
        }
    }
}

export default App;
