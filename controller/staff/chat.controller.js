const Chat = require("../../models/chat.model");
const { Op } = require("sequelize");
const md5 = require("md5");
const Sequelize = require("../../config/database");
const { query } = require("express");
const db = require("../../config/database");
const Account = require("../../models/account1.model");
const Admin = require("../../models/admin.model");
const Staff = require("../../models/staff.model");
const Vet = require("../../models/vet.model");
const uploadToCloudinaryHelper = require("../../helpers/uploadToClloudinary");



const generateUserId = async (rolePrefix, table, id) => {
    const query = `SELECT MAX(CAST(SUBSTRING(${id}, LENGTH('${rolePrefix}') + 1) AS UNSIGNED)) AS maxId FROM ${table} WHERE ${id} LIKE '${rolePrefix}%'`;
    const [results] = await db.query(query);
    const maxId = results[0].maxId || 0;
    const newId = maxId + 1;
    return `${rolePrefix}${String(newId).padStart(4, "0")}`;
  };

// [Get] /chat
module.exports.chat = async (req, res) => {
    //- Socket IO
    const fullName = res.locals.user.FullName
    const avatar = res.locals.user.Avatar
    const userID = res.locals.user.AccountID
    const roleID = res.locals.user.RoleID
    io.once("connection", async (socket) => {
        socket.on("CLIENT-SEND-MESSAGE", async (data) => {
            const chatID = await generateUserId("CHAT", "chat", "ChatID");
            let images = []
            for(const image of data.images){
                const link = await uploadToCloudinaryHelper.uploadToCloudinary(image)
                images.push(link)
            }
            // Lưu vào database
            await Chat.create({
                ChatID: chatID,
                Content: data.content,
                User_ID: res.locals.user.AccountID,
                Images: JSON.stringify(images)
            })
            //Gửi về client
            io.emit("SERVER-RETURN-MESSAGE", {
                content: data.content,
                fullName: fullName,
                avatar: avatar,
                userID: userID,
                roleID: roleID,
                Images: images
            })
        })

       // Typing
       socket.on("CLIENT-SEND-TYPING", async (type) => {
        console.log(type)
        socket.broadcast.emit("SERVER-RETURN-TYPING", {
            fullName: fullName,
            avatar: avatar,
            userID: userID,
            type: type
        })
    })
    // End Typing


    });
    //- End Socket IO

    //Lấy data từ Database
    let chats = await Chat.findAll({
        raw: true,
    });
    chats.forEach(chat => {
        if(chat.Images != null){
            try {
                chat.Images = JSON.parse(JSON.parse(chat.Images));
                console.log(chat.Images); // Kiểm tra giá trị sau khi parse
            } catch (error) {
                console.error("Error parsing JSON:", error);
            }
        }
    })
    for(let chat of chats){
        let accountId = chat.User_ID
        let account = await Account.findOne({
            raw: true,
            where: {
                AccountID: accountId
            }
        })
        if(account.RoleID == "RL0001"){
            let admin = await Admin.findOne({
                raw: true,
                attributes: ["FullName","Avatar"],
                where: {
                    AccountID: accountId
                }
            })
            chat.infoUser = admin
            chat.infoUser.RoleID = "RL0001"
        }else if(account.RoleID == "RL0003"){
            let staff = await Staff.findOne({
                raw: true,
                attributes: ["FullName","Avatar"],
                where: {
                    AccountID: accountId
                }
            })
            chat.infoUser = staff
            chat.infoUser.RoleID = "RL0003"
        }else if(account.RoleID == "RL0002"){
            let vet = await Vet.findOne({
                raw: true,
                attributes: ["FullName","Avatar"],
                where: {
                    AccountID: accountId
                }
            })
            chat.infoUser = vet
            chat.infoUser.RoleID = "RL0002"
        }
    }
    // console.log(chats)  
    res.render("staff/pages/chat/index",{
        pageTitle: "Trang chat ",
        chats: chats
    })
  }
    