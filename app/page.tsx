"use client";

import { useEffect, useState } from "react";

export default function Home() {

  const [users, setUsers] = useState<any[]>([]);
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [editId, setEditId] = useState<string | null>(null);

  // Fetch Users
  const fetchUsers = async () => {
    const res = await fetch("/api/users");
    const data = await res.json();
    setUsers(data);
  };

  useEffect(() => {
    fetchUsers();
  }, []);

  // Add or Update User
  const addUser = async (e: any) => {
    e.preventDefault();

    if (editId) {
      await fetch("/api/users", {
        method: "PUT",
        body: JSON.stringify({
          id: editId,
          name,
          email,
        }),
      });

      setEditId(null);

    } else {

      await fetch("/api/users", {
        method: "POST",
        body: JSON.stringify({
          name,
          email,
        }),
      });
    }

    setName("");
    setEmail("");

    fetchUsers();
  };

  // Delete User
  const deleteUser = async (id: string) => {
    await fetch("/api/users", {
      method: "DELETE",
      body: JSON.stringify({ id }),
    });

    fetchUsers();
  };

  // Edit User
  const editUser = (user: any) => {
    setName(user.name);
    setEmail(user.email);
    setEditId(user._id);
  };

  return (
    <div style={{ padding: "40px", fontFamily: "Arial" }}>

      <h1 style={{ fontSize: "32px", marginBottom: "20px" }}>
        User Management Dashboard
      </h1>

      {/* Form */}

      <form
        onSubmit={addUser}
        style={{
          display: "flex",
          gap: "15px",
          marginBottom: "25px",
        }}
      >

        <input
          placeholder="Enter Name"
          value={name}
          onChange={(e) => setName(e.target.value)}
          style={{
            padding: "10px",
            width: "250px",
            borderRadius: "5px",
            border: "1px solid #ccc",
          }}
        />

        <input
          placeholder="Enter Email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          style={{
            padding: "10px",
            width: "250px",
            borderRadius: "5px",
            border: "1px solid #ccc",
          }}
        />

        <button
          type="submit"
          style={{
            background: "#2563eb",
            color: "white",
            padding: "10px 18px",
            borderRadius: "5px",
            border: "none",
            cursor: "pointer",
          }}
        >
          {editId ? "Update User" : "Add User"}
        </button>

      </form>

      {/* Table */}

      <table
        style={{
          width: "100%",
          borderCollapse: "collapse",
          background: "#f9fafb",
        }}
      >

        <thead>
          <tr style={{ textAlign: "left", borderBottom: "2px solid #ddd" }}>
            <th style={{ padding: "12px" }}>Name</th>
            <th style={{ padding: "12px" }}>Email</th>
            <th style={{ padding: "12px" }}>Actions</th>
          </tr>
        </thead>

        <tbody>

          {users.map((user) => (

            <tr key={user._id} style={{ borderBottom: "1px solid #ddd" }}>

              <td style={{ padding: "12px" }}>
                {user.name}
              </td>

              <td style={{ padding: "12px" }}>
                {user.email}
              </td>

              <td style={{ padding: "12px" }}>

                <button
                  onClick={() => editUser(user)}
                  style={{
                    background: "#facc15",
                    padding: "6px 12px",
                    border: "none",
                    marginRight: "8px",
                    borderRadius: "4px",
                    cursor: "pointer",
                  }}
                >
                  Edit
                </button>

                <button
                  onClick={() => deleteUser(user._id)}
                  style={{
                    background: "#ef4444",
                    color: "white",
                    padding: "6px 12px",
                    border: "none",
                    borderRadius: "4px",
                    cursor: "pointer",
                  }}
                >
                  Delete
                </button>

              </td>

            </tr>

          ))}

        </tbody>

      </table>

    </div>
  );
}
