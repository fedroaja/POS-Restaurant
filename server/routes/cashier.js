require("dotenv").config();

const { response } = require("express");
const express = require("express");
const router = express.Router();
const connection = require("../utils/connection");

router.get("/product", (req, res) => {
  if (!req.session.loggedin && !req.session.role != 1)
    return res.send({ ECode: 20, EMsg: "Session Expired" });
  sql = `
              select product_id id,product_code,product_name,ctg_id, ctg_name,FORMAT(product_price,'id_ID') as product_price,
                     DATE_FORMAT(product.upddate,'%d/%m/%Y') as upddate, fgActive active, delivery_time, img_url, 0 as selected
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

  let defaultCtg = {
    ctg_id: 0,
    ctg_code: "semua",
    ctg_name: "Semua",
    upddate: new Date(),
  };

  connection.query(sql, function (err, result, fields) {
    if (err) throw err;

    connection.query(sql2, function (err2, result2, fields2) {
      if (err2) throw err;
      let myCtg = [defaultCtg, ...result2];
      res.send({ product: result, category: myCtg });
      res.end;
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

module.exports = router;
