# Project Title: Miguel API

## Description
Miguel API is a RESTful API designed for user management. It provides endpoints to create, read, update, and delete user information. The API is built using Node.js and Express, and it utilizes MongoDB for data storage.

## Table of Contents
- [Installation](#installation)
- [Usage](#usage)
- [API Endpoints](#api-endpoints)
- [License](#license)

## Installation
To get started with the Miguel API, follow these steps:

1. Clone the repository:
   ```
   git clone <repository-url>
   cd miguelApi
   ```

2. Install the dependencies:
   ```
   npm install
   ```

3. Set up your MongoDB database and update the connection string in your application.

## Usage
To run the application, use the following command:
```
node app.js
```
The server will start on `http://localhost:3000`.

## API Endpoints
### Users
- **GET /usuarios**: Retrieve all users.
- **GET /usuarios/{id}**: Retrieve a user by ID.
- **POST /usuarios**: Create a new user.
- **PUT /usuarios/{id}**: Update an existing user.
- **DELETE /usuarios/{id}**: Delete a user.

### Swagger Documentation
The API documentation is available at `http://localhost:3000/api-docs`. This documentation is generated using Swagger and provides detailed information about each endpoint, including request parameters and response formats.

## License
This project is licensed under the MIT License. See the LICENSE file for more details.