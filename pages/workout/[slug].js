import Layout from "../../components/layout";
import { useFetchUser } from "../../lib/user";
import auth0 from "../../lib/auth0";
import Movement from "../../components/Movement";

const Slug = ({ workout }) => {
  const { user, loading } = useFetchUser();

  const { warmup, program, coolDown } = workout;

  return (
    <Layout user={user} loading={loading}>
      <div className="flex flex-wrap justify-center">
        <section className="flex flex-wrap w-full">
          <header className="warmup w-full text-gray-200 px-4 py-2">
            <h1>Warmup</h1>
          </header>
          <Movement movement={warmup} />
        </section>
        <section className="flex flex-wrap">
          <header className="brand-gradient w-full text-gray-200 px-4 py-2 flex justify-between">
            <h1>Workout</h1>
            <p>{program[0].repetitions} Rounds</p>
          </header>

          {program[0].movements.map((movement, index) => {
            return <Movement movement={movement} />;
          })}
        </section>
        <section className="flex flex-wrap w-full">
          <header className="cooldown w-full text-gray-200 px-4 py-2">
            <h1>Cool Down</h1>
          </header>
          <Movement movement={coolDown} />
        </section>
        <button
          className="bg-woodsmoke-700 rounded-full text-4xl px-6 py-2 font-bold text-gray-200 my-4 shadow-xl w-3/4"
          onClick={async () => {
            const resp = await fetch(
              `http://localhost:3000/api/log/${workout.slug}`
            );
          }}
        >
          Done
        </button>
      </div>
    </Layout>
  );
};

export async function getServerSideProps({ req, res, params }) {
  const session = await auth0.getSession(req);
  const { slug } = params;

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
        
        query Premium ($slug: String!, $authed: Boolean!) {
            workout(where: { slug: $slug}) {
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
      variables: { authed: !!session, slug },
    }),
  });
  const { data } = await resp.json();
  const { workout } = data;
  return { props: { workout } };
}

export default Slug;
