// TODO: Once your application is deployed, copy an API id here so that the frontend could interact with it
const apiId = 'raz97h3zvh'
export const apiEndpoint = `https://${apiId}.execute-api.us-east-1.amazonaws.com/dev`

export const authConfig = {
  // TODO: Create an Auth0 application and copy values from it into this map. For example:
  // domain: 'dev-nd9990-p4.us.auth0.com',
  domain: 'dev-cmom6wke3rtyk7sy.us.auth0.com',            // Auth0 domain
  clientId: 'uC0mNtmup0mG1VqhkwV8sKcEJ3vl3tL3',          // Auth0 client id
  callbackUrl: 'http://localhost:3000/callback'
}
