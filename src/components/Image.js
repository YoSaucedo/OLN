import React, {Component} from 'react';
import {Col, Grid, Row, Button} from "react-bootstrap";
import {AppContext} from "../App";

class Image extends Component {

    render() {

        return (
            <AppContext.Consumer>
                {({web3ctx, myToken, actions}) => (
                    <Grid className="App-input">
                        <Row>
                            <Col xs={8} className="header">Image Settings</Col>
                        </Row>
                        <Row>
                            <Col xs={3}>Use Existing IPFS Hash?</Col>
                            <Col xs={5}>
                                <input
                                    type="text"
                                    name="myToken.ipfsImageHash"
                                    style={{width: "300px"}}
                                    defaultValue={myToken.ipfsImageHash}
                                    onChange={actions.handleInputChange}
                                />
                            </Col>
                        </Row>
                        <Row>
                            <Col xs={3}>Choose image to send to IPFS</Col>
                            <Col xs={5}>
                                <input
                                    type="file"
                                    style={{width: "350px"}}
                                    onChange={actions.captureFile}
                                />
                            </Col>
                        </Row>
                        <Row>
                            <Col xs={5}>&nbsp;</Col>
                            <Col xs={3}>
                                <Button onClick={actions.addIpfs}
                                        style={{alignment: 'right'}}
                                        disabled={Boolean(!myToken.imageBuffer || myToken.ipfsImageHash)}>
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

export default Image;