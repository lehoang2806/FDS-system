import classNames from "classnames";
import { FC } from "react";

interface Props {
    title: string;
    loading?: boolean;
    onClick?: () => void;
    className?: string;
    type?: "button" | "submit"
}
const Button: FC<Props> = ({title, loading = false, onClick, type="button", className}) => {
    return (
        <button className={classNames(`loading-button sc-btn ${className}`, { "loading": loading })} disabled={loading} onClick={onClick} type={type}>
            {loading ?
                <span className="dots">
                    <span></span><span></span><span></span>
                </span>
                : title
            }
        </button>
    )
};

export default Button;