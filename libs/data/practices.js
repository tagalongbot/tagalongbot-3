let { PRACTICE_DATABASE_BASE_ID, DEFAULT_PROVIDER_IMAGE, SEARCH_PROVIDERS_MORE_OPTIONS_IMAGE_URL } = process.env;
let { getTable, getAllDataFromTable, findTableData, updateTableData } = require('../../libs/data.js');

let getPracticeTable = getTable('Practices');
let practiceTable = getPracticeTable(PRACTICE_DATABASE_BASE_ID);
let getPractices = getAllDataFromTable(practiceTable);
let findPractice = findTableData(practiceTable);
let updatePracticeFromTable = updateTableData(practiceTable);

let getAllPractices = async () => {
  let practices = await getPractices();
  return practices;
}

let getPracticeByUserID = async (messenger_user_id, fields = []) => {
  let filterByFormula = `{Claimed By Messenger User ID} = '${messenger_user_id}'`;
  let [user] = await getPractices({ filterByFormula, fields });
  return user;
}

let getPracticeByID = async (practice_id) => {
  let practice = await findPractice(provider_id);
  return practice;
}

let updatePractice = async (updateData, practice) => {
  let updatedProvider = updatePracticeFromTable(updateData, practice);
  return updatedProvider;
}

let getPracticesByState = async ({ state_name, active }) => {
  let filterByFormula = `{All Uppercase Practice State} = '${state_name.trim().toUpperCase()}'`;

  if (active) filterByFormula = `AND(${filterByFormula}, {Active?})`;
	let practices = await getPractices({ filterByFormula });

	return practices;
}

let getPracticesByCity = async ({ city_name, active }) => {
  let filterByFormula = `{All Uppercase Practice City} = '${city_name.trim().toUpperCase()}'`;

  if (active) filterByFormula = `AND(${filterByFormula}, {Active?})`;
	let practices = await getPractices({ filterByFormula });

	return practices;
}

let getPracticesByZipCode = async ({ zip_code, active }) => {
  let filterByFormula = `{Practice Zip Code} = '${zip_code.trim().toUpperCase()}'`;

  if (active) filterByFormula = `AND(${filterByFormula}, {Active?})`;
	let practices = await getPractices({ filterByFormula });

	return practices;
}

let filterPracticessByService = (service_name, practices) => {
  let service_name_lowercased = service_name.trim().toLowerCase();

  let serviceToLowerCase = service => service.toLowerCase();

  let practicesByService = practices.filter(
    (practice) => practice.fields['Practice Services'].map(serviceToLowerCase).includes(service_name_lowercased)
  );

  return practicesByService;
}

let sortPractices = (provider1, provider2) => {
  if (provider1.fields['Active?'] && !provider2.fields['Active?']) return -1;
  if (provider1.fields['Active?'] && provider2.fields['Active?']) return 0;
  if (!provider1.fields['Active?']) return 1;
}

module.exports = {
  getAllPractices,
  getPracticeByUserID,
  getPracticeByID,
  updatePractice,
  getPracticesByState,
  getPracticesByCity,
  getPracticesByZipCode,
  filterPracticessByService,
  sortPractices,
}