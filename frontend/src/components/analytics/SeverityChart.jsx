import {
    BarChart,
    Bar,
    XAxis,
    YAxis,
    CartesianGrid,
    Tooltip,
    ResponsiveContainer,
    Cell
} from "recharts";

const SeverityChart = ({ stats }) => {

    if (!stats) {
        return (
            <div className="smart-glass rounded-2xl shadow-lg p-6">

                <h2 className="text-xl font-bold text-white">
                    🚧 Pothole Severity
                </h2>

                <p className="text-gray-300 mt-2">
                    Loading severity chart...
                </p>

            </div>
        );
    }

    const data = [
        {
            name: "Low",
            count: stats.low || 0,
            color: "#22c55e"
        },
        {
            name: "Medium",
            count: stats.medium || 0,
            color: "#f59e0b"
        },
        {
            name: "High",
            count: stats.high || 0,
            color: "#ef4444"
        }
    ];

    return (

        <div className="smart-glass rounded-2xl shadow-xl p-6">

            {/* TITLE */}

            <h2 className="text-xl font-bold text-white mb-4">
                🚧 Pothole Severity
            </h2>


            {/* CHART */}

            <div className="w-full h-[320px]">

                <ResponsiveContainer
                    width="100%"
                    height="100%"
                >

                    <BarChart
                        data={data}
                        margin={{
                            top: 10,
                            right: 10,
                            left: 0,
                            bottom: 10
                        }}
                    >

                        {/* GRID */}

                        <CartesianGrid
                            strokeDasharray="3 3"
                            stroke="rgba(255,255,255,0.20)"
                        />


                        {/* X AXIS */}

                        <XAxis
                            dataKey="name"
                            tick={{
                                fill: "#ffffff",
                                fontSize: 14
                            }}
                            axisLine={{
                                stroke: "rgba(255,255,255,0.4)"
                            }}
                            tickLine={{
                                stroke: "rgba(255,255,255,0.4)"
                            }}
                        />


                        {/* Y AXIS */}

                        <YAxis
                            allowDecimals={false}
                            tick={{
                                fill: "#ffffff",
                                fontSize: 14
                            }}
                            axisLine={{
                                stroke: "rgba(255,255,255,0.4)"
                            }}
                            tickLine={{
                                stroke: "rgba(255,255,255,0.4)"
                            }}
                        />


                        {/* TOOLTIP */}

                        <Tooltip
                            contentStyle={{
                                backgroundColor: "#071b2d",
                                border: "1px solid #38bdf8",
                                borderRadius: "10px",
                                color: "#ffffff"
                            }}
                            itemStyle={{
                                color: "#ffffff"
                            }}
                            labelStyle={{
                                color: "#ffffff"
                            }}
                        />


                        {/* BARS */}

                        <Bar
                            dataKey="count"
                            name="Reports"
                            radius={[8, 8, 0, 0]}
                        >

                            {data.map((entry, index) => (

                                <Cell
                                    key={`cell-${index}`}
                                    fill={entry.color}
                                />

                            ))}

                        </Bar>

                    </BarChart>

                </ResponsiveContainer>

            </div>

        </div>
    );
};

export default SeverityChart;