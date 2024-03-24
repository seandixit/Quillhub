import {Link} from "react-router-dom";
import {useContext, useEffect, useState} from "react";
import {UserContext} from "./UserContext";
import {
    BellIcon,
    ChatIcon,
    ChevronDownIcon,
    LoginIcon,
    LogoutIcon,
    PlusIcon,
    SearchIcon,
    UserIcon
  } from "@heroicons/react/outline";
import ClickOutHandler from 'react-clickout-handler';
import RedirectContext from "./RedirectContext";

export default function Header() {
    const {setUserInfo, userInfo} = useContext(UserContext);
    const username = userInfo?.username;
    const [userDropdownVisibilityClass,setUserDropdownVisibilityClass] = useState('none');
    const [searchText,setSearchText] = useState('');
    const {setRedirect} = useContext(RedirectContext);

    useEffect(() => {
        fetch('http://localhost:4000/profile', {
            credentials: 'include', 
        }).then(response => {
            response.json().then(userInfo => {
                setUserInfo(userInfo);
            })
        });
    }, []);

    function logout(){
        //invalidate cookie
        fetch('http://localhost:4000/logout', {
            credentials: 'include',
            method: 'POST'
        });
        setUserInfo(null);
    }

    function toggleUserDropdown() {
        if (userDropdownVisibilityClass === 'none') {
          setUserDropdownVisibilityClass('block');
        } else {
          setUserDropdownVisibilityClass('none');
        }
      }
    function doSearch(ev) {
        ev.preventDefault();
        if (searchText.trim() !== "") {
            setRedirect('/search/'+encodeURIComponent(searchText));
          } else {
            console.log("No search text entered");
          }
    }
    return (
    <header className="headerHeader">
        <Link to="/" className="logo">
        <img src={require("./logo1.png")} alt="logo" className="mainLogo"/><p className="logoText">QuillHub</p></Link>
        <form action="" onSubmit={doSearch} className="search-form">
            <SearchIcon className="search-icon" />
            <input type="text" name="search" value={searchText} onChange={ev => setSearchText(ev.target.value)} id="search" placeholder="Search..." />
        </form>

        {!username && (
            <>
                <button className="loginButton"> <Link to="/login"><b>Login</b></Link> </button>
                <button className="registerButton"> <Link to="/register"><b>Register</b></Link> </button>
            </>
        )}

        {username && ( //TODO: userInfo should have avatar
        <>
            <div className="user-info-container">
            <ClickOutHandler className="clickout" onClickOut={() => setUserDropdownVisibilityClass('none')}>
                    <button className="userButton" onClick={toggleUserDropdown}>
            <div className="avatar">
                <img src = {require("./default_user.png")} alt="avatar"/> 
            </div>
            <span className="username">{username}</span>
            <ChevronDownIcon className="chevronDownIcon" />
            </button>

            <div className={'dropdown'} style={{ display: userDropdownVisibilityClass}}>
                {username && (
                    <span className="userDropdownItem">
                        Hello, {username}!
                    </span>
                )}
                
                {username && (
                    <>
                        <Link to="/create">Create new post</Link>
                        <a onClick={logout}>Logout</a>
                    </>
                )}
            </div>
            </ClickOutHandler>
            </div>
        </>
        )}
      </header>
    )
}