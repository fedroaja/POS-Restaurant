require("dotenv").config();

const { response } = require("express");
const express = require("express");
const router = express.Router();
const connection = require("../utils/connection");

function isExistsTable(codeField, codeValue, table) {
  sql =
    "select 1 from " +
    table +
    " where " +
    codeField +
    " = '" +
    codeValue +
    "' and fgActive = 'Y' and fgStatus = 'A'";

  return new Promise((resolve, reject) => {
    connection.query(sql, function (error, results, field) {
      if (error) {
        return reject(error);
      } else {
        if (results.length > 0) {
          resolve(true);
        }
        resolve(false);
      }
    });
  });
}

function isExists(codeField, codeValue, table) {
  sql =
    "select 1 from " + table + " where " + codeField + " = '" + codeValue + "'";

  return new Promise((resolve, reject) => {
    connection.query(sql, function (error, results, field) {
      if (error) {
        return reject(error);
      } else {
        if (results.length > 0) {
          resolve(true);
        }
        resolve(false);
      }
    });
  });
}

function getInvoiceCode(date) {
  let invCode = "INV/" + date + "/";
  sql = `SELECT SUBSTRING_INDEX(invoice_code, '/', -1) as numindex
    from invoice 
    where DATE(trans_date) = CURDATE()
    order by invoice_code desc
    LIMIT 1`;

  return new Promise((resolve, reject) => {
    connection.query(sql, function (error, results, field) {
      if (error) {
        return reject(error);
      } else {
        if (results.length > 0) {
          let num = parseInt(results[0].numindex);
          num++;
          resolve(invCode + num.toString());
        }
        resolve(invCode + "1");
      }
    });
  });
}

router.get("/product", (req, res) => {
  if (!req.session.loggedin && !req.session.role != 1)
    return res.send({ ECode: 20, EMsg: "Session Expired" });
  sql = `
              select product_id id,product_code,product_name,ctg_id, ctg_name,product_price,
                     DATE_FORMAT(product.upddate,'%d/%m/%Y') as upddate, fgActive active, delivery_time, 
                     img_url, 0 as selected, 0 as product_qty, '' as note, product_price as trans_amount
              from product
              inner join product_ctg on product_ctg.ctg_id = product.product_ctg
              where fgActive = 'Y'
              order by product_code
            `;
  sql2 = `
              Select ctg_id, ctg_code, ctg_name, DATE_FORMAT(upddate,'%d/%m/%Y') upddate
              From product_ctg
              order by ctg_code
             `;

  sql3 = `
  select invoice.invoice_id,table_name, table_code, invoice_code, delivery_time, fgStatus, sum(invoice_dt.trans_qty) total_item, invoice.upddate
             from invoice
             inner join invoice_dt on invoice_dt.invoice_id = invoice.invoice_id
             where DATE(trans_date) = CURDATE() and fgStatus <> 'D'
             group by invoice.invoice_code
             order by FIELD(fgStatus,"O","A","P"), case when fgStatus = 'A' THEN invoice.upddate + INTERVAL delivery_time minute 
             else invoice_code end
           `;

  let defaultCtg = {
    ctg_id: 0,
    ctg_code: "semua",
    ctg_name: "Semua",
    upddate: new Date(),
  };

  connection.query(sql, function (err, result, fields) {
    if (err) throw err;

    connection.query(sql2, function (err2, result2, fields2) {
      if (err2) throw err2;

      connection.query(sql3, function (err3, result3, field3) {
        if (err3) throw err3;

        let myCtg = [defaultCtg, ...result2];
        res.send({ product: result, category: myCtg, invoice: result3 });
        res.end;
      });
    });
  });
});

router.get("/table", (req, res) => {
  if (!req.session.loggedin && !req.session.role != 1)
    return res.send({ ECode: 20, EMsg: "Session Expired" });
  sql = `
			select table_id,table_code,table_name, DATE_FORMAT(upddate,'%d/%m/%Y') as upddate, fgStatus, fgActive, 
        case when fgActive = 'N' then '#717171'
             when fgStatus = 'N' then '#ff3131'
             else '#0068f3'
        end as color
			from table_place
      order by table_code

		  `;
  connection.query(sql, function (err, result, fields) {
    if (err) throw err;

    res.send({ table: result });
    res.end;
  });
});

