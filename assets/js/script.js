let i = 0;
let buyOrRentChoice = '';
let placeChoice = '';
const results = [];
const geoData = [];
const newGeoData = [];
const houses = document.querySelector('.houses');
const placeButtons = document.querySelectorAll('.cities button');
const buyOrRentButtons = document.querySelectorAll('.buyrent button');
const defineButtons = document.querySelectorAll('.who button');
const buyrent = document.querySelector('.buyrent');
const cities = document.querySelector('.cities');
const who = document.querySelector('.who');
const options = document.querySelector('.options');
const ditpast = document.querySelector('.results');

// promise to resolve the geolocation
const geoPromise = new Promise((resolve, reject) => {
	navigator.geolocation.getCurrentPosition(pos => getCoords(pos, resolve));
});

// get coordinates
function getCoords(pos, resolve) {
	resolve({
		x: pos.coords.latitude,
		y: pos.coords.longitude,
	});
}

// if promise is resolved get the data from the API
geoPromise
	.then(pos => `${geoUrl}&lat=${pos.x}&lng=${pos.y}`)
	.then(str => fetch(str)
		.then(response => response.json())
		.then(data => geoData.push(...data.postalCodes))
		.then(data => getThreeLocations()))
		.then(data => cutDownToThree())
		.then(data => convertButtons());

// cut it down to the 3 nearest locations and push it into a global array
function getThreeLocations(allData) {
	allData = geoData
		.map(data => data.adminName2)
		.filter((item, index, array) => array.indexOf(item) === index)
		.map(data => newGeoData.push(data));
}

// make sure there won't be more than 3 locations in the array
function cutDownToThree() {
	if (newGeoData.length > 3) {
		newGeoData.length = 3;
	}
}

// fill every button with a location nearby
function convertButtons() {
	placeButtons.forEach((place) => {
		place.textContent = newGeoData[i];
		i++;
	});
}

// fetch the data with changeable parameters
function getHousesByQuery(buyrent, city, music, nature, broke) {
	fetch(`${fundaUrl}${APIKEY}/?type=${buyrent}&zo=/${city}${music}${nature}${broke}/&page=1&pagesize=25`)
		.then(data => data.json())
		.then(data => results.push(...data.Objects))
		.then(data => showData());
}

// store the selected place
function selectPlace() {
	newGeoData.forEach((place) => {
		if (this.textContent === place) {
			placeChoice = this.textContent;
		}
	});
}

// store if they want to buy or rent
function buyOrRent() {
	if (this.textContent.includes('open')) {
		buyOrRentChoice = 'koop';
		defineButtons[2].innerHTML = 'Voorzichtig';
	} else {
		buyOrRentChoice = 'huur';
	}
}

// send the choice to the fetch parameters
function selectChoice() {
	if (this.textContent === 'Muzikant') {
		getHousesByQuery(buyOrRentChoice, placeChoice, '/garagebox/garage-carport/vrijstaande-garage/', '', '');
	} else if (this.textContent === 'Natuurmens') {
		getHousesByQuery(buyOrRentChoice, placeChoice, '', '/tuin', '');
	} else if (this.textContent === 'Blut') {
		getHousesByQuery(buyOrRentChoice, placeChoice, '', '', '/0-899/woonhuis/appartement');
	} else if (this.textContent === 'Voorzichtig') {
		getHousesByQuery(buyOrRentChoice, placeChoice, '', '', '/0-200000');
	}
}

buyOrRentButtons.forEach(button => button.addEventListener('click', buyOrRent));
defineButtons.forEach(button => button.addEventListener('click', selectChoice));
placeButtons.forEach(button => button.addEventListener('click', selectPlace));

// renders the right data into the page 
function showData() {
	const newResults = results
		// .map(data => console.log(data))
		.map(data => houseDom(data))
		.join('');
	renderToDom(newResults);
}

// returns the main html as a template string
function houseDom(house) {
	return `
		<div>
			<img src="${house.FotoMedium}">
			<p>${house.Adres}</p>
			<p>€${house.Prijs.Huurprijs === null ? house.Prijs.Koopprijs : house.Prijs.Huurprijs}</p>
		</div>
	`;
}

// render ele's to HTML
function renderToDom(elements) {
	houses.innerHTML = elements;
}

// show/hide the options on select
function showBuyOrRent() {
	cities.classList.add('hide');
	buyrent.classList.remove('hide');
}

function showOptions() {
	buyrent.classList.add('hide');
	who.classList.remove('hide');
}

// hide the choices and show the houses
function showHouses() {
	options.classList.add('hide');
	ditpast.classList.remove('hide');
}

placeButtons.forEach(button => button.addEventListener('click', showBuyOrRent));
buyOrRentButtons.forEach(button => button.addEventListener('click', showOptions));
defineButtons.forEach(button => button.addEventListener('click', showHouses));

