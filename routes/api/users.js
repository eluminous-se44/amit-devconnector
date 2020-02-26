const express = require('express');
const router = express.Router();
const gravatar = require('gravatar');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const keys = require('../../config/keys');
const passport = require('passport');
//Load user model
const User = require('../../models/User');

//route GET api/users/test
//@desc Test users route
//@access Public
router.get('/test',(req,res)=>res.json({msg:'User works'}));

//route GET api/users/register
//@desc Register user
//@access Public
router.post('/register',(req,res)=>{
    User.findOne({email:req.body.email})
    .then(user => {
        if(user){
            return res.status(400).json({email:'Email Already exists'});
        }else{

            const avatar = gravatar.url(req.body.email,{
                s: '200',
                r: 'pg',
                d: 'mm',
            });
            
            const newUser = new User({
                name:req.body.name,
                email:req.body.email,
                avatar:req.body.avatar,
                password:req.body.password,
                password2:req.body.password2,
            });
            // console.log(newUser);
            // return false;
            bcrypt.genSalt(10,(err,salt)=>{
                bcrypt.hash(newUser.password,salt,(err,hash) => {
                    if(err){ console.log(err) };
                    newUser.password = hash;
                    newUser.save()
                    .then(user=>res.json(user))
                    .catch(err=>console.log(err));
                })
            })
        }
    })

});

//route GET api/users/login
//@desc Register user
//@access Public
router.post('/login',(req,res)=>{
    const email = req.body.email;
    const password = req.body.password;

    //Find User
    User.findOne({email})
        .then(user=>{
            if(!user){
                return res.status(404).json({email:'User not found'});
            }

            //check password
            bcrypt.compare(password,user.password)
                    .then(isMatch=>{
                        if(isMatch){
                            //User Matched
                            const payload = { id:user.id,name:user.name,avatar:user.avatar}

                            //Sign Token
                            jwt.sign(
                                    payload,
                                    keys.secretOrKey,
                                    {expiresIn:3600},
                                    (err,token)=>{
                                        res.json({
                                            success: true,
                                            token: 'Bearer '+token
                                        });

                                    });
                            //res.json({msg:'Success'});
                        }else{
                            return res.status(404).json({email:'Password Incorrect'});
                            
                        }
                    })
        })
})

//route GET api/users/current
//@desc current user
//@access Private
router.get('/current',passport.authenticate('jwt',{'session':false}),(req,res)=>{
  //  res.json({msg:'success'});
  res.json({
      id: req.user.id,
      name:req.user.name,
      email:req.user.email,
  });

});

module.exports = router;