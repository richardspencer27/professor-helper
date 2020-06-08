import React, { useState, useEffect } from "react";
import ReactDOM from "react-dom";
import Modal from "react-modal";

import "./Grader.css";

const customStyles = {
  content: {
    top: "50%",
    left: "50%",
    right: "auto",
    bottom: "auto",
    marginRight: "-50%",
    transform: "translate(-50%, -50%)",
  },
};

// Make sure to bind modal to your appElement (http://reactcommunity.org/react-modal/accessibility/)
// Modal.setAppElement("#yourAppElement");

const FileName = (props) => <h2 style={{ marginTop: 0 }}>{props.name}</h2>;
const Error = (props) => {
  const { text, pointsToTakeAway, index, deleteError, openModal } = props;
  return (
    <div
      className="errorContainer"
      style={{ display: "flex", flexDirection: "column", width: 340 }}
    >
      <div
        style={{ display: "flex", flexDirection: "row", alignItems: "center" }}
      >
        <div style={{ display: "flex", flex: 21, flexDirection: "column" }}>
          <div style={{ fontSize: 14 }}>
            <strong>{text}</strong>
          </div>
        </div>
        <div
          style={{
            display: "flex",
            height: 40,
            width: 40,
            borderRadius: 20,
            backgroundColor: "#d2d2d2",
            justifyContent: "center",
            alignItems: "center",
          }}
        >
          - {pointsToTakeAway}
        </div>
      </div>
      <div
        style={{
          display: "flex",
          flexDirection: "row",
          justifyContent: "space-between",
          marginTop: 10,
        }}
      >
        <div style={{ display: "flex" }}>
          <div
            style={{
              marginRight: 10,
              height: 20,
              width: 20,
              borderRadius: 10,
              display: "flex",
              backgroundColor: "#d3d3d3",
              justifyContent: "center",
              alignItems: "center",
              fontSize: 12,
              textAlign: "center",
            }}
          >
            +
          </div>
          <div
            style={{
              marginRight: 10,
              height: 20,
              width: 20,
              borderRadius: 10,
              display: "flex",
              backgroundColor: "#d3d3d3",
              justifyContent: "center",
              alignItems: "center",
              fontSize: 12,
              textAlign: "center",
            }}
          >
            -
          </div>
        </div>
        <div style={{ display: "flex" }}>
          <button onClick={() => openModal(index)} style={{ marginRight: 10 }}>
            Add Comment
          </button>
          <a
            href="#"
            onClick={(e) => deleteError(e, index)}
            style={{ color: "red", textDecoration: "none" }}
          >
            Delete
          </a>
        </div>
      </div>
    </div>
  );
};

