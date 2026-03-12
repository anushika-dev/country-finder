const countryForm = document.querySelector("#countryForm");
const countryInput = document.querySelector("#countryInput");
const statusText = document.querySelector("#status");
const resultCard = document.querySelector("#resultCard");
const flagImg = document.querySelector("#flagImg");
const nameCommon = document.querySelector("#nameCommon");
const nameOfficial = document.querySelector("#nameOfficial");
const cca2 = document.querySelector("#cca2");
const cca3 = document.querySelector("#cca3");
const regionChip = document.querySelector("#regionChip");
const subregionChip = document.querySelector("#subregionChip");
const capital = document.querySelector("#capital");
const population = document.querySelector("#population");
const area = document.querySelector("#area");
const timezones = document.querySelector("#timezones");
const languages = document.querySelector("#languages");
const currencies = document.querySelector("#currencies");
const callingCode = document.querySelector("#callingCode");
const tld = document.querySelector("#tld");
const borders = document.querySelector("#borders");
const coatImg = document.querySelector("#coatImg");
const gmaps = document.querySelector("#gmaps");
const osmaps = document.querySelector("#osmaps");

// Helper function to show list items
function renderItems(listItems, listData, renderData) {
	listItems.textContent = "";

	if (!listData) {
		listItems.textContent = "No data found";
	} else {
		listData?.forEach((data) => {
			const li = document.createElement("li");
			li.textContent = renderData(data);
			listItems.appendChild(li);
		});
	}
}

// Helper function to set values to different attributes for different elements
function setAttributeData(element, attribute, value) {
	if (value === undefined || value === null) {
		element.removeAttribute(attribute);
		return;
	}

	element.setAttribute(attribute, value);
}

// Helper function to hide if there is no data from API
function displayElement(el, attr, val) {
	setAttributeData(el, attr, val);
	el.style.display = val ? "" : "none";
}

// Helper function to show the badges (calling code and borders)
function showBadges(element, values, renderData) {
	element.textContent = "";

	if (!Array.isArray(values) || values.length === 0) {
		element.textContent = "No data found";
	} else {
		values.forEach((val) => {
			const span = document.createElement("span");
			span.textContent = renderData(val);
			element.appendChild(span);
		});
	}
}

function fetchAPI(e) {
	e.preventDefault();

	const apiUrl = `https://restcountries.com/v3.1/name/${countryInput.value}`;

	fetch(apiUrl)
		.then((response) => {
			return response.json();
		})
		.then((data) => {
			const currentIndex = 0;

			statusText.textContent = `Showing ${currentIndex + 1} of ${
				data.length
			} matches`;

			data.forEach((item) => {
				resultCard.classList.remove("hidden");
				statusText.classList.remove("err");
				statusText.classList.add("ok");
				flagImg.setAttribute("src", item.flags.png);
				nameCommon.textContent = item.name.common;
				nameOfficial.textContent = item.name.official;
				cca2.textContent = item.cca2;
				cca3.textContent = item.cca3;
				regionChip.textContent = item.region;
				subregionChip.textContent = item.subregion;
				capital.textContent = item.capital;
				population.textContent = item.population.toLocaleString();
				area.textContent = item.area.toLocaleString();

				const timezonesData = item.timezones;
				renderItems(timezones, timezonesData, (time) => {
					return time;
				});

				const languagesData = item.languages;

				renderItems(languages, Object.values(languagesData), (lang) => {
					return lang;
				});

				const currrenciesData = item.currencies;

				renderItems(currencies, Object.entries(currrenciesData), (currency) => {
					return `${currency[1].name} (${currency[1].symbol}) — ${currency[0]}`;
				});

				const idRoot = item.idd.root;
				const idSuffixes = item.idd.suffixes;
				showBadges(callingCode, idSuffixes, (suffix) => {
					return idRoot + suffix;
				});

				const tldData = item.tld;
				renderItems(tld, tldData, (list) => {
					return list;
				});

				const bordersData = item.borders;
				showBadges(borders, bordersData, (border) => {
					return border;
				});

				displayElement(coatImg, "src", item.coatOfArms.png);
				displayElement(gmaps, "href", item.maps.googleMaps);
				displayElement(osmaps, "href", item.maps.openStreetMaps);
			});
		})
		.catch((err) => {
			console.error(err);
			statusText.textContent = "No result found";
			statusText.classList.add("err");
			resultCard.classList.add("hidden");
		});
}

countryForm.addEventListener("submit", fetchAPI);
