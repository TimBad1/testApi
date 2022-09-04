(async function() {
	let response = await fetch('http://testapi.r1i.lan-sevice.com/api/results/all', {
		headers: { 'accept': 'application/json', 'App-Key': 'S0lk65CPBj5HEhbEGVWU2ZCgpzXl' },
	});

	let {items} = await response.json();
	
	const onPage = 100; // элементов на странице
	let page = 1;
	let pages = Math.ceil(items.length / onPage);
	
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
		const item = {
			number: data.vri_id, 										// 1
			si_name: data.si_name, 									// 2
			si_designation: data.si_designation, 		// 3
			vri_id: data.certnotice,								// 4
			certnotice: data.year,									// 5
			sign: data.sign,												// 6
			vritype_id: data.vritype_id,						// 7
			date: data.verification_at,							// 8
			applicability: data.applicability,			// 9
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

	// функция создания одной кнопки
  function createButton(title, id, isDisabled = false) {
    const BUTTON = document.createElement('button');
    BUTTON.classList.add('btn', 'btn-outline-primary');
    BUTTON.setAttribute('id', id)
    BUTTON.setAttribute('role', 'button');
    BUTTON.textContent = title;

    if(isDisabled) {
      BUTTON.classList.add('disabled');
    }

    return BUTTON;
  }

  // функция создания группы кнопок
  function createButtonGroup(page, pages) {
    const BUTTON_GROUP = document.createElement('div');
    BUTTON_GROUP.classList.add('btn-group', 'd-block', 'text-center');
    BUTTON_GROUP.setAttribute('role', 'group');
    BUTTON_GROUP.setAttribute('aria-label', 'Кнопки переключения страниц');

    let arrButtons = [];

		arrButtons.push(createButton('Назад', page - 1))
		arrButtons.push(createButton('Вперёд', page + 1))
				
		arrButtons[0].setAttribute('disabled', '')
    arrButtons.forEach(el => BUTTON_GROUP.append(el))
    return BUTTON_GROUP;
  }

	const app = document.querySelector('#app-table');
	const table = document.createElement('table');
	table.classList.add('table', 'table-bordered', 'container');
	app.append(table);
	table.append(createHeaderTable());
	let main = createMainTable(items.slice((page * onPage - onPage), (page * onPage)));
	table.append(main);

	let BUTTON_GROUP = createButtonGroup(page, pages);

	app.append(BUTTON_GROUP);
	
	buttonsPages = document.querySelectorAll('button.btn-outline-primary')
	
	buttonsPages.forEach(button => {
		button.addEventListener('click', () => {
			page = button.id;
			main.textContent = '';
			main = (createMainTable(items.slice((page * onPage - onPage), (page * onPage))));

			table.append(main);
			buttonsPages[0].id = parseInt(page) - 1;
			buttonsPages[1].id = parseInt(page) + 1;

			buttonsPages.forEach(button => {
				if(button.id < 1 || button.id > pages) {
					button.setAttribute('disabled', '');
				} else {
					button.removeAttribute('disabled');
				}
			})
		})
	})


})()