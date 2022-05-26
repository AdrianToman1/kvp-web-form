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
                    <Redirect to="/fcb06c64-ce2d-49cc-b0b6-475d67c603d3" />
                </Route>
                <Route exact path='/:id' component={FeedbackForm} />
            </Layout>
        );
    }
}
