import React, { Component } from 'react'
import { connect } from 'react-redux';
import { withRouter, Link } from "react-router-dom";
import PropTypes from 'prop-types';
import TextFieldGroup from "../common/TextFieldGroup";
import TextAreaFieldGroup from "../common/TextAreaFieldGroup";
import SelectListGroup from "../common/SelectListGroup";
import InputGroup from "../common/InputGroup";
import { createProfile, getCurrentProfile } from "../../actions/profileAction";
import isEmpty from "../../validation/is-empty";


class CreateProfile extends Component {
    constructor(props) {
        super(props);
        this.state = {
            displaySocialInputs: false,
            handle: '',
            company: '',
            website: '',
            location: '',
            status: '',
            skills: '',
            githubusername: '',
            bio: '',
            twittor: '',
            facebook: '',
            linkedin: '',
            youtube: '',
            instagram: '',
            errors: {}
        }

        this.onSubmit = this.onSubmit.bind(this);
        this.onChange = this.onChange.bind(this);
    }
    componentWillReceiveProps(nextProps) {
        if (nextProps.errors) {
            this.setState({ errors: nextProps.errors });
        }
        if (nextProps.profile.profile) {
            const profile = nextProps.profile.profile;

            // Converting skills to CSV
            const skillsCSV = profile.skills.join(',');

            // If state field is empty, make it empty string
            profile.company = !isEmpty(profile.company) ? profile.company : '';
            profile.website = !isEmpty(profile.website) ? profile.website : '';
            profile.location = !isEmpty(profile.location) ? profile.location : '';
            profile.githubusername = !isEmpty(profile.githubusername) ? profile.githubusername : '';
            profile.bio = !isEmpty(profile.bio) ? profile.bio : '';
            profile.social = !isEmpty(profile.social) ? profile.social : '';

            // For social links also
            profile.social = !isEmpty(profile.social) ? profile.social : {};
            profile.social.facebook = !isEmpty(profile.social.facebook) ? profile.social.facebook : '';
            profile.social.twitter = !isEmpty(profile.social.twitter) ? profile.social.twitter : '';
            profile.social.instagram = !isEmpty(profile.social.instagram) ? profile.social.instagram : '';
            profile.social.linkedin = !isEmpty(profile.social.linkedin) ? profile.social.linkedin : '';
            profile.social.youtube = !isEmpty(profile.social.youtube) ? profile.social.youtube : '';

            this.setState({
                company: profile.company,
                handle: profile.handle,
                website: profile.website,
                location: profile.location,
                githubusername: profile.githubusername,
                bio: profile.bio,
                skills: skillsCSV,
                status: profile.status,
                twitter: profile.social.twitter,
                facebook: profile.social.facebook,
                instagram: profile.social.instagram,
                linkedin: profile.social.linkedin,
                youtube: profile.social.youtube
            });
        }
    }
    componentDidMount() {
        this.props.getCurrentProfile();
    }
    onChange(e) {
        this.setState({ [e.target.name]: e.target.value });
    }
    onSubmit(e) {
        e.preventDefault();
        const profileData = {
            handle: this.state.handle,
            company: this.state.company,
            website: this.state.website,
            location: this.state.location,
            status: this.state.status,
            skills: this.state.skills,
            githubusername: this.state.githubusername,
            bio: this.state.bio,
            twitter: this.state.twitter,
            facebook: this.state.facebook,
            linkedin: this.state.linkedin,
            youtube: this.state.youtube,
            instagram: this.state.instagram,
        }
        this.props.createProfile(profileData, this.props.history);
    }
    render() {
        const { errors, displaySocialInputs } = this.state;

        let socialInputs;
        if (displaySocialInputs) {
            socialInputs = (
                <div>
                    <InputGroup
                        placeholder="Twitter Profile URL"
                        error={errors.twitter}
                        name='twitter'
                        icon='fab fa-twitter'
                        value={this.state.twitter}
                        onChange={this.onChange}
                    ></InputGroup>
                    <InputGroup
                        placeholder="Facebook Page URL"
                        error={errors.facebook}
                        name='facebook'
                        icon='fab fa-facebook'
                        value={this.state.facebook}
                        onChange={this.onChange}
                    ></InputGroup>
                    <InputGroup
                        placeholder="LinkedIn Profile URL"
                        error={errors.linkedin}
                        name='linkedin'
                        icon='fab fa-linkedin'
                        value={this.state.linkedin}
                        onChange={this.onChange}
                    ></InputGroup>
                    <InputGroup
                        placeholder="Youtube Profile URL"
                        error={errors.youtube}
                        name='youtube'
                        icon='fab fa-youtube'
                        value={this.state.youtube}
                        onChange={this.onChange}
                    ></InputGroup>
                    <InputGroup
                        placeholder="Instagram Profile URL"
                        error={errors.instagram}
                        name='instagram'
                        icon='fab fa-instagram'
                        value={this.state.instagram}
                        onChange={this.onChange}
                    ></InputGroup>
                </div>
            )
        }
        // Select options for status
        const options = [
            { label: '* Select Professional Status', value: 0 },
            { label: 'Developer', value: 'Developer' },
            { label: 'Junior Developer', value: 'Junior Developer' },
            { label: 'Senior Developer', value: 'Senior Developer' },
            { label: 'Manager', value: 'Manager' },
            { label: 'Student or Learning', value: 'Student or Learning' },
            { label: 'Instructor or Teacher', value: 'Instructor or Teacher' },
            { label: 'Intern', value: 'Intern' },
            { label: 'Other', value: 'Other' },
        ];
        return (
            <div className="create-profile">
                <div className="container">
                    <div className="row">
                        <div className="col-md-8 m-auto">
                            <Link to="/dashboard" className="btn btn-light">
                                Go Back
                            </Link>
                            <h1 className="display-4 text-center">
                                Edit Profile
                            </h1>
                            <small className="d-block pb-3">* = Required Fields</small>
                            <form onSubmit={this.onSubmit}>
                                <TextFieldGroup
                                    placeholder="* Profile handler"
                                    error={errors.handle}
                                    name='handle'
                                    value={this.state.handle}
                                    onChange={this.onChange}
                                    info="A Unique handle for your Profile URL. Your full name, company name, nick name"
                                ></TextFieldGroup>
                                <SelectListGroup
                                    placeholder="status"
                                    error={errors.status}
                                    name='status'
                                    value={this.state.status}
                                    onChange={this.onChange}
                                    options={options}
                                    info="Give us an idea where you are at your career"
                                ></SelectListGroup>
                                <TextFieldGroup
                                    placeholder="Company"
                                    error={errors.company}
                                    name='company'
                                    value={this.state.company}
                                    onChange={this.onChange}
                                    info="Could be your own company or one you work for"
                                ></TextFieldGroup>
                                <TextFieldGroup
                                    placeholder="Website"
                                    error={errors.website}
                                    name='website'
                                    value={this.state.website}
                                    onChange={this.onChange}
                                    info="Could be your own website or a company one"
                                ></TextFieldGroup>
                                <TextFieldGroup
                                    placeholder="Location"
                                    error={errors.location}
                                    name='location'
                                    value={this.state.location}
                                    onChange={this.onChange}
                                    info="City or city & state suggested (eg. Boston, CA)"
                                ></TextFieldGroup>
                                <TextFieldGroup
                                    placeholder="* Skills"
                                    error={errors.skills}
                                    name='skills'
                                    value={this.state.skills}
                                    onChange={this.onChange}
                                    info="Please use comma saprated values (eg. Java, Python, Ruby, Django)"
                                ></TextFieldGroup>
                                <TextFieldGroup
                                    placeholder="Github Username"
                                    error={errors.githubusername}
                                    name='githubusername'
                                    value={this.state.githubusername}
                                    onChange={this.onChange}
                                    info="If you want your latest repos and a Github link, Include your username"
                                ></TextFieldGroup>
                                <TextAreaFieldGroup
                                    placeholder="Short Bio"
                                    error={errors.bio}
                                    name='bio'
                                    value={this.state.bio}
                                    onChange={this.onChange}
                                    info="Tell us a little about yourself"
                                ></TextAreaFieldGroup>
                                <div className="mb-3">
                                    <button
                                        type="button"
                                        onClick={() => {
                                            this.setState(prevState => ({
                                                displaySocialInputs: !prevState.displaySocialInputs
                                            }));
                                        }} className="btn btn-light">Add Social Network Links</button>
                                    <span className="text-muted">Optional</span>
                                </div>
                                {socialInputs}
                                <input type="submit" className="btn btn-info btn-block mt-4" />

                            </form>
                        </div>
                    </div>
                </div>
            </div>
        )
    }
}
CreateProfile.propTypes = {
    getCurrentProfile: PropTypes.func.isRequired,
    profile: PropTypes.object.isRequired,
    errors: PropTypes.object.isRequired
}
const mapStateToProps = state => ({
    profile: state.profile,
    errors: state.errors
});
export default connect(mapStateToProps, { createProfile, getCurrentProfile })(withRouter(CreateProfile));
