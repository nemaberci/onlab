import { ApolloClient, gql, InMemoryCache } from "@apollo/client";
import {
  Button,
  Flex,
  Grid,
  Table,
  Tbody,
  Td, Text, Th,
  Thead,
  Tr
} from "@chakra-ui/react";
import { FC } from "react";
import { useQuery } from "react-query";
import { Layout } from "../component/layout/layout";
import { jwtService } from "../service/login";

export const Roles: FC = () => {
  let client: ApolloClient<any>;

  if (!process.env.NODE_ENV || process.env.NODE_ENV === "development") {
    client = new ApolloClient({
      uri: "http://localhost:8082/graphql",
      cache: new InMemoryCache(),
      headers: {
        Authorization: `Token ${jwtService.getToken()}`,
      },
    });
  } else {
    client = new ApolloClient({
      uri: "/user/graphql",
      cache: new InMemoryCache(),
      headers: {
        Authorization: `Token ${jwtService.getToken()}`,
      },
    });
  }

  const { data, isError, isLoading, refetch } = useQuery(
    "getUsers",
    async () => {
      if (jwtService.getToken() === null) {
        return;
      }

      let result = await client.query({
        query: gql`
          query GetUsers {
            user {
              all {
                id
                emailAddress
                roles {
                  name
                }
              }
            }
          }
        `,
      });

      if (result.error || result.errors) {
        console.log("Error: ", result.error, result.errors);
      } else {
        return result.data.user.all;
      }
    }
  );

  const rolesQuery = useQuery(
    "getRoles",
    async () => {
      if (jwtService.getToken() === null) {
        return;
      }

      let result = await client.query({
        query: gql`
          query GetRoles {
            role {
              all {
                id
                name
              }
            }
          }
        `,
      });

      if (result.error || result.errors) {
        console.log("Error: ", result.error, result.errors);
      } else {
        return result.data.role.all;
      }
    }
  );

  const roles = rolesQuery.data

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

  if (rolesQuery.isLoading) {
    return (
      <Layout>
        <Flex justifyContent={"center"}>
          <h2>Loading...</h2>
        </Flex>
      </Layout>
    );
  }

  if (rolesQuery.isError) {
    return (
      <Layout>
        <Flex justifyContent={"center"}>
          <h2>Error fetching data. Please reload the page.</h2>
        </Flex>
      </Layout>
    );
  }

  async function add_role(id: Number, role: String) {
    if (jwtService.getToken() === null) {
      return;
    }

    let result = await client.mutate({
      mutation: gql`
        mutation AddRole($id: ID!, $role: String!) {
          user {
            addRole(emailAddress: null, id: $id, role: $role)
          }
        }
      `, variables: {
        id: id,
        role: role
      }
    });

    if (result.errors) {
      console.log("Error: ", result.errors);
      // todo: maybe error handling
    } else {
      await refetch();
      return true;
    }
  }

  async function delete_role(id: Number, role: String) {
    if (jwtService.getToken() === null) {
      return;
    }

    let result = await client.mutate({
      mutation: gql`
        mutation DeleteRole($id: ID!, $role: String!) {
          user {
            deleteRole(emailAddress: null, id: $id, role: $role)
          }
        }
      `, variables: {
        id: id,
        role: role
      }
    });

    if (result.errors) {
      console.log("Error: ", result.errors);
      // todo: maybe error handling
    } else {
      await refetch();
      return true;
    }
  }

  return (
    <Layout>
      <Grid>
        <Flex justifyContent={"center"}>
          <Table>
            <Thead>
              <Tr>
                <Th>Id</Th>
                <Th>Email</Th>
                <Th>Roles</Th>
                <Th>Actions</Th>
              </Tr>
            </Thead>
            <Tbody>
              {data.map(
                (user: {
                  id: Number;
                  emailAddress: String;
                  roles: Array<{ name: String }>;
                  admin: Boolean;
                }) => {
                  return (
                    <Tr key={user.id.toString()}>
                      <Td>{user.id}</Td>
                      <Td>{user.emailAddress}</Td>
                      <Td>
                        {user.roles.map((role) => role.name).join(" ")}{" "}
                        {user.admin && "Admin"}
                      </Td>
                      <Td>
                        {
                          roles.map(
                            (role: { id: Number, name: String }) => 
                              user.roles.find(userRole => userRole.name === role.name) ? (
                                <Button
                                  variant={"ghost"}
                                  colorScheme="red"
                                  onClick={() => delete_role(user.id, role.name)}
                                >
                                  <Text display="block">Delete {role.name} right</Text>
                                </Button>
                              ) : (
                                <Button
                                  variant={"ghost"}
                                  colorScheme="green"
                                  onClick={() => add_role(user.id, role.name)}
                                >
                                  <Text display="block">Add {role.name} right</Text>
                                </Button>
                              )
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
      </Grid>
    </Layout>
  );
};
