/**
* global variable were gonna set using let
* nav = is navigation to know which month were on as we go to next month +1 and backward -1
* clicked = which ever day we clicked the day is clicked
* events = array of event object from local storage and make sure it exist before we call it
* if we can pull event from the storage we know there is something to pull from it if not its just an empty array 
*if user add or DELETE we manipulate this array
*/

 let nav = 0;
 let clicked = null;
 let events = localStorage.getItem('event') ? JSON.parse(localStorage.getItem('events')) : [];

// array of our weekday order matters
// reference to to the calender and you can just call it

const calendar = document.getElementById('calendar');
const newEventModal = document.getElementById('newEventModal');
const deleteEventModal = document.getElementById('deleteEventModal');
const backDrop = document.getElementById('modalBackDrop');
const eventTitleInput = document.getElementById('eventTitleInput');
const weekdays = ['Sunday','Monday','Tuesday','Wednesday','Thursday','Friday','Saturday'];

//modal are event module to open and close
function openModal(date) {
    clicked = date;

    const eventForDay = events.find(e => e.date === clicked);

    if(eventForDay) {
        document.getElementById('eventText').innerText = eventForDay.title;
        deleteEventModal.style.display = 'block';

    }else{
        newEventModal.style.display = 'block';
    }

    backDrop.style.display = 'block';
}





//to display everything we make a load function

function load(){
    const dt = new Date();

    //only if month isn't changed we build the calender normal but if nav isn't 0 we make sure to add the extra months
    if (nav !== 0){
        dt.setMonth(new Date().getMonth() + nav);
    }

    const day = dt.getDate();
    const month = dt.getMonth();
    const year = dt.getFullYear();


//this is to figure out home many days are in a month cuz some can be more or less
//new Date(,,0= last day of the previous month) to know how many square do we have to create
//also we need to know the first day of the month
    const firstDayOfMonth = new Date(year, month, 1);
    const daysInMonth = new Date(year, month + 1, 0).getDate();

//to know what is the first day of the month and what's the name of that day
//print out the name of the day followed by a comma so ex:friday, 1/1/2024
    const dateString = firstDayOfMonth.toLocaleDateString('en-us', {
        weekday: 'long',
        year: 'numeric',
        month: 'numeric',
        day: 'numeric'
    });
    //the index is split into two part and we want the first part which is the actual day
    const paddingDays = weekdays.indexOf(dateString.split(', ')[0]);

    //weird tick and squiggly are for string interpretation 

    document.getElementById('monthDisplay').innerText = 
    `${dt.toLocaleDateString('en-us',{month: 'long'})} ${year}`;

    calendar.innerHTML = '';

//make the dates but keeps in mind the padding day and also the day left and make the square div for those days
    for(let i = 1; i <= paddingDays + daysInMonth; i++){
        const daySquare = document.createElement('div');
        daySquare.classList.add('day');

        const dayString = `${month + 1}/${i - paddingDays}/${year}`;

        //logic to see if it's a padding day or an actual day
        if(i > paddingDays){
            daySquare.innerText = i - paddingDays;

            const eventForDay = events.find(e => e.date === dayString);

            if(eventForDay){
                const eventDiv = document.createElement('div');
                eventDiv.classList.add('event');
                eventDiv.innerText = eventForDay.title;
                daySquare.appendChild(eventDiv);
            }



            daySquare.addEventListener('click', () => openModal(dayString));
        } else {
            daySquare.classList.add('padding');
        }
        calendar.appendChild(daySquare);
    }
}
//when the folder is open into the bowers it goes right away and call in the function load
//throughout when the user clicks buttons and stuff we can just call it and it's easy like that.

function closeModal(){
    eventTitleInput.classList.remove('error');
    newEventModal.style.display = 'none';
    backDrop.style.display = 'none';
    deleteEventModal.style.display = 'none';
    eventTitleInput.value = '';
    clicked = null;
    load(); 
}
function saveEvent(){
    if(eventTitleInput.value){
        eventTitleInput.classList.remove('error');

        events.push({
            date: clicked,
            title: eventTitleInput.value,
        });

        localStorage.setItem('events' , JSON.stringify(events));
        closeModal();

    }else{
        eventTitleInput.classList.add('error');

    }
   
}
function deleteEvent(){
    events = events.filter(e => e.date !== clicked);
    localStorage.setItem('events', JSON.stringify(events));
    closeModal();
}
//this function hold most buttons
//first were going to use the nav we declared first to know if we should go a month forward or backward
//we call back load and it should reload the page with the new date and name ect
function initButtons(){
    document.getElementById('nextButton').addEventListener('click', () =>{
        nav++;
        load();
    });
    document.getElementById('backButton').addEventListener('click', () =>{
        nav--;
        load();
    });
    document.getElementById('saveButton').addEventListener('click', saveEvent);

    document.getElementById('cancelButton').addEventListener('click', closeModal);

    document.getElementById('deleteButton').addEventListener('click', deleteEvent);
    document.getElementById('closeButton').addEventListener('click', closeModal);

}




initButtons();
load();

