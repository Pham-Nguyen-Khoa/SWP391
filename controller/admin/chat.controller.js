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
        socket.on("CLIENT-SEND-MESSAGE", async (content) => {
            const chatID = await generateUserId("CHAT", "chat", "ChatID");
            //Lưu vào database
            await Chat.create({
                ChatID: chatID,
                Content: content,
                User_ID: res.locals.user.AccountID
            })
            //Gửi về client
            io.emit("SERVER-RETURN-MESSAGE", {
                content: content,
                fullName: fullName,
                avatar: avatar,
                userID: userID,
                roleID: roleID
            })
        })
    });
    //- End Socket IO

    //Lấy data từ Database
    const chats = await Chat.findAll({
        raw: true,
    });
    for(const chat of chats){
        const accountId = chat.User_ID
        const account = await Account.findOne({
            raw: true,
            where: {
                AccountID: accountId
            }
        })
        if(account.RoleID == "RL0001"){
            const admin = await Admin.findOne({
                raw: true,
                attributes: ["FullName","Avatar"],
                where: {
                    AccountID: accountId
                }
            })
            chat.infoUser = admin
            chat.infoUser.RoleID = "RL0001"
        }else if(account.RoleID == "RL0003"){
            const staff = await Staff.findOne({
                raw: true,
                attributes: ["FullName","Avatar"],
                where: {
                    AccountID: accountId
                }
            })
            chat.infoUser = staff
            chat.infoUser.RoleID = "RL0003"
        }else if(account.RoleID == "RL0002"){
            const vet = await Vet.findOne({
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

    res.render("admin/pages/chat/index",{
        pageTitle: "Trang chat ",
        chats: chats
    })
  }
    