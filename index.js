import { initializeApp } from "https://www.gstatic.com/firebasejs/9.15.0/firebase-app.js"
import { getDatabase, ref, push, onValue, set } from "https://www.gstatic.com/firebasejs/9.15.0/firebase-database.js"

const appSettings = {
    databaseURL: "https://champions-9d314-default-rtdb.firebaseio.com/"
}

const app = initializeApp(appSettings)
const database = getDatabase(app)
const endorsementListInDB = ref(database, "endorsementList")

const publishBtnEl = document.getElementById("publish-btn")
const endorsementListEl = document.getElementById("endorsements-container")
const textAreaFieldEL = document.getElementById("endorsement-textarea-el")
const inputFieldFromEl = document.getElementById("from-input-el")
const inputFieldToEl = document.getElementById("to-input-el")

publishBtnEl.addEventListener("click",function addPublishBtnEl(event) {
    if (
        event.type === "click" 
    //    || (event.type === "keydown" && event.key === "Enter")
    ) {
        const textAreaFieldValue = textAreaFieldEL.value
        const inputFieldFromValue = inputFieldFromEl.value
        const inputFieldToValue = inputFieldToEl.value
        const dataItem = {
            message: textAreaFieldValue,
            from: inputFieldFromValue,
            to: inputFieldToValue,
            like: 0,
        }
        
        if (!textAreaFieldValue) {
            return
        }

        push(endorsementListInDB, dataItem)

        clearTextField()
    }
})
publishBtnEl.tabIndex = 0

function clearTextField() {
    textAreaFieldEL.value = ""
    inputFieldFromEl.value = ""
    inputFieldToEl.value = ""
}

onValue(endorsementListInDB, function(snapshot) {
    if (snapshot.exists()) {
        const itemsArray = Object.entries(snapshot.val())
    
        clearEndorsementListEl()
        
        for (let i = 0; i < itemsArray.length; i++) {
            let currentItem = itemsArray[i]
            let currentItemID = currentItem[0]
            let currentItemValue = currentItem[1]
            
            appendItemToEndorsementListEl(currentItem)
        }    
    } else {
        endorsementListEl.innerHTML = "<li class='no-items-yet'> Be the first to endorse! </li>"
    }
})

function clearEndorsementListEl() {
    endorsementListEl.innerHTML = ""
}

function appendItemToEndorsementListEl(item) {
    let itemID = item[0]
    let itemValue = item[1]
    let newEl = document.createElement("li");

  
    newEl.innerHTML = `
      <h3>To ${itemValue.to}</h3> 
      <p>${itemValue.message}</p>
         <div class="from-container">
            <h3>From ${itemValue.from}</h3>
            <div class="likes-counter">
                <button type="button" class="like-btn">🖤</button>
                <span class="count-likes" data-likes="${itemValue.like}">${itemValue.like}</span>
            </div>
        </div>
    `;
   
    const likeBtn = newEl.querySelector(".like-btn");
    const countLikes = newEl.querySelector(".count-likes");

   
    likeBtn.addEventListener("click",function (e)  {
        let currentLikes = parseInt(countLikes.dataset.likes);
        currentLikes++;
        countLikes.dataset.likes = currentLikes;
        let exactLocationOfItemDB = ref(database, `endorsementList/${itemID}/like`);

        set(exactLocationOfItemDB, currentLikes);
    });

    
    endorsementListEl.append(newEl)
}