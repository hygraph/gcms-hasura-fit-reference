# Hasura Fit: Setting up Vercel

## Why Vercel?

Vercel is an incredibly straight-forward hosting environment for our code. It provides a number of runtimes so that the most popular code can simply be uploaded to a Vercel project and it will run. Since our project is Javascript based, it will run just fine.

We’ll be using two separate Vercel projects for our tutorial primarily for educational purposes and as a separation of concerns.

First, we’ll be deploying our NextJs framework code to Vercel to run our primary web application.

Second, we’ll be running a very simple server function that acts as web hook for our Hasura project to update our content in GraphCMS later-on.

To begin, create an account with [Vercel](https://vercel.com/).

## Environment Variables in Vercel

Assuming you have forked and cloned both the Hasura-Fit and the Hasura-Fit-Hooks repos locally, you’ll now need to add them to your own version control account (ie. Github). If you only cloned and didn’t fork, you can [see how to change the URL here](https://docs.github.com/en/github/using-git/changing-a-remotes-url).

Once you have your code, pushed to version control, you can import those projects into Vercel from your account console.

![](images/vercel-import-project?raw=true)

![](images/vercel-choose-repo.png?raw=true)

After you have imported your project, you will have the ability to define your variables under the Settings / Environment Variables page. It’s possible your project might error on the first build since the environment variables are not yet defined. Don’t worry about that yet.

![](images/vercel-environment-variables.png?raw=true)

`VERCEL_URL` in this case is a system default variable that will be dynamically populated by the Vercel environment with a special URL that is either referring to a branch from your repo or the master branch.

The remainder of the variables can be copied from the NextJs variables, with production urls being used where needed.

Next: [Set up Hasura](hasura-fit-setting-up-hasura.md)
