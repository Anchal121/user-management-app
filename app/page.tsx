"use client";

import { useEffect, useState } from "react";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

export default function Home() {

  const [users, setUsers] = useState<any[]>([]);
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [editId, setEditId] = useState<string | null>(null);
  const [error, setError] = useState("");

  const fetchUsers = async () => {
    const res = await fetch("/api/users");
    const data = await res.json();
    setUsers(data);
  };

  useEffect(() => {
    fetchUsers();
  }, []);

  const isValidEmail = (email: string) => {
    return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
  };

  const addUser = async (e: any) => {
    e.preventDefault();
    setError("");

    if (!name.trim()) {
      setError("Name is required");
      return;
    }

    if (!email.trim()) {
      setError("Email is required");
      return;
    }

    if (!isValidEmail(email)) {
      setError("Invalid email format");
      return;
    }

    if (editId) {
      await fetch("/api/users", {
        method: "PUT",
        body: JSON.stringify({ id: editId, name, email }),
      });

      toast.success("User updated successfully");
      setEditId(null);

    } else {

      await fetch("/api/users", {
        method: "POST",
        body: JSON.stringify({ name, email }),
      });

      toast.success("User added successfully");
    }

    setName("");
    setEmail("");

    fetchUsers();
  };

  const deleteUser = async (id: string) => {
    await fetch("/api/users", {
      method: "DELETE",
      body: JSON.stringify({ id }),
    });

    toast.success("User deleted successfully");

    fetchUsers();
  };

  const editUser = (user: any) => {
    setName(user.name);
    setEmail(user.email);
    setEditId(user._id);
  };

  return (
    <div style={{ padding: "30px", fontFamily: "Arial" }}>

      <ToastContainer />

      <h1 style={{ marginBottom: "20px" }}>
        User Management Dashboard
      </h1>

      {/* Form */}

      <form
        onSubmit={addUser}
        style={{
          display: "flex",
          flexWrap: "wrap",
          gap: "10px",
          marginBottom: "20px",
        }}
      >

        <input
          placeholder="Enter Name"
          value={name}
          onChange={(e) => setName(e.target.value)}
          style={{
            padding: "10px",
            flex: "1",
            minWidth: "200px",
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
            flex: "1",
            minWidth: "200px",
            borderRadius: "5px",
            border: "1px solid #ccc",
          }}
        />

        <button
          type="submit"
          style={{
            background: "#2563eb",
            color: "white",
            padding: "10px 20px",
            borderRadius: "5px",
            border: "none",
            cursor: "pointer",
          }}
        >
          {editId ? "Update User" : "Add User"}
        </button>

      </form>

      {error && (
        <p style={{ color: "red", marginBottom: "15px" }}>
          {error}
        </p>
      )}

      {/* Table */}

      <div style={{ overflowX: "auto" }}>

        <table
          style={{
            width: "100%",
            borderCollapse: "collapse",
          }}
        >

          <thead>
            <tr style={{ borderBottom: "2px solid #ddd" }}>
              <th style={{ padding: "10px" }}>Name</th>
              <th style={{ padding: "10px" }}>Email</th>
              <th style={{ padding: "10px" }}>Actions</th>
            </tr>
          </thead>

          <tbody>

            {users.map((user) => (

              <tr key={user._id} style={{ borderBottom: "1px solid #eee" }}>

                <td style={{ padding: "10px" }}>{user.name}</td>
                <td style={{ padding: "10px" }}>{user.email}</td>

                <td style={{ padding: "10px" }}>

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

    </div>
  );
}
