import { ApolloClient, gql, InMemoryCache } from "@apollo/client";
import { CheckCircleIcon, CloseIcon } from "@chakra-ui/icons";
import {
  Button,
  Flex, Table,
  Tbody,
  Td,
  Th,
  Thead,
  Tr
} from "@chakra-ui/react";
import { FC } from "react";
import { useQuery } from "react-query";
import { Link, useParams } from "react-router-dom";
import { Layout } from "../../component/layout/layout";
import { jwtService } from "../../service/login";

export const Solve: FC = () => {
  let params = useParams();

  let client: ApolloClient<any>;
  let challengeClient: ApolloClient<any>;

  if (!process.env.NODE_ENV || process.env.NODE_ENV === "development") {
    client = new ApolloClient({
      uri: "http://localhost:8080/graphql",
      cache: new InMemoryCache(),
      headers: {
        Authorization: `Token ${jwtService.getToken()}`,
      },
    });
  } else {
    client = new ApolloClient({
      uri: "/solution/graphql",
      cache: new InMemoryCache(),
      headers: {
        Authorization: `Token ${jwtService.getToken()}`,
      },
    });
  }

  if (!process.env.NODE_ENV || process.env.NODE_ENV === "development") {
    challengeClient = new ApolloClient({
      uri: "http://localhost:8081/graphql",
      cache: new InMemoryCache(),
      headers: {
        Authorization: `Token ${jwtService.getToken()}`,
      },
    });
  } else {
    challengeClient = new ApolloClient({
      uri: "/challenge/graphql",
      cache: new InMemoryCache(),
      headers: {
        Authorization: `Token ${jwtService.getToken()}`,
      },
    });
  }

  const { data, isError, isLoading } = useQuery(
    "getSolutions",
    async () => {
      if (jwtService.getToken() === null || !params || !params.id) {
        return;
      }

      let result = await client.query({
        query: gql`
          query GetSolutions($id: ID!) {
            solution {
              byChallenge(id: $id) {
                id
                result
                language
                points
              }
            }
          }
        `,
        variables: {
          id: params.id,
        },
      });

      if (result.error || result.errors) {
        console.log("Error: ", result.error, result.errors);
      } else {
        console.log("Returning: ", result.data.solution.byChallenge);
        return result.data.solution.byChallenge;
      }
    }
  );

  const challengeQuery = useQuery("getChallenge", async () => {
    if (jwtService.getToken() === null || !params || !params.id) {
      return;
    }

    let result = await challengeClient.query({
      query: gql`
        query GetChallenge($id: ID!) {
          challenge {
            byId(id: $id) {
              createdBy
            }
          }
        }
      `,
      variables: {
        id: params.id,
      },
    });

    if (result.error || result.errors) {
      console.log("Error: ", result.error, result.errors);
    } else {
      console.log("Returning: ", result.data.challenge.byId);
      return result.data.challenge.byId;
    }
  });

  if (isLoading || challengeQuery.isLoading) {
    return (
      <Layout>
        <Flex justifyContent={"center"}>
          <h2>Loading...</h2>
        </Flex>
      </Layout>
    );
  }

  if (isError || challengeQuery.isError) {
    return (
      <Layout>
        <Flex justifyContent={"center"}>
          <h2>Error fetching data. Please reload the page.</h2>
        </Flex>
      </Layout>
    );
  }

  return (
    <Layout>
      <Flex p={"5"}>
        <Button variant={"ghost"} colorScheme={"yellow"}>
          <Link to={`/frontend/challenge/solve/${params.id}`}>Solve!</Link>
        </Button>
      </Flex>
      <Flex justifyContent={"center"}>
        <Table>
          <Thead>
            <Tr>
              <Th>Id</Th>
              <Th>Language</Th>
              <Th>Points</Th>
              <Th>Result</Th>
              <Th>Actions</Th>
            </Tr>
          </Thead>
          <Tbody>
            {data.map &&
              data.map(
                (solution: {
                  id: Number;
                  language: String;
                  points: Number | null;
                  result: Boolean | null;
                }) => {
                  return (
                    <Tr key={solution.id as number}>
                      <Td>{solution.id}</Td>
                      <Td>{solution.language}</Td>
                      <Td>{solution.points || "Under review"}</Td>
                      <Td>
                        {solution.result ? (
                          <CheckCircleIcon color={"green"}></CheckCircleIcon>
                        ) : (
                          <CloseIcon color={"red"}></CloseIcon>
                        )}
                      </Td>
                      <Td>
                        {
                          jwtService.parseJwt()?.emailAddress ===
                            challengeQuery.data.createdBy && (
                            <Button
                              variant={"ghost"}
                              colorScheme={"green"}
                            >
                              <Link
                                to={`/frontend/solution/review/${solution.id}`}
                              >
                                Review
                              </Link>
                            </Button>
                          )
                        }

                        <Button variant={"ghost"} colorScheme={"orange"}>
                          <Link
                            to={`/frontend/comment/solution/${solution.id}`}
                          >
                            Comments
                          </Link>
                        </Button>
                      </Td>
                    </Tr>
                  );
                }
              )}
          </Tbody>
        </Table>
      </Flex>
    </Layout>
  );
};
