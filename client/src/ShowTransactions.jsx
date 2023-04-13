import React, { useState, useEffect } from "react";
import Layout from "./Layout";
import axios from "axios";
import { isAuthenticated } from "./auth";
import Button from "react-bootstrap/Button";
import Col from "react-bootstrap/Col";
import Form from "react-bootstrap/Form";
import InputGroup from "react-bootstrap/InputGroup";
import Row from "react-bootstrap/Row";
import Table from "react-bootstrap/Table";
import { Link } from "react-router-dom";

const ShowTransactions = () => {
  const [transactions, setTransactions] = useState([]);
 const token = isAuthenticated().token;
  useEffect(() => {
    fetch("http://staging-2023-03-30.pivottinc.com:8000/transaction/showAll", {
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json",
      },
    })
      .then((response) => response.json())
      .then((data) => setTransactions(data))
      .catch((error) => console.log(error));
  }, []);

  const handleDelete = (id) => {
    axios
      .delete(
        `http://staging-2023-03-30.pivottinc.com:8000/transaction/delete/${id}`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      )
      .then((res) => {
        console.log(res.data);
        setTransactions(transactions.filter((t) => t.id !== id));
      })
      .catch((err) => console.log(err));
  };

 const showAllData = () => {
   return (
     <div className="text-center">
       <h1 className="mb-5">Transactions</h1>
       <Table striped bordered hover>
         <thead>
           <tr>
             <th>Buyer's Name</th>
             <th>Buyer's Address</th>
             <th>Action</th>
             <th>Action</th>
           </tr>
         </thead>
         <tbody>
           {transactions &&
             transactions.length > 0 &&
             transactions.map((transaction) => (
               <tr key={transaction.id}>
                 <td>{transaction.buyer_name}</td>
                 <td>{transaction.buyer_current_address}</td>
                 <td>
                   <Link
                     className="nav-link"
                     to={`/update-transactions/${transaction.id}`}
                   >
                     <Button variant="outline-success">Update</Button>
                   </Link>
                 </td>
                 <td>
                   <Button
                     variant="outline-danger"
                     onClick={() => handleDelete(transaction.id)}
                   >
                     Delete
                   </Button>
                 </td>
               </tr>
             ))}
         </tbody>
       </Table>
     </div>
   );
 };
  return (
    <Layout
      title="View Your Data Page"
      description="The data is following"
      className="container col-md-8 offset-md-2"
    >
      {showAllData()}
    </Layout>
  );
};

export default ShowTransactions;
