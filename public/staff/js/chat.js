import * as Popper from 'https://cdn.jsdelivr.net/npm/@popperjs/core@^2/dist/esm/index.js'
import { FileUploadWithPreview } from 'https://unpkg.com/file-upload-with-preview/dist/index.js';
const upload = new FileUploadWithPreview('my-unique-id',{
    maxFileCount: 6,
    maxFileSize: 10 * 1024 * 1024, // 10MB
    allowedFileTypes: ['image/*'],
    onFilesAdded: (files) => {
        console.log(files);
    },
    multiple: true,
});
// CLIENT SEND MESSAGE
    const formSendData = document.querySelector(".inner-form");
    if(formSendData) {
        formSendData.addEventListener("submit", function(e) {
            e.preventDefault();
            const content = e.target.elements.content.value;
            const images = upload.cachedFileArray;
            console.log(images);
            console.log("hello")
            if(content || images.length > 0) {
                socket.emit("CLIENT-SEND-MESSAGE", {content, images});
                e.target.elements.content.value = "";
                upload.resetPreviewPanel(); 
                socket.emit("CLIENT-SEND-TYPING", "hidden");
            }

        })
    }


// CLIENT RECEIVE MESSAGE


// SERVER RETURN MESSAGE
socket.on("SERVER-RETURN-MESSAGE", (data) => {
    console.log(data.Images)
    const chatBody = document.querySelector(".inner-body");
    const chatItem = document.createElement("div");
    const myID = document.querySelector(".chat").getAttribute("my-id");
    const listTyping = document.querySelector(".inner-list-typing");
    let imagesHTML = ``
    let contentHTML = ``
    if(data.Images.length > 0){
          imagesHTML = `<div class="inner-image">`
               for (const img of data.Images) {
                imagesHTML +=  `<img src="${img}" alt="Image">`
               }
                
                imagesHTML +=  `</div>`
    }
    if(data.content){
         contentHTML = `<div class="inner-content ${data.roleID === 'RL0001' ? 'admin-message' : ''} "> <p>${data.content}</p> </div>`
    }
    console.log(contentHTML)
    if(data.userID == myID) {
        chatItem.classList.add("inner-outgoing");
        chatItem.innerHTML = `
            <div class="row">
                <div class="content">
                    ${data.content ? contentHTML : ''}
                    ${data.Images.length > 0 ? imagesHTML : ''}
                </div>
            </div>
        `;
    } else {
        chatItem.classList.add("inner-incoming");
        let innerHtml = `
            <div class="row">
                <div class="inner-avatar mt-4 mr-3">
                    <img src="${data.avatar}" alt="${data.fullname}" style="width:50px;height:50px;border-radius:50%;">
                </div>
                <div class="content">
                    <div class="inner-name">${data.fullName}</div>`;
        
        if(data.content){
            innerHtml += contentHTML;
        }
        if(data.Images.length > 0){
            innerHtml += imagesHTML;
        }
        
        innerHtml += `
                </div>
            </div>
        `;
        
        chatItem.innerHTML = innerHtml;
    }
    // imagesHTML = `
    //         <div class="inner-image">`
    //            for (const img of data.Images) {
    //             imagesHTML +=  `<img src="${img}" alt="Image"> `
    //            }
                
    //             imagesHTML +=  `</div>`

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
                const end = inputMessage.value.length;
                inputMessage.setSelectionRange(end, end);
                inputMessage.focus();
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