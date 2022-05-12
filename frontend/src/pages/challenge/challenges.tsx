import { ApolloClient, gql, InMemoryCache } from "@apollo/client";
import {
  AddIcon,
  CheckIcon,
  DeleteIcon,
  EditIcon,
  QuestionIcon,
  SettingsIcon,
} from "@chakra-ui/icons";
import {
  Accordion,
  AccordionButton,
  AccordionItem,
  AccordionPanel,
  Box,
  Button,
  Flex,
  HStack,
  IconButton,
  Menu,
  MenuButton,
  MenuGroup,
  MenuItem,
  MenuList,
} from "@chakra-ui/react";
import { FC } from "react";
import { useQuery } from "react-query";
import { Link, useNavigate, useParams } from "react-router-dom";
import { Layout } from "../../component/layout/layout";
import { loadingService } from "../../service/loading";
import { jwtService } from "../../service/login";
import { ChallengeComments } from "../comment/challenge_comments";

export const Challenges: FC = () => {
  let client: ApolloClient<any>;
  let navigate = useNavigate();
  let params = useParams();

  if (!process.env.NODE_ENV || process.env.NODE_ENV === "development") {
    client = new ApolloClient({
      uri: "http://localhost:8081/graphql",
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
      uri: "/challenge/graphql",
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
    "getChallenges",
    async () => {
      if (jwtService.getToken() === null) {
        return;
      }

      loadingService.loading = true;

      let result;

      try {
        if (params.email) {
          result = await client.query({
            query: gql`
              query GetChallengesByEmail($email: String!) {
                challenge {
                  byEmail(email: $email) {
                    description
                    id
                    name
                    createdBy
                  }
                }
              }
            `,
            variables: {
              email: params.email,
            },
          });
        } else {
          result = await client.query({
            query: gql`
              query GetChallenges {
                challenge {
                  all {
                    description
                    id
                    name
                    createdBy
                  }
                }
              }
            `,
          });
        }
      } catch (e) {
        loadingService.loading = false;
        throw e;
      }

      loadingService.loading = false;

      if (result.error || result.errors) {
        return result;
      } else {
        if (params.email) {
          return result.data.challenge.byEmail;
        } else {
          return result.data.challenge.all;
        }
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

  console.log(data);

  async function deleteChallenge(id: String | Number) {
    if (jwtService.getToken() === null) {
      return;
    }

    loadingService.loading = true;

    await client.mutate({
      mutation: gql`
        mutation DeleteChallenge($id: ID!) {
          challenge {
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
      <Layout>
        <Flex justifyContent={"center"}>
          <h2>Log in to view challenges!</h2>
        </Flex>
      </Layout>
    );
  } else {
    if (data.errors || data.error) {
      return (
        <Layout>
          <Flex justifyContent={"center"}>
            <h2>You do not have rights to view challenges!</h2>
          </Flex>
        </Layout>
      );
    }

    return (
      <Layout>
        <Flex p={"5"} justifyContent="end">
          <Button variant={"ghost"} colorScheme={"yellow"}>
            <Link to={"/frontend/challenge/new"}>New Challenge</Link>
          </Button>
        </Flex>
        <Flex justifyContent={"center"} flexWrap={"wrap"}>
          <Accordion allowMultiple width={"100%"}>
            {data.map &&
              data.map(
                (challenge: {
                  id: Number;
                  name: String;
                  description: String;
                  createdBy: String;
                }) => {
                  return (
                    <AccordionItem>
                      <AccordionButton>
                        <Box width={"100%"} p={4}>
                          <HStack justifyContent={"space-between"}>
                            <Box fontSize={"1.5rem"} fontWeight="bold">
                              {challenge.name}
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
                                <MenuGroup
                                  title="Actions"
                                  textAlign={"start"}
                                  pl={2}
                                >
                                  <MenuItem
                                    icon={<DeleteIcon />}
                                    onClick={(e) => {
                                      deleteChallenge(challenge.id);
                                      e.stopPropagation();
                                    }}
                                  >
                                    Delete
                                  </MenuItem>
                                  <MenuItem
                                    icon={<EditIcon />}
                                    onClick={(e) => {
                                      navigate(
                                        `/frontend/challenge/update/${challenge.id}`
                                      );
                                      e.stopPropagation();
                                    }}
                                  >
                                    Update
                                  </MenuItem>
                                </MenuGroup>
                                <MenuGroup
                                  title="Solutions"
                                  textAlign={"start"}
                                  pl={2}
                                >
                                  <MenuItem
                                    icon={<QuestionIcon />}
                                    onClick={(e) => {
                                      navigate(
                                        `/frontend/solutions/challenge/${challenge.id}`
                                      );
                                      e.stopPropagation();
                                    }}
                                  >
                                    See all
                                  </MenuItem>
                                  <MenuItem
                                    icon={<CheckIcon />}
                                    onClick={(e) => {
                                      navigate(
                                        `/frontend/challenge/solve/${challenge.id}`
                                      );
                                      e.stopPropagation();
                                    }}
                                  >
                                    Solve
                                  </MenuItem>
                                </MenuGroup>
                                <MenuGroup
                                  title="Comment"
                                  textAlign={"start"}
                                  pl={2}
                                >
                                  <MenuItem
                                    icon={<AddIcon />}
                                    onClick={(e) => {
                                      navigate(
                                        `/frontend/comment/new/challenge/${challenge.id}`
                                      );
                                      e.stopPropagation();
                                    }}
                                  >
                                    New Comment
                                  </MenuItem>
                                </MenuGroup>
                              </MenuList>
                            </Menu>
                          </HStack>
                          <HStack>
                            <Box fontSize={"0.8rem"}>
                              {challenge.description}
                            </Box>
                          </HStack>
                          <HStack justifyContent={"end"}>
                            <Box>{challenge.createdBy}</Box>
                          </HStack>
                        </Box>
                      </AccordionButton>
                      <AccordionPanel>
                        <ChallengeComments
                          challengeId={challenge.id}
                        ></ChallengeComments>
                      </AccordionPanel>
                    </AccordionItem>
                  );
                }
              )}
          </Accordion>
        </Flex>
      </Layout>
    );
  }
};
