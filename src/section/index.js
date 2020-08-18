const mutationResolvers = require('./mutationResolvers')
const queryResolvers = require('./queryResolvers')
const { gql } = require('apollo-server-express')

const sectionTypeDefs = gql`
  input insertSectionInput {
    title: String!
    label: String!
    pos: Int!
    projectId: ID!
  }

  input updateSectionPosInput {
    sectionId: String!
    pos: Int!
  }

  input getProjectId {
    projectId: ID!
  }

  type Section {
    id: ID!
    title: String!
    label: String!
    pos: Int!
    description: String
    projectId: ID!
    cards: [Card]
  }

  extend type Query {
    getSections: [Section]
    getSectionsByProjectId(request: getProjectId): [Section]
  }

  extend type Mutation {
    insertSection(request: insertSectionInput): Section
    updateSectionPos(request: updateSectionPosInput): Section
    addInitialSections(request: getProjectId): [Section]
  }
`

const sectionResolvers = {
  Query: {
    ...queryResolvers,
  },
  Mutation: {
    ...mutationResolvers,
  },
}

module.exports = {
  sectionTypeDefs,
  sectionResolvers,
}
