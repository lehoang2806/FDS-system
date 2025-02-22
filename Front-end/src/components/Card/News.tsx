import { FC } from 'react'

const NewsCard: FC<NewsCardProps> = ({onClickDetail}) => {
    return (
        <div className='news-card' onClick={onClickDetail}>
            <div className="nc-img"></div>
            <div className="nc-info">
                <p className='nc-status'>Trạng thái</p>
                <h4 className='nc-name'>Tên sự kiện</h4>
                <p className='nc-interested'><span>0 người</span> quan tâm</p>
                <button className="sc-btn">Quan tâm</button>
            </div>
        </div>
    )
}

export default NewsCard