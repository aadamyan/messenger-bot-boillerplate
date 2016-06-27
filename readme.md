## Boilerplate project for developing Facebook Messenger Bot powered by Wit.ai

### Setup

`npm install`


Set environment variables or write values directly in the code

`FB_PAGE_TOKEN` - Access token generated for the Facebook application to allow making Graph API requests to the page

`WIT_TOKEN` - WIT server side token

`FB_VERIFY_TOKEN` - a verify token that should be used for Webhooks setup

`FB_PAGE_ID` - Facebook Page ID 


### How to test

install ngrok and run
`./ngrok http 3000`

run the server
`node app`

update Facebook application webhook 

`https://SOMEURL/bot`

enter the `FB_VERIFY_TOKEN` value and submit




