
const delaymodule = (req, res, next) => {
    setTimeout(()=> {

        if ( req.headers.authorization){
            const token = req.headers.authorization.split(' ')[1];
            //console.log(">>> check token:", token)
        }
        next()
    }, 100)
}

module.exports = delaymodule;