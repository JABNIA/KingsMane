import express from "express";
import ejs from "ejs";
import axios from "axios";
import pg from "pg";
import nodemailer from 'nodemailer'

const app = express();
const PORT = 3000;

app.use(express.urlencoded({extended:true} ));
app.use(express.static("public"));

const db = new pg.Client({
    user: 'postgres',
    host: 'localhost',
    database:'workdays',
    password: 'jabnia123',
    port: 5432
})

db.connect()
const content = [
    {
        text: "At our establishment, we pride ourselves on offering top-notch grooming services for both men and women. Our skilled barbers and stylists are dedicated to creating tailored experiences that cater to the unique needs of every client. For the gentlemen, indulge in precision haircuts, classic shaves, and beard grooming, ensuring you leave looking and feeling your best. Ladies, immerse yourself in a world of pampering with our range of stylish haircuts, rejuvenating treatments, and expert styling. Our commitment to quality and customer satisfaction makes us the go-to destination for all your grooming needs.",
        float: "float: right;",
        imgUrl:"/assets/images/barber1.jpeg"
    },

    {
        text: "Discover the ultimate fusion of tradition and trend at our barbershop, where we redefine grooming for both men and women. Our expert barbers and stylists are passionate about delivering personalized services that elevate your sense of style. For our male clientele, experience the artistry of classic barbering with meticulous haircuts, precise beard trims, and refreshing hot towel shaves. Meanwhile, our female clients can indulge in transformative haircuts, luxurious coloring, and rejuvenating treatments. Our goal is to create a welcoming and inclusive space, ensuring every client leaves not only looking fantastic but also with a renewed sense of confidence.",
        float: "float: left;",
        imgUrl:"/assets/images/barber2.jpg"
    },
    {
        text: "Step into a world of sophistication and refinement at our barbershop, where we offer an array of grooming services designed for both men and women. Our skilled team of barbers and stylists is committed to delivering an unparalleled experience, blending the timeless traditions of barbering with the latest trends in hair and beauty. Gentlemen can enjoy the precision of classic haircuts, hot lather shaves, and beard sculpting that embodies timeless masculinity. For the ladies, our expert stylists bring creativity to life through personalized haircuts, coloring, and styling, ensuring each client leaves with a look that reflects their individuality. Embrace the artistry of grooming in an atmosphere that exudes style and sophistication.",
        float: "float: right;",
        imgUrl:"/assets/images/barber3.jpg"
    }
]
const mensServices = [
    { service: "Haircut", price: 30 },
    { service: "Beard Trim", price: 15 },
    { service: "Shave", price: 20 },
    { service: "Hair Color", price: 40 },
    { service: "Manicure", price: 20 },
    { service: "Pedicure", price: 25 },
    { service: "Facial", price: 35 },
    { service: "Waxing", price: 15 },
    { service: "Massage", price: 50 },
    { service: "Grooming Package", price: 70 },
  ];
  
  const womensServices = [
    { service: "Haircut", price: 50 },
    { service: "Hair Color", price: 80 },
    { service: "Blowout", price: 35 },
    { service: "Highlights", price: 90 },
    { service: "Updo", price: 60 },
    { service: "Extensions", price: 120 },
    { service: "Braiding", price: 40 },
    { service: "Perm", price: 70 },
    { service: "Smoothing Treatment", price: 100 },
    { service: "Manicure", price: 25 },
    { service: "Pedicure", price: 35 },
    { service: "Makeup Application", price: 45 },
  ];
  
    const workHours = ['09:00', '09:30', '10:00', '10:30', '11:00', '11:30', '12:00',
                       '12:30', '13:00', '13:30', '14:00', '14:30', '15:00', '15:30',
                       '16:00', '16:30', '17:00', '17:30', '18:00', '18:30']
                       
    const weekDays = ['monday', 'tuesday', 'wednesday', 'thursday', 'friday', 'saturday'];

    const symbolsAndNumbers = ['A', 'B', 'C', 'D', 'E', 'F', 'G', 'H', 'I', 'J', 'K',
                              'L', 'M', 'N', 'O', 'P', 'Q', 'R', 'S', 'T', 'U', 'V',
                              'W', 'X', 'Y', 'Z', '0', '1', '2', '3', '4', '5', '6', '7', '8', '9']



async function dateUpdate(day){
    let weekDayDate = await db.query(`SELECT date FROM ${day}`)
    let lastHourDate = weekDayDate.rows[weekDayDate.rows.length - 1]
    let checkDate = new Date(lastHourDate.date)
    let today = new Date()
    if (today < checkDate){
        let newDate = new Date(checkDate.setDate(checkDate.getDate() + 7))
        console.log(newDate.toDateString())
        workHours.forEach(async (e) => {
            await db.query(`UPDATE ${day} SET date = '${newDate.toDateString()}', set bob='✔', john='✔', joey='✔', phil='✔' WHERE hours = '${e}'`)
        }
        )
    }
}       

function codeGenerator(){
    let code = '';

    for (let i = 0; i < 5; i++){
        code += symbolsAndNumbers[Math.floor(Math.random()*symbolsAndNumbers.length)]
    }
    return code;
}



app.get("/", async (req, res) => {    
    res.render('index.ejs', {
        content: content
    })
})


app.get("/service", async (req, res) => {    
    res.render('service.ejs', {
        man: mensServices,
        women: womensServices,
    })
})


app.get("/aboutus", async (req, res) => {    
    res.render('aboutus.ejs', {
        content: content,
    })
})


app.get("/booking", async (req, res) => {     
    res.render('booking.ejs', {
        day: weekDays,
        hours: workHours,
        man: mensServices,
        women: womensServices,
        code: "",
    })
})


app.get("/contact", async (req, res) => {     
    res.render('contact.ejs')
})


app.post("/booking", async (req, res) => {
    let day = req.body.day
    let hour = req.body.hour;
    let barber = req.body.barber;
    let customer = req.body.name;
    let services = req.body.service;
    
    let startTime = workHours.indexOf(hour);
    let endTimeIndex = startTime + services.length;
   
    if(Array.isArray(services)){
        for(let i=startTime; i < endTimeIndex; i++){
            db.query(`UPDATE ${day} SET ${barber} = '${customer}' WHERE hours = '${workHours[i]}'`)
        }
    }else{
        db.query(`UPDATE ${day} SET ${barber} = '${customer}' WHERE hours = '${hour}'`)
    }

    res.render('booking.ejs', {
        day: weekDays,
        hours: workHours,
        man: mensServices,
        women: womensServices,
        code: codeGenerator()
    })
})


app.listen(PORT, function(){
    console.log("Server is up")
})
