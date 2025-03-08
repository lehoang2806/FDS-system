import React from 'react';

const TextError = ({ text }: any): React.JSX.Element => {
    return (
        <span className='text-error'>{text}</span>
    );
}

export default TextError