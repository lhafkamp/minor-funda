const houses = document.querySelector('.houses');
const results = [];
const places = ['amsterdam', 'amstelveen', 'diemen'];
let placeChoice = '';
const placeButtons = document.querySelectorAll('.cities button');
const choiceButtons = document.querySelectorAll('button');


function getHousesByQuery(city, music) {
	console.log(city, music);
	fetch(`http://funda.kyrandia.nl/feeds/Aanbod.svc/json/${APIKEY}/?type=huur&zo=/${city}${music}/&page=1&pagesize=25`)
		.then(data => data.json())
		.then(data => results.push(...data.Objects))
		.then(data => showData());
}

function selectPlace() {
	places.forEach((place) => {
		if (this.textContent === place) {
			placeChoice = this.textContent;
		}
	});
}

function selectChoice() {
	if (this.textContent === 'muzikant') {
		getHousesByQuery(placeChoice, '/garage');
	}
}

choiceButtons[3].addEventListener('click', selectChoice);
placeButtons.forEach(button => button.addEventListener('click', selectPlace));


function showData() {
	const newResults = results
		// .map(data => console.log(data))
		.map(data => mainDom(data))
		.join('');
	renderToDom(newResults);
}

function mainDom(house) {
	return `
		<div>
			<img src="${house.FotoMedium}">
			<p>${house.Adres}</p>
			<p>${house.AangebodenSindsTekst}</p>
			<p>€${house.Prijs.Huurprijs}</p>
		</div>
	`;
}

function renderToDom(elements) {
	houses.innerHTML = elements;
}

