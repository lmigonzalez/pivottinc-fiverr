import React,{ useState } from "react"
import Layout from "./Layout";

const submit = async (values) => {
  // console.log(name, email, password);
  try {
    const response = await fetch(`http://staging-2023-03-30.pivottinc.com:8000/profiles/new`, {
      method: "POST",
      headers: {
        Accept: "application/json",
        "Content-Type": "application/json",
      },
      body: JSON.stringify(values),
    });
    return await response.json();
  } catch (err) {
    console.log(err);
  }
};

const Form = () => {
    const [values, setValues] = useState({
        firstName: "",
        lastName: "",
        dob: "",
        gender: "",
        username: ""
    });
    const handleChange = (name) => (event) => {
  setValues({ ...values, error: false, [name]: event.target.value });
};
    return (
        <Layout
        title="form"
        description="form in test"
        className="container col-md-5 text-align-centre"
        >
        <div className="container mt-5 pt-5">
            <form>         
                <div className="form-group">
                    <label className="text font-weight-bold">First Name</label>
                    <input
                        onChange={handleChange("firstName")}
                        type="text"
                        className="form-control"
                        value={values.firstName}
                    />
                </div>
                <div className="form-group">
                    <label className="text font-weight-bold">Last Name</label>
                    <input
                        onChange={handleChange("lastName")}
                        type="text"
                        className="form-control"
                        value={values.lastName}
                    />
                </div>
                <div className="form-group">
                    <label className="text font-weight-bold">Dob DATE</label>
                    <input
                        onChange={handleChange("dob")}
                        type="text"
                        className="form-control"
                        value={values.dob}
                    />
                </div>
                <div className="form-group">
                    <label className="text font-weight-bold">Gender</label>
                    <input
                        onChange={handleChange("gender")}
                        type="text"
                        className="form-control"
                        value={values.gender}
                    />
                </div>
                <div className="form-group">
                    <label className="text font-weight-bold">  Username </label>
                    <input
                        onChange={handleChange("username")}
                        type="text"
                        className="form-control"
                        value={values.username}
                    />
                </div>               
                <div className="text-center">
                    <button onClick={submit(values)} className="mt-3 btn btn-outline-dark ">
                        {" "}
                        submit
                    </button>
                </div>       
            </form>
        </div>
     
        
      </Layout>
      
    )
}
export default Form;