import React, { useState, useEffect } from "react";
import NewUserForm from "./Components/NewUserForm";
import EditUserForm from "./Components/EditUserForm";

const App = () => {
  const initialFormState = {
    name: "",
    email: "",
  };

  const [users, setUsers] = useState([]);
  const [currentUser, setCurrentUser] = useState(initialFormState);
  const [editing, setEditing] = useState(false);

  useEffect(() => {
    fetchUsers();
  }, [users]);

  const fetchUsers = async () => {
    const result = await fetch(`http://localhost:8080/users`);
    result
      .json()
      .then((result) => setUsers(result))
      .catch((e) => console.log(e));
  };

  const handleInputChange = (event) => {
    const { id, value } = event.target;
    setCurrentUser({ ...currentUser, [id]: value });
  };

  const submitNewUser = async (event) => {
    event.preventDefault();
    const response = await fetch("http://localhost:8080/createuser", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(currentUser),
    });
    if (response.ok) {
      try {
        const data = await response.json();
        setUsers([...users, data]);
        setCurrentUser(initialFormState);
      } catch (error) {
        console.error("Error parsing JSON:", error);
      }
    } else {
      console.error("Error creating user:", response.statusText);
    }
  };

  const deleteUser = async (item) => {
    const response = await fetch(
      `http://localhost:8080/deleteuser/${item.id}`,
      {
        method: "DELETE",
        headers: {
          "Content-Type": "application/json",
        },
      }
    );
    response
      .json()
      .then((result) => fetchUsers())
      .catch((e) => console.log(e));
  };

  const editUser = (item) => {
    setEditing(true);
    setCurrentUser({ id: item.id, name: item.name, email: item.email });
  };

  const submitUserEdit = async (event) => {
    event.preventDefault();
    const response = await fetch(
      `http://localhost:8080/updateuser/${currentUser.id}`,
      {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(currentUser),
      }
    );
    response
      .json()
      .then((result) => {
        setUsers(
          users.map((item) => (item.id === currentUser.id ? result : item))
        );
      })
      .catch((e) => console.log(e));

    fetchUsers();
    setCurrentUser(initialFormState);
    setEditing(false);
  };

  return (
    <div className="container">
      <h1>Full Stack Assignment</h1>
      <h5>Basic CRUD Opreations</h5>

      <div className="flex-row">
        {editing ? (
          <div className="flex-large">
            <EditUserForm
              submitUserEdit={submitUserEdit}
              handleInputChange={handleInputChange}
              currentUser={currentUser}
            />
          </div>
        ) : (
          <div className="flex-large">
            <NewUserForm
              submitNewUser={submitNewUser}
              handleInputChange={handleInputChange}
              currentUser={currentUser}
            />
          </div>
        )}

        <div className="flex-large">
          <table>
            <thead>
              <tr>
                <th>Name</th>
                <th>Email</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {users.map((item) => (
                <tr key={item.id}>
                  <td>{item.name}</td>
                  <td>{item.email}</td>
                  <td>
                    <button
                      onClick={() => editUser(item)}
                      className="muted-button"
                    >
                      Edit
                    </button>
                    <button
                      onClick={() => deleteUser(item)}
                      style={{ marginLeft: 5 }}
                      className="muted-button"
                    >
                      Delete
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default App;
