import {
    PieChart,
    Pie,
    Cell,
    Tooltip,
    Legend,
    ResponsiveContainer
} from "recharts";

const StatusChart = ({ stats }) => {

    if (!stats) {
        return (
            <div className="smart-glass rounded-2xl shadow-lg p-6">
                <h2 className="text-xl font-bold text-white">
                    📊 Report Status
                </h2>

                <p className="text-gray-300 mt-2">
                    Loading status chart...
                </p>
            </div>
        );
    }

    const data = [
        {
            name: "Pending",
            value: stats.pending || 0,
            color: "#f59e0b"
        },
        {
            name: "Verified",
            value: stats.verified || 0,
            color: "#a855f7"
        },
        {
            name: "In Progress",
            value: stats.in_progress || 0,
            color: "#3b82f6"
        },
        {
            name: "Completed",
            value: stats.completed || 0,
            color: "#22c55e"
        }
    ];

    return (

        <div className="smart-glass rounded-2xl shadow-xl p-6">

            {/* TITLE */}

            <h2 className="text-xl font-bold text-white mb-4">
                📊 Report Status
            </h2>


            {/* CHART */}

            <div className="w-full h-[320px]">

                <ResponsiveContainer
                    width="100%"
                    height="100%"
                >

                    <PieChart>

                        <Pie
                            data={data}
                            dataKey="value"
                            nameKey="name"
                            cx="50%"
                            cy="45%"
                            outerRadius={105}
                            label={({ value }) => value}
                            labelLine={{
                                stroke: "rgba(255,255,255,0.5)"
                            }}
                        >

                            {data.map((entry, index) => (

                                <Cell
                                    key={`cell-${index}`}
                                    fill={entry.color}
                                    stroke="#0b2238"
                                    strokeWidth={2}
                                />

                            ))}

                        </Pie>


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


                        {/* LEGEND */}

                        <Legend
                            verticalAlign="bottom"
                            height={36}
                            iconType="circle"
                            wrapperStyle={{
                                color: "#ffffff",
                                fontSize: "14px"
                            }}
                        />

                    </PieChart>

                </ResponsiveContainer>

            </div>

        </div>
    );
};

export default StatusChart;