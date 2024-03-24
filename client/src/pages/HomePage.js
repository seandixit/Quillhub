import { PlusIcon } from "@heroicons/react/outline";
import Post from "../Post";
import React, { useEffect } from "react";
import {useContext, useState} from "react";
import {UserContext} from "../UserContext";
import { Link } from "react-router-dom";

export default function HomePage() {
    const {setUserInfo, userInfo} = useContext(UserContext);
    const username = userInfo?.username;
    const [posts,setPosts] = useState([]);
    useEffect(() => {
        fetch('http://localhost:4000/post').then(response => {
            response.json().then(posts => {
                setPosts(posts);
            });
        })
    }, []);
    return (
        <>
            <div className="posts"> 
                {username && (
                    <>
                        <div className="create-post">
                            <img src = {require("../default_user.png")} style={{ width: 40, height: 40 }} classname="avatar_home"/> 
                            <Link to="/create" className="create-post-button">
                                <PlusIcon className="plus-icon"/>
                                <input type="text" className="create-post-input" placeholder="Go ahead, write away!"/>
                            </Link>
                        </div> 
                    </>
                )}
                {posts.length > 0 && posts.map(post => (
                    <Post {...post}/>
                ))}
            </div>
        </>
    );
}