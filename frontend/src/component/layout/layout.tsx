import { ApolloClient, gql, InMemoryCache } from "@apollo/client";
import { Box, Button, Flex, Stack, Text } from "@chakra-ui/react";
import { FC, useState } from "react";
import GoogleLogin, {
  GoogleLoginResponse,
  GoogleLoginResponseOffline,
} from "react-google-login";
import LoadingOverlay from "react-loading-overlay";
import { useNavigate } from "react-router-dom";
import { ColorModeSwitcher } from "../../ColorModeSwitcher";
import { loadingService } from "../../service/loading";
import { jwtService } from "../../service/login";
import { MenuItem, MenuToggle, Navbar } from "./navbar";

function onLoginFail(resp: any): void {
  console.log("Login fail: ", resp);
}

export const Layout: FC = ({ children }) => {
  const [isOpen, setIsOpen] = useState(false);

  const toggle = () => setIsOpen(!isOpen);
  let navigate = useNavigate();
  let [loadingCopy, setLoadingCopy] = useState(false);

  function changeLoadingCopy(value: boolean) {
    setLoadingCopy(value);
  }

  loadingService.changedCallback = changeLoadingCopy;

  function logout() {
    jwtService.setToken(undefined);
    navigate("/frontend");
  }

  function nav_roles() {
    navigate("/frontend/roles");
  }

  async function onLoggedIn(
    response: GoogleLoginResponse | GoogleLoginResponseOffline
  ) {
    let loginResponse = response as GoogleLoginResponse;
    console.log("Login success: ", loginResponse.accessToken);

    let client: ApolloClient<any>;

    if (!process.env.NODE_ENV || process.env.NODE_ENV === "development") {
      client = new ApolloClient({
        uri: "http://localhost:8082/graphql",
        cache: new InMemoryCache(),
      });
    } else {
      client = new ApolloClient({
        uri: "/user/graphql",
        cache: new InMemoryCache(),
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
          token: loginResponse.tokenId,
        },
      });

      if (result.error || result.errors) {
        console.log("Error: ", result.error, result.errors);
      } else {
        jwtService.setToken(result.data.user.getJwt);
        if (typeof jwtService.getToken() !== "undefined") {
          let payload = jwtService.parseJwt();
          console.log(
            "userService token payload:",
            payload,
            payload?.roles as Array<string>
          );
        }
        navigate("/frontend");
      }
    } catch (e) {
      console.log(e);
    }
  }

  return (
    <Flex direction={"column"} minHeight={"100vh"}>
      <LoadingOverlay active={loadingCopy} spinner text="Loading...">
        <Navbar>
          <MenuToggle toggle={toggle} isOpen={isOpen}></MenuToggle>
          <Box
            display={{ base: isOpen ? "flex" : "none", md: "flex" }}
            flexBasis={{ base: "100%", md: "auto" }}
            justifyContent={"space-between"}
            maxWidth={"100%"}
            width={"100%"}
            flexDirection={{ base: "column", md: "row" }}
          >
            <Stack
              spacing={4}
              align="center"
              justify={["center", "space-between", "flex-end", "flex-end"]}
              direction={["column", "column", "row", "row"]}
              pt={[4, 4, 0, 0]}
            >
              <MenuItem to="/frontend">Home</MenuItem>
              {typeof jwtService.getToken() === "string" && (
                <MenuItem to="/frontend/challenges">Challenges</MenuItem>
              )}
              {typeof jwtService.getToken() === "string" && (
                <MenuItem
                  to={`/frontend/challenges/user/${
                    jwtService.parseJwt()?.emailAddress
                  }`}
                >
                  My Challenges
                </MenuItem>
              )}
              {typeof jwtService.getToken() === "string" && (
                <MenuItem
                  to={`/frontend/solutions/user/${
                    jwtService.parseJwt()?.emailAddress
                  }`}
                >
                  My Solutions
                </MenuItem>
              )}
            </Stack>
            <Stack
              spacing={4}
              align={"center"}
              justify={["flex-end", "flex-end", "flex-end", "flex-end"]}
              direction={["column", "column", "row", "row"]}
              pt={[4, 4, 0, 0]}
            >
              {!!jwtService.getToken() ? (
                <Button variant={"ghost"} onClick={logout}>
                  <Text display="block">Logout</Text>
                </Button>
              ) : (
                <GoogleLogin
                  clientId={
                    "423941664150-13lq5hfptjudvln1pmnb16hu43guu3ot.apps.googleusercontent.com"
                  }
                  onSuccess={onLoggedIn}
                  onFailure={onLoginFail}
                  render={(renderProps) => (
                    <Button
                      variant={"ghost"}
                      onClick={renderProps.onClick}
                      disabled={renderProps.disabled}
                    >
                      <Text display="block">Login</Text>
                    </Button>
                  )}
                />
              )}
              {
                // has admin role
                (jwtService.parseJwt()?.roles.indexOf("ROLE_ADMIN") as number) >
                  -1 && (
                  <Button variant={"ghost"} onClick={nav_roles}>
                    <Text display="block">Roles</Text>
                  </Button>
                )
              }
              <ColorModeSwitcher justifySelf="flex-end" />
            </Stack>
          </Box>
        </Navbar>
        <Box mx="auto" maxWidth={["100%", "48rem", "48rem", "70rem"]}>
          {children}
        </Box>
      </LoadingOverlay>
    </Flex>
  );
};
