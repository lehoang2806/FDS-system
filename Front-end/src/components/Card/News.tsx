import { FC } from 'react'
import { NewsCardProps } from './type'

const NewsCard: FC<NewsCardProps> = ({onClickDetail, news}) => {
    return (
        <div className='news-card'>
            <img src={news?.images[0]} className="nc-img"/>
            <div className="nc-info">
                <h4 className='nc-name' onClick={onClickDetail}>{news?.newsTitle}</h4>
            </div>
        </div>
    )
}

export default NewsCard