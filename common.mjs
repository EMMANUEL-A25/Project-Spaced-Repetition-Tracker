import { getData, addData, clearData } from "./storage.mjs";

export function getUserIds() {
  return ["1", "2", "3", "4", "5"];
}

export async function fetchValidUserAgenda(userId, availableIds){
  //checking if the selected id is in our allowed?
   
  if(!availableIds.includes(userId)){
    console.warn("Invalid User ID selected");
    return null;
  }
  const data =  await getData(userId);
 return data || [];
} 

//organising the topic in to individual events
export function flattenTopicsToEvents(topics){
  const flatList = [];

  if(!Array.isArray(topics)) return flatList;//returns an empty list if the topic is not an array

  topics.forEach(topic => {
    topic.revisionDates.forEach(dateStr => {
       flatList.push({
        topicName: topic.topicName,
        date: dateStr
       }) ;
    });
  });
  return flatList;
}

//calculating our revision dates using UTC
export function calculateRevisionDatesUTC(startDateString){

  const date = new Date(startDateString);

  const intervals = [
    { unit: 'days', value: 7},
    { unit: 'months', value: 1},
    { unit: 'months', value: 3},
    { unit: 'months', value: 6},
    { unit: 'months', value: 12},
  ];

  return intervals.map(interval => {
    const result = new Date(date); //local date/javascript date cloned.
    if (interval.unit === 'days') {
      result.setUTCDate(result.getUTCDate() + interval.value);

    } else{
      result.setUTCMonth(result.getUTCMonth() + interval.value);
    }
    return result.toISOString().split('T')[0];
  });
}


export function prepareFinalAgenda(eventList) {
  const now = new Date();//javascript date
  const todayUTC = now.toISOString().split('T')[0];

  //sorting event list.
  return eventList
       .filter(event => event.date >= todayUTC)
       .sort((a, b) => {

         const dateCompare = a.date.localeCompare(b.date);
         if(dateCompare !== 0) return dateCompare;

        return a.topicName.localeCompare(b.topicName);//this is a tie breaker keeps the code clean and not ever chaging
       });


}