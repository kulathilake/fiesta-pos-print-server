const escpos = require("escpos");
// install escpos-usb adapter module manually
escpos.USB = require("./escpos-usb");  
const path = require("path");
const { formatNumberToCurrency } = require("./currency.util");

function init() {
  // Select the adapter based on your printer type
  const device = new escpos.USB();
  const options = { encoding: "utf8" /* default */ };
  // encoding is optional
  const printer = new escpos.Printer(device, options);
  return { device, printer };
}

module.exports.printBill = function printBill(
  invoiceId,
  date,
  items = [],
  total,
  tendered,
  balance,
  customerCopy = false
) {
  try {
    const { device, printer } = init();
    escpos.Image.load(path.join(__dirname, "fiesta.png"), (image, error) => {
      device.open(async function (error) {
        await printer
          .font("B")
          .align("ct")
          .style("NORMAL")
          .size(1, 1)
          .image(image, "D24");
        if (customerCopy) {
          printer.text("Customer Copy");
        }
        printer
          .text("Fiesta Urban Cuisine")
          .size(0.5, 0.5)
          .drawLine()
          .style("B")
          .text(date)
          .text(`#${invoiceId}`)
          .size(0.5, 0.5)
          .font("A");
        items.forEach(({ qty, item }) => {
          printer.tableCustom(
            [
              { text: item.name, align: "LEFT", width: 0.5 },
              { text: qty, align: "LEFT", width: 0.1 },
              {
                text: formatNumberToCurrency(item.price),
                align: "RIGHT",
                width: 0.2,
              },
              {
                text: formatNumberToCurrency(item.price * qty),
                align: "RIGHT",
                width: 0.2,
              },
            ],
            { encoding: "cp857", size: [1, 1] }
          );
        });
        printer
          .feed(2)
          .style("B")
          .size(1, 1)
          .text(`TOTAL: ${formatNumberToCurrency(total)}`);
        if (tendered) {
          printer.text(`Tendered: ${formatNumberToCurrency(tendered)}`);
        }
        if (balance) {
          printer.text(`TOTAL: ${formatNumberToCurrency(balance)}`);
        }
        printer
          .size(0.5, 0.5)
          .drawLine()
          .text("Fiesta Urban Cuisine")
          .text("Negombo Road Kurunegala")
          .text("0772008505");
        printer.feed(2).cut(true).close();
      });
    });
  } catch (error) {
    throw error;
  }
};

module.exports.printKot = function printKot(
  invoiceId,
  kotId,
  items = [],
  issuedAt
) {
  const { device, printer } = init();
  device.open(async function (error) {
    if (error) {
      console.error(error);
    } else {
      await printer
        .font("B")
        .align("ct")
        .style("NORMAL")
        .size(1, 1)
        .text("Kitchen Order Ticket")
        .text("KOT: " + kotId)
        .size(0.5, 0.5)
        .text(`Invoice Id: ${invoiceId}`)
        .text("Issued at: " + issuedAt)
        .drawLine()
        .font("A")
        .size(1, 1);
      items.forEach(({ billItem, qty }) => {
        printer.tableCustom(
          [
            { text: billItem.item.name, align: "LEFT", width: 0.5 },
            { text: qty, align: "LEFT", width: 0.1 },
          ],
          { encoding: "cp857", size: [1, 1] }
        );
      });
      printer.size(0.5, 0.5).drawLine().text("Fiesta Urban Cuisine");
      printer.feed(2).cut(true).close();
    }
  });
};

module.exports.printerInfo = function getPrinterInfo() {
  try {
    return init()
  } catch (error) {
    console.log("error initializing printer")
    return error.message;
  }
};
