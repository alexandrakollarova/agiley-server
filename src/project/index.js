const mutationResolvers = require("./mutationResolvers");
const queryResolvers = require("./queryResolvers");
const { gql } = require("apollo-server-express");

const projectTypeDefs = gql`
  input insertProjectInput {
    title: String!
  }

  input addSectionToProjectInput {
    id: ID!
    title: String!
    label: String!
    pos: Int!
  }
  
  type Project {
    id: ID!
    title: String!
    sections: [Section]
  }

  extend type Query {
    getProjects: [Project]
    getProjectById(id: ID!): Project
  }

  extend type Mutation {
    insertProject(request: insertProjectInput): Project
    addSectionToProject(request: addSectionToProjectInput): Project
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