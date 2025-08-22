const roleMidddleware = (roles)=>{

    return(req,res,next)=>{

        if(!roles.includes(req.user.role)){
            return res.status(403).json({Message : "Access denied"})
        }
        next()

    }

}
export default roleMidddleware;