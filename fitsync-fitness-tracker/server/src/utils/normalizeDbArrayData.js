// Utility function used to create a normalized object from an array produced by the mongoose find function.
// Pass in the array containing the mongoose data and the array containing the fields you want to return in an object;
export function normalizeDBArrayData(dbArray, fieldsArray){
    const normalizedArray = dbArray.map((item) => {
         const newItem = {};
         for(let i = 0; i < fieldsArray.length; i++){
            const field = fieldsArray[i];
            newItem[field] = item[field]
         }

         return newItem;
    });

    return normalizedArray;
}