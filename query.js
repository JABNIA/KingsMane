import pg from 'pg';
import Express from 'express';
import cors from 'cors'


const app = Express();
const PORT = 4000;
 
const corsOptions ={
    origin:'*', 
    credentials:true,
    optionSuccessStatus:200,
 }

const db = new pg.Client({
    user: 'postgres',
    host: 'localhost',
    database:'workdays',
    password: 'jabnia123',
    port: 5432,
}
)



app.use(cors(corsOptions))
db.connect()

const workHours = ['09:00', '09:30', '10:00', '10:30', '11:00', '11:30', '12:00',
'12:30', '13:00', '13:30', '14:00', '14:30', '15:00', '15:30',
'16:00', '16:30', '17:00', '17:30', '18:00', '18:30']


async function callBase(){
    let dataBase = [
        {
        day: 'monday',
        data: await db.query(`select * from monday order by id asc`)
        },
        {
        day: 'tuesday',
        data: await db.query("select * from tuesday order by id asc")
        },
        {
        day: 'wednesday',
        data: await db.query("select * from wednesday order by id asc")
        },
        {
        day: 'thursday',
        data: await db.query("select * from thursday order by id asc")
        },
        {
        day: 'friday',
        data: await db.query("select * from friday order by id asc")
        },
        {
        day: 'saturday',
        data: await db.query("select * from saturday order by id asc")
        }
    ]
    return dataBase
}






async function dateUpdate(day){
    let weekDayDate = await db.query(`SELECT date FROM ${day}`)
    let lastHourDate = weekDayDate.rows[weekDayDate.rows.length - 1]
    let checkDate = new Date(lastHourDate.date)
    let today = new Date();
    
    if (today > checkDate){
        let newDate = new Date(checkDate.setDate(checkDate.getDate() + 7))
        console.log(newDate.toDateString())
        workHours.forEach(async (e) => {
            await db.query(`UPDATE ${day} SET date = '${newDate.toDateString()}', bob='✔', john='✔', joey='✔', phil='✔' WHERE hours = '${e}'`)
        }
        )
    }
}       

setInterval(async ()=> {
    let dataBase = await callBase()
    dataBase.forEach(el => {
        dateUpdate(el.day)
    }
    )
}, 1000)




app.get('/getData', async (req, res) => {
    res.json({day: await callBase()})
})


app.listen(PORT, ()=>{
    console.log('api server is up')
})


// code for manual fixes in the base
// workHours.forEach(async (e) => {
//     await db.query(`UPDATE friday SET date = 'Fri Apr 5 2024', bob='✔', john='✔', joey='✔', phil='✔' WHERE hours = '${e}'`)
// }
// )
