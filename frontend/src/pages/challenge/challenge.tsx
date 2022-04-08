import {FC} from "react";
import {Layout} from "../../component/layout/layout";
import {Button, Flex, FormControl, FormErrorMessage, FormLabel, Input} from "@chakra-ui/react";
import {Form, Formik, Field} from "formik";
import {ApolloClient, gql, InMemoryCache} from "@apollo/client";
import {jwtService} from "../../service/login";
import { useNavigate } from 'react-router-dom'



export const Challenge: FC = () => {

    let navigate = useNavigate()

    async function onFormSubmit(data: any) {

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
            // todo: production code

            client = new ApolloClient({
                uri: 'http://challenge:8080/graphql',
                cache: new InMemoryCache(),
                headers: {
                    'Authorization': `Token ${jwtService.getToken()}`
                }
            });
        }


        if (jwtService.getToken() === null) {
            return;
        }

        console.log(data)

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
                name: data.name,
                description: data.description
            }
        });

        if (result.errors) {
            console.log("Error: ", result.errors)
        } else {
            navigate('../challenges')
        }

    }

    return (
        <Layout>
            <Flex p={"8"}>
                <Formik onSubmit={onFormSubmit} initialValues={{name: '', description: ''}}>
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
                                <FormControl isInvalid={form.errors.name && form.touched.name}>
                                    <FormLabel htmlFor='description'>Description</FormLabel>
                                    <Input {...field} id='description' placeholder='Description' />
                                    <FormErrorMessage>{form.errors.name}</FormErrorMessage>
                                </FormControl>
                            )}
                        </Field>
                        <Button type={"submit"} mt={"4"}>Create!</Button>
                    </Form>
                </Formik>
            </Flex>
        </Layout>
    )
}