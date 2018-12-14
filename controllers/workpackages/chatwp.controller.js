
const WPChatModel = require('../../models/chat/wpchat')

exports.save = async function (req, res, err) {

    let chat = new WPChatModel(req.body);

    chat.save(function(err){
        if(err) {
            console.log(err);
            return res.status(500).send(err);
        }

        return res.status(200).send();
    })

}

exports.getChat = async function (req, res, err){

    WPChatModel.find({wp:req.params.id}).populate('user').populate('wp').exec(function(err,chat){

        if(err) return res.status(500).send(err);
        
        return res.status(200).json(chat);

    })


}

