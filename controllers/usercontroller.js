const user = require("../model/usermodel");
const bcrypt = require("bcrypt");

module.exports.register = async (req, res, next) => {
    try {
        const { username, email, password } = req.body;
        // const usernamecheck = await user.findOne({ username });
        // if (usernamecheck) {
        //     return res.json({ msg: "Username already used", status: false })
        // }
        // const emailcheck = await user.findOne({ email });
        // if (emailcheck) {
        //     return res.json({ msg: "Email already used", status: false });
        // }
        const hashedpassword = await bcrypt.hash(password, 10);
        const collection = await user.create({
            username,
            email,
            password: hashedpassword
        })
        delete collection.password;
        return res.json({ status: true, collection })
    }
    catch (ex) {
        next(ex);
    }
}

module.exports.login = async (req, res, next) => {
    try {
        const { username, password } = req.body;
        const User = await user.findOne({ username });
        if (!User) {
            return res.json({ msg: "incorrect username or password", status: false })
        }
        const ispassword = await bcrypt.compare(password, User.password)
        if (!ispassword) {
            return res.json({ msg: "incorrect username or password", status: false });
        }
        delete User.password;

        return res.json({ status: true, User })
    }
    catch (ex) {
        next(ex);
    }
}

module.exports.getallusers = async (req, res, next) => {
    try {
        const { searchcontact } = req.body;
        const users = await user.findOne({ username: searchcontact })
        res.json(users);
    } catch (ex) {
        next(ex);
    }
}

module.exports.adduser = async (req, res, next) => {
    try {
        const { currentuser, contacttobeadded } = req.body;
        const curruser = await user.findOne({ username: currentuser });
        // const otheruser = await user.findOne({username:c});
        // let curruser = {username:currentuser};
        let array = curruser.addedContacts;
        let present = array.find((x) => x.username == contacttobeadded.username)
        if (present != undefined) return (res.json("error"));
        else {
            let add = [...array];
            add.reverse();
            add.push({ _id: contacttobeadded._id, username: contacttobeadded.username })
            add.reverse();

            var unique = [...new Set(add)]
            // console.log(unique)
            let updatedcontacts = { $set: { addedContacts: unique } };
            await user.updateOne(curruser, updatedcontacts)
            res.json(curruser.addedContacts)
        }
    } catch (ex) {
        next(ex);
    }
}

module.exports.showuser = async (req, res, next) => {
    try {
        const { currentuser } = req.body;
        const users = await user.findOne({ username: currentuser })
        res.json(users);
        // console.log(users)
    } catch (ex) {
        next(ex);
    }
}
module.exports.showcurrentuser = async (req, res, next) => {
    try {
        const { currentuser } = req.body;
        const users = await user.findOne({ username: currentuser })
        res.json(users);
        // console.log(currentuser)
    } catch (ex) {
        next(ex);
    }
}