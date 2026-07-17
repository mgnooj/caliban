import React, { useRef, useContext, useEffect, useState } from "react"
import { Container, Row, Col, Form, Button } from "react-bootstrap";
import { useSearchParams, useNavigate } from 'react-router';
import CalibanAnalysisWindow from "./CalibanAnalysisWindow.jsx";
import CalibanTextContext from '../calibanTextContext.js';
import analyze from '../analyze.js';

function CalibanTextAnalyzer() {
    const texts = useContext(CalibanTextContext);
    const plays = [...new Set(texts.map(x => x.name.replaceAll("_", " ")))];
    const textBox = useRef();
    const speakerBox = useRef();
    const lineBox = useRef();
    const scrollBoxRef = useRef(null);
    const lineRefs = useRef(new Map());

    const floatingSearchButton = useRef();
    const navigate = useNavigate();
    const [text, setText] = useState([]);
    const [selectedText, setSelectedText] = useState("");
    const [analysis, setAnalysis] = useState(null);
    const [searchParams] = useSearchParams();
    const searchQuery = searchParams.get('q');
    const highlightedStyle = {backgroundColor: 'lightgray'};

    const [highlightedLines, setHighlightedLines] = useState([]);

    const pendingScrollLine = useRef(null);

    useEffect(() => {
        if (!searchQuery) return;
        const query = searchQuery.split(',');
        const chosenText = query[0];
        const lineNumber = `${query[1]},${query[2]},${query[3]}`;
        const playName = chosenText.toLowerCase();
        const text = texts.filter((x) => x.name == playName.replaceAll(" ", "_"));
        setText(text);
        setAnalysis(analyze(text));
        pendingScrollLine.current = lineNumber;
        setHighlightedLines([lineNumber]);
    }, [searchQuery]);

    useEffect(() => {
        if (!pendingScrollLine.current) return;
        const target = lineRefs.current.get(pendingScrollLine.current);
        if (target) {
            scrollToLine(pendingScrollLine.current);
            pendingScrollLine.current = null;
        } else {
            scrollToTop();
        }
    }, [text]);

    const highlightLines = (arr) => {
        setHighlightedLines(arr);
        if (arr) { scrollToLine(arr[0]); }
    }

    const handleTextHighlight = (e) => {
        const selection = window.getSelection();
        const highlightedText = selection.toString().trim();
        if (highlightedText.length == 0) { 
            floatingSearchButton.current.style.display = 'none';
            setSelectedText("");
        } else {
            floatingSearchButton.current.style.display = 'block';
            floatingSearchButton.current.style.top = `${e.pageY}px`;
            floatingSearchButton.current.style.left = `${e.pageX}px`;   
            setSelectedText(highlightedText);
        }
    }

    const executeQuery = () => {
        navigate(`/search?q=${selectedText}`);
    }

    const updateText = (play) => {
        const playName = play.toLowerCase();
        const text = texts.filter((x) => x.name == playName.replaceAll(" ", "_"));
        setText(text);
        scrollToTop();
        setHighlightedLines([]);
        setAnalysis(analyze(text));
    }

    const scrollToLine = (lineNumber) => {
        const container = scrollBoxRef.current;
        const target = lineRefs.current.get(lineNumber);
        if (!container || !target) return;
        const containerRect = container.getBoundingClientRect();
        const targetRect = target.getBoundingClientRect();
        const offset = targetRect.top - containerRect.top + container.scrollTop;
        container.scrollTo({ top: offset, behavior: 'smooth' });
    };

    const scrollToTop = () => {
        scrollBoxRef.current?.scrollTo({ top: 0, behavior: 'smooth' });
    };

    return <>
        <Container fluid>
            <Row>
                <Col md={2} className="scroll-box">
                    <div id="texts-list" className="scroll-content">
                        <Row className="gx-5 flex-nowrap">
                            <Col xs="auto">

                                {plays.map((play) => (
                                    <Row key={`${play}-row`}>
                                        <Button onClick={() => updateText(play)} key={play}>{play}</Button>
                                    </Row>
                                ))}
                            </Col>
                        </Row>
                    </div>
                </Col>

                <Col md={8} className="scroll-box" ref={scrollBoxRef}>
                    <div className="scroll-content">
                        <Row className="gx-5 flex-nowrap">
                            <Col xs="auto">
                                {text.map((x) => {
                                    const lineNumber = `${x.act},${x.scene},${x.line}`;
                                    return (
                                        <Row key={`speaker-${lineNumber}`} className="gx-4 flex-nowrap" style={highlightedLines.includes(lineNumber) ? highlightedStyle : {}}>
                                            <Col xs="auto">{lineNumber.replaceAll(',', '.')}</Col>
                                            <Col className="text-end" >{x.speaker.slice(0, 16)}</Col>
                                        </Row>
                                    );
                                })}
                            </Col>
                            <Col xs="auto" onMouseUp={(event) => handleTextHighlight(event)}>
                                {text.map((x) => {
                                    const lineNumber = `${x.act},${x.scene},${x.line}`;
                                    return (
                                        <Row 
                                        key={`words-${lineNumber}`}
                                        style={highlightedLines.includes(lineNumber) ? highlightedStyle : {}}
                                        className="flex-nowrap" 
                                        ref={(el) => {
                                            if (el) lineRefs.current.set(lineNumber, el);
                                            else lineRefs.current.delete(lineNumber);
                                        }}
                                        >
                                            {x.words}
                                        </Row>
                                    );
                                })}
                            </Col>
                        </Row>
                    </div>
                </Col>

                <Col md={2}>
                    <CalibanAnalysisWindow analysis={analysis} setHighlightedLines={highlightLines}></CalibanAnalysisWindow>
                </Col>
            </Row>
        </Container>
        <Button 
            ref={floatingSearchButton} 
            style={{display: 'none', position: 'absolute'}}
            onClick={executeQuery}
        >Search</Button>
    </>
}

export default CalibanTextAnalyzer;
