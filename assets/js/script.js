const loader = document.querySelector('#loaderbox');
const placeButtons = document.querySelectorAll('.cities button');
const buyOrRentButtons = document.querySelectorAll('.buyrent button');
const defineButtons = document.querySelectorAll('.who button');
const buyrent = document.querySelector('.buyrent');
const cities = document.querySelector('.cities');
const who = document.querySelector('.who');
const houses = document.querySelector('.houses');
const options = document.querySelector('.options');
const results = document.querySelector('.results');

const app = (function() {

	const fundaData = [];
	const geoData = [];
	const newGeoData = [];
	let buyOrRentChoice = '';
	let placeChoice = '';
	let i = 0;
	let j = 0;

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
			.then(data => convertButtons())
			.catch(error => console.log(error));

	// cut it down to the 3 nearest locations and push it into a global array
	function getThreeLocations(allData) {
		allData = geoData
			.map(data => data.adminName2)
			.filter((data, index, array) => array.indexOf(data) === index)
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
		placeButtons.forEach((button) => {
			button.textContent = newGeoData[i];
			i++;
		});
	}

	// store the selected place
	function selectPlace() {
		newGeoData.forEach((place) => {
			if (this.textContent === place) {
				placeChoice = this.textContent;
			}
		});
	}

	placeButtons.forEach(button => button.addEventListener('click', selectPlace));

	// store if they want to buy or rent
	function buyOrRent() {
		if (this.textContent.includes('open')) {
			buyOrRentChoice = 'koop';
			defineButtons[2].innerHTML = 'Voorzichtig';
		} else {
			buyOrRentChoice = 'huur';
		}
	}

	buyOrRentButtons.forEach(button => button.addEventListener('click', buyOrRent));

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

	defineButtons.forEach(button => button.addEventListener('click', selectChoice));

	// fetch the data with changeable parameters
	function getHousesByQuery(buy, place, who, yard, broke) {
		fetch(`${fundaUrl}${APIKEY}/?type=${buy}&zo=/${place}${who}${yard}${broke}/&page=1&pagesize=25`)
			.then(data => data.json())
			.then(data => fundaData.push(...data.Objects))
			.then(data => showData())
			.then(data => noResult())
			.then(loadingComplete)
			.catch(error => console.log(error));
	}

	// fade out loading screen once the data is loaded
	function loadingComplete() {
		loader.classList.remove('hide');
		loader.classList.add('flex');
		loader.classList.add('smoothness');
	}

	// renders the right data into the page 
	function showData() {
		const newResults = fundaData
			.map(data => houseDom(data))
			.join('');
		renderToDom(newResults);
	}

	// returns this html as a template string
	function houseDom(house) {
		return `
			<div>
				<p>€${house.Prijs.Huurprijs === null ? house.Prijs.Koopprijs : house.Prijs.Huurprijs}</p>
				<img src="${house.FotoLarge}">
				<p>${house.Adres}</p>
			</div>
		`;
	}

	// render ele's to HTML
	function renderToDom(elements) {
		houses.innerHTML = elements;
	}

	// if there are no houses found, render a 'no-result' message
	function noResult() {
		if (fundaData.length < 1) {
			houses.innerHTML = errorDom();
			getSuggestions();
		}
	}

	// fill every h3 element with a location nearby
	function getSuggestions() {
		const suggestions = document.querySelectorAll('h3');
		suggestions.forEach((sug) => {
			sug.textContent = newGeoData[j];
			j++;
		});
	}

	// returns this html as a template string
	function errorDom() {
		return `
			<div>
				<h2>Geen huizen gevonden, jammer zeg</h2>
				<p class="alt">Zoek anders op 1 van de volgende locaties:</p>
				<div class="sugs">
					<h3></h3>
					<h3></h3>
					<h3></h3>
				</div>
				<button class="restart" onclick="window.location.reload()">Opniew zoeken</button>			
			</div>
		`;
	}
})();

const toggles = (function() {

	// show/hide the options on select
	function showBuyOrRent() {
		cities.classList.add('hide');
		buyrent.classList.remove('hide');
	}

	// show/hide the options on select
	function showOptions() {
		buyrent.classList.add('hide');
		who.classList.remove('hide');
	}

	// hide the choices and show the houses
	function showHouses() {
		options.classList.add('hide');
		results.classList.remove('hide');
	}

	placeButtons.forEach(button => button.addEventListener('click', showBuyOrRent));
	buyOrRentButtons.forEach(button => button.addEventListener('click', showOptions));
	defineButtons.forEach(button => button.addEventListener('click', showHouses));

	// refresh the page when you click on the logo
	results.addEventListener('click', () => window.location.reload());
})();
