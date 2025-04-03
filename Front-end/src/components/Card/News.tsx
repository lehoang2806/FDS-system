import { FC } from 'react'

const NewsCard: FC<NewsCardProps> = ({onClickDetail, news}) => {
    return (
        <div className='news-card'>
            <img src={news?.images[0]} className="nc-img"/>
            <div className="nc-info">
                <h4 className='nc-name' onClick={onClickDetail}>{news?.newsTitle}</h4>
                <p className='nc-interested'><span>0 người</span> quan tâm</p>
                <button className="sc-btn">Quan tâm</button>
            </div>
        </div>
    )
}

export default NewsCard