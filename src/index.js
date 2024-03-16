const express = require("express");
const { printBill, printerInfo, printKot } = require("./print");
const cors = require("cors");
const app = express();

app.use(express.json());
app.use(cors());

app.post("/print/bill", (req, res) => {
  const printCustomerCopy = req.body.printCustomerCopy;
  const paid = req.body.isPaid;
  if (paid) {
    printBill(
      req.body.visibleId,
      req.body.openedAt,
      req.body.items,
      req.body.total,
      req.body.tendered,
      req.body.balance
    );
    if (printCustomerCopy) {
      printBill(
        req.body.visibleId,
        req.body.openedAt,
        req.body.items,
        req.body.total,
        req.body.tendered,
        req.body.balance,
        true
      );
    }
  } else {
    printBill(
      req.body.visibleId,
      req.body.openedAt,
      req.body.items,
      req.body.total,
      null,
      null,
      false
    );
    if (printCustomerCopy) {
      printBill(
        req.body.visibleId,
        req.body.openedAt,
        req.body.items,
        req.body.total,
        null,
        null,
        true
      );
    }
  }

  res.send("OK");
});

app.post("/print/kot", (req, res) => {
  printKot(
    req.body.kot.billId,
    req.body.kot.id,
    req.body.kot.kotItems,
    req.body.kot.issuedAt
  );
  res.send("OK");
});
app.get("/health", (req, res) => {
  res.send(printerInfo());
});

app.listen(9000,()=>{
  console.log("print server running")
});
