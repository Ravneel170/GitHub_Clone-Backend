
const fs = require('fs').promises;

const path = require('path');

const { s3, S3_Bucket } = require('../config/awsConfig');



async function pushRepo() {

   const repoPath = path.resolve(process.cwd(), '.myGit');

   const commitsPath = path.join(repoPath, 'commits');


   try {

      const commitDirs = await fs.readdir(commitsPath);

      for (let commitDir of commitDirs) {

         const commitPath = path.join(commitsPath, commitDir);

         const files = await fs.readdir(commitPath);

         for (let file of files) {

            const filePath = path.join(commitPath, file);

            const fileContent = await fs.readFile(filePath);

            const params = {

               Bucket: S3_Bucket,

               Key: `commits/${commitDir}/${file}`,

               Body: fileContent
            };

            await s3.upload(params).promise();
         }
      }

      console.log('All commits have been pushed to S3');

   } catch (error) {


      console.error('Error in pushing to S3:', error);
   }
}


module.exports = { pushRepo };