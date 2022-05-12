import Cookies from "js-cookie";

class JwtService {
  private _token: string | null = null;

  public getToken() {
    return Cookies.get("token");
  }

  public setToken(value: string | undefined) {
    if (!value) {
      Cookies.remove("token");
    } else {
      Cookies.set("token", value, { expires: 1 });
    }
  }

  // from: https://stackoverflow.com/questions/38552003/how-to-decode-jwt-token-in-javascript-without-using-a-library
  public parseJwt(): {emailAddress: String, roles: Array<String>} | null {
    if (typeof Cookies.get("token") !== "string") {
      console.log("Parsed null");
      return null;
    }
    var base64Url = (Cookies.get("token") as string).split(".")[1];
    var base64 = base64Url.replace(/-/g, "+").replace(/_/g, "/");
    var jsonPayload = decodeURIComponent(
      atob(base64)
        .split("")
        .map(function (c) {
          return "%" + ("00" + c.charCodeAt(0).toString(16)).slice(-2);
        })
        .join("")
    );
    return JSON.parse(jsonPayload);
  }
}

export const jwtService = new JwtService();
