import { ApolloClient, gql, InMemoryCache } from "@apollo/client";
import {
  Badge,
  Box,
  Button,
  Checkbox,
  Flex,
  FormControl,
  FormErrorMessage,
  FormLabel,
  Input, Textarea
} from "@chakra-ui/react";
import { Field, Form, Formik } from "formik";
import { FC } from "react";
import { useQuery } from "react-query";
import { useNavigate, useParams } from "react-router-dom";
import { Layout } from "../../component/layout/layout";
import { jwtService } from "../../service/login";

export const Review: FC = () => {
  let navigate = useNavigate();
  let params = useParams();

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

  const { data, isError, isLoading } = useQuery(
    "getSolution",
    async () => {
      if (jwtService.getToken() === null || !params || !params.id) {
        return;
      }

      let result = await client.query({
        query: gql`
          query GetSolution($id: ID!) {
            solution {
              byId(id: $id) {
                id
                content
                language
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
        console.log("Returning: ", result.data.solution.byId);
        return result.data.solution.byId;
      }
    }
  );

  async function onSend(formData: any) {
    console.log(formData);

    if (jwtService.getToken() === null) {
      return;
    }

    let result = await client.mutate({
      mutation: gql`
        mutation ReviewSolution(
          $solutionId: ID!,
          $review: ReviewInput!
        ) {
          solution {
            review(
                id: $solutionId,
                review: $review
            ) {
                id
            }
          }
        }
      `,
      variables: {
          solutionId: params.id,
          review: {
              points: formData.points,
              result: formData.accepted,
              comment: formData.comment
          }
      },
    });

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
      <Flex direction={{base: "column", sm: "row"}}>
        <Box p={8} flex="1">
            <Flex justifyContent={"center"}>
                <Badge colorScheme={"blue"} fontSize={"2xl"}>Solution</Badge>
            </Flex>
            <FormLabel htmlFor="language">Language</FormLabel>
            <Input id="language" isReadOnly value={data.language}/>
            <FormLabel htmlFor="solution" pt={2}>Solution</FormLabel>
            <Textarea
                id="solution"
                placeholder="Solution"
                height="20rem"
                isReadOnly
                value={data.content}
            />
        </Box>
        <Box p={8} flex="1">
            <Flex justifyContent={"center"}>
                <Badge colorScheme={"green"} fontSize={"2xl"}>Review</Badge>
            </Flex>
          <Formik
            onSubmit={onSend}
            initialValues={{ accepted: false, points: 0, comment: "" }}
            enableReinitialize
          >
            <Form>
              <Field name={"accepted"}>
                {({ field, form }: any) => (
                  <FormControl
                    isInvalid={form.errors.accepted && form.touched.accepted}
                  >
                    <Checkbox {...field} id="accepted" size={"lg"}>Accept</Checkbox>
                    <FormErrorMessage>{form.errors.accepted}</FormErrorMessage>
                  </FormControl>
                )}
              </Field>
              <Field name={"points"}>
                {({ field, form }: any) => (
                  <FormControl
                    isInvalid={form.errors.points && form.touched.points}
                    pt={3}
                  >
                    <FormLabel htmlFor="points">Points</FormLabel>
                    <Input {...field} type="number" id="points" min="0" />
                    <FormErrorMessage>{form.errors.points}</FormErrorMessage>
                  </FormControl>
                )}
              </Field>
              <Field name={"comment"}>
                {({ field, form }: any) => (
                  <FormControl
                    isInvalid={form.errors.comment && form.touched.comment}
                    pt={3}
                  >
                    <FormLabel htmlFor="comment">Comment</FormLabel>
                    <Textarea {...field} id="comment" />
                    <FormErrorMessage>{form.errors.comment}</FormErrorMessage>
                  </FormControl>
                )}
              </Field>
              <Button type={"submit"} mt={"4"} colorScheme={"teal"}>Save!</Button>
            </Form>
          </Formik>
        </Box>
      </Flex>
    </Layout>
  );
};
