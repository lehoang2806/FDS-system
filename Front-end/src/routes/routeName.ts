export const routes = {
    login: "/login",
    register: "/register",
    otp_auth: "/otp-auth",
    user: {
        home: "/",
        campaign: {
            list: "/campaigns",
            detail: "/campaign/:id/detail"
        },
        supporter: {
            list: "/supporters",
        }
    }
}