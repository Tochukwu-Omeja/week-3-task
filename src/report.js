const { getTrips, getVehicle, getDriver } = require('api');

/**
 * This function should return the data for drivers in the specified format
 *
 * Question 4
 *
 * @returns {any} Driver report data
 */
async function driverReport() {
  // Your code goes here
  const trips = await getTrips();
  const driverObj = {};
  for (const trip of trips) {
    let currentDriver;  //
    const tripDetails = {
      user: trip.user.name,
      created: trip.created,
      pickup: trip.pickup,
      destination: trip.destination,
      billed: trip.billedAmount,
      isCash: trip.isCash
    };
    let driverDetails;
    if (!Object.keys(driverObj).includes(trip.driverID)) {
      try {
        driverDetails = await getDriver(trip.driverID);
      }
      catch {
        driverDetails = {
          vehicleID: [],
          name: '',
          gender: '',
          agent: '',
          email: '',
          phone: ''
        }
      }
      currentDriver = {
        fullName: driverDetails.name,
        id: trip.driverID,
        phone: driverDetails.phone,
        noOfVehicles: driverDetails.vehicleID.length,
        vehicles: {},
        noOfCashTrips: trip.isCash ? 1 : 0,
        noOfNonCashTrips: !trip.isCash ? 1 : 0,
        totalCashAmount: trip.isCash ? Number(trip.billedAmount.toString().replace(',', '')) : 0,
        totalNonCashAmount: !trip.isCash ? Number(trip.billedAmount.toString().replace(',', '')) : 0,
        trips: [tripDetails]

      }
      currentDriver.noOfTrips = currentDriver.noOfCashTrips + currentDriver.noOfNonCashTrips;
      currentDriver.totalAmountEarned = currentDriver.totalCashAmount + currentDriver.totalNonCashAmount;
      driverObj[trip.driverID] = currentDriver;

    } else {
      currentDriver = driverObj[trip.driverID]
      if (trip.isCash) {
        currentDriver.noOfCashTrips++
        currentDriver.totalCashAmount += Number(trip.billedAmount.toString().replace(',', ''))
      }else{
        currentDriver.noOfNonCashTrips++
        currentDriver.totalNonCashAmount += Number(trip.billedAmount.toString().replace(',', ''))
      }
    }
    console.log('currentdriver',currentDriver);
  }
  // console.log(trips);
}
driverReport();

module.exports = driverReport;
