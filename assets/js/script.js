const houses = document.querySelector('.houses');
const placeButtons = document.querySelectorAll('.cities button');
const defineButtons = document.querySelectorAll('.who button');
const who = document.querySelector('.who');
const cities = document.querySelector('.cities');
const options = document.querySelector('.options');
const ditpast = document.querySelector('.results');
const places = ['Amsterdam', 'Amstelveen', 'Diemen'];
let placeChoice = '';
const results = [];
const geoData = [];

fetch('http://api.geonames.org/findNearbyPostalCodesJSON?lat=52.367902&lng=4.910852&maxRows=100&username=lhafkamp')
	.then(data => data.json())
	.then(data => geoData.push(...data.postalCodes))
	.then(data => getThreeLocations());


function getThreeLocations() {
	const newGeoData = geoData
		.map(data => data.adminName2)
		.filter((item, index, array) => array.indexOf(item) === index);
	if (newGeoData.length >= 6) {
    	newGeoData.length = 3;
	}
	console.log(newGeoData);
}

// navigator.geolocation.getCurrentPosition() {
//     console.log(location);
// });

// fetch the data with changeable parameters
function getHousesByQuery(city, music, nature, broke) {
	fetch(`http://funda.kyrandia.nl/feeds/Aanbod.svc/json/${APIKEY}/?type=huur&zo=/${city}${music}${nature}${broke}/&page=1&pagesize=25`)
		.then(data => data.json())
		.then(data => results.push(...data.Objects))
		.then(data => showData());
}

// store the selected place
function selectPlace() {
	places.forEach((place) => {
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

