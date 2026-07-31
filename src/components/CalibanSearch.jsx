import React, {useState, useContext, useTransition, useEffect, useRef} from "react"
import { Container, Row, Col, Form, Button, Card } from "react-bootstrap";
import { useSearchParams, useNavigate } from 'react-router';
import CalibanTextContext from '../calibanTextContext.js';
import { BeatLoader } from 'react-spinners';

function CalibanSearch() {
    const navigate = useNavigate();
    const texts = useContext(CalibanTextContext);
    const [results, updateResults] = useState([]);
    const textBox = useRef();
    const [searchParams] = useSearchParams();
    const searchQuery = searchParams.get('q');
    const [isLoading, startTransition] = useTransition();

    useEffect(() => {
        if (searchQuery) {
            textBox.current.value = searchQuery;
            submitQuery();
        }
    }, [searchQuery]);

    function submitQuery() {
        startTransition(() => {
            const query = textBox.current.value;
            const searchResults = texts.filter((x) => x.words.includes(query));
            updateResults(searchResults);
        });
    }

    const goToAnalyzer = (result) => {
        navigate(`/analyze?q=${result.name},${result.act},${result.scene},${result.line}`);
    }

    function randomWord() {
        startTransition(() => {
            var rand = Math.floor(Math.random() * texts.length);
            const line = texts[rand].words.split(' ');
            rand = Math.floor(Math.random() * line.length);
            const word = line[rand];
            textBox.current.value = word;
            const searchResults = texts.filter((x) => x.words.includes(word));
            updateResults(searchResults);
        });
    }

    return (
        <Container>
            <Form.Group controlId="textBoxForm">
                <Form.Label>Search words or phrase</Form.Label>
                <Form.Control as="textarea" rows="1" ref={textBox} />
                <Button onClick={submitQuery}>Search</Button>
                <Button onClick={randomWord}>I'm feeling lucky</Button>
            </Form.Group>
            {
                isLoading ? 
                    <BeatLoader color="#36d7b7"/> 
                :
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
            }
        </Container>
    )
}
export default CalibanSearch;
