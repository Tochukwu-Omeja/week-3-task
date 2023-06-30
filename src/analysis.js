const { getTrips, getDriver } = require("api");

/**
 * This function should return the trip data analysis
 *
 * Question 3
 * @returns {any} Trip data analysis
 */
async function analysis() {
  // Your code goes here
  	const trips = await getTrips();
  	// console.log(trips);
	let noOfCashTrips = 0;
	let noOfNonCashTrips = 0;
	let cashBilledTotal = 0
	let nonCashBilledTotal = 0
	let noOfDriversWithMoreThanOneVehicle = 0
	const driverObj = {}
	
	for (const trip of trips){
		if (trip.isCash){
			noOfCashTrips++;
			cashBilledTotal += Number(trip.billedAmount.toString().replace(',', ''));
		}else{
			noOfNonCashTrips++;
			nonCashBilledTotal += Number(trip.billedAmount.toString().replace(',',''))
		}
		let driverDetails;
		if (!Object.keys(driverObj).includes(trip.driverID)){
			try{
				driverDetails = await getDriver(trip.driverID);
			}
			catch{
				driverDetails = {
					vehicleID: [],
					name: '',
					gender: '',
					agent: '',
					email: '',
					phone: ''
				}
			}
			// console.log(driverDetails);
			driverDetails.countTrips = 1;
			driverDetails.earnings = Number(trip.billedAmount.toString().replace(',', ''));
			driverObj[trip.driverID] = driverDetails;
		} else{
			// todo
			driverDetails = driverObj[trip.driverID];
			driverDetails.countTrips++;
			driverDetails.earnings += Number(trip.billedAmount.toString().replace(',', ''));
		}

	}
	console.log(driverObj);
	// console.log(noOfCashTrips);
	// console.log(noOfNonCashTrips);
	let noOfTripsMax = 0;
	let topDriverID = 'tochukwu';
	let earningMax = 0;
	let richestDriverID = 'tochukwu';
	for (const driverID in driverObj){
		const driverDetails = driverObj[driverID];
		if (driverDetails.vehicleID.length > 1){
			noOfDriversWithMoreThanOneVehicle++;
		}
		if (driverDetails.countTrips > noOfTripsMax){
			noOfTripsMax = driverDetails.countTrips;
			topDriverID = driverID;
		}
		if (driverDetails.earnings > earningMax){
			earningMax = driverDetails.earnings;
			richestDriverID = driverID;
		}
	}

	const results = {
		noOfCashTrips: noOfCashTrips,
		noOfNonCashTrips: noOfNonCashTrips,
		cashBilledTotal: cashBilledTotal,
		nonCashBilledTotal: nonCashBilledTotal,
		billedTotal: cashBilledTotal + nonCashBilledTotal,
		noOfDriversWithMoreThanOneVehicle: noOfDriversWithMoreThanOneVehicle,
		"mostTripsByDriver": {
			"name": driverObj[topDriverID].name,
			"email": driverObj[topDriverID].email,
			"phone": driverObj[topDriverID].phone,
			"noOfTrips": driverObj[topDriverID].countTrips,
			"totalAmountEarned": driverObj[topDriverID].earnings
		},
		"highestEarningDriver": {
			"name": driverObj[richestDriverID].name,
			"email": driverObj[richestDriverID].email,
			"phone": driverObj[richestDriverID].phone,
			"noOfTrips": driverObj[richestDriverID].countTrips,
			"totalAmountEarned": driverObj[richestDriverID].earnings
		}
	}
	console.log(results);
}


analysis();
module.exports = analysis;
