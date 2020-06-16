import React, {Component} from 'react';
import {Col, Grid, Row} from "react-bootstrap";

class Home extends Component {

    render() {

        return (
            <Grid>
                <Row>
                    <Col xs={8} className="header">Welcome to Artists' Liberation Front!</Col>
                </Row>
                <Row>
                    <Col xs={8}>
                        <p>
                            ALF tokens allow artists to tokenize digital content with some assurance of
                            provenance to customers. These tokens can be traded on any digital marketplace
                            that is compliant with ERC-721.
                        </p>

                        <p>In order to mint an ALF token you must:</p>
                        <ol>
                            <li>Be added as a minter on the ALF token contract</li>
                            <li>Provide your digital image for upload</li>
                            <li>Choose the recipient wallet for your token</li>
                            <li>Provide metadata about your digital asset</li>
                        </ol>

                        <p>
                            You may enter the required data points in each tab, and track the metadata
                            being created on the <code>My Token</code> tab. Click on <code>Choose Image</code>
                            to get started!
                        </p>
                    </Col>
                </Row>
            </Grid>
        );
    }
}

export default Home;
