const fetchURL = () => {
	return "http://localhost/myLumenApi/public/api/mahasiswa";
}

document.addEventListener("DOMContentLoaded", (e) => {
	e.preventDefault();
	checkData();
});

const checkData = async () => {
	try {
		let results = await getData();
		if (results.success){
			await renderData(results);
		}else{
			let tBodyRow = document.querySelector('#rowData');
			tBodyRow.innerHTML = results.message;
			throw await results.message;
		}
	} catch(err) {
		console.log(err);
	}
}

const getData = async () => {
	let res = await fetch(fetchURL());
	let results = await res.json();
	if (res.status == 200) {
		return await results;
	}
}

const renderData = async (results) => {
	let rowData = "";
	await results.data.forEach((data, index) => {
		let dataSegment = `<tr id = rows${data.npm}><td>${parseInt(index)+1}</td><td>${data.nama}</td><td>${data.npm}</td><td>${data.kelas}</td><td><a id='editButton' class='btn btn-warning editButton' href='javascript:void[0]' name='${data.id}'>EDIT</a></td><td><a id='deleteButton' class='btn btn-danger deleteButton' href='javascript:void[0]' name='${data.id}'>DELETE</a></td></tr>`;
		rowData += dataSegment;
	});
	let tBodyRow = document.querySelector('#rowData');
	tBodyRow.innerHTML = rowData;
}

const addButton = document.querySelector('#addButton');
addButton.addEventListener("click", () => {
	clearAlert();
	$('.modal').modal('show')
	setInputValue();
});

$(document).on('click', '.editButton', function(){
	clearAlert();
	$('.modal').modal('show');
	let id = $(this).attr('name')
	const url = fetchURL()+'/'+id;

	$.get(url, (res) => {
		setInputValue(res);
	});
});

const setInputValue = (res) => {
	if (res) {
		for(let data of Object.values(res.data)){
			document.getElementById('submitButton').value = 'update';
			document.getElementById('submitButton').dataset.updateTrigger= data.id;
			document.getElementById('nama').value = data.nama;
			document.getElementById('npm').value = data.npm;
			document.getElementById('kelas').value = data.kelas;
		}
	}else{
		document.getElementById('submitButton').dataset.updateTrigger= "0";
		document.getElementById("mahasiswaForm").reset();
		document.getElementById('submitButton').value = 'add';
	}
}

const submitButton = document.querySelector('#submitButton');
submitButton.addEventListener("click", () => {
	let state = submitButton.value,
	formValue = document.getElementsByClassName('formValue'),
	data = {},
	id = document.getElementById('submitButton').dataset.updateTrigger;
	const url = fetchURL();
	for (var i = 0; i < formValue.length; i++) {
		data[formValue[i].name] = formValue[i].value;
	}
	createOrUpdate(state, data, id, url);
});

const createOrUpdate = async (state, data, id, url) => {
	try {
		let res = "";
		if (state == 'add') {
			res = await fetch(url, {
				method : 'POST',
				body :JSON.stringify(data),
				headers: {"Content-type": "application/json; charset=UTF-8"}
			});
		}else{
			res = await fetch(url+'/'+id, {
				method : 'PUT',
				body :JSON.stringify(data),
				headers: {"Content-type": "application/json; charset=UTF-8"}
			});
		}
		await checkRequest(res);
	} catch(err) {
		console.error(err);
	}
}

const checkRequest = async (res) => {
	let results = await res.json();
	if (!results.success){
		formValidation(results.message);
		throw await String(results.message);
	}else{
		await clearAlert();
		await console.log(results)
		return await checkData();
	}
}

const clearAlert = () => {
	const divAlert = document.querySelector('div#alertMessage');
	divAlert.setAttribute("style", "display: none;");	
}

const formValidation = (res) => {
	let divAlert = document.querySelector('#alertMessage');
	let errorVal = ""
	res.forEach((key)=> {
		errorVal += `<li>${key}</li>`;
	})
	divAlert.innerHTML = errorVal;
	divAlert.style.display='block';
}

$(document).on('click','.deleteButton',function(){
	let id = $(this).attr('name')
	const url = fetchURL()+'/'+id;
	deleteData(url);
})

const deleteData = async (url, event) => {
	try {
		let res = await fetch(url, {
			method : 'DELETE'
		});
		let results = await res.json();
		if (!results.success) {
			throw await String(results.message);
		}else{
			await console.log(results)
			return await checkData();
		}
	} catch(err) {
		console.error(err);
	}
}

// const ulAlert = document.querySelector('ul#listMessage');
// const divAlert = document.querySelector('div#alertMessage');
// divAlert.setAttribute("style", "display: block;");
// const ulNew = document.createElement('ul');
// const liNew = document.createElement('li');
// const errMsg = document.createTextNode(key);
// liNew.appendChild(errMsg);
// ulAlert.appendChild(liNew);