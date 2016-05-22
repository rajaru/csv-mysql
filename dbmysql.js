/* jshint node: true */
'use strict';
var mysql 	= require('mysql');

var db = {

	getConnection: function(conf){
		//try making a connection to mysql
		//
		var conn = mysql.createConnection(conf);
		conn.on('error', function(err){
			console.log('dberror: '+err);
		});
		return conn;
	},

	insert: function(conf, sql, params, callback){
		var conn = db.getConnection(conf);
		conn.connect(function(err){
			/* istanbul ignore if */
			if( err )
				return callback(true, 'insert: db connection failed '+err.message);

			conn.query(sql, params, function(err, res){
				conn.end();
				if( err )
					return callback(err, err.message);
				return callback(err, res.insertId);
			});
		});
	},

	query: function(conf, sql, params, callback){
		var conn = db.getConnection(conf);
		conn.connect(function(err){
			/* istanbul ignore if */
			if( err )
				return callback(true, 'query: db connection failed '+err.message);

			conn.query(sql, params, function(err, rows, fields){
				conn.end();
				return callback(err, rows, fields);
			});
		});
	},

	queryArray: function(conf, sql, params, callback){
		db.query(conf, sql, params, function(err, rows, fields){
			var arr = [];
			if( !err )
				for( var i in rows )arr.push(rows[i][fields[0].name]);
			return callback(err, arr);
		});
	},

	getColumnNames: function(conf, tableName, callback){
		var sql = "show columns from "+tableName;
		db.query(conf, sql, [], function(err, rows, fields){
			if( err )return callback(err, rows);
			var arr = [];
			for( var i in rows )arr.push(rows[i].Field);
			return callback(err, arr);
		});

	},

};

module.exports = db;
