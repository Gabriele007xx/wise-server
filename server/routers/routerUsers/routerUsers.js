import { Router } from "express";
import {getDb} from "../../database/db.js";
import bcrypt from "bcrypt";

const routerUsers = Router();

routerUsers.get("/", async (req, res) => {
  let db = await getDb();
  try
  {
    
    const users = await db.all("SELECT * FROM users");
    return res.status(200).json(users).appendHeader("Allow-Control-Allow-Origin", "*");
  }
  catch(error)
  {
    return res.status(500).send("Error retrieving users: " + error.message);
  }
});

routerUsers.post("/register/", async (req, res) => {
  let db = await getDb();
  const { name, email, password } = req.body;

  // to do: aggiungere validazioni

  try {
    const hashedPassword = await bcrypt.hash(password, 10);
    const result = await db.run(
      "INSERT INTO users (name, email, password) VALUES (?, ?, ?)",
      [name, email, hashedPassword]
    );
    return res.status(201).json({ id: result.lastID, name, email, message: "User created successfully"});
  } catch (error) {
    return res.status(500).send("Error creating user: " + error.message);
  }
});

routerUsers.delete("/:id", async (req, res) => {
  let db = await getDb();
  const userId = req.params.id;

  try {
    const result = await db.run("DELETE FROM users WHERE id = ?", [userId]);
    if (result.changes === 0) {
      return res.status(404).send("User not found");
    }
    return res.status(200).send("User deleted successfully");
  } catch (error) {
    return res.status(500).send("Error deleting user: " + error.message);
  }
});

routerUsers.put("/:id", async (req, res) => {
  let db = await getDb();
  const { name, email, password } = req.body;
  const userId = req.params.id;

  try {
    const result = await db.run(
      "UPDATE users SET name = ?, email = ?, password = ? WHERE id = ?",
      [name, email, password, userId]
    );
    if (result.changes === 0) {
      return res.status(404).send("User not found");
    }
    return res.status(200).send("User updated successfully");
  } catch (error) {
    return res.status(500).send("Error updating user: " + error.message);
  }
});


export { routerUsers };