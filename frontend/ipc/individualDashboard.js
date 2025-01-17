// individualDashboard.js
const { ipcMain, shell } = require("electron");
const log = require("electron-log");
const db = require("../db/db");
const {eq} = require("drizzle-orm");
const { transactions } = require("../db/schema/Transactions");

function setupTransactionIPC() {

  ipcMain.handle("get-transactions-by-emi", async () => {
    // log.info("Handler for 'get-transactions-by-emi' registered.");
    try {
      const result = await db.select()
        .from(transactions)
        .where(eq(transactions.category, "Probable EMI")); // Add the WHERE clause here
      log.info(" 'Probable emi' transactions fetched successfully:", result);
      return result;
    } catch (error) {
    console.log("Error fetching transactions");
      log.error("Error fetching 'Probable emi' transactions :", error);
      throw error;
    }
  });

  ipcMain.handle("get-transactions-by-investment", async () => {
    // log.info("Handler for 'get-transactions-by-emi' registered.");
    try {
      const result = await db.select()
        .from(transactions)
        .where(eq(transactions.category, "Investment")); // Add the WHERE clause here
      log.info("Transactions with category 'Investment' fetched successfully:", result);
      return result;
    } catch (error) {
    console.log("Error fetching transactions");
      log.error("Error fetching transactions with category 'Investment':", error);
      throw error;
    }
  });

  ipcMain.handle("get-transactions-by-reversal", async () => {
    // log.info("Handler for 'get-transactions-by-emi' registered.");
    try {
      const result = await db.select()
        .from(transactions)
        .where(eq(transactions.category, "Refund/Reversal")); // Add the WHERE clause here
      log.info("Transactions with category 'Reversal' fetched successfully:", result.length);
      return result;
    } catch (error) {
    console.log("Error fetching transactions");
      log.error("Error fetching transactions with category 'Reversal':", error);
      throw error;
    }
  });



}

module.exports = { setupTransactionIPC };
