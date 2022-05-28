import React, { Component } from 'react';
import { Route, Redirect } from 'react-router';
import { Layout } from './components/Layout';
import { FeedbackForm } from './components/FeedbackForm';

import './custom.css'

export default class App extends Component {
    static displayName = App.name;

    render() {
        return (
            <Layout>
                <Route exact path="/">
                    <Redirect to="/2387bd21-1cae-44ac-ab70-fbabea07569d" />
                </Route>
                <Route exact path='/:id' component={FeedbackForm} />
            </Layout>
        );
    }
}
