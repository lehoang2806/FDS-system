import { FC, useState } from "react";
import { ListRegisterReceiverModalProps } from "./type";
import Modal from "./Modal";
import { ArrowLeft, ArrowRight } from "@/assets/icons";
import ConfirmReceiveModal from "./ConfirmReceiveModal";

const ListRegisterReceiverModal: FC<ListRegisterReceiverModalProps> = ({
    isOpen,
    setIsOpen,
    registeredReceiver,
    implementTime,
}) => {
    const [searchTerm, setSearchTerm] = useState("");
    const [isModalConfirmOpen, setIsModalConfirmOpen] = useState(false);
    const [selectedReceiver, setSelectedReceiver] = useState<any>(null);

    console.log(registeredReceiver)

    const filteredRegisterReceiver = (registeredReceiver ?? []).filter(
        (donor) => donor.code.toLowerCase().includes(searchTerm.toLowerCase())
    );

    const ITEMS_PER_PAGE = 5;
    const [currentListRegisterReceiver, setCurrentListRegisterReceiver] =
        useState(1);
    const totalNewsPages = Math.ceil(
        filteredRegisterReceiver.length / ITEMS_PER_PAGE
    );
    const currentRegisterReceiveresPage = filteredRegisterReceiver.slice(
        (currentListRegisterReceiver - 1) * ITEMS_PER_PAGE,
        currentListRegisterReceiver * ITEMS_PER_PAGE
    );

    const onPreviousListRegisterReceiver = () => {
        if (currentListRegisterReceiver > 1)
            setCurrentListRegisterReceiver(currentListRegisterReceiver - 1);
    };

    const onNextListRegisterReceiver = () => {
        if (currentListRegisterReceiver < totalNewsPages)
            setCurrentListRegisterReceiver(currentListRegisterReceiver + 1);
    };

    return (
        <Modal isOpen={isOpen} setIsOpen={setIsOpen}>
            <div className="list-register-receiver-modal">
                <p style={{ fontSize: "20px", fontWeight: "bold" }}>Tìm kiếm</p>
                <input
                    type="text"
                    placeholder="Tìm kiếm mã nhận quà"
                    className="pr-input"
                    value={searchTerm}
                    onChange={(e) => {
                        setSearchTerm(e.target.value);
                        setCurrentListRegisterReceiver(1);
                    }}
                    style={{ width: "400px", marginBottom: "20px" }}
                />

                <table className="table">
                    <thead className="table-head">
                        <tr className="table-head-row">
                            <th className="table-head-cell">Họ và tên</th>
                            <th className="table-head-cell">
                                Số lượng đăng ký
                            </th>
                            <th className="table-head-cell">Mã nhận quà</th>
                            <th className="table-head-cell">Trạng thái</th>
                            <th className="table-head-cell">Hành động</th>
                        </tr>
                    </thead>
                    <tbody className="table-body">
                        {registeredReceiver &&
                            currentRegisterReceiveresPage.map((receiver) => {
                                const now = new Date();
                                const start = new Date(implementTime);
                                const end = new Date(start);
                                end.setHours(23, 59, 59, 999);
                                const isDisabled = now < start || now > end;

                                return (
                                    <tr
                                        className="table-body-row"
                                        key={receiver.registerReceiverId}
                                    >
                                        <td className="table-body-cell">
                                            {receiver.registerReceiverName}
                                        </td>
                                        <td className="table-body-cell">
                                            {receiver.quantity}
                                        </td>
                                        <td className="table-body-cell">
                                            {receiver.code}
                                        </td>
                                        <td className="table-body-cell">
                                            {receiver.status === "Pending"
                                                ? "Chưa nhận quà"
                                                : "Đã nhận quà"}
                                        </td>
                                        <td className="table-body-cell">
                                            <button
                                                className={`pr-btn ${
                                                    isDisabled
                                                        ? "disabled-btn"
                                                        : ""
                                                }`}
                                                disabled={isDisabled}
                                                onClick={() => {
                                                    setSelectedReceiver(
                                                        receiver
                                                    );
                                                    setIsModalConfirmOpen(true);
                                                }}
                                            >
                                                Xác nhận
                                            </button>
                                        </td>
                                    </tr>
                                );
                            })}
                    </tbody>
                </table>

                <div className="paginator">
                    <div className="p-container">
                        <div className="pcc2">
                            {currentListRegisterReceiver} of {totalNewsPages}
                        </div>
                        <div className="pcc3">
                            <button
                                disabled={currentListRegisterReceiver === 1}
                                onClick={onPreviousListRegisterReceiver}
                            >
                                <ArrowLeft className="pcc3-icon" />
                            </button>
                            <button
                                disabled={
                                    currentListRegisterReceiver >=
                                    totalNewsPages
                                }
                                onClick={onNextListRegisterReceiver}
                            >
                                <ArrowRight
                                    className={`pcc3-icon ${
                                        currentListRegisterReceiver >=
                                        totalNewsPages
                                            ? "pcc3-icon-disabled"
                                            : ""
                                    }`}
                                />
                            </button>
                        </div>
                    </div>
                </div>
            </div>

            {/* Modal xác nhận riêng */}
            <ConfirmReceiveModal
                isOpen={isModalConfirmOpen}
                setIsOpen={setIsModalConfirmOpen}
                selectedReceiver={selectedReceiver}
            />
        </Modal>
    );
};

export default ListRegisterReceiverModal;
