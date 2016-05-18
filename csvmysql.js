/* jshint node: true */
'use strict';
var csv     = require('csv');
var mysql 	= require('./dbmysql.js');


function CsvMysql(options){
	options.fixedData = options.fixedData || {};
	options.maxrows = options.maxrows || 16*1024;	// if this gives error, you may have ton increase mysql packet sized
	options.csv 	= options.csv   || {};
	this.options = options;
	this.rows = 0;
	return this;
}

CsvMysql.prototype._makeSql = function(adata, header){
	var i, j;

	//remove the non-existent (not in table) columns from header and data array
	//
	for(i=0; i<header.length; i++){
		if( this.columns.indexOf(header[i])<0 ){
			for(j=0; j<adata.length; j++)
				adata[j].splice(i,1);
			header.splice(i, 1);
			i --;	//stay in same index
		}
	}

	//add fixed data to all rows if found in columns
	//
	for(i in this.options.fixedData){
		if( this.columns.indexOf(i)>=0 ){
			header.push(i);
			for(j=0; j<adata.length; j++)
				adata[j].push(this.options.fixedData[i]);
		}
	}

	var sql = "insert into "+this.options.table+"("+header.join(",")+") values ? on duplicate key update ";
	for(i in header )sql += header[i]+"=values("+header[i]+"),";
	return sql.substr(0, sql.length-1);
};

CsvMysql.prototype._importRows = function(adata, header, callback){
	var _self = this;
	var max = _self.options.maxrows || 100;
	var sql;

	if( adata.length===0 )
		return callback(false, '');

	if( adata.length>max ){
		var part = adata.splice(0, max);
		sql = _self._makeSql(part, header.slice());

		mysql.insert(_self.options.mysql, sql, [part], function(err, res, ids){
			if( !err )_self.rows += adata.length;
			_self._importRows(adata, header, callback);
		});
	}
	else{
		sql = _self._makeSql(adata, header.slice());

		mysql.insert(_self.options.mysql, sql, [adata], function(err, ids){
			if( !err )_self.rows += adata.length;
			return callback(err, ids);
		});
	}
};

CsvMysql.prototype.import = function(data, callback){
	var _self = this;

	//chacke for mandatory options(???)
	//
	if( !_self.options.hasOwnProperty('table') )
		return callback(true, 'missing table in options');
	if( !_self.options.hasOwnProperty('mysql') )
		return callback(true, 'missing mysql in options');

	mysql.getColumnNames(_self.options.mysql, _self.options.table, function(err, cols){
		if( err )return callback(err, cols);

		_self.columns = cols;
		csv.parse(data, _self.options.csv, function(err, rows){
			if( err )return callback(err, err);
			var header = _self.options.headers || rows.shift();
			_self._importRows(rows, header, callback);
		});
	});
};

module.exports = {
	import: function(options, data, callback){
		var cm = new CsvMysql(options);
		return cm.import(data, callback);
	}
};
