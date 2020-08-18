const mutationResolvers = require('./mutationResolvers')
const queryResolvers = require('./queryResolvers')
const { gql } = require('apollo-server-express')

const projectTypeDefs = gql`
  input insertProjectInput {
    title: String!
  }
  
  type Project {
    id: ID!
    title: String!
    sections: [Section]
  }

  extend type Query {
    getProjects: [Project]
  }

  extend type Mutation {
    insertProject(request: insertProjectInput): Project
  }
`

const projectResolvers = {
  Query: {
    ...queryResolvers,
  },
  Mutation: {
    ...mutationResolvers,
  },
}

module.exports = {
  projectTypeDefs,
  projectResolvers,
}