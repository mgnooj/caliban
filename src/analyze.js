function analyze(text) {
    let concordance = {};
    let stopword_concordance = {};

    const stopwords = ['and', 'if', 'the', 'of', 'to', 'from', 'he', 'she', 'it', 'a', 'as',
        'i', 'that', 'you', 'in', 'my', 'is', 'his', 'her', 'with', 'be', 'your', 'me', 'not', 'this', 'for'
    ];
    
    const isAStopword = (word) => stopwords.includes(word);

    for (const line of text) {
        const lineNumber = `${line.act},${line.scene},${line.line}`;
        // We need to eventually make this better, so that contractions make it through
        const tokens = line.words.replace(/[^\w\s]/g, '').toLowerCase().split(" ");
        for (const word of tokens) {
            if (!isAStopword(word)) {
                if (concordance[word]) { concordance[word].push(lineNumber); }
                else { concordance[word] = [lineNumber]; }
            } else {
                if (stopword_concordance[word]) { stopword_concordance[word].push(lineNumber); }
                else { stopword_concordance[word] = [lineNumber]; }
            }
        }
    }

    const unique_content_word_count = Object.keys(concordance).length;
    const unique_stopword_count = Object.keys(stopword_concordance).length;
    const unique_word_count = unique_content_word_count + unique_stopword_count;

    const content_word_count = Object.values(concordance).reduce((acc, val) => acc + val.length, 0);
    const stopword_count = Object.values(stopword_concordance).reduce((acc, val) => acc + val.length, 0);
    const word_count = content_word_count + stopword_count;

    const ttr = word_count > 0 ? (unique_word_count / word_count) : 0;
    const lexical_density = word_count > 0 ? (content_word_count / word_count) : 0;

    const total_content_chars = Object.entries(concordance).reduce((acc, [word, lineNums]) => {
        return acc + (word.length * lineNums.length);
    }, 0);
    const average_content_word_length = content_word_count > 0 ? (total_content_chars / content_word_count) : 0;
    
    const analysis = {
        'concordance': concordance,
        'stopword_concordance': stopword_concordance,
        
        'unique_content_word_count': unique_content_word_count,
        'unique_stopword_count': unique_stopword_count,
        'unique_word_count': unique_word_count,

        'content_word_count': content_word_count,
        'stopword_count': stopword_count,
        'word_count': word_count,

        'type_token_ratio': ttr,
        'lexical_density': lexical_density,
        'average_content_word_length': average_content_word_length
    }

    return analysis;
}

export default analyze;