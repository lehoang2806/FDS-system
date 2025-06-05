import { FC, useEffect, useState } from "react";
import Modal from "./Modal";
import { useAppDispatch, useAppSelector } from "@/app/store";
import { RequestDonorModalProps } from "./type";
import { selectGetAllCampaign, selectGetAllDonorSupport } from "@/app/selector";
import {
    getAllDonorSupportApiThunk,
    getRequestSupportByIdApiThunk,
    requestDonorSupportApiThunk,
} from "@/services/requestSupport/requestSupportThunk";
import { ArrowLeft, ArrowRight } from "@/assets/icons";
import { toast } from "react-toastify";
import { setLoading } from "@/services/app/appSlice";
import { getAllCampaignApiThunk } from "@/services/campaign/campaignThunk";
import Button from "../Elements/Button";
import { isOver24h } from "@/utils/helper";

const RequestDonorModal: FC<RequestDonorModalProps> = ({
    isOpen,
    setIsOpen,
    donorSupport,
    requestSupportId,
}) => {
    const dispatch = useAppDispatch();
    const donorSupports = useAppSelector(selectGetAllDonorSupport);
    const campaigns = useAppSelector(selectGetAllCampaign);
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [statusFilter, setStatusFilter] = useState<
        "all" | "sent" | "expired" | "unsent"
    >("all");

    const countCampaign = (acountID: string) => {
        const count = campaigns.filter(
            (campaign) => campaign.accountId === acountID
        ).length;
        return count;
    };

    const sortedDonorSupports = [...donorSupports].sort((a, b) => {
        const countA = countCampaign(a.donorId);
        const countB = countCampaign(b.donorId);
        return countB - countA; // giảm dần (nhiều chiến dịch hơn lên trước)
    });

    const [searchTerm, setSearchTerm] = useState("");

    const filteredDonorSupports = sortedDonorSupports.filter((donor) => {
        const matchesSearch =
            donor.fullName.toLowerCase().includes(searchTerm.toLowerCase()) ||
            donor.email.toLowerCase().includes(searchTerm.toLowerCase());

        const matchedSentDonor = donorSupport?.find(
            (d) => d.email === donor.email
        );
        const isSent = !!matchedSentDonor;
        const isExpired =
            isSent &&
            matchedSentDonor?.createdDate &&
            isOver24h(matchedSentDonor.createdDate);

        const matchesStatus =
            statusFilter === "all" ||
            (statusFilter === "sent" && isSent && !isExpired) ||
            (statusFilter === "expired" && isExpired) ||
            (statusFilter === "unsent" && !isSent);

        return matchesSearch && matchesStatus;
    });

    const [selectedDonors, setSelectedDonors] = useState<string[]>([]);
    const [isAllSelected, setIsAllSelected] = useState(false);

    const sentDonorEmails = donorSupport?.map((donor) => donor.email) || [];

    useEffect(() => {
        dispatch(getAllDonorSupportApiThunk());
        dispatch(getAllCampaignApiThunk());
    }, [dispatch]);

    const handleSelectAll = () => {
        if (isAllSelected) {
            setSelectedDonors([]);
        } else {
            const selectableEmails = sortedDonorSupports
                .filter((donor) => !sentDonorEmails.includes(donor.email))
                .map((donor) => donor.email);
            setSelectedDonors(selectableEmails);
        }
        setIsAllSelected(!isAllSelected);
    };

    const ITEMS_PER_PAGE = 5;

    const [currentDonorSupportsPage, setCurrentDonorSupportsPage] = useState(1);

    const totalNewsPages = Math.ceil(
        filteredDonorSupports.length / ITEMS_PER_PAGE
    );

    const currentDonorSupportsesPage = filteredDonorSupports.slice(
        (currentDonorSupportsPage - 1) * ITEMS_PER_PAGE,
        currentDonorSupportsPage * ITEMS_PER_PAGE
    );

    const onPreviousDonorSupportsPage = () => {
        if (currentDonorSupportsPage > 1)
            setCurrentDonorSupportsPage(currentDonorSupportsPage - 1);
    };

    const onNextDonorSupportsPage = () => {
        if (currentDonorSupportsPage < totalNewsPages)
            setCurrentDonorSupportsPage(currentDonorSupportsPage + 1);
    };

    const handleSelectDonor = (email: string) => {
        setSelectedDonors((prevState) =>
            prevState.includes(email)
                ? prevState.filter((donor) => donor !== email)
                : [...prevState, email]
        );
    };

    const handleSubmit = async () => {
        if (!requestSupportId) {
            alert("Thiếu requestSupportId");
            return;
        }

        try {
            dispatch(setLoading(true));
            setIsSubmitting(true);
            await dispatch(
                requestDonorSupportApiThunk({
                    requestSupportId: requestSupportId,
                    emails: selectedDonors,
                })
            )
                .unwrap()
                .then(() => {
                    dispatch(getRequestSupportByIdApiThunk(String(requestSupportId)))
                    toast.success("Gửi thành công!");
                    setIsOpen(false);
                    setSelectedDonors([]);
                    setIsAllSelected(false);
                })
                .catch(() => {})
                .finally(() => {
                    setTimeout(() => {
                        dispatch(setLoading(false));
                        setIsSubmitting(false);
                    }, 1000);
                });
        } catch (err) {
            toast.error(
                "Có lỗi xảy ra khi gửi: " + (err as any)?.errorMessage ||
                    "Unknown error"
            );
        }
    };

    return (
        <Modal isOpen={isOpen} setIsOpen={setIsOpen}>
            <section id="request-donor-modal" style={{ width: "1000px" }}>
                <h1>Gửi yêu cầu đến người tặng thực phẩm</h1>
                <div className="group-filter">
                    <div className="gfc1">
                        <p style={{ fontSize: "20px", fontWeight: "bold" }}>
                            Tìm kiếm
                        </p>
                        <input
                            type="text"
                            placeholder="Tìm kiếm theo tên hoặc email"
                            className="pr-input"
                            value={searchTerm}
                            onChange={(e) => {
                                setSearchTerm(e.target.value);
                                setCurrentDonorSupportsPage(1); // Reset về page 1 khi tìm kiếm
                            }}
                            style={{ width: "400px", marginBottom: "20px" }}
                        />
                    </div>
                    <div className="gfc2">
                        <p style={{ fontSize: "20px", fontWeight: "bold" }}>
                            Trạng thái
                        </p>
                        <select
                            className="pr-input"
                            style={{ width: "200px" }}
                            value={statusFilter}
                            onChange={(e) => {
                                setStatusFilter(e.target.value as any);
                                setCurrentDonorSupportsPage(1);
                            }}
                        >
                            <option value="all">Tất cả</option>
                            <option value="sent">Đã gửi</option>
                            <option value="expired">Đã gửi (quá 24h)</option>
                            <option value="unsent">Chưa gửi</option>
                        </select>
                    </div>
                </div>
                <table className="table">
                    <thead className="table-head">
                        <tr className="table-head-row">
                            <th className="table-head-cell">
                                <input
                                    type="checkbox"
                                    checked={isAllSelected}
                                    onChange={handleSelectAll}
                                />
                            </th>
                            <th className="table-head-cell">Họ và tên</th>
                            <th className="table-head-cell">Email</th>
                            <th className="table-head-cell">
                                Chiến dịch đã tạo
                            </th>
                            <th className="table-head-cell">Trạng thái</th>
                        </tr>
                    </thead>
                    <tbody className="table-body">
                        {currentDonorSupportsesPage.map((donorItem, index) => {
                            const matchedSentDonor = donorSupport?.find(
                                (d) => d.email === donorItem.email
                            );

                            const isSent = !!matchedSentDonor;
                            const isExpired =
                                isSent &&
                                matchedSentDonor?.createdDate &&
                                isOver24h(matchedSentDonor.createdDate);
                            const shouldDisable = isSent && !isExpired;

                            return (
                                <tr className="table-body-row" key={index}>
                                    <td className="table-body-cell">
                                        <input
                                            type="checkbox"
                                            checked={selectedDonors.includes(
                                                donorItem.email
                                            )}
                                            onChange={() =>
                                                handleSelectDonor(
                                                    donorItem.email
                                                )
                                            }
                                            disabled={shouldDisable}
                                        />
                                    </td>
                                    <td className="table-body-cell">
                                        {donorItem.fullName}
                                    </td>
                                    <td className="table-body-cell">
                                        {donorItem.email}
                                    </td>
                                    <td className="table-body-cell">
                                        {countCampaign(donorItem.donorId)}
                                    </td>
                                    <td className="table-body-cell">
                                        {isSent ? (
                                            isExpired ? (
                                                <span className="text-yellow-600">
                                                    Đã gửi (quá 24h)
                                                </span>
                                            ) : (
                                                <span className="text-green-600">
                                                    Đã gửi
                                                </span>
                                            )
                                        ) : (
                                            <span className="text-gray-500">
                                                Chưa gửi
                                            </span>
                                        )}
                                    </td>
                                </tr>
                            );
                        })}
                    </tbody>
                </table>
                <div className="paginator">
                    <div className="p-container">
                        <div className="pcc2">
                            {currentDonorSupportsPage} of {totalNewsPages}
                        </div>
                        <div className="pcc3">
                            <button
                                disabled={currentDonorSupportsPage === 1}
                                onClick={onPreviousDonorSupportsPage}
                            >
                                <ArrowLeft className="pcc3-icon" />
                            </button>
                            <button
                                disabled={
                                    currentDonorSupportsPage >= totalNewsPages
                                }
                                onClick={onNextDonorSupportsPage}
                            >
                                <ArrowRight
                                    className={`pcc3-icon ${
                                        currentDonorSupportsPage >=
                                        totalNewsPages
                                            ? "pcc3-icon-disabled"
                                            : ""
                                    }`}
                                />
                            </button>
                        </div>
                    </div>
                </div>
                <div style={{ textAlign: "center" }}>
                    <Button
                        title="Gửi"
                        onClick={handleSubmit}
                        className={
                            selectedDonors.length === 0 ? "disabled-btn" : ""
                        }
                        loading={isSubmitting}
                    />
                </div>
            </section>
        </Modal>
    );
};

export default RequestDonorModal;
