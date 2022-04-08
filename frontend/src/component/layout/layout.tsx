import {FC, useState} from "react";
import {Box, Button, Flex, Stack, Text} from "@chakra-ui/react";
import {MenuItem, MenuToggle, Navbar} from "./navbar";
import GoogleLogin, {GoogleLoginResponse, GoogleLoginResponseOffline} from "react-google-login";
import {ColorModeSwitcher} from "../../ColorModeSwitcher";
import {ApolloClient, gql, InMemoryCache} from "@apollo/client";
import {jwtService} from "../../service/login";
import {useNavigate} from "react-router-dom";

function onLoginFail(resp: any): void {

    console.log("Login fail: ", resp)

}

export const Layout: FC = ({children}) => {

    const [isOpen, setIsOpen] = useState(false)

    const toggle = () => setIsOpen(!isOpen)

    let navigate = useNavigate()

    function logout() {
        jwtService.setToken(undefined)
        navigate("/frontend")
    }

    async function onLoggedIn(response: GoogleLoginResponse | GoogleLoginResponseOffline) {

        let loginResponse = (response as GoogleLoginResponse)
        console.log("Login success: ", loginResponse.accessToken)

        let client: ApolloClient<any>;

        if (!process.env.NODE_ENV || process.env.NODE_ENV === 'development') {
            client = new ApolloClient({
                uri: 'http://localhost:8082/graphql',
                cache: new InMemoryCache()
            });
        } else {
            client = new ApolloClient({
                uri: 'http://challenge:8080/graphql',
                cache: new InMemoryCache()
            });
        }

        try {
            let result = await client.query({
                query: gql`
                    query GetJWTToken($token: String!) {
                        user {
                            getJwt(token: $token)
                        }
                    }
                `,
                variables: {
                    token: loginResponse.tokenId
                },
            });

            if (result.error || result.errors) {
                console.log("Error: ", result.error, result.errors)
            } else {
                jwtService.setToken(result.data.user.getJwt)
                console.log("userService token:", jwtService.getToken())
                navigate("/frontend")
            }
        } catch (e) {
            console.log(e)
        }
    }

    return (
        <Flex direction={"column"} minHeight={"100vh"}>
            <Navbar>
                <MenuToggle toggle={toggle} isOpen={isOpen}>

                </MenuToggle>
                <Box
                    display={{base: isOpen ? "flex" : "none", md: "flex"}}
                    flexBasis={{base: "100%", md: "auto"}}
                    justifyContent={"space-between"}
                    maxWidth={"100%"}
                    width={"100%"}
                    flexDirection={{base: "column", md: "row"}}
                >
                    <Stack
                        spacing={4}
                        align="center"
                        justify={["center", "space-between", "flex-end", "flex-end"]}
                        direction={["column", "column", "row", "row"]}
                        pt={[4, 4, 0, 0]}
                    >
                        <MenuItem to="/frontend">Home</MenuItem>
                        <MenuItem to="/frontend/challenges">Challenges</MenuItem>
                    </Stack>
                    <Stack
                        spacing={4}
                        align={"center"}
                        justify={["flex-end", "flex-end", "flex-end", "flex-end"]}
                        direction={["column", "column", "row", "row"]}
                        pt={[4, 4, 0, 0]}
                    >
                        {
                            !!jwtService.getToken()
                                ?
                            <Button variant={"ghost"} onClick={logout}>
                                <Text display="block">
                                    Logout
                                </Text>
                            </Button>
                                :
                            <GoogleLogin
                                clientId={"423941664150-13lq5hfptjudvln1pmnb16hu43guu3ot.apps.googleusercontent.com"}
                                onSuccess={onLoggedIn}
                                onFailure={onLoginFail}
                                render={(renderProps) =>
                                    <Button variant={"ghost"} onClick={renderProps.onClick}
                                            disabled={renderProps.disabled}>
                                        <Text display="block">
                                            Login
                                        </Text>
                                    </Button>
                                }/>
                        }
                        <ColorModeSwitcher justifySelf="flex-end"/>
                    </Stack>
                </Box>
            </Navbar>
            {children}
        </Flex>
    )
}