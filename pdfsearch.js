//this program will take a folder and search for all pdf files and then search for a specific word in each file recursively
const args = process.argv.slice(2); //folder
//we will search for telephone numbers within the pdf files using regex
// const regex = /(\d{3})\D*(\d{3})\D*(\d{4})/g;
//^(\+\d{1,2}\s?)?\(?\d{3}\)?[\s.-]?\d{3}[\s.-]?\d{4}$
const LLL = console.log;
console.clear();
console.debug = console.log = function () {};

const fs = require('fs');

const execsync = require('child_process').execSync;
const path = require('path');
if (!fs.existsSync('tika.jar')) {
  LLL('tika not found');
  process.exit(1);
}

//check if java is installed
const options = {
  encoding: 'utf8',
  maxBuffer: 1024 * 1024 * 10,
  //hide stdio
  stdio: ['ignore', 'pipe', 'ignore'],
  encoding: 'utf8',
};
const java = execsync('java -version', options, (err, stdout, stderr) => {
  if (err) {
    LLL('Error reading java version');
    return;
  }
  if (stderr) {
    LLL('Error reading java version');
    return;
  }
});
if (java.includes('not recognized')) {
  LLL('Java not found');
  process.exit(1);
}
const files = [];

const folder = args[0];
const filetype = args[1] || 'pdf';
const regex = args[2] || /(\+\d{1,2}\s?)?\(?\d{3}\)?[\s.-]?\d{3}[\s.-]?\d{4}/g;
if (!folder) {
  LLL('Please provide a folder path');
  process.exit(1);
}
LLL('Searching for files in: ', folder);
LLL('Searching for: ', regex);
LLL('File type: ', filetype);

//create a report file
fs.writeFileSync('foundFiles.csv', 'file,matches\n');
// const files = [];
let counter = 0;
async function searchForWordInPdfFiles(folder) {
  let contents;
  try {
    contents = fs.readdirSync(folder);
  } catch (err) {
    LLL('Error reading ' + folder + ' folder');
    return;
  }

  contents.forEach((content) => {
    const contentPath = path.join(folder, content);
    const stat = fs.statSync(contentPath);
    if (stat.isDirectory()) {
      searchForWordInPdfFiles(contentPath);
    } else if (contentPath.endsWith(filetype) || contentPath.endsWith(filetype.toUpperCase())) {
      counter++;
      files.push(contentPath);
    }
  });
}
async function extractTextFromFile(file) {
  LLL('Extracting text from file: ', file);
  const command = `java -Djava.awt.headless=true -Xmx1024m -jar tika.jar -t "${file}"`;
  const options = {
    encoding: 'utf8',
    maxBuffer: 1024 * 1024 * 10,
    //hide stdio
    stdio: ['ignore', 'pipe', 'ignore'],
  };

  const result = execsync(command, options, (err, stdout, stderr) => {
    if (err) {
      LLL('Error reading pdf file: ', file);
      return;
    }
    if (stderr) {
      LLL('Error reading pdf file: ', file);
      return;
    }
  });

  if (result) {
    const matches = result.toString().match(regex);
    if (matches) {
      LLL('Found in file:', matches.length);
      fs.appendFileSync('foundFiles.csv', `${file}, [${matches.join(';')}]\n`);
      return;
    }
  } else {
    LLL('No text found in file: ', file);
    return;
  }
}

async function processFiles() {
  files.forEach((file) => {
    extractTextFromFile(file);
  });
}

async function main() {
  await searchForWordInPdfFiles(folder);
  LLL('Files found: ', counter);
  await processFiles();
}

main();
