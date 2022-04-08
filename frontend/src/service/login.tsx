import Cookies from 'js-cookie'

class JwtService {
    private _token: string | null = null

    public getToken() {
        return Cookies.get("token")
    }

    public setToken(value: string | undefined) {
        if (!value) {
            Cookies.remove("token")
        } else {
            Cookies.set("token", value, {expires: 1})
        }
    }
}

export const jwtService = new JwtService()