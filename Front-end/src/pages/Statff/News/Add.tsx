import { navigateHook } from "@/routes/RouteApp"
import { routes } from "@/routes/routeName"
import { FC } from "react"
import classNames from "classnames";
import Button from "@/components/Elements/Button";

const StaffAddNewsPage: FC = () => {
    return (
        <section id="staff-add-news" className="staff-section">
            <div className="staff-container san-container">
                <div className="sancr1">
                    <h1>News</h1>
                    <p>Dashboard<span className="staff-tag">Add News</span></p>
                </div>
                <div className="sancr2">
                    <div className="sancr2r1">
                        <h2>#1</h2>
                        <div className="group-btn">
                            <button onClick={() => navigateHook(routes.staff.news.list)}>Cancel</button>
                            <Button type="submit" title="Create Staff" />
                        </div>
                    </div>
                    <hr />
                    <div className="sancr2r2">
                        <div className="sancr2r2c1">
                            <h3>Staff Status:</h3>
                            <p>Active</p>
                        </div>
                        <div className="sancr2r2c2">
                            <h3>Created Date:</h3>
                            <p>25-02-2025</p>
                        </div>
                    </div>
                    <hr />
                    <div className="sancr2r3">
                        <form className="form">
                            <div className="form-field">
                                <label className="form-label">Email</label>
                                <input name="userEmail" type="email" placeholder="Hãy nhập email của bạn" className={classNames("form-input")} />
                            </div>
                            <div className="form-field">
                                <label className="form-label">Username</label>
                                <input name="fullName" type="text" placeholder="Hãy nhập tên người dung" className={classNames("form-input")} />
                            </div>
                            <div className="form-field">
                                <label className="form-label">Password</label>
                                <input name="password" type="password" placeholder="Hãy nhập mật khẩu" className={classNames("form-input")} />
                            </div>
                            <div className="form-field">
                                <label className="form-label">Phone</label>
                                <input name="phone" type="text" placeholder="Hãy nhập số diện thoại" className={classNames("form-input")} />
                            </div>
                        </form>
                    </div>

                </div>
            </div>
        </section>
    )
}

export default StaffAddNewsPage