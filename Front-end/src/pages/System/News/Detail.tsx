import React from 'react'

const DetailNewsPage = () => {
    return (
        <main id="detail-news">
            <section id="dn-section">
                <div className="dns-container">
                    <div className="dnscr1">
                        <div className="dn-img"></div>
                    </div>
                    <div className="dnscr2">
                        <div className="dnscr2r1">
                            <p>Trạng thái</p>
                            <h2>Tên tin tức</h2>
                        </div>
                        <div className="dnscr2r2">
                            <p>Giới thiệu</p>
                            <button className="sc-btn">Quan tâm</button>
                        </div>
                    </div>
                    <div className="dnscr3">
                        <div className="dnscr3r1">
                            <p><span>5</span> người tham gia</p>
                        </div>
                        <div className="dnscr3r2">
                            <h4>Chi tiết tin tức</h4>
                            <p>Thông tin tin tức</p>
                        </div>
                    </div>
                    <div className="dnscr4">
                        <div className="dnscr4r1">
                            <h4>Bình luận</h4>
                        </div>
                        <div className="dnscr4r2">
                            <div className="comment-container">
                                <div className="cc-avatar"></div>
                                <div className="cc-info">
                                    <p className="cc-name">Tên</p>
                                    <p className="cc-content">Bình luận</p>
                                    <p className='cc-time'>Thời gian</p>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </section>
        </main>
    )
}

export default DetailNewsPage