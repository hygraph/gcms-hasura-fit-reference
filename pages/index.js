import Link from "next/link";
import Layout from "../components/layout";
import { useFetchUser } from "../lib/user";
import auth0 from "../lib/auth0";

function Home({ workouts }) {
  const { user, loading } = useFetchUser();

  return (
    <Layout user={user} loading={loading}>
      {loading && <p>Loading login info...</p>}

      {!user && (
        <article className="flex flex-wrap items-end h-64 p-4 mb-4 overflow-hidden rounded-lg shadow-lg hover:box brand-gradient">
          <h1 className="w-full text-6xl font-bold leading-tight text-gray-200 uppercase">
            Sign Up Today!
          </h1>
          <div className="flex justify-end w-full">
            <a
              href="/api/login"
              className="px-4 py-2 mr-2 font-bold text-gray-200 rounded-full shadow-xl bg-woodsmoke-800"
            >
              Let's Go!
            </a>
            <a
              className="px-4 py-2 font-bold border rounded-full shadow-xl border-woodsmoke-800 "
              href="/api/login"
            >
              Login
            </a>
          </div>
        </article>
      )}

      {workouts.map((workout, i) => {
        return (
          <article
            className="flex flex-wrap items-end h-64 p-4 mb-4 overflow-hidden rounded-lg shadow-lg"
            style={{
              backgroundImage: `linear-gradient(rgba(0,0,0,0.25) 0%, rgba(0,0,0,0.65) 50%, rgba(0,0,0,1) 100%), url(${workout.image.url})`,
              backgroundSize: "cover",
              backgroundPosition: "center bottom",
            }}
            key={i}
          >
            <h1 className="w-full text-4xl font-bold leading-tight text-gray-200 uppercase">
              {workout.title}
            </h1>
            {user && (
              <Link href="/workout/[slug]" as={`/workout/${workout.slug}`}>
                <a className="px-4 py-2 ml-auto font-bold text-gray-200 rounded-full shadow-xl brand-gradient">
                  Let's Go!
                </a>
              </Link>
            )}
          </article>
        );
      })}
    </Layout>
  );
}

export async function getServerSideProps({ req, res }) {
  const session = await auth0.getSession(req);
  const resp = await fetch("https://hasura-fit.herokuapp.com/v1/graphql", {
    method: "POST",
    headers: {
      "x-hasura-role": "public",
    },
    body: JSON.stringify({
      query: `fragment Rep on RepMovement {
        title
        repetition
      }
      
      fragment Amrap on AmrapMovement {
        title
      }
      
      fragment Duration on DurationMovement {
        title
        duration
      }
      
      fragment Circuit on Circuit {
        repetitions
        movements {
          ...on RepMovement {...Rep}
          ...on AmrapMovement{...Amrap}
          ...on DurationMovement { ... Duration}
        }
      }
      
      query Premium ($authed: Boolean!) {
          workouts(orderBy: popularity_DESC) {
              title
              description
              popularity
              slug
              image {
                url
              }
              warmup @include(if: $authed) {
                ...on RepMovement {...Rep}
                ...on AmrapMovement{...Amrap}
                ...on DurationMovement { ... Duration}
              }
              program @include(if: $authed) {
                ...on RepMovement {...Rep}
                ...on AmrapMovement{...Amrap}
                ...on DurationMovement { ... Duration}
                ...on Circuit {...Circuit}
              }
            coolDown @include(if: $authed) {
              ...on RepMovement {...Rep}
                ...on AmrapMovement{...Amrap}
                ...on DurationMovement { ... Duration}
            }
          }
      }`,
      variables: { authed: !!session },
    }),
  });

  const { data } = await resp.json();
  const { workouts } = data;
  return { props: { workouts } };
}

export default Home;
