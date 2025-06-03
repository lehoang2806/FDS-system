import React from "react";

const About: React.FC = () => {
    return (
        <section className="about-page">
            <div className="container">
                <h1>Về chúng tôi</h1>
                <p className="intro">
                    Chúng tôi là nền tảng kết nối giữa các nhà hảo tâm (donor)
                    và những người có thu nhập thấp, giúp họ tiếp cận các chiến
                    dịch phát thực phẩm miễn phí một cách công bằng và minh
                    bạch.
                </p>

                <div className="section">
                    <h2>Sứ mệnh</h2>
                    <p>
                        Mang đến giải pháp công nghệ nhằm đơn giản hóa quá trình
                        tạo chiến dịch thiện nguyện và đăng ký nhận hỗ trợ, giúp
                        việc trao tặng trở nên hiệu quả, minh bạch và đúng người
                        cần.
                    </p>
                </div>

                <div className="section">
                    <h2>Giá trị cốt lõi</h2>
                    <ul>
                        <li>
                            <strong>Minh bạch:</strong> Quản lý rõ ràng từng
                            chiến dịch và người nhận.
                        </li>
                        <li>
                            <strong>Nhân văn:</strong> Đặt con người vào trung
                            tâm của mọi hành động.
                        </li>
                        <li>
                            <strong>Công bằng:</strong> Ưu tiên hỗ trợ đúng
                            người, đúng hoàn cảnh.
                        </li>
                    </ul>
                </div>

                <div className="section">
                    <h2>Hợp tác</h2>
                    <p>
                        Chúng tôi chào đón các tổ chức, nhóm thiện nguyện và cá
                        nhân cùng chung tay lan tỏa sự sẻ chia đến cộng đồng.
                    </p>
                </div>
            </div>
        </section>
    );
};

export default About;
