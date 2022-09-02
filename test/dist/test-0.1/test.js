(async function() {
	let response = await fetch('http://testapi.r1i.lan-sevice.com/api/results/all', {
		headers: { 'accept': 'application/json', 'App-Key': 'S0lk65CPBj5HEhbEGVWU2ZCgpzXl' },
	});

	let {items} = await response.json();
	
	console.log(items)
	// function createTable() {
	// 	const table = document.createElement('table');
	// 	table.classList.add('table', 'table-bordered');

	// 	let headerTable = createHeaderTable();
  //   let mainTable = createMainTable();

	// 	table.append(headerTable, mainTable);
  //   return table;
	// }

	function createHeaderTable() {

		const  headItems = [
			'№ в госреестре', 
			'Наименование СИ', 
			'Обозначение типа СИ', 
			'Заводской №', 
			'Год вып.', 
			'Шифр', 
			'Тип поверки', 
			'Дата поверки', 
			'Пригодность',
		]

		let head = document.createElement('thead');
    let row = document.createElement('tr');

		headItems.forEach(item => {

			let heading = document.createElement('th');
      heading.setAttribute('scope', 'col');

      let title = document.createElement('h3');
      title.classList.add('h5');
      title.textContent = item;
			heading.append(title);
			row.append(heading);
		})
		head.append(row);
		return head;
	}

	function createItem(data) {
		// console.log(data)
		const item = {
			number: data.vri_id, 									// 1
			si_name: data.si_name, 								// 2
			si_designation: data.si_designation, 	// 3
			vri_id: data.certnotice,							// 4
			certnotice: data.year,								// 5
			sign: data.sign,											// 6
			vritype_id: data.vritype_id,					// 7
			date: data.verification_at,						// 8
			applicability: data.applicability,		// 9
		}

		const row = document.createElement('tr');
		
		for (let key in item) {
			const td = document.createElement('td');
			td.textContent = item[key];
			row.append(td);
		}
		return row;
	}

	function createMainTable(data) {
		const body = document.createElement('tbody')

		data.forEach(item => {
			const row = createItem(item)
			body.append(row);
		})
		return body;
	}

	let app = document.querySelector('#app-table');
	app.classList.add('table', 'table-bordered', 'container');
	app.append(createHeaderTable());
	let main = createMainTable(items);
	app.append(main);

})()