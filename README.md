# pdfsearch

## Requires: 

java jre 8 or later (https://www.java.com/download/)

node.js 16 or later (https://nodejs.org/en/download/)

apache tika 2.9.1 or later (https://tika.apache.org/download.html)

## Usage: 

```node pdfsearch.js folder filetype searchterm```

```filetype``` is optional. If not provided, the search will be performed on all pdf files in the folder. If provided, the search will be performed only on files with the specified extension. 

```searchterm``` is also optional, by default it searches for phone numbers by regex. 

Example: ```node pdfsearch.js c:\myfiles pdf potato```

The output will hopefully be a csv file.

## Installation

```npm install```

