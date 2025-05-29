import { navigateHook } from "@/routes/RouteApp";
import { routes } from "@/routes/routeName";
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
                padding: "100px 20px",
                backgroundColor: "#f0f2f5",
                height: "calc(100vh - 471px)",
                display: "flex",
                justifyContent: "center",
                flexDirection: "column",
                alignItems: "center",
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

            <button className="sc-btn" onClick={() => navigateHook(routes.user.home)} style={{ marginTop: "20px", padding: "10px 20px" }}>Quay về trang chủ</button>
        </div>
    );
};

export default ReturnPage;
