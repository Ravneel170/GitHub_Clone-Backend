const fs = require('fs');

const path = require('path');

const {promisify} = require('util');


const readDir = promisify(fs.readdir);

const copyFile = promisify(fs.copyFile);

async function revertRepo(commitID) {
   
     const repoPath = path.resolve(process.cwd(), '.myGit');
   
     const commitsPath = path.join(repoPath, 'commits');

   try {

      const commitDir = path.join(commitsPath, commitID);

      const files = await readDir(commitDir);

      const parentDir = path.resolve(repoPath, '..');

      for (let file of files) {

           await copyFile(path.join(commitDir, file), path.join(parentDir, file));
      }

      console.log(`Commit ${commitID} reverted successfully!`);
      
   } catch (error) {
      
      console.log('Error in reverting to the specified commit:', error);
   }
}

module.exports = {revertRepo};