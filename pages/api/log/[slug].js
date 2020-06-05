import auth0 from "../../../lib/auth0";

export default async (req, res) => {
  const tokenCache = auth0.tokenCache(req, res);
  const tokenResponse = await tokenCache.getAccessToken();

  try {
    const resp = await fetch("https://hasura-fit.herokuapp.com/v1/graphql", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${tokenResponse.accessToken}`,
      },
      body: JSON.stringify({
        query: `mutation CreateSession($slug: String) {
          insert_sessions_one(object: {slug: $slug}) {
            id
            slug
            user {
              name
            }
          }
        }
        `,
        variables: {
          slug: req.query.slug,
        },
      }),
    });
  } catch (e) {
    console.log(e);
  }

  res.statusCode = 200;
  res.setHeader("Content-Type", "application/json");
  res.end(JSON.stringify({ name: "John Doe" }));
};
