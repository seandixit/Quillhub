import './App.css';
// @ts-ignore
import Post from './Post.js';
import Header from './Header';
import {Route, Routes} from "react-router-dom";
import Layout from "./Layout";
import HomePage from "./pages/HomePage";
import LoginPage from "./pages/LoginPage";
import RegisterPage from './pages/RegisterPage.js';
import { UserContextProvider } from './UserContext.js';
import CreatePost from './pages/CreatePost.js';
import RedirectContext from './RedirectContext.js';
import {useState, useEffect} from "react";
import {Navigate} from "react-router-dom";
import SearchResultsPage from "./pages/SearchResultsPage.js"

function App() {
  const [redirect ,setRedirect] = useState(false);
  useEffect(()=>{
    if (redirect){
      setRedirect(false);
    }
  }, [redirect]);
  return (
    <UserContextProvider>
      <RedirectContext.Provider value={{redirect,setRedirect}}> 
            {redirect && (
              <Navigate to={redirect} />
            )}
            {!redirect && (
              <>
              <Routes>
                  <Route path="/" element={<Layout />}>
                  <Route index element={<HomePage />} />
                  <Route path='/login' element={<LoginPage />} />
                  <Route path="/register" element={<RegisterPage />} />
                  <Route path="/create" element={<CreatePost />} />
                  <Route path="/search/:text" element={<SearchResultsPage />} />
                  </Route>
                </Routes>
              </>
            )}
      </RedirectContext.Provider>
    </UserContextProvider>
  );
}

export default App;
