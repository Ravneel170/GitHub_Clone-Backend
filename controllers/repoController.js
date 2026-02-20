const mongoose = require('mongoose');

const Repository = require('../models/repo');

const User = require('../models/user');

const Issue = require('../models/issue');

const createRepo = async (req, res) => {

  const { owner, name, issues, content, description, visibility } = req.body;

  try {

    if (!name) {

      return res.status(400).json({ error: "Repository name is required!" })
    }

    if (!mongoose.Types.ObjectId.isValid(owner)) {

      return res.status(400).json({ error: "Invalid userId" });
    }

    const newRepo = new Repository({

      name, owner, issues, content, description, visibility
    })

    const result = await newRepo.save();

    res.status(201).json({ message: "Repo has been created", repoId: result._id })

  } catch (error) {

    console.error('Error during repo creation:', error.message);

    res.status(500).json({ message: "Server Error" });
  }
}

const getAllRepos = async (req, res) => {

  try {

    const allRepos = await Repository.find({}).populate('owner').populate('issues');

    res.json(allRepos);

  } catch (err) {

    console.error('Error during fetching repos:', err.message);

    res.status(500).json({ message: "Server Error" });
  }
}

const getRepoById = async (req, res) => {

  const repoId = req.params.id;

  try {

    const repo = await Repository.find({ _id: repoId }).populate('owner').populate('issues');

    res.json(repo);

  } catch (error) {

    console.error('Error during fetching repo:', error.message);

    res.status(500).json({ message: "Server Error" });
  }
}


const getRepoByName = async (req, res) => {

  const repoName = req.params.name;

  try {

    const repo = await Repository.find({ name: repoName }).populate('owner').populate('issues');

    if (!repo) {

      return res.status(404).json({ message: "Not able to find the repo with this name" })
    }

    res.json(repo);

  } catch (error) {

    console.error('Error during fetching repo:', error.message);

    res.status(500).json({ message: "Server Error" });
  }
}


const getRepoByUserId = async (req, res) => {

  const userId = req.params.userId;

  try {

    const repos = await Repository.find({ owner: userId });

    if (!repos || repos.length == 0) {

      return res.status(404).json({ message: "Not able to find the repo with associated with the specified user" })
    }

    res.json({ message: "Repositories found", repos })

  } catch (err) {

    console.error('Error during fetching user repo:', err.message);

    res.status(500).json({ message: "Server Error" });
  }
}


const updateRepoById = async (req, res) => {

  const id = req.params.id;

  const { content, description } = req.body;

  try {

    const repo = await Repository.findById(id);

    if (!repo) {

      return res.status(404).json({ message: "Unable to find the repo" });
    }

    repo.content.push(content);

    repo.description = description;

    const updatedRepo = await Repository.save();

    res.json({ message: "Repo has been updated!", updatedRepo });

  } catch (err) {

    console.error('Error in updating the info:', err.message);

    res.status(500).json({ message: 'Server Error' });
  }
}


const toggleVisibilityById = async (req, res) => {

  const id = req.params.id;

  try {

    const repo = await Repository.findById(id);

    if (!repo) {

      return res.status(404).json({ message: "Unable to find the repo" });
    }

    repo.visibility = !repo.visibility;

    const updatedRepo = await Repository.save();

    res.json({ message: "Repo visibility has been updated!", updatedRepo });

  } catch (err) {

    console.error('Error in updating the visibility:', err.message);

    res.status(500).json({ message: 'Server Error' });
  }
}

const deleteRepoById = async (req, res) => {

  const id = req.params.id;

  try {

    const repo = await Repository.findByIdAndDelete(id);

    if (!repo) {

      return res.status(404).json({ message: "Unable to find the repo" });
    }

    res.json({ message: "Repo has been deleted" });

  } catch (err) {

    console.error('Error in deleting the repo:', err.message);

    res.status(500).json({ message: "Server Error!" });

  }
}


module.exports = { getAllRepos, getRepoById, getRepoByName, getRepoByUserId, toggleVisibilityById, updateRepoById, deleteRepoById, createRepo }