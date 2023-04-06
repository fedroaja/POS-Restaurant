require("dotenv").config();

const { response } = require("express");
const express = require("express");
const router = express.Router();
const connection = require("../utils/connection");

const bcrypt = require("bcrypt");
const saltRounds = 10;

var sql, sql1, sql2, sql3;

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

router.get("/dashboard", (req, res) => {
  if (!req.session.loggedin && !req.session.role != 0)
    return res.send({ ECode: 20, EMsg: "Session Expired" });

  sql = `
				SELECT invoice.invoice_id,invoice.invoice_code,invoice.upddate,
					   trans_id, product_name, trans_qty, trans_amount
				FROM invoice
				LEFT OUTER JOIN invoice_dt on invoice_dt.invoice_id = invoice.invoice_id
				Where invoice.upddate > date_sub( now(), interval 2 day) and fgStatus = 'D'
				ORDER BY invoice.upddate DESC
			`;
  sql1 = `
        SELECT totalEarning
        FROM (SELECT SUM(trans_amount) AS totalEarning, 
              DATE_FORMAT(invoice.upddate, "%m") AS date 
          FROM invoice 
                      left outer join invoice_dt on invoice_dt.invoice_id = invoice.invoice_id and invoice.fgStatus = 'D'
          WHERE YEAR(invoice.upddate) = YEAR(now())
          GROUP BY DATE_FORMAT(invoice.upddate, "%m")
        
          UNION
        
          SELECT 0    AS totalEarning, 
              month AS date
          FROM quantum_default_months) as Q
        GROUP BY date
			`;
  sql2 = `
      select sum(invoice_dt.trans_amount) total
      from invoice
            left outer join invoice_dt on invoice_dt.invoice_id = invoice.invoice_id and invoice.fgStatus = 'D'
      where YEAR(invoice.upddate) = YEAR(now())

			UNION ALL

			select Count(product_id) total
			from product

			UNION ALL

			select Count(table_id) total
			from table_place

			`;
  sql3 = `select sum(invoice_dt.trans_amount) total
  from invoice
        left outer join invoice_dt on invoice_dt.invoice_id = invoice.invoice_id and invoice.fgStatus = 'D'
  where YEAR(invoice.upddate) = YEAR(now()) - 1`;
  // var sql2 = `
  // 			select t1.totalProduct
  // 			from (
  // 				SELECT DATE(upddate) as DATE, COUNT(product_id) totalProduct
  // 						FROM product
  // 						where upddate > date_sub( now(), interval 7 day)
  // 						GROUP BY  DATE(upddate)
  // 						ORDER BY DATE(upddate)
  // 			) t1
  // 			`;

  connection.query(sql, function (error, result, fields) {
    if (error) throw error;

    connection.query(sql1, function (error1, result1, fields1) {
      if (error1) throw error1;

      connection.query(sql2, function (error2, result2, fields2) {
        if (error2) throw error2;

        connection.query(sql3, function (error3, result3, field3) {
          if (error3) throw error3;
          let curr = result2[0].total;
          let prev = result3[0].total;
          let resPercent = !prev ? 100 : (100 * (curr - prev)) / prev;
          resPercent = resPercent.toFixed(2);
          res.send({
            hist: result,
            earning: result1,
            summary: result2,
            percentage: resPercent,
          });
          res.end;
        });
      });
    });
  });
});

router.get("/product", (req, res) => {
  if (!req.session.loggedin && !req.session.role != 0)
    return res.send({ ECode: 20, EMsg: "Session Expired" });
  sql = `
			select product_id id,product_code,product_name,ctg_id, ctg_name,FORMAT(product_price,'id_ID') as product_price,
				   DATE_FORMAT(product.upddate,'%d/%m/%Y') as upddate, fgActive active, delivery_time, img_url
			from product
			inner join product_ctg on product_ctg.ctg_id = product.product_ctg
      order by product_code
		  `;
  sql2 = `
			Select ctg_id, ctg_code, ctg_name, DATE_FORMAT(upddate,'%d/%m/%Y') upddate
			From product_ctg
      order by ctg_code
		   `;
  connection.query(sql, function (err, result, fields) {
    if (err) throw err;

    connection.query(sql2, function (err2, result2, fields2) {
      if (err2) throw err;

      res.send({ product: result, category: result2 });
      res.end;
    });
  });
});

