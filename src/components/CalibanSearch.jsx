import React, {useState, useContext, useEffect, useRef} from "react"
import { Container, Row, Col, Form, Button, Card } from "react-bootstrap";
import { useSearchParams, useNavigate } from 'react-router';
import CalibanTextContext from '../calibanTextContext.js';

function CalibanSearch() {
    const navigate = useNavigate();
    const texts = useContext(CalibanTextContext);
    const [results, updateResults] = useState([]);
    const textBox = useRef();
    const [searchParams] = useSearchParams();
    const searchQuery = searchParams.get('q');

    useEffect(() => {
        if (searchQuery) {
            textBox.current.value = searchQuery;
            submitQuery();
        }
    }, [searchQuery]);

    function submitQuery() {
        const query = textBox.current.value;
        const searchResults = texts.filter((x) => x.words.includes(query));
        updateResults(searchResults);
    }

    const goToAnalyzer = (result) => {
        navigate(`/analyze?q=${result.name},${result.act},${result.scene},${result.line}`);
    }

    return (
        <Container>
            <Form.Group controlId="textBoxForm">
                <Form.Label>Search words or phrase</Form.Label>
                <Form.Control as="textarea" rows="1" ref={textBox} />
                <Button onClick={submitQuery}>Search</Button>
            </Form.Group>

            <Col>
                <p>{`Your query returned ${results.length} results`}</p>
                {
                    results == [] ? 
                        <></>
                    :
                    [...results.entries()].map(([index, result]) => {
                        return (
                            <Row key={`${index}-${result.name}`}>
                                <Card 
                                    onClick={() => goToAnalyzer(result)}
                                    id='searchResult'
                                >
                                    <Card.Body>
                                        <Card.Title>{result.name}, {result.act}.{result.scene}.{result.line}</Card.Title>
                                        <Card.Text>{result.speaker}: {result.words}</Card.Text>
                                    </Card.Body>
                                </Card>
                            </Row>
                        )
                    })
                }
            </Col>
        </Container>
    )
}
export default CalibanSearch;
