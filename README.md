# budget-tracker
[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)

##### Table of Contents
- [Description](#Description)
- [Background](#Background)
- [Instructions](#Instructions)
- [Future Development](#Future-Development)
- [Technologies Used](#Technologies-Used)
- [Credits](#Credits)

## Description
Often, while travelling, internet is not available but an application is still needed. This application resolves that problem by allowing the traveller to keep track of their budget while online and offline. Users can add and subtract funds with labels, and the results will be graphed over time. This is a full-stack progressive web application. The live application is hosted on Heroku.
The active application has one application. At the top of the page is a form that accepts details of the transaction. Below that, the application lists the transactions in chronological organization. The bottom of the page has a single graph displaying the total budget over time. 
The code of the application is organized in two halves: the frontend and the backend. The backend holds the server that serves the application. 

![screenshot of landing page](./public/assets/images/screenshotGraph.png)

This application is available [here](https://ancient-ravine-55722.herokuapp.com/).

## Background
The front-end of this application was mainly developed by Trilogy, allowing me to refine my skills and practice creating service workers.

## Instructions
1. Type the name of the transaction in the "Name of transaction" field. 
2. Type the transaction amount in the "Transaction amount" field. The adding and subtracting of funds will be executed later, so please ensure that the typed transaction amount is a positive number, even if it is a deduction. 
3. Click the "Add Funds" button to add the funds and click the "Subtract Funds" button to subtract the funds. 
4. The chart and total will automatically update.
5. While offline, the application will function normally. 

## Future Development
I look forward to adding the following features:
- Delete previous transactions
- Update previous transactions
- Categories for optional detailed tracking of spending
- Expand and shrink timeline range of the chart to see more or less time.

# Technologies Used
- HTML
- CSS
- JavaScript
- Compression
- Express.js server
- Lite-server
- MongoDB (local)
- Mongoose
- Web Manifest
- Service Workers
- Heroku
- MongoDB Atlas

## Credits
- Trilogy created the front-end of the application.