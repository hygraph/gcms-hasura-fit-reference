// This import is only included in the server build, because it's only used by getServerSideProps
import auth0 from "../lib/auth0";
import Layout from "../components/layout";

const months = [
  "Jan",
  "Feb",
  "Mar",
  "Apr",
  "May",
  "Jun",
  "July",
  "Aug",
  "Sept",
  "Oct",
  "Nov",
  "Dec",
];

function formatDate(date) {
  var d = new Date(date),
    month = "" + months[d.getMonth()],
    day = "" + d.getDate(),
    year = d.getFullYear();

  return `${day} ${month}, ${year}`;
}

function Profile({ sessions, user }) {
  return (
    <Layout user={user}>
      <h1>Profile</h1>

      <div>
        {sessions.map((session, i) => {
          return (
            <div className="w-full flex border-b last-child:border-none border-woodsmoke-400">
              <div className="w-8/12 text-gray-200 py-2 px-4 flex-grow-0 items-center">
                <p>{session.workout.title}</p>
              </div>
              <div className="w-4/12 text-gray-200 py-2 px-4 flex-grow-0 items-center flex">
                <p>{formatDate(session.created_at)}</p>
              </div>
            </div>
          );
        })}
      </div>
    </Layout>
  );
}

export async function getServerSideProps({ req, res }) {
  // Here you can check authentication status directly before rendering the page,
  // however the page would be a serverless function, which is more expensive and
  // slower than a static page with client side authentication
  const session = await auth0.getSession(req);

  if (!session || !session.user) {
    res.writeHead(302, {
      Location: "/api/login",
    });
    res.end();
    return;
  }

  const resp = await fetch("https://hasura-fit.herokuapp.com/v1/graphql", {
    method: "POST",
    headers: {
      Authorization: `Bearer ${session.accessToken}`,
    },
    body: JSON.stringify({
      query: `{
        sessions {
          created_at
          workout(stage: PUBLISHED, where: {}) {
            title
          }
        }
      }
      `,
    }),
  });

  const { data } = await resp.json();
  return { props: { sessions: data.sessions, user: session.user } };
}

export default Profile;
