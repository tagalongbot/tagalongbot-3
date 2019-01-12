let { getPersonByMessengerID, searchNearbyPeopleByZipCode, searchNearbyPeopleByCity, createPerson } = require('../../libs/data/people.js');

let { createGallery } = require('../../libs/bots.js');

let { createPeopleCards } = require('../../libs/people/search.js');

let searchPeople = async ({ query }, res) => {
  let { messenger_user_id } = query;
  let index = Number(query.index) || 0;

  let person_searching = await getPersonByMessengerID(messenger_user_id);

  if (!person_searching) {
    let redirect_to_blocks = ['Profile Not Created'];
    res.send({ redirect_to_blocks });
    return;
  }

  let gender_preference = person_searching.fields['Gender Preference'];
  let age_preference = person_searching.fields['Age Preference'];
  let city = person_searching.fields['City'];

  if (!gender_preference) {
    let redirect_to_blocks = ['Gender Preference Missing'];
    res.send({ redirect_to_blocks });
    return;
  }

  if (!age_preference) {
    let redirect_to_blocks = ['Age Preference Missing'];
    res.send({ redirect_to_blocks });
    return;
  }

  if (!city) {
    let redirect_to_blocks = ['City Preference Missing'];
    res.send({ redirect_to_blocks });
    return;
  }

  let people = await searchNearbyPeopleByCity(
    { city }
  );

  let matched_people = people.filter(person => {
    if (person.id === person_searching.id) return false;
    return (person.fields['Is Profile Hidden'] === 'NO') && 
    (person.fields['Gender'] === gender_preference || gender_preference === 'both') &&
    age_preference.toUpperCase() === 'ANY' || person.fields['Age'] >= Number(age_preference.slice(0,2))
  });

  if (!matched_people[0]) {
    let redirect_to_blocks = ['No Profiles Found'];
    res.send({ redirect_to_blocks });
    return;
  }

  let gallery_data = matched_people
    .splice(index, 1)
    .map(createPeopleCards(index+1));

  let gallery = createGallery(gallery_data, 'square');

  let messages = [gallery];

  res.send({ messages });
}

module.exports = searchPeople;
