import React, { Component, useEffect } from 'react';
import 'bootstrap/dist/css/bootstrap.min.css';
import { Toast, ToastBody, ToastHeader } from "reactstrap"
import { formatISO, parseISO, format } from "date-fns";

export class FeedbackForm extends Component {
    constructor(props) {
        super(props);
        this.state = {
            saving: false,
            showToast: false,
            feedback: Object.assign({}, this.props.feedback)
        };

        this.state.feedback.feedbackType = ''
        this.state.feedback.feedbackDate = ''
        this.state.feedback.comments = ''
        this.state.feedback.rating = ''

        this.form = React.createRef();
        this.toast = React.createRef();

        this.validate = this.validate.bind(this);
    }

    componentDidMount() {
        if (this.state.showToast) {
            setTimeout(() => this.setState({ showToast: false }), 3000)
        }
    }

    componentDidUpdate() {
        if (this.state.showToast) {
            setTimeout(() => this.setState({ showToast: false }), 3000)
        }
    }

    validate() {
        return this.form.current.reportValidity();
    }

    handleSave = () => {
        if (this.validate()) {
            this.setState({
                saving: true
            });

            const feedback1 = {
                FeedbackType: this.state.feedback.feedbackType,
                FeedbackDate: (parseISO(this.state.feedback.feedbackDate).toISOString()),
                Comments: this.state.feedback.comments,
                Rating: this.state.feedback.rating
            };

            fetch('feedback',
                {
                    method: 'post',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify(feedback1)
                }).then((responseJson) => {
                    this.setState({
                        saving: false,
                        showToast: true,
                        feedback: {
                            feedbackType: '',
                            feedbackDate: '',
                            comments: '',
                            rating: ''
                        }
                    });
                })
                .catch((error) => {
                    if (error.message === "Bad Request") {
                    } else {
                    }
                });
        }
    };

    handleFeedbackTypeChange = e => {
        const feedback = Object.assign({}, this.state.feedback, {
            feedbackType: e.target.value
        });
        this.setState({ feedback });
    };

    handleFeedbackDateChange = e => {
        const feedback = Object.assign({}, this.state.feedback, {
            feedbackDate: e.target.value
        });
        this.setState({ feedback });
    };

    handleCommentsChange = e => {
        const feedback = Object.assign({}, this.state.feedback, {
            comments: e.target.value
        });
        this.setState({ feedback });
    };

    handleRatingChange = e => {
        const feedback = Object.assign({}, this.state.feedback, {
            rating: e.target.value
        });
        this.setState({ feedback });
    };

    render() {
        let { feedback, showToast } = this.state;

        return (
            <form className="feedback-form" ref={this.form} onSubmit={e => e.preventDefault()}>
                <div className="card edit-detail">
                    <header className="card-header">
                        <h1>Feedback Form</h1>
                    </header>
                    <div className="card-content">
                        <div className="content">
                            <div className="mb-3">
                                <label className="form-label" htmlFor="feedback-type">
                                    Feedback Type
                                </label>
                                <select
                                    name="feedback-type"
                                    className="form-control"
                                    value={feedback.feedbackType}
                                    onChange={this.handleFeedbackTypeChange}>
                                    <option value=''>Select Feedback Type...</option>
                                    <option value='complaint'>Complaint</option>
                                    <option value='comment'>Comment</option>
                                    <option value='suggestion'>Suggestion</option>
                                </select>
                            </div>
                            <div className="mb-3">
                                <label className="form-label" htmlFor="feedback-date">
                                    Date
                                </label>
                                <input
                                    name="feedback-date"
                                    className="form-control"
                                    type="date"
                                    value={feedback.feedbackDate}
                                    onChange={this.handleFeedbackDateChange}
                                />
                            </div>
                            <div className="mb-3">
                                <label className="form-label" htmlFor="comments">
                                    Comments
                                </label>
                                <textarea
                                    name="comments"
                                    className="form-control"
                                    value={feedback.comments}
                                    rows="4"
                                    onChange={this.handleCommentsChange}
                                />
                            </div>
                            <div className="mb-3">
                                <label className="form-label" htmlFor="rating">
                                    Rating
                                </label>
                                <input
                                    name="rating"
                                    className="form-control"
                                    type="number"
                                    value={feedback.rating}
                                    onChange={this.handleRatingChange}
                                />
                            </div>
                        </div>
                    </div>
                    <footer className="card-footer">
                        <button
                            className="save-button"
                            onClick={this.handleSave}
                            disabled={this.state.saving}
                            label="Save">Save</button>
                    </footer>
                </div>
                <Toast isOpen={showToast}>
                    <ToastHeader>
                        <img
                            src="holder.js/20x20?text=%20"
                            className="rounded me-2"
                            alt=""
                        />
                        <strong className="me-auto">Bootstrap</strong>
                        <small>11 mins ago</small>
                    </ToastHeader>
                    <ToastBody>Woohoo, you're reading this text in a Toast!</ToastBody>
                </Toast>
            </form>
        );
    }
}