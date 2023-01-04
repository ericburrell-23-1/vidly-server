async function create(Model, modelInfo, callback) {
  const instance = new Model(modelInfo);
  try {
    const result = await instance.save();
    console.log(result);
    callback(result);
  } catch (ex) {
    console.log(ex.message);
  }
}

async function retrieve(Model, filter = {}, callback) {
  const documents = await Model.find(filter).sort("name");
  callback(documents);
}

async function retrieveMany(Models, ids, callback) {
  // Accepts an array of Mongoose models and an array of corresponding document IDs,
  // and accepts them as an argument to a callback function
  let documents = [];
  for (index in Models) {
    await retrieve(Models[index], { _id: ids[index] }, (document) => {
      documents.push(document[0]);
    });
  }
  callback(documents);
}

async function update(Model, id, newObj, callback) {
  const result = await Model.findByIdAndUpdate(
    id,
    {
      $set: newObj,
    },
    { new: true }
  );
  callback(result);
}

async function remove(Model, id, callback) {
  const removedItem = await Model.findByIdAndRemove(id);
  callback(removedItem);
}

module.exports.create = create;
module.exports.retrieve = retrieve;
module.exports.retrieveMany = retrieveMany;
module.exports.update = update;
module.exports.remove = remove;
