import { ApolloClient, gql, InMemoryCache } from "@apollo/client";
import { DeleteIcon, EditIcon, SettingsIcon } from "@chakra-ui/icons";
import {
  Alert,
  Box,
  Flex,
  HStack,
  IconButton,
  Menu,
  MenuButton,
  MenuItem,
  MenuList,
} from "@chakra-ui/react";
import { FC } from "react";
import { useQuery } from "react-query";
import { useNavigate } from "react-router-dom";
import { loadingService } from "../../service/loading";
import { jwtService } from "../../service/login";

export const ChallengeComments: FC<{
  challengeId: String | Number;
}> = ({ challengeId }) => {
  let client: ApolloClient<any>;
  let navigate = useNavigate();

  if (!process.env.NODE_ENV || process.env.NODE_ENV === "development") {
    client = new ApolloClient({
      uri: "http://localhost:8083/graphql",
      cache: new InMemoryCache(),
      headers: {
        Authorization: `Token ${jwtService.getToken()}`,
      },
      defaultOptions: {
        query: {
          errorPolicy: "all",
        },
      },
    });
  } else {
    client = new ApolloClient({
      uri: "/comment/graphql",
      cache: new InMemoryCache(),
      headers: {
        Authorization: `Token ${jwtService.getToken()}`,
      },
      defaultOptions: {
        query: {
          errorPolicy: "all",
        },
      },
    });
  }

  const { data, isError, isLoading, refetch } = useQuery(
    [`getChallengeComments`, challengeId],
    async () => {
      if (jwtService.getToken() === null) {
        return;
      }

      let result = await client.query({
        query: gql`
          query GetChallengeComments($id: ID!) {
            comment {
              byOwner(owner: { type: CHALLENGE, id: $id }) {
                id
                text
                createdBy
              }
            }
          }
        `,
        variables: {
          id: challengeId,
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

  function deleteComment(id: String | Number) {
    if (jwtService.getToken() === null) {
      return;
    }
    console.log("Deleting comment");
    loadingService.loading = true;

    client
      .mutate({
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
      })
      .then(() => {
        refetch().then(() => {
          console.log("Comment deleted");
          loadingService.loading = false;
        });
      });
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
        {(!data.length || (data.length && data.length < 1)) && (
          <HStack justifyContent={"center"}>
            Looks like there are no comments here yet.
          </HStack>
        )}
        {data.map &&
          data.map(
            (comment: { id: Number; text: String; createdBy: String }) => {
              return (
                <Alert
                  width={"100%"}
                  p={4}
                  variant="left-accent"
                  position={"initial"}
                  key={comment.id as number}
                >
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
