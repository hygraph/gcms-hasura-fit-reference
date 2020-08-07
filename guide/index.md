# Hasura Fit: Complete Guide / Start Here

This is a multi-part tutorial on creating a fitness app with modern web-technologies. It utilises user accounts (Auth0), User data (Hasura), Editorial content (GraphCMS), server less functions (Vercel) and the popular React framework NextJs (also hosted on Vercel).

In order, the the tutorial should be created:

1. [Set up GraphCMS](hasura-fit-setting-up-graphcms.md)
2. [Set up Auth0](hasura-fit-setting-up-auth0.md)
3. [Set up NextJs](hasura-fit-setting-up-nextjs.md)
4. [Set up the Serverless Functions](hasura-fit-setting-up-serverless-functions.md)
5. [Set up Vercel](hasura-fit-setting-up-vercel.md)
6. [Set up Hasura](hasura-fit-setting-up-hasura.md)

The rough flow of our application is as follows.

A user comes to our application which shows content required no authentication. They decide to join the program and signup.

When signing up, they are redirected to Auth0 where a new user account is created, which in turn creates a new user account in Hasura for later reference, and then sends an authentication token back to our user in the web app with special permissions to be re-used with our Hasura API and a few modified parameters to help us confirm who our user is there.

The web application updates with this new information and then shows authenticated content, such as our workout programs, which comes from Hasura at the query level, but is resolved from GraphCMS through a federated API mesh which we configured in Hasura.

Once our user performs one of the workouts, this action will save a new session in our Hasura database and at the same time, trigger a web hook which increments the popularity of that workout in our GraphCMS content API.

Here’s a rough flow chart for the following steps.

![](images/hasura-fit-master-diagram.png?raw=true)

If you find errors, typos or updates to the functionality, pull requests are always welcome!

Next: [Set up GraphCMS](hasura-fit-setting-up-graphcms.md)
