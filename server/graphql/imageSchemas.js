var GraphQLSchema = require('graphql').GraphQLSchema;
var GraphQLObjectType = require('graphql').GraphQLObjectType;
var GraphQLList = require('graphql').GraphQLList;
var GraphQLObjectType = require('graphql').GraphQLObjectType;
var GraphQLNonNull = require('graphql').GraphQLNonNull;
var GraphQLID = require('graphql').GraphQLID;
var GraphQLString = require('graphql').GraphQLString;
var GraphQLInt = require('graphql').GraphQLInt;
var GraphQLDate = require('graphql-date');
var ImageModel = require('../models/Image');


var imageType = new GraphQLObjectType({
    name: 'image',
    fields: function() {
        return {
            _id: {
                type: GraphQLString
            },
            logoId: {
                type: GraphQLString
            },
            url: {
                type: GraphQLString
            }
        }
    }
});

var queryType = new GraphQLObjectType({
    name: 'Query',
    fields: function() {
        return {
            images: {
                type: GraphQLList(imageType),
                resolve: function(){
                    const images = ImageModel.find().exec();
                    if (!images){
                        throw new Error('Error')
                    }
                    return images
                }
            },
            image: {
                type: imageType,
                args: {
                    id:{
                        name: '_id',
                        type: GraphQLString
                    }
                },
                resolve: function (root, params) {
                    const imageDetails = ImageModel.findById(params.id).exec();
                    if(!imageDetails){
                        throw new Error('Error')
                    }
                    return imageDetails
                }
            },
            getImageByLogo: {
                type: new GraphQLList(imageType),
                args: {
                    logoId: {
                        name: 'logoId',
                        type: GraphQLString
                    }
                },
                resolve: function(root,parmas){
                    const images = ImageModel.find({logoId: params.logoId}).exec();
                    if(!images){
                        throw new Error('Error')
                    }
                    return images;
                }
            }
        }
    }
});

var mutation = new GraphQLObjectType({
    name: 'Mutation',
    fields: function(){
        return{
            addImage: {
                type: imageType,
                args: {
                    logoId: {
                        type: new GraphQLNonNull(GraphQLString)
                    },
                    url: {
                        type: new GraphQLString
                    }
                },
                resolve: function (root, params) {
                    const ImageModel = new ImageModel(params)
                    const newImage = ImageModel.save();
                    if(!newImage){
                        throw new Error('Error');
                    }
                    return newImage
                }
            },
            removeImage: {
                type: imageType,
                args: {
                    id: {
                        type: new GraphQLNonNull(GraphQLString)
                    }
                },
                resolve(root, params) {
                    const remImage = ImageModel.findByIdAndRemove(params.id).exec();
                    if(!remImage){
                        throw new Error('Error')
                    }
                    return remImage;
                }
            }
        }
    }
})

module.exports = new GraphQLSchema({ query: queryType, mutation: mutation });