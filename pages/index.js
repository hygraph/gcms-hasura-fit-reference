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
        <article className="h-64 shadow-lg p-4 flex flex-wrap items-end mb-4 rounded-lg hover:box overflow-hidden brand-gradient">
          <h1 className="uppercase font-bold text-6xl text-gray-200 w-full leading-tight">
            Sign Up Today!
          </h1>
          <div className="flex justify-end w-full">
            <a
              href="/api/login"
              className="rounded-full shadow-xl bg-woodsmoke-800 py-2 px-4 font-bold mr-2 text-gray-200"
            >
              Let's Go!
            </a>
            <a
              className="rounded-full shadow-xl border border-woodsmoke-800 py-2 px-4 font-bold "
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
            className="h-64 shadow-lg p-4 flex flex-wrap items-end mb-4 rounded-lg overflow-hidden"
            style={{
              backgroundImage: `linear-gradient(rgba(0,0,0,0.25) 0%, rgba(0,0,0,0.65) 50%, rgba(0,0,0,1) 100%), url(${workout.image.url})`,
              backgroundSize: "cover",
              backgroundPosition: "center bottom",
            }}
            key={i}
          >
            <h1 className="uppercase font-bold text-4xl text-gray-200 w-full leading-tight">
              {workout.title}
            </h1>
            {user && (
              <Link href="/workout/[slug]" as={`/workout/${workout.slug}`}>
                <a className="rounded-full shadow-xl brand-gradient py-2 px-4 font-bold ml-auto text-gray-200">
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
