import React, {Component} from 'react';
import {Col, Grid, Row, Button} from "react-bootstrap";
import {AppContext} from "../App";
import no from '../assets/skull-crossbones.svg';
import yes from '../assets/check-circle.svg';

class Status extends Component {

    static conditionalLink(url, label) {
        let linkText = label;
        if (label && label.trim() > 25) {
            label = label.trim();
            label = label.substr(0, 5) + '...' + label.substr(label.length - 15);
        }

        if (url && url.trim().length > 0) {
            linkText = <a target={'_blank'} href={url}>
                {label}
            </a>;
        }

        return linkText;
    }

    static conditionalImage(url, label) {
        let imgText = label;
        if (url && url.trim().length > 0) {
            imgText = <img src={url} alt={label} width="128" height="128"/>;
        }
        return imgText;
    }

    static getIcon(checkValue) {
        let iconImg = <img src={no} alt={'X'} width={'20px'} height={'20px'}/>;

        if (checkValue && checkValue.trim().length > 0) {
            iconImg = <img src={yes} alt={'X'} width={'20px'} height={'20px'}/>;
        }

        return iconImg;
    }

    static clear() {
        window.location.reload();
    }

    render() {

        return (
            <AppContext.Consumer>
                {({web3ctx, myToken, actions}) => (
                    <Grid className='App-output'>
                        <Row>
                            <Col xs={4} className='header'>My Token Info</Col>
                        </Row>
                        <Row>
                            <Col xs={4} className='header'>
                                <Button onClick={Status.clear}>Reset</Button>
                                <Button onClick={actions.mintToken}
                                        disabled={Boolean(!(myToken.ipfsImageUrl && myToken.recipientAddress && myToken.ipfsMetadataUrl && web3ctx.tokenAddress))}>
                                    Mint Token
                                </Button>
                            </Col>
                        </Row>
                        <Row>
                            <Col xs={2} className='output-label'>Ethereum Token Address</Col>
                            <Col xs={2}>{Status.getIcon(web3ctx.tokenAddress)}</Col>
                        </Row>
                        <Row>
                            <Col xs={2} className='output-label'>
                                {Status.conditionalLink(myToken.ipfsImageUrl, 'IPFS Image File')}
                            </Col>
                            <Col xs={2}>
                                {Status.conditionalImage(myToken.ipfsImageUrl, 'Not Set')}
                            </Col>
                        </Row>
                        <Row>
                            <Col xs={2} className='output-label'>
                                {Status.conditionalLink(myToken.ipfsMetadataUrl, 'IPFS Metadata File')}
                            </Col>
                            <Col xs={2}>{Status.getIcon(myToken.ipfsMetadataUrl)}</Col>
                        </Row>
                        <Row>
                            <Col xs={2} className='output-label'>Token Recipient Address</Col>
                            <Col xs={2}>{Status.getIcon(myToken.recipientAddress)}</Col>
                        </Row>
                        <Row>
                            <Col xs={2} className='output-label'>Tx Hash #</Col>
                            <Col xs={2}>
                                {Status.conditionalLink((myToken.txHash ? web3ctx.etherscanUrl + myToken.txHash : ''), myToken.txHash)}
                            </Col>
                        </Row>
                        <Row>
                            <Col xs={2} className='output-label'>Block #</Col>
                            <Col xs={2}>{myToken.txReceipt.blockNumber}&nbsp;</Col>
                        </Row>
                        <Row>
                            <Col xs={2} className='output-label'>Gas Used</Col>
                            <Col xs={2}>{myToken.txReceipt.gasUsed}&nbsp;</Col>
                        </Row>
                    </Grid>
                )}
            </AppContext.Consumer>
        );
    }
}

export default Status;