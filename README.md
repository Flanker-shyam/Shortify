<h1>Shortify</h1>
<p><em>url shortner Application</em></p>

<div>
<strong>Overview</strong><br>
This project aims to develop a sophisticated URL shortening service with advanced analytics capabilities. Built using Nest.js and TypeScript, the backend system ensures robustness, efficiency, and scalability to handle high traffic loads while providing detailed insights into URL usage.
</div>

<br>
<div>
<strong>Technologies Used</strong><br>
<ul>
<li>Nest.js</li>
<li>TypeScript</li>
<li>PostgreSQL</li>
<li>Redis</li>
<li>Jest</li>
</ul>
</div>

<div>
<h2>How to setup and run</h2>
<h3>Local Setup</h3>
<strong>Make sure you have the following installed on your system:</strong>
<ul>
  <li>Node</li>
  <li>Postgres</li>
  <li>Redis</li>
</ul>
<ol>
  <li>Fork this repo</li>
  <li>Clone this repo</li>
  
  ```bash
  git clone git@github.com:Flanker-shyam/Shortify.git
  ```
<li>install dependencies</li>

  ```bash
  npm install
  ```
<li>Setup Environment variables: </li>

<ul>
  <li>Create a .env file in the root dir of this project</li>
  <li>Copy content of example.env into this file</li>
  <li>Change dummy values accordingly</li>
</ul>

<li>Setup Database</li>
<ul>
  <li>
    Start local Postgres server<br>
    For MacOS

  ```bash
  brew services start postgresql
  ```

For Linux

 ```bash
 sudo systemctl start postgresql
 ```

  </li>
  <li>
    Create Database: url_shortner/or choose any db name
  </li>
  <li>
    Run DB migration to push DB schemas to the DB
    
  ```bash
  npm run migration:run
  ```
    
  </li>
</ul>
<li>Redis setup</li>
<ul>
 <li>
    Start local Redis server<br>
    For MacOS

  ```bash
  brew services start redis
  ```

For Linux
  ```bash
  sudo systemctl start redis
  ```
  </li>
  </ul>
  <li>Run and test</li>
 Run this project
 <ul>
   <li>To run
     
  ```bash
  npm run start
  ```
   </li>
    <li>To run in watch mode
     
  ```bash
   npm run start:dev
  ```
   </li>
    <li>To run test
     
  ```bash
  npm run test
  ```
   </li>
 </ul>
</ol>

<h3>Docker container Setup</h3>
<ol>
  <li>Change following variables in .env file

```bash
DATABASE_HOST=postgres
REDIS_HOST=redis
```
</li>

<li>
  Create docker container
  
```bash
docker-compose up -d
```
This will pull redis and postgres images and containarize the whole application with it's dependencies
</li>
<li>

Migrate database into postgres docker image:
<ul>
<li>
  Execute following command and copy the name of the container

```bash
docker ps 
```
</li>

<li>
  Execute follwoing command to perfom db migration

```bash
docker exec -it "name_of_the_container" npm run migration:run
```

This will migrate DB into postgres docker image
</li>
</ul>
</li>
Setup done!!!!
</ol>
</div>
