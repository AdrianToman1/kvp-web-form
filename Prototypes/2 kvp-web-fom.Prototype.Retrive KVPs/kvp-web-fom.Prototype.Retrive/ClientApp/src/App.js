import React, { Component } from 'react';
import { Route, Redirect, Switch } from 'react-router';
import { Layout } from './components/Layout';
import FormsList from './components/FormsList';
import FeedbackForm from './components/FeedbackForm';

import './custom.css'

export default class App extends Component {
    static displayName = App.name;

    render() {
        return (
            <Layout>
            <Switch> 
            <Route exact path="/">
                    <Redirect to="/forms" />
                </Route>
                <Route exact path="/forms/new" component={FeedbackForm} />
                <Route exact path="/forms/:id" component={FeedbackForm} />
                <Route exact path="/forms" component={FormsList} />
                <Route exact path="**">
                    <Redirect to="/forms" />
                    </Route>
            </Switch> 
            </Layout>
        );
    }
}
