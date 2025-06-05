import React, { useState } from "react";

const Contact: React.FC = () => {
    const [form, setForm] = useState({ name: "", email: "", message: "" });

    const handleChange = (
        e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
    ) => {
        const { name, value } = e.target;
        setForm({ ...form, [name]: value });
    };

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        alert("Cảm ơn bạn đã liên hệ. Chúng tôi sẽ phản hồi sớm nhất có thể!");
        setForm({ name: "", email: "", message: "" });
    };

    return (
        <section className="contact-page">
            <div className="container">
                <h1>Liên hệ với chúng tôi</h1>
                <p className="intro">
                    Nếu bạn có bất kỳ câu hỏi hoặc đề xuất nào, hãy gửi thông
                    tin qua biểu mẫu dưới đây hoặc liên hệ trực tiếp với chúng
                    tôi qua:
                </p>

                <ul className="contact-info">
                    <li>
                        <strong>Email:</strong> tuanpcl7103@gmail.com
                    </li>
                    <li>
                        <strong>Số điện thoại:</strong> 0898 530 964
                    </li>
                </ul>

                <form onSubmit={handleSubmit} className="form">
                    <input
                        type="text"
                        name="name"
                        className="form-input"
                        placeholder="Họ và tên"
                        value={form.name}
                        onChange={handleChange}
                        required
                    />
                    <input
                        type="email"
                        name="email"
                        className="form-input"
                        placeholder="Email liên hệ"
                        value={form.email}
                        onChange={handleChange}
                        required
                    />
                    <textarea
                        name="message"
                        placeholder="Nội dung liên hệ"
                        className="form-input"
                        rows={5}
                        value={form.message}
                        onChange={handleChange}
                        required
                    />
                    <button type="submit" className="pr-btn">Gửi liên hệ</button>
                </form>
            </div>
        </section>
    );
};

export default Contact;
