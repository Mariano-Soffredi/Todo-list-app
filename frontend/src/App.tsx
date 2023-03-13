import { Route, Routes } from 'react-router';
import { BrowserRouter } from 'react-router-dom';
import useSession from './hooks/useSession';
import Home from './pages/Home';
import LoggedOut from './pages/LoggedOut';
import NotFoundPage from './pages/NotFoundPage';
import View from './pages/View';

function App() {
  const { loggedInUser, loading, setLoggedInUser } = useSession();

  return (
    <BrowserRouter>
      <div>
        {!loading && !loggedInUser &&
          <LoggedOut setLoggedInUser={setLoggedInUser} />
        }
        {!loading && loggedInUser &&
          <Routes>
            <Route path='/' element={<Home loggedInUser={loggedInUser} setLoggedInUser={setLoggedInUser} />} />
            <Route path='/view' element={<View loggedInUser={loggedInUser} setLoggedInUser={setLoggedInUser} />} />
            <Route path='/*' element={<NotFoundPage />} />
          </Routes>
        }
      </div>
    </BrowserRouter>
  );
}

export default App;
