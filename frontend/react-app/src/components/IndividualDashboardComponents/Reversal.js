import React, {useState, useEffect} from "react";
import DataTable from "./TableData";
import refundData from "../../data/refund.json";
import SingleBarChart from "../charts/BarChart";

const Reversal = () => {
    const [data, setData] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
    const fetchData = async () => {
        try {  
        setLoading(true);
        // Fetch transactions filtered by "debtor"
        const result = await window.electron.getTransactionsByReversal();
        console.log("refund transactions:", result);
        // Transform data to include only required fields
        const transformedData = result.map((item) => ({
            date: new Date(item.date).toLocaleDateString("en-GB", {
            day: "2-digit",
            month: "2-digit",
            year: "numeric",
            }),
            description: item.description,
            credit: item.amount,
            category: item.category,
            balance: item.balance,
        }));
        setData(transformedData);
        } catch (error) {
        console.error("Error fetching emi transactions:", error);
        } finally {
        setLoading(false);
        }
    };

    fetchData();
    }, []);

    if (loading) {
    return (
        <div className="bg-gray-100 p-4 rounded-md w-full h-[10vh]">
        <p className="text-gray-800 text-center mt-3 font-medium text-lg">
            Loading...
        </p>
        </div>
    );
    }

  return (
    <div className="rounded-lg m-8 mt-2 space-y-6">
      {data.length === 0 ? (
        <div className="bg-gray-100 p-4 rounded-md w-full h-[10vh]">
          <p className="text-gray-800 text-center mt-3 font-medium text-lg">
            No Data Available
          </p>
        </div>
      ) : (
        <>
          <div className="w-full h-[60vh]">
            <SingleBarChart
              title="Refund/Reversal"
              data={data}
              xAxisKey="date"
              selectedColumns={["credit"]}
            />
          </div>
          <div>
            <DataTable data={data} />
          </div>
        </>
      )}
    </div>
  );
};

export default Reversal;
