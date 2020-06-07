import auth0 from "../../lib/auth0";

export default async function login(req, res) {
  console.log(req.headers.referer);
  try {
    await auth0.handleLogin(req, res, {
      redirectTo: req.headers.referer + "api/callback",
    });
  } catch (error) {
    console.error(error);
    res.status(error.status || 500).end(error.message);
  }
}
