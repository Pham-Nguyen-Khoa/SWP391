// CLIENT SEND MESSAGE
    const formSendData = document.querySelector(".inner-form");
    if(formSendData) {
        formSendData.addEventListener("submit", function(e) {
            e.preventDefault();
            const content = e.target.elements.content.value;
            if(content) {
                socket.emit("CLIENT-SEND-MESSAGE", content);
                e.target.elements.content.value = "";
            }

        })
    }


// CLIENT RECEIVE MESSAGE


// SERVER RETURN MESSAGE
socket.on("SERVER-RETURN-MESSAGE", (data) => {
    const chatBody = document.querySelector(".inner-body");
    const chatItem = document.createElement("div");
    const myID = document.querySelector(".chat").getAttribute("my-id");
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

    chatBody.appendChild(chatItem);
    chatBody.scrollTop = chatBody.scrollHeight;
});



// SCROLL TO BOTTOM
const chatBody = document.querySelector(".inner-body");
if(chatBody) {  
    chatBody.scrollTop = chatBody.scrollHeight;
}



// Emoji picker
document.querySelector('emoji-picker')

  .addEventListener('emoji-click', event => console.log(event.detail));


// .inner-incoming
//             .row
//                 .inner-avatar.mt-4.mr-3
//                     img(src=chat.infoUser.Avatar, alt="Avatar" style="width:50px;height:50px;border-radius:50%;")
//                 .content
//                     .inner-name #{chat.infoUser.FullName}
//                     .inner-content(class=chat.infoUser.RoleID === 'RL0001' ? 'admin-message' : '')
//                         p  #{chat.Content}