const days = document.querySelectorAll('.dayBtn');
console.log(days)
document.getElementById("workday").addEventListener("change", () => {
    document.getElementById("barb").removeAttribute("disabled")
})
document.getElementById("barb").addEventListener("change", () => {
    document.getElementById("time").removeAttribute("disabled")
    displayHours()
    document.getElementById("time").innerHTML = '<option value=""></option>'
})
document.getElementById("time").addEventListener("change", () => {
    document.getElementById("gender").removeAttribute("disabled")
})



days.forEach(el =>{
    console.log(el.id)
    el.addEventListener('click', function() {
        getData(el.id)   
    })
})


async function getData(day){
    const data = await fetch('http://localhost:4000/getData');
    const table = await data.json();
    const tableArray = table.day;

    tableArray.forEach(el => {
        if (el.day == day){
            createTable(el.data.rows, day)
        }
    })
}

function createTable(data, day){
    const tableDiv = document.querySelector("#table")
    let tableStr = `<h1 id="workday">${day}</h1>
                    <table id="hoursservice">
                    <tr>
                        <th>hours</th>
                        <th>bob</th>
                        <th>john</th>
                        <th>joey</th>
                        <th>phil</th>
                    </tr>
                    `

    data.forEach(e => {
        let tableData = `<tr>
            <td>${e.hours}</td>
            <td>${e.bob}</td>
            <td>${e.john}</td>
            <td>${e.joey}</td>
            <td>${e.phil}</td>
            </tr>`
        
            tableStr+= tableData;
        }
        )
        tableStr += '</table>'
        tableDiv.innerHTML = ""
        tableDiv.innerHTML += tableStr
        document.querySelector('#dataBase').appendChild(tableDiv);
}

getData('monday')

document.querySelector("#gender").addEventListener('change', ()=>{
    if (document.querySelector("#gender").value == 'male'){
        document.querySelector('#woman').classList.remove("active")
        document.querySelector('#woman').classList.add('inactive')
        document.querySelector('#man').classList.remove("inactive")
        document.querySelector('#man').classList.add('active')
    }else {
        document.querySelector('#man').classList.remove("active")
        document.querySelector('#man').classList.add('inactive')
        document.querySelector('#woman').classList.remove("inactive")
        document.querySelector('#woman').classList.add('active')
    }
})


async function displayHours(){
    const data = await fetch('http://localhost:4000/getData')
    const dataBase = await data.json()
    const barber = document.getElementById("barb").value
    const day = document.getElementById("workday").value
    let freeHours = [];

    console.log(dataBase.day)

    dataBase.day.forEach( e => {
        if(e.day == day){
            e.data.rows.forEach(element => {
                if(element[barber] == "✔"){
                    freeHours.push(element.hours)
                }
            })
        }
    })
    console.log(freeHours)
    displayAvilableHours(freeHours)
    freeHours = [];
}



function displayAvilableHours(hoursArr){
    hoursArr.forEach(el=>{
        let hourOption = document.createElement("option");
        hourOption.innerHTML = el;
        document.getElementById("time").appendChild(hourOption)
    })
}