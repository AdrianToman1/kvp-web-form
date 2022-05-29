import React, { Component, useEffect } from 'react';
import { withRouter } from 'react-router';
import 'bootstrap/dist/css/bootstrap.min.css';
import { Toast, ToastBody, ToastHeader } from "reactstrap"
import { formatISO, parseISO, format } from "date-fns";

class FeedbackForm extends Component {
    constructor(props) {
        super(props);
        this.state = {
            loading: false,
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
        if (this.props.match.params.id) {
            this.setState({
                loading: true
            })

            fetch(`feedback/${this.props.match.params.id}`,
                {
                    method: "get"
                })
                .then((response) => {
                    if (response.ok) {
                        return response.json()
                    } else if (response.status === 404) {
                        throw new Error("Not Found");
                    }
                })
                .then((responseJson) => {
                    this.setState({
                        loading: false, feedback: {
                            feedbackType: responseJson.feedbackType,
                            feedbackDate: formatISO(parseISO(responseJson.feedbackDate), { representation: 'date' }),
                            comments: responseJson.comments,
                            rating: responseJson.rating
                        }
                    })
                })
                .catch((error) => {
                    if (error.message === "Not Found") {
                        this.setState({
                            loading: false, feedback: {
                                feedbackType: '',
                                feedbackDate: '',
                                comments: "",
                                rating: ""
                            }
                        })
                    } else {
                    }
                });
        }

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
            })

            const feedback1 = {
                id: this.props.match.params.id || null,
                feedbackType: this.state.feedback.feedbackType,
                feedbackDate: (parseISO(this.state.feedback.feedbackDate).toISOString()),
                comments: this.state.feedback.comments,
                rating: this.state.feedback.rating
            }

            if (feedback1.id) {
                fetch(`feedback/${feedback1.id}`,
                    {
                        method: 'put',
                        headers: { 'Content-Type': 'application/json' },
                        body: JSON.stringify(feedback1)
                    }).then((responseJson) => {
                        this.setState({
                            saving: false,
                            showToast: true
                        })
                    })
                    .catch((error) => {
                        if (error.message === "Bad Request") {
                        } else {
                        }
                    })
            } else {
                fetch("feedback",
                    {
                        method: "post",
                        headers: { 'Content-Type': 'application/json' },
                        body: JSON.stringify(feedback1)
                    }).then((responseJson) => {
                        this.setState({
                            saving: false,
                            showToast: true
                        })
                    })
                    .catch((error) => {
                        if (error.message === "Bad Request") {
                        } else {
                        }
                    })
            }
        }
    };

    handleDelete = () => {
        this.setState({
            saving: true
        })

        fetch(`feedback/${this.props.match.params.id}`,
            {
                method: 'delete'
            })
            .then((responseJson) => {
                this.setState({
                    saving: false
                })
                this.props.history.push("/forms")
            })
            .catch((error) => {
                if (error.message === "Not Found") {
                    this.setState({ notFound: true });
                } else if (error.message === "Conflict") {
                    this.setState({ busy: false });
                    this.handleDisallowedDeletion();
                } else {
                    this.setState({ serverError: true });
                }
            });
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
        if (this.state.loading) {
            return (<div className="spinner-border" role="status"><span className="sr-only"></span></div>);
        }

        const { feedback, showToast } = this.state;

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
                    <footer className="card-footer d-flex justify-content-between">
                        <button
                            className="save-button"
                            onClick={this.handleSave}
                            disabled={this.state.saving}
                            label="Save">Save</button>
                        <button
                            className="delete-button"
                            onClick={this.handleDelete}
                            label="Cancel">Delete</button>
                    </footer>
                </div>
                <Toast isOpen={showToast}>
                    <ToastBody>Your feedback has been sent!</ToastBody>
                </Toast>
            </form>
        );
    }
}

export default withRouter(FeedbackForm);