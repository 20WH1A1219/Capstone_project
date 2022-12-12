const TelegramBot = require('node-telegram-bot-api');
const token = '5562335473:AAG5Qr_69vJEH-jUvKMDBnJmF8vr1XEMVqc';
const bot = new TelegramBot(token, {polling: true});

const { initializeApp, cert } = require('firebase-admin/app');
const { getFirestore} = require('firebase-admin/firestore');

var serviceAccount = require("./serviceAccountKey.json");

initializeApp({
  credential: cert(serviceAccount)
});
const db = getFirestore();

bot.on('message', function(mg){
    const msg = mg.text;
    const newMsg = msg.split(" ")
    if(newMsg[0]=='ENTER'){
      db.collection('StudentData').add({
        Name:newMsg[4],
        RollNo:newMsg[5],
        Branch:newMsg[6],
        userID:mg.from.id
    }).then(()=>{
      bot.sendMessage(mg.chat.id, "Welcome " + newMsg[4] + "\n" + newMsg[5] + " stored sucessfully ")
    })
  
    }
    else if(newMsg[0]=='GET'){
        bot.sendMessage(mg.chat.id,"The Students Data is : " + "\n")
        db.collection('StudentData').where('userID', '==', mg.from.id).get().then((docs)=>{
        docs.forEach((doc) => {
              bot.sendMessage(mg.chat.id, doc.data().Name + " " + doc.data().RollNo + " " + doc.data().Branch)
            });
      })
    }
    else{
      bot.sendMessage(mg.chat.id, "Please make sure you keeping in the message '\n GET -> get the data '\n ENTER -> To insert the data")
    }

})
