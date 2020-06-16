import React, {Component} from 'react';
import {Button, Col, Grid, Row} from "react-bootstrap";
import {AppContext} from "../App";

class Metadata extends Component {

    render() {

        return (
            <AppContext.Consumer>
                {({web3ctx, myToken, actions}) => (
                    <Grid className="App-input">
                        <Row>
                            <Col xs={8} className="header">Metadata</Col>
                        </Row>
                        <Row>
                            <Col xs={3}>Set Token Recipient Address</Col>
                            <Col xs={5}>
                                <input
                                    type="text"
                                    name="myToken.recipientAddress"
                                    style={{width: "350px"}}
                                    defaultValue={myToken.recipientAddress}
                                    onChange={actions.handleInputChange}
                                />
                            </Col>
                        </Row>
                        <Row>
                            <Col xs={3}>IPFS Metadata Hash</Col>
                            <Col xs={5}>
                                <input
                                    type="text"
                                    name="myToken.ipfsMetadataHash"
                                    style={{width: "350px"}}
                                    defaultValue={myToken.ipfsMetadataHash}
                                    onChange={actions.handleInputChange}
                                />
                            </Col>
                        </Row>
                        <Row>
                            <Col xs={3}>Item Metadata</Col>
                            <Col xs={5}>
                                <textarea name={'myToken.metadataBuffer'}
                                          onChange={actions.handleMetadataChange}
                                          key={Math.random()}
                                          defaultValue={JSON.stringify(myToken.metadataBuffer, null, 3)}
                                          style={{width: "350px"}}
                                          rows={15}/>
                            </Col>
                        </Row>
                        <Row>
                            <Col xs={8}>
                                <Button onClick={actions.addIpfs}
                                        disabled={Boolean(myToken.ipfsMetadataHash)}>
                                    Upload File
                                </Button>
                            </Col>
                        </Row>
                    </Grid>
                )}
            </AppContext.Consumer>
        );
    }
}

export default Metadata;