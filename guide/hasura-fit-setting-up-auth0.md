# Hasura Fit: Setting up the Auth Flow

Special thanks to [Sam Bellen](https://twitter.com/sambego?lang=en) for helping me troubleshoot some tricky parts of the Auth0 ecosystem.

In this part of our tutorial we’ll be adding the authentication layer to our web app which let’s us leverage the power of Auth0 and their social sign-on ecosystem of tooling to let us onboard users quickly and easily.

A core tenant of modern web application architecture is “do not write your own authentication” - basically, it’s a problem that’s easy enough to get wrong and also easy enough to make you think you got it right. Find either an open-source platform where hundreds of developers contribute to the robustness of the code-base or a SaaS company for essentially the same reasons but when you need an SLA or a few convenience features behind it.

Prior Art:  
[https://hasura.io/docs/1.0/graphql/manual/guides/integrations/auth0-jwt.html](https://hasura.io/docs/1.0/graphql/manual/guides/integrations/auth0-jwt.html)
[https://github.com/auth0/nextjs-auth0](https://github.com/auth0/nextjs-auth0)

## Why Auth0?

Auth0 has been one of the mainstay players in the authentication space for a while, they support nearly every type of “single sign on” - which just means re-using an account from something like your workplace or Facebook - and they have excellent developer tooling to help us integrate with our stack. They handle password resets/forgets, generating custom scope in our Auth tokens (we’ll cover this in a few moments) and more.

If you need an enterprise grade Auth library (or a generous free tier with reasonable pricing for your side projects) - Auth0 is a great solution.

## Creating an Account

The first thing you need to do is create an account with Auth0, after that, you need to create an Application. From the applications tab of your project, you can click on “Create Application”.

Note: **It’s critical you choose “Regular Web Application”** as we’ll be working with server side authorisation and the library we are using expects “Authorization Code

### Understanding the different types of authentication flows

Choosing SPA would result in a PKCE flow, which returns a shape of data our library isn’t expecting and is also not needed since we are auhtorizing server side. PKCE simply adds an additional layer of indirection before the exchange of tokens occurs.

## Account Settings

The “variables” will differ for production context, but all things held constant, your localhost will stay the same.

We only need to handle the settings for Allowed Callback URLs (where we return to after authentication) and the allowed Logout URLs (where we return to after logging out.)

Web origins is only for contexts where the Sign-On form is EMBEDDED in the application and by default, all our allowed URLs are included in CORS.

**Allowed CallbackURL**
Localhost: http://localhost:3000/api/callback
Vercel: https://gcms-hasura-fit-\*.vercel.app/api/callback

Using an asterisk (\*) in the URL is known as a wildcard and this allows you to match all urls that match the first-half before the asterisk and the last half after the asterisk and anything in the middle. This is done so that if you want to use continuous deployment (where you get a deploy every time you push code to a code repository like Github) you’ll get previews in both your master branch and any other branches where you might test out new features.

** Allowed Logout URLs**
Localhost: http://localhost:3000
Vercel: https://gcms-hasura-fit-\*.vercel.app

## Understanding our Auth Config

In our NextJS project we have abstracted the authentication service as a library under our `/lib` directory where we can call our auth service from multiple places in our application. To communicate with Auth0 - we will use their SDK (software development kit) to send requests to Auth0 in the correct shape.

The init method looks like this:

```js
const auth0Instance = initAuth0({
  clientId: config.AUTH0_CLIENT_ID,
  clientSecret: config.AUTH0_CLIENT_SECRET,
  scope: config.AUTH0_SCOPE,
  domain: config.AUTH0_DOMAIN,
  redirectUri: config.REDIRECT_URI,
  audience: "https://hasura-fit.herokuapp.com",
  postLogoutRedirectUri: config.POST_LOGOUT_REDIRECT_URI,
  session: {
    cookieSecret: config.SESSION_COOKIE_SECRET,
    cookieLifetime: config.SESSION_COOKIE_LIFETIME,
    storeIdToken: true,
    storeRefreshToken: true,
    storeAccessToken: true,
  },
});
```

### Client Secrets and IDs

Auth0 is a hosted application (SaaS) which has many different projects in their database. To tell Auth0 which one is yours, you need to use the ID and the Secret they gave you in your signup process to properly identify which project in their servers is yours.

### Scopes

In our application, when we call our login service, we need to tell our Authorization service (Auth0) what kind of permissions the holder of the returned token should have. In our case - we are asking for the `profile` and `opened` information about the user. Different services around the web might have other scopes such as “reading e-mails” or “updating calendar” - it’s common for services to restrict the permissions available to the token key they give you based on these scopes you are asking for.

### Audience

Because we will be using the access token provided to access a DIFFERENT service (our hosted Heroku app) we need to tell Auth0 that the token we are asking for will be used at a different site.
![](images/hasura-fit-token-req.png?raw=true)

### Redirects

See the information above about the redirect URLs.

### Session

The session configuration allows us to define which tokens should be saved in the browser, if at all, when it should expire and a secret key to encrypt the data.

## Custom Rules

Auth0 allows specific rules (or functions) to be executed when certain things happen in Auth0. We need to create a special function for when we send a token to our web app and we need to create a special rule for creating a copy of our Auth0 user in our Hasura database.

![](images/auth0-rules.png?raw=true)

### Modify Token: hasura-jwt-claim

To modify the token we send to our client which will in turn be used to access Hasura, we’ll use the following rule

```js
    function (user, context, callback) {
      const namespace = "https://hasura.io/jwt/claims";
      context.idToken[namespace] =
        {
          'x-hasura-default-role': 'user',
          // do some custom logic to decide allowed roles
          'x-hasura-allowed-roles': ['user'],
          'x-hasura-user-id': user.user_id
        };
      callback(null, user, context);
    }
```

### Synchronize Users: insert-user

To synchronise our users, we’ll need an additional rule which creates a mutation in Hasura every time a new user signs up.

```js
    function (user, context, callback) {
      const userId = user.user_id;
      const hasuraAdminSecret = "xxxx";
      const url = "YOUR_HASURA_ENDPOINT";
      const upsertUserQuery = `
        mutation($userId: String!){
          insert_users(objects: [{ id: $userId }], on_conflict: { constraint: users_pkey, update_columns: [] }) {
            affected_rows
          }
        }`
      const graphqlReq = { "query": upsertUserQuery, "variables": { "userId": userId } }

      request.post({
          headers: {'content-type' : 'application/json', 'x-hasura-admin-secret': hasuraAdminSecret},
          url:   url,
          body:  JSON.stringify(graphqlReq)
      }, function(error, response, body){
           console.log(body);
           callback(null, user, context);
      });
    }
```

![](images/hasura-fit-copy-user.png?raw=true)

## Next Steps

To continue this tutorial, our next step will be to configure NextJs to be up and running which will be needed to configure Auth0 to work with Hasura.

Next: [Set up NextJs](hasura-fit-setting-up-nextjs.md)
