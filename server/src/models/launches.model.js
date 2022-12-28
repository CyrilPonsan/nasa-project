const axios = require("axios");

const launches = require("./launches.mongo");
const planets = require("./planets.mongo.db");

const DEFAULT_FLIGHT_NUMBER = 100;

async function abortLaunchById(launchId) {
  const aborted = await launches.updateOne(
    {
      flightNumber: launchId,
    },
    { upcoming: false, success: false }
  );
  return aborted.modifiedCount === 1;
}

const launch = {
  flightNumber: 100, //  flight_number
  mission: "Kepler Exploration X", //  name
  rocket: "Explorer IS1", //  rocket.name
  launchDate: new Date("December 27, 2030"), //  date_local
  target: "Kepler-442 b", //  not applicable
  customer: ["ZTM", "NASA"], //  payload.customers for each payload
  upcoming: true, //  upcoming
  success: true, //  success
};

saveLaunch(launch);

const SPACEX_API_URL = "https://api.spacexdata.com/v4/launches/query";

async function loadLaunchData() {
  console.log("Downloading some data ...");
  const response = await axios.post(SPACEX_API_URL, {
    query: {},
    options: {
      pagination: false,
      populate: [
        {
          path: "rocket",
          select: {
            name: 1,
          },
        },
        {
          path: "payloads",
          select: {
            customers: 1,
          },
        },
      ],
    },
  });
  const launchDocs = response.data.docs;
  for (const launchDoc of launchDocs) {
    const payloads = launchDoc["payloads"];
    const customers = payloads.flatMap((payload) => payload["customers"]);
    const launch = {
      flightNumber: launchDoc["flight_number"],
      mission: launchDoc["name"],
      rocket: launchDoc["rocket"]["name"],
      launchDate: launchDoc["date_local"],
      upcoming: launchDoc["upcoming"],
      success: launchDoc["success"],
      customers,
    };
    console.log(`${launch.flightNumber} ${launch.mission} ${launch.customers}`);
  }
}

async function existsLaunchWithId(launchId) {
  return await launches.findOne({
    flightNumber: launchId,
  });
}

async function scheduleNewLaunch(launch) {
  const newFlightNumber = (await getLatestFLightNumber()) + 1;
  const newLaunch = Object.assign(launch, {
    success: true,
    upcoming: true,
    customers: ["ZTM", "NASA"],
    flightNumber: newFlightNumber,
  });
  await saveLaunch(newLaunch);
}

async function getLatestFLightNumber() {
  const latestLaunch = await launches.findOne().sort("-flightNumber");
  if (!latestLaunch) {
    return DEFAULT_FLIGHT_NUMBER;
  }
  return latestLaunch.flightNumber;
}

async function getAllLaunches() {
  return await launches.find({}, { _id: 0, __v: 0 });
}

async function saveLaunch(launch) {
  const planet = await planets.find({
    keplerName: launch.target,
  });
  if (!planet) {
    throw new Error("No matching planet found!");
  }

  await launches.findOneAndUpdate(
    {
      flightNumber: launch.flightNumber,
    },
    launch,
    { upsert: true }
  );
}

module.exports = {
  loadLaunchData,
  existsLaunchWithId,
  abortLaunchById,
  scheduleNewLaunch,
  saveLaunch,
  getAllLaunches,
};
