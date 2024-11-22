const e = require('express')
const User=require('../model/user')
const bcrypt=require('bcryptjs')

class UserController{

    async home(req,res){
        res.render('home',{
            title:"home page"
        })
    }

    async register(req,res){
        res.render('register',{
            title:"register page"
        })
    }

    async dashboard(req,res){
        try{
          const othersUser= await User.find({_id:{$nin:[req.session.user._id]}})
            res.render('dashboard',{
                title:"dashboard page",
                data:req.session.user,
                users:othersUser
            })

        }catch(error){
            console.log(error);
        }
        
    }

    async create(req,res){
        try{
           const {name,email,password}=req.body

           //const user=await User.findOne({email})

           const salt=await bcrypt.genSalt(10)
            const hashedpassword=await bcrypt.hash(password,salt)
            const user= new User({
                name,
                email,
                password:hashedpassword
            })
            const result=await user.save()

            if(result){
                //console.log('user',result);
                res.redirect('/login')
            }else{
                console.log('something wrang');               
                res.redirect('/register')
            }   
        }catch(error){
            console.log(error)

        }

    }


    async loginview(req,res){
        res.render('login',{
            title:"login page"
        })
    }

    async loginCreate(req,res){
        try{
           const {email,password}=req.body
            const user=await User.findOne({email})
            if(user){
                const validpassword=await bcrypt.compare(password,user.password)
                // console.log('ff',req.session.user=user);
                
                if(validpassword){
                    req.session.user=user
                    res.redirect('/dashboard')
                }else{
                    res.render('/login',{message:"invalid email or password"})
                }
            }else{
                res.redirect('/login')
            }
        }catch(error){
            console.log(error)
        }
    }

    async logout(req,res){
        req.session.destroy()
        res.redirect('/login')
    }


}


module.exports =new UserController();