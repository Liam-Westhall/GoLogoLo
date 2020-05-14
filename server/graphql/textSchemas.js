var GraphQLSchema = require('graphql').GraphQLSchema;
var GraphQLObjectType = require('graphql').GraphQLObjectType;
var GraphQLList = require('graphql').GraphQLList;
var GraphQLObjectType = require('graphql').GraphQLObjectType;
var GraphQLNonNull = require('graphql').GraphQLNonNull;
var GraphQLID = require('graphql').GraphQLID;
var GraphQLString = require('graphql').GraphQLString;
var GraphQLInt = require('graphql').GraphQLInt;
var GraphQLDate = require('graphql-date');
var TextModel = require('../models/Text');

var TextType = new GraphQLObjectType({
    name: 'text',
    fields: function() {
        return{
            _id: {
                type: GraphQLString
            },
            logoId:{
                type: GraphQLString
            },
            name: {
                type: GraphQLString
            },
            fontSize:{
                type: GraphQLInt
            },
            textColor: {
                type:GraphQLString
            }
        }
    }
});

var quertyType = new GraphQLObjectType({
    name: 'Query',
    fields: function(){
        return {
            texts: {
                type: new GraphQLList(TextType),
                resolve: function() {
                    const texts = TextModel.find().exec()
                    if (!texts) {
                        throw new Error('Error')
                    }
                    return texts
                }
            },
            text: TextType,
            args: {
                id: {
                    name: '_id',
                    type: GraphQLString
                }
            },
            resolve: function(root, params) {
                const textDetails = TextModel.findById(params.id).exec()
                if(!textDetails){
                    throw new Error('Error')
                }
                return textDetails
            },
            getTextbyLogo: {
                type: new GraphQLList(TextType),
                args: {
                    logoId: {
                        name: 'logoID',
                        type: GraphQLString
                    }
                },
                resolve: function(root, params){
                    const texts = TextModel.find({logoId: params.logoId}).exec();
                    if(!texts){
                        throw new Error('Error')
                    }
                    return texts;
                }
            }
        }
    }
})

var mutation = new GraphQLObjectType({
    name: 'Mutation',
    fields: function () {
        return {
            addText: {
                type: TextType,
                args: {
                    logoId: {
                        type: new GraphQLNonNull(GraphQLString)
                    },
                   name: {
                       type: new GraphQLNonNull(GraphQLString)
                   },
                   fontSize: {
                       type: new GraphQLNonNull(GraphQLInt)
                   },
                   textColor: {
                       type: new GraphQLNonNull(GraphQLString)
                   } 
                },
                resolve: function (root, params) {
                    const TextModel = new TextModel(params);
                    const newText = TextModel.save();
                    if(!newText){
                        throw new Error('Error')
                    }
                    return newText
                }
            },
            updateText: {
                type: TextType,
                args: {
                    id: {
                        name: 'id',
                        type: new GraphQLNonNull(GraphQLString)
                    },
                    logoId:{
                        name: 'logoId',
                        type: new GraphQLNonNull(GraphQLString)
                    },
                    name: {
                        type: new GraphQLNonNull(GraphQLString)
                    },
                    fontSize: {
                        type: new GraphQLNonNull(GraphQLInt)
                    },
                    textColor: {
                        type: new GraphQLNonNull(GraphQLString)
                    }
                },
                resolve(root, params) {
                    return TextModel.findByIdAndUpdate(params.id,
                        {logoId: params.logoId, name: params.name, fontSize: params.fontSize, textColor: params.textColor}, function (err) {
                            if (err) return next(err);
                        });
                }
            },
            removeText: {
                type: TextType,
                args: {
                    id: {
                        type: new GraphQLNonNull(GraphQLString)
                    }
                },
                resolve(root, params) {
                    const remText = TextModel.findByIdAndRemove(params.id).exec();
                    if(!remText){
                        throw new Error('Error')
                    }
                    return remText;
                }
            }
        }
    }
})

module.exports = new GraphQLSchema({ query: queryType, mutation: mutation });