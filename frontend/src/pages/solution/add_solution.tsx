import {FC} from "react";
import {Layout} from "../../component/layout/layout";
import {Box, Button, Flex, FormControl, FormErrorMessage, FormLabel, Input, Select, Textarea} from "@chakra-ui/react";
import {Form, Formik, Field} from "formik";
import {ApolloClient, gql, InMemoryCache} from "@apollo/client";
import {jwtService} from "../../service/login";
import {useQuery} from "react-query"
import { useNavigate, useParams } from 'react-router-dom'



export const AddSolution: FC = () => {

    let navigate = useNavigate()
    let params = useParams()

    async function onCreate(formData: any) {

        console.log(formData)

        let client: ApolloClient<any>;

        if (!process.env.NODE_ENV || process.env.NODE_ENV === 'development') {

            client = new ApolloClient({
                uri: 'http://localhost:8080/graphql',
                cache: new InMemoryCache(),
                headers: {
                    'Authorization': `Token ${jwtService.getToken()}`
                }
            });

        } else {

            client = new ApolloClient({
                uri: '/challenge/graphql',
                cache: new InMemoryCache(),
                headers: {
                    'Authorization': `Token ${jwtService.getToken()}` 
                }
            });
        }


        if (jwtService.getToken() === null) {
            return;
        }

        let result = await client.mutate({
            mutation: gql`
                mutation SubmitSolution($challengeId: ID!, $language: String!, $text: String!) {
                    solution {
                        create(solution: {
                            language: $language
                            challengeId: $challengeId
                            content: $text
                        }) {
                            id
                        }
                    }
                }
            `,
            variables: {
                text: formData.solution,
                challengeId: params.id,
                language: formData.language
            }
        });

        if (result.errors) {
            console.log("Error: ", result.errors)
        } else {
            navigate(`../challenge/solutions/${params.id}`)
        }

    }

    return (
        <Layout>
            <Box p={8}>
                <Formik onSubmit={onCreate} initialValues={{language: "java", content: null}} enableReinitialize>
                    <Form>
                        <Field name={"language"}>
                            {({ field, form }: any) => (
                                <FormControl isInvalid={form.errors.language && form.touched.language}>
                                    <FormLabel htmlFor='language'>Language</FormLabel>
                                    <Select id="language">
                                        <option value="java">Java</option>
                                        <option value="kotlin">Kotlin</option>
                                    </Select>
                                    <FormErrorMessage>{form.errors.language}</FormErrorMessage>
                                </FormControl>
                            )}
                        </Field>
                        <Field name={"solution"}>
                            {({ field, form }: any) => (
                                <FormControl isInvalid={form.errors.solution && form.touched.solution} pt={3}>
                                    <FormLabel htmlFor='solution'>Solution</FormLabel>
                                    <Textarea {...field} id='solution' placeholder='Solution' height="20rem" />
                                    <FormErrorMessage>{form.errors.solution}</FormErrorMessage>
                                </FormControl>
                            )}
                        </Field>
                        <Button type={"submit"} mt={"4"}>Create</Button>
                    </Form>
                </Formik>
            </Box>
        </Layout>
    )
}