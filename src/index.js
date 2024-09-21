// import React from 'react';
// import ReactDOM from 'react-dom';
// import './index.css';
// import App from './App';
// import reportWebVitals from './reportWebVitals';

// // const root = ReactDOM.createRoot(document.getElementById('root'));
// // root.render(
// //   <React.StrictMode>
// //     <App />
// //   </React.StrictMode>
// // );
// ReactDOM.render(<App />, document.getElementById('root'));


// // If you want to start measuring performance in your app, pass a function
// // to log results (for example: reportWebVitals(console.log))
// // or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
// reportWebVitals();


// src/index.js
import React from 'react';
import ReactDOM from 'react-dom';
import App from './App';
import SKUSearch from './SKUSearch';
import AddWarehouseLocation from './addWarehouseLocation';
import { BrowserRouter as Router, Route, Link, Routes} from 'react-router-dom';

ReactDOM.render(
  <Router>
    <nav>
      <Link to="/">1. Generate SKU</Link> | <Link to="/add-location">2. Add Warehouse Location</Link> |{' '}
      <Link to="/search">3. Search SKU</Link> 
    </nav>
    <Routes>
      <Route path="/" element={<App />} />
      <Route path="/search" element={<SKUSearch />} />
      <Route path="/add-location" element={<AddWarehouseLocation />} />
    </Routes>
  </Router>,
  document.getElementById('root')
);
