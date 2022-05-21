import React, { Component } from 'react';
import * as feedback from "./Feedback";
//import { formatISO, parseISO, format } from "date-fns";

export class FeedbackForm extends Component {
    constructor(props) {
        super(props);
        this.state = {
            feedback: Object.assign({}, this.props.feedback)
        };

        this.state.feedback.feedbackType = '';
        this.state.feedback.feedbackDate = true;
        this.state.feedback.comments = "";
        this.state.feedback.rating = null;

        this.form = React.createRef();
        this.validate = this.validate.bind(this);
    }

    componentDidMount() {
    }

    validate() {
        return this.form.current.reportValidity();
    }

    handleSave = async () => {
        if (this.validate()) {

            const feedback1 = {
                FeedbackType: this.state.feedback.feedbackType,
                //FeedbackDate: this.state.feedback.feedbackDate,
                Comments: this.state.feedback.comments,
                Rating: this.state.feedback.rating
            };

            feedback.create(feedback1).then((responseJson) => {

            })
            .catch((error) => {
                if (error.message === "Bad Request") {
                } else {
                }
            });
        }
    };

    handleFeedbackTypeChange = e => {
        let feedback = Object.assign({}, this.state.feedback, {
            feedbackType: e.target.value
        });
        this.setState({ feedback });
    };

    handleFeedbackDateChange = e => {
        let feedback = Object.assign({}, this.state.feedback, {
            feedbackDate: e.target.value
        });
        this.setState({ feedback });
    };

    handleCommentsChange = e => {
        let feedback = Object.assign({}, this.state.feedback, {
            comments: e.target.value
        });
        this.setState({ feedback });
    };

    handleRatingChange = e => {
        let feedback = Object.assign({}, this.state.feedback, {
            rating: e.target.value
        });
        this.setState({ feedback });
    };

    render() {
        let { feedback } = this.state;

        return (
            <form ref={this.form} onSubmit={e => e.preventDefault()}>
                <div className="card edit-detail">
                    <header className="card-header">

                    </header>
                    <div className="card-content">
                        <div className="content">
                            <div className="field">
                                <label className="label" htmlFor="feedback-type">
                                    Feedback Type
                                </label>
                                <select
                                    name="feedback-type"
                                    value={feedback.feedbackType}
                                    onChange={this.handleFeedbackTypeChange}>
                                    <option value='complaint'>Complaint</option>
                                    <option value='comment'>Comment</option>
                                    <option value='suggestion'>Suggestion</option>
                                </select>
                            </div>
                            <div className="field">
                                <label className="label" htmlFor="feedback-date">
                                    Date
                                </label>
                                <input
                                    name="feedback-date"
                                    className="input"
                                    type="date"
                                    defaultValue={feedback.feedbackDate}
                                    onChange={this.handleFeedbackDateChange}
                                />
                            </div>
                            <div className="field">
                                <label className="label" htmlFor="Colour">
                                    Comments
                                </label>
                                <input
                                    name="Colour"
                                    className="input"
                                    type="text"
                                    defaultValue={feedback.comment}
                                    onChange={this.handleCommentsChange}
                                />
                            </div>
                            <div className="field">
                                <label className="label" htmlFor="rating">
                                    Rating
                                </label>
                                <input
                                    name="rating"
                                    className="input"
                                    type="number"
                                    defaultValue={feedback.rating}
                                    onChange={this.handleRatingChange}
                                />
                            </div>
                        </div>
                    </div>
                    <footer className="card-footer">
                        <button
                            className="save-button"
                            onClick={this.handleSave}
                            label="Save">Save</button>
                    </footer>
                </div>
            </form>
        );
    }
}