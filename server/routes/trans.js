require('dotenv').config()

const { response } = require('express');
const express = require("express");
const router = express.Router();
const connection = require('../utils/connection');



router.get('/dashboard', (req, res) => {
	if(!req.session.loggedin && !req.session.role != 0) return res.send({ECode:20});

	var sql = `
				SELECT invoice.invoice_id,invoice.invoice_code,invoice.upddate,
					   trans_id, product_name, trans_date, trans_qty, trans_amount
				FROM invoice
				LEFT OUTER JOIN invoice_dt on invoice_dt.invoice_id = invoice.invoice_id
				LEFT OUTER JOIN product on product.product_id = invoice_dt.product_id
				Where invoice.upddate > date_sub( now(), interval 2 day)
				ORDER BY trans_date DESC
			`;
	var sql1 = `
					SELECT totalEarning
					FROM (SELECT SUM(trans_amount) AS totalEarning, 
								DATE_FORMAT(upddate, "%m") AS date 
						FROM invoice_dt 
						WHERE YEAR(upddate) = YEAR(now())
						GROUP BY DATE_FORMAT(upddate, "%m")
					
						UNION
					
						SELECT 0    AS totalEarning, 
								month AS date
						FROM quantum_default_months) as Q
					GROUP BY date
				`;
	var sql2 = `
			select sum(trans_amount) total
			from invoice_dt
			where YEAR(upddate) = YEAR(now())

			UNION

			select Count(product_id) total
			from product

			UNION

			select Count(table_id) total
			from table_place

			   `;
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
	
	connection.query(sql, function(error, result, fields){
		if (error) throw error;

		connection.query(sql1, function(error1, result1, fields1) {
			if (error1) throw error1;

			connection.query(sql2, function(error2, result2, fields2) {
				if (error2) throw error2;
	
					res.send({hist:result ,earning: result1, summary: result2});
					res.end;
			});
		});
	});
	
});

module.exports = router;