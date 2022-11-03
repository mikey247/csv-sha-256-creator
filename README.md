## Run Locally

#### Clone the project

```bash
  git clone https://github.com/mikey247/csv-sha-256-creator.git
```

#### Go to the project directory

```bash
cd csv-sha-256-creator
```

#### Install dependencies

```bash
  npm install
```

### The current implementation requires user to copy in their csv file to the directory and then change this line of code in index.js

```
//line 24

let json = csvToJson.fieldDelimiter(',').getJsonFromCsv('./test.csv');

//change (./test.csv) to the copied csv
```

#### Run the hashing

```bash
  ./index.js
```

#### New CSV

```
// An updated csv file final.csv and json file final.json with a new Hash table is created in the directory for your usage
```
