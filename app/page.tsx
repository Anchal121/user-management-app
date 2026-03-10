"use client";

import { useEffect, useState } from "react";

type User = {
  _id: string;
  name: string;
  email: string;
};

export default function Home() {

  const [users, setUsers] = useState<User[]>([]);
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [editId, setEditId] = useState("");
  const [loading, setLoading] = useState(true);

  const fetchUsers = async () => {
    try {

      const res = await fetch("/api/users");

      if (!res.ok) {
        console.error("API error:", res.status);
        setLoading(false);
        return;
      }

      const data = await res.json();

      setUsers(data);

    } catch (error) {
      console.error("Fetch error:", error);
    }

    setLoading(false);
  };

  useEffect(() => {
    fetchUsers();
  }, []);

  const addUser = async () => {

    if (!name || !email) return;

    try {

      if (editId) {

        await fetch("/api/users/update", {
          method: "PUT",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ id: editId, name, email }),
        });

        setEditId("");

      } else {

        await fetch("/api/users", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ name, email }),
        });

      }

      setName("");
      setEmail("");

      fetchUsers();

    } catch (error) {
      console.error("Add user error:", error);
    }
  };

  const deleteUser = async (id: string) => {

    try {

      await fetch("/api/users", {
        method: "DELETE",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ id }),
      });

      fetchUsers();

    } catch (error) {
      console.error("Delete error:", error);
    }
  };

  const editUser = (user: User) => {
    setName(user.name);
    setEmail(user.email);
    setEditId(user._id);
  };

  return (

    <div className="min-h-screen bg-gray-100 p-10">

      <h1 className="text-4xl font-bold text-gray-800 mb-8">
        User Management Dashboard
      </h1>

      {/* Form */}
      <div className="bg-white p-6 rounded-lg shadow mb-8 flex gap-4">

        <input
          className="border border-gray-300 p-3 rounded w-1/3 focus:ring-2 focus:ring-blue-500"
          placeholder="Enter Name"
          value={name}
          onChange={(e)=>setName(e.target.value)}
        />

        <input
          className="border border-gray-300 p-3 rounded w-1/3 focus:ring-2 focus:ring-blue-500"
          placeholder="Enter Email"
          value={email}
          onChange={(e)=>setEmail(e.target.value)}
        />

        <button
          onClick={addUser}
          className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-3 rounded"
        >
          {editId ? "Update User" : "Add User"}
        </button>

      </div>

      {/* Table */}

      <div className="bg-white rounded-lg shadow">

        <table className="w-full">

          <thead className="bg-gray-200">
            <tr>
              <th className="p-4 text-left">Name</th>
              <th className="p-4 text-left">Email</th>
              <th className="p-4 text-center">Actions</th>
            </tr>
          </thead>

          <tbody>

            {loading && (
              <tr>
                <td colSpan={3} className="text-center p-6">
                  Loading users...
                </td>
              </tr>
            )}

            {!loading && users.length === 0 && (
              <tr>
                <td colSpan={3} className="text-center p-6 text-gray-500">
                  No users found
                </td>
              </tr>
            )}

            {users.map((u)=>(
              <tr key={u._id} className="border-t hover:bg-gray-50">

                <td className="p-4">{u.name}</td>

                <td className="p-4">{u.email}</td>

                <td className="p-4 flex justify-center gap-3">

                  <button
                    onClick={()=>editUser(u)}
                    className="bg-yellow-400 hover:bg-yellow-500 px-4 py-1 rounded"
                  >
                    Edit
                  </button>

                  <button
                    onClick={()=>deleteUser(u._id)}
                    className="bg-red-500 hover:bg-red-600 text-white px-4 py-1 rounded"
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