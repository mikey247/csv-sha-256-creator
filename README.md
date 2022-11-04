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

#### The current implementation requires user to copy in their csv file to the directory before running the script

#### In your Bash, run the script

```bash
  ./index.js -f yourCsvFile.csv
  OR
  node index.js -f yourCsvFile.csv

  TO RUN THE DEFAULT TEST CSV

  ./index.js -f
  OR
  node index.js -f
```

#### New CSV and JSON directory

```
// An updated csv file yourCsvFile.output.csv and json file yourCsvFile.json with the new Hash colunm is created in a new "data" folder for your usage
// An "nfts" folder is created with json files for each nft.
```

## ENJOY😎
