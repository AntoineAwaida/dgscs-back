
const TaskChatModel = require('../../models/chat/taskchat')

exports.save = async function (req, res, err) {

    let chat = new TaskChatModel(req.body);

    chat.save(function(err){
        if(err) {
            console.log(err);
            return res.status(500).send(err);
        }

        return res.status(200).send();
    })

}

exports.getChat = async function (req, res, err){

    TaskChatModel.find({task:req.params.id}).populate('user').populate('task').exec(function(err,chat){

        if(err) return res.status(500).send(err);
        
        return res.status(200).json(chat);

    })


}