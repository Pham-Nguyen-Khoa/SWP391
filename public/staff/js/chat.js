import * as Popper from 'https://cdn.jsdelivr.net/npm/@popperjs/core@^2/dist/esm/index.js'
// CLIENT SEND MESSAGE
    const formSendData = document.querySelector(".inner-form");
    if(formSendData) {
        formSendData.addEventListener("submit", function(e) {
            e.preventDefault();
            const content = e.target.elements.content.value;
            if(content) {
                socket.emit("CLIENT-SEND-MESSAGE", content);
                e.target.elements.content.value = "";
                socket.emit("CLIENT-SEND-TYPING", "hidden");
            }

        })
    }


// CLIENT RECEIVE MESSAGE


// SERVER RETURN MESSAGE
socket.on("SERVER-RETURN-MESSAGE", (data) => {
    const chatBody = document.querySelector(".inner-body");
    const chatItem = document.createElement("div");
    const myID = document.querySelector(".chat").getAttribute("my-id");
    const listTyping = document.querySelector(".inner-list-typing");
    if(data.userID == myID) {
        chatItem.classList.add("inner-outgoing");
        chatItem.innerHTML = `
            <div class="row">
                <div class="inner-content ${data.roleID === 'RL0001' ? 'admin-message' : ''} ">
                    <p>${data.content}</p>
                </div>
            </div>
        `;
    } else {
        chatItem.classList.add("inner-incoming");
        chatItem.innerHTML = `
            <div class="row">
                <div class="inner-avatar mt-4 mr-3">
                    <img src="${data.avatar}" alt="${data.fullname}" style="width:50px;height:50px;border-radius:50%;">
                </div>
                <div class="content">
                    <div class="inner-name">${data.fullName}</div>
                    <div class="inner-content ${data.roleID === 'RL0001' ? 'admin-message' : ''}">
                        <p>${data.content}</p>
                    </div>
                </div>
        `;
    }

    chatBody.insertBefore(chatItem, listTyping);
    chatBody.scrollTop = chatBody.scrollHeight;
});



// SCROLL TO BOTTOM
const chatBody = document.querySelector(".inner-body");
if(chatBody) {  
    chatBody.scrollTop = chatBody.scrollHeight;
}



// Emoji picker
const buttonEmoji = document.querySelector(".button-emoji");
const tooltip = document.querySelector(".tooltip");
if(buttonEmoji && tooltip) {
    Popper.createPopper(buttonEmoji, tooltip) ;
    buttonEmoji.onclick = () => {
        tooltip.classList.toggle('shown')
    }   
}

var timeOut;
function showTyping(){
    socket.emit("CLIENT-SEND-TYPING", "show");
    clearTimeout(timeOut);
    timeOut = setTimeout(() => {
      socket.emit("CLIENT-SEND-TYPING", "hidden");
    }, 3000);
}
// Insert emoji input
    const emojiPicker = document.querySelector("emoji-picker");
    if(emojiPicker) {
        emojiPicker.addEventListener('emoji-click', event => {
            const inputMessage = document.querySelector("input[name='content']");
            if(inputMessage) {
                inputMessage.value += event.detail.unicode;
                showTyping();
            }
        })
    }


//End Insert emoji input
//End Emoji picker
//Typing
const inputTyping = document.querySelector("input[name='content']");

if (inputTyping) {
  inputTyping.addEventListener("keyup", function () {
    showTyping();
   
  });
}

    socket.on("SERVER-RETURN-TYPING", (data) => {
        const listTyping = document.querySelector(".inner-list-typing");
        if (data.type == "show") {
          const existTyping = listTyping.querySelector(`[user-id="${data.userID}"]`);
          if (!existTyping) {
            const boxTyping = document.createElement("div");
            boxTyping.classList.add("box-typing");
            boxTyping.setAttribute("user-id", data.userID);
            boxTyping.innerHTML = `
                      <div class="row">
                          <div class="inner-avatar mt-4 mr-3">
                              <img src="${data.avatar}" alt="${data.fullName}" style="width:50px;height:50px;border-radius:50%;">
                          </div>
                          <div class="content">
                              <div class="inner-name">${data.fullName}</div>
                              <div class="inner-content" style="padding: 20px 20px 0 0;">
                                  <div class="inner-dots">
                                      <span></span>
                                      <span></span>
                                      <span></span>
                                  </div>
                              </div>
                              `;
            listTyping.appendChild(boxTyping);
            chatBody.scrollTop = chatBody.scrollHeight;
          }
        }else{
            const boxTypingRemove = listTyping.querySelector(`[user-id="${data.userID}"]`);
            if(boxTypingRemove){
            listTyping.removeChild(boxTypingRemove);
          }
        }
      });
                    
    // End Typing