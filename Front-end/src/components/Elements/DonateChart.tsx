import {
    LineChart,
    Line,
    XAxis,
    YAxis,
    CartesianGrid,
    Tooltip,
    ResponsiveContainer,
} from "recharts";

interface Props {
    data: { month: string; total: number }[];
}

const DonationLineChart = ({ data }: Props) => {
    return (
        <ResponsiveContainer width="100%" height={300}>
            <LineChart data={data}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="month" />
                <YAxis tickFormatter={(value) => value.toLocaleString()} />
                <Tooltip
                    formatter={(value: number) =>
                        `${value.toLocaleString()} VND`
                    }
                />
                <Line
                    type="monotone"
                    dataKey="total"
                    stroke="#4CAF50"
                    strokeWidth={2}
                />
            </LineChart>
        </ResponsiveContainer>
    );
};

export default DonationLineChart;
