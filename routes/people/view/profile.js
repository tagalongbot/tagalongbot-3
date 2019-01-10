let riot = require('riot');

let user_profile_tag = require('../../../tags/user-profile.tag');
let view_template = require('../../../views/user-profile.marko');

let { getPersonByMessengerID } = require('../../../libs/data/people.js');

let { capitalizeString } = require('../../../libs/helpers/strings.js');

let viewProfile = async ({ query }, res) => {
  let { tagged_person_messenger_id } = query;

  let person = await getPersonByMessengerID(tagged_person_messenger_id);

  let profile_images = Object.keys(person.fields)
    .filter(field => field.startsWith('Profile Image URL'))
    .map(field => person.fields[field]);

  let person_data = {
    ['first_name']: person.fields['First Name'],
    ['last_name']: person.fields['Last Name'],
    ['gender']: capitalizeString(person.fields['Gender']),
    ['interests']: person.fields['Interests'] ? person.fields['Interests'].map(interest => ({ interest })) : [],
    ['professions']: person.fields['Professions'] ? person.fields['Professions'].map(profession => ({ profession })) : [],
    ['profile_image_url']: profile_images[0],
    ['photos']: profile_images.map(url => ({ url }))
  }

  let view_html = riot.render(
    user_profile_tag,
    { person: person_data }
  );

  res.marko(
    view_template,
    { view_html, person: person_data }
  );
}

module.exports = viewProfile;
