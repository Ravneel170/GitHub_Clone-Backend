const express = require('express');

const userRouter = require('../routes/user.router');

const repoRouter = require('../routes/repo.router');

const issueRouter = require('../routes/issue.router');

const mainRouter = express.Router();

mainRouter.use(userRouter);

mainRouter.use(repoRouter);

mainRouter.use(issueRouter);

mainRouter.get('/', (req, res) => {

  res.send('Welcome to home');
});

module.exports = mainRouter;