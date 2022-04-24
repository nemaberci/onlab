import { FC } from "react";
import { Layout } from "../../component/layout/layout";
import { jwtService } from "../../service/login";
import {
  Button,
  Flex,
  Grid,
  Icon,
  Table,
  Tbody,
  Td,
  Th,
  Thead,
  Tr,
} from "@chakra-ui/react";
import { ApolloClient, gql, InMemoryCache } from "@apollo/client";
import { useQuery } from "react-query";
import { Link } from "react-router-dom";
import {
  FormControl,
  FormErrorMessage,
  FormLabel,
  Input,
  Textarea,
} from "@chakra-ui/react";
import { Form, Formik, Field } from "formik";
import { useNavigate, useParams } from "react-router-dom";
import { CheckCircleIcon, CloseIcon } from "@chakra-ui/icons";

export const Solve: FC = () => {
  let navigate = useNavigate();
  let params = useParams();

  let client: ApolloClient<any>;
  let challengeClient: ApolloClient<any>;

  // from: https://stackoverflow.com/questions/38552003/how-to-decode-jwt-token-in-javascript-without-using-a-library
  function parseJwt(token: string | null | undefined) {
    if (typeof token !== "string") {
      return {};
    }
    var base64Url = token?.split(".")[1];
    var base64 = base64Url.replace(/-/g, "+").replace(/_/g, "/");
    var jsonPayload = decodeURIComponent(
      atob(base64)
        .split("")
        .map(function (c) {
          return "%" + ("00" + c.charCodeAt(0).toString(16)).slice(-2);
        })
        .join("")
    );

    return JSON.parse(jsonPayload);
  }

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

  const { data, isError, isLoading, isSuccess } = useQuery(
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

  async function onCreate(formData: any) {
    let client: ApolloClient<any>;

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

    if (jwtService.getToken() === null) {
      return;
    }

    // TODO
  }

  async function onSave(formData: any) {
    let client: ApolloClient<any>;

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

    // TODO
  }

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

  function review(id: Number) {}

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
            <Th>Id</Th>
            <Th>Language</Th>
            <Th>Points</Th>
            <Th>Result</Th>
            <Th>Actions</Th>
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
                    <Tr>
                      <Td>{solution.id}</Td>
                      <Td>{solution.language}</Td>
                      <Td>{solution.points || "Under review"}</Td>
                      <Td>{solution.result ? (<CheckCircleIcon color={"green"}></CheckCircleIcon>) : (<CloseIcon color={"red"}></CloseIcon>) }</Td>
                      <Td>
                        {
                          // has admin role
                          parseJwt(jwtService.getToken() as string)
                            .emailAddress === challengeQuery.data.createdBy && (
                            <Button
                              variant={"ghost"}
                              colorScheme={"green"}
                              onClick={() => {
                                review(solution.id);
                              }}
                            >
                              <Link to={`/frontend/solution/review/${solution.id}`}>
                                Review
                              </Link>
                            </Button>
                          )
                        }
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
