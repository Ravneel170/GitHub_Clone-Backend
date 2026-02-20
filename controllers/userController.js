require('dotenv').config();

const jwt = require('jsonwebtoken');

const bcrypt = require('bcrypt');

const { MongoClient } = require('mongodb');

const uri = process.env.MONGODB_URL;

let ObjectId = require('mongodb').ObjectId;


let client;

async function connectClient() {

  if (!client) {

    client = new MongoClient(uri);

    await client.connect();
  }
}

const signup = async (req, res) => {

  const { username, email, password } = req.body;

  try {

    await connectClient();

    const db = client.db('GitHubClone');

    const usersCollection = db.collection('users');

    const user = await usersCollection.findOne({ email });

    if (user) {

      return res.status(400).json({ message: "User Already Exists" });
    }

    const salt = await bcrypt.genSalt(10);

    const hashedPassword = await bcrypt.hash(password, salt);

    const newUser = {

      username,

      password: hashedPassword,

      email,

      respositories: [],

      followedUsers: [],

      starRepositories: []
    }

    const result = await usersCollection.insertOne(newUser);

    const token = jwt.sign({ id: result.insertedId }, process.env.JWT_SECRET, { expiresIn: "1h" });

    res.json({ token, userId: result.insertedId });

  } catch (error) {

    console.error("Error in sigining up the user:", error.message);

    res.status(500).send("Server Error");
  }
}


const login = async (req, res) => {

  const { email, password } = req.body;

  try {

    await connectClient();

    const db = client.db('GitHubClone');

    const usersCollection = db.collection('users');

    const user = await usersCollection.findOne({ email });

    if (!user) {

      return res.status(400).json({ message: 'Invalid Credentials!' })
    }

    const isMatch = await bcrypt.compare(password, user.password);

    if (!isMatch) {

      return res.status(404).json({ message: "Unauthorized! Password is incorrect" });
    }

    const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET, { expiresIn: "1h" });

    res.json({ token, userId: user._id });

  } catch (error) {

    console.error("Error during login:", error.message);

    res.status(500).send("Server Error");
  }
}



const getAllUsers = async (req, res) => {

  try {

    await connectClient();

    const db = client.db('GitHubClone');

    const usersCollection = db.collection('users');

    const users = await usersCollection.find({}).toArray();

    res.json({ users });

  } catch (error) {

    console.error("Error in fetching users:", error.message);

    res.status(500).send("Server Error");
  }
}


const getUserProfile = async (req, res) => {

  const id = req.params.id;

  try {

    await connectClient();

    const db = client.db('GitHubClone');

    const usersCollection = db.collection('users');

    const user = await usersCollection.findOne({

      _id: new ObjectId(id)
    });

    if (!user) {

      return res.status(404).json({ message: 'User not found' })
    }

    res.send(user);

  } catch (error) {

    console.error("Error in fetching user:", error.message);

    res.status(500).send("Server Error");
  }
}

const updateUserProfile = async (req, res) => {

  const id = req.params.id;

  const { email, password } = req.body;

  try {

    await connectClient();

    const db = client.db('GitHubClone');

    const usersCollection = db.collection('users');

    let updateFields = { email };

    if (password) {

      const salt = await bcrypt.genSalt(10);

      const hashedPassword = await bcrypt.hash(password, salt);

      updateFields.password = hashedPassword;
    }

    const result = await usersCollection.findOneAndUpdate({

      _id: new ObjectId(id)

    }, { $set: updateFields }, { returnDocument: "after" })

    if (!result) {

      return res.status(404).json({ message: "user not found!" })
    }

    res.send(result);

  } catch (error) {

    console.error("Error in updating user information:", error.message);

    res.status(500).send("Server Error");
  }

}

const deleteUserProfile = async (req, res) => {

  const id = req.params.id;

  try {

    await connectClient();

    const db = client.db('GitHubClone');

    const usersCollection = db.collection('users');

    const result = await usersCollection.deleteOne({

      _id: new ObjectId(id)
    })

    if (result.deleteCount == 0) {

      return res.status(404).json({ message: "User not found!" });
    }

    res.json({ message: "User deleted" });

  } catch (error) {

    console.error("Error in deleting the user:", error.message);

    res.status(500).send("Server Error");
  }
}


module.exports = { getAllUsers, signup, login, getUserProfile, updateUserProfile, deleteUserProfile };

