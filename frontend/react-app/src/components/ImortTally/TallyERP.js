import React from "react";
import { AiFillFileExcel } from "react-icons/ai"; // Install react-icons using npm install react-icons

function ExcelERP() {

  const handleOpenFile = async (filePath) => {
    console.log('filePath', filePath);
    try {
      const response = await window.electron.openFile(filePath);
      if (response.error) {
        throw new Error(response.error); // If there's an error, throw it
      }
      console.log('File opened successfully:', response);
    } catch (error) {
      console.error(error);
    }
  };

  const files = [
    { label: "Ledgers Voucher", path: "tallyerp/Ledgers Voucher Final.xlsm" },
    { label: "PaymentERP Voucher", path: "tallyerp/Payment Voucher ERP.xlsm" },
    { label: "ReceiptERP Voucher", path: "tallyerp/Receipt Voucher ERP.xlsm" },
    { label: "Purchase Voucher", path: "tallyerp/Purchase Voucher.xlsm" },
    { label: "Sale Voucher", path: "tallyerp/Sale Voucher final.xlsm" },
  ];

  return (
    <div
      style={{
        textAlign: "center",
        marginTop: "50px",
        padding: "20px",
        fontFamily: "'Poppins', sans-serif",
        minHeight: "100vh",
      }}
    >
      <h1
        style={{
          marginBottom: "30px",
          color: "#1E3A8A",
          fontSize: "2.5rem",
          fontWeight: "700",
        }}
      >

      </h1>
      <div
        style={{
          display: "grid",
          gridTemplateColumns: "repeat(auto-fit, minmax(300px, 1fr))",
          gap: "20px",
          padding: "20px",
        }}
      >
        {files.map((file, index) => (
          <div
            key={index}
            onClick={() => handleOpenFile(file.path)}
            style={{
              padding: "30px",
              textAlign: "center",
              backgroundColor: "#FFFFFF",
              borderRadius: "15px",
              boxShadow: "0px 4px 8px rgba(0, 0, 0, 0.1)",
              cursor: "pointer",
              transition: "transform 0.3s ease, box-shadow 0.3s ease",
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
            }}
            onMouseOver={(e) => {
              e.currentTarget.style.transform = "translateY(-5px)";
              e.currentTarget.style.boxShadow = "0px 8px 16px rgba(0, 0, 0, 0.15)";
            }}
            onMouseOut={(e) => {
              e.currentTarget.style.transform = "translateY(0)";
              e.currentTarget.style.boxShadow = "0px 4px 8px rgba(0, 0, 0, 0.1)";
            }}
          >
            <AiFillFileExcel size={60} color="#22C55E" />
            <h3
              style={{
                margin: "20px 0 10px",
                fontSize: "1.5rem",
                fontWeight: "600",
                color: "#111827",
              }}
            >
              {file.label}
            </h3>
            <p
              style={{
                fontSize: "0.9rem",
                color: "#6B7280",
              }}
            >
              Click to open this file
            </p>
          </div>
        ))}
      </div>
    </div>
  );
}

export default ExcelERP;
