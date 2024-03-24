import {useParams} from "react-router-dom"
import Post from "../Post";
import React, { useEffect } from "react";
import { useState } from "react";


function SearchResultsPage(props){
    const {text} = useParams();
    const [posts,setPosts] = useState([]);
    useEffect(() => {
        fetch('http://localhost:4000/post?search='+text).then(response => {
            response.json().then(posts => {
                setPosts(posts);
            });
        })
    }, []);
    return (
        <>
            <div className="posts">  
                {posts.length > 0 && posts.map(post => (
                    <Post {...post}/>
                ))}
            </div>
        </>
    );
}

export default SearchResultsPage