const Grader = () => {
  const [issues, setIssues] = useState("");
  const [comment, setComment] = useState("");
  const [errors, setErrors] = useState([]);
  const [error, setError] = useState({ text: "", comments: [] });
  const [errorComment, setErrorComment] = useState("");
  const [errorsCount, setErrorsCount] = useState(0);
  const [currentAssignmentNumber, setCurrentAssignmentNumber] = useState(
    localStorage.getItem("currentAssignmentNumber") || 1
  );
  const [points, setPoints] = useState(50);
  var subtitle;
  const [modalIsOpen, setIsOpen] = React.useState(false);

  function openModal(index) {
    let error = errors[index];
    setError(error);
    console.log(error);
    setIsOpen(true);
  }

  function afterOpenModal() {
    // references are now sync'd and can be accessed.
    subtitle.style.color = "#f00";
  }

  function closeModal() {
    setIsOpen(false);
  }

  useEffect(() => {
    fetch("http://localhost:7071/api/products")
      .then((response) => response.json())
      .then((data) => console.log("Serverless Function Data", data))
      .catch((e) => console.log(e.message));
  }, []);

  useEffect(() => {
    localStorage.setItem("currentAssignmentNumber", currentAssignmentNumber);
  });

  const updateComment = (event) => {
    const comment = event.target.value;
    setComment(comment);
  };

  const updateErrorComment = (event) => {
    const comment = event.target.value;
    setErrorComment(comment);
  };

  const addErrorComment = () => {
    error.comments.push(errorComment);
    setErrorComment("");

    // updateErrorComment("");
  };

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

      return {
        text: error,
        type: error.includes(".html") ? "fileName" : "error",
        assignmentNumber: assignmentNumber,
        pointsToTakeAway,
        comments: [],
        possibleComments: [],
      };
    });

    setErrors(errors);
    setErrorsCount(errors.filter((e) => e.type === "error").length);
    calculatePoints(errors);

    console.log(errors);
  };

  const calculatePoints = (errors) => {
    let points = 50;
    errors.forEach((error) => {
      if (error.type === "error") {
        points = points - error.pointsToTakeAway;
      }
    });

    setPoints(points);
  };

  const handleAssignmentWeekChange = (e) => {
    const updatedAssignmentWeek = e.target.value;
    setCurrentAssignmentNumber(updatedAssignmentWeek);

    if (errors.length === 0) {
      return;
    }

    const updatedErrors = errors.map((error) => {
      if (error.type === "fileName") {
        return error;
      }

      let pointsToTakeAway = 0;
      if (updatedAssignmentWeek === error.assignmentNumber) {
        pointsToTakeAway = 1;
      }

      if (updatedAssignmentWeek > error.assignmentNumber) {
        pointsToTakeAway = updatedAssignmentWeek - error.assignmentNumber + 1;
      }

      return { ...error, pointsToTakeAway };
    });

    setErrors(updatedErrors);
    calculatePoints(updatedErrors);
  };

  const deleteError = (e, index) => {
    e.preventDefault();
    console.log(index);
    errors.splice(index, 1);
    setErrors(errors);
    calculatePoints(errors);
  };
  return (
    <div id="container" style={{ maxWidth: 900 }}>
      <button onClick={openModal}>Open Modal</button>

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
          <span style={{ fontSize: 18, fontWeight: "bold" }}> {points}</span>
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
            {points === 50 ? "100" : (points / 50) * 100.0}%
          </span>
        </div>
      </div>
      {/* Week Selector  */}
      <div style={{ marginTop: 10, marginBottom: 10 }}>
        <label>
          Selfie Site:
          <select
            style={{ marginRight: 10, marginLeft: 10 }}
            value={currentAssignmentNumber}
            onChange={handleAssignmentWeekChange}
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
        </label>
      </div>
      <div style={{ display: "flex", flexDirection: "row" }}>
        {/* Raw Issues */}
        <div style={{ marginRight: 20 }} className="rawIssues">
          <textarea
            value={issues}
            onChange={updateText}
            cols="60"
            rows="18"
          ></textarea>
        </div>

        {/* Errors Container */}
        <div style={{ height: 300, overflowY: "auto" }}>
          {errors.length > 0 &&
            errors.map((error, index) => {
              if (error.type === "fileName") {
                return <FileName key={index} name={error.text} />;
              }
              return (
                <Error
                  key={index}
                  text={error.text}
                  pointsToTakeAway={error.pointsToTakeAway}
                  index={index}
                  deleteError={deleteError}
                  openModal={openModal}
                />
              );
            })}
        </div>
      </div>
      {/* Notes for Student */}
      <h2>Notes</h2>
      <div>
        {errors.length > 0 &&
          errors.map((error) =>
            error.type === "fileName" ? (
              <p>
                <strong>{error.text}</strong>
              </p>
            ) : (
              <p>
                {error.text}
                {error.comments.length > 0 && ` :${error.comments[0]}`}
              </p>
            )
          )}
        {comment !== "" && (
          <div>
            <strong>Additional Comments: </strong>
            {comment}
          </div>
        )}
      </div>

      {/* Additional Comments */}
      <h2>Additional Comments</h2>
      <textarea
        value={comment}
        onChange={updateComment}
        cols="60"
        rows="10"
      ></textarea>

      {/* Edit Comments Modal */}
      <Modal
        isOpen={modalIsOpen}
        onAfterOpen={afterOpenModal}
        onRequestClose={closeModal}
        style={customStyles}
        contentLabel="Edit Error"
      >
        <h2 ref={(_subtitle) => (subtitle = _subtitle)}>{error.text}</h2>
        <div style={{ display: "flex", flexDirection: "row" }}>
          <label>
            Comment:{" "}
            <input
              type="text"
              value={errorComment}
              onChange={updateErrorComment}
            />
          </label>
          <button onClick={addErrorComment}>Add</button>
        </div>
        {error.text && error.comments.map((comment) => <div>{comment}</div>)}
        <button onClick={closeModal}>close</button>
      </Modal>
    </div>
  );
};

export default Grader;
