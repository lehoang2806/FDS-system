import {
    LineChart,
    Line,
    XAxis,
    YAxis,
    CartesianGrid,
    Tooltip,
    Legend,
    ResponsiveContainer,
} from "recharts";
import { FC, useState } from "react";

interface CampaignComparisonChartProps {
    allYears: number[];
    dataGenerator: (years: number[]) => {
        month: string;
        [year: string]: number | string;
    }[];
}

const CampaignComparisonChart: FC<CampaignComparisonChartProps> = ({
    allYears,
    dataGenerator,
}) => {
    const currentYear = new Date().getFullYear();
    const [yearA, setYearA] = useState(currentYear - 1);
    const [yearB, setYearB] = useState(currentYear);

    const selectedYears = [yearA, yearB];
    const data = dataGenerator(selectedYears);

    return (
        <div>
            <div style={{ display: "flex", gap: "1rem", marginBottom: "1rem" }}>
                <div>
                    <label style={{fontSize: "16px", marginRight: "10px", fontWeight: "700"}}>Năm:</label>
                    <select
                        className="pr-input"
                        style={{ padding: "6px 15px", cursor: "pointer" }}
                        value={yearA}
                        onChange={(e) => setYearA(Number(e.target.value))}
                    >
                        {allYears.map((year) => (
                            <option key={year} value={year}>
                                {year}
                            </option>
                        ))}
                    </select>
                </div>
                <div>
                    <label style={{fontSize: "16px", marginRight: "10px", fontWeight: "700"}}>Năm:</label>
                    <select
                        className="pr-input"
                        style={{ padding: "6px 15px", cursor: "pointer" }}
                        value={yearB}
                        onChange={(e) => setYearB(Number(e.target.value))}
                    >
                        {allYears.map((year) => (
                            <option key={year} value={year}>
                                {year}
                            </option>
                        ))}
                    </select>
                </div>
            </div>

            <div style={{ width: "100%", height: 400 }}>
                <ResponsiveContainer>
                    <LineChart data={data}>
                        <CartesianGrid strokeDasharray="3 3" />
                        <XAxis dataKey="month" />
                        <YAxis allowDecimals={false} />
                        <Tooltip />
                        <Legend />
                        <Line
                            type="monotone"
                            dataKey={yearA.toString()}
                            stroke="#460d02"
                            strokeWidth={2}
                        />
                        <Line
                            type="monotone"
                            dataKey={yearB.toString()}
                            stroke="#ff9d2e"
                            strokeWidth={2}
                        />
                    </LineChart>
                </ResponsiveContainer>
            </div>
        </div>
    );
};

export default CampaignComparisonChart;
