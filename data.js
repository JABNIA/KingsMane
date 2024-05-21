import pg from 'pg';



const db = new pg.Client({
    user: 'postgres',
    host: 'localhost',
    database:'workdays',
    password: 'jabnia123',
    port: 5432
})
const date = new Date()
const stringDate = date.toDateString()

const workHours = ['09:00', '09:30', '10:00', '10:30', '11:00', '11:30', '12:00',
                       '12:30', '13:00', '13:30', '14:00', '14:30', '15:00', '15:30',
                       '16:00', '16:30', '17:00', '17:30', '18:00', '18:30']

db.connect()

console.log(stringDate)

workHours.forEach(e => {
    db.query(`INSERT INTO tuesday (date, hours, bob, john, joey, phil) VALUES ('${stringDate}','${e}', '✔', '✔', '✔', '✔')`)
})