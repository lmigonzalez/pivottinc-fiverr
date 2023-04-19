import React, { useState } from "react"
import Layout from "./Layout"
import axios from "axios"

const Admin = () => {    
    const [profiles, setProfiles] = useState(getProfiles())    

    async function getProfiles() {
        const config = {
            headers: { authorization: `Bearer ${JSON.parse(localStorage.getItem("jwt"))}` }
        };
        try {
            const response = await axios.get("http://staging-2023-03-30.pivottinc.com:8000/profiles/", config)
            setProfiles({ count: response.data.lenght, ...response.data })

        } catch (err) {
            console.log(err);
            return err
        }
        
    }
    
    async function Update(values) {
        values.preventDefault();
        const config = {
            headers: { authorization: `Bearer ${JSON.parse(localStorage.getItem("jwt"))}` }
        };
        try {
            await axios.patch("http://staging-2023-03-30.pivottinc.com:8000/profiles/update-user", values,config)        
        } catch (err) {
            console.log(err);  
            return err
        }
        getProfiles();
    }

    async function Delete(id) {        
        const config = {
            headers: { authorization: `Bearer ${JSON.parse(localStorage.getItem("jwt"))}` }
        };
        try {
            await axios.delete("http://staging-2023-03-30.pivottinc.com:8000/profiles/delete-user",{id:id},config)       
        } catch (err) {
            console.log(err); 
            return err
        }
        getProfiles();
    }

    return (
        <Layout title="Admin" description="admin profiles">            
            {profiles.map((profile) =>
            <>
                <div>
                    {profile.name}
                    <label htmlFor={profile.id} className="mt-3 btn btn-outline-dark">                                         
                        Update                        
                    </label>                   
                    <button onClick={()=>{ Delete(profile.id)}} className="mt-3 btn btn-outline-dark ">
                        Delete
                    </button>
                </div>
                <form id={profile.id} onSubmit={Update} className="d-none form-group">
                    {profile.map((key, value) =>
                        <div className="form-group">
                            <label className="text font-weight-bold">{key}</label>
                            <input             
                                type="text"
                                className="form-control"
                                name={key}
                                value={value}                                    
                            />
                        </div>
                    )}
                    <button type="submit" className="mt-3 btn btn-outline-dark">                            
                        submit
                    </button>
                </form>
            </>            
            )}
        </Layout>
    )
}
export default Admin;