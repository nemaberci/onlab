import { ApolloClient, gql, InMemoryCache } from "@apollo/client";
import {
  Box,
  Button,
  Flex,
  FormControl,
  FormErrorMessage,
  FormLabel,
  Textarea,
} from "@chakra-ui/react";
import { Field, Form, Formik } from "formik";
import { FC } from "react";
import { useQuery } from "react-query";
import { useNavigate, useParams } from "react-router-dom";
import { Layout } from "../../component/layout/layout";
import { loadingService } from "../../service/loading";
import { jwtService } from "../../service/login";

export const EditComment: FC = () => {
  let navigate = useNavigate();
  let params = useParams();

  let commentClient: ApolloClient<any>;

  if (!process.env.NODE_ENV || process.env.NODE_ENV === "development") {
    commentClient = new ApolloClient({
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
    commentClient = new ApolloClient({
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

  const { data, isError, isLoading } = useQuery("getCommentData", async () => {
    if (jwtService.getToken() === null) {
      return;
    }

    if (params && params.commentid) {
      loadingService.loading = true;

      // update mode

      let result;
      try {
        result = await commentClient.query({
          query: gql`
            query GetCommentData($id: ID!) {
              comment {
                byId(id: $id) {
                  text
                }
              }
            }
          `,
          variables: {
            id: params.commentid,
          },
        });
      } catch (e) {
        loadingService.loading = false;
        throw e;
      }

      loadingService.loading = false;

      if (result.error || result.errors) {
        console.log("Error: ", result.error, result.errors);
      } else {
        console.log("Returning: ", result.data.comment.byId);
        return result.data.comment.byId;
      }
    }
  });

  async function onCreate(formData: any) {
    if (jwtService.getToken() === null) {
      return;
    }

    if (params.type === "solution") {
      loadingService.loading = true;

      let result = await commentClient.mutate({
        mutation: gql`
          mutation CreateSolutionComment($text: String!, $solutionId: ID!) {
            comment {
              create(
                comment: {
                  text: $text
                  owner: { type: SOLUTION, id: $solutionId }
                }
              ) {
                id
              }
            }
          }
        `,
        variables: {
          text: formData.text,
          solutionId: params.id,
        },
      });

      loadingService.loading = false;

      if (result.errors) {
        console.log("Error: ", result.errors);
      } else {
        navigate(-1);
      }
    } else {
      loadingService.loading = true;

      let result = await commentClient.mutate({
        mutation: gql`
          mutation CreateChallengeComment($text: String!, $challengeId: ID!) {
            comment {
              create(
                comment: {
                  text: $text
                  owner: { type: CHALLENGE, id: $challengeId }
                }
              ) {
                id
              }
            }
          }
        `,
        variables: {
          text: formData.text,
          challengeId: params.id,
        },
      });

      loadingService.loading = false;

      if (result.errors) {
        console.log("Error: ", result.errors);
      } else {
        navigate(-1);
      }
    }
  }

  async function onSave(formData: any) {
    if (jwtService.getToken() === null) {
      return;
    }
    loadingService.loading = true;

    let result = await commentClient.mutate({
      mutation: gql`
        mutation UpdateComment($id: ID!, $text: String!) {
          comment {
            update(id: $id, text: $text) {
              id
            }
          }
        }
      `,
      variables: {
        id: params.commentid,
        text: formData.text,
      },
    });
    loadingService.loading = false;

    if (result.errors) {
      console.log("Error: ", result.errors);
    } else {
      navigate(-1);
    }
  }

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

  return (
    <Layout>
      <Box p={8}>
        <Formik
          onSubmit={data ? onSave : onCreate}
          initialValues={{ text: data ? data.text : "" }}
          enableReinitialize
        >
          <Form>
            <Field name={"text"}>
              {({ field, form }: any) => (
                <FormControl isInvalid={form.errors.text && form.touched.text}>
                  <FormLabel htmlFor="text">Comment text</FormLabel>
                  <Textarea {...field} id="text" placeholder="Comment text" />
                  <FormErrorMessage>{form.errors.text}</FormErrorMessage>
                </FormControl>
              )}
            </Field>
            {data ? (
              <Button type={"submit"} mt={"4"}>
                Save!
              </Button>
            ) : (
              <Button type={"submit"} mt={"4"}>
                Create!
              </Button>
            )}
          </Form>
        </Formik>
      </Box>
    </Layout>
  );
};
