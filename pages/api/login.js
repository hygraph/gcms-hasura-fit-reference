import auth0 from "../../lib/auth0";

export default async function login(req, res) {
  try {
    await auth0.handleLogin(req, res, {
      redirectTo: process.env.VERCEL_URL
        ? `https://${req["x-forwarded-host"]}`
        : `http://localhost:3000`,
    });
  } catch (error) {
    console.error(error);
    res.status(error.status || 500).end(error.message);
  }
}
