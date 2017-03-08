const houses = document.querySelector('.houses');
const placeButtons = document.querySelectorAll('.cities button');
const defineButtons = document.querySelectorAll('.who button');
const who = document.querySelector('.who');
const cities = document.querySelector('.cities');
const options = document.querySelector('.options');
const ditpast = document.querySelector('.results');
let placeChoice = '';
let i = 0;
const results = [];
const geoData = [];
const YouThoughtTheLastGeoDataWasNewWellThisIsEvenNewer = [];

// get coordinates
function getCoords(pos, resolve) {
	resolve({
		x: pos.coords.latitude,
		y: pos.coords.longitude,
	});
}

// promise to resolve the geolocation
const geoPromise = new Promise((resolve, reject) => {
	navigator.geolocation.getCurrentPosition(pos => getCoords(pos, resolve));
});

// if promise is resolved get the data from the API
geoPromise
	.then(pos => `${geoUrl}&lat=${pos.x}&lng=${pos.y}`)
	.then(str => fetch(str)
		.then(response => response.json())
		.then(data => geoData.push(...data.postalCodes))
		.then(data => getThreeLocations()));

// cut it down to the 3 nearest locations
function getThreeLocations() {
	const newGeoData = geoData
		.map(data => data.adminName2)
		.filter((item, index, array) => array.indexOf(item) === index);

	cutDownToThree(newGeoData);
	convertButtons(newGeoData);
	YouThoughtTheLastGeoDataWasNewWellThisIsEvenNewer.push(...newGeoData);
}

// make sure there won't be more than 3 locations in the array
function cutDownToThree(data) {
	if (data.length > 3) {
		data.length = 3;
	}
}

// fill every button with a location nearby
function convertButtons(data) {
	placeButtons.forEach(place => {
		place.textContent = data[i];
		i++;
	});
}


// fetch the data with changeable parameters
function getHousesByQuery(city, music, nature, broke) {
	fetch(`${fundaUrl}${APIKEY}/?type=huur&zo=/${city}${music}${nature}${broke}/&page=1&pagesize=25`)
		.then(data => data.json())
		.then(data => results.push(...data.Objects))
		.then(data => showData());
}

// store the selected place
function selectPlace() {
	YouThoughtTheLastGeoDataWasNewWellThisIsEvenNewer.forEach((place) => {
		if (this.textContent === place) {
			placeChoice = this.textContent;
		}
	});
}

// send the choice to the fetch parameters
function selectChoice() {
	if (this.textContent === 'Muzikant') {
		getHousesByQuery(placeChoice, '/garagebox/garage-carport/vrijstaande-garage/', '', '');
	} else if (this.textContent === 'Natuurmens') {
		getHousesByQuery(placeChoice, '', '/tuin', '');
	} else if (this.textContent === 'Blut') {
		getHousesByQuery(placeChoice, '', '', '/0-899/woonhuis/appartement');
	}
}

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
			<p>€${house.Prijs.Huurprijs}</p>
		</div>
	`;
}

// render ele's to HTML
function renderToDom(elements) {
	houses.innerHTML = elements;
}

// show/hide the options on select
function toggle() {
	who.classList.remove('hide');
	cities.classList.add('hide');
}

// hide the choices and show the houses
function showHouses() {
	options.classList.add('hide');
	ditpast.classList.remove('hide');
}

defineButtons.forEach(button => button.addEventListener('click', showHouses));
placeButtons.forEach(button => button.addEventListener('click', toggle));

