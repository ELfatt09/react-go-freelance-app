import Layout from './layout/Layout';
import { BrowserRouter as Router,  Route, Routes } from 'react-router-dom';
import Home from './pages/Home';

function App() {
  return (
    <div id='app'>
        <Router>
        <Layout>
          <Routes>
            <Route path="/" element={<Home />} />
          </Routes>
          </Layout>
        </Router>
    </div>
  );
}

export default App;
