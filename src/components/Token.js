import React, {Component} from 'react';
import {Col, Grid, Row, Button} from "react-bootstrap";
import {AppContext} from "../App";

class Token extends Component {

    render() {

        return (
            <AppContext.Consumer>
                {({web3ctx, myToken, actions}) => (
                    <Grid className="App-input">
                        <Row>
                            <Col xs={8} className="header">App Settings</Col>
                        </Row>
                        <Row>
                            <Col xs={3}>
                                <a target={'_blank'} href={'https://ipfs.github.io/public-gateway-checker/'}>
                                    Update IPFS Gateway</a>
                            </Col>
                            <Col xs={5}>
                                <input
                                    type="text"
                                    name="web3ctx.ipfsGateway"
                                    style={{width: "250px"}}
                                    defaultValue={web3ctx.ipfsGateway}
                                    onChange={actions.handleInputChange}
                                />
                            </Col>
                        </Row>
                        <Row>
                            <Col xs={3}>Token Address</Col>
                            <Col xs={5}>
                                <input
                                    type="text"
                                    name="web3ctx.tokenAddress"
                                    style={{width: "250px"}}
                                    defaultValue={web3ctx.tokenAddress}
                                    onChange={actions.handleInputChange}
                                />
                            </Col>
                        </Row>
                        <Row>
                            <Col xs={8} className="header">Add Minter</Col>
                        </Row>
                        <Row>
                            <Col xs={2}>New Minter Address</Col>
                            <Col xs={4}>
                                <input
                                    type="text"
                                    name="newMinterAddress"
                                    style={{width: "200px"}}
                                    defaultValue={myToken.newMinterAddress}
                                    onChange={actions.handleInputChange}
                                />
                            </Col>
                            <Col xs={1}>
                                <Button onClick={actions.addMinter}> Add </Button>
                            </Col>
                        </Row>
                    </Grid>
                )}
            </AppContext.Consumer>
        );
    }
}

export default Token;
