// This is a placeholder file which shows how you can access functions defined in other files.
// It can be loaded into index.html.
// You can delete the contents of the file once you have understood how it works.
// Note that when running locally, in order to open a web page which uses modules, you must serve the directory over HTTP e.g. with https://www.npmjs.com/package/http-server
// You can't open the index.html file using a file:// URL.

import * as common from "./common.mjs";
import { addData, clearData } from "./storage.mjs";
  

document.addEventListener('DOMContentLoaded', () => {
  // 1. Selectors
  const userDropdown = document.getElementById("userDropdown");
  const agendaForm = document.getElementById("agendaForm");
  const dateInput = document.getElementById("dateInput");
  const topicInput = document.getElementById("topicInput");
  const agendaTableBody = document.getElementById("agendaTableBody");
  const noAgendaMsg = document.getElementById("noAgendaMsg");
  const clearBtn = document.getElementById("clearBtn");

  // 2. Setting default date
  const today = new Date().toISOString().split('T')[0];
  dateInput.value = today;

  // 3. Populating the dropdown
  common.getUserIds().forEach(id => {
    userDropdown.add(new Option(`User ${id}`, id));
  });

  async function syncTable() {
    const userId = userDropdown.value;
    agendaTableBody.innerHTML = ""; 

    if (!userId) return;

    // Fetch data and sort chronologically
    const rawData = await common.fetchValidUserAgenda(userId, common.getUserIds()) || [];
    const sortedData = common.prepareFinalAgenda(rawData) || [];

    // Filter: Only show items newer than 1 week ago 
    const oneWeekAgo = new Date();
    oneWeekAgo.setDate(now.getDate() - 7);

    const filteredData = sortedData.filter(item => {
      const itemDate = new Date(item.date);
      return itemDate >= oneWeekAgo;
    });

    noAgendaMsg.hidden = filteredData.length > 0;

    // Render the Rows
    filteredData.forEach(item => {
      const formatted = common.formatUserDate(item.date);
      const row = `<tr> 
                     <td>${item.topicName}</td>
                     <td>${formatted}</td>
                   </tr>`;
      agendaTableBody.insertAdjacentHTML("beforeend", row);
    });
  }

  // 4. Event listeners 
  userDropdown.onchange = syncTable; 

  agendaForm.onsubmit = (e) => {
    e.preventDefault();
    
    const topic = topicInput.value.trim();
    const startDate = dateInput.value;

    if (!topic || !startDate || !userDropdown.value) return;


    const weekEntry = {
      topicName: topic,
      date: common.calculateReviewDate(startDate, 0, 7)
    };
    addData(userDropdown.value, weekEntry);

    const intervals = [1, 3, 6, 12];
    intervals.forEach(months => {
      const newEntry = {
        topicName: topic,
        date: common.calculateReviewDate(startDate, months)
      };
      addData(userDropdown.value, newEntry);
    });
    
    agendaForm.reset();
    dateInput.value = today;
    syncTable();
  };

  // 5. Clearing the agenda
  clearBtn.addEventListener("click", function (e) {
    e.preventDefault();
    let selectedUserId = userDropdown.value;
    
    if (!selectedUserId) return;
    clearData(selectedUserId);
    syncTable();
  });
});