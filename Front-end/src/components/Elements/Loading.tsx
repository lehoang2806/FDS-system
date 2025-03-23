import React from 'react'
import classNames from 'classnames'
type Props = {
    isFullPage?: boolean
    loading?: boolean
    width?: number
    height?: number
}
const Loading: React.FC<Props> = ({
    isFullPage,
    loading
}) => {
    if (!loading) return null
    return (
        <div
            className={classNames('loading-container', {
                'loading-full-page': isFullPage,
            })}
        >
            <div className="text-primary spinner-border" role="status">
            </div>
        </div>
    )
}
export default Loading
