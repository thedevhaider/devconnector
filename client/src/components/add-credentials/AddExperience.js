import React, { Component } from 'react'
import { Link, withRouter } from "react-router-dom";
import TextFieldGroup from "../../components/common/TextFieldGroup";
import TextAreaFieldGroup from "../../components/common/TextAreaFieldGroup";
import { connect } from "react-redux";
import PropTypes from "prop-types";
import { addExperience } from "../../actions/profileAction";

class AddExperience extends Component {
    constructor(props) {
        super(props);
        this.state = {
            company: '',
            title: '',
            location: '',
            from: '',
            to: '',
            current: false,
            description: '',
            errors: {},
            disabled: false
        }

        this.onSubmit = this.onSubmit.bind(this);
        this.onChange = this.onChange.bind(this);
        this.onCheck = this.onCheck.bind(this);
    }
    componentWillReceiveProps(nextProps) {
        if (nextProps.errors) {
            this.setState({ errors: nextProps.errors });
        }
    }
    onSubmit(e) {
        e.preventDefault();
        const expData = {
            company: this.state.company,
            title: this.state.title,
            location: this.state.location,
            from: this.state.from,
            to: this.state.to,
            description: this.state.description,
            current: this.state.current
        }
        this.props.addExperience(expData, this.props.history);
    }
    onChange(e) {
        this.setState({ [e.target.name]: e.target.value });
    }
    onCheck(e) {
        this.setState({
            current: !this.state.current,
            disabled: !this.state.disabled
        });
    }
    render() {
        const { errors } = this.state;
        return (
            <div className="add-experience">
                <div className="container">
                    <div className="row">
                        <div className="col-md-8 m-auto">
                            <Link to="/dashboard" className="btn btn-light">
                                Go Back
                            </Link>
                            <h1 className="display-4 text-center">
                                Add Experience
                            </h1>
                            <p className="lead text-center">
                                Add any job or position that you may had in the past or current
                            </p>
                            <small className="d-block pb-3">* = Required Fields</small>
                            <form onSubmit={this.onSubmit}>
                                <TextFieldGroup
                                    placeholder='* company'
                                    name='company'
                                    value={this.state.company}
                                    onChange={this.onChange}
                                    error={errors.company}
                                ></TextFieldGroup>
                                <TextFieldGroup
                                    placeholder='* Job Title'
                                    name='title'
                                    value={this.state.title}
                                    onChange={this.onChange}
                                    error={errors.title}
                                ></TextFieldGroup>
                                <TextFieldGroup
                                    placeholder='Location'
                                    name='location'
                                    value={this.state.location}
                                    onChange={this.onChange}
                                    error={errors.location}
                                ></TextFieldGroup>
                                <h6>From Date</h6>
                                <TextFieldGroup
                                    name='from'
                                    value={this.state.from}
                                    onChange={this.onChange}
                                    error={errors.from}
                                    type='date'
                                ></TextFieldGroup>
                                <h6>To Date</h6>
                                <TextFieldGroup
                                    name='to'
                                    value={this.state.to}
                                    onChange={this.onChange}
                                    error={errors.to}
                                    type='date'
                                    disabled={this.state.disabled ? 'disabled' : ''}
                                ></TextFieldGroup>
                                <div className="form-check mb-4">
                                    <input
                                        type="checkbox"
                                        className="form-check-input"
                                        name="current"
                                        value={this.state.current}
                                        onChange={this.onCheck}
                                        checked={this.state.current}
                                        id="current"
                                    ></input>
                                    <label htmlFor="current" className="form-check-label">Current Job</label>
                                </div>
                                <TextAreaFieldGroup
                                    placeholder='Job Description'
                                    name='description'
                                    value={this.state.description}
                                    onChange={this.onChange}
                                    error={errors.description}
                                    info="Tell us about the position"
                                ></TextAreaFieldGroup>
                                <input type="submit" value="Submit" className="btn btn-info btn-block mt-4"></input>
                            </form>
                        </div>
                    </div>
                </div>
            </div>
        )
    }
}
AddExperience.propTypes = {
    addExperience: PropTypes.func.isRequired,
    profile: PropTypes.object.isRequired,
    errors: PropTypes.object.isRequired
}
const mapStateToProps = state => ({
    profile: state.profile,
    errors: state.errors
})
export default connect(mapStateToProps, { addExperience })(withRouter(AddExperience));

