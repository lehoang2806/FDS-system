import { selectGetAllUser } from "@/app/selector";
import { useAppDispatch, useAppSelector } from "@/app/store";
import { ActiveIcon, ArrowLeft, ArrowRight, TotalIcon } from "@/assets/icons";
import { Loading } from "@/components/Elements";
import { Modal } from "@/components/Modal";
import { navigateHook } from "@/routes/RouteApp";
import { routes } from "@/routes/routeName";
import { setLoading } from "@/services/app/appSlice";
import {
    banAccountApiThunk,
    getAllUserApiThunk,
    unbanAccountApiThunk,
} from "@/services/user/userThunk";
import { BanAccountParams, UnBanAccountParams } from "@/types/user";
import { useEffect, useState } from "react";

const StaffListUserPage = () => {
    const dispatch = useAppDispatch();

    const users = useAppSelector(selectGetAllUser);
    const accountsWithoutStaff = users.filter(
        (user) => user.roleId === 4 || user.roleId === 3
    );
    const donors = accountsWithoutStaff.filter((user) => user.roleId === 3);
    const recipients = accountsWithoutStaff.filter((user) => user.roleId === 4);

    const [isFiltering, setIsFiltering] = useState(false);
    const [filterStatus, setFilterStatus] = useState<string | null>(null);
    const [isBanAccountModalOpen, setIsBanAccountModalOpen] = useState(false);
    const [selectedAccountId, setSelectedAccountId] = useState<string | null>(
        null
    );
    const [banReason, setBanReason] = useState<string>("");

    const [isUnbanModalOpen, setIsUnbanModalOpen] = useState(false);
    const [selectedUnbanAccountId, setSelectedUnbanAccountId] = useState<
        string | null
    >(null);

    const handleFilter = (status: string | null) => {
        setIsFiltering(true);
        setTimeout(() => {
            setFilterStatus(status);
            setIsFiltering(false);
        }, 500);
    };

    const filteredUsers = filterStatus
        ? accountsWithoutStaff.filter(
              (c) => c.roleId.toString() === filterStatus
          )
        : accountsWithoutStaff;

    useEffect(() => {
        dispatch(setLoading(true));
        dispatch(getAllUserApiThunk())
            .unwrap()
            .catch(() => {})
            .finally(() => {
                setTimeout(() => {
                    dispatch(setLoading(false));
                }, 1000);
            });
    }, [dispatch]);

    const handleToDetail = (UserId: string) => {
        const url = routes.staff.user.detail.replace(":id", UserId);
        return navigateHook(url);
    };

    const ITEMS_PER_PAGE = 5;

    const [currentUserPage, setCurrentUserPage] = useState(1);

    const totalUserPages = Math.ceil(filteredUsers.length / ITEMS_PER_PAGE);

    const currentUsersPage = filteredUsers.slice(
        (currentUserPage - 1) * ITEMS_PER_PAGE,
        currentUserPage * ITEMS_PER_PAGE
    );

    const onPreviousUserPage = () => {
        if (currentUserPage > 1) setCurrentUserPage(currentUserPage - 1);
    };

    const onNextUserPage = () => {
        if (currentUserPage < totalUserPages)
            setCurrentUserPage(currentUserPage + 1);
    };

    const handleBanAccount = async (values: BanAccountParams) => {
        dispatch(setLoading(true));
        dispatch(banAccountApiThunk(values))
            .unwrap()
            .then(() => {
                dispatch(getAllUserApiThunk());
            })
            .catch(() => {})
            .finally(() => {
                setTimeout(() => {
                    dispatch(setLoading(false));
                }, 1000);
            });
    };

    const handleUnBanAccount = async (values: UnBanAccountParams) => {
        dispatch(setLoading(true));
        dispatch(unbanAccountApiThunk(values))
            .unwrap()
            .then(() => {
                dispatch(getAllUserApiThunk());
            })
            .catch(() => {})
            .finally(() => {
                setTimeout(() => {
                    dispatch(setLoading(false));
                }, 1000);
            });
    };

    return (
        <section id="staff-list-user" className="staff-section">
            {isFiltering && <Loading loading={true} isFullPage />}
            <div className="staff-container slu-container">
                <div className="slucr1">
                    <h1>Người dùng</h1>
                    <p>
                        Trang tổng quan
                        <span className="staff-tag">Người dùng</span>
                    </p>
                </div>
                <div className="slucr2">
                    <div
                        className="staff-tab staff-tab-1"
                        onClick={() => handleFilter(null)}
                    >
                        <div className="st-figure st-figure-1">
                            <TotalIcon className="st-icon" />
                        </div>
                        <div className="st-info">
                            <h3>Tổng cộng</h3>
                            <p>{accountsWithoutStaff.length} Tài khoản</p>
                        </div>
                    </div>
                    <div
                        className="staff-tab staff-tab-3"
                        onClick={() => handleFilter("3")}
                    >
                        <div className="st-figure st-figure-3">
                            <ActiveIcon className="st-icon" />
                        </div>
                        <div className="st-info">
                            <h3>Người hiến tặng thực phẩm</h3>
                            <p>{donors.length} Tài khoản</p>
                        </div>
                    </div>
                    <div
                        className="staff-tab staff-tab-4"
                        onClick={() => handleFilter("4")}
                    >
                        <div className="st-figure st-figure-4">
                            <ActiveIcon className="st-icon" />
                        </div>
                        <div className="st-info">
                            <h3>Người nhận hỗ trợ</h3>
                            <p>{recipients.length} Tài khoản</p>
                        </div>
                    </div>
                </div>
                <div className="slucr3">
                    <table className="table">
                        <thead className="table-head">
                            <tr className="table-head-row">
                                <th className="table-head-cell">Họ và tên</th>
                                <th className="table-head-cell">Trạng thái</th>
                                <th className="table-head-cell">
                                    Trạng thái tài khoản
                                </th>
                                <th className="table-head-cell">Vai trò</th>
                                <th className="table-head-cell">Hành động</th>
                            </tr>
                        </thead>
                        <tbody className="table-body">
                            {currentUsersPage.map((row, index) => (
                                <tr key={index} className="table-body-row">
                                    <td className="table-body-cell">
                                        {row.fullName}
                                    </td>
                                    <td className="table-body-cell">
                                        {row.isConfirm ? (
                                            <span className="status-approve">
                                                Đã được xác minh
                                            </span>
                                        ) : (
                                            <span className="status-reject">
                                                Chưa được xác minh
                                            </span>
                                        )}
                                    </td>
                                    <td className="table-body-cell">
                                        {row.roleId === 3
                                            ? "Người hiến tặng thực phẩm"
                                            : "Người nhận hỗ trợ"}
                                    </td>
                                    <td className="table-body-cell">
                                        <label className="switch">
                                            <input
                                                type="checkbox"
                                                checked={!row.isBanned}
                                                onChange={() => {
                                                    if (!row.isBanned) {
                                                        // Mở modal ban
                                                        setSelectedAccountId(
                                                            row.accountId
                                                        );
                                                        setIsBanAccountModalOpen(
                                                            true
                                                        );
                                                    } else {
                                                        // Mở modal xác nhận unban
                                                        setSelectedUnbanAccountId(
                                                            row.accountId
                                                        );
                                                        setIsUnbanModalOpen(
                                                            true
                                                        );
                                                    }
                                                }}
                                            />
                                            <span className="slider round"></span>
                                        </label>
                                    </td>
                                    <td className="table-body-cell">
                                        <button
                                            className="view-btn"
                                            onClick={() =>
                                                handleToDetail(row.accountId)
                                            }
                                        >
                                            Xem chi tiết
                                        </button>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                    <div className="paginator">
                        <div className="p-container">
                            <div className="pcc2">
                                {currentUserPage} of {totalUserPages}
                            </div>
                            <div className="pcc3">
                                <button
                                    disabled={currentUserPage === 1}
                                    onClick={onPreviousUserPage}
                                >
                                    <ArrowLeft className="pcc3-icon" />
                                </button>
                                <button
                                    disabled={currentUserPage >= totalUserPages}
                                    onClick={onNextUserPage}
                                >
                                    <ArrowRight
                                        className={`pcc3-icon ${
                                            currentUserPage >= totalUserPages
                                                ? "pcc3-icon-disabled"
                                                : ""
                                        }`}
                                    />
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
            <Modal
                isOpen={isBanAccountModalOpen}
                setIsOpen={setIsBanAccountModalOpen}
            >
                <section id="reject-campaign-modal">
                    <div className="rcm-container">
                        <h1>Khoá tài khoản</h1>
                        <form
                            className="form"
                            onSubmit={(e) => {
                                e.preventDefault();
                                if (selectedAccountId) {
                                    handleBanAccount({
                                        accountId: selectedAccountId,
                                        reason: banReason,
                                    });
                                    setIsBanAccountModalOpen(false);
                                    setBanReason("");
                                }
                            }}
                        >
                            <div className="form-field">
                                <label className="form-label">
                                    Lý do khoá tài khoản
                                </label>
                                <input
                                    type="text"
                                    className="form-input"
                                    placeholder="Vui lòng nhập lý do khoá tài khoản này"
                                    value={banReason}
                                    onChange={(e) =>
                                        setBanReason(e.target.value)
                                    }
                                    required
                                />
                            </div>
                            <button type="submit" className="sc-btn">
                                Xác nhận
                            </button>
                        </form>
                    </div>
                </section>
            </Modal>
            <Modal isOpen={isUnbanModalOpen} setIsOpen={setIsUnbanModalOpen}>
                <section id="reject-campaign-modal">
                    <div className="rcm-container">
                        <h1>Mở khóa tài khoản</h1>
                        <p>
                            Bạn có chắc chắn muốn mở khóa tài khoản này không?
                        </p>
                        <div className="form-actions">
                            <button
                                className="sc-btn"
                                onClick={() => {
                                    if (selectedUnbanAccountId) {
                                        handleUnBanAccount({
                                            accountId: selectedUnbanAccountId,
                                        });
                                        setIsUnbanModalOpen(false);
                                        setSelectedUnbanAccountId(null);
                                    }
                                }}
                            >
                                Xác nhận
                            </button>
                            <button
                                className="sc-btn"
                                onClick={() => {
                                    setIsUnbanModalOpen(false);
                                    setSelectedUnbanAccountId(null);
                                }}
                                style={{ background: "red" }}
                            >
                                Hủy
                            </button>
                        </div>
                    </div>
                </section>
            </Modal>
        </section>
    );
};

export default StaffListUserPage;
