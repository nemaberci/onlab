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

export const SolutionComments: FC = () => {
  let navigate = useNavigate();
  let params = useParams();

  let client: ApolloClient<any>;

  if (!process.env.NODE_ENV || process.env.NODE_ENV === "development") {
    client = new ApolloClient({
      uri: "http://localhost:8083/graphql",
      cache: new InMemoryCache(),
      headers: {
        Authorization: `Token ${jwtService.getToken()}`,
      },
    });
  } else {
    client = new ApolloClient({
      uri: "/comment/graphql",
      cache: new InMemoryCache(),
      headers: {
        Authorization: `Token ${jwtService.getToken()}`,
      },
    });
  }

  const { data, isError, isLoading, refetch } = useQuery(
    "getSolutionComments",
    async () => {
      if (jwtService.getToken() === null) {
        return;
      }

      let result = await client.query({
        query: gql`
          query GetSolutionComments($id: ID!) {
            comment {
              byOwner(owner: { type: SOLUTION, id: $id }) {
                id
                text
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
        return result.data.comment.byOwner;
      }
    }
  );

  if (isLoading) {
    return (
      <Layout>
        <Flex justifyContent={"center"}>
          <h2>Loading...</h2>
        </Flex>
      </Layout>
    );
  }

  if (isError) {
    return (
      <Layout>
        <Flex justifyContent={"center"}>
          <h2>Error fetching data. Please reload the page.</h2>
        </Flex>
      </Layout>
    );
  }

  async function deleteComment(id: String | Number) {
    if (jwtService.getToken() === null) {
      return;
    }

    await client.mutate({
      mutation: gql`
        mutation DeleteComment($id: ID!) {
          comment {
            delete(id: $id)
          }
        }
      `,
      variables: {
        id: id,
      },
    });

    await refetch();
  }

  if (jwtService.getToken() === null) {
    return (
      <Layout>
        <Flex justifyContent={"center"}>
          <h2>Log in to view comments!</h2>
        </Flex>
      </Layout>
    );
  } else {
    if (!data) {
      return (
        <Layout>
          <Flex justifyContent={"center"}>
            <h2>You do not have rights to view comments!</h2>
          </Flex>
        </Layout>
      );
    }

    return (
      <Layout>
        <Flex p={"5"}>
          <Button variant={"ghost"} colorScheme={"yellow"}>
            <Link to={`/frontend/comment/new/solution/${params.id}`}>
              New Comment
            </Link>
          </Button>
        </Flex>
        <Flex justifyContent={"center"}>
          <Table>
            <Thead>
              <Tr>
                <Th>Id</Th>
                <Th>Text</Th>
                <Th>Created by</Th>
                <Th>Actions</Th>
              </Tr>
            </Thead>
            <Tbody>
              {data.map &&
                data.map(
                  (comment: {
                    id: Number;
                    text: String;
                    createdBy: String;
                  }) => {
                    return (
                      <Tr key={comment.id as number}>
                        <Td>{comment.id}</Td>
                        <Td>{comment.text}</Td>
                        <Td>{comment.createdBy}</Td>
                        <Td>
                          {jwtService.parseJwt()?.emailAddress ===
                            comment.createdBy && (
                            <Button
                              variant={"ghost"}
                              colorScheme={"red"}
                              onClick={() => {
                                deleteComment(comment.id);
                              }}
                            >
                              Delete
                            </Button>
                          )}
                          {jwtService.parseJwt()?.emailAddress ===
                            comment.createdBy && (
                            <Button variant={"ghost"} colorScheme={"blue"}>
                              <Link
                                to={`/frontend/comment/update/${comment.id}`}
                              >
                                Update
                              </Link>
                            </Button>
                          )}
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
  }
};
