import React from "react";

const About: React.FC = () => {
    return (
        <section className="about-page">
            <div className="container">
                <h1>Về chúng tôi</h1>
                <p className="intro">
                    Trong xã hội hiện đại, sự tử tế vẫn luôn hiện hữu, nhưng
                    khoảng cách giữa người muốn cho đi và người đang cần nhận
                    vẫn còn quá xa. FDSSystem ra đời để thu hẹp khoảng cách đó –
                    trở thành nền tảng kết nối cộng đồng thiện nguyện, giúp các
                    nhà hảo tâm và những người có hoàn cảnh khó khăn gặp được
                    nhau đúng lúc, đúng nơi, một cách minh bạch và hiệu quả.
                </p>
                <p className="intro">
                    Chúng tôi không phải là một tổ chức gây quỹ. Chúng tôi là
                    nơi giúp mỗi hành động cho đi – dù là một phần cơm, gói mì,
                    chai dầu ăn hay chiếc cặp sách – đến đúng tay người đang
                    thật sự cần, không trung gian, không phức tạp.
                </p>

                <div className="section">
                    <h2>🎯 Sứ mệnh</h2>
                    <p>Mang công nghệ phục vụ lòng nhân ái.</p>
                    <p>
                        FDSSystem hướng đến việc xây dựng một nền tảng thiện
                        nguyện thông minh và dễ tiếp cận, giúp người dùng có
                        thể:
                    </p>
                    <p>Tạo chiến dịch thiện nguyện dễ dàng</p>
                    <p>Đăng ký nhận hỗ trợ minh bạch, thuận tiện</p>
                    <p>Theo dõi quá trình trao – nhận một cách rõ ràng</p>
                    <p>
                        Chúng tôi tin rằng khi việc cho đi được tổ chức tốt hơn,
                        thì tình người sẽ được lan tỏa sâu rộng hơn.
                    </p>
                </div>

                <div className="section">
                    <h2>🌱 Giá trị cốt lõi</h2>
                    <ul>
                        <li>
                            <strong>🔍 Minh bạch:</strong> Chúng tôi cam kết rõ
                            ràng từng bước: từ thông tin người nhận, tiến độ
                            chiến dịch, đến kết quả thực tế. Minh bạch là nền
                            tảng để tạo dựng niềm tin lâu dài giữa cộng đồng và
                            người thực hiện.
                        </li>
                        <li>
                            <strong>❤️ Nhân văn:</strong> Mọi quyết định, tính
                            năng và cách vận hành của hệ thống đều lấy con người
                            làm trung tâm. Chúng tôi không chỉ giúp người nhận
                            có phần quà, mà còn giúp họ được tôn trọng và đồng
                            cảm.
                        </li>
                        <li>
                            <strong>⚖️ Công bằng:</strong> Chúng tôi hướng đến
                            việc hỗ trợ đúng người – đúng nhu cầu – đúng hoàn
                            cảnh. Không phân biệt tuổi tác, vùng miền hay điều
                            kiện, chỉ cần thật sự cần, hệ thống sẽ ở đó để giúp.
                        </li>
                    </ul>
                </div>

                <div className="section">
                    <h2>🤝 Hợp tác – Lan tỏa yêu thương</h2>
                    <p>
                        FDSSystem luôn rộng mở kết nối với các tổ chức, nhóm
                        thiện nguyện và cả những cá nhân đơn lẻ đang muốn lan
                        tỏa lòng tốt đến cộng đồng.
                    </p>
                    <p>
                        Chúng tôi tin rằng, khi mỗi người chung tay một chút,
                        chúng ta có thể cùng nhau xây dựng một xã hội:
                    </p>
                    <p>Không ai bị bỏ lại phía sau</p>
                    <p>Không ai phải cô đơn giữa những lúc khó khăn nhất</p>
                    <p>
                        Và mỗi hành động nhỏ hôm nay sẽ góp phần làm nên những
                        thay đổi lớn cho ngày mai
                    </p>
                </div>
            </div>
        </section>
    );
};

export default About;
