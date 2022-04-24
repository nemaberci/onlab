import {FC} from "react";
import {Layout} from "../../component/layout/layout";
import {Button, Flex, FormControl, FormErrorMessage, FormLabel, Input, Textarea, Box} from "@chakra-ui/react";
import {Form, Formik, Field} from "formik";
import {ApolloClient, gql, InMemoryCache} from "@apollo/client";
import {jwtService} from "../../service/login";
import {useQuery} from "react-query"
import { useNavigate, useParams } from 'react-router-dom'



export const Challenge: FC = () => {

    let navigate = useNavigate()
    let params = useParams()

    let client: ApolloClient<any>;

    if (!process.env.NODE_ENV || process.env.NODE_ENV === 'development') {

        client = new ApolloClient({
            uri: 'http://localhost:8081/graphql',
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

    const {data, isError, isLoading, isSuccess} = useQuery("getChallenge", async () => {

        if (jwtService.getToken() === null || !params || !params.id) { return; }

        let result = await client.query({
            query: gql`
                query GetChallenge ($id: ID!) {
                    challenge {
                        byId(id: $id) {
                            description
                            name
                        }
                    }
                }
            `,
            variables: {
                id: params.id
            }
        });

        if (result.error || result.errors) {
            console.log("Error: ", result.error, result.errors)
        } else {
            console.log("Returning: ", result.data.challenge.byId)
            return result.data.challenge.byId;
        }

    })

    async function onCreate(formData: any) {

        let client: ApolloClient<any>;

        if (!process.env.NODE_ENV || process.env.NODE_ENV === 'development') {

            client = new ApolloClient({
                uri: 'http://localhost:8081/graphql',
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
                mutation CreateChallenge($name: String!, $description: String!) {
                    challenge {
                        create(challenge: {name: $name, description: $description}) {
                            id
                        }
                    }
                }
            `,
            variables: {
                name: formData.name,
                description: formData.description
            }
        });

        if (result.errors) {
            console.log("Error: ", result.errors)
        } else {
            navigate('../challenges')
        }

    }

    async function onSave(formData: any) {

        let client: ApolloClient<any>;

        if (!process.env.NODE_ENV || process.env.NODE_ENV === 'development') {

            client = new ApolloClient({
                uri: 'http://localhost:8081/graphql',
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
                mutation UpdateChallenge($id: ID!, $name: String!, $description: String!) {
                    challenge {
                        update(id: $id, challenge: {name: $name, description: $description}) {
                            id
                        }
                    }
                }
            `,
            variables: {
                id: params.id,
                name: formData.name,
                description: formData.description
            }
        });

        if (result.errors) {
            console.log("Error: ", result.errors)
        } else {
            navigate('../challenges')
        }

    }

    if (isLoading) {
        return (
            <Layout>
                <Flex
                    justifyContent={"center"}
                >

                    <h2>Loading...</h2>

                </Flex>
            </Layout>
        )
    }

    if (isError) {
        return (
            <Layout>
                <Flex
                    justifyContent={"center"}
                >

                    <h2>Error fetching data. Please reload the page.</h2>

                </Flex>
            </Layout>
        )
    }

    return (
        <Layout>
            <Box p={8}>
                <Formik onSubmit={data ? onSave : onCreate} initialValues={{name: data ? data.name : "", description: data ? data.description : ""}} enableReinitialize>
                    <Form>
                        <Field name={"name"}>
                            {({ field, form }: any) => (
                                <FormControl isInvalid={form.errors.name && form.touched.name}>
                                    <FormLabel htmlFor='name'>Name</FormLabel>
                                    <Input {...field} id='name' placeholder='Name' />
                                    <FormErrorMessage>{form.errors.name}</FormErrorMessage>
                                </FormControl>
                            )}
                        </Field>
                        <Field name={"description"}>
                            {({ field, form }: any) => (
                                <FormControl isInvalid={form.errors.description && form.touched.description}>
                                    <FormLabel htmlFor='description'>Description</FormLabel>
                                    <Textarea {...field} id='description' placeholder='Description' />
                                    <FormErrorMessage>{form.errors.description}</FormErrorMessage>
                                </FormControl>
                            )}
                        </Field>
                        {
                            data ? 
                            <Button type={"submit"} mt={"4"}>Save!</Button> :
                            <Button type={"submit"} mt={"4"}>Create!</Button>
                        }
                    </Form>
                </Formik>
            </Box>
        </Layout>
    )
}