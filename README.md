# Jojoba-API

A RESTful API created with Node.js and Express Framework for dating application the server just like Tinder. Also server can handle chat for every user that match each other using Firebase Cloud Messaging. This project uses MongoDB to store all user data and chat data.

#Getting Started

This project is ready to running on local system or cloud system, see prerequisities before started the project.

**Prerequisities**

Please consider that you have following software installed on your local system

 1. Node.js and NPM installed -> https://nodejs.org
 2. MongoDB installed -> https://www.mongodb.com/

**Installing**

Clone project in this repository


    git clone https://github.com/digitkhrisnaa/Jojoba-API.git

Open terminal and move to project directory. After that install dependencies use NPM

    npm install
 
 And the project is ready to run, before running project make sure you have start MongoDB services
 

    mongod
 
 After MongoDB service started, run server
 

    node app.js
  
 
#Running Project
Hit API using curl. If you run on local system you can access base URL with http://localhost:[port] 

**Header authorization** (Except login API and you will get token after login)

    Authorization: bearer <your device token>

**Signin User**

    POST -> /api/v1/login -> JSON Format ->
    {
    "fbid":<type: String, value: FB ID, required: true>,
    "name":<type: String, value: Name, required: true>,
    "url_photo":<type: String, value: URL Photo, required: true>,
    "dob":<type: String, value: Date Of Birth, required: false>,
    "gender":<type: String, value: enum: ['male', 'female'], required: true>
    "religion":<type: String, value: enum: ['islam', 'christianity', 'hinduism', 'buddhism', 'other'], required: false>,
    "loc":[<long>,<lat>] 
    }

**Update User**

    POST -> /api/v1/update -> JSON Format ->
    {
    "fbid":<type: String, value: FB ID, required: true>,
    "url_photo":<type: String, value: URL Photo, required: true>,
    "dob":<type: String, value: Date Of Birth, required: false>,
    "religion":<type: String, value: enum: ['islam', 'christianity', 'hinduism', 'buddhism', 'other'], required: false>,
    "loc":[<long>,<lat>]
    }

**Find Match**

    GET -> /api/v1/findmatch -> Parameter ->
    a. fbid = value <type: string, required: true>
    b. pagination = value <format type: number, example: 10, required: false, default server: 10>
    c. age = value <format type: string, example: "19-23", required: false>
    d. nearRadius = value <format type: number, example: 500, required: false, default server: 500>
    e. gender = value <format type: string, example: "female", required: false>
    f. religion = value <format type: string, example: "islam", required: false>

**Like People**

    GET -> /api/v1/findmatch/like -> Parameter ->
    a. fbid = value <type: string, required: true>
    b. partnerId = value <type:string, required: true>

**Reject People**

    GET -> api/v1/findmatch/reject -> Parameter ->
    a. fbid = value <type: string, required: true>
    b. partnerId = value <type:string, required: true>

**List Match**

    GET -> /api/v1/findmatch/match -> Parameter ->
    a. fbid = value <type: string, required: true>

**Unmatch People**

    GET -> /api/v1/findmatch/unmatch -> Parameter ->
    a. fbid = value <type: string, required: true>
    b. partnerId = value <type:string, required: true

**Chat Matched People**

    POST -> /api/v1/chat/send -> JSON Format ->
    {
    "roomid" : "xxx",
    "fbid":"xxx",
    "partnerid":"xxx",
    "message":"xxx"
    }

**Retrieve Message**

    GET -> /api/v1/chat/retrieve -> Parameter ->
    a. roomid = xxx
    

**List HTTP Return**

    a. 200 -> Status success
    b. 204 -> Status but no content (Example wrong FBID or other)
    c. 400 -> Bad request
    d. 500 -> Internal server error

#License

This project is licensed under the MIT License
