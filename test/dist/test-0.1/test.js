(function() {
	function createTable() {
		const table = document.createElement('table');
		table.classList.add('table');

		let headerTable = createHeaderTable();
    let mainTable = createMainTable();

		table.append(headerTable, mainTable);
    return table;
	}

	function createHeaderTable() {

	}

	function createMainTable() {

	}

	async function getData() {
		let response = await fetch('http://testapi.r1i.lan-sevice.com/api/results/all', {
      headers: { 'accept': 'application/json', 'App-Key': 'S0lk65CPBj5HEhbEGVWU2ZCgpzXl' },
    });
		
		let data = await response.json();
		console.log(data);
	}
	
	let data = getData()

	

})()