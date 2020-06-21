if (typeof window === "undefined") {
  /**
   * Settings exposed to the server.
   */

  const url = (production, branch, local) => {
    switch (process.env.NODE_ENV) {
      case "production":
        return production;
        break;
      case "preview":
        return branch;
        break;
      case "development":
        return local;
        break;
      default:
        return local;
        break;
    }
  };

  const base = url(
    "https://gcms-hasura-fit-reference.vercel.app",
    `https://${process.env.VERCEL_URL}`,
    "http://localhost:3000"
  );

  module.exports = {
    AUTH0_CLIENT_ID: process.env.AUTH0_CLIENT_ID,
    AUTH0_CLIENT_SECRET: process.env.AUTH0_CLIENT_SECRET,
    AUTH0_SCOPE: "openid profile",
    AUTH0_DOMAIN: process.env.AUTH0_DOMAIN,
    REDIRECT_URI: base + "/api/callback",
    POST_LOGOUT_REDIRECT_URI: base,
    SESSION_COOKIE_SECRET: process.env.SESSION_COOKIE_SECRET,
    SESSION_COOKIE_LIFETIME: process.env.SESSION_COOKIE_LIFETIME,
  };
} else {
  /**
   * Settings exposed to the client.
   */
  module.exports = {
    AUTH0_CLIENT_ID: process.env.AUTH0_CLIENT_ID,
    AUTH0_SCOPE: "openid profile",
    AUTH0_DOMAIN: process.env.AUTH0_DOMAIN,
    REDIRECT_URI: `${window.location.origin}/api/callback`,
    POST_LOGOUT_REDIRECT_URI: window.location.origin,
  };
}
