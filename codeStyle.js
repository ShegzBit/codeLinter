#!/usr/bin/node

const { exec } = require('child_process');
const fs = require('fs');

const fileList = process.argv.slice(2);

const fileDict = groupFile(fileList);
styleFile(groupFile(fileList));

handleFileError(fileDict.nonExistent, "Could find these files");
handleFileError(fileDict.invalids, "Couldn't find a style linter for these files");

function groupFile (fileList) {
  const fileDict = { jsFiles: [], pyFiles: [], cFiles: [], invalids: [], nonExistent: [] };

  for (file of fileList) {
    categorize(file);
  }

  function categorize (file) {
    const pyMatch = /[\w\s\W]+\.py$/;
    const jsMatch = /[\w\s\W]+\.js$/;
    const cMatch = /[\w\s\W]+\.(c|h)$/;

    if (!(fs.existsSync(file))){
      fileDict.nonExistent.push(file);
    } else if (pyMatch.test(file)) {
      fileDict.pyFiles.push(file);
    } else if (jsMatch.test(file)) {
      fileDict.jsFiles.push(file);
    } else if (cMatch.test(file)) {
      fileDict.cFiles.push(file);
    } else {
      fileDict.invalids.push(file);
    }
  }
  return fileDict;
}
// { jsFiles: [], pyFiles: [], cFiles: [] }
function styleFile (fileDict) {

    styleSpecificType(fileDict, 'jsFiles');
    styleSpecificType(fileDict, 'pyFiles');
    styleSpecificType(fileDict, 'cFiles');

  function styleSpecificType (fileDict, fileType) {
    for (file of fileDict[fileType]) {
      callStyler(file, fileType);
    }
  }

  function callStyler (file, fileType) {
    const styler = { jsFiles: 'semistandard ', pyFiles: 'pycodestyle ', cFiles: 'betty ' };
    exec(styler[fileType] + file, (err, stdout, stderr) => {
      console.log(`--------------------------------${file}----------------------------------`);
      console.log(stdout);
      console.log(stderr);
    });
  }
}

function handleFileError(fileList, message) {
  if (fileList.length != 0){
    console.log(message + ` [ ${String(fileList).split(',').join(', ')} ]`)
  }
}