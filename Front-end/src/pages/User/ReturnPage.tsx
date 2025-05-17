import { useEffect, useState } from "react";
import { useSearchParams } from "react-router-dom";

const ReturnPage = () => {
    const [searchParams] = useSearchParams();
    const [status, setStatus] = useState<string | null>(null);
    const [donorDonateId, setDonorDonateId] = useState<string | null>(null);

    useEffect(() => {
        setStatus(searchParams.get("status"));
        setDonorDonateId(searchParams.get("donorDonateId"));
    }, [searchParams]);

    const getMessage = () => {
        if (status === "success")
            return { msg: "🎉 Thanh toán thành công!", className: "success" };
        if (status === "fail")
            return {
                msg: "❌ Thanh toán thất bại hoặc bị hủy.",
                className: "fail",
            };
        return { msg: "⚠️ Không xác định kết quả thanh toán.", className: "" };
    };

    const { msg, className } = getMessage();

    return (
        <div
            style={{
                fontFamily: "Arial, sans-serif",
                padding: "40px",
                backgroundColor: "#f0f2f5",
                textAlign: "center",
            }}
        >
            <div
                style={{
                    background: "#fff",
                    padding: "30px",
                    borderRadius: "10px",
                    display: "inline-block",
                    boxShadow: "0 0 10px rgba(0,0,0,0.1)",
                }}
            >
                <h1 className={className}>{msg}</h1>
                {donorDonateId && (
                    <p
                        style={{
                            marginTop: "10px",
                            fontSize: "14px",
                            color: "#555",
                        }}
                    >
                        Mã giao dịch: {donorDonateId}
                    </p>
                )}
            </div>
        </div>
    );
};

export default ReturnPage;
