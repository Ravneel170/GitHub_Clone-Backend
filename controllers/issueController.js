const mongoose = require('mongoose');

const Repository = require('../models/repo');

const User = require('../models/user');

const Issue = require('../models/issue');


const createIssue = async (req, res) => {

  const { title, description } = req.body;

  const { id } = req.params;

  try {

    const issue = new Issue({

      title, description, repository: id
    });

    await issue.save();

    res.staus(201).json({ message: "Issue has been created!" });

  } catch (err) {

    console.error('Error in creating issue!', err.message);

    res.status(500).json({ message: "Server Error" });
  }

}


const updateIssueById = async (req, res) => {

  const id = req.params.id;

  const { title, description, status } = req.body;

  try {

    const issue = await Issue.findById(id);

    if (!issue) {

      return res.status(404).json({ messag: "Issue not found" });
    }

    issue.title = title;

    issue.description = description;

    issue.status = status;

    await issue.save();

    res.json(issue);

  } catch (err) {

    console.error('Error in updating the issue!', err.message);

    res.status(500).json({ message: "Server Error" });
  }

}


const deleteIssueById = async (req, res) => {

  const id = req.params.id;

  try {

    const issue = await Issue.findByIdAndDelete(id);

    if (!issue) {

      return res.status(404).json({ messag: "Issue not found" });
    }

    res.status(200).json({ message: "Issue has been deleted" });

  } catch (err) {

    console.error('Error in deleting the issue!', err.message);

    res.status(500).json({ message: "Server Error" });
  }
}


const getAllIssues = async (req, res) => {

  const id = req.params.id;

  try {

    const issues = await Issue.find({ repository: id });

    if (!issues) {

      return res.status(404).json({ messag: "Issues not found" });
    }

    res.status(200).json(issues);

  } catch (err) {

    console.error('Unable to fetch issues for this repo', err.messag);

    res.status(500).json({ message: "Server Error" });
  }
}


const getIssueById = async (req, res) => {

  const id = req.params.id;

  try {

    const issue = await Issue.findById(id);

    if (!issue) {

      return res.status(404).json({ messag: "Issues not found" });
    }

    res.status(200).json(issue)

  } catch (err) {

    console.error('Unable to fetch the issue:', err.messag);

    res.status(500).json({ message: "Server Error" });
  }
}


module.exports = { createIssue, getIssueById, getAllIssues, deleteIssueById, updateIssueById };

