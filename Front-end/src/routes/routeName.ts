export const routes = {
    login: "/login",
    register: "/register",
    otp_auth: "/otp-auth",
    forgot_pass: "/forgot-pass",
    user: {
        home: "/",
        campaign: {
            list: "/campaigns",
            detail: "/campaign/:id/detail"
        },
        supporter: {
            list: "/supporters",
            detail: "/supporter/:id/detail"
        }
    }
}