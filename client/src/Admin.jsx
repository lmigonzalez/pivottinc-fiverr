import React, { useState, useEffect } from 'react';
import Layout from './Layout';
import './Admin.css';
import axios from 'axios';

const Admin = () => {
  const initialValues = {
    id: '',
    first_name: '',
    last_name: '',
    dob: '',
    gender: '',
    username: '',
  };

  const [userDetails, setUserDetails] = useState(initialValues);

  const [profiles, setProfiles] = useState([]);

  useEffect(() => {
    getProfiles();
  }, []);

  async function getProfiles() {
    const config = {
      headers: {
        authorization: `Bearer ${JSON.parse(localStorage.getItem('jwt'))}`,
      },
    };
    try {
      const response = await axios.get(
        'http://staging-2023-03-30.pivottinc.com:8000/profiles/',
        config
      );

      setProfiles(response.data);
    } catch (err) {
      console.log(err);
      return err;
    }
  }

  function handleChange(e) {
    setUserDetails({
      ...userDetails,
      [e.target.name]: e.target.value,
    });
  }

  async function updateUser(profile) {
    console.log(profile);
    profile.dob = new Date(profile.dob)
      .toISOString()
      .slice(0, 10)
      .replace(/-/g, '/');
    setUserDetails(profile);
  }

  async function deleteUser(id) {
    const config = {
      headers: {
        authorization: `Bearer ${JSON.parse(localStorage.getItem('jwt'))}`,
      },
    };
    try {
      await axios.delete('http://staging-2023-03-30.pivottinc.com:8000/profiles/delete-user', {
        data: { id },
        config,
      });
    } catch (err) {
      console.log(err);
      return err;
    }
    getProfiles();
  }

  async function submitUpdate(e) {
    e.preventDefault();

    const config = {
      headers: {
        authorization: `Bearer ${JSON.parse(localStorage.getItem('jwt'))}`,
      },
    };
    try {
      await axios.patch(
        'http://staging-2023-03-30.pivottinc.com:8000/profiles/update-user',
        userDetails,
        config
      );
    } catch (err) {
      console.log(err);
      return err;
    }
    getProfiles();
    setUserDetails(initialValues);
  }

  return (
    <Layout title="Admin" description="admin profiles">
      <main>
        <table>
          <thead>
            <tr>
              <th>First Name</th>
              <th>Last Name</th>
              <th>DOB</th>
              <th>Gender</th>
              <th>username</th>
              <th></th>
            </tr>
          </thead>
          <tbody>
            {profiles.map((profile, index) => {
              return (
                <tr key={index}>
                  <td> {profile.first_name} </td>
                  <td> {profile.last_name} </td>
                  <td> {profile.dob} </td>
                  <td> {profile.gender} </td>
                  <td> {profile.username} </td>
                  <td>
                    {' '}
                    <div className="">
                      {' '}
                      <button onClick={() => deleteUser(profile.id)}>
                        Delete
                      </button>{' '}
                      <button onClick={() => updateUser(profile)}>edit</button>{' '}
                    </div>{' '}
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>

        {userDetails.first_name.length > 0 && (
          <form className="update-form" onSubmit={submitUpdate}>
            <div className="form-group">
              {' '}
              <label className="text font-weight-bold" htmlFor="">
                First Name
              </label>
              <input
                className="form-control"
                onChange={handleChange}
                value={userDetails.first_name}
                name="first_name"
              />
            </div>
            <div className="form-group">
              <label className="text font-weight-bold" htmlFor="">
                Last Name
              </label>
              <input
                className="form-control"
                onChange={handleChange}
                value={userDetails.last_name}
                name="last_name"
              />
            </div>
            <div className="form-group">
              <label className="text font-weight-bold" htmlFor="">
                DOB
              </label>
              <input
                className="form-control"
                onChange={handleChange}
                value={userDetails.dob}
                name="dob"
              />
            </div>
            <div className="form-group">
              <label className="text font-weight-bold" htmlFor="">
                Gender
              </label>
              <input
                className="form-control"
                onChange={handleChange}
                value={userDetails.gender}
                name="gender"
              />
            </div>
            <div className="form-group">
              <label className="text font-weight-bold" htmlFor="">
                Username
              </label>
              <input
                className="form-control"
                onChange={handleChange}
                value={userDetails.username}
                name="username"
              />
            </div>

            <div className="btn-group">
              <button onClick={() => setUserDetails(initialValues)}>
                cancel
              </button>
              <button type="submit">update</button>
            </div>
          </form>
        )}
      </main>
    </Layout>
  );
};
export default Admin;
