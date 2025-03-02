export const routes = {
    login: "/login",
    register: "/register",
    otp_auth: "/otp-auth",
    forgot_pass: "/forgot-pass",
    new_pass: "/new-pass",
    user: {
        home: "/",
        campaign: {
            list: "/campaigns",
            detail: "/campaign/:id/detail"
        },
        supporter: {
            list: "/supporters",
            detail: "/supporter/:id/detail"
        },
        news: {
            list: "/news",
            detail: "/news/:id/detail"
        },
        post: {
            forum: "/posts"
        },
        profile: "/user/profile",
        change_pass: "/user/change-pass",
        new_pass: "/user/new-pass"
    },
    admin: {
        dashboard: "/admin",
        staff: {
            list: "/admin/staff",
            add: "/admin/staff/add"
        }
    }
}