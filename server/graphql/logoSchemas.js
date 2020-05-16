var GraphQLSchema = require('graphql').GraphQLSchema;
var GraphQLObjectType = require('graphql').GraphQLObjectType;
var GraphQLList = require('graphql').GraphQLList;
var GraphQLObjectType = require('graphql').GraphQLObjectType;
var GraphQLNonNull = require('graphql').GraphQLNonNull;
var GraphQLID = require('graphql').GraphQLID;
var GraphQLString = require('graphql').GraphQLString;
var GraphQLInt = require('graphql').GraphQLInt;
var GraphQLDate = require('graphql-date');
var LogoModel = require('../models/Logo');

var logoType = new GraphQLObjectType({
    name: 'logo',
    fields: function () {
        return {
            _id: {
                type: GraphQLString
            },
            title: {
                type: GraphQLString
            },
            color: {
                type: GraphQLString
            },
            fontSize: {
                type: GraphQLInt
            },
            backgroundColor: {
                type: GraphQLString
            },
            borderColor: {
                type: GraphQLString
            },
            borderWidth: {
                type: GraphQLInt
            },
            borderRadius: {
                type: GraphQLInt
            },
            padding: {
                type: GraphQLInt
            },
            margin: {
                type: GraphQLInt
            },
            lastUpdate: {
                type: GraphQLDate
            },
            width: {
                type: GraphQLInt
            },
            height: {
                type: GraphQLInt
            }
        }
    }
});

var queryType = new GraphQLObjectType({
    name: 'Query',
    fields: function () {
        return {
            logos: {
                type: new GraphQLList(logoType),
                resolve: function () {
                    const logos = LogoModel.find().exec()
                    if (!logos) {
                        throw new Error('Error')
                    }
                    return logos
                }
            },
            logo: {
                type: logoType,
                args: {
                    id: {
                        name: '_id',
                        type: GraphQLString
                    }
                },
                resolve: function (root, params) {
                    const logoDetails = LogoModel.findById(params.id).exec()
                    if (!logoDetails) {
                        throw new Error('Error')
                    }
                    return logoDetails
                }
            },
            getLogoByTitle: {
                type: new GraphQLList(logoType),
                args: {
                    title: {
                        name: 'title',
                        type: GraphQLString
                    }
                },
                resolve: function(root, params){
                    const logos = LogoModel.find({title: params.title}).exec();
                    if (!logos) {
                        throw new Error('Error');
                    }
                    return logos;
                }
            },
            getLogosByTitleContains: {
                type: new GraphQLList(logoType),
                args: {
                    title: {
                        name: 'title',
                        type: GraphQLString
                    }
                },
                resolve: function(root, params){
                    const logos = LogoModel.find({title: {$regex: params.title, $options: 'i'}}).exec();
                    if (!logos) {
                        throw new Error('Error');
                    }
                    return logos;
                }
            }
        }
    }
});

var mutation = new GraphQLObjectType({
    name: 'Mutation',
    fields: function () {
        return {
            addLogo: {
                type: logoType,
                args: {
                    title: {
                        type: new GraphQLNonNull(GraphQLString)
                    },
                    color: {
                        type: new GraphQLNonNull(GraphQLString)
                    },
                    fontSize: {
                        type: new GraphQLNonNull(GraphQLInt)
                    },
                    backgroundColor: {
                        type: new GraphQLNonNull(GraphQLString)
                    },
                    borderColor: {
                        type: new GraphQLNonNull(GraphQLString)
                    },
                    borderWidth: {
                        type: new GraphQLNonNull(GraphQLInt)
                    },
                    borderRadius: {
                        type: new GraphQLNonNull(GraphQLInt)
                    },
                    padding: {
                        type: new GraphQLNonNull(GraphQLInt)
                    },
                    margin: {
                        type: new GraphQLNonNull(GraphQLInt)
                    },
                    width: {
                        type: new GraphQLNonNull(GraphQLInt)
                    },
                    height: {
                        type: new GraphQLNonNull(GraphQLInt)
                    }
                },
                resolve: function (root, params) {
                    const logoModel = new LogoModel(params);
                    const newLogo = logoModel.save();
                    if (!newLogo) {
                        throw new Error('Error');
                    }
                    return newLogo
                }
            },
            updateLogo: {
                type: logoType,
                args: {
                    id: {
                        name: 'id',
                        type: new GraphQLNonNull(GraphQLString)
                    },
                    title: {
                        type: new GraphQLNonNull(GraphQLString)
                    },
                    color: {
                        type: new GraphQLNonNull(GraphQLString)
                    },
                    fontSize: {
                        type: new GraphQLNonNull(GraphQLInt)
                    },
                    backgroundColor: {
                        type: new GraphQLNonNull(GraphQLString)
                    },
                    borderColor: {
                        type: new GraphQLNonNull(GraphQLString)
                    },
                    borderWidth: {
                        type: new GraphQLNonNull(GraphQLInt)
                    },
                    borderRadius: {
                        type: new GraphQLNonNull(GraphQLInt)
                    },
                    padding: {
                        type: new GraphQLNonNull(GraphQLInt)
                    },
                    margin: {
                        type: new GraphQLNonNull(GraphQLInt)
                    },
                    width: {
                        type: new GraphQLNonNull(GraphQLInt)
                    },
                    height: {
                        type: new GraphQLNonNull(GraphQLInt)
                    }
                },
                resolve(root, params) {
                    return LogoModel.findByIdAndUpdate(params.id,
                        { title: params.title, color: params.color, fontSize: params.fontSize,
                            backgroundColor : params.backgroundColor, borderColor : params.borderColor,
                            borderWidth: params.borderWidth, borderRadius: params.borderRadius,
                            padding: params.padding, margin: params.margin, lastUpdate: new Date(), width: params.width, height: params.height }, function (err) {
                        if (err) return next(err);
                    });
                }
            },
            removeLogo: {
                type: logoType,
                args: {
                    id: {
                        type: new GraphQLNonNull(GraphQLString)
                    }
                },
                resolve(root, params) {
                    const remLogo = LogoModel.findByIdAndRemove(params.id).exec();
                    if (!remLogo) {
                        throw new Error('Error')
                    }
                    return remLogo;
                }
            }
        }
    }
});

module.exports = new GraphQLSchema({ query: queryType, mutation: mutation });