router.post("/addproduct", async (req, res) => {
  if (!req.session.loggedin && !req.session.role != 0)
    return res.send({ ECode: 20, EMsg: "Session Expired" });

  let product_id = req.body.productId;
  let product_code = req.body.productCode;
  let product_name = req.body.productName;
  let product_ctg = req.body.productCtg;
  let product_price = req.body.productPrice;
  let delivery_time = req.body.deliveryTime;
  let img_url = req.body.imgUrl;
  let product_active = req.body.productActive ? "Y" : "N";
  let fgMode = req.body.fgMode;

  const validProdCode = await isExists("product_code", product_code, "product");
  const validProdCtg = await isExists("ctg_id", product_ctg, "product_ctg");
  const upddate = new Date();

  sql2 = `
  select product_id id,product_code,product_name,ctg_id,ctg_name,FORMAT(product_price,'id_ID') as product_price,
         DATE_FORMAT(product.upddate,'%d/%m/%Y') as upddate, fgActive active, delivery_time, img_url
    from product
    inner join product_ctg on product_ctg.ctg_id = product.product_ctg
    order by product_code
  `;

  if (fgMode == "I") {
    if (validProdCode)
      return res.send({ ECode: 10, EMsg: "Product Code Already Exists" });
    if (!validProdCtg)
      return res.send({ ECode: 10, EMsg: "Category Not Found" });

    sql = `
    INSERT INTO product(product_code, product_name, product_ctg, product_price, fgActive, upddate, updby, delivery_time, img_url)
    VALUES (?,?,?,?,?,?,?,?,?)
    `;
    connection.query(
      sql,
      [
        product_code,
        product_name,
        product_ctg,
        product_price,
        product_active,
        upddate,
        req.session.username,
        delivery_time,
        img_url,
      ],
      function (err, results, fields) {
        if (err) throw err;

        connection.query(sql2, function (err2, results2, fields2) {
          if (err2) throw err2;
          res.send({ product: results2, ECode: 0 });
          res.end;
        });
      }
    );
  } else if (fgMode == "E") {
    if (!validProdCode)
      return res.send({ ECode: 10, EMsg: "Product Code Not Found" });
    if (!validProdCtg)
      return res.send({ ECode: 10, EMsg: "Category Not Found" });

    sql = `
      update product
      set product_name = ?, product_ctg = ?, product_price = ?, fgActive = ?, upddate = ?, updby = ?, delivery_time = ?, img_url = ?
      where product_id = ?
      `;
    connection.query(
      sql,
      [
        product_name,
        product_ctg,
        product_price,
        product_active,
        upddate,
        req.session.username,
        delivery_time,
        img_url,
        product_id,
      ],
      function (err, result, field) {
        if (err) throw err;
        connection.query(sql2, function (err2, results2, fields2) {
          if (err2) throw err2;
          res.send({ product: results2, ECode: 0 });
          res.end;
        });
      }
    );
  }
});

router.delete("/product_delete", async (req, res) => {
  if (!req.session.loggedin && !req.session.role != 0)
    return res.send({ ECode: 20, EMsg: "Session Expired" });

  let productId = req.body.productId;

  sql = `delete from product where product_id in (?)`;
  connection.query(sql, [productId], function (err, result, field) {
    if (err) throw err;
    res.send({ ECode: 0 });
    res.end;
  });
});

router.delete("/ctg_delete", async (req, res) => {
  if (!req.session.loggedin && !req.session.role != 0)
    return res.send({ ECode: 20, EMsg: "Session Expired" });

  let ctgId = req.body.ctgId;

  sql = `delete from product_ctg where ctg_id in (?)`;
  connection.query(sql, [ctgId], function (err, result, field) {
    if (err) throw err;
    res.send({ ECode: 0 });
    res.end;
  });
});

router.post("/addctg", async (req, res) => {
  if (!req.session.loggedin && !req.session.role != 0)
    return res.send({ ECode: 20, EMsg: "Session Expired" });

  let ctg_id = req.body.ctg_id;
  let ctg_code = req.body.ctg_code;
  let ctg_name = req.body.ctg_name;
  let fgMode = req.body.fgMode;
  const upddate = new Date();

  const validProdCtg = await isExists("ctg_code", ctg_code, "product_ctg");

  sql2 = `
  Select ctg_id, ctg_code, ctg_name, DATE_FORMAT(upddate,'%d/%m/%Y') upddate
			From product_ctg
      order by ctg_code
  `;

  if (fgMode == "I") {
    if (validProdCtg)
      return res.send({ ECode: 10, EMsg: "Category Code Already Exists" });

    sql = `
    INSERT INTO product_ctg(ctg_code, ctg_name, upddate, updby)
    VALUES (?,?,?,?)
    `;
    connection.query(
      sql,
      [ctg_code, ctg_name, upddate, req.session.username],
      function (err, results, fields) {
        if (err) throw err;

        connection.query(sql2, function (err2, results2, fields2) {
          if (err2) throw err2;
          res.send({ category: results2, ECode: 0 });
          res.end;
        });
      }
    );
  } else if (fgMode == "E") {
    if (!validProdCtg)
      return res.send({ ECode: 10, EMsg: "Category Not Found" });

    sql = `
      update product_ctg
      set ctg_name = ?, upddate = ?, updby = ?
      where ctg_id = ?
      `;
    connection.query(
      sql,
      [ctg_name, upddate, req.session.username, ctg_id],
      function (err, result, field) {
        if (err) throw err;
        connection.query(sql2, function (err2, results2, fields2) {
          if (err2) throw err2;
          res.send({ category: results2, ECode: 0 });
          res.end;
        });
      }
    );
  }
});

router.get("/table", (req, res) => {
  if (!req.session.loggedin && !req.session.role != 0)
    return res.send({ ECode: 20, EMsg: "Session Expired" });
  sql = `
			select table_id,table_code,table_name, DATE_FORMAT(upddate,'%d/%m/%Y') as upddate, fgActive active
			from table_place
      order by table_code
		  `;
  connection.query(sql, function (err, result, fields) {
    if (err) throw err;

    res.send({ table: result });
    res.end;
  });
});

router.post("/addtable", async (req, res) => {
  if (!req.session.loggedin && !req.session.role != 0)
    return res.send({ ECode: 20, EMsg: "Session Expired" });

  let table_id = req.body.tableId;
  let table_code = req.body.tableCode;
  let table_name = req.body.tableName;
  let table_active = req.body.tableActive ? "Y" : "N";
  let fgMode = req.body.fgMode;

  const validTableCode = await isExists(
    "table_code",
    table_code,
    "table_place"
  );
  const upddate = new Date();

  sql2 = `
  select table_id,table_code,table_name, DATE_FORMAT(upddate,'%d/%m/%Y') as upddate, fgActive active
			from table_place
      order by table_code
  `;

  if (fgMode == "I") {
    if (validTableCode)
      return res.send({ ECode: 10, EMsg: "Product Code Already Exists" });

    sql = `
    INSERT INTO table_place(table_code, table_name, fgActive, upddate, updby)
    VALUES (?,?,?,?,?)
    `;
    connection.query(
      sql,
      [table_code, table_name, table_active, upddate, req.session.username],
      function (err, results, fields) {
        if (err) throw err;

        connection.query(sql2, function (err2, results2, fields2) {
          if (err2) throw err2;
          res.send({ table: results2, ECode: 0 });
          res.end;
        });
      }
    );
  } else if (fgMode == "E") {
    if (!validTableCode)
      return res.send({ ECode: 10, EMsg: "Table Code Not Found" });

    sql = `
      update table_place
      set table_name = ?, fgActive = ?, upddate = ?, updby = ?
      where table_id = ?
      `;
    connection.query(
      sql,
      [table_name, table_active, upddate, req.session.username, table_id],
      function (err, result, field) {
        if (err) throw err;
        connection.query(sql2, function (err2, results2, fields2) {
          if (err2) throw err2;
          res.send({ table: results2, ECode: 0 });
          res.end;
        });
      }
    );
  }
});

router.delete("/table_delete", async (req, res) => {
  if (!req.session.loggedin && !req.session.role != 0)
    return res.send({ ECode: 20, EMsg: "Session Expired" });

  let tableId = req.body.tableId;

  sql = `delete from table_place where table_id in (?)`;
  connection.query(sql, [tableId], function (err, result, field) {
    if (err) throw err;
    res.send({ ECode: 0 });
    res.end;
  });
});

router.get("/transaction", (req, res) => {
  if (!req.session.loggedin && !req.session.role != 0)
    return res.send({ ECode: 20, EMsg: "Session Expired" });
  sql = `
			select invoice_id,invoice_code,table_name, DATE_FORMAT(upddate,'%d/%m/%Y') as upddate,  
      DATE_FORMAT(trans_date,'%d/%m/%Y') as trans_date ,fgStatus status
			from invoice
      order by upddate
		  `;
  sql2 = `
			select trans_id,invoice_id,product_name,
      trans_qty, trans_amount, DATE_FORMAT(upddate,'%d/%m/%Y') as upddate, notes
			from invoice_dt
		  `;
  connection.query(sql, function (err, result, fields) {
    if (err) throw err;

    connection.query(sql2, function (err2, result2, fields2) {
      if (err2) throw err;
      res.send({ invoice: result, invoiceDt: result2 });
      res.end;
    });
  });
});

router.get("/user", (req, res) => {
  if (!req.session.loggedin && !req.session.role != 0)
    return res.send({ ECode: 20, EMsg: "Session Expired" });
  sql = `
			select ID,USERNAME,ROLE,DATE_FORMAT(createdate,'%d/%m/%Y') as createdate, NICKNAME,
      DATE_FORMAT(upddate,'%d/%m/%Y') as upddate
			from user
      order by ROLE
		  `;
  connection.query(sql, function (err, result, fields) {
    if (err) throw err;

    res.send({ user: result });
    res.end;
  });
});

router.post("/adduser", async (req, res) => {
  if (!req.session.loggedin && !req.session.role != 0)
    return res.send({ ECode: 20, EMsg: "Session Expired" });
  let userId = req.body.userId;
  let username = req.body.username;
  let password = req.body.password;
  let nickname = req.body.nickname;
  let role = req.body.role;
  let fgmode = req.body.fgMode;
  const upddate = new Date();

  const validUser = await isExists("USERNAME", username, "user");

  sql2 = `select ID,USERNAME,ROLE,DATE_FORMAT(createdate,'%d/%m/%Y') as createdate, NICKNAME,
  DATE_FORMAT(upddate,'%d/%m/%Y') as upddate
  from user
  order by ROLE
  `;

  if (fgmode === "I") {
    if (validUser)
      return res.send({ ECode: 10, EMsg: "Username Already Exists" });

    sql = `INSERT INTO USER(USERNAME, PASSWORD, NICKNAME, ROLE, createdate, upddate) VALUES(?,?,?,?,?,?)`;

    bcrypt.hash(password, saltRounds, function (err, hash) {
      if (err) throw err;

      connection.query(
        sql,
        [username, hash, nickname, role, upddate, upddate],
        function (err2, result2, field2) {
          if (err2) throw err2;

          connection.query(sql2, function (err3, result3, field3) {
            if (err3) throw err3;

            res.send({ user: result3, ECode: 0 });
            res.end;
          });
        }
      );
    });
  } else if (fgmode === "E") {
    if (!validUser) return res.send({ ECode: 10, EMsg: "Username Not Found" });

    sql = `UPDATE user 
            SET NICKNAME = ?, 
                ROLE = ?, 
                upddate=? 
          WHERE USERNAME = ?`;

    connection.query(
      sql,
      [nickname, role, upddate, username],
      function (err, result, field) {
        if (err) throw err;

        connection.query(sql2, function (err2, result2, field) {
          if (err2) throw err;
          res.send({ user: result2, ECode: 0 });
          res.end;
        });
      }
    );
  }
});

router.put("/resetpassword", async (req, res) => {
  if (!req.session.loggedin && !req.session.role != 0)
    return res.send({ ECode: 20, EMsg: "Session Expired" });
  let userId = req.body.userId;
  let username = req.body.username;
  let password = req.body.password;

  const validUser = await isExists("ID", userId, "user");

  sql = `
      update user
        set password = ?
      where ID = ? and username = ?
  `;

  bcrypt.hash(password, saltRounds, function (err, hash) {
    if (err) throw err;

    connection.query(
      sql,
      [hash, userId, username],
      function (err2, result, field) {
        if (err2) throw err;

        res.send({ ECode: 0 });
        res.end;
      }
    );
  });
});

router.delete("/user_delete", async (req, res) => {
  if (!req.session.loggedin && !req.session.role != 0)
    return res.send({ ECode: 20, EMsg: "Session Expired" });

  let userId = req.body.userId;

  sql = `delete from user where ID in (?)`;
  connection.query(sql, [userId], function (err, result, field) {
    if (err) throw err;
    res.send({ ECode: 0 });
    res.end;
  });
});

module.exports = router;
