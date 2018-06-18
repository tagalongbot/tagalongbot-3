let { flattenArray, shuffleArray } = require('../../libs/helpers.js');
let { findService } = require('../../libs/data/services.js');
let { getAllProviders, filterProvidersByService } = require('../../libs/data/providers.js');
let { getPracticePromos } = require('../../libs/data/practice/promos.js');
let { toGalleryElement } = require('../../libs/promos/promos.js');
let { createGallery } = require('../../libs/bots.js');

let getServicePromos = async ({ query }, res) => {
  let { service_id, messenger_user_id, first_name, last_name, gender } = query;
  
  let service = await findService(service_id);
  let service_name = service.fields['Name'];

  let providers = await getAllProviders();
  let providers_with_service = filterProvidersByService(service_name, providers);

  let provider_promos = providers_with_service.map(async provider => {
    let provider_id = provider.id;
    let provider_base_id = provider.fields['Practice Base ID'];
    let promos = await getPracticePromos({ provider_base_id });
    return promos.map(
      toGalleryElement({ provider_id, provider_base_id, first_name, last_name, gender, messenger_user_id })
    );
  });
  
  let promos = flattenArray(
    await Promise.all(provider_promos)
  );
  
  let randomPromos = shuffleArray(promos).slice(0, 10);
  
  let gallery = createGallery(randomPromos, 'square');
  let messages = [gallery];
  res.send({ messages });
}

module.exports = getServicePromos;


let express = require('express');
let router = express.Router();

let searchServicePromos = async ({ query }, res) => {
  let { service_id } = query;
  let service = await findService(service_id);
  let service_name = service.fields['Name'];

  let set_attributes = { service_id, service_name };
  let redirect_to_blocks = ['Search Service Promos'];
  res.send({ set_attributes, redirect_to_blocks });
}

let getServicePromos = async ({ query, params }, res) => {
  let { search_type } = params;

  let { messenger_user_id, first_name, last_name, gender } = query;
  let { service_id, search_service_promos_state, search_service_promos_city, search_service_promos_zip_code } = query;

  let service = await findService(service_id);
  let service_name = service.fields['Name'];

  let providers = await getProviders(
    { search_type, search_service_providers_state, search_service_providers_city, search_service_providers_zip_code }
  );

  let providersByService = (providers[0]) ? filterProvidersByService(service_name, providers) : [];

  if (!providersByService[0]) {
    let set_attributes = { service_name }
    let redirect_to_blocks = ['No Service Providers Found'];
    res.send({ set_attributes, redirect_to_blocks });
    return;
  }

  let randomProviders = shuffleArray(providersByService).slice(0, 9).sort(sortProviders).map(
    toGalleryElement({ first_name, last_name, gender, messenger_user_id })
  );

  let last_gallery_element = createLastGalleryElement();
	let providersGallery = createGallery([...randomProviders, last_gallery_element], 'square');
  let messages = [providersGallery];
  res.send({ messages });
}

router.get('/', searchServicePromos);
router.get('/:search_type', getServicePromos);

module.exports = router;









