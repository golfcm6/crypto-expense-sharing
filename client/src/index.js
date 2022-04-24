import React from 'react';
import { render } from "react-dom";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { initializeApp } from "firebase/app";
import { getDatabase } from "firebase/database";

import * as serviceWorker from './serviceWorker';

import App from './App';
import NewGroup from './NewGroup';
import GroupPage from './GroupPage';
import Homepage from './Homepage';
import NewTransaction from './NewTransaction';
import Login from './Login';
import Onboard from './Onboard';

import './index.css';

const firebaseConfig = {
  apiKey: "AIzaSyD_XFPynusXX7KCZSCfyr0PEyPs9lUlSNw",
  authDomain: "distro-ccc95.firebaseapp.com",
  databaseURL: "https://distro-ccc95-default-rtdb.firebaseio.com",
  projectId: "distro-ccc95",
  storageBucket: "distro-ccc95.appspot.com",
  messagingSenderId: "647322774764",
  appId: "1:647322774764:web:7077559218ae17873e89c9",
  measurementId: "G-MX3ZXBFLRM"
};

const firebaseApp = initializeApp(firebaseConfig);
const db = getDatabase();

const rootElement = document.getElementById("root");
render(
    <BrowserRouter>
        <Routes>
            <Route path="/" element={<App />}>
                <Route path="user/:username" element={<Homepage db = {db} />} />
                <Route path="newgroup" element={<NewGroup db = {db} />} />
                <Route path="group/:groupID" element={<GroupPage db = {db} />} />
                <Route path="newtransaction/:groupID" element={<NewTransaction db = {db} />} />
            </Route>
            <Route path="/login" element={<Login db = {db} />} />
            <Route path="/newuser" element={<Onboard db = {db} />} />
        </Routes>
    </BrowserRouter>,
    rootElement
);

// If you want your app to work offline and load faster, you can change
// unregister() to register() below. Note this comes with some pitfalls.
// Learn more about service workers: https://bit.ly/CRA-PWA
serviceWorker.unregister();
