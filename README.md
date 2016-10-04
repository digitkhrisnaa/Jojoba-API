# Jojoba-API

A RESTful API created with Node.js and Express Framework for dating application server just like Tinder. Also server can handle chat for every user that match each other using Firebase Cloud Messaging. This project uses MongoDB to store all user data and chat data.

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
**RESTful API URL**
 

    http://your-local-or-cloud-domain:[port]

if you use local system you can access url

    http://localhost:8080


**Header authorization** (Except login API and you will get token after login)

|Name|Required|Value|
|---|---|---|
|Content-Type|true|application/json|
|Authorization|true|(you will get token after login)|

**Signin User**

    POST http://your-local-or-cloud-domain:[port]/api/v1/login

|Name|Required|Value|Type|Example
|---|---|---|---|---|
|fbid|true|FB ID when login on client|String|"123123123"|
|name|true|Your name|String|"John Doe"|
|url_photo|true|url your photo|String|"url/picture/abc.jpg"|
|dob|false|1990-12-30|String|"1990-12-30"|
|gender|true|'male', 'female'|String|"male"|
|religion|false|'islam', 'christianity', 'hinduism', 'buddhism', 'other'|String|"other"|
|loc|false|[(lat),(long)]|String|"123.2,123.2"|

**Update User**

    POST http://your-local-or-cloud-domain:[port]/api/v1/update

|Name|Required|Value|Type|Example
|---|---|---|---|---|
|fbid|true|FB ID when login on client|String|"123123123"|
|url_photo|false|url your photo|String|"url/picture/abc.jpg"|
|dob|false|1990-12-30|String|"1990-12-30"|
|religion|false|'islam', 'christianity', 'hinduism', 'buddhism', 'other'|String|"other"|
|loc|false|[(lat),(long)]|String|"123.2,123.2"|

**Find Match**

    GET http://your-local-or-cloud-domain:[port]/api/v1/findmatch

|Name|Required|Value|Type|Example
|---|---|---|---|---|
|fbid|true|FB ID when login on client|String|"123123123"|
|pagination|false|Pagination return list you want|Number|20|
|nearRadius|false|Radius for find partner on meter unit|Number|500|
|gender|false|'male' or 'female'|String|"female"|
|religion|false|'islam', 'christianity', 'hinduism', 'buddhism', 'other'|String|"other"|

**Like People**

    GET http://your-local-or-cloud-domain:[port]/api/v1/findmatch/like

|Name|Required|Value|Type|Example
|---|---|---|---|---|
|fbid|true|FB ID when login on client|String|"123123123"|
|partnerId|true|Partner FBID|String|"321321"|

**Reject People**

    GET http://your-local-or-cloud-domain:[port]/api/v1/findmatch/reject

|Name|Required|Value|Type|Example
|---|---|---|---|---|
|fbid|true|FB ID when login on client|String|"123123123"|
|partnerId|true|Partner FBID|String|"321321"|

**List Match**

    GET http://your-local-or-cloud-domain:[port]/api/v1/findmatch/match

|Name|Required|Value|Type|Example
|---|---|---|---|---|
|fbid|true|FB ID when login on client|String|"123123123"|

**Unmatch People**

    GET http://your-local-or-cloud-domain:[port]/api/v1/findmatch/unmatch

|Name|Required|Value|Type|Example
|---|---|---|---|---|
|fbid|true|FB ID when login on client|String|"123123123"|
|partnerId|true|Partner FBID|String|"321321"|

**Chat Matched People**

    POST http://your-local-or-cloud-domain:[port]/api/v1/chat/send

|Name|Required|Value|Type|Example
|---|---|---|---|---|
|roomid|true|Room id you and your partner|String|"SxuUf21"|
|fbid|true|FB ID when login on client|String|"123123123"|
|partnerId|true|Partner FBID|String|"321321"|
|message|true|Your message|String|"Hello world"|

**Retrieve Message**

    POST http://your-local-or-cloud-domain:[port]/api/v1/chat/retrieve

|Name|Required|Value|Type|Example
|---|---|---|---|---|
|roomid|true|Room id you and your partner|String|"SxuUf21"|    


**List HTTP Return**

    a. 200 -> Status success
    b. 204 -> Status but no content (Example wrong FBID or other)
    c. 400 -> Bad request
    d. 500 -> Internal server error

#License

This project is licensed under the MIT License
