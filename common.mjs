
import { getData } from "./storage.mjs";

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

export function prepareFinalAgenda(eventList) {
 if (!Array.isArray(eventList)) return [];

 //1. filtering the list
 const cleanList = eventList.filter(item => item && item.date && item.topicName);

 return cleanList.sort((a, b) =>  {
  const dateCompare = (a.date || "").localeCompare(b.date || "");
  if(dateCompare !== 0) return dateCompare;
  return (a.topicName || "").localeCompare(b.topicName || "");
 });

}

export function formatUserDate(dateString){
  const dateObj = new Date(dateString);

  //target the day and determine the ordinal
  const day = dateObj.getUTCDate();
  let ordinal = "th";

  if(day< 11 || day > 13) {
    switch(day % 10){
      case 1: ordinal = "st"; break;
      case 2: ordinal = "nd"; break;
      case 3: ordinal = "rd"; break;
    }

  }

  //get the full month name
  const month = dateObj.toLocaleDateString('en-GB',
     { month: 'long', 
      timeZone: 'UTC'
    });
  
  //getting the year
  const year = dateObj.getUTCFullYear();

  return `${day}${ordinal}, ${month} ${year}`;
}

export function calculateReviewDate(startDate, monthsToAdd, daysToAdd = 0){
  const d = new Date(startDate);

  const originalDay = d.getUTCDate();

  d.setUTCMonth(d.getUTCMonth() + monthsToAdd);

  if(d.getUTCDate() !== originalDay){
    d.setUTCDate(0);
  }

  d.setUTCDate(d.getUTCDate() + daysToAdd);

  return d.toISOString().split('T')[0];
}