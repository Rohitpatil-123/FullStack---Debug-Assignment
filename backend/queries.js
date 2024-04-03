require("dotenv").config();

const { Client } = require("pg");
const client = new Client({
  user: `${process.env.DB_USER}`,
  host: `${process.env.DB_HOST}`,
  database: `${process.env.DB_DATABASE}`,
  password: `${process.env.DB_PASSWORD}`,
  port: `${process.env.DB_PORT}`,
});

client.connect();

// Our first endpoint will be a GET request.
// /user
// SELECT all users and order by id.
const getUsers = async (request, response) => {
  try {
    const results = await client.query("SELECT * FROM users ORDER BY id ASC");
    response.status(200).json(results.rows);
  } catch (error) {
    console.error("Error fetching users:", error);
    response.status(500).json({ error: "Internal server error" });
  }
};

// For /users/:id request, :id using a WHERE clause to display the result.
// In the SQL query, we’re looking for id=$1. In this instance, $1 is a numbered placeholder,
// which PostgreSQL uses natively instead of the ? placeholder you may be familiar with from other flavors of SQL.
const getUserById = async (request, response) => {
  const id = parseInt(request.params.id);
  try {
    const results = await client.query("SELECT * FROM users WHERE id = $1", [
      id,
    ]);
    response.status(200).json(results.rows);
  } catch (error) {
    console.error("Error fetching user by ID:", error);
    response.status(500).json({ error: "Internal server error" });
  }
};

// The API will take a GET and POST request to the /users endpoint. In the POST request, we’ll be adding a new user.
// In this function, we’re extracting the name and email properties from the request body, and INSERTING the values.
const createUser = async (request, response) => {
  const { name, email } = request.body;
  try {
    const res = await client.query("SELECT * FROM users ");
    let id = 1;
    if (res.rows.length > 0) {
      id = res.rows.length + 1;
    } else {
      id = 1;
    }
    const result = await client.query(
      "INSERT INTO users (id,name, email) VALUES ($1, $2,$3) RETURNING id,name,email",
      [id, name, email]
    );
    return response.status(201).json(result.rows[res.rows.length - 1]);
  } catch (error) {
    console.error("Error creating user:", error);
    response.status(500).json({ error: "Internal server error" });
  }
};

// The /users/:id endpoint will update the user
const updateUser = async (request, response) => {
  const id = parseInt(request.params.id);
  const { name, email } = request.body;
  try {
    const data = await client.query(
      "UPDATE users SET name = $1, email = $2 WHERE id = $3 RETURNING id,name,email",
      [name, email, id]
    );
    return response
      .status(200)
      .json({ message: "user updated successfully", data: data.rows[0] });
  } catch (error) {
    console.error("Error updating user:", error);
    response.status(500).json({ error: "Internal server error" });
  }
};

// DELETE clause on /users/:id to delete a specific user by id.
const deleteUser = async (request, response) => {
  const id = parseInt(request.params.id);
  try {
    await client.query("DELETE FROM users WHERE id = $1", [id]);
    response.status(200).json({ message: "User deleted successfully" });
  } catch (error) {
    console.error("Error deleting user:", error);
    response.status(500).json({ error: "Internal server error" });
  }
};

module.exports = {
  getUsers,
  getUserById,
  createUser,
  updateUser,
  deleteUser,
};