router.post("/addorder", async (req, res) => {
  if (!req.session.loggedin && !req.session.role != 1)
    return res.send({ ECode: 20, EMsg: "Session Expired" });

  const validTable = await isExistsTable(
    "table_code",
    req.body.invoiceHd.tableCode,
    "table_place"
  );
  if (!validTable)
    return res.send({
      ECode: 10,
      EMsg: "Error When Selecting Table, Please Try Again",
    });

  const upddate = new Date();
  const updby = req.session.username;
  const date = upddate
    .toLocaleString("en-GB")
    .slice(0, 10)
    .split("/")
    .reverse()
    .join("");

  const invoice_code = await getInvoiceCode(date);
  const table_code = req.body.invoiceHd.tableCode;
  const table_name = req.body.invoiceHd.tableName;
  const total_price = req.body.invoiceHd.totalPrice;
  const payment_method = req.body.invoiceHd.paymentMethod;
  const delivery_time = req.body.invoiceHd.deliveryTime;
  const fgStatus = req.body.invoiceHd.fgStatus;

  sql = `INSERT INTO invoice (invoice_code, table_name, total_price, payment_method, fgStatus, trans_date, upddate, updby, delivery_time, table_code)
  values(?,?,?,?,?,?,?,?,?,?)`;

  sql2 = `INSERT INTO invoice_dt (invoice_id, product_name, trans_qty, trans_amount, notes, upddate, updby)
  values ?`;

  sql3 = `update table_place set fgStatus = 'N' where table_code = ?`;

  sql4 = `select invoice.invoice_id,table_code,table_name, invoice_code, delivery_time, fgStatus, sum(invoice_dt.trans_qty) total_item, invoice.upddate
  from invoice
  inner join invoice_dt on invoice_dt.invoice_id = invoice.invoice_id
  where DATE(trans_date) = CURDATE() and fgStatus <> 'D'
  group by invoice.invoice_code
  order by FIELD(fgStatus,"O","A","P"), case when fgStatus = 'A' THEN invoice.upddate + INTERVAL delivery_time minute 
  else invoice_code end
 
      `;

  connection.beginTransaction();
  connection.query(
    sql,
    [
      invoice_code,
      table_name,
      total_price,
      payment_method,
      fgStatus,
      upddate,
      upddate,
      updby,
      delivery_time,
      table_code,
    ],
    function (err, result, field) {
      if (err) {
        connection.rollback();
        if (err) throw err;
      }

      const invoiceDt = req.body.invoiceDt.map((item) => [
        result.insertId,
        item.product_name,
        item.product_qty,
        item.trans_amount,
        item.note,
        upddate,
        req.session.username,
      ]);

      connection.query(sql2, [invoiceDt], function (err2, result2, field2) {
        if (err2) {
          connection.rollback();
          throw err2;
        }

        connection.query(
          sql3,
          [req.body.invoiceHd.tableCode],
          function (err3, result3, field3) {
            if (err3) {
              connection.rollback();
              throw err3;
            }

            connection.query(sql4, function (err4, result4, field4) {
              if (err4) {
                connection.rollback();
                throw err4;
              }
              connection.commit();
              res.send({ invoice: result4, ECode: 0 });
              res.end;
            });
          }
        );
      });
    }
  );
});

router.get("/orderslist", (req, res) => {
  if (!req.session.loggedin && !req.session.role != 1)
    return res.send({ ECode: 20, EMsg: "Session Expired" });

  sql1 = `
  select invoice.invoice_id,table_code,table_name, invoice_code, delivery_time, fgStatus, sum(invoice_dt.trans_qty) total_item,invoice.upddate
             from invoice
             inner join invoice_dt on invoice_dt.invoice_id = invoice.invoice_id
             where DATE(trans_date) = CURDATE() and fgStatus <> 'D'
             group by invoice.invoice_code
             order by FIELD(fgStatus, "A", "O","P"), case when fgStatus = 'A' THEN invoice.upddate + INTERVAL delivery_time minute 
             else invoice_code end
           `;

  connection.query(sql1, function (err, result, field) {
    if (err) throw err;

    res.send({ ECode: 0, invoice: result });
    res.end;
  });
});

router.post("/updateorder", async (req, res) => {
  if (!req.session.loggedin && !req.session.role != 1)
    return res.send({ ECode: 20, EMsg: "Session Expired" });

  const upddate = new Date();
  const updby = req.session.username;

  const fgStatus = req.body.status;
  const invoiceId = req.body.invoice_id;
  const tableCode = req.body.table_code;

  sql1 = `UPDATE invoice set fgStatus = ?, upddate = ?, updby = ? where invoice_id = ?`;

  sql2 = `
  update table_place set fgStatus = 'A', upddate = ?, updby = ? 
  where table_code = ? and EXISTS(select 1 from invoice where invoice_id = ? and fgStatus = 'D')
  `;

  sql3 = `
  select invoice.invoice_id,table_code,table_name, invoice_code, delivery_time, fgStatus, sum(invoice_dt.trans_qty) total_item, invoice.upddate
             from invoice
             inner join invoice_dt on invoice_dt.invoice_id = invoice.invoice_id
             where DATE(trans_date) = CURDATE() and fgStatus <> 'D'
             group by invoice.invoice_code
             order by FIELD(fgStatus,"O","A","P"), case when fgStatus = 'A' THEN invoice.upddate + INTERVAL delivery_time minute 
             else invoice_code end
           `;

  connection.beginTransaction();
  connection.query(
    sql1,
    [fgStatus, upddate, updby, invoiceId],
    function (err, result, field) {
      if (err) {
        connection.rollback();
        if (err) throw err;
      }

      connection.query(
        sql2,
        [upddate, updby, tableCode, invoiceId],
        function (err2, result2, field2) {
          if (err2) {
            connection.rollback();
            throw err2;
          }

          connection.query(sql3, function (err3, result3, field3) {
            if (err3) {
              connection.rollback();
              throw err3;
            }
            connection.commit();
            res.send({ invoice: result3, ECode: 0 });
            res.end;
          });
        }
      );
    }
  );
});

module.exports = router;
