# graphql-schema-genetator
## This code will generate schema.graphql file in your project

## Requirements
1. node version 16 or above should be installed.
2. graphql should be installed, for that run ->
```
 npm install
```

## if your project is already using apollo-graphq replace import of main.js with:
```
const { buildClientSchema } = require('graphql');
const {printSchema} = require('graphql');
```

## To generate schema from on client side from the server: 
  1. change the server url.
  2. paste the authorization key.
  3. run.
  ```
node main.js
```
