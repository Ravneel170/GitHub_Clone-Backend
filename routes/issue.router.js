const express = require('express');

const issueController = require('../controllers/issueController');

const issueRouter = express.Router();


issueRouter.post('/issue/create/:id', issueController.createIssue);

issueRouter.get('/issue/all/:id', issueController.getAllIssues);

issueRouter.put('/issue/update/:id', issueController.updateIssueById);

issueRouter.get('/issue/:id', issueController.getIssueById);

issueRouter.delete('/issue/delete/:id', issueController.deleteIssueById);


module.exports = issueRouter;