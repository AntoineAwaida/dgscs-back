const UserModel = require('../../models/user.js');
const GroupModel = require('../../models/group')
const WorkPackageModel = require('../../models/workpackage')


// Fonctions anciennes

exports.getUsersPrevious = async function (req, res) {
    UserModel.find().select({ 'password': false, '__v': false }).exec((err, users) => {
        if (err) return res.status(500).send(err);

        res.json(users);
    });
}

exports.getActiveUsersPrevious = async function (req, res) {
    UserModel.find({ $or: [{ status: 'admin' }, { status: 'active' }] }).select({ 'password': false, '__v': false }).exec((err, users) => {
        if (err) return res.status(500).send(err);

        res.json(users);
    });
}

exports.getPendingUsersPrevious = async function (req, res) {
    UserModel.find({ status: 'pending' }).select({ 'password': false, '__v': false }).exec((err, users) => {
        if (err) return res.status(500).send(err);

        res.json(users);
    });
}


// Fonctions en cours de traitement 


exports.getUser = async function (req, res) {
    UserModel.findById(req.params.id, function (err, user) {

        if (err) return res.status(500).send(err);

        res.json(user);

    })
}

exports.getFiles = async function (req, res) {
    if (!req.payload._id) {
        return res.status(401).json({ "status": 401, "message": "UnauthorizedError: private profile" })
    }
    try {
        const user = await UserModel.findById(req.params.userID, { select: "files" })
            .populate({ path: "files", populate: { path: "author", select: ["first_name", "last_name"] } });
        return res.status(200).send(user.files);
    } catch (e) {
        return res.status(500).json({ message: e.message });
    }
}

exports.deactivateUser = async function (req, res) {

    UserModel.findByIdAndUpdate(req.params.id, { status: 'inactive' }, function (err) {

        if (err) return res.status(500).send(err);

        return res.status(200).json("L'utilisateur a bien été désactivé.")
    })

}

exports.activateUser = async function (req, res) {

    UserModel.findByIdAndUpdate(req.params.id, { status: 'active' }, function (err) {

        if (err) return res.status(500).send(err);

        return res.status(200).json("L'utilisateur a bien été activé.")

    })

}

exports.getGroupsForUser = async function (req, res, err) {

    GroupModel.find({ members: req.params.id }, function (err, groups) {

        if (err) return res.status(500).send(err);

        return res.status(200).json(groups);

    })

}

exports.getWPForUser = async function (req, res, err) {

    GroupModel.find({ members: req.params.id }, async function (err, groups) {

        if (err) return res.status(500).send(err);

        let wp = [];


        groups.forEach((group) => {
            group.workpackages.forEach((workpackage) => wp.push(workpackage));
        })

        WorkPackageModel.find({ '_id': { $in: wp } }, function (err, wp) {

            if (err) return res.status(500).send(err);

            return res.status(200).json(wp);

        })

    })



}

exports.modifyFav = async function (req, res, err) {


    UserModel.findByIdAndUpdate(req.params.id, { favWorkPackages: req.body.favwp, favTasks: req.body.favtasks }, function (err) {

        if (err) return res.status(500).send(err);

        return res.status(200).json("Modif des favoris ok!")

    })

}

exports.modifyPassword = async function (req, res, err) {


    UserModel.findById(req.params.id, async function (err, user) {

        if (err) return res.status(500).send(err);

        user.password = req.body.password;


        try {


            user.save();

            return res.status(200).json("ok");

        }

        catch (e) {

            return res.status(500).send(e);

        }

    })

}

exports.getFavs = async function (req, res, err) {

    UserModel.findById(req.params.id, 'favTasks favWorkPackages').populate('favTasks').populate('favWorkPackages').exec(function (err, user) {

        if (err) return res.status(500).send(err);

        return res.status(200).json(user);

    })

}

// Fonctions avec permissions

exports.getUsers = async function (req, res) {
    try {

        // 1. On vérifie qu'il est bien admin
        try {
            const id = tokenID(req);
            await mustBeAdmin(id);
        } catch (e) {
            return res.status(401).send({ error: e.message })
        }

        // 2. On renvoie tous les users

        const users = await UserModel.find().select(["first_name", "last_name", "email", "status"]);
        return res.status(200).send(users);

    } catch (e) {
        return res.status(500).send({ error: e.message })
    }
}

exports.getActiveUsers = async function (req, res) {
    try {

        // 1. On vérifie qu'il est bien admin
        try {
            const id = tokenID(req);
            await mustBeAdmin(id);
        } catch (e) {
            return res.status(401).send({ error: e.message })
        }

        // 2. On renvoie tous les users actifs ("admin" + "active")

        const users = await UserModel.find({ $or: [{ status: 'admin' }, { status: 'active' }] }).select(["first_name", "last_name", "email"]);
        return res.status(200).send(users);

    } catch (e) {
        return res.status(500).send({ error: e.message })
    }
}

exports.getPendingUsers = async function (req, res) {
    try {

        // 1. On vérifie qu'il est bien admin
        try {
            const id = tokenID(req);
            await mustBeAdmin(id);
        } catch (e) {
            return res.status(401).send({ error: e.message })
        }

        // 2. On renvoie tous les users en attente (pending)

        const users = await UserModel.find({ status: 'pending' }).select(["first_name", "last_name", "email"]);
        return res.status(200).send(users);

    } catch (e) {
        return res.status(500).send({ error: e.message })
    }
}

exports.getMyGroups = async function (req, res) {
    try {
        const id = tokenID(req);

        // 1. On vérifie qu'il est bien 'actif' ou 'admin'
        try {
            const status = await getStatus(id);
            if (!((status == "active") || (status == "admin"))) {
                throw new Error("the user is not 'active' or 'admin'");
            }
        } catch (e) {
            return res.status(401).send({ error: e.message })
        }


        // 2. On renvoie tous les groupes du user

        const groups = await getGroups(id);
        return res.status(200).send(groups);

    } catch (e) {
        return res.status(500).send({ error: e.message })
    }
}


// Fonctions diverses

const getStatus = async function (userID) {
    try {
        return (await UserModel.findById(userID).select(["status"])).status;
    } catch (e) {
        throw new Error("getStatus error -> " + e.message);
    }
}

const getGroups = async function (userID) {
    try {
        const groups = await GroupModel.find({ members: userID }).select(["name"]);
        return groups;
    } catch (e) {
        throw new Error("getGroup error -> " + e.message);
    }  
}

const isAdmin = async function (userID) {
    try {
        const status = await getStatus(userID);
        return (status == "admin")
    } catch (e) {
        throw new Error("isAdmin error -> " + e.message);
    }
}

const tokenID = function (req) {
    if (req.payload) {
        return req.payload._id;
    }
    else {
        throw new Error("tokenID error -> req.payload._id n'existe pas");
    }
}

const mustBeAdmin = async function (userID) {
    try {
        if (!(await isAdmin(userID))) {
            throw new Error("the user is not admin");
        }
    } catch (e) {
        throw new Error("mustBeAdmin error -> " + e.message);
    }
} 