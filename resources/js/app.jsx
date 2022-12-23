import './bootstrap';

import ReactDOM from 'react-dom/client';        
import { BrowserRouter, Routes, Route } from "react-router-dom";

import Tasks from './components/tasks/Tasks';
import Create from './components/tasks/Create';
import Edit from './components/tasks/Edit';
import Header  from './components/Header';

ReactDOM.createRoot(document.getElementById('app')).render(     
    <div className="row">
        <div className="col-md-12">
            <BrowserRouter>
                <Header />
                <Routes>
                        <Route path="/" exact element={<Tasks />} />
                        <Route path="/create" exact element={<Create />} />
                        <Route path="/edit/:taskId" exact element={<Edit />} />
                </Routes>
            </BrowserRouter>
        </div>
    </div>      
);
