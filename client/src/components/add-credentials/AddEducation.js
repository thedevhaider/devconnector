import React, { Component } from 'react'
import { Link, withRouter } from "react-router-dom";
import TextFieldGroup from "../../components/common/TextFieldGroup";
import TextAreaFieldGroup from "../../components/common/TextAreaFieldGroup";
import { connect } from "react-redux";
import PropTypes from "prop-types";
import { addEducation } from "../../actions/profileAction";

class AddEducation extends Component {
    constructor(props) {
        super(props);
        this.state = {
            school: '',
            degree: '',
            fieldofstudy: '',
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
        const eduData = {
            school: this.state.school,
            degree: this.state.degree,
            fieldofstudy: this.state.fieldofstudy,
            from: this.state.from,
            to: this.state.to,
            description: this.state.description,
            current: this.state.current
        }
        this.props.addEducation(eduData, this.props.history);
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
            <div className="add-education">
                <div className="container">
                    <div className="row">
                        <div className="col-md-8 m-auto">
                            <Link to="/dashboard" className="btn btn-light">
                                Go Back
                            </Link>
                            <h1 className="display-4 text-center">
                                Add Education
                            </h1>
                            <p className="lead text-center">
                                Add any school, bootcamp etc you have attended
                            </p>
                            <small className="d-block pb-3">* = Required Fields</small>
                            <form onSubmit={this.onSubmit}>
                                <TextFieldGroup
                                    placeholder='* School'
                                    name='school'
                                    value={this.state.school}
                                    onChange={this.onChange}
                                    error={errors.school}
                                ></TextFieldGroup>
                                <TextFieldGroup
                                    placeholder='* Degree'
                                    name='degree'
                                    value={this.state.degree}
                                    onChange={this.onChange}
                                    error={errors.degree}
                                ></TextFieldGroup>
                                <TextFieldGroup
                                    placeholder='* Field of Study'
                                    name='fieldofstudy'
                                    value={this.state.fieldofstudy}
                                    onChange={this.onChange}
                                    error={errors.fieldofstudy}
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
                                    placeholder='Program Description'
                                    name='description'
                                    value={this.state.description}
                                    onChange={this.onChange}
                                    error={errors.description}
                                    info="Tell us about the program that you were in"
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
AddEducation.propTypes = {
    addEducation: PropTypes.func.isRequired,
    profile: PropTypes.object.isRequired,
    errors: PropTypes.object.isRequired
}
const mapStateToProps = state => ({
    profile: state.profile,
    errors: state.errors
})
export default connect(mapStateToProps, { addEducation })(withRouter(AddEducation));

