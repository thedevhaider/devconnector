import React, { Component } from 'react'
import PropTypes from "prop-types";
import { connect } from "react-redux";
import PostForm from "./PostForm";
import Spinner from "../../components/common/Spinner";
import { getPosts } from "../../actions/postAction";
import PostFeed from "./PostFeed";

class Posts extends Component {
    componentDidMount() {
        this.props.getPosts();
    }
    render() {
        const { posts, loading } = this.props.post;
        let postContent;
        if (posts === null || loading) {
            postContent = <Spinner />
        } else {
            postContent = <PostFeed posts={posts}></PostFeed>
        }
        return (
            <div className="feed">
                <div className="container">
                    <div className="row">
                        <div className="col-md-12">
                            <PostForm />
                            {postContent}
                        </div>
                    </div>
                </div>
            </div>
        )
    }
}
Posts.propTypes = {
    post: PropTypes.object.isRequired,
    getPosts: PropTypes.func.isRequired
}
const mapStateToProps = state => ({
    post: state.post
})
export default connect(mapStateToProps, { getPosts })(Posts);
