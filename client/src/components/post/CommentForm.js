import React, { Component } from 'react'
import PropTypes from "prop-types";
import { connect } from "react-redux";
import TextAreaFieldGroup from "../../components/common/TextAreaFieldGroup";
import { addComment } from "../../actions/postAction";

class commentForm extends Component {
    constructor(props) {
        super(props);
        this.state = {
            text: '',
            errors: {}
        }
        this.onChange = this.onChange.bind(this);
        this.onSubmit = this.onSubmit.bind(this);
    }
    onSubmit(e) {
        e.preventDefault();
        const { user } = this.props.auth;
        const commentData = {
            text: this.state.text,
            name: user.name,
            avatar: user.avatar
        }
        this.props.addComment(this.props.postId, commentData);
        this.setState({ text: '' });
    }
    componentWillReceiveProps(nextProps) {
        if (nextProps.errors) {
            this.setState({ errors: nextProps.errors });
        }
    }
    onChange(e) {
        this.setState({ [e.target.name]: e.target.value });
    }
    render() {
        const { errors } = this.state;
        return (
            <div className="post-form mb-3">
                <div className="card card-info">
                    <div className="card-header bg-info text-white">
                        Make a comment...
              </div>
                    <div className="card-body">
                        <form onSubmit={this.onSubmit}>
                            <div className="form-group">
                                <TextAreaFieldGroup
                                    placeholder="Reply to post"
                                    name="text"
                                    onChange={this.onChange}
                                    value={this.state.text}
                                    error={errors.text}
                                ></TextAreaFieldGroup>
                            </div>
                            <button type="submit" className="btn btn-dark">Submit</button>
                        </form>
                    </div>
                </div>
            </div>
        )
    }
}
commentForm.propTypes = {
    addComment: PropTypes.func.isRequired,
    auth: PropTypes.object.isRequired,
    errors: PropTypes.object.isRequired,
    postId: PropTypes.string.isRequired
}
const mapStateToProps = state => ({
    auth: state.auth,
    errors: state.errors
})
export default connect(mapStateToProps, { addComment })(commentForm);
