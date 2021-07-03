import React from "react";
import "./MainPage.css";
import Feed from "../feed/Feed";
import { useState, useEffect, useLocation } from "react";
import { db } from "../firebase/firebase";
import firebase from "../firebase/firebase";
import Nav from "../nav/Nav";
import { BrowserRouter as Router, Link } from "react-router-dom";
import FeedCreate from "../feedcreate/FeedCreate";

const MainPage = () => {
  const [feeds, setFeeds] = useState([]);
  const user = firebase.auth().currentUser;
  useEffect(() => {
    if (user !== null) {
      const displayName = user.displayName;
      const email = user.email;
    }
  }, []);

  useEffect(() => {
    //this is where the code runs
    db.collection("feeds").onSnapshot((snapshot) => {
      //every single time a new feeds is added, this code runs
      setFeeds(snapshot.docs.map((doc) => ({ id: doc.id, feed: doc.data() })));
    });
  }, []);
  return (
    <div className="app">
      <Nav />
      {/* Header */}
      <div className="app__body">
        <h1>Hello, This is LocalPeople🦖</h1>
        {/*<CheckboxLabels></CheckboxLabels>*/}
        {feeds.map(({ id, feed }) => (
          <Feed
            key={id}
            postId={id}
            user={user.displayName}
            username={feed.username}
            description={feed.description}
            imageUrl={feed.imageUrl}
          />
        ))}
        {/* Feeds */}
      </div>
      {/*<Link to="/fetchingtest">fetch</Link>*/}
    </div>
  );
};

export default MainPage;
