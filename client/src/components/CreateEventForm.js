import React from 'react';
import { Formik, Form, Field, ErrorMessage } from 'formik';
import * as Yup from 'yup';
import { useHistory } from 'react-router-dom';
import { useGlobalState } from './Context';

function CreateEventForm() {
  const { user, hostedEvents, setHostedEvents } = useGlobalState();
  const history = useHistory();

  const initialValues = {
    title: '',
    description: '',
    date: '',
    time: '',
    location: '',
  };

  const validationSchema = Yup.object({
    title: Yup.string().required('Title is required'),
    description: Yup.string(),
    date: Yup.date().required('Date is required'),
    time: Yup.string().required('Time is required'),
    location: Yup.string().required('Location is required'),
  });

  const onSubmit = (values) => {
    fetch(`/create_event/${user.id}`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(values),
    })
      .then((response) => {
        if (!response.ok) {
          throw new Error('Network response was not ok');
        }
        return response.json();
      })
      .then((event) => {
        setHostedEvents([...hostedEvents, event]);
        history.push(`/invitations/${event.id}`);
      })
      .catch((error) => {
        console.error('Error:', error);
      });
  };

  return (
    <div className='container'>
    <div className="event-form-card">
      <h2 className="create-event-header">Create Event</h2>
      <Formik
        initialValues={initialValues}
        validationSchema={validationSchema}
        onSubmit={onSubmit}
      >
        <Form className="create-event-form">
          <div className="form-group">
            <label htmlFor="title">Title</label>
            <Field type="text" id="title" name="title" className="form-input" />
            <ErrorMessage name="title" component="div" className="error" />
          </div>

          <div className="form-group-description">
            <label htmlFor="description">Description</label>
            <Field
              as="textarea"
              id="description"
              name="description"
              className="form-input"
            />
            <ErrorMessage name="description" component="div" className="error" />
          </div><br></br>

          <div className="form-group">
            <label htmlFor="date">Date</label>
            <Field type="date" id="date" name="date" className="form-input" />
            <ErrorMessage name="date" component="div" className="error" />
          </div>

          <div className="form-group">
            <label htmlFor="time">Time</label>
            <Field type="time" id="time" name="time" className="form-input" />
            <ErrorMessage name="time" component="div" className="error" />
          </div>

          <div className="form-group">
            <label htmlFor="location">Location</label>
            <Field type="text" id="location" name="location" className="form-input" />
            <ErrorMessage name="location" component="div" className="error" />
          </div>

          <div className="form-group">
            <button type="submit" className="submit-button">
              Create Event
            </button>
          </div>
        </Form>
      </Formik>
      </div>
    </div>
  );
}

export default CreateEventForm;