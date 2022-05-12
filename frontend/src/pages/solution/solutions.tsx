import { ApolloClient, gql, InMemoryCache } from "@apollo/client";
import {
  AddIcon,
  CheckIcon,
  CloseIcon,
  DeleteIcon,
  EditIcon,
  SettingsIcon,
  ViewIcon,
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
import { SolutionComments } from "../comment/solution_comments";

export const Solutions: FC = () => {
  let client: ApolloClient<any>;
  let challengeClient: ApolloClient<any>;
  let navigate = useNavigate();
  let params = useParams();

  if (!process.env.NODE_ENV || process.env.NODE_ENV === "development") {
    client = new ApolloClient({
      uri: "http://localhost:8080/graphql",
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
    challengeClient = new ApolloClient({
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
      uri: "/solution/graphql",
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
    challengeClient = new ApolloClient({
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

  const challengeQueryResult = useQuery("getChallengeCreators", async () => {
    if (jwtService.getToken() === null) {
      return;
    }
    loadingService.loading = true;

    let result = await challengeClient.query({
      query: gql`
        query GetChallengeCreators {
          challenge {
            all {
              id
              createdBy
            }
          }
        }
      `,
    });
    loadingService.loading = false;

    if (result.error || result.errors) {
      return result;
    } else {
      return result.data.challenge.all;
    }
  });

  const { data, isError, isLoading, refetch } = useQuery(
    "getSolutions",
    async () => {
      if (jwtService.getToken() === null) {
        return;
      }
      loadingService.loading = true;

      let result;

      if (params.email) {
        result = await client.query({
          query: gql`
            query GetChallengesByEmail($email: String!) {
              solution {
                byEmail(email: $email) {
                  id
                  language
                  createdBy
                  points
                  result
                  challengeId
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
            query GetSolutions($id: ID!) {
              solution {
                byChallenge(id: $id) {
                  id
                  language
                  createdBy
                  points
                  challengeId
                }
              }
            }
          `,
          variables: {
            id: params.id,
          },
        });
      }

      loadingService.loading = false;

      if (result.error || result.errors) {
        return result;
      } else {
        if (result.data.solution.byEmail) {
          return result.data.solution.byEmail;
        } else {
          return result.data.solution.byChallenge;
        }
      }
    }
  );

  if (isLoading || challengeQueryResult.isLoading) {
    return (
      <Layout>
        <Flex justifyContent={"center"}>
          <h2>Loading...</h2>
        </Flex>
      </Layout>
    );
  }

  if (isError || challengeQueryResult.isError) {
    return (
      <Layout>
        <Flex justifyContent={"center"}>
          <h2>Error fetching data. Please reload the page.</h2>
        </Flex>
      </Layout>
    );
  }

  function isOwner(solution: { challengeId: Number }): boolean {
    let challenges = challengeQueryResult.data as Array<{
      id: Number;
      createdBy: String;
    }>;
    console.log("challenges:", challenges);

    return challenges.some(
      (challenge) =>
        challenge.createdBy === jwtService.parseJwt()?.emailAddress &&
        solution.challengeId === challenge.id
    );
  }

  async function deleteSolution(id: String | Number) {
    if (jwtService.getToken() === null) {
      return;
    }

    loadingService.loading = true;

    await client.mutate({
      mutation: gql`
        mutation DeleteSolution($id: ID!) {
          solution {
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
          <h2>Log in to view solutions!</h2>
        </Flex>
      </Layout>
    );
  } else {
    if (data.errors || data.error) {
      return (
        <Layout>
          <Flex justifyContent={"center"}>
            <h2>You do not have rights to view solutions!</h2>
          </Flex>
        </Layout>
      );
    }

    return (
      <Layout>
        {params.id && (
          <Flex p={"5"} justifyContent="end">
            <Button variant={"ghost"} colorScheme={"yellow"}>
              <Link to={`/frontend/challenge/solve/${params.id}`}>Solve</Link>
            </Button>
          </Flex>
        )}
        <Flex justifyContent={"center"} flexWrap={"wrap"}>
          <Accordion allowMultiple width={"100%"}>
            {data.map &&
              data.map(
                (solution: {
                  id: Number;
                  language: String;
                  createdBy: String;
                  points: Number | undefined | null;
                  challengeId: Number;
                  result: Boolean;
                }) => {
                  return (
                    <AccordionItem>
                      <AccordionButton>
                        <Box width={"100%"} p={4}>
                          <HStack justifyContent={"space-between"}>
                            <Box fontSize={"1.5rem"} fontWeight="bold">
                              {solution.createdBy}{" "}
                              {solution.createdBy ===
                                jwtService.parseJwt()?.emailAddress &&
                                (solution.result ? (
                                  <CheckIcon color={"green"}></CheckIcon>
                                ) : (
                                  <CloseIcon color={"red"}></CloseIcon>
                                ))}
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
                                  {solution.createdBy ===
                                    jwtService.parseJwt()?.emailAddress && (
                                    <>
                                      <MenuItem
                                        icon={<DeleteIcon />}
                                        onClick={(e) => {
                                          deleteSolution(solution.id);
                                          e.stopPropagation();
                                        }}
                                      >
                                        Delete
                                      </MenuItem>
                                      <MenuItem
                                        icon={<EditIcon />}
                                        onClick={(e) => {
                                          navigate(
                                            `/frontend/solution/update/${solution.id}`
                                          );
                                          e.stopPropagation();
                                        }}
                                      >
                                        Update
                                      </MenuItem>
                                    </>
                                  )}
                                  {isOwner(solution) && (
                                    <MenuItem
                                      icon={<ViewIcon />}
                                      onClick={(e) => {
                                        navigate(
                                          `/frontend/solution/review/${solution.id}`
                                        );
                                        e.stopPropagation();
                                      }}
                                    >
                                      Review
                                    </MenuItem>
                                  )}
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
                                        `/frontend/comment/new/solution/${solution.id}`
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
                              {typeof solution.points === "number"
                                ? solution.points
                                : "No results yet"}
                            </Box>
                          </HStack>
                          <HStack justifyContent={"end"}>
                            <Box>{solution.createdBy}</Box>
                          </HStack>
                        </Box>
                      </AccordionButton>
                      <AccordionPanel>
                        <SolutionComments
                          solutionId={solution.id}
                        ></SolutionComments>
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
