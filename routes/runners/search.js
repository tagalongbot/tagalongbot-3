let { getRunnerByMessengerID, searchNearbyRunners, createRunner } = require('../../libs/data/runners.js');

let { uploadCloudinaryImage, getFaceFromImage } = require('../../libs/cloudinary.js');

let { createBtn, createGallery } = require('../../libs/bots.js');

let createNewRunner = async (data) => {
  let { messenger_user_id, first_name, last_name, gender, zip_code, messenger_link, profile_image } = data;

  let new_profile_image_url = await uploadCloudinaryImage(
    { image_url: profile_image }
  );

  let face_profile_image_url = await getFaceFromImage(
    { image_url: new_profile_image_url }
  );

  let new_runner_data = {
    ['messenger user id']: messenger_user_id,
    ['Active?']: true,
    ['First Name']: first_name,
    ['Last Name']: last_name,
    ['Gender']: gender,
    ['Zip Code']: Number(zip_code),
    ['Messenger Link']: messenger_link,
    ['Profile Image URL']: face_profile_image_url,
  }

  let new_runner = await createRunner(new_runner_data);

  return new_runner;
}

let toGalleryData = (search_runner) => (runner) => {
  let runner_messenger_user_id = runner.fields['messenger_user_id'];

  let title = `${runner.fields['First Name']} ${runner.fields['Last Name']}`;
  let subtitle = runner.fields['Gender'];
  let image_url = `${runner.fields['Profile Image URL']}`;

  let send_request_btn = createBtn(
    `Send Request|show_block|[JSON] Send Partner Request`,
    { runner_messenger_user_id }
  );

  let buttons = [send_request_btn];

  return { title, image_url, buttons };
}

let searchRunners = async ({ query }, res) => {
  let {
    messenger_user_id,
    first_name,
    last_name,
    gender,
    messenger_link,
    search_gender,
    search_miles,
    zip_code,
    profile_image,
  } = query;

  let runner_searching = await getRunnerByMessengerID(messenger_user_id);
  console.log('runner_searching', runner_searching);

  if (!runner_searching) {
    runner_searching = await createNewRunner(
      { messenger_user_id, first_name, last_name, gender, zip_code, messenger_link, profile_image }
    );
  }

  let mile_radius = {
    ['5 Miles']: 5,
    ['10 Miles']: 10,
    ['15 Miles']: 15,
    ['20 Miles']: 20,
  }[search_miles];

  let runners = await searchNearbyRunners(
    { zip_code, mile_radius }
  );

  let matched_runners = runners.filter(
    runner =>
      runner.id != runner_searching.id &&
      runner.fields['Gender'].toLowerCase() === search_gender.toLowerCase()
  );

  if (!matched_runners[0]) {
    let redirect_to_blocks = ['No Running Partners Found'];
    res.send({ redirect_to_blocks });
    return;
  }

  let gallery_data = matched_runners.map(
    toGalleryData(runner_searching)
  );

  let gallery = createGallery(gallery_data, 'square');

  let messages = [gallery];

  res.send({ messages });
}

module.exports = searchRunners;