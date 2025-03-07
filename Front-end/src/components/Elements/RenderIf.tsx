import React from 'react';

const RenderIf: React.FC<{ condition: boolean, children: React.ReactNode }> = ({ condition, children }) => {
    return condition ? <>{children}</> : null;
}

export default RenderIf;