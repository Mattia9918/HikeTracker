import { Hike } from "../Classes/Hike";

const APIURL = "http://localhost:3001/api/";

async function getHikes() {
	const url = APIURL + `hikes`;
	try {
		const response = await fetch(url, {
			credentials: "include",
		});
		if (response.ok) {
			const list = await response.json();
			const hikeList = list.map((hike) => {
				const params = [
					hike.id,
					hike.title,
					hike.length,
					hike.description,
					hike.difficulty,
					hike.ascent,
					hike.estimatedTime,
					hike.localguideUsername,
					hike.startingPoint,
					hike.pointsOfInterest,
					hike.endingPoint,
				];
				return new Hike(params);
			});
			return hikeList;
		} else {
			/* Application error */
			const appErrText = await response.text();
			throw new TypeError(appErrText);
		}
	} catch (err) {
		/* Network error */
		console.log(err);
		throw err;
	}
}

async function getFilter(filterObj) {
	console.log(filterObj);
	// let couple;

	//  if (value !== undefined && typeof value !== "object") {
	//      couple = value.split(',')
	//  } else if (typeof value === "object") {
	//     let northEastLimit = value._northEast;
	//     let southWestLimit = value._southWest;
	//     let neLat = northEastLimit.lat;
	//     let neLng = northEastLimit.lng;
	//     let swLat = southWestLimit.lat;
	//     let swLng = southWestLimit.lng;
	//     couple = [[neLat, neLng], [swLat, swLng]]
	//  } else {
	//      couple = [undefined, undefined]
	//  }
	const url = APIURL + `hikes/filter`;
	try {
		const response = await fetch(url, {
			method: "POST",
			credentials: "include",
			headers: {
				"Content-Type": "application/json",
			},
			body: JSON.stringify(filterObj),
		});
		if (response.ok) {
			const list = await response.json();
			console.log(list);
			const filteredHikeList = list.map((hike) => {
				const params = [
					hike.id,
					hike.title,
					hike.length,
					hike.description,
					hike.difficulty,
					hike.ascent,
					hike.estimatedTime,
					hike.localguideUsername,
					hike.startingPoint,
					hike.pointsOfInterest,
					hike.endingPoint,
				];
				return new Hike(params);
			});
			return filteredHikeList;
		} else {
			/* Application error */
			const appErrText = await response.text();
			throw new TypeError(appErrText);
		}
	} catch (err) {
		/* Network error */
		console.log(err);
		throw err;
	}
}

async function getHikeCities() {
	const url = APIURL + `cities`;
	try {
		const response = await fetch(url, {
			credentials: "include",
		});
		if (response.ok) {
			const citieslist = await response.json();
			return citieslist;
		} else {
			/* Application error */
			const appErrText = await response.text();
			throw new TypeError(appErrText);
		}
	} catch (err) {
		/* Network error */
		console.log(err);
		throw err;
	}
}

async function getHikeProvinces() {
	const url = APIURL + `provinces`;
	try {
		const response = await fetch(url, {
			credentials: "include",
		});
		if (response.ok) {
			const provinceslist = await response.json();
			return provinceslist;
		} else {
			/* Application error */
			const appErrText = await response.text();
			throw new TypeError(appErrText);
		}
	} catch (err) {
		/* Network error */
		console.log(err);
		throw err;
	}
}

async function putHikePoint(obj, type) {
	let url;

	switch (type) {
		case "start":
			url = APIURL + `hike/${obj.hikeid}/startingPoint`;
			break;

		case "intermediate":
			url = APIURL + `hike/${obj.hikeid}/intermediatePoint`;
			break;

		case "end":
			url = APIURL + `hike/${obj.hikeid}/arrivalPoint`;
			break;

		default:
			console.log("unreachable switch case");
			break;
	}

	try {
		console.log(obj);

		const response = await fetch(url, {
			method: "PUT",
			credentials: "include",
			headers: {
				"Content-Type": "application/json",
			},
			body: JSON.stringify({
				id: obj.pointid,
			}),
		});
		if (response.ok) {
			return true;
		} else {
			/* Application error */
			const appErrText = await response.text();
			console.log(response);
			throw new TypeError(appErrText);
		}
	} catch (error) {
		console.log(error);
		throw error;
	}
}

const APIHikes = {
	getFilter,
	getHikes,
	getHikeCities,
	getHikeProvinces,
	putHikePoint,
};
export default APIHikes;
