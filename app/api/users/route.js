import { connectDB } from "@/lib/mongodb";
import User from "@/models/User";
import { NextResponse } from "next/server";

// GET USERS
export async function GET() {
  try {
    await connectDB();
    const users = await User.find();
    return NextResponse.json(users);
  } catch (error) {
    return NextResponse.json({ error: "Failed to fetch users" }, { status: 500 });
  }
}

// ADD USER
export async function POST(req) {
  try {
    await connectDB();
    const { name, email } = await req.json();

    const newUser = await User.create({
      name,
      email,
    });

    return NextResponse.json(newUser);
  } catch (error) {
    return NextResponse.json({ error: "Failed to create user" }, { status: 500 });
  }
}

// DELETE USER
export async function DELETE(req) {
  try {
    await connectDB();
    const { id } = await req.json();

    await User.findByIdAndDelete(id);

    return NextResponse.json({ message: "User deleted" });
  } catch (error) {
    return NextResponse.json({ error: "Failed to delete user" }, { status: 500 });
  }
}

// UPDATE USER
export async function PUT(req) {
  try {
    await connectDB();

    const { id, name, email } = await req.json();

    const updatedUser = await User.findByIdAndUpdate(
      id,
      { name, email },
      { new: true }
    );

    return NextResponse.json(updatedUser);
  } catch (error) {
    return NextResponse.json({ error: "Failed to update user" }, { status: 500 });
  }
}
