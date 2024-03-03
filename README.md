# pdfsearch

usage: 

```node pdfsearch.js folder filetype searchterm```

```filetype``` is optional. If not provided, the search will be performed on all pdf files in the folder. If provided, the search will be performed only on files with the specified extension. 

Example: ```node pdfsearch.js /path/to/folder pdf "search term"```

```searchterm``` is also optional, by default it searches for phone numbers by regex. 

Example: ```node pdfsearch.js /path/to/folder "search term"```

# Installation

```npm install```

