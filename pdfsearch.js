//this program will take a folder and search for all pdf files and then search for a specific word in each file recursively
const args = process.argv.slice(2); //folder
//we will search for telephone numbers within the pdf files using regex
// const regex = /(\d{3})\D*(\d{3})\D*(\d{4})/g;
//^(\+\d{1,2}\s?)?\(?\d{3}\)?[\s.-]?\d{3}[\s.-]?\d{4}$
const regex = /(\+\d{1,2}\s?)?\(?\d{3}\)?[\s.-]?\d{3}[\s.-]?\d{4}/g;
const fs = require('fs');
const path = require('path');
//use textract to extract text from pdf files
const textract = require('textract');

const folder = args[0];
if (!folder) {
  console.log('Please provide a folder path');
  process.exit(1);
}
//create a report file
fs.writeFileSync('foundFiles.csv', 'file,matches\n');
const files = [];

async function searchForWordInPdfFiles(folder) {
  let contents;
  try {
    contents = fs.readdirSync(folder);
  } catch (err) {
    console.log('Error reading ' + folder + ' folder');
    return;
  }

  contents.forEach((content) => {
    const contentPath = path.join(folder, content);
    const stat = fs.statSync(contentPath);
    if (stat.isDirectory()) {
      searchForWordInPdfFiles(contentPath);
    } else if (contentPath.endsWith('.pdf')) {
      files.push(contentPath);
    }
  });
}

async function extractTextFromFile(file) {
  textract.fromFileWithPath(file, async function (error, text) {
    if (error) {
      console.log('Error extracting text from ' + file + ' file');
      return;
    }
    const matches = text.match(regex);
    if (matches) {
      fs.appendFileSync('foundFiles.csv', `${file}, [${matches.join(';')}]\n`);
    }
  });
}

async function processFiles() {
  files.forEach((file) => {
    extractTextFromFile(file);
  });
}

async function main() {
  await searchForWordInPdfFiles(folder);
  await processFiles();
}

main();
