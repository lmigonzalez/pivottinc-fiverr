import React, { useState } from 'react';
import Layout from './Layout';
import axios from 'axios';

const Form = () => {
  const initialValues = {
    first_name: '',
    last_name: '',
    dob: '',
    gender: '',
    username: '',
  };
  const [values, setValues] = useState(initialValues);

  function handleChange(e) {
    setValues({
      ...values,
      [e.target.name]: e.target.value,
    });
  }

  const submit = async (e) => {
    e.preventDefault()

    console.log(values);
    const config = {
      headers: {
        authorization: `Bearer ${JSON.parse(localStorage.getItem('jwt'))}`,
      },
    };
    try {
      const response = await axios.post(
        'http://staging-2023-03-30.pivottinc.com:8000/profiles/new',
        values,
        config
      );

      setValues(initialValues)
      console.log(response);
    } catch (err) {
      console.log(err);
    }
  };

  return (
    <Layout
      title="form"
      description="form in test"
      className="container col-md-5 text-align-centre"
    >
      <div className="container mt-5 pt-5">
        <form onSubmit={submit}>
          <div className="form-group">
            <label className="text font-weight-bold">First Name</label>
            <input
              onChange={handleChange}
              type="text"
              className="form-control"
              name="first_name"
              value={values.first_name}
            />
          </div>
          <div className="form-group">
            <label className="text font-weight-bold">Last Name</label>
            <input
              onChange={handleChange}
              type="text"
              className="form-control"
              name="last_name"
              value={values.last_name}
            />
          </div>
          <div className="form-group">
            <label className="text font-weight-bold">Dob DATE</label>
            <input
              onChange={handleChange}
              type="text"
              className="form-control"
              name="dob"
              value={values.dob}
            />
          </div>
          <div className="form-group">
            <label className="text font-weight-bold">Gender</label>
            <input
              onChange={handleChange}
              type="text"
              className="form-control"
              name="gender"
              value={values.gender}
            />
          </div>
          <div className="form-group">
            <label className="text font-weight-bold"> Username </label>
            <input
              onChange={handleChange}
              type="text"
              className="form-control"
              name="username"
              value={values.username}
            />
          </div>
          <div className="text-center">
            <button type="submit" className="mt-3 btn btn-outline-dark ">
              {' '}
              submit
            </button>
          </div>
        </form>
      </div>
    </Layout>
  );
};
export default Form;
