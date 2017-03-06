// object API

// fetch(`http://funda.kyrandia.nl/feeds/Aanbod.svc/json/detail/${APIKEY}/koop/643335c8-380f-4350-b0df-dff5b6da1573/`)
// 	.then(data => data.json())
// 	.then(data => console.log(data))


// search API

const body = document.querySelector('body');
const results = [];

fetch(`http://funda.kyrandia.nl/feeds/Aanbod.svc/json/${APIKEY}/?type=koop&zo=/diemen/&page=1&pagesize=25`)
	.then(data => data.json())
	.then(data => results.push(...data.Objects))
	.then(data => showData());


function showData() {
	const newResults = results
		// .map(data => console.log(data.WGS84_Y))
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
			<p>${house.PrijsGeformatteerdHtml}</p>
		</div>
	`;
}

function renderToDom(elements) {
	body.innerHTML = elements;
}

const geo = navigator.geolocation;
let coords = '';

const getCoords = function (pos) {
	
	let x = pos.coords.latitude;
	let y = pos.coords.longitude;

	coords =  {
		x:x,
		y:y
	};
}; 

geo.getCurrentPosition(getCoords);




