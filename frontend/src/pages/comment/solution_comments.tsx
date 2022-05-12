import { ApolloClient, gql, InMemoryCache } from "@apollo/client";
import { SettingsIcon, DeleteIcon, EditIcon } from "@chakra-ui/icons";
import {
  Alert,
  Box,
  Button,
  Flex,
  HStack,
  IconButton,
  Menu,
  MenuButton,
  MenuItem,
  MenuList,
  Table,
  Tbody,
  Td,
  Th,
  Thead,
  Tr,
} from "@chakra-ui/react";
import { FC } from "react";
import { useQuery } from "react-query";
import { Link, useNavigate, useParams } from "react-router-dom";
import { Layout } from "../../component/layout/layout";
import { loadingService } from "../../service/loading";
import { jwtService } from "../../service/login";

export const SolutionComments: FC<{
  solutionId: Number | String
}> = ({solutionId}) => {

  let client: ApolloClient<any>;
  let navigate = useNavigate();

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
    ["getSolutionComments", solutionId],
    async () => {
      if (jwtService.getToken() === null) {
        return;
      }
      loadingService.loading = true;

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
          id: solutionId,
        },
      });
      loadingService.loading = false;

      if (result.error || result.errors) {
        console.log("Error: ", result.error, result.errors);
      } else {
        return result.data.comment.byOwner;
      }
    }
  );

  if (isLoading) {
    return (
        <Flex justifyContent={"center"}>
          <h2>Loading...</h2>
        </Flex>
    );
  }

  if (isError) {
    return (
        <Flex justifyContent={"center"}>
          <h2>Error fetching data. Please reload the page.</h2>
        </Flex>
    );
  }

  async function deleteComment(id: String | Number) {
    if (jwtService.getToken() === null) {
      return;
    }
    loadingService.loading = true;

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
    loadingService.loading = false;
  }

  if (jwtService.getToken() === null) {
    return (
        <Flex justifyContent={"center"}>
          <h2>Log in to view comments!</h2>
        </Flex>
    );
  } else {
    if (!data) {
      return (
          <Flex justifyContent={"center"}>
            <h2>You do not have rights to view comments!</h2>
          </Flex>
      );
    }

    return (
      <>
      {
        data.length == 0 && (
          <Flex justifyContent={"center"}>
            Looks like there are no comments here yet.
          </Flex>
        )
      }
        {data.map &&
          data.map(
            (comment: { id: Number; text: String; createdBy: String }) => {
              return (
                <Alert width={"100%"} p={4} variant="left-accent" position={"initial"} key={comment.id as number}>
                  <Box fontSize={"1rem"} fontWeight="bold">
                    {comment.createdBy}
                  </Box>
                  <Box
                    fontSize={"0.8rem"}
                    px={5}
                    wordBreak="break-all"
                    flex={1}
                  >
                    {comment.text}
                  </Box>
                  <Menu>
                    <MenuButton
                      as={IconButton}
                      aria-label="Options"
                      icon={<SettingsIcon />}
                      variant="outline"
                      onClick={(e) => e.stopPropagation()}
                    />
                    <MenuList>
                      <MenuItem
                        icon={<DeleteIcon />}
                        onClick={(e) => {
                          deleteComment(comment.id);
                          e.stopPropagation();
                        }}
                      >
                        Delete
                      </MenuItem>
                      <MenuItem
                        icon={<EditIcon />}
                        onClick={(e) => {
                          navigate(`/frontend/comment/update/${comment.id}`);
                          e.stopPropagation();
                        }}
                      >
                        Update
                      </MenuItem>
                    </MenuList>
                  </Menu>
                </Alert>
              );
            }
          )}
      </>
    );
  }
};
