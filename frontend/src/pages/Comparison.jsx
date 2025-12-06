import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { compareRfp } from "../services/api";

export default function Comparison() {
    const { rfp_id } = useParams();
    const [data, setData] = useState(null);

    useEffect(() => {
        compareRfp(rfp_id).then((res) => setData(res.data));
    }, []);

    if (!data) return <p className="p-10">Loading...</p>;

    return (
        <div className="p-10">
            <h2 className="text-2xl font-bold mb-6">
                Comparison Result for RFP: {rfp_id}
            </h2>

            <h3 className="font-semibold mb-4">AI Summary</h3>
            <div className="bg-yellow-100 border-l-4 border-yellow-500 p-4 mb-6">
                <p>{data.ai_summary}</p>
            </div>

            <h3 className="font-semibold mb-4">Vendor Scores</h3>
            <pre className="bg-gray-100 p-4 rounded">
                {JSON.stringify(data.proposals, null, 2)}
            </pre>

            <h3 className="font-semibold mt-6 mb-2">Recommended Vendor</h3>
            <pre className="bg-green-100 p-4 rounded">
                {JSON.stringify(data.recommendation, null, 2)}
            </pre>
        </div>
    );
}
