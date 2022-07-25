
/**
 * Transforms fields in recordformatschema into a valid schema structure by making a new object with field_name
 * as a key, asside from that it removes the ff properties (some are autogenerated by schemas):
 * -field_name
 * -_id
 * -__V
 * 
 * NOTE: This method assumes that fields that is provided from the recordFormSchema is properly validated
 * for each type of fields.
 * 
 * @param {recform_fields} recform_fields 
 * @returns 
 * returns an object with field_name as a key define in the fields element
 * with element value excluded the field_name
 * 
 * it is used for defining the structure for a schema
 */
function recordFormatFieldsToSchemaStructure(recform_fields){
    const schemaStruct = {};

    recform_fields.forEach(element => {
        let fieldOptions = element.toObject();
        let fieldName = fieldOptions.field_name;
        delete fieldOptions.field_name;
        delete fieldOptions._id;
        delete fieldOptions.__v;
        schemaStruct[fieldName] = fieldOptions;
    });

    return schemaStruct;
}

/**
 * Remove all the properties in obj define in keyToKeep an array that contains key
 * to keep or exclude from removing.
 * 
 * @param {Object} obj 
 * @param {Array} keyToKeep 
 * @returns 
 * 
 * returns a new object contains all the properties define in the keyToKeep array.
 */
function cleanObj(obj, keyToKeep){
    let cObj = {};
    keyToKeep.forEach((k) => {
        if(obj[k] !== undefined)
            cObj[k] = obj[k];
    });
    return cObj;
}

module.exports = {
    recordFormatFieldsToSchemaStructure,
    cleanObj,
}