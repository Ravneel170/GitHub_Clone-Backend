require('dotenv').config();

const express = require('express');

const cors = require('cors');

const mongoose = require('mongoose');

const bodyParser = require('body-parser');

const http = require('http');

const yargs = require('yargs');

const { Server } = require('socket.io');

const { hideBin } = require('yargs/helpers');

const { initRepo } = require('./controllers/init');

const { addRepo } = require('./controllers/add');

const { commitRepo } = require('./controllers/commit');

const { pullRepo } = require('./controllers/pull');

const { revertRepo } = require('./controllers/revert');

const { pushRepo } = require('./controllers/push');

const mainRouter = require('./routes/main.router');


yargs(hideBin(process.argv))

  .command('start', 'Starts the server', {}, startServer)

  .command('init', 'Initialize a new Repository', {}, initRepo)

  .command('add <file>', 'Add a file to the Repository', (yargs) => {

    yargs.positional("file", {

      describe: "File to add to the staging area",

      type: "string"

    });

  }, (argv) => { addRepo(argv.file) }
  )

  .command('commit <message>',
    'Commit the staged files',
    (yargs) => {
      yargs.positional('message', {

        describe: 'Commit message',

        type: 'string'
      }
      )
    },

    (argv) => {

      commitRepo(argv.message);
    }
  )

  .command("push", "Push Commits to S3", {}, pushRepo)

  .command("pull", "Pull commits from S3", {}, pullRepo)

  .command('revert <commitID>', "Revert to a specific commit",

    (yargs) => {
      yargs.positional('commitID', {

        describe: "Commit ID to revert to",

        type: "string"
      })

    },

    (argv) => {

      revertRepo(argv.commitID);
    }
  )

  .demandCommand(1, 'Please give a command').help().argv;

function startServer() {

  const app = express();

  const port = process.env.PORT || 3000;

  app.use(bodyParser.json());

  app.use(express.json());

  app.use(express.urlencoded({ extended: true }));

  const mongoURI = process.env.MONGODB_URL;

  mongoose.connect(mongoURI).then(() => console.log('Mongo DB Connected')).catch((err) => console.error('Error connecting to the server:', err));

 app.use(cors({
  origin: 'https://main.d2zstnrkg26n37.amplifyapp.com',
  credentials: true, 
}));

  app.use('/', mainRouter);

  let user = 'test';

  const httpServer = http.createServer(app);

  const io = new Server(httpServer, {

    cors: {

      origin: '*',

      methods: ["GET", "POST"]
    }
  });

  io.on("connection", (socket) => {

    socket.on("joinRoom", (userID) => {

      user = userID;

      console.log("====");

      console.log(user);

      console.log('====');

      socket.join(userID);
    })
  });

  const db = mongoose.connection;

  db.once("open", async () => {

    console.log('Crud operations called');

    //crud operations
  })

  httpServer.listen(port, () => {

    console.log(`Server is running on port ${port}`)
  })
};


