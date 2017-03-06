// object API

fetch(`http://funda.kyrandia.nl/feeds/Aanbod.svc/json/detail/${APIKEY}/koop/643335c8-380f-4350-b0df-dff5b6da1573/`, { mode: 'cors' })
	.then(data => data.json())
	.then(data => console.log(data))


// search API

fetch(`http://funda.kyrandia.nl/feeds/Aanbod.svc/json/${APIKEY}/?type=koop&zo=/amsterdam/tuin/&page=1&pagesize=25`, { mode: 'cors' })
	.then(data => data.json())
	.then(data => console.log(data))

