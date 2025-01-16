<h1>Shortify</h1>
<p><em>url shortner Application</em></p>

<div>
<strong>Overview</strong><br>
Introducing "Shortify": a sophisticated URL shortening service built with Nest.js and TypeScript. Shortify offers advanced analytics capabilities, empowering users to track click-through rates, geographic distribution, and referral sources. With its robust backend system, Shortify ensures reliability, efficiency, and scalability, even under heavy traffic loads. Simplify your link management and gain valuable insights with Shortify.
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

<h3>Run using podman</h3>
<ol>
 <li>Install podman in your machine (follow google)</li>
  <li>Change following variables in .env file

```bash
DATABASE_HOST=localhost
REDIS_HOST=localhost
```
</li>

<li>
  start script
  
```bash
./create-pod.sh 
```
This will pull redis and postgres images and create three containers and run the whole application inside a pod shortify_pod.
</li>

<li>
  destroy script
  
```bash
./destroy-pod.sh shortify_pod
```
This will destroy the pod along with all the containers running inside it.
</li>

Setup done!!!!
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
docker compose up -d
```
This will pull redis and postgres images and containarize the whole application with it's dependencies
</li>

Setup done!!!!
</ol>
</div>

<div>
  <h2>Approach of Implementation</h2>
  ER diagram
  <img width="560" alt="image" src="https://github.com/Flanker-shyam/Shortify/assets/85950516/94a52cd7-753c-4e40-90ad-0ae5d4737129">

## Approach Documentation

### URL Shortener Solution

#### Overview
The URL shortener solution provides users with the ability to shorten URLs and obtain detailed analytics for their shortened URLs. It includes authentication and authorization mechanisms for accessing analytics, employs security measures to prevent vulnerabilities, and focuses on performance and scalability.

#### Functionalities
1. **URL Shortening**: Users can pass a long URL and receive a corresponding short URL. If the long URL already exists in the database, the system returns the existing short URL; otherwise, it generates a new short URL using SHA-256 hashing and take the first 8 characters of the hash; although teh chances of collision are very rare but still here to maintain the uniqueness of shortUrl I am using while loop and every time I am checking if the shortUrl exist in the db or not.

2. **Fetch URL Data**: The system checks Redis cache for the short URL mapping. If found, it redirects the user and saves analytics. If not found, it checks the database. If the URL exists in the database, it saves the mapping in Redis, redirects the user, and saves analytics. If the URL is not found in either Redis or the database, it returns a "URL not found" error.
   
    **Save Analytics**: This function extract info from the request header like: User-agant, referer and store it in analytics table along with other data like timeStamp.

4. **Get Analytics**: Users can retrieve analytics for their URLs by providing their username. The system fetches all URLs created by the user and retrieves analytics data for each URL. The analytics include user-agent, referral source (or "Direct" if not available), timestamp, and number of clicks(number of clicks===size of analytics array).

5. **Authentication and Authorization**: Users need to register and log in to access the analytics feature. Upon successful login, users receive an authentication token, which they can use to authorize access to their analytics data. This ensures that users only have access to their own URLs and associated analytics.

#### Security Measures
- **Input Validation**: Validate input data before performing database actions to prevent SQL injection attacks.
- **CORS**: Implement Cross-Origin Resource Sharing to restrict access from unauthorized domains.
- **Helmet**: Use Helmet middleware to set various HTTP headers for enhanced security.
- **Rate Limiting**: Implement rate limiting to prevent abuse of the service and mitigate Denial-of-Service attacks.
- **Authentication**: Implement secure user authentication mechanisms to ensure only authenticated users can access their analytics data.
- **Authorization**: Authorize access to analytics data using authentication tokens to ensure users can only access their own data.

#### Performance Enhancements
- **Redis Cache**: Utilize Redis caching to improve performance by storing frequently accessed URL mappings.
- **Docker Containerization**: Package the application and its dependencies into Docker containers for portability and efficiency.

#### Testing
- **Unit Tests**: Develop unit tests to verify the functionality of individual components and ensure code quality.
- **Integration Tests**: Plan to add integration tests to validate the interaction between different modules and cover various use cases comprehensively.

#### Future Enhancements plan to do
- **Load Balancing and DB Sharding**:
- LOAD BALANCING:
  For load balancing as my application is already running in docker container, I will be using NGINX as a reverse proxy server along with Round-Robin algorithm

</div>



docker run --name redis -d -p 6379:6379 redis

docker run --name postgres -d -e POSTGRES_USER=flanker -e POSTGRES_PASSWORD=flanker -e POSTGRES_DB=url_shortner -p 5432:5432 postgres

docker run --name nest-app -p 3000:3000 --link redis --link postgres -e POSTGRES_HOST=postgres -e POSTGRES_PORT=5432 -e POSTGRES_DB=url_shortner -e POSTGRES_USER=flanker -e POSTGRES_PASSWORD=flanker -e REDIS_HOST=redis -e REDIS_PORT=6379 flanker1916/shorty:1


podman:

podman pod create --name shortify_pod -p 3000:3000 -p 5432:5432 -p 6379:6379

podman run --pod myfirst -e POSTGRES_USER=flanker -e POSTGRES_PASSWORD=flanker -e POSTGRES_DB=url_shortner --name postgres postgres

podman run --pod myfirst --name redis redis

podman run --pod myfirst --name myAPP myapp

