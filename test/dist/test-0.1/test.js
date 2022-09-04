(async function() {
	let response = await fetch('http://testapi.r1i.lan-sevice.com/api/results/all', {
		headers: { 'accept': 'application/json', 'App-Key': 'S0lk65CPBj5HEhbEGVWU2ZCgpzXl' },
	});

	let {items} = await response.json();

	// функция добавления Аккордиона
	function createAccordionMenu() {
		const wrap = document.createElement('div');
		const innerWrap = document.createElement('div');
		const heading = document.createElement('h2');
		const button = document.createElement('button');
		const wrapFilters = document.createElement('div');
		const bodyFilters = document.createElement('div');

		wrap.classList.add('accordion', 'accordion-flush', 'container');
		wrap.id = 'accordionFlushExample';
		innerWrap.classList.add('accordion-item');
		heading.classList.add('accordion-header');
		heading.id = 'flush-headingOne';
		button.classList.add('accordion-button', 'collapsed');
		button.setAttribute('type', 'button');
		button.setAttribute('data-bs-toggle', 'collapse');
		button.setAttribute('data-bs-target', '#flush-collapseOne');
		button.setAttribute('aria-expanded', 'false');
		button.setAttribute('aria-controls', 'flush-collapseOne');
		button.textContent = 'Фильтры';

		wrapFilters.classList.add('accordion-collapse', 'collapse');
		wrapFilters.id = 'flush-collapseOne';
		wrapFilters.setAttribute('aria-labelledby', 'flush-headingOne');
		wrapFilters.setAttribute('data-bs-parent', '#accordionFlushExample');
		bodyFilters.classList.add('accordion-body');

		wrap.append(innerWrap);
		innerWrap.append(heading, wrapFilters);
		heading.append(button);
		wrapFilters.append(bodyFilters);
		bodyFilters.append(createFilterForm());

		return wrap;
	}

	// создание элемента формы Фильтра
	function createFilterFormElem(elem) {
    const ELEM_BOX = document.createElement('div');
    ELEM_BOX.classList.add('col-md-3');

    const LABEL = document.createElement('label');
    LABEL.classList.add('form-label');
    LABEL.setAttribute('for', `${elem.id}-filter`);
    LABEL.textContent = elem.name;

    const INPUT = document.createElement('input');
    INPUT.classList.add('form-control');
    INPUT.setAttribute('data-filter', elem.id);
    INPUT.setAttribute('type', 'text');
    ELEM_BOX.append(LABEL, INPUT);
    return ELEM_BOX;
  };

	// создание формы фильтра
	function createFilterForm() {
		const FILTER_ELEMENTS = [
      {
        id: 'vri_id',
        name: '№ в госреестре',
      },
      {
        id: 'si_name',
        name: 'Наименование СИ',
      },
      {
        id: 'certnotice',
        name: 'Заводской №',
      },
      {
        id: 'sign',
        name: 'Шифр',
      },
    ];

    const FORM = document.createElement('form');
    FORM.classList.add('row', 'g-3', 'mb-4');
    FORM.setAttribute('id', 'filter-form')
    FILTER_ELEMENTS.forEach(el => FORM.append(createFilterFormElem(el)));

    return FORM;
	}

	function createTableHead() {
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

	// создание таблицы 
	function createTable() {
		const TABLE = document.createElement('table');
    TABLE.classList.add('table', 'table-bordered', 'container');

    TABLE.append(createTableHead());
    const BODY = document.createElement('tbody');
    TABLE.append(BODY);

    return TABLE;
	}

	// создание из объекта DOM-элемента
	function createItem(item) {
		const row = document.createElement('tr');
		
		for (let key in item) {
			const td = document.createElement('td');
			td.textContent = item[key];
			row.append(td);
		}

		return row;
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
  function createButtonGroup(page) {
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

		let copyItems = items.map(item => item = {
		vri_id: String(item.vri_id), 						// 1
		si_name: item.si_name, 									// 2
		si_designation: item.si_designation, 		// 3
		certnotice: item.certnotice,						// 4
		year: item.year,												// 5
		sign: item.sign,												// 6
		vritype_id: item.vritype_id,						// 7
		verification_at: item.verification_at,	// 8
		applicability: item.applicability,			// 9
	})

	const onPage = 20; // элементов на странице
	let page = 0;
	let pages = Math.ceil(copyItems.length / onPage);

	function divisionArray(arr, onPage) {
		const newArr = []

		for ( let i = 0; i < arr.length; i++) {
			if (i % onPage === 0) {
				newArr.push([])
			}
			newArr[newArr.length - 1].push(arr[i])
		}
		// console.log(newArr)
		return newArr;
	}

	function createMainTable(data) {
		tBody.textContent = '';
		if(data) {
			data.forEach(item => {
				const row = createItem(item)
				tBody.append(row);
			})
		}
		
		return;
	}
	
	let work = divisionArray(copyItems, onPage);

	const app = document.querySelector('#app-table');
	const menuFilter = createAccordionMenu();
	const table = createTable();
	const buttonsPagination = createButtonGroup(1)

	app.append(menuFilter, table, buttonsPagination);

	const tBody = document.querySelector('tbody');

	createMainTable(work[page]); // создание первой страницы

	// переключение страниц
	buttonsPages = document.querySelectorAll('button.btn-outline-primary')
	buttonsPages.forEach(button => {
		button.addEventListener('click', () => {
			page = button.id;
			createMainTable(work[page])

			console.log(page)
			buttonsPages[0].id = parseInt(page) - 1;
			buttonsPages[1].id = parseInt(page) + 1;

			buttonsPages.forEach(button => {
				if(button.id < 1 || button.id > pages - 1) {
					button.setAttribute('disabled', '');
				} else {
					button.removeAttribute('disabled');
				}
			})
		})
	})
	
	function filterlist(e) {
    let filterInput = app.querySelectorAll('#filter-form input');
    let filterer = {};
    filterInput.forEach(el => {
      filterer[el.dataset.filter] = el.value;
			
    })

    let filterItems = copyItems
      .filter(item => {
				// console.log(filterer.vri_id, item.vri_id);
       	return item.vri_id.includes(filterer.vri_id)
              && item.si_name.toLowerCase().includes(filterer.si_name.toLowerCase())
							&& item.certnotice.toLowerCase().includes(filterer.certnotice.toLowerCase())
							&& item.sign.toLowerCase().includes(filterer.sign.toLowerCase());
    });
		console.log(filterItems);
		work = divisionArray(filterItems, onPage)
		if (page >= work.length - 1) {
			page = work.length - 1;
		}
		console.log(page);
		pages = Math.ceil(work.length);
		console.log(pages);
		buttonsPages.forEach(button => {
			if(button.id < 1 || button.id > pages) {
				button.setAttribute('disabled', '');
			} else {
				button.removeAttribute('disabled');
			}
		})
    createMainTable(work[page])
		return;
  }

	let filterInput = app.querySelectorAll('#filter-form input');
	
    filterInput.forEach(input => {
			let flashTimer;
			input.addEventListener('input', () => {
				clearTimeout(flashTimer);
				flashTimer = setTimeout(filterlist, 300)
			})
    })

})()