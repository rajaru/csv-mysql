csv-mysql
=========
   Imports CSV files into MySQL Databases, using multi-values inserts. Validates
   the columns and ignores additional columns in the data (that are not present
   in the original table).
   This module does not create target table, it must exist when import is called.
   This module depends on Node-Csv to parse the csv files and Node Mysql to do the
   inserts.

## Options
   table - Name of the target table, must exist in the database
   mysql - Node-Mysql module configuration. Must include, minimum of following
   			parameters
			host: target host server
			user: user name
			database: target database
			optional: port and password
			For additional options please refer to Node-Mysql module [documentation](https://github.com/felixge/node-mysql)
				specifically, the "Connection options" section for custom configurations

   csv - Options to be passed on to the CSV Parser module.
   			For unquoted csv files pass quote parameter as null
			For additional options please refer to Node-Csv module [documentation](http://csv.adaltas.com/parse/)

## Installation
    npm install csv-mysql --save

## Usage
	var cm = require('csv-mysql');

	var data = '"c1","c2","c3"\n"1","2","3"\n"4","5","6"';
	var mysql = {
		host: '127.0.0.1',
		user: 'root',
		database: 'test',
	};
	var csvopt = {
		comment: '#',
		quote: '"'
	};
	cm.import({mysql: mysql, csv: csvopt, table: 'test'}, data, function(err, rows){
		if( err===null )err = false;
		expect(err).to.equal(false);
		done();
	});

## ToDo
	- Validate data types before inserting
	- 
