import {FC} from "react";
import {Layout} from "../../component/layout/layout";
import {jwtService} from "../../service/login";
import {Button, Flex, Grid, Table, Tbody, Td, Th, Thead, Tr} from "@chakra-ui/react";
import {ApolloClient, gql, InMemoryCache} from "@apollo/client";
import {useQuery} from "react-query"
import {Link} from "react-router-dom";

export const Challenges: FC = () => {

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
    }

    const {data, isError, isLoading} = useQuery("getChallenges", async () => {

        if (jwtService.getToken() === null) { return; }

        let result = await client.query({
            query: gql`
                query GetChallenges {
                    challenge {
                        all {
                            description
                            id
                            name
                        }
                    }
                }
            `
        });

        if (result.error || result.errors) {
            console.log("Error: ", result.error, result.errors)
        } else {
            return result.data.challenge.all;
        }

    })

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

    if (jwtService.getToken() === null) {

        return (
            <Layout>
                <Flex
                    justifyContent={"center"}
                >

                    <h2>Log in to view challenges!</h2>

                </Flex>
            </Layout>
        )

    } else {

        return (
            <Layout>
                <Flex p={"5"}>
                    <Button variant={"ghost"} colorScheme={"yellow"}>
                        <Link to={"/frontend/challenge/new"}>
                            New Challenge
                        </Link>
                    </Button>
                </Flex>
                <Flex
                    justifyContent={"center"}
                >

                    <Table>
                        <Thead>
                            <Th>Id</Th>
                            <Th>Name</Th>
                            <Th>Description</Th>
                        </Thead>
                        <Tbody>
                            {data.map((challenge: {id: Number, name: String, description: String}) => {
                                return (
                                    <Tr>
                                        <Td>{challenge.id}</Td>
                                        <Td>{challenge.name}</Td>
                                        <Td>{challenge.description}</Td>
                                    </Tr>
                                )
                            })}
                        </Tbody>
                    </Table>

                </Flex>
            </Layout>
        )

    }
}