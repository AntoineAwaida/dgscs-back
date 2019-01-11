const UserModel = require('../../models/user.js');
const GroupModel = require('../../models/group');
const WorkPackageModel = require('../../models/workpackage');
const TaskModel = require('../../models/task');

// 1. Fonctions pour admin

// GET 

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

// PUT

exports.desactivateUser = async function (req, res) {

    try {

        // 1. On vérifie qu'il est bien admin
        try {
            const id = tokenID(req);
            await mustBeAdmin(id);
        } catch (e) {
            return res.status(401).send({ error: e.message })
        }

        // 2. On désactive le user
        await UserModel.findByIdAndUpdate(req.params.id, { status: 'inactive' });
        return res.status(200).send({ message : "L'utilisateur a bien été désactivé"})

    }catch (e) {
        return res.status(500).send({ error: e.message })
    }
    
}

exports.activateUser = async function (req, res) {

    try {

        // 1. On vérifie qu'il est bien admin
        try {
            const id = tokenID(req);
            await mustBeAdmin(id);
        } catch (e) {
            return res.status(401).send({ error: e.message })
        }

        // 2. On active le user
        await UserModel.findByIdAndUpdate(req.params.id, { status: 'active' });
        return res.status(200).send({ message : "L'utilisateur a bien été activé"})

    }catch (e) {
        return res.status(500).send({ error: e.message })
    }
    
}


// 2. Fonctions pour un User 'active' ou 'admin'

// GET 

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

exports.getMyWorkpackages = async function (req, res) {
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


        // 2. On renvoie tous les workpackages du user

        const workpackages = await getWorkpackages(id);


        return res.status(200).send(workpackages);

    } catch (e) {
        return res.status(500).send({ error: e.message })
    }
}

exports.getMyTasks = async function (req, res) {
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


        // 2. On renvoie tous les tasks du user

        const tasks = await getTasks(id);


        return res.status(200).send(tasks);

    } catch (e) {
        return res.status(500).send({ error: e.message })
    }
}

exports.getMyFavs = async function (req, res) {
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


        // 2. On renvoie tous les favs du user

        const favs = await getFavs(id);


        return res.status(200).send(favs);

    } catch (e) {
        return res.status(500).send({ error: e.message })
    }
}

exports.getMyFiles = async function (req, res) {
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


        // 2. On renvoie tous les files du user

        const files = await getFiles(id);


        return res.status(200).send(files);

    } catch (e) {
        return res.status(500).send({ error: e.message })
    }
}
 
// PUT

exports.editMyPassword = async function (req, res) {
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

        // 2. On vérifie qu'il y a l'attribut req.body.password

        if(!req.body.password){
            throw new Error("L'attribut 'password' est manquant");
        }

        // 3. On change le password du user (on doit appeler user.save() pour le cryptage)

        let user = await UserModel.findById(id).select("password");
        user.password = req.body.password;
        await user.save();

        return res.status(200).send({ message : 'password bien modifié'});

    } catch (e) {
        return res.status(500).send({ error: e.message })
    }
  

  


}

exports.editMyFavs = async function (req, res) {
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

        // 2. On vérifie qu'il y a les bons attributs

        if((!req.body.favwp)||(!req.body.favtasks)){
            throw new Error("L'attribut 'favwp' ou 'favtasks' est manquant");
        }

        // 3. On change les favs du user

        await UserModel.findByIdAndUpdate(id, { favWorkPackages: req.body.favwp, favTasks: req.body.favtasks });

        return res.status(200).send({ message : 'favs bien modifiés'});

    } catch (e) {
        return res.status(500).send({ error: e.message })
    }
  




}


// 3. Fonctions diverses
 
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

const getWorkpackages = async function (userID) {
    try {
        const groups = await getGroups(userID);
        const workpackages = await WorkPackageModel.find({ groups : { $in : groups }}).select(["name", "description"])
        return workpackages;
    } catch (e) {
        throw new Error("getWorkpackages error -> " + e.message);
    }  
} 

const getTasks = async function (userID) {
    try {
        const groups = await getGroups(userID);
        const tasks = await TaskModel.find({ groups : { $in : groups }}).select(["name", "status", "author"]);
        return tasks;
    } catch (e) {
        throw new Error("getTasks error -> " + e.message);
    }  
} 

const getFavs = async function (userID) {
    try {
        const favs = await UserModel.findById(userID).select(["favTasks", "favWorkPackages"]).populate([{path : "favTasks", select : "name"}, {path : "favWorkPackages", select : "name"}]);
        return favs;
    } catch (e) {  
        throw new Error("getFavs error -> " + e.message);
    }  
} 

const getFiles = async function (userID) {
    try {
        const files = (await UserModel.findById(userID).select(["files"]).populate({ path: "files", select : "-__v", populate: { path: "author", select: ["first_name", "last_name"] } })).files;
        return files;
    } catch (e) {  
        throw new Error("getFiles error -> " + e.message);
    }  
} 

 
// Token et conditions sur le status

const tokenID = function (req) {
    if (req.payload) {
        return req.payload._id;
    }
    else {
        throw new Error("tokenID error -> req.payload._id n'existe pas");
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

const mustBeAdmin = async function (userID) {
    try {
        if (!(await isAdmin(userID))) {
            throw new Error("the user is not admin");
        }
    } catch (e) {
        throw new Error("mustBeAdmin error -> " + e.message);
    }
} 

exports.tokenID;