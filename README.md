# GraphCMS, Next.js, Hasura and Auth0 Workout Tracker

In this project we'll be using a number of tools, services and technologies. To handle our interface and connecting the services together, we'll be using [NextJs](https://nextjs.com) and deploy to [Vercel](https://vercel.com). We'll additionally use Vercel to host a serverless function for a webhook we'll need later.

Our project requires authentication, and so we'll use Auth0 to handle that for us. Auth0 has a well written starter for NextJs which we'll use as our starting point.

For more more information about how all the auth pieces connect, you can find that [in this guide](https://github.com/vercel/next.js/tree/canary/examples/auth0) to configure the required environment variables for Auth0. In our project, you'll add those variables to env.local instead.

The content is split between two domains of responsibility, the editorial influenced content (the workout programming, images, descriptions, etc) is maintained in [GraphCMS](https://graphcms.com) - a 100% GraphQL headless CMS. This allows us our content teams to iterate on our content in an elegant way.

The second domain is our user data and permision logic. That we will host in [Hasura](https://hasrua.io). The magic occurs when we add our GraphCMS API into Hasura's Remote Schema setting and use remote joins to connect the two together. This gives us a unified graph of our content and user data with authenticated controls in place!

## Running this Project Locally
Because of the various moving parts, you won't be able to run this demo locally as it requires a number of services to be connected. We'll be posting a full tutorial series on recreating this project which we'll announce on Twitter (@GraphCMS) and update here when it ships.

## The Demo
Enjoy the Demo here: https://gcms-hasura-fit-reference.vercel.app

