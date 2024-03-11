import React, { useEffect, useState } from "react";
import { useFormik } from "formik";
import * as yup from "yup";
import { useParams, useHistory } from "react-router-dom";
import { useGlobalState } from "./Context";
import TaskCard from "./TaskCard";

function CreateTasks() {
  const { selectedUsers, setSelectedUsers } = useGlobalState();
  const { event_id } = useParams();
  const [tasks, setTasks] = useState([]);
  const history = useHistory();

  useEffect(() => {
    fetch(`/event_invitations/${event_id}`)
      .then(r => r.json())
      .then(r => setSelectedUsers(r));
  }, [event_id, setSelectedUsers]);

  const formSchema = yup.object({
    description: yup.string().required("Description is required").max(100),
    dueDate: yup.date().required("Due date is required"),
    assignedTo: yup.string(),
  });

  const sortedSelectedUsers = selectedUsers.slice().sort((a, b) => {
    return a.last_name.localeCompare(b.last_name);
  });

  function submitTasks() {
    if (tasks.length === 0) {
      const confirmation = window.confirm("Are you sure you don't want to create any tasks for this event?");
      if (confirmation) {
        proceedWithSubmit();
      }
    } else {
      proceedWithSubmit();
    }
  }

  function proceedWithSubmit() {
    fetch(`/create_tasks/${event_id}`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(tasks),
    })
      .then(response => response.json())
      .then(data => {
        console.log('Submit Tasks response:', data);
        setTasks([]);
        history.push('/my-events');
      })
      .catch(error => {
        console.error('Error submitting tasks:', error);
      });
  }

  const formik = useFormik({
    initialValues: {
      description: "",
      dueDate: "",
      assignedTo: "",
    },
    validationSchema: formSchema,
    onSubmit: (values) => {
      const [userId, firstName, lastName] = values.assignedTo.split(" ");

      setTasks((prevTasks) => [
        ...prevTasks,
        {
          description: values.description,
          dueDate: values.dueDate,
          assignedTo: {
            id: userId,
            firstName: firstName,
            lastName: lastName
          },
        },
      ]);
      formik.resetForm();
    },
  });

  return (
    <div>
      <div className="task-form-container">
        <h1 className="task-header">Tasks</h1>
        <form onSubmit={formik.handleSubmit}>
          <div>
            <label htmlFor="description">Description:</label>
            <textarea
              id="description"
              name="description"
              onChange={formik.handleChange}
              onBlur={formik.handleBlur}
              value={formik.values.description}
              rows={4}
              cols={50}
            />
            {formik.touched.description && formik.errors.description && (
              <div className="error-message">{formik.errors.description}</div>
            )}
          </div>
          <div>
            <label htmlFor="dueDate" >Due Date:</label>
            <input
              className='due-date-input'
              id="dueDate"
              name="dueDate"
              type="date"
              onChange={formik.handleChange}
              onBlur={formik.handleBlur}
              value={formik.values.dueDate}
            />
            {formik.touched.dueDate && formik.errors.dueDate && (
              <div className="error-message">{formik.errors.dueDate}</div>
            )}
          </div>
          <div>
            <label htmlFor="assignedTo">Assigned To (Optional):</label>
            <select
              id="assignedTo"
              name="assignedTo"
              onChange={formik.handleChange}
              onBlur={formik.handleBlur}
              value={formik.values.assignedTo}
            >
              <option value="" label="Select an option" />
              {sortedSelectedUsers.map((user) => (
                <option
                  key={user.id}
                  value={`${user.id} ${user.first_name} ${user.last_name}`}
                  label={`${user.first_name} ${user.last_name}`}
                />
              ))}
            </select>
            {formik.touched.assignedTo && formik.errors.assignedTo && (
              <div className="error-message">{formik.errors.assignedTo}</div>
            )}
          </div><br />
          <div className="submit-button-container">
            <button
              type="submit"
              className="submit-button createTask"
            >
              Create Task
            </button>
          </div>
        </form>
      </div>
      {tasks.length > 0 && (
        <div className="task-container">
          {tasks.map((task, index) => (
            <TaskCard
              key={index}
              description={task.description}
              dueDate={task.dueDate}
              firstName={task.assignedTo.firstName}
              lastName={task.assignedTo.lastName}
            />
          ))}
        </div>
      )}
      <div className="submit-button-container">
        <button
          type="button"
          className="submit-button"
          onClick={submitTasks}
        >
          Submit Tasks
        </button>
      </div><br /><br />
    </div>
  );
}

export default CreateTasks;
