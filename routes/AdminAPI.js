'use strict';

var express = require('express');
var router = express.Router();

var AdminProfile = require('./../models/AdminProfileModel.js');
var UserProfile = require('./../models/UserProfileModel.js');
var UserAccess = require('./../models/UserModel.js');

var User = UserAccess.User;
var UserRole = UserAccess.UserRole;

// get all admin
router.get('/', function (req, res) {
    
    AdminProfile.forge()
    .fetchAll({ withRelated: ['userProfile'] })
    .then(function (adminProfile) {
        res.json(adminProfile.toJSON());
    })
    .catch(function (error) {
        res.status(500).json({ error: true, data: { message: error.message } });
    });
});

// create a new admin and insert into the database
router.post('/', function (req, res) {
    UserProfile.forge({
        first_name: req.body.first_name,
        middle_name: req.body.middle_name,
        last_name: req.body.last_name,
        date_of_birth: req.body.date_of_birth,
        post_code: req.body.post_code,
        house_number: req.body.house_number,
        address_line_1: req.body.address_line_1,
        address_line_2: req.body.address_line_2,
        phone_number: req.body.phone_number,
        email: req.body.email,
        id_role: req.body.id_role
    })
    .save(null, { method: 'insert' })
    .then(function (userProfile) {
        
        AdminProfile.forge({ id_user_profile: userProfile.get('id_user_profile') })
        .save(null, { method: 'insert' })
        .then(function (adminProfile) {
            res.json({
                responseTitle: 'A new record insertion into the database',
                responseStatus: 'success',
                responseBody: adminProfile.toJSON()
            });
        })
        .catch(function (error) {
            res.status(500).json({ error: true, data: { message: error.message } });
        });
    })
    .catch(function (error) {
        res.status(500).json({ error: true, data: { message: error.message } });
    });
});

router.put('/:id_admin', function (req, res) {
    AdminProfile.forge({ id_admin: req.params.id_admin })
    .fetch({ withRelated: ['userProfile'], debug: true })
    .then(function (adminProfile) {
        adminProfile.related('userProfile')
        .save({
            first_name: req.body.first_name,
            middle_name: req.body.middle_name,
            last_name: req.body.last_name,
            date_of_birth: req.body.date_of_birth,
            post_code: req.body.post_code,
            house_number: req.body.house_number,
            address_line_1: req.body.address_line_1,
            address_line_2: req.body.address_line_2,
            phone_number: req.body.phone_number,
            email: req.body.email
        })
        .then(function (updatedAdminProfile) {
            res.json({
                responseTitle: 'Updating the record',
                responseStatus: 'success',
                responseBody: updatedAdminProfile.toJSON()
            });
        })
        .catch(function (error) {
            console.log(error);
            //res.status(500).json({ error: true, data: { message: error.message } });
        });
    })
    .catch(function (error) {
        res.status(500).json({ error: true, data: { message: error.message } });
    });
});

router.delete('/:id_admin', function (req, res) {
    AdminProfile.forge({ id_admin: req.params.id_admin })
    .fetch({ require: true })
    .then(function (adminProfile) {
        //res.json(adminProfile.toJSON());

        adminProfile.load(['userProfile', 'userProfile.userRole', 'userProfile.userRole.user'])
        .then(function (adminWithUserProfile) {
            //var adminProfile = adminWithUserProfile;
            //var userProfile = adminWithUserProfile.related('userProfile');
            //var userRole = userProfile.related('userRole');
            //var user = userRole.related('user');
            
            adminWithUserProfile.destroy()
            .then(function (userProfile) {
                userProfile.related('userProfile').destroy()
                .then(function (userRole) {
                    userRole.related('userRole').destroy()
                    .then(function (user) {
                        user.related('user').destroy()
                        .then(function (result) {
                            res.json({
                                responseTitle: 'Removing the record from the database',
                                responseStatus: 'success',
                                responseBody: result.toJSON()
                            });
                        });
                    });
                });
            });
        });
    })
    .catch(function (error) {
        res.status(500).json({ error: true, data: { message: error.message } });
    });
});

module.exports = router;