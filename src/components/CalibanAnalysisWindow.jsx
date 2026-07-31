import React, { useRef, useContext, useEffect, useState } from "react"
import { Container, Card, Row, Col, Form, Button, Pagination } from "react-bootstrap";
import { Tooltip } from 'react-tooltip';

function CalibanAnalysisWindow(props) {
    const [currentPage, setCurrentPage] = useState(1);
    const itemsPerPage = 16;
    
    const wordCountDescription = "total # words in text";
    const uniqueWordCountDescription = "total # unique words in text";
    const ttrDescription = "unique words / total words";
    const lexicalDensityDescription = "% of content words (unique words - prepositions, pronouns, etc.)";
    const averageWordLengthDescription = "sum [length(word) : word in text] / # num words in text";

    const sortedEntries = props.analysis == null ? [] :
        Object.entries(props.analysis.concordance).toSorted(
        (a, b) => b[1].length - a[1].length
    );

    const totalPages = Math.ceil(sortedEntries.length / itemsPerPage);
    const startIndex = (currentPage - 1) * itemsPerPage;
    const currentEntries = sortedEntries.slice(startIndex, startIndex + itemsPerPage);
    
    return <>
        <Container id="textAnalysisBox">
        <h4>Text analysis</h4>
        { 
            props.analysis == null ?
                <p>Select a text to generate analysis</p>
            :
                <>
                <Container>
                    <Row>
                        <Col>
                            <p id="dataDisplayField" data-tooltip-id="caliban-tooltip" data-tooltip-content={wordCountDescription}>Word count</p>
                        </Col>
                        <Col>
                            {props.analysis.word_count}
                        </Col>
                    </Row>
                    <Row>
                        <Col>
                            <p id="dataDisplayField" data-tooltip-id="caliban-tooltip" data-tooltip-content={uniqueWordCountDescription}>Unique word count</p>
                        </Col>
                        <Col>
                            {props.analysis.unique_word_count}
                        </Col>
                    </Row>
                    <Row>
                        <Col>
                            <p id="dataDisplayField" data-tooltip-id="caliban-tooltip" data-tooltip-content={ttrDescription}>Type/Token ratio</p>
                        </Col>
                        <Col>
                            {props.analysis.type_token_ratio.toFixed(2)}
                        </Col>
                    </Row>   
                    <Row>
                        <Col>
                            <p id="dataDisplayField" data-tooltip-id="caliban-tooltip" data-tooltip-content={lexicalDensityDescription}>Lexical density</p>
                        </Col>
                        <Col>
                            {props.analysis.lexical_density.toFixed(2)}
                        </Col>
                    </Row>
                    <Row>
                        <Col>
                            <p id="dataDisplayField" data-tooltip-id="caliban-tooltip" data-tooltip-content={averageWordLengthDescription}>Avg word length</p>
                        </Col>
                        <Col>
                            {props.analysis.average_content_word_length.toFixed(2)}
                        </Col>
                    </Row>
                </Container>
                <Tooltip id="caliban-tooltip" />

                <h6>Concordance</h6>
                <Container>
                    <Row className="g-3">
                        {currentEntries.map(([word, lineNumbers]) => (
                            <Col xs={3} key={`card-${word}`}>
                            <Card
                              id="concordanceResult"
                              onClick={() => props.setHighlightedLines(lineNumbers)}
                            >
                                <Card.Body>
                                    <Card.Text>
                                        {[word, <br/>, `(${lineNumbers.length})`]}
                                    </Card.Text>
                                </Card.Body>
                            </Card>
                            </Col>
                        ))}
                    </Row>
                
                    {totalPages > 1 && (
                        <Row>
                            <Col className="d-flex justify-content-center align-items-center">                                <Pagination>
                                <Pagination.First 
                                    disabled={currentPage === 1} 
                                    onClick={() => setCurrentPage(1)} 
                                />
                                <Pagination.Prev 
                                    disabled={currentPage === 1} 
                                    onClick={() => setCurrentPage((prev) => Math.max(prev - 1, 1))} 
                                />

                                <Pagination.Item active>{currentPage}</Pagination.Item>

                                <Pagination.Next 
                                    disabled={currentPage === totalPages} 
                                    onClick={() => setCurrentPage((prev) => Math.min(prev + 1, totalPages))} 
                                />
                                <Pagination.Last 
                                    disabled={currentPage === totalPages} 
                                    onClick={() => setCurrentPage(totalPages)} 
                                />
                                </Pagination>
                        </Col>
                        </Row>
                    )}
                </Container>                
                </>
        }
        </Container>
    </>
}

export default CalibanAnalysisWindow;