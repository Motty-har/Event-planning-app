import React from "react";

function TaskCard({ description, dueDate, firstName, lastName }) {
  return (
    <div className="task-card">
      <p><strong>Description:</strong> {description}</p><hr></hr><br></br>
      <p><strong>Due Date:</strong> {dueDate}</p><br></br>
      {firstName && <p><strong>Assigned To:</strong> {firstName} {lastName}</p>}
    </div>
  );
}

export default TaskCard;
