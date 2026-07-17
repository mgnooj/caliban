import React from 'react';
import { BrowserRouter, Route, Routes } from 'react-router';

import CalibanLayout from './components/CalibanLayout.jsx';
import CalibanTextAnalyzer from './components/CalibanTextAnalyzer.jsx';
import CalibanSearch from './components/CalibanSearch.jsx';
import CalibanAboutPage from './components/CalibanAboutPage.jsx';
import CalibanNoMatch from './components/CalibanNoMatch.jsx';

function CalibanApp() {

    return (
        <BrowserRouter basename="/caliban">
        <Routes>
            <Route path="/" element={<CalibanLayout />}>
                <Route index element={<CalibanTextAnalyzer />} />
                <Route path="/analyze" element={<CalibanTextAnalyzer />}></Route>
                <Route path="/search" element={<CalibanSearch />}></Route>
                <Route path="/about" element={<CalibanAboutPage />}></Route>
                <Route path="*" element={<CalibanNoMatch />} />
            </Route>
        </Routes>
        </BrowserRouter>
    )
}
export default CalibanApp;
