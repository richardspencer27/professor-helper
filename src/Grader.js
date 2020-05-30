import React, { useState, useEffect } from "react";
import "./Grader.css";

const FileName = (props) => <h2>{props.name}</h2>;
const Error = (props) => {
  const { text, assignmentNumber, pointsToTakeAway } = props;
  return (
    <div className="errorContainer">
      {text}
      <div>assignmentNumber:{assignmentNumber}</div>
      <div>pointsToTakeAway:{pointsToTakeAway}</div>
    </div>
  );
};

const testRawIssue = `index.html

<footer> should have a properly structured email (mailto) link [SS2]
the footer links (EXCEPT for the mailto one) should have attribute of target="_blank" [SS2]
<footer> should NOT have any <p> elements...it is not a paragraph [SS2]
 education.html

<footer> should have a properly structured email (mailto) link [SS2]
the footer links (EXCEPT for the mailto one) should have attribute of target="_blank" [SS2]
<footer> should NOT have any <p> elements...it is not a paragraph [SS2]
the school links should have attribute of target="_blank" [SS2]
all school links should go around the h3 (i.e., <a href...><h3>...</h3></a>) [SS2]`;
const Grader = () => {
  const [issues, setIssues] = useState(testRawIssue);
  const [errors, setErrors] = useState([]);
  const [errorsCount, setErrorsCount] = useState(0);
  const [currentAssignmentNumber, setCurrentAssignmentNumber] = useState(1);

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
      let assignmentNumber = 0;
      if (text.includes("]")) {
        assignmentNumber = error.substring(error.length - 2, error.length - 1);
      }

      let pointsToTakeAway = 0;
      if (currentAssignmentNumber === assignmentNumber) {
        pointsToTakeAway = 1;
      }

      if (currentAssignmentNumber > assignmentNumber) {
        pointsToTakeAway = currentAssignmentNumber - assignmentNumber + 1;
      }

      switch (assignmentNumber) {
        case 0:
          pointsToTakeAway = 0;
          break;
        case 1:
      }

      return {
        text: error,
        type: error.includes(".html") ? "fileName" : "error",
        assignmentNumber: assignmentNumber,
        pointsToTakeAway,
      };
    });

    setErrors(errors);
    setErrorsCount(errors.filter((e) => e.type === "error").length);

    console.log(errors);
  };

  return (
    <div id="container" style={{ maxWidth: 900 }}>
      {/* Header */}
      <div
        style={{
          display: "flex",
          flexDirection: "row",
          justifyContent: "space-between",
          alignItems: "center",
          backgroundColor: "#d3d3d3",
          borderRadius: 10,
          padding: 10,
        }}
      >
        <div
          style={{
            display: "flex",
            flexDirection: "column",
            justifyContent: "space-between",
            alignItems: "center",
          }}
        >
          <div>Errors</div>
          <span style={{ fontSize: 18, fontWeight: "bold" }}>
            {" "}
            {errorsCount}
          </span>
        </div>
        <div
          style={{
            display: "flex",
            flexDirection: "column",
            justifyContent: "space-between",
            alignItems: "center",
          }}
        >
          <div>Points</div>
          <span style={{ fontSize: 18, fontWeight: "bold" }}>
            {" "}
            {errorsCount}
          </span>
        </div>
        <div
          style={{
            display: "flex",
            flexDirection: "column",
            justifyContent: "space-between",
            alignItems: "center",
          }}
        >
          <div>Grade</div>
          <span style={{ fontSize: 18, fontWeight: "bold" }}>
            {" "}
            {errorsCount}
          </span>
        </div>
      </div>

      {/* Week Selector  */}
      <div style={{ marginTop: 10, marginBottom: 10 }}>
        <select
          value={currentAssignmentNumber}
          onChange={(e) => setCurrentAssignmentNumber(e.target.value)}
        >
          <option value="1">1</option>
          <option value="2">2</option>
          <option value="3">3</option>
          <option value="4">4</option>
          <option value="5">5</option>
          <option value="6">6</option>
          <option value="7">7</option>
          <option value="8">8</option>
          <option value="9">9</option>
          <option value="10">10</option>
        </select>
      </div>

      <div style={{ display: "flex", flexDirection: "row" }}>
        {/* Raw Issues */}
        <div className="rawIssues">
          <textarea
            value={issues}
            onChange={updateText}
            cols="65"
            rows="20"
          ></textarea>
        </div>

        <div>
          {errors.length > 0 &&
            errors.map((error, index) => {
              if (error.type === "fileName") {
                return <FileName name={error.text} />;
              }
              return (
                <Error
                  key={index}
                  text={error.text}
                  assignmentNumber={error.assignmentNumber}
                  pointsToTakeAway={error.pointsToTakeAway}
                />
              );
            })}
        </div>
      </div>
    </div>
  );
};

export default Grader;
