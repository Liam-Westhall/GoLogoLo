var GraphQLSchema = require('graphql').GraphQLSchema;
var GraphQLObjectType = require('graphql').GraphQLObjectType;
var GraphQLList = require('graphql').GraphQLList;
var GraphQLObjectType = require('graphql').GraphQLObjectType;
var GraphQLNonNull = require('graphql').GraphQLNonNull;
var GraphQLID = require('graphql').GraphQLID;
var GraphQLString = require('graphql').GraphQLString;
var GraphQLInt = require('graphql').GraphQLInt;
var GraphQLDate = require('graphql-date');
var UserModel = require('../models/User');

var UserType = new GraphQLObjectType({
    name : 'user',
    fields: function()  {
        return{
            _id:{
                type: GraphQLString
            },
            email: {
                type: GraphQLString
            },
            password: {
                type: GraphQLString
            }
        }
    }
});

var queryType = new GraphQLObjectType({
    name: 'Query',
    fields: function() {
        return {
            users: {
                type: new GraphQLList(logoType),
                resolve: function () {
                    const users = UserModel.find().exec()
                    if (!users) {
                        throw new Error('Error')
                    }
                    return users
                }
            },
            getUserbyEmail: {
                type: userType,
                args: {
                    email:{
                        name: 'email',
                        type: GraphQLString
                    }
                },
                resolve: function(root, params) {
                    const userDetails = UserModel.find({email: params.email}).exec()
                    if (!users) {
                        throw new Error('Error');
                    }
                    return users;
                }
            },
            getUserByPassword: {
                type: New
            }
        }
    }
})