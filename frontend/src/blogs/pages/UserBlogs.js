import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";

import BlogList from "../components/BlogList";
import ErrorModal from "../../shared/components/UIElements/ErrorModal";
import LoadingSpinner from "../../shared/components/UIElements/LoadingSpinner";
import { useHttpClient } from "../../shared/hooks/http-hook";

const UserBlogs = () => {
  const [loadedBlogs, setLoadedBlogs] = useState();
  const { isLoading, error, sendRequest, clearError } = useHttpClient();

  const userId = useParams().userId;

  useEffect(() => {
    const fetchBlogs = async () => {
      try {
        const responseData = await sendRequest(
          `http://localhost:5000/api/blogs/user/${userId}`
        );
        setLoadedBlogs(responseData.blogs);
      } catch (err) {}
    };
    fetchBlogs();
  }, [sendRequest, userId]);

  const blogDeletedHandler = (deletedBlogId) => {
    setLoadedBlogs((prevBlogs) =>
      prevBlogs.filter((blog) => blog.id !== deletedBlogId)
    );
  };

  return (
    <React.Fragment>
      <ErrorModal error={error} onClear={clearError} />
      {isLoading && (
        <div className="center">
          <LoadingSpinner />
        </div>
      )}
      {!isLoading && loadedBlogs && (
        <BlogList items={loadedBlogs} onDeleteBlog={blogDeletedHandler} />
      )}
    </React.Fragment>
  );
};

export default UserBlogs;
