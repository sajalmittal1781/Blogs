import React, { useEffect, useState, useContext } from "react";
import { useParams, useHistory } from "react-router-dom";

import Input from "../../shared/components/FormElements/Input";
import Button from "../../shared/components/FormElements/Button";
import Card from "../../shared/components/UIElements/Card";
import LoadingSpinner from "../../shared/components/UIElements/LoadingSpinner";
import ErrorModal from "../../shared/components/UIElements/ErrorModal";
import {
  VALIDATOR_REQUIRE,
  VALIDATOR_MINLENGTH,
} from "../../shared/util/validators";
import { useForm } from "../../shared/hooks/form-hook";
import { useHttpClient } from "../../shared/hooks/http-hook";
import { AuthContext } from "../../shared/context/auth-context";
import "./BlogForm.css";

const UpdateBlog = () => {
  const auth = useContext(AuthContext);
  const { isLoading, error, sendRequest, clearError } = useHttpClient();
  const [loadedBlog, setLoadedBlog] = useState();
  const blogId = useParams().blogId;
  const history = useHistory();

  const [formState, inputHandler, setFormData] = useForm(
    {
      title: {
        value: "",
        isValid: false,
      },
      description: {
        value: "",
        isValid: false,
      },
    },
    false
  );

  useEffect(() => {
    const fetchBlog = async () => {
      try {
        const responseData = await sendRequest(
          `https://mern-l4s5.onrender.com/api/blogs/${blogId}`
        );
        setLoadedBlog(responseData.blog);
        setFormData(
          {
            title: {
              value: responseData.blog.title,
              isValid: true,
            },
            description: {
              value: responseData.blog.description,
              isValid: true,
            },
          },
          true
        );
      } catch (err) {}
    };
    fetchBlog();
  }, [sendRequest, blogId, setFormData]);

  const blogUpdateSubmitHandler = async (event) => {
    event.preventDefault();
    try {
      await sendRequest(
        `https://mern-l4s5.onrender.com/api/blogs/${blogId}`,
        "PATCH",
        JSON.stringify({
          title: formState.inputs.title.value,
          description: formState.inputs.description.value,
        }),
        {
          "Content-Type": "application/json",
        }
      );
      history.push("/" + auth.userId + "/blogs");
    } catch (err) {}
  };

  if (isLoading) {
    return (
      <div className="center">
        <LoadingSpinner />
      </div>
    );
  }

  if (!loadedBlog && !error) {
    return (
      <div className="center">
        <Card>
          <h2>Could not find blog!</h2>
        </Card>
      </div>
    );
  }

  return (
    <React.Fragment>
      <ErrorModal error={error} onClear={clearError} />
      {!isLoading && loadedBlog && (
        <form className="blog-form" onSubmit={blogUpdateSubmitHandler}>
          <Input
            id="title"
            element="input"
            type="text"
            label="Title"
            validators={[VALIDATOR_REQUIRE()]}
            errorText="Please enter a valid title."
            onInput={inputHandler}
            initialValue={loadedBlog.title}
            initialValid={true}
          />
          <Input
            id="description"
            element="textarea"
            label="Description"
            validators={[VALIDATOR_MINLENGTH(5)]}
            errorText="Please enter a valid description (min. 5 characters)."
            onInput={inputHandler}
            initialValue={loadedBlog.description}
            initialValid={true}
          />
          <Button type="submit" disabled={!formState.isValid}>
            UPDATE BLOG
          </Button>
        </form>
      )}
    </React.Fragment>
  );
};

export default UpdateBlog;
