import React, { useRef, useContext, useEffect, useState } from "react"
import { Container, Card, Row, Col, Form, Button } from "react-bootstrap";

function CalibanAnalysisWindow(props) {
    return <>
        <h2>Text analysis</h2>
        { 
            props.analysis == null ?
                <p>Select a text to generate analysis</p>
            :
                <>
                <p>Word count: {props.analysis.word_count}</p>
                <p>Unique word count: {props.analysis.unique_word_count}</p>
                <p>Type/Token ratio: {props.analysis.type_token_ratio.toFixed(2)}</p>
                <p>Lexical density: {props.analysis.lexical_density.toFixed(2)}</p>
                <p>Average word length: {props.analysis.average_content_word_length.toFixed(2)}</p>

                <h5>Concordance</h5>
                <Container>
                    <Col xs="auto">
                    {
                        Object.entries(props.analysis.concordance).toSorted((a, b) => b[1].length - a[1].length).map(([word, lineNumbers]) => {
                            return (
                                <Card id="searchResult" key={`card-${word}`} onClick={() => {props.setHighlightedLines(lineNumbers)}}>
                                    <Card.Body><Card.Text>
                                    {word} ({lineNumbers.length})
                                    </Card.Text></Card.Body>
                                </Card>
                            )
                        })
                    }
                    </Col>
                </Container>
                </>
        }
    </>

}
export default CalibanAnalysisWindow;