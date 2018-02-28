# node-timesheet
Node Script Timesheet filler

This is a simple example of how to automate boring tasks such as filling timesheet at work.

You need a credentials file : credentials.json with the below format

{ 
"username" : <username to login> , 
"password" : <password to login>
  }
  
You also need a Enterprise Information : enterpriseinfo.json with the below format

{
    "project" : <Project Code> ,
    "hours" : <Hourse spent in a day> ,
    "urlBase" : <Base URL for Organzation>"

}


<h3>Note:</h3>
This is a Proof Of Concept. This can be an inspiration. Do not aim to use this for actual organizational work.