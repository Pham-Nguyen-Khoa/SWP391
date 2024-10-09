
// [Get] /staff/chat
module.exports.chat = (req, res) => {
    //- Socket IO
    console.log("------------------")
    io.on("connection", (socket) => {
        console.log("New user connected",socket.id);
    });
    console.log("------------------")

    //- End Socket IO

    res.render("staff/pages/chat/index",{
        pageTitle: "Trang chat "
    })
  }
    