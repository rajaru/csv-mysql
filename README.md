csv-mysql
=========
   Imports CSV files into MySQL Databases, using multi-valued inserts. Using multiple
   values is faster upto 16K rows (YMMV, use maxrows option to experiment).


   Existing rows will get updated if found with same primary/unique keys otherwise
   new rows will be created.


   Validates the columns and ignores additional columns in the data (that are not present
   in the original table).


   This module does not create target table, it must exist when import is called.
   This module depends on Node-Csv to parse the csv files and Node Mysql to do the
   inserts.

## Options
   * table - Name of the target table, must exist in the database



   * mysql - Node-Mysql module configuration. Must include, minimum of following
   			parameters
			host: target host server
			user: user name
			database: target database
			optional: port and password
			For additional options please refer to Node-Mysql module [documentation](https://github.com/felixge/node-mysql)
				specifically, the "Connection options" section for custom configurations



   * csv - Options to be passed on to the CSV Parser module.
   			For unquoted csv files pass quote parameter as null
			For additional options please refer to Node-Csv module [documentation](http://csv.adaltas.com/parse/)



   * maxrows: number of rows to insert at a time. Improves performance upto a point
   			and tapers afterwards. Experiment with your installation.
			You may have to change mysql --max_allowed_packet parameter (or global)
			to accommodate larger data inserted in one-go. If you can't change it
			reduce this (maxrows) value.



   * headers: By default first row in the input data is considered as header.
   			Alternatively you can provide list of columns as array of strings
			through this parameter. Please note, the header columns will be
			ignored if the target table does not have a corresponding field with
			the same name.

   * fixedData: you can additional data (same data used across all rows) to the
   			table apart from what is provided in the buffer. This must be a name
			value pair javascript object.


## Installation
    npm install csv-mysql --save

## Usage
	var cm = require('csv-mysql');

	var data = '"c1","c2","c3"\n"1","2","3"\n"4","5","6"';
	var options = {
		mysql: {
			host: '127.0.0.1',
			user: 'root',
			database: 'test',
		},
		csv: {
			comment: '#',
			quote: '"'
		},
		table: 'test'
	}

	cm.import(options, data, function(err, rows){
		if( err===null )err = false;
		expect(err).to.equal(false);
		done();
	});

## Sample 2
	//adding additional column to every row
	// equivalent of var data = '"c1","c2","c3","c4"\n"1","2","3","111"\n"4","5","6","111"';
	//
	var data = '"c1","c2","c3"\n"1","2","3"\n"4","5","6"';
	options.fixedData = {
		c4: "111"
	};
	cm.import(options, data, function(err, rows){
		if( err===null )err = false;
		expect(err).to.equal(false);
		done();
	});


## Sample 2
	//data without header
	//
	var cm = require('csv-mysql');

	var data = '"1","2","3"\n"4","5","6"';
	var options = {
		mysql: {
			host: '127.0.0.1',
			user: 'root',
			database: 'test',
		},
		csv: {
			comment: '#',
			quote: '"'
		},
		table: 'test',
		headers: ["c1","c2","c3"]
	}

	cm.import(options, data, function(err, rows){
		if( err===null )err = false;
		expect(err).to.equal(false);
		done();
	});

## Bug Report
	Please open an [issue](https://github.com/rajaru/csv-mysql/issues)

## ToDo
	- Validate data types before inserting

## LICENSE
	Public domain
 	You may do anything  with this code that is legal in your country :-)

	THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
 	IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
 	FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
 	AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
 	LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING
 	FROM, OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS
 	IN THE SOFTWARE.
