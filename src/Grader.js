import React, { useState, useEffect } from "react";
import "./Grader.css";

const FileName = (props) => <h2>{props.name}</h2>;
const Error = (props) => {
  const { text } = props;
  return <div className="errorContainer">{text}</div>;
};

const Grader = () => {
  const [issues, setIssues] = useState("");
  const [errors, setErrors] = useState([]);
  const [errorsCount, setErrorsCount] = useState(0);

  useEffect(() => {
    fetch("http://localhost:7071/api/products")
      .then((response) => response.json())
      .then((data) => console.log("Serverless Function Data", data))
      .catch((e) => console.log(e.message));
  }, []);

  const updateText = (event) => {
    let text = event.target.value;
    setIssues(text);
    let separatedText = text.split("\n");

    separatedText = separatedText.filter((text) => text !== "");
    let errors = separatedText.map((error) => {
      return {
        text: error,
        type: error.includes(".html") ? "fileName" : "error",
      };
    });

    setErrors(errors);
    setErrorsCount(errors.filter((e) => e.type === "error").length);

    console.log(errors);
  };

  return (
    <div id="container">
      <div>Hello world</div>
      <div className="rawIssues">
        <textarea
          value={issues}
          onChange={updateText}
          cols="80"
          rows="20"
        ></textarea>
      </div>
      <div>
        {errors.length > 0 &&
          errors.map((error, index) => {
            if (error.type === "fileName") {
              return <FileName name={error.text} />;
            }
            return <Error key={index} text={error.text} />;
          })}
      </div>
      <div>
        <h3>Number of errors: {errorsCount}</h3>
      </div>
    </div>
  );
};

export default Grader